import { nextTestSetup } from 'e2e-utils'
import { copyFile, readdir, unlink } from 'fs/promises'
import { retry } from 'next-test-utils'
import { join } from 'path'

describe('metadata-files-dev-hmr', () => {
  const { next, isNextDev, skipped } = nextTestSetup({
    files: __dirname,
    skipDeployment: true,
  })

  if (!isNextDev || skipped) {
    it.skip('skip non-dev or skipped tests', () => {})
    return
  }

  it('should copy metadata files in root directory', async () => {
    const files = (
      await readdir(join(next.testDir, '.next/static/metadata'), {
        withFileTypes: true,
      })
    )
      .filter((file) => file.isFile())
      .map((file) => file.name)
      .sort()

    expect(files).toEqual([
      'favicon.ico',
      'manifest.json',
      'robots.txt',
      'sitemap.xml',
    ])
  })

  it('should copy nested metadata files', async () => {
    const files = await readdir(
      join(next.testDir, '.next/static/metadata/static')
    )

    expect(files).toEqual([
      'apple-icon.png',
      'icon.png',
      'opengraph-image.png',
      'sitemap.xml',
      'twitter-image.png',
    ])
  })

  it('should copy new metadata files and remove deleted ones', async () => {
    await copyFile(
      join(next.testDir, 'app/static/icon.png'),
      join(next.testDir, 'app/static/icon1.png')
    )

    await retry(async () => {
      const filesAfterAdd = await readdir(
        join(next.testDir, '.next/static/metadata/static')
      )

      expect(filesAfterAdd).toEqual([
        'apple-icon.png',
        'icon.png',
        'icon1.png',
        'opengraph-image.png',
        'sitemap.xml',
        'twitter-image.png',
      ])
    })

    await unlink(join(next.testDir, 'app/static/icon1.png'))

    await retry(async () => {
      const filesAfterRemove = await readdir(
        join(next.testDir, '.next/static/metadata/static')
      )

      expect(filesAfterRemove).toEqual([
        'apple-icon.png',
        'icon.png',
        'opengraph-image.png',
        'sitemap.xml',
        'twitter-image.png',
      ])
    })
  })
})
