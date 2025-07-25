import { nextTestSetup } from 'e2e-utils'

describe('metadata-files-static-output-dynamic-route', () => {
  const { next } = nextTestSetup({
    files: __dirname,
  })

  describe('dynamic page', () => {
    it('should have correct link tags for dynamic page', async () => {
      const browser = await next.browser('/dynamic/123')
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
             "href": "/dynamic/123/icon.png",
             "rel": "icon",
             "type": "image/png",
           },
           {
             "href": "/dynamic/123/apple-icon.png",
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

  describe('dynamic catch-all page', () => {
    it('should have correct link tags for dynamic catch-all page', async () => {
      const $ = await next.render$('/dynamic/catch-all/123')
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
                "href": "/dynamic/catch-all/123/icon.png",
                "rel": "icon",
                "type": "image/png",
              },
              {
                "href": "/dynamic/catch-all/123/apple-icon.png",
                "rel": "apple-touch-icon",
                "type": "image/png",
              },
            ]
          `)
    })

    it('should serve static files when requested to its route for dynamic catch-all page', async () => {
      const [
        appleIconRes,
        iconRes,
        opengraphImageRes,
        twitterImageRes,
        sitemapRes,
      ] = await Promise.all([
        next.fetch('/dynamic/catch-all/123/apple-icon.png'),
        next.fetch('/dynamic/catch-all/123/icon.png'),
        next.fetch('/dynamic/catch-all/123/opengraph-image.png'),
        next.fetch('/dynamic/catch-all/123/twitter-image.png'),
        next.fetch('/dynamic/catch-all/123/sitemap.xml'),
      ])

      // Compare response content with actual files
      const [
        actualAppleIcon,
        actualIcon,
        actualOpengraphImage,
        actualTwitterImage,
        actualSitemap,
      ] = await Promise.all([
        next.readFileBuffer(
          'app/dynamic/catch-all/[...catch-all]/apple-icon.png'
        ),
        next.readFileBuffer('app/dynamic/catch-all/[...catch-all]/icon.png'),
        next.readFileBuffer(
          'app/dynamic/catch-all/[...catch-all]/opengraph-image.png'
        ),
        next.readFileBuffer(
          'app/dynamic/catch-all/[...catch-all]/twitter-image.png'
        ),
        next.readFile('app/dynamic/catch-all/[...catch-all]/sitemap.xml'),
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

  describe('dynamic optional catch-all page', () => {
    it('should have correct link tags for dynamic optional catch-all page', async () => {
      const $ = await next.render$('/dynamic/optional-catch-all/123')
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
                "href": "/dynamic/optional-catch-all/123/icon.png",
                "rel": "icon",
                "type": "image/png",
              },
              {
                "href": "/dynamic/optional-catch-all/123/apple-icon.png",
                "rel": "apple-touch-icon",
                "type": "image/png",
              },
            ]
          `)
    })

    it('should serve static files when requested to its route for dynamic optional catch-all page', async () => {
      const [
        appleIconRes,
        iconRes,
        opengraphImageRes,
        twitterImageRes,
        sitemapRes,
      ] = await Promise.all([
        next.fetch('/dynamic/optional-catch-all/123/apple-icon.png'),
        next.fetch('/dynamic/optional-catch-all/123/icon.png'),
        next.fetch('/dynamic/optional-catch-all/123/opengraph-image.png'),
        next.fetch('/dynamic/optional-catch-all/123/twitter-image.png'),
        next.fetch('/dynamic/optional-catch-all/123/sitemap.xml'),
      ])

      // Compare response content with actual files
      const [
        actualAppleIcon,
        actualIcon,
        actualOpengraphImage,
        actualTwitterImage,
        actualSitemap,
      ] = await Promise.all([
        next.readFileBuffer(
          'app/dynamic/optional-catch-all/[[...optional-catch-all]]/apple-icon.png'
        ),
        next.readFileBuffer(
          'app/dynamic/optional-catch-all/[[...optional-catch-all]]/icon.png'
        ),
        next.readFileBuffer(
          'app/dynamic/optional-catch-all/[[...optional-catch-all]]/opengraph-image.png'
        ),
        next.readFileBuffer(
          'app/dynamic/optional-catch-all/[[...optional-catch-all]]/twitter-image.png'
        ),
        next.readFile(
          'app/dynamic/optional-catch-all/[[...optional-catch-all]]/sitemap.xml'
        ),
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
