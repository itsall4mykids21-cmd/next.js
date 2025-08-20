import { nextTestSetup } from 'e2e-utils'

describe('metadata-files-manifest', () => {
  const { next, isNextDev, skipped } = nextTestSetup({
    files: __dirname,
    skipDeployment: true,
  })

  if (isNextDev || skipped) {
    it.skip('skip dev or skipped tests', () => {})
    return
  }

  it('should generate static-metadata-routes-manifest.json', async () => {
    const manifest = await next.readJSON(
      '.next/static-metadata-routes-manifest.json'
    )

    expect(manifest).toMatchInlineSnapshot(`
     {
       "/dynamic/[id]/apple-icon.png": {
         "regex": "^/dynamic/([^/]+?)/apple\\-icon\\.png(?:/)?$",
         "sourcePage": "_next/static/metadata/dynamic/[id]/apple-icon.png",
       },
       "/dynamic/[id]/icon.png": {
         "regex": "^/dynamic/([^/]+?)/icon\\.png(?:/)?$",
         "sourcePage": "_next/static/metadata/dynamic/[id]/icon.png",
       },
       "/dynamic/[id]/opengraph-image.png": {
         "regex": "^/dynamic/([^/]+?)/opengraph\\-image\\.png(?:/)?$",
         "sourcePage": "_next/static/metadata/dynamic/[id]/opengraph-image.png",
       },
       "/dynamic/[id]/sitemap.xml": {
         "regex": "^/dynamic/([^/]+?)/sitemap\\.xml(?:/)?$",
         "sourcePage": "_next/static/metadata/dynamic/[id]/sitemap.xml",
       },
       "/dynamic/[id]/twitter-image.png": {
         "regex": "^/dynamic/([^/]+?)/twitter\\-image\\.png(?:/)?$",
         "sourcePage": "_next/static/metadata/dynamic/[id]/twitter-image.png",
       },
       "/favicon.ico": {
         "regex": "^/favicon\\.ico(?:/)?$",
         "sourcePage": "_next/static/metadata/favicon.ico",
       },
       "/group/apple-icon-131tc6.png": {
         "regex": "^/group/apple\\-icon\\-131tc6\\.png(?:/)?$",
         "sourcePage": "_next/static/metadata/group/apple-icon-131tc6.png",
       },
       "/group/icon-131tc6.png": {
         "regex": "^/group/icon\\-131tc6\\.png(?:/)?$",
         "sourcePage": "_next/static/metadata/group/icon-131tc6.png",
       },
       "/group/opengraph-image-131tc6.png": {
         "regex": "^/group/opengraph\\-image\\-131tc6\\.png(?:/)?$",
         "sourcePage": "_next/static/metadata/group/opengraph-image-131tc6.png",
       },
       "/group/sitemap-131tc6.xml": {
         "regex": "^/group/sitemap\\-131tc6\\.xml(?:/)?$",
         "sourcePage": "_next/static/metadata/group/sitemap-131tc6.xml",
       },
       "/group/twitter-image-131tc6.png": {
         "regex": "^/group/twitter\\-image\\-131tc6\\.png(?:/)?$",
         "sourcePage": "_next/static/metadata/group/twitter-image-131tc6.png",
       },
       "/intercepting/(..)intercept-me/apple-icon.png": {
         "regex": "^/intercepting/\\(\\.\\.\\)intercept\\-me/apple\\-icon\\.png(?:/)?$",
         "sourcePage": "_next/static/metadata/intercepting/(..)intercept-me/apple-icon.png",
       },
       "/intercepting/(..)intercept-me/icon.png": {
         "regex": "^/intercepting/\\(\\.\\.\\)intercept\\-me/icon\\.png(?:/)?$",
         "sourcePage": "_next/static/metadata/intercepting/(..)intercept-me/icon.png",
       },
       "/intercepting/(..)intercept-me/opengraph-image.png": {
         "regex": "^/intercepting/\\(\\.\\.\\)intercept\\-me/opengraph\\-image\\.png(?:/)?$",
         "sourcePage": "_next/static/metadata/intercepting/(..)intercept-me/opengraph-image.png",
       },
       "/intercepting/(..)intercept-me/sitemap.xml": {
         "regex": "^/intercepting/\\(\\.\\.\\)intercept\\-me/sitemap\\.xml(?:/)?$",
         "sourcePage": "_next/static/metadata/intercepting/(..)intercept-me/sitemap.xml",
       },
       "/intercepting/(..)intercept-me/twitter-image.png": {
         "regex": "^/intercepting/\\(\\.\\.\\)intercept\\-me/twitter\\-image\\.png(?:/)?$",
         "sourcePage": "_next/static/metadata/intercepting/(..)intercept-me/twitter-image.png",
       },
       "/manifest.json": {
         "regex": "^/manifest\\.json(?:/)?$",
         "sourcePage": "_next/static/metadata/manifest.json",
       },
       "/parallel/apple-icon-kzjltp.png": {
         "regex": "^/parallel/apple\\-icon\\-kzjltp\\.png(?:/)?$",
         "sourcePage": "_next/static/metadata/parallel/apple-icon-kzjltp.png",
       },
       "/parallel/icon-kzjltp.png": {
         "regex": "^/parallel/icon\\-kzjltp\\.png(?:/)?$",
         "sourcePage": "_next/static/metadata/parallel/icon-kzjltp.png",
       },
       "/parallel/opengraph-image-kzjltp.png": {
         "regex": "^/parallel/opengraph\\-image\\-kzjltp\\.png(?:/)?$",
         "sourcePage": "_next/static/metadata/parallel/opengraph-image-kzjltp.png",
       },
       "/parallel/sitemap-kzjltp.xml": {
         "regex": "^/parallel/sitemap\\-kzjltp\\.xml(?:/)?$",
         "sourcePage": "_next/static/metadata/parallel/sitemap-kzjltp.xml",
       },
       "/parallel/twitter-image-kzjltp.png": {
         "regex": "^/parallel/twitter\\-image\\-kzjltp\\.png(?:/)?$",
         "sourcePage": "_next/static/metadata/parallel/twitter-image-kzjltp.png",
       },
       "/robots.txt": {
         "regex": "^/robots\\.txt(?:/)?$",
         "sourcePage": "_next/static/metadata/robots.txt",
       },
       "/sitemap.xml": {
         "regex": "^/sitemap\\.xml(?:/)?$",
         "sourcePage": "_next/static/metadata/sitemap.xml",
       },
       "/static/apple-icon.png": {
         "regex": "^/static/apple\\-icon\\.png(?:/)?$",
         "sourcePage": "_next/static/metadata/static/apple-icon.png",
       },
       "/static/icon.png": {
         "regex": "^/static/icon\\.png(?:/)?$",
         "sourcePage": "_next/static/metadata/static/icon.png",
       },
       "/static/opengraph-image.png": {
         "regex": "^/static/opengraph\\-image\\.png(?:/)?$",
         "sourcePage": "_next/static/metadata/static/opengraph-image.png",
       },
       "/static/sitemap.xml": {
         "regex": "^/static/sitemap\\.xml(?:/)?$",
         "sourcePage": "_next/static/metadata/static/sitemap.xml",
       },
       "/static/twitter-image.png": {
         "regex": "^/static/twitter\\-image\\.png(?:/)?$",
         "sourcePage": "_next/static/metadata/static/twitter-image.png",
       },
     }
    `)
  })
})
