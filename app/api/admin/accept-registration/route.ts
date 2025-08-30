import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'

export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const { registrationId, acceptWithoutPayment, adminRemarks } = body

    const user = await User.findById(registrationId)
    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'Registration not found'
      }, { status: 404 })
    }

    // Update registration status
    const updateData: any = {
      'registration.status': 'confirmed',
      'registration.paymentStatus': 'admin-approved',
      adminRemarks: adminRemarks || 'Accepted without payment by admin',
      'registration.confirmationDate': new Date()
    }

    await User.findByIdAndUpdate(registrationId, { $set: updateData })

    // Send confirmation email (skip for complementary and sponsored users)
    if (user.registration.paymentType !== 'complementary' && user.registration.paymentType !== 'sponsored') {
      try {
        const { EmailService } = await import('@/lib/email/service')
        await EmailService.sendRegistrationConfirmation({
          email: user.email,
          name: `${user.profile.firstName} ${user.profile.lastName}`,
          registrationId: user.registration.registrationId,
          registrationType: user.registration.type,
          workshopSelections: user.registration.workshopSelections,
          accompanyingPersons: user.registration.accompanyingPersons
        })
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError)
        // Don't fail the acceptance if email fails
      }
    } else {
      console.log('Skipping confirmation email for complementary/sponsored user:', user.email)
    }

    return NextResponse.json({
      success: true,
      message: 'Registration accepted successfully without payment requirement'
    })

  } catch (error) {
    console.error('Error accepting registration:', error)
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}