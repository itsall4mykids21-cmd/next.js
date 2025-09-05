import { nextTestSetup } from 'e2e-utils'

describe('next-config-ts-export-as-default-cjs', () => {
  // TODO: Remove this once we bump minimum Node.js version to v22
  if (!(process.features as any).typescript) {
    it.skip('requires `process.features.typescript` to feature detect Node.js native TS', () => {})
    return
  }

  const { next } = nextTestSetup({
    files: __dirname,
  })

  it('should not have fallback to legacy resolution', async () => {
    expect(next.cliOutput).not.toContain('Falling back to legacy resolution.')
  })

  it('should support export as default (CJS)', async () => {
    const $ = await next.render$('/')
    expect($('p').text()).toBe('foo')
  })
})
