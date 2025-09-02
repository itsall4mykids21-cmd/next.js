import { nextTestSetup } from 'e2e-utils'
import semver from 'semver'

describe('next-config-ts-type-error-esm', () => {
  const { next, isNextDev, skipped } = nextTestSetup({
    files: __dirname,
    skipStart: true,
    skipDeployment: true,
    packageJson: {
      type: 'module',
    },
  })

  if (skipped) {
    return
  }

  // Native TypeScript resolution is supported with a flag
  // since v22.7.0, and is enabled by default since v23.6.0.
  // TODO: Remove this once we drop support for Node.js 22.
  it('should be Node.js +22.7.0', async () => {
    expect(semver.gte(process.versions.node, '22.7.0')).toBe(true)
  })

  it('should not have fallback to legacy resolution', async () => {
    expect(next.cliOutput).not.toContain('Falling back to legacy resolution.')
  })

  it('should throw with type error on build (ESM)', async () => {
    if (isNextDev) {
      await next.start()
      const $ = await next.render$('/')
      expect($('p').text()).toBe('foo')
    } else {
      const { cliOutput } = await next.build()
      await expect(cliOutput).toContain(
        `Type 'string' is not assignable to type 'number'.`
      )
    }
  })
})
