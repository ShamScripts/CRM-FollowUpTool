# 📧 Email Notification Setup Guide

This guide will help you set up automated email notifications for follow-ups and reminders in your CRM system.

## 🚀 Quick Start

### 1. Choose Your Email Service

We support multiple email services. Choose the one that best fits your needs:

- **SendGrid** (Recommended) - Reliable, great deliverability
- **Resend** - Modern API, excellent developer experience
- **Nodemailer** - Self-hosted SMTP solution

### 2. Environment Variables

Create a `.env` file in your project root:

```env
# Email Configuration
EMAIL_API_KEY=your_api_key_here
FROM_EMAIL=noreply@yourcompany.com
FROM_NAME=Your CRM System
EMAIL_SERVICE=sendgrid  # or 'resend' or 'nodemailer'
```

## 📧 Email Service Setup

### Option A: SendGrid (Recommended)

1. **Sign up for SendGrid**
   - Go to [sendgrid.com](https://sendgrid.com)
   - Create a free account (100 emails/day free)

2. **Get API Key**
   - Navigate to Settings → API Keys
   - Create a new API Key with "Mail Send" permissions
   - Copy the API key

3. **Verify Sender**
   - Go to Settings → Sender Authentication
   - Verify your domain or at least one sender email

4. **Update Environment**
   ```env
   EMAIL_API_KEY=SG.your_sendgrid_api_key_here
   FROM_EMAIL=verified@yourdomain.com
   FROM_NAME=Your CRM System
   EMAIL_SERVICE=sendgrid
   ```

### Option B: Resend

1. **Sign up for Resend**
   - Go to [resend.com](https://resend.com)
   - Create a free account (3,000 emails/month free)

2. **Get API Key**
   - Navigate to API Keys in your dashboard
   - Create a new API Key
   - Copy the API key

3. **Verify Domain**
   - Add and verify your domain in the dashboard

4. **Update Environment**
   ```env
   EMAIL_API_KEY=re_your_resend_api_key_here
   FROM_EMAIL=noreply@yourdomain.com
   FROM_NAME=Your CRM System
   EMAIL_SERVICE=resend
   ```

### Option C: Nodemailer (SMTP)

1. **Choose SMTP Provider**
   - Gmail (requires app password)
   - Outlook/Hotmail
   - Your own SMTP server

2. **Get SMTP Credentials**
   - Host: smtp.gmail.com (for Gmail)
   - Port: 587
   - Username: your-email@gmail.com
   - Password: app password (not regular password)

3. **Update Environment**
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your_app_password
   FROM_EMAIL=your-email@gmail.com
   FROM_NAME=Your CRM System
   EMAIL_SERVICE=nodemailer
   ```

## 🔧 Implementation

### 1. Install Dependencies

```bash
# For SendGrid
npm install @sendgrid/mail

# For Resend
npm install resend

# For Nodemailer
npm install nodemailer
```

### 2. Update Email Service

The email service is already implemented in `src/services/emailService.ts`. You just need to:

1. **For SendGrid**: Uncomment and configure the SendGrid implementation
2. **For Resend**: Uncomment and configure the Resend implementation  
3. **For Nodemailer**: Uncomment and configure the Nodemailer implementation

### 3. Test Email Sending

```typescript
import { defaultEmailService } from './src/services/emailService';

// Test follow-up reminder
const testFollowUp = {
  leadName: 'John Smith',
  leadEmail: 'john@example.com',
  companyName: 'TechCorp',
  followUpType: 'call',
  scheduledDate: new Date(),
  notes: 'Follow up on product demo',
  assignedTo: 'Sales Team',
  priority: 'high'
};

// Send test email
const success = await defaultEmailService.sendFollowUpReminder(
  testFollowUp,
  'recipient@example.com'
);

console.log('Email sent:', success);
```

## 📋 Email Templates

### Available Templates

1. **Follow-up Reminder**
   - Subject: "Follow-up Reminder: {{followUpType}} with {{leadName}}"
   - Includes: Lead details, company, scheduled date, priority, notes

2. **Reminder Notification**
   - Subject: "Reminder: {{title}}"
   - Includes: Title, description, type, due date, priority

3. **Overdue Reminder**
   - Subject: "URGENT: Overdue Reminder - {{title}}"
   - Includes: Urgent styling, overdue warning

### Custom Templates

You can create custom email templates:

```typescript
import { defaultEmailService } from './src/services/emailService';

const customTemplate = {
  id: 'custom-template',
  name: 'Custom Template',
  subject: 'Custom: {{title}}',
  htmlContent: `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; }
        .header { background: #2563eb; color: white; padding: 20px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>{{title}}</h1>
      </div>
      <div style="padding: 20px;">
        <p>{{message}}</p>
      </div>
    </body>
    </html>
  `,
  textContent: `
    {{title}}
    
    {{message}}
  `,
  variables: ['title', 'message']
};

defaultEmailService.addTemplate(customTemplate);
```

## 🔄 Automated Email Scheduling

### 1. Follow-up Reminders

Follow-up reminders are automatically triggered when:
- A follow-up is scheduled
- 1 hour before the scheduled time
- 15 minutes before the scheduled time

### 2. Reminder Notifications

Reminder notifications are sent:
- When a reminder is created
- 1 day before the due date
- 1 hour before the due date
- When a reminder becomes overdue

### 3. Implementation

```typescript
// Check for due reminders every minute
setInterval(async () => {
  const now = new Date();
  
  // Check follow-ups
  const dueFollowUps = followUps.filter(followUp => {
    const timeDiff = followUp.scheduledDate.getTime() - now.getTime();
    return timeDiff > 0 && timeDiff <= 3600000; // 1 hour
  });
  
  // Send emails for due follow-ups
  for (const followUp of dueFollowUps) {
    await defaultEmailService.sendFollowUpReminder(
      followUp,
      'assigned-user@company.com'
    );
  }
  
  // Check reminders
  const dueReminders = reminders.filter(reminder => {
    const timeDiff = reminder.dueDate.getTime() - now.getTime();
    return timeDiff > 0 && timeDiff <= 3600000; // 1 hour
  });
  
  // Send emails for due reminders
  for (const reminder of dueReminders) {
    await defaultEmailService.sendReminderNotification(
      reminder,
      'assigned-user@company.com'
    );
  }
}, 60000); // Check every minute
```

## 📊 Email Analytics

### Track Email Performance

```typescript
interface EmailAnalytics {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
  failed: number;
}

// Track email metrics
const trackEmailMetrics = async (emailId: string, status: string) => {
  // Update email record in database
  await updateEmailRecord(emailId, { status });
  
  // Update analytics
  await updateEmailAnalytics(status);
};
```

### Email Reports

Generate email performance reports:

```typescript
const generateEmailReport = async (startDate: Date, endDate: Date) => {
  const emails = await getEmailRecords(startDate, endDate);
  
  const report = {
    totalSent: emails.length,
    delivered: emails.filter(e => e.status === 'delivered').length,
    opened: emails.filter(e => e.status === 'opened').length,
    clicked: emails.filter(e => e.status === 'clicked').length,
    bounced: emails.filter(e => e.status === 'bounced').length,
    deliveryRate: 0,
    openRate: 0,
    clickRate: 0
  };
  
  report.deliveryRate = (report.delivered / report.totalSent) * 100;
  report.openRate = (report.opened / report.delivered) * 100;
  report.clickRate = (report.clicked / report.opened) * 100;
  
  return report;
};
```

## 🛠️ Troubleshooting

### Common Issues

1. **Emails not sending**
   - Check API key is correct
   - Verify sender email is authenticated
   - Check email service status

2. **Emails going to spam**
   - Use a verified domain
   - Set up SPF and DKIM records
   - Avoid spam trigger words

3. **Rate limiting**
   - Check your email service limits
   - Implement rate limiting in your code
   - Use email queuing for high volume

### Debug Mode

Enable debug logging:

```typescript
// Add to your email service
const DEBUG_MODE = process.env.NODE_ENV === 'development';

if (DEBUG_MODE) {
  console.log('Email service config:', {
    service: this.config.service,
    fromEmail: this.config.fromEmail,
    fromName: this.config.fromName
  });
}
```

## 🔒 Security Best Practices

1. **API Key Security**
   - Never commit API keys to version control
   - Use environment variables
   - Rotate keys regularly

2. **Email Validation**
   - Validate email addresses before sending
   - Implement rate limiting per recipient
   - Use double opt-in for marketing emails

3. **Data Protection**
   - Encrypt sensitive data in emails
   - Follow GDPR requirements
   - Implement unsubscribe mechanisms

## 📈 Performance Optimization

1. **Email Queuing**
   ```typescript
   // Use a queue for high-volume email sending
   import Queue from 'bull';
   
   const emailQueue = new Queue('email-queue');
   
   emailQueue.process(async (job) => {
     const { emailData, recipientEmail } = job.data;
     return await defaultEmailService.sendEmail(emailData, recipientEmail);
   });
   ```

2. **Batch Sending**
   ```typescript
   // Send emails in batches
   const sendBatchEmails = async (emails: EmailData[]) => {
     const batchSize = 100;
     for (let i = 0; i < emails.length; i += batchSize) {
       const batch = emails.slice(i, i + batchSize);
       await Promise.all(batch.map(email => defaultEmailService.sendEmail(email)));
       await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limiting
     }
   };
   ```

## 🎯 Next Steps

1. **Set up your chosen email service**
2. **Configure environment variables**
3. **Test email sending**
4. **Implement automated scheduling**
5. **Monitor email performance**
6. **Optimize based on analytics**

## 📞 Support

If you need help with email setup:

1. Check the email service documentation
2. Review the troubleshooting section
3. Test with the provided examples
4. Monitor email service status pages

---

**Happy emailing! 📧✨** 