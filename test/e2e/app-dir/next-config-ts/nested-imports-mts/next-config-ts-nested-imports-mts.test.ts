import { nextTestSetup } from 'e2e-utils'

describe('next-config-ts-nested-imports-mts', () => {
  const { next } = nextTestSetup({
    files: __dirname,
  })

  it('should handle nested imports (MTS)', async () => {
    const $ = await next.render$('/')
    expect($('p').text()).toBe('foobarbaz')
  })
})
