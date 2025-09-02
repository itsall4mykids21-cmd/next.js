import { nextTestSetup } from 'e2e-utils'
import semver from 'semver'

describe('next-config-ts-import-alias-paths-with-baseurl-esm', () => {
  const { next } = nextTestSetup({
    files: __dirname,
    packageJson: {
      type: 'module',
    },
  })

  // Native TypeScript resolution is supported with a flag
  // since v22.7.0, and is enabled by default since v23.6.0.
  // TODO: Remove this once we drop support for Node.js 22.
  it('should be Node.js +22.7.0', async () => {
    expect(semver.gte(process.versions.node, '22.7.0')).toBe(true)
  })

  it('should not have fallback to legacy resolution', async () => {
    expect(next.cliOutput).not.toContain('Falling back to legacy resolution.')
  })

  it('should support import alias paths with baseUrl (ESM)', async () => {
    const $ = await next.render$('/')
    expect($('p').text()).toBe('foobar')
  })
})
