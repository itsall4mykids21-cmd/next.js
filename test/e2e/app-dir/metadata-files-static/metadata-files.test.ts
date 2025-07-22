import { nextTestSetup } from 'e2e-utils'

describe('metadata-files', () => {
  const { next } = nextTestSetup({
    files: __dirname,
  })

  it('should work using browser', async () => {
    const browser = await next.browser('/')
    expect(await browser.elementByCss('p').text()).toBe('hello world')
  })
})
