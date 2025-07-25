import { nextTestSetup } from 'e2e-utils'

describe('metadata-files-static-output-static-route', () => {
  const { next } = nextTestSetup({
    files: __dirname,
  })

  it('should have correct link tags for static page', async () => {
    const $ = await next.render$('/static')
    const links = $('link')
      .not('[href*="/_next/static"]')
      .map((_, el) => ({
        href: new URL($(el).attr('href'), 'http://n').pathname,
        rel: $(el).attr('rel'),
        type: $(el).attr('type') || '',
      }))
      .get()

    expect(links).toMatchInlineSnapshot(`
     [
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
         "href": "/static/icon.png",
         "rel": "icon",
         "type": "image/png",
       },
       {
         "href": "/static/apple-icon.png",
         "rel": "apple-touch-icon",
         "type": "image/png",
       },
     ]
    `)
  })

  it('should serve static files when requested to its route for static page', async () => {
    const [
      appleIconRes,
      iconRes,
      opengraphImageRes,
      twitterImageRes,
      sitemapRes,
    ] = await Promise.all([
      next.fetch('/static/apple-icon.png'),
      next.fetch('/static/icon.png'),
      next.fetch('/static/opengraph-image.png'),
      next.fetch('/static/twitter-image.png'),
      next.fetch('/static/sitemap.xml'),
    ])

    // Compare response content with actual files
    const [
      actualAppleIcon,
      actualIcon,
      actualOpengraphImage,
      actualTwitterImage,
      actualSitemap,
    ] = await Promise.all([
      next.readFileBuffer('app/static/apple-icon.png'),
      next.readFileBuffer('app/static/icon.png'),
      next.readFileBuffer('app/static/opengraph-image.png'),
      next.readFileBuffer('app/static/twitter-image.png'),
      next.readFile('app/static/sitemap.xml'),
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
