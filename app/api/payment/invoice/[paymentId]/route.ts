import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import Payment from '@/lib/models/Payment'
import User from '@/lib/models/User'
import { generateInvoicePDF, InvoiceData } from '@/lib/pdf/invoice-generator'

export async function GET(
  request: NextRequest,
  { params }: { params: { paymentId: string } }
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

    // Get payment details
    let payment = await Payment.findById(params.paymentId)
    const isEmbedded = !payment
    if (!payment) {
      // Support embedded user payment via pseudo id: userpay_<userId>
      if (params.paymentId.startsWith('userpay_')) {
        const userId = params.paymentId.replace('userpay_', '')
        const embeddedUser = await User.findById(userId)
        if (!embeddedUser || !embeddedUser.payment) {
          return NextResponse.json({ success: false, message: 'Payment not found' }, { status: 404 })
        }
        // Compose a shim payment object
        payment = {
          _id: params.paymentId,
          userId: embeddedUser._id,
          registrationId: embeddedUser.registration?.registrationId || 'N/A',
          razorpayOrderId: 'N/A',
          razorpayPaymentId: embeddedUser.payment.bankTransferUTR || embeddedUser.payment.transactionId || 'BANK-TRANSFER',
          amount: {
            registration: embeddedUser.payment.amount,
            workshops: 0,
            accompanyingPersons: 0,
            discount: 0,
            total: embeddedUser.payment.amount,
            currency: 'INR'
          },
          breakdown: {
            registrationType: embeddedUser.registration?.type || 'ossap-member',
            baseAmount: embeddedUser.payment.amount,
            workshopFees: [],
            accompanyingPersonFees: 0,
            discountsApplied: []
          },
          status: embeddedUser.payment.status === 'verified' ? 'completed' : 'pending',
          transactionDate: embeddedUser.payment.paymentDate || new Date(),
          invoiceGenerated: true
        } as any
      } else {
        return NextResponse.json({ success: false, message: 'Payment not found' }, { status: 404 })
      }
    }

    // Get user details
    const user = await User.findById(payment.userId)
    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'User not found'
      }, { status: 404 })
    }

    // Check if user owns this payment or is admin
    if (payment.userId.toString() !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json({
        success: false,
        message: 'Access denied'
      }, { status: 403 })
    }

    // Generate PDF invoice
    const invoiceData: InvoiceData = {
      invoiceNumber: `OSSAP-${payment.registrationId}-INV-OSSAPCON2026`,
      invoiceDate: new Date(payment.transactionDate).toISOString(),
      registrationId: payment.registrationId,
      name: `${user.profile.title || ''} ${user.profile.firstName} ${user.profile.lastName}`.trim(),
      email: user.email,
      phone: user.profile.phone || '',
      address: user.profile.address ? 
        `${user.profile.address.street}, ${user.profile.address.city}, ${user.profile.address.state} - ${user.profile.address.pincode}` : 
        user.profile.institution || '',
      mciNumber: user.profile.mciNumber || '',
      registrationType: payment.breakdown?.registrationType?.replace('-', ' ').toUpperCase() || 'OSSAP MEMBER',
      tier: user.registration?.tier || 'Standard',
      amount: {
        registration: payment.amount.registration,
        workshops: payment.amount.workshops,
        accompanyingPersons: payment.amount.accompanyingPersons,
        discount: payment.amount.discount,
        total: payment.amount.total,
        currency: payment.amount.currency
      },
      breakdown: {
        registrationType: payment.breakdown?.registrationType || 'ossap-member',
        baseAmount: payment.breakdown?.baseAmount || payment.amount.registration,
        workshopFees: payment.breakdown?.workshopFees || [],
        accompanyingPersonFees: payment.breakdown?.accompanyingPersonFees || 0,
        discountsApplied: payment.breakdown?.discountsApplied || []
      },
      status: payment.status,
      paymentMethod: isEmbedded ? 'Bank Transfer' : 'Online Payment',
      transactionId: payment.razorpayPaymentId,
      bankTransferUTR: isEmbedded ? payment.razorpayPaymentId : undefined,
      paymentDate: payment.transactionDate ? new Date(payment.transactionDate).toISOString() : undefined,
      workshopSelections: payment.workshopSelections || [],
      accompanyingPersons: user.registration?.accompanyingPersons || []
    }

    try {
      const pdfBuffer = await generateInvoicePDF(invoiceData)
      const fileName = `OSSAP-${payment.registrationId}-INV-OSSAPCON2026.pdf`
      
      return new NextResponse(pdfBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `inline; filename="${fileName}"`,
          'Content-Length': pdfBuffer.length.toString(),
        },
      })
    } catch (pdfError) {
      console.error('PDF generation failed, falling back to HTML:', pdfError)
      
      // Fallback to HTML if PDF generation fails
      const invoiceHtml = `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <title>Invoice - ${payment.registrationId}</title>
          <style>
              body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; }
              .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
              .header h1 { color: #333; margin: 0; font-size: 24px; }
              .invoice-details { display: flex; justify-content: space-between; margin: 20px 0; }
              .payment-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
              .payment-table th, .payment-table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
              .payment-table th { background-color: #f5f5f5; font-weight: bold; }
              .amount { text-align: right; }
              .total-row { background-color: #f9f9f9; font-weight: bold; }
              .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; }
          </style>
      </head>
      <body>
          <div class="header">
              <h1>OSSAPCON 2026 Conference</h1>
              <p>Annual Conference of Orthopedic Surgeons Society of Andhra Pradesh</p>
              <p>August 7-9, 2026 | Kurnool, Andhra Pradesh</p>
              <h2 style="margin-top: 20px; color: #333;">INVOICE</h2>
          </div>
          <div class="invoice-details">
              <div>
                  <strong>Invoice Number:</strong> OSSAP-${payment.registrationId}-INV-OSSAPCON2026<br>
                  <strong>Invoice Date:</strong> ${new Date(payment.transactionDate).toLocaleDateString()}<br>
                  <strong>Status:</strong> ${payment.status === 'completed' ? 'Paid' : 'Pending'}
              </div>
          </div>
          <div class="bill-to">
              <h3>Bill To:</h3>
              <p>
                  <strong>${user.profile.title || ''} ${user.profile.firstName} ${user.profile.lastName}</strong><br>
                  ${user.email}<br>
                  ${user.profile.phone}<br>
                  ${user.profile.institution}<br>
                  MCI: ${user.profile.mciNumber || 'N/A'}
              </p>
          </div>
          <table class="payment-table">
              <thead>
                  <tr><th>Description</th><th>Type</th><th class="amount">Amount</th></tr>
              </thead>
              <tbody>
                  <tr>
                      <td>Registration Fee</td>
                      <td>${payment.breakdown?.registrationType?.replace('-', ' ').toUpperCase() || 'N/A'}</td>
                      <td class="amount">${payment.amount.currency} ${payment.amount.registration.toLocaleString()}</td>
                  </tr>
                  ${payment.amount.workshops > 0 ? `<tr><td>Workshop Fees</td><td>Additional</td><td class="amount">${payment.amount.currency} ${payment.amount.workshops.toLocaleString()}</td></tr>` : ''}
                  ${payment.amount.accompanyingPersons > 0 ? `<tr><td>Accompanying Persons</td><td>Additional</td><td class="amount">${payment.amount.currency} ${payment.amount.accompanyingPersons.toLocaleString()}</td></tr>` : ''}
                  ${payment.amount.discount > 0 ? `<tr><td>Discount Applied</td><td>Special</td><td class="amount">-${payment.amount.currency} ${payment.amount.discount.toLocaleString()}</td></tr>` : ''}
                  <tr class="total-row">
                      <td colspan="2"><strong>Total Amount</strong></td>
                      <td class="amount"><strong>${payment.amount.currency} ${payment.amount.total.toLocaleString()}</strong></td>
                  </tr>
              </tbody>
          </table>
          <div class="footer">
              <p><strong>Thank you for your registration!</strong></p>
              <p>For queries: contact@ossapcon2026.com</p>
              <p>Computer-generated invoice - no signature required</p>
          </div>
      </body>
      </html>
      `
      
      const fileName = `OSSAP-${payment.registrationId}-INV-OSSAPCON2026.html`
      return new NextResponse(invoiceHtml, {
        headers: {
          'Content-Type': 'text/html',
          'Content-Disposition': `inline; filename="${fileName}"`,
        },
      })
    }

  } catch (error) {
    console.error('Error generating invoice:', error)
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 })
  }
}