import { nextTestSetup } from 'e2e-utils'
import { getMetadataRouteSuffix } from 'next/dist/lib/metadata/get-metadata-route'

describe('metadata-files-static-output-group-route', () => {
  const { next } = nextTestSetup({
    files: __dirname,
  })

  const suffix = getMetadataRouteSuffix('/(group)/group/n')

  it('should have correct link tags for group page', async () => {
    const $ = await next.render$('/group')
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
        property: $(el).attr('property'),
      }))
      .get()
      .filter((meta) => meta.name || meta.property)

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
           "href": "/group/icon-131tc6.png",
           "rel": "icon",
           "type": "image/png",
         },
         {
           "href": "/group/apple-icon-131tc6.png",
           "rel": "apple-touch-icon",
           "type": "image/png",
         },
       ],
       "metas": [
         {
           "name": "viewport",
           "property": undefined,
         },
         {
           "name": undefined,
           "property": "og:image:type",
         },
         {
           "name": undefined,
           "property": "og:image:width",
         },
         {
           "name": undefined,
           "property": "og:image:height",
         },
         {
           "name": undefined,
           "property": "og:image:alt",
         },
         {
           "name": undefined,
           "property": "og:image",
         },
         {
           "name": "twitter:card",
           "property": undefined,
         },
         {
           "name": "twitter:image:type",
           "property": undefined,
         },
         {
           "name": "twitter:image:width",
           "property": undefined,
         },
         {
           "name": "twitter:image:height",
           "property": undefined,
         },
         {
           "name": "twitter:image:alt",
           "property": undefined,
         },
         {
           "name": "twitter:image",
           "property": undefined,
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
