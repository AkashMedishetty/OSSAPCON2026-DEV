import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Configuration from '@/lib/models/Configuration'
import { defaultAbstractsSettings } from '@/lib/config/abstracts'

// Public read of abstracts settings for building forms
export async function GET() {
  try {
    await connectDB()
    const cfg = await Configuration.findOne({ type: 'abstracts', key: 'settings' })
    return NextResponse.json({ success: true, data: cfg?.value || defaultAbstractsSettings })
  } catch (e) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}


