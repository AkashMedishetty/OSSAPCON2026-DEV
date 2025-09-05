import { NextRequest, NextResponse } from 'next/server'

// Minimal stub to satisfy build; abstracts are disabled for now
export async function GET(request: NextRequest) {
  return NextResponse.json({ success: true, data: { enabled: false } })
}

export async function PUT(request: NextRequest) {
  return NextResponse.json({ success: false, message: 'Abstracts config disabled' }, { status: 503 })
}


