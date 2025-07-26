import { nextTestSetup } from 'e2e-utils'
import { getMetadataRouteSuffix } from 'next/dist/lib/metadata/get-metadata-route'

describe('metadata-files-static-output-group-route', () => {
  const { next } = nextTestSetup({
    files: __dirname,
  })

  const suffix = getMetadataRouteSuffix('/(group)/group/n')

  it('should have correct link tags for group page', async () => {
    const browser = await next.browser('/group')

    const links = await browser.eval(() => {
      return Array.from(document.querySelectorAll('link'))
        .filter((el) => !el.href.includes('/_next/static'))
        .map((el) => ({
          href: new URL(el.href, window.location.origin).pathname,
          rel: el.rel,
          type: el.type || '',
        }))
    })

    const metas = await browser.eval(() => {
      return Array.from(document.querySelectorAll('meta'))
        .map((el) => ({
          name: el.getAttribute('name'),
          property: el.getAttribute('property'),
        }))
        .filter((meta) => meta.name || meta.property)
    })

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
           "property": null,
         },
         {
           "name": null,
           "property": "og:image:type",
         },
         {
           "name": null,
           "property": "og:image:width",
         },
         {
           "name": null,
           "property": "og:image:height",
         },
         {
           "name": null,
           "property": "og:image:alt",
         },
         {
           "name": null,
           "property": "og:image",
         },
         {
           "name": "twitter:card",
           "property": null,
         },
         {
           "name": "twitter:image:type",
           "property": null,
         },
         {
           "name": "twitter:image:width",
           "property": null,
         },
         {
           "name": "twitter:image:height",
           "property": null,
         },
         {
           "name": "twitter:image:alt",
           "property": null,
         },
         {
           "name": "twitter:image",
           "property": null,
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
