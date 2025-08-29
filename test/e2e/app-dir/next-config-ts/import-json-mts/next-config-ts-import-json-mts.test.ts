import { nextTestSetup } from 'e2e-utils'

describe('next-config-ts-import-json-mts', () => {
  const { next } = nextTestSetup({
    files: __dirname,
  })

  it('should support import json (MTS)', async () => {
    const $ = await next.render$('/')
    expect($('p').text()).toBe(
      JSON.stringify(['object', '123', 'with space', 'with-hyphen', 'array'])
    )
  })
})
