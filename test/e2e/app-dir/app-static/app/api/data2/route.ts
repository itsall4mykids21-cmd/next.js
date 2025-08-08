import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    value: 'data2',
    timestamp: Date.now(),
  })
}
