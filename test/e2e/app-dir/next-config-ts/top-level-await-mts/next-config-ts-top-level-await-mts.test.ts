import { nextTestSetup } from 'e2e-utils'

describe('next-config-ts-top-level-await-mts', () => {
  const { next } = nextTestSetup({
    files: __dirname,
  })

  it('should support top-level await (MTS)', async () => {
    const $ = await next.render$('/')
    expect($('p').text()).toBe('foo')
  })
})
