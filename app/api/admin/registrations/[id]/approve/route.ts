import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'
import { EmailService } from '@/lib/email/service'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized'
      }, { status: 401 })
    }

    await connectDB()

    const adminUser = await User.findById(session.user.id)
    if (!adminUser || adminUser.role !== 'admin') {
      return NextResponse.json({
        success: false,
        message: 'Admin access required'
      }, { status: 403 })
    }

    const { remarks } = await request.json()

    // Find the user to approve
    const user = await User.findById(params.id)
    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'User not found'
      }, { status: 404 })
    }

    // Update payment status to verified
    if (user.payment) {
      user.payment.status = 'verified'
      user.payment.verifiedBy = adminUser.email
      user.payment.verificationDate = new Date()
      if (remarks) {
        user.payment.remarks = remarks
      }
    }

    // Update registration status to confirmed
    user.registration.status = 'confirmed'
    user.registration.paymentDate = new Date()

    await user.save()

    // Send confirmation email
    try {
      await EmailService.sendPaymentConfirmation({
        email: user.email,
        name: `${user.profile.firstName} ${user.profile.lastName}`,
        registrationId: user.registration.registrationId,
        amount: user.payment?.amount || 0,
        verificationDate: new Date()
      })
    } catch (emailError) {
      console.error('Failed to send approval email:', emailError)
      // Don't fail the approval if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Registration approved successfully',
      data: {
        id: user._id,
        email: user.email,
        registrationId: user.registration.registrationId,
        paymentStatus: user.payment?.status,
        registrationStatus: user.registration.status
      }
    })

  } catch (error) {
    console.error('Approval error:', error)
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
