import { nextTestSetup } from 'e2e-utils'
import { getMetadataRouteSuffix } from 'next/dist/lib/metadata/get-metadata-route'

describe('metadata-files-static-output-parallel-route', () => {
  const { next } = nextTestSetup({
    files: __dirname,
  })

  it('should have correct link tags for parallel slot page', async () => {
    const $ = await next.render$('/parallel')
    const links = $('link')
      .not('[href*="/_next/static"]')
      .map((_, el) => ({
        href: new URL($(el).attr('href'), 'http://n').pathname,
        rel: $(el).attr('rel'),
        type: $(el).attr('type') || '',
      }))
      .get()

    const metas = $('meta')
      .map((_, el) => ({
        name: $(el).attr('name'),
        content: $(el).attr('content'),
        property: $(el).attr('property'),
      }))
      .get()
      .filter((meta) => meta.content)

    expect({ links, metas }).toMatchInlineSnapshot(`
     {
       "links": [
         {
           "href": "/manifest.json",
           "rel": "manifest",
           "type": "",
         },
         {
           "href": "/favicon.ico",
           "rel": "icon",
           "type": "image/x-icon",
         },
         {
           "href": "/parallel/icon-kzjltp.png",
           "rel": "icon",
           "type": "image/png",
         },
         {
           "href": "/parallel/apple-icon-kzjltp.png",
           "rel": "apple-touch-icon",
           "type": "image/png",
         },
       ],
       "metas": [
         {
           "content": "width=device-width, initial-scale=1",
           "name": "viewport",
           "property": undefined,
         },
         {
           "content": "image/png",
           "name": undefined,
           "property": "og:image:type",
         },
         {
           "content": "16",
           "name": undefined,
           "property": "og:image:width",
         },
         {
           "content": "16",
           "name": undefined,
           "property": "og:image:height",
         },
         {
           "content": "About Next.js",
           "name": undefined,
           "property": "og:image:alt",
         },
         {
           "content": "http://localhost:0/parallel/opengraph-image-kzjltp.png?603d046c9a6fdfbb",
           "name": undefined,
           "property": "og:image",
         },
         {
           "content": "summary_large_image",
           "name": "twitter:card",
           "property": undefined,
         },
         {
           "content": "image/png",
           "name": "twitter:image:type",
           "property": undefined,
         },
         {
           "content": "16",
           "name": "twitter:image:width",
           "property": undefined,
         },
         {
           "content": "16",
           "name": "twitter:image:height",
           "property": undefined,
         },
         {
           "content": "About Next.js",
           "name": "twitter:image:alt",
           "property": undefined,
         },
         {
           "content": "http://localhost:0/parallel/twitter-image-kzjltp.png?603d046c9a6fdfbb",
           "name": "twitter:image",
           "property": undefined,
         },
       ],
     }
    `)
  })

  it('should serve static files when requested to its route for parallel slot page', async () => {
    const suffix = getMetadataRouteSuffix('/parallel/@parallel/n')

    const [
      appleIconRes,
      iconRes,
      opengraphImageRes,
      twitterImageRes,
      // sitemapRes,
    ] = await Promise.all([
      next.fetch(`/parallel/apple-icon-${suffix}.png`),
      next.fetch(`/parallel/icon-${suffix}.png`),
      next.fetch(`/parallel/opengraph-image-${suffix}.png`),
      next.fetch(`/parallel/twitter-image-${suffix}.png`),
      // TODO: This seems bug, returning 404
      // next.fetch(`/parallel/sitemap.xml`),
    ])

    // Compare response content with actual files
    const [
      actualAppleIcon,
      actualIcon,
      actualOpengraphImage,
      actualTwitterImage,
      // actualSitemap,
    ] = await Promise.all([
      next.readFileBuffer('app/parallel/@parallel/apple-icon.png'),
      next.readFileBuffer('app/parallel/@parallel/icon.png'),
      next.readFileBuffer('app/parallel/@parallel/opengraph-image.png'),
      next.readFileBuffer('app/parallel/@parallel/twitter-image.png'),
      // next.readFile('app/parallel/@parallel/sitemap.xml'),
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
