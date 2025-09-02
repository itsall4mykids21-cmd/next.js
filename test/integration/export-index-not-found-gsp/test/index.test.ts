/* eslint-env jest */

import fs from 'fs-extra'
import { join } from 'path'
import { nextBuild } from 'next-test-utils'

const appDir = join(__dirname, '../')

describe('Export index page with `notFound: true` in `getStaticProps`', () => {
  describe('production mode', () => {
    it('should build successfully', async () => {
      await fs.remove(join(appDir, '.next'))
      await fs.remove(join(appDir, 'out'))
      const { code } = await nextBuild(appDir)
      expect(code).toBe(0)
    })
  })
})
