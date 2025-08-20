import { nextTestSetup } from 'e2e-utils'
import { getCommonMetadataHeadTags } from './utils'

describe('metadata-files-static-output-root-route', () => {
  const { next, skipped } = nextTestSetup({
    files: __dirname,
    skipDeployment: true,
  })

  if (skipped) {
    return
  }

  it('should have correct link tags for root page', async () => {
    const browser = await next.browser('/')

    expect(await getCommonMetadataHeadTags(browser)).toMatchInlineSnapshot(`
     {
       "links": [
         {
           "href": "/favicon.ico",
           "rel": "icon",
           "type": "image/x-icon",
         },
         {
           "href": "/manifest.json",
           "rel": "manifest",
           "type": "",
         },
       ],
       "metas": [
         {
           "name": "viewport",
         },
       ],
     }
    `)
  })

  it('should not generate routes for metadata files', async () => {
    const appPathRoutesManifest: Record<string, string> = await next.readJSON(
      '.next/app-path-routes-manifest.json'
    )

    // Previously, metadata files were generated as routes even though the user
    // provided a static file. So, the manifest used to include "/sitemap.xml/route",
    // "/robots.txt/route", etc. This is still true for generated metadata files
    // e.g. `sitemap.ts` or `robots.ts`.
    // Files inside "/api/" are expected to be generated as routes.
    expect(Object.keys(appPathRoutesManifest).sort()).toMatchInlineSnapshot(`
     [
       "/(group)/group/page",
       "/_not-found/page",
       "/api/apple-icon/route",
       "/api/icon/route",
       "/api/opengraph-image/route",
       "/api/routes/apple-icon/route",
       "/api/routes/icon/route",
       "/api/routes/opengraph-image/route",
       "/api/routes/sitemap.xml/route",
       "/api/routes/twitter-image/route",
       "/api/sitemap.xml/route",
       "/api/twitter-image/route",
       "/dynamic/[id]/page",
       "/intercept-me/page",
       "/intercepting/(..)intercept-me/page",
       "/intercepting/page",
       "/page",
       "/parallel/@parallel/page",
       "/parallel/page",
       "/static/page",
     ]
    `)
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

    expect({
      favicon: Buffer.compare(
        Buffer.from(await faviconRes.arrayBuffer()),
        actualFavicon
      ),
      manifest: await manifestRes.text(),
      robots: await robotsRes.text(),
      sitemap: await sitemapRes.text(),
    }).toEqual({
      favicon: 0, // Buffer comparison returns 0 for equal
      manifest: actualManifest,
      robots: actualRobots,
      sitemap: actualSitemap,
    })
  })
})
