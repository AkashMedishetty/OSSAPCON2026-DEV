import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import connectDB from '@/lib/mongodb'
import Payment from '@/lib/models/Payment'
import User from '@/lib/models/User'

// Optional runtime to ensure edge/body handling defaults
export const runtime = 'nodejs'

function verifyWebhookSignature(rawBody: string, signature: string | null, secret: string) {
  if (!signature) return false
  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex')
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
}

async function markUserPaidAndUpdateSeats(user: any) {
  // Update user status
  user.registration.status = 'paid'
  user.registration.paymentDate = new Date()
  await user.save()

  // Atomically increment bookedSeats for selected workshops (if any)
  if (user.registration.workshopSelections && user.registration.workshopSelections.length > 0) {
    const Workshop = (await import('@/lib/models/Workshop')).default
    for (const workshopId of user.registration.workshopSelections) {
      // Only increment if bookedSeats < maxSeats
      await Workshop.findOneAndUpdate(
        {
          id: workshopId,
          $expr: { $lt: ["$bookedSeats", "$maxSeats"] },
        },
        { $inc: { bookedSeats: 1 } },
        { new: true }
      )
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET
    if (!webhookSecret) {
      return NextResponse.json({ success: false, message: 'Webhook secret not configured' }, { status: 500 })
    }

    // Razorpay requires signature to be verified against the raw body
    const rawBody = await request.text()
    const signature = request.headers.get('x-razorpay-signature')
    const isValid = verifyWebhookSignature(rawBody, signature, webhookSecret)
    if (!isValid) {
      return NextResponse.json({ success: false, message: 'Invalid signature' }, { status: 400 })
    }

    const payload = JSON.parse(rawBody)
    const event: string = payload.event

    // We will handle payment.captured and order.paid as successful payments
    const paymentEntity = payload?.payload?.payment?.entity
    const orderEntity = payload?.payload?.order?.entity

    // Extract identifiers
    const razorpayPaymentId: string | undefined = paymentEntity?.id
    const razorpayOrderId: string | undefined = paymentEntity?.order_id || orderEntity?.id

    if (!razorpayOrderId) {
      return NextResponse.json({ success: false, message: 'Missing order id in webhook' }, { status: 400 })
    }

    await connectDB()

    if (event === 'payment.authorized') {
      // Do not mark as paid on authorization. Wait for capture or a separate capture flow.
      return NextResponse.json({ success: true })
    }

    if (event !== 'payment.captured' && event !== 'order.paid') {
      // Ignore other events
      return NextResponse.json({ success: true })
    }

    // Idempotency: if a payment with this payment id already exists, acknowledge
    if (razorpayPaymentId) {
      const existingByPayment = await Payment.findOne({ razorpayPaymentId }).lean()
      if (existingByPayment) {
        return NextResponse.json({ success: true })
      }
    }
    // Also check by order id
    const existingByOrder = await Payment.findOne({ razorpayOrderId }).lean()
    if (existingByOrder) {
      return NextResponse.json({ success: true })
    }

    // Determine notes to map to our user/registration
    const notes = orderEntity?.notes || paymentEntity?.notes || {}
    const registrationIdFromNotes: string | undefined = notes.registrationId || notes.registration_id
    const userIdFromNotes: string | undefined = notes.userId || notes.user_id

    // Find user to attach payment to
    let user = null as any
    if (userIdFromNotes) {
      user = await User.findById(userIdFromNotes)
    }
    if (!user && registrationIdFromNotes) {
      user = await User.findOne({ 'registration.registrationId': registrationIdFromNotes })
    }

    if (!user) {
      // Cannot reconcile without user; acknowledge to avoid retries, but log server-side
      console.error('Webhook: user not found for order', {
        razorpayOrderId,
        registrationIdFromNotes,
        userIdFromNotes,
      })
      return NextResponse.json({ success: true })
    }

    // Build payment amounts
    const amountTotal = (paymentEntity?.amount || orderEntity?.amount || 0) / 100
    const currency = (paymentEntity?.currency || orderEntity?.currency || 'INR').toUpperCase()

    // Minimal breakdown. For full parity, consider centralizing calculation.
    const registrationType = user.registration?.type || 'ntsi-member'
    const breakdown = {
      registrationType,
      baseAmount: amountTotal, // Unknown split at webhook; store total as base
      workshopFees: [] as Array<{ name: string; amount: number }>,
      accompanyingPersonFees: 0,
      discountsApplied: [] as Array<{ type: string; code?: string; percentage: number; amount: number }>,
    }

    const amount = {
      registration: amountTotal,
      workshops: 0,
      accompanyingPersons: 0,
      discount: 0,
      total: amountTotal,
      currency,
    }

    // Create payment record
    const paymentRecord = new Payment({
      userId: user._id,
      registrationId: user.registration.registrationId,
      razorpayOrderId: razorpayOrderId,
      razorpayPaymentId: razorpayPaymentId,
      amount,
      breakdown,
      status: 'completed',
      paymentMethod: paymentEntity?.method,
      transactionDate: paymentEntity?.created_at ? new Date(paymentEntity.created_at * 1000) : new Date(),
      invoiceGenerated: true,
    })
    await paymentRecord.save()

    // Mark user paid and increment seats
    await markUserPaidAndUpdateSeats(user)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}


