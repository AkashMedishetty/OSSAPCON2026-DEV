import puppeteer from 'puppeteer'

export interface InvoiceData {
  invoiceNumber: string
  invoiceDate: string
  registrationId: string
  name: string
  email: string
  phone: string
  address: string
  mciNumber: string
  registrationType: string
  tier: string
  amount: {
    registration: number
    workshops: number
    accompanyingPersons: number
    discount: number
    total: number
    currency: string
  }
  breakdown: {
    registrationType: string
    baseAmount: number
    workshopFees: Array<{ name: string; amount: number }>
    accompanyingPersonFees: number
    discountsApplied: Array<{ name: string; amount: number }>
  }
  status: string
  paymentMethod: string
  transactionId?: string
  bankTransferUTR?: string
  paymentDate?: string
  workshopSelections?: Array<{ name: string; amount: number }>
  accompanyingPersons?: Array<{ name: string; age: number }>
}

export async function generateInvoicePDF(invoiceData: InvoiceData): Promise<Buffer> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
  
  try {
    const page = await browser.newPage()
    
    const html = generateInvoiceHTML(invoiceData)
    
    await page.setContent(html, { waitUntil: 'networkidle0' })
    
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm'
      }
    })
    
    return pdf
  } finally {
    await browser.close()
  }
}

function generateInvoiceHTML(data: InvoiceData): string {
  const formatCurrency = (amount: number, currency: string = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice - ${data.invoiceNumber}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #fff;
        }
        
        .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 40px;
            background: #fff;
        }
        
        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 3px solid #2563eb;
        }
        
        .logo-section {
            flex: 1;
        }
        
        .logo-section h1 {
            font-size: 28px;
            font-weight: 700;
            color: #2563eb;
            margin-bottom: 8px;
        }
        
        .logo-section p {
            color: #6b7280;
            font-size: 14px;
        }
        
        .invoice-details {
            text-align: right;
            flex: 1;
        }
        
        .invoice-details h2 {
            font-size: 24px;
            color: #1f2937;
            margin-bottom: 20px;
        }
        
        .invoice-meta {
            background: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #2563eb;
        }
        
        .invoice-meta p {
            margin-bottom: 8px;
            font-size: 14px;
        }
        
        .invoice-meta strong {
            color: #374151;
            font-weight: 600;
        }
        
        .status-badge {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .status-paid {
            background: #dcfce7;
            color: #166534;
        }
        
        .status-pending {
            background: #fef3c7;
            color: #92400e;
        }
        
        .billing-section {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            margin-bottom: 40px;
        }
        
        .billing-info h3 {
            font-size: 18px;
            color: #1f2937;
            margin-bottom: 15px;
            padding-bottom: 8px;
            border-bottom: 2px solid #e5e7eb;
        }
        
        .billing-info p {
            margin-bottom: 6px;
            color: #4b5563;
            font-size: 14px;
        }
        
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
            background: #fff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        
        .items-table th {
            background: #2563eb;
            color: white;
            padding: 15px 20px;
            text-align: left;
            font-weight: 600;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .items-table td {
            padding: 15px 20px;
            border-bottom: 1px solid #e5e7eb;
            font-size: 14px;
        }
        
        .items-table tr:nth-child(even) {
            background: #f9fafb;
        }
        
        .items-table tr:last-child td {
            border-bottom: none;
        }
        
        .text-right {
            text-align: right;
        }
        
        .text-center {
            text-align: center;
        }
        
        .total-section {
            background: #f8fafc;
            padding: 25px;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
        }
        
        .total-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            padding: 8px 0;
        }
        
        .total-row.final {
            font-size: 18px;
            font-weight: 700;
            color: #1f2937;
            border-top: 2px solid #2563eb;
            padding-top: 15px;
            margin-top: 15px;
        }
        
        .total-label {
            color: #6b7280;
        }
        
        .total-amount {
            font-weight: 600;
            color: #1f2937;
        }
        
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            color: #6b7280;
            font-size: 12px;
        }
        
        .footer p {
            margin-bottom: 8px;
        }
        
        .payment-info {
            background: #eff6ff;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #2563eb;
            margin-top: 20px;
        }
        
        .payment-info h4 {
            color: #1e40af;
            margin-bottom: 10px;
            font-size: 16px;
        }
        
        .payment-info p {
            margin-bottom: 5px;
            font-size: 14px;
            color: #374151;
        }
    </style>
</head>
<body>
    <div class="invoice-container">
        <!-- Header -->
        <div class="header">
            <div class="logo-section">
                <h1>OSSAPCON 2026</h1>
                <p>Orthopaedic Society of South Asia Pacific</p>
                <p>Annual Conference & Workshop</p>
            </div>
            <div class="invoice-details">
                <h2>INVOICE</h2>
                <div class="invoice-meta">
                    <p><strong>Invoice #:</strong> ${data.invoiceNumber}</p>
                    <p><strong>Date:</strong> ${formatDate(data.invoiceDate)}</p>
                    <p><strong>Registration ID:</strong> ${data.registrationId}</p>
                    <p><strong>Status:</strong> 
                        <span class="status-badge ${data.status === 'completed' || data.status === 'verified' || data.status === 'paid' ? 'status-paid' : 'status-pending'}">
                            ${data.status === 'completed' || data.status === 'verified' || data.status === 'paid' ? 'Paid' : 'Pending'}
                        </span>
                    </p>
                </div>
            </div>
        </div>

        <!-- Billing Information -->
        <div class="billing-section">
            <div class="billing-info">
                <h3>Bill To</h3>
                <p><strong>${data.name}</strong></p>
                <p>${data.email}</p>
                <p>${data.phone}</p>
                <p>${data.address}</p>
                <p><strong>MCI Number:</strong> ${data.mciNumber}</p>
            </div>
            <div class="billing-info">
                <h3>Event Details</h3>
                <p><strong>Event:</strong> OSSAPCON 2026</p>
                <p><strong>Registration Type:</strong> ${data.registrationType}</p>
                <p><strong>Tier:</strong> ${data.tier}</p>
                <p><strong>Payment Method:</strong> ${data.paymentMethod}</p>
                ${data.transactionId ? `<p><strong>Transaction ID:</strong> ${data.transactionId}</p>` : ''}
                ${data.bankTransferUTR ? `<p><strong>UTR Number:</strong> ${data.bankTransferUTR}</p>` : ''}
                ${data.paymentDate ? `<p><strong>Payment Date:</strong> ${formatDate(data.paymentDate)}</p>` : ''}
            </div>
        </div>

        <!-- Items Table -->
        <table class="items-table">
            <thead>
                <tr>
                    <th>Description</th>
                    <th class="text-center">Type</th>
                    <th class="text-right">Amount</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        <strong>Conference Registration</strong><br>
                        <small>${data.registrationType} - ${data.tier}</small>
                    </td>
                    <td class="text-center">Registration</td>
                    <td class="text-right">${formatCurrency(data.amount.registration, data.amount.currency)}</td>
                </tr>
                
                ${data.breakdown.workshopFees.map(workshop => `
                <tr>
                    <td>
                        <strong>${workshop.name}</strong><br>
                        <small>Workshop</small>
                    </td>
                    <td class="text-center">Workshop</td>
                    <td class="text-right">${formatCurrency(workshop.amount, data.amount.currency)}</td>
                </tr>
                `).join('')}
                
                ${data.breakdown.accompanyingPersonFees > 0 ? `
                <tr>
                    <td>
                        <strong>Accompanying Person Fees</strong><br>
                        <small>${data.accompanyingPersons?.length || 0} person(s)</small>
                    </td>
                    <td class="text-center">Accompanying</td>
                    <td class="text-right">${formatCurrency(data.breakdown.accompanyingPersonFees, data.amount.currency)}</td>
                </tr>
                ` : ''}
                
                ${data.breakdown.discountsApplied.map(discount => `
                <tr>
                    <td>
                        <strong>${discount.name}</strong><br>
                        <small>Discount Applied</small>
                    </td>
                    <td class="text-center">Discount</td>
                    <td class="text-right" style="color: #dc2626;">-${formatCurrency(discount.amount, data.amount.currency)}</td>
                </tr>
                `).join('')}
            </tbody>
        </table>

        <!-- Total Section -->
        <div class="total-section">
            <div class="total-row">
                <span class="total-label">Subtotal:</span>
                <span class="total-amount">${formatCurrency(data.breakdown.baseAmount + data.breakdown.workshopFees.reduce((sum, w) => sum + w.amount, 0) + data.breakdown.accompanyingPersonFees, data.amount.currency)}</span>
            </div>
            ${data.breakdown.discountsApplied.length > 0 ? `
            <div class="total-row">
                <span class="total-label">Discount:</span>
                <span class="total-amount" style="color: #dc2626;">-${formatCurrency(data.breakdown.discountsApplied.reduce((sum, d) => sum + d.amount, 0), data.amount.currency)}</span>
            </div>
            ` : ''}
            <div class="total-row final">
                <span class="total-label">Total Amount:</span>
                <span class="total-amount">${formatCurrency(data.amount.total, data.amount.currency)}</span>
            </div>
        </div>

        <!-- Payment Information -->
        <div class="payment-info">
            <h4>Payment Information</h4>
            <p><strong>Payment Method:</strong> ${data.paymentMethod}</p>
            ${data.transactionId ? `<p><strong>Transaction ID:</strong> ${data.transactionId}</p>` : ''}
            ${data.bankTransferUTR ? `<p><strong>UTR Number:</strong> ${data.bankTransferUTR}</p>` : ''}
            ${data.paymentDate ? `<p><strong>Payment Date:</strong> ${formatDate(data.paymentDate)}</p>` : ''}
            <p><strong>Status:</strong> ${data.status === 'completed' || data.status === 'verified' || data.status === 'paid' ? 'Payment Verified' : 'Payment Pending'}</p>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p><strong>Thank you for your registration!</strong></p>
            <p>For any queries, please contact us at contact@ossapcon2026.com</p>
            <p>This is a computer-generated invoice and does not require a signature.</p>
            <p style="margin-top: 15px; font-size: 10px; color: #9ca3af;">
                Generated on ${new Date().toLocaleString('en-IN')} | OSSAPCON 2026
            </p>
        </div>
    </div>
</body>
</html>
  `
}
