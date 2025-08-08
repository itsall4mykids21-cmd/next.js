import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    value: 'data1',
    timestamp: Date.now(),
  })
}
