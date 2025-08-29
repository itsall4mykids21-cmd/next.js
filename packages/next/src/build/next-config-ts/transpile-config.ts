import type { Options as SWCOptions } from '@swc/core'
import type { CompilerOptions } from 'typescript'

import semver from 'next/dist/compiled/semver'

import { join, resolve } from 'path'
import { readFile } from 'fs/promises'
import { register } from 'module'
import { pathToFileURL } from 'url'

import { deregisterHook, registerHook, requireFromString } from './require-hook'
import { warn } from '../output/log'
import { installDependencies } from '../../lib/install-dependencies'

export function resolveSWCOptions({
  cwd,
  compilerOptions,
  type,
}: {
  cwd: string
  compilerOptions: CompilerOptions
  type: 'commonjs' | 'es6'
}): SWCOptions {
  return {
    jsc: {
      parser: {
        syntax: 'typescript',
      },
      ...(compilerOptions.paths ? { paths: compilerOptions.paths } : {}),
      ...(compilerOptions.baseUrl
        ? // Needs to be an absolute path.
          { baseUrl: resolve(cwd, compilerOptions.baseUrl) }
        : compilerOptions.paths
          ? // If paths is given, baseUrl is required.
            { baseUrl: cwd }
          : {}),
      ...(type === 'es6'
        ? {
            experimental: {
              keepImportAssertions: true,
              // Without this option, "assert" assertion also transpiles to "with"
              // attribute, which will throw if Node.js version does not support
              // "with" token. The switch from "assert" to "with" was held at
              // v21.0.0, v20.10.0, and v18.20.0.
              // Add this option if current Node.js version < 20.10.0
              emitAssertForImportAttributes: semver.lt(
                process?.versions?.node ?? '20.9.0',
                '20.10.0'
              ),
            },
          }
        : {}),
    },
    module: {
      type,
    },
    env: {
      targets: {
        // Setting the Node.js version can reduce unnecessary code generation.
        node: process?.versions?.node ?? '20.9.0',
      },
    },
  } satisfies SWCOptions
}

// Ported from next/src/lib/verify-typescript-setup.ts
// Although this overlaps with the later `verifyTypeScriptSetup`,
// it is acceptable since the time difference in the worst case is trivial,
// as we are only preparing to install the dependencies once more.
async function verifyTypeScriptSetup(cwd: string, configFileName: string) {
  try {
    // Quick module check.
    require.resolve('typescript', { paths: [cwd] })
  } catch (error) {
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      error.code === 'MODULE_NOT_FOUND'
    ) {
      warn(
        `Installing TypeScript as it was not found while loading "${configFileName}".`
      )

      await installDependencies(cwd, [{ pkg: 'typescript' }], true).catch(
        (err) => {
          if (err && typeof err === 'object' && 'command' in err) {
            console.error(
              `Failed to install TypeScript, please install it manually to continue:\n` +
                (err as any).command +
                '\n'
            )
          }
          throw err
        }
      )
    }
  }
}

async function getTsConfig(cwd: string): Promise<CompilerOptions> {
  const ts: typeof import('typescript') = require(
    require.resolve('typescript', { paths: [cwd] })
  )

  // NOTE: This doesn't fully cover the edge case for setting
  // "typescript.tsconfigPath" in next config which is currently
  // a restriction.
  const tsConfigPath = ts.findConfigFile(
    cwd,
    ts.sys.fileExists,
    'tsconfig.json'
  )

  if (!tsConfigPath) {
    // It is ok to not return ts.getDefaultCompilerOptions() because
    // we are only looking for paths and baseUrl from tsConfig.
    return {}
  }

  const configFile = ts.readConfigFile(tsConfigPath, ts.sys.readFile)
  const parsedCommandLine = ts.parseJsonConfigFileContent(
    configFile.config,
    ts.sys,
    cwd
  )

  return parsedCommandLine.options
}

export async function transpileConfig({
  nextConfigPath,
  configFileName,
  cwd,
}: {
  nextConfigPath: string
  configFileName: string
  cwd: string
}) {
  try {
    // Ensure TypeScript is installed to use the API.
    await verifyTypeScriptSetup(cwd, configFileName)
    const compilerOptions = await getTsConfig(cwd)

    let pkgJson: Record<string, string> = {}
    try {
      pkgJson = JSON.parse(await readFile(join(cwd, 'package.json'), 'utf8'))
    } catch {}

    if (configFileName.endsWith('.mts') || pkgJson.type === 'module') {
      return handleESM({ cwd, compilerOptions, nextConfigPath })
    }

    return handleCJS({ cwd, nextConfigPath, compilerOptions })
  } catch (cause) {
    throw new Error(`Failed to transpile "${configFileName}".`, {
      cause,
    })
  }
}

async function handleCJS({
  cwd,
  nextConfigPath,
  compilerOptions,
}: {
  cwd: string
  nextConfigPath: string
  compilerOptions: CompilerOptions
}) {
  const swcOptions = resolveSWCOptions({
    cwd,
    compilerOptions,
    type: 'commonjs',
  })
  let hasRequire = false
  try {
    const nextConfigString = await readFile(nextConfigPath, 'utf8')
    // lazy require swc since it loads React before even setting NODE_ENV
    // resulting loading Development React on Production
    const { transform } = require('../swc') as typeof import('../swc')
    const { code } = await transform(nextConfigString, swcOptions)

    // register require hook only if require exists
    if (code.includes('require(')) {
      registerHook(swcOptions)
      hasRequire = true
    }

    // filename & extension don't matter here
    return requireFromString(code, resolve(cwd, 'next.config.compiled.js'))
  } catch (error) {
    throw error
  } finally {
    if (hasRequire) {
      deregisterHook()
    }
  }
}

let hasRegistered = false

async function handleESM(workerData: {
  cwd: string
  compilerOptions: CompilerOptions
  nextConfigPath: string
}) {
  try {
    if (!hasRegistered) {
      register(pathToFileURL(join(__dirname, 'loader.js')).href, {
        parentURL: pathToFileURL(workerData.cwd).href,
        data: {
          cwd: workerData.cwd,
          compilerOptions: workerData.compilerOptions,
        },
      })
      hasRegistered = true
    }

    return (await import(pathToFileURL(workerData.nextConfigPath).href)).default
  } catch (error) {
    throw error
  }
}
