import { NextResponse } from 'next/server'
import { setTagStale } from 'next/cache'

export const revalidate = 0
export const runtime = 'edge'

export async function GET(req) {
  const tag = req.nextUrl.searchParams.get('tag')
  const tags = req.nextUrl.searchParams.get('tags')

  if (tags) {
    // Test multiple tags
    setTagStale(tags.split(','))
  } else if (tag) {
    // Test single tag
    setTagStale(tag)
  }

  return NextResponse.json({ stale: true, now: Date.now() })
}
