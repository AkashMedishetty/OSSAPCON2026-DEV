// Email template configuration
export const emailTemplateConfig = {
  // Enable/disable specific email templates
  templates: {
    registration: {
      enabled: true,
      subject: "Welcome to OSSAPCON 2026 - Registration Confirmed"
    },
    payment: {
      enabled: true,
      subject: "Payment Confirmation - OSSAPCON 2026"
    },
    paymentReminder: {
      enabled: true,
      subject: "Payment Reminder - OSSAPCON 2026"
    },
    customMessage: {
      enabled: true,
      subject: "Message from OSSAPCON 2026 Team"
    },
    test: {
      enabled: true, 
      subject: "Test Email - OSSAPCON 2026"
    },
    passwordReset: {
      enabled: true,
      subject: "Password Reset - OSSAPCON 2026"
    },
    bulkEmail: {
      enabled: true,
      subject: "Important Update - OSSAPCON 2026"
    }
  },

  // Global email settings
  settings: {
    fromName: "OSSAPCON 2026",
    fromEmail: "contact@ossapcon2026.com", // This should match your SMTP username
    replyTo: "contact@ossapcon2026.com",
    enableTracking: true,
    enableAutoResponder: true
  }
}

export function isTemplateEnabled(templateType: string): boolean {
  return emailTemplateConfig.templates[templateType as keyof typeof emailTemplateConfig.templates]?.enabled || false
}

export function getTemplateSubject(templateType: string): string {
  return emailTemplateConfig.templates[templateType as keyof typeof emailTemplateConfig.templates]?.subject || "OSSAPCON 2026"
}