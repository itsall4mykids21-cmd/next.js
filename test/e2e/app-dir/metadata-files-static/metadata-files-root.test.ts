import { nextTestSetup } from 'e2e-utils'

describe('metadata-files-root', () => {
  const { next } = nextTestSetup({
    files: __dirname,
  })

  it('should not generate routes for metadata files', async () => {
    const appPathRoutesManifest: Record<string, string> = await next.readJSON(
      '.next/app-path-routes-manifest.json'
    )

    // Previously, metadata files were generated as routes even though the user
    // provided a static file. So, the manifest used to include "/sitemap.xml/route",
    // "/robots.txt/route", etc. This is still true for generated metadata files
    // e.g. `sitemap.ts` or `robots.ts`.
    expect(Object.keys(appPathRoutesManifest).sort()).toMatchInlineSnapshot(`
     [
       "/(group)/group/page",
       "/_not-found/page",
       "/dynamic/[id]/page",
       "/dynamic/catch-all/[...catch-all]/page",
       "/dynamic/optional-catch-all/[[...optional-catch-all]]/page",
       "/intercepting/(..)static/page",
       "/intercepting/page",
       "/page",
       "/parallel/@parallel/page",
       "/parallel/page",
       "/static/page",
     ]
    `)
  })

  it('should have correct link tags in the HTML', async () => {
    const $ = await next.render$('/')
    expect($('link[rel="icon"]').attr('href')).toBe('/favicon.ico')
    expect($('link[rel="manifest"]').attr('href')).toBe('/manifest.json')
  })

  it('should serve static files when requested to its route', async () => {
    const [faviconRes, manifestRes, robotsRes, sitemapRes] = await Promise.all([
      next.fetch('/favicon.ico'),
      next.fetch('/manifest.json'),
      next.fetch('/robots.txt'),
      next.fetch('/sitemap.xml'),
    ])

    // Compare response content with actual files
    const [actualFavicon, actualManifest, actualRobots, actualSitemap] =
      await Promise.all([
        next.readFileBuffer('app/favicon.ico'),
        next.readFile('app/manifest.json'),
        next.readFile('app/robots.txt'),
        next.readFile('app/sitemap.xml'),
      ])

    expect([
      Buffer.compare(
        Buffer.from(await faviconRes.arrayBuffer()),
        actualFavicon
      ),
      await manifestRes.text(),
      await robotsRes.text(),
      await sitemapRes.text(),
    ]).toEqual([
      0, // Buffer comparison returns 0 for equal
      actualManifest,
      actualRobots,
      actualSitemap,
    ])
  })
})
