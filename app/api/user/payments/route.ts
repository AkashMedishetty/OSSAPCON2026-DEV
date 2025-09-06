import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import Payment from '@/lib/models/Payment'
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

    const payments = await Payment.find({
      userId: session.user.id
    }).sort({ createdAt: -1 })

    // Also include embedded bank-transfer payments stored on the user document
    const user = await User.findById(session.user.id)
    const embedded = [] as any[]
    if (user && user.payment && typeof user.payment.amount === 'number') {
      embedded.push({
        _id: `userpay_${user._id.toString()}`,
        amount: { total: user.payment.amount, currency: 'INR' },
        status: user.payment.status === 'verified' ? 'completed' : user.payment.status || 'pending',
        razorpayOrderId: undefined,
        razorpayPaymentId: user.payment.bankTransferUTR || user.payment.transactionId || 'BANK-TRANSFER',
        createdAt: user.payment.paymentDate || user.registration?.paymentDate || new Date(),
        updatedAt: user.payment.verificationDate || user.payment.paymentDate || new Date(),
        workshopSelections: user.registration?.workshopSelections || [],
        discountApplied: 0,
        breakdown: {
          registrationType: user.registration?.type || 'ossap-member',
          baseAmount: user.payment.amount,
          workshopFees: [],
          accompanyingPersonFees: 0,
          discountsApplied: []
        }
      })
    }

    return NextResponse.json({
      success: true,
      payments: [...embedded, ...payments.map(payment => ({
        _id: String(payment._id),
        amount: payment.amount,
        status: payment.status,
        razorpayOrderId: payment.razorpayOrderId,
        razorpayPaymentId: payment.razorpayPaymentId,
        createdAt: payment.createdAt,
        updatedAt: payment.updatedAt,
        workshopSelections: payment.workshopSelections,
        discountApplied: payment.discountApplied
      }))]
    })

  } catch (error) {
    console.error('Error fetching user payments:', error)
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 })
  }
}