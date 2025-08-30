import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import Abstract from '@/lib/models/Abstract'
import Review from '@/lib/models/Review'

// GET: List abstracts assigned to the reviewer (auto-assign rules TBD; placeholder returns all for now)
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    // Restrict to abstracts assigned to this reviewer
    const abstracts = await Abstract.find({
      assignedReviewerIds: { $in: [session.user.id] },
      status: { $in: ['submitted', 'under-review'] }
    })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean()

    return NextResponse.json({ success: true, data: abstracts })
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}

// POST: Submit a review
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { abstractId, scores, comments, recommendation } = body
    if (!abstractId || !scores || !recommendation) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 })
    }

    await connectDB()
    const abstract = await Abstract.findOne({ abstractId })
    if (!abstract) {
      return NextResponse.json({ success: false, message: 'Abstract not found' }, { status: 404 })
    }

    await Review.create({
      abstractId: abstract._id,
      abstractCode: abstract.abstractId,
      reviewerId: session.user.id,
      track: abstract.track,
      category: abstract.category,
      subcategory: abstract.subcategory,
      scores,
      comments,
      recommendation
    })

    // Optionally compute average score later via cron or aggregation

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}


