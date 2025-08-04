import { nextTestSetup } from 'e2e-utils'
import { getMetadataHeadTags } from 'next-test-utils'

describe('metadata-files-static-output-dynamic-route', () => {
  const { next } = nextTestSetup({
    files: __dirname,
  })

  describe('dynamic page', () => {
    it('should have correct link tags for dynamic page', async () => {
      const browser = await next.browser('/dynamic/123')

      expect(await getMetadataHeadTags(browser)).toMatchInlineSnapshot(`
       {
         "links": [
           {
             "href": "/dynamic/123/apple-icon.png",
             "rel": "apple-touch-icon",
             "type": "image/png",
           },
           {
             "href": "/dynamic/123/icon.png",
             "rel": "icon",
             "type": "image/png",
           },
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
             "content": "summary_large_image",
             "name": "twitter:card",
           },
           {
             "content": "http://localhost:$PORT/dynamic/123/twitter-image.png?603d046c9a6fdfbb",
             "name": "twitter:image",
           },
           {
             "content": "About Next.js",
             "name": "twitter:image:alt",
           },
           {
             "content": "16",
             "name": "twitter:image:height",
           },
           {
             "content": "image/png",
             "name": "twitter:image:type",
           },
           {
             "content": "16",
             "name": "twitter:image:width",
           },
           {
             "content": "width=device-width, initial-scale=1",
             "name": "viewport",
           },
           {
             "content": "http://localhost:$PORT/dynamic/123/opengraph-image.png?603d046c9a6fdfbb",
             "property": "og:image",
           },
           {
             "content": "About Next.js",
             "property": "og:image:alt",
           },
           {
             "content": "16",
             "property": "og:image:height",
           },
           {
             "content": "image/png",
             "property": "og:image:type",
           },
           {
             "content": "16",
             "property": "og:image:width",
           },
         ],
       }
      `)
    })

    it('should serve static files when requested to its route for dynamic page', async () => {
      const [
        appleIconRes,
        iconRes,
        opengraphImageRes,
        twitterImageRes,
        sitemapRes,
      ] = await Promise.all([
        next.fetch('/dynamic/123/apple-icon.png'),
        next.fetch('/dynamic/123/icon.png'),
        next.fetch('/dynamic/123/opengraph-image.png'),
        next.fetch('/dynamic/123/twitter-image.png'),
        next.fetch('/dynamic/123/sitemap.xml'),
      ])

      // Compare response content with actual files
      const [
        actualAppleIcon,
        actualIcon,
        actualOpengraphImage,
        actualTwitterImage,
        actualSitemap,
      ] = await Promise.all([
        next.readFileBuffer('app/dynamic/[id]/apple-icon.png'),
        next.readFileBuffer('app/dynamic/[id]/icon.png'),
        next.readFileBuffer('app/dynamic/[id]/opengraph-image.png'),
        next.readFileBuffer('app/dynamic/[id]/twitter-image.png'),
        next.readFile('app/dynamic/[id]/sitemap.xml'),
      ])

      expect({
        appleIcon: Buffer.compare(
          Buffer.from(await appleIconRes.arrayBuffer()),
          actualAppleIcon
        ),
        icon: Buffer.compare(
          Buffer.from(await iconRes.arrayBuffer()),
          actualIcon
        ),
        opengraphImage: Buffer.compare(
          Buffer.from(await opengraphImageRes.arrayBuffer()),
          actualOpengraphImage
        ),
        twitterImage: Buffer.compare(
          Buffer.from(await twitterImageRes.arrayBuffer()),
          actualTwitterImage
        ),
        sitemap: await sitemapRes.text(),
      }).toEqual({
        // Buffer comparison returns 0 for equal
        appleIcon: 0,
        icon: 0,
        opengraphImage: 0,
        twitterImage: 0,
        sitemap: actualSitemap,
      })
    })
  })
})
