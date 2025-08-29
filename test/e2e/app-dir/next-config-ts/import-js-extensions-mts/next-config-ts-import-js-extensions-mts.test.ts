import { nextTestSetup } from 'e2e-utils'

describe('next-config-ts-import-js-extensions-mts', () => {
  const { next } = nextTestSetup({
    files: __dirname,
  })

  it('should import js extensions (MTS)', async () => {
    const $ = await next.render$('/')
    const text = $('p').text()
    expect(text).toContain('jsESM')
    expect(text).toContain('cjs')
    expect(text).toContain('mjs')
    expect(text).toContain('cts')
    expect(text).toContain('mts')
    expect(text).toContain('ts')
  })
})
