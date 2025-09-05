import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'

export async function GET(request: NextRequest) {
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

    // Fetch all user registrations including payment info
    const users = await User.find({ role: 'user' })
      .select('email profile registration payment createdAt')
      .lean()

    // Generate CSV content
    const csvHeaders = [
      'Registration ID',
      'Name',
      'Email',
      'Phone',
      'Institution',
      'MCI Number',
      'Registration Type',
      'Status',
      'Tier',
      'Payment Method',
      'Payment Status',
      'Payment Amount',
      'UTR Number',
      'Payment Date',
      'Verified By',
      'Verification Date',
      'Payment Remarks',
      'Workshop Selections',
      'Accompanying Persons',
      'Accompanying Names',
      'Registration Date',
      'Address',
      'Dietary Requirements',
      'Special Needs'
    ]

    const csvRows = users.map(user => [
      user.registration.registrationId,
      `${user.profile.title || ''} ${user.profile.firstName} ${user.profile.lastName}`.trim(),
      user.email,
      user.profile.phone || '',
      user.profile.institution || '',
      user.profile.mciNumber || '',
      user.registration.type,
      user.registration.status,
      user.registration.tier || '',
      user.payment?.method || 'Not specified',
      user.payment?.status || 'No payment info',
      user.payment?.amount || 0,
      user.payment?.bankTransferUTR || '',
      user.payment?.paymentDate ? new Date(user.payment.paymentDate).toLocaleDateString() : '',
      user.payment?.verifiedBy || '',
      user.payment?.verificationDate ? new Date(user.payment.verificationDate).toLocaleDateString() : '',
      user.payment?.remarks || '',
      user.registration.workshopSelections?.join('; ') || '',
      user.registration.accompanyingPersons?.length || 0,
      (user.registration.accompanyingPersons || []).map((p: any) => p.name).join('; '),
      new Date(user.registration.registrationDate).toLocaleDateString(),
      user.profile.address ? 
        `${user.profile.address.street || ''}, ${user.profile.address.city || ''}, ${user.profile.address.state || ''}, ${user.profile.address.country || ''}`.replace(/^,+|,+$/g, '') : '',
      user.profile.dietaryRequirements || '',
      user.profile.specialNeeds || ''
    ])

    // Create CSV content
    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map(row => 
        row.map(field => 
          typeof field === 'string' && (field.includes(',') || field.includes('"') || field.includes('\n'))
            ? `"${field.replace(/"/g, '""')}"` // Escape quotes and wrap in quotes
            : field
        ).join(',')
      )
    ].join('\n')

    // Return CSV file
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="registrations-${new Date().toISOString().split('T')[0]}.csv"`
      }
    })

  } catch (error) {
    console.error('Registration export error:', error)
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}