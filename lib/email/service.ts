import { sendEmail, sendBulkEmails } from './smtp'
import { 
  getRegistrationConfirmationTemplate, 
  getPaymentConfirmationTemplate, 
  getPasswordResetTemplate,
  getBulkEmailTemplate,
  getPaymentReminderTemplate,
  getCustomMessageTemplate
} from './templates'
import { getEmailConfig } from '@/lib/config'
import { emailTemplateConfig } from './config'

export class EmailService {
  /**
   * Send registration confirmation email
   */
  static async sendRegistrationConfirmation(userData: {
    email: string
    name: string
    registrationId: string
    registrationType: string
    workshopSelections?: string[]
    accompanyingPersons?: number
  }) {
    try {
      // Use static config by default, but allow database override for template content
      let template = emailTemplateConfig.templates.registration
      
      try {
        const dbEmailConfig = await getEmailConfig()
        if (dbEmailConfig?.templates?.registration) {
          template = { ...template, ...dbEmailConfig.templates.registration }
        }
      } catch (error) {
        console.log('Using static email config - database config unavailable')
      }
      
      if (!template?.enabled) {
        console.log('Registration email template is disabled')
        return { success: false, message: 'Email template disabled' }
      }

      const html = getRegistrationConfirmationTemplate(userData)
      
      return await sendEmail({
        to: userData.email,
        subject: template.subject || 'Application Received - OSSAPCON 2026',
        html,
        text: `Registration confirmation for ${userData.name}. Registration ID: ${userData.registrationId}`
      })
    } catch (error) {
      console.error('Error sending registration confirmation:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  /**
   * Send payment confirmation and invoice email
   */
  static async sendPaymentConfirmation(paymentData: {
    email: string
    name: string
    registrationId: string
    amount: number
    verificationDate?: Date
    currency?: string
    transactionId?: string
    paymentDate?: string
    breakdown?: any
  }) {
    try {
      // Use static config by default, but allow database override for template content
      let template = emailTemplateConfig.templates.payment
      
      try {
        const dbEmailConfig = await getEmailConfig()
        if (dbEmailConfig?.templates?.payment) {
          template = { ...template, ...dbEmailConfig.templates.payment }
        }
      } catch (error) {
        console.log('Using static email config - database config unavailable')
      }
      
      if (!template?.enabled) {
        console.log('Payment email template is disabled')
        return { success: false, message: 'Email template disabled' }
      }

      const html = getPaymentConfirmationTemplate(paymentData)

      // Build simple text-based PDF attachment as HTML-to-PDF is not available here; send HTML invoice file
      const fileName = `${paymentData.registrationId}-INV-OSSAPCON2026.html`
      const invoiceHtml = `<html><body><pre>${JSON.stringify(paymentData, null, 2)}</pre></body></html>`
      
      return await sendEmail({
        to: paymentData.email,
        subject: template.subject || 'Payment Confirmation & Invoice - OSSAPCON 2026',
        html,
        text: `Payment confirmation for ${paymentData.name}. Amount: ${paymentData.currency} ${paymentData.amount}`,
        attachments: [
          {
            filename: fileName,
            content: invoiceHtml,
            contentType: 'text/html'
          }
        ]
      })
    } catch (error) {
      console.error('Error sending payment confirmation:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  /**
   * Send payment rejection email
   */
  static async sendPaymentRejection(rejectionData: {
    email: string
    name: string
    registrationId: string
    reason: string
    rejectionDate: Date
  }) {
    try {
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc3545;">Payment Verification Failed - OSSAPCON 2026</h2>
          <p>Dear ${rejectionData.name},</p>
          <p>We regret to inform you that your payment verification for OSSAPCON 2026 has not been successful.</p>
          <div style="background-color: #f8f9fa; padding: 20px; border-left: 4px solid #dc3545; margin: 20px 0;">
            <strong>Registration ID:</strong> ${rejectionData.registrationId}<br>
            <strong>Rejection Date:</strong> ${rejectionData.rejectionDate.toLocaleDateString()}<br>
            <strong>Reason:</strong> ${rejectionData.reason}
          </div>
          <p>Please contact our team at <a href="mailto:support@ossapcon2026.com">support@ossapcon2026.com</a> if you believe this is an error or need assistance.</p>
          <p>Best regards,<br>OSSAPCON 2026 Team</p>
        </div>
      `;
      
      return await sendEmail({
        to: rejectionData.email,
        subject: 'Payment Verification Failed - OSSAPCON 2026',
        html,
        text: `Payment verification failed for registration ${rejectionData.registrationId}. Reason: ${rejectionData.reason}`
      })
    } catch (error) {
      console.error('Error sending payment rejection:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  /**
   * Send password reset email
   */
  static async sendPasswordReset(resetData: {
    email: string
    name: string
    resetLink: string
    expiryTime: string
  }) {
    try {
      const emailConfig = await getEmailConfig()
      const template = emailConfig?.templates?.passwordReset
      
      if (!template?.enabled) {
        console.log('Password reset email template is disabled')
        return { success: false, message: 'Email template disabled' }
      }

      const html = getPasswordResetTemplate(resetData)
      
      return await sendEmail({
        to: resetData.email,
        subject: template.subject || 'Password Reset - OSSAPCON 2026',
        html,
        text: `Password reset request for ${resetData.name}. Reset link: ${resetData.resetLink}`
      })
    } catch (error) {
      console.error('Error sending password reset email:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  /**
   * Send bulk email to multiple recipients
   */
  static async sendBulkEmail(emailData: {
    recipients: string[]
    subject: string
    content: string
    senderName?: string
  }) {
    try {
      const emailConfig = await getEmailConfig()
      const template = emailConfig?.templates?.bulkEmail
      
      if (!template?.enabled) {
        console.log('Bulk email template is disabled')
        return { success: false, message: 'Email template disabled' }
      }

      const html = getBulkEmailTemplate(emailData)
      const rateLimiting = emailConfig?.rateLimiting || {}
      
      return await sendBulkEmails({
        recipients: emailData.recipients,
        subject: emailData.subject,
        html,
        text: emailData.content,
        batchSize: rateLimiting.batchSize || 10,
        delay: rateLimiting.delayBetweenBatches || 1000
      })
    } catch (error) {
      console.error('Error sending bulk email:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  /**
   * Send payment reminder email
   */
  static async sendPaymentReminder(userData: {
    email: string
    name: string
    registrationId: string
    registrationType: string
    daysOverdue?: number
    amount?: number
    currency?: string
  }) {
    try {
      const emailConfig = await getEmailConfig()
      const template = emailConfig?.templates?.paymentReminder
      
      if (!template?.enabled) {
        console.log('Payment reminder email template is disabled')
        return { success: false, message: 'Email template disabled' }
      }

      const html = getPaymentReminderTemplate(userData)
      
      return await sendEmail({
        to: userData.email,
        subject: template.subject || 'Payment Reminder - OSSAPCON 2026',
        html,
        text: `Payment reminder for ${userData.name}. Registration ID: ${userData.registrationId}`
      })
    } catch (error) {
      console.error('Error sending payment reminder:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  /**
   * Send custom message email
   */
  static async sendCustomMessage(messageData: {
    email: string
    recipientName: string
    subject: string
    content: string
    senderName?: string
  }) {
    try {
      const emailConfig = await getEmailConfig()
      const template = emailConfig?.templates?.customMessage
      
      if (!template?.enabled) {
        console.log('Custom message email template is disabled')
        return { success: false, message: 'Email template disabled' }
      }

      const html = getCustomMessageTemplate(messageData)
      
      return await sendEmail({
        to: messageData.email,
        subject: messageData.subject,
        html,
        text: messageData.content
      })
    } catch (error) {
      console.error('Error sending custom message:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  /**
   * Send conference reminder email
   */
  static async sendConferenceReminder(userData: {
    email: string
    name: string
    registrationId: string
    daysUntilConference: number
  }) {
    try {
      const emailConfig = await getEmailConfig()
      const template = emailConfig?.templates?.reminder
      
      if (!template?.enabled) {
        console.log('Reminder email template is disabled')
        return { success: false, message: 'Email template disabled' }
      }

      const content = `
        <h2>Conference Reminder</h2>
        <p>Dear ${userData.name},</p>
        
        <p>This is a friendly reminder that <strong>OSSAPCON 2026</strong> is just ${userData.daysUntilConference} days away!</p>
        
        <div class="highlight">
          <h3>Your Registration Details:</h3>
          <p><strong>Registration ID:</strong> ${userData.registrationId}</p>
          <p><strong>Conference Dates:</strong> August 7-9, 2026</p>
          <p><strong>Venue:</strong> Kurnool Medical College, Kurnool, Andhra Pradesh</p>
        </div>
        
        <p><strong>What to expect:</strong></p>
        <ul>
          <li>Cutting-edge presentations on orthopedic care</li>
          <li>Hands-on workshops and training sessions</li>
          <li>Networking opportunities with leading experts</li>
          <li>Latest research and clinical innovations</li>
        </ul>
        
        <p style="text-align: center;">
          <a href="${process.env.APP_URL}/dashboard" class="button">View Conference Details</a>
        </p>
        
        <p>We look forward to seeing you at the conference!</p>
        
        <p>Best regards,<br>
        <strong>OSSAPCON 2026 Organizing Committee</strong></p>
      `

      const html = getBulkEmailTemplate({
        subject: 'Conference Reminder',
        content,
        senderName: 'OSSAPCON 2026 Team'
      })
      
      return await sendEmail({
        to: userData.email,
        subject: template.subject || 'Conference Reminder - OSSAPCON 2026',
        html,
        text: `Conference reminder for ${userData.name}. ${userData.daysUntilConference} days until OSSAPCON 2026!`
      })
    } catch (error) {
      console.error('Error sending conference reminder:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }
}