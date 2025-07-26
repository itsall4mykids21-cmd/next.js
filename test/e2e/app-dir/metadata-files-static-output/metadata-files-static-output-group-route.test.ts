import { nextTestSetup } from 'e2e-utils'
import { getMetadataHeadTags } from 'next-test-utils'
import { getMetadataRouteSuffix } from 'next/dist/lib/metadata/get-metadata-route'

describe('metadata-files-static-output-group-route', () => {
  const { next } = nextTestSetup({
    files: __dirname,
  })

  const suffix = getMetadataRouteSuffix('/(group)/group/n')

  it('should have correct link tags for group page', async () => {
    const browser = await next.browser('/group')

    expect(await getMetadataHeadTags(browser)).toMatchInlineSnapshot(`
     {
       "links": [
         {
           "href": "/favicon.ico",
           "rel": "icon",
           "type": "image/x-icon",
         },
         {
           "href": "/group/apple-icon-131tc6.png",
           "rel": "apple-touch-icon",
           "type": "image/png",
         },
         {
           "href": "/group/icon-131tc6.png",
           "rel": "icon",
           "type": "image/png",
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
           "content": "http://localhost:$PORT/group/twitter-image-131tc6.png?603d046c9a6fdfbb",
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
           "content": "http://localhost:$PORT/group/opengraph-image-131tc6.png?603d046c9a6fdfbb",
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

  it('should serve static files when requested to its route for group page', async () => {
    const [
      appleIconRes,
      iconRes,
      opengraphImageRes,
      twitterImageRes,
      // sitemapRes,
    ] = await Promise.all([
      next.fetch(`/group/apple-icon-${suffix}.png`),
      next.fetch(`/group/icon-${suffix}.png`),
      next.fetch(`/group/opengraph-image-${suffix}.png`),
      next.fetch(`/group/twitter-image-${suffix}.png`),
      // TODO: This seems bug, returning 404
      // next.fetch('/group/sitemap.xml'),
    ])

    // Compare response content with actual files
    const [
      actualAppleIcon,
      actualIcon,
      actualOpengraphImage,
      actualTwitterImage,
      // actualSitemap,
    ] = await Promise.all([
      next.readFileBuffer('app/(group)/group/apple-icon.png'),
      next.readFileBuffer('app/(group)/group/icon.png'),
      next.readFileBuffer('app/(group)/group/opengraph-image.png'),
      next.readFileBuffer('app/(group)/group/twitter-image.png'),
      // next.readFile('app/(group)/group/sitemap.xml'),
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
      // sitemap: await sitemapRes.text(),
    }).toEqual({
      // Buffer comparison returns 0 for equal
      appleIcon: 0,
      icon: 0,
      opengraphImage: 0,
      twitterImage: 0,
      // sitemap: actualSitemap,
    })
  })
})
