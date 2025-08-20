// @ts-nocheck - On isolated test, this will be a type error.
import type { Playwright } from '../../../lib/next-webdriver'

export async function getCommonMetadataHeadTags(browser: Playwright) {
  return await browser.eval(() => {
    const metadataFiles = [
      '/favicon.ico',
      '/manifest.json',
      '/manifest.webmanifest',
      '/robots.txt',
      '/sitemap.xml',
      // Below may have variants like /icon1.png, /icon2.png, etc.
      // Or has suffixes like /icon-xxxxxx.png, /icon-image-yyyyyy.jpg, etc.
      '/icon',
      '/apple-icon',
      '/opengraph-image',
      '/twitter-image',
    ]

    const links = Array.from(document.querySelectorAll('link'))
      .filter((el) => !el.href.includes('/_next/static'))
      .filter((el) => {
        const pathname = new URL(el.href, window.location.origin).pathname
        return metadataFiles.some((file) => pathname.includes(file))
      })
      .map((el) => ({
        href: new URL(el.href, window.location.origin).pathname,
        rel: el.rel,
        type: el.type,
      }))
      .sort((a, b) => a.href.localeCompare(b.href))

    const metas = Array.from(document.querySelectorAll('meta'))
      .filter((meta) => meta.name || meta.hasAttribute('property'))
      .filter((meta) => {
        const attr = meta.name || meta.getAttribute('property') || ''
        return [
          'og:',
          'twitter:',
          'viewport',
          'description',
          'keywords',
          'robots',
        ].some(
          (prefix) => attr.startsWith(prefix) || attr === prefix.slice(0, -1)
        )
      })
      .map((el) => ({
        ...(el.name && { name: el.name }),
        ...(el.hasAttribute('property') && {
          property: el.getAttribute('property'),
        }),
      }))
      .sort((a, b) => {
        if (a.name && !b.name) return -1
        if (!a.name && b.name) return 1
        return (a.name || a.property || '').localeCompare(
          b.name || b.property || ''
        )
      })

    return { links, metas }
  })
}
