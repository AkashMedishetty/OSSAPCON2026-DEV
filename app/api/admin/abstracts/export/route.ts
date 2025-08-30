import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import Abstract from '@/lib/models/Abstract'

// Streaming large exports is better, but as a placeholder we return JSON array.
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== 'admin') {
    return new Response(JSON.stringify({ success: false, message: 'Admin access required' }), { status: 403 })
  }

  await connectDB()
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const track = searchParams.get('track')

  const query: any = {}
  if (status) query.status = status
  if (track) query.track = track

  const items = await Abstract.find(query).lean()
  return new Response(JSON.stringify({ success: true, data: items }), {
    headers: { 'Content-Type': 'application/json' }
  })
}


