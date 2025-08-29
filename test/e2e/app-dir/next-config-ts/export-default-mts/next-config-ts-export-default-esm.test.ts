import { nextTestSetup } from 'e2e-utils'

describe('next-config-ts-export-default-mts', () => {
  const { next } = nextTestSetup({
    files: __dirname,
    packageJson: {
      type: 'module',
    },
  })

  it('should support export default (MTS)', async () => {
    const $ = await next.render$('/')
    expect($('p').text()).toBe('foo')
  })
})
