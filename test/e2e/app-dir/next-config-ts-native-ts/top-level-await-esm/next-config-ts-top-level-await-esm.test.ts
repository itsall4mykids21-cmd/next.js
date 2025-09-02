import { nextTestSetup } from 'e2e-utils'
import semver from 'semver'

describe('next-config-ts-top-level-await-esm', () => {
  // Skip tests if Node.js version is below 22.7.0
  // Native TypeScript resolution is supported with a flag
  // since v22.7.0, and is enabled by default since v23.6.0.
  // TODO: Remove this once we bump minimum Node.js version to v22
  if (!semver.gte(process.versions.node, '22.7.0')) {
    it.skip('requires Node.js 22.7.0+ for native TypeScript resolution', () => {})
    return
  }

  const { next } = nextTestSetup({
    files: __dirname,
    packageJson: {
      type: 'module',
    },
  })

  it('should not have fallback to legacy resolution', async () => {
    expect(next.cliOutput).not.toContain('Falling back to legacy resolution.')
  })

  it('should support top-level await (ESM)', async () => {
    const $ = await next.render$('/')
    expect($('p').text()).toBe('foo')
  })
})
