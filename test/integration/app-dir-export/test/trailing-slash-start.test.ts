import { runTests } from './utils'

describe('app dir - with output export - trailing slash prod', () => {
  describe('production mode', () => {
    it.each([{ trailingSlash: false }, { trailingSlash: true }])(
      "should work in prod with trailingSlash '$trailingSlash'",
      async ({ trailingSlash }) => {
        await runTests({ isDev: false, trailingSlash })
      }
    )
  })
})
