import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    message: 'test data',
    timestamp: Date.now(),
  })
}
