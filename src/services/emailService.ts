import { FollowUp } from '../types';

// Email service configuration
interface EmailConfig {
  apiKey: string;
  fromEmail: string;
  fromName: string;
  service: 'sendgrid' | 'resend' | 'nodemailer';
}

// Email template interface
interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlContent: string;
  textContent: string;
  variables: string[];
}

// Email data interface
interface EmailData {
  to: string | string[];
  subject: string;
  htmlContent: string;
  textContent?: string;
  attachments?: Array<{
    filename: string;
    content: string;
    contentType: string;
  }>;
}

// Follow-up reminder email data
interface FollowUpEmailData {
  leadName: string;
  leadEmail: string;
  companyName: string;
  followUpType: string;
  scheduledDate: Date;
  notes?: string;
  assignedTo: string;
  priority: string;
}

// Reminder email data
interface ReminderEmailData {
  title: string;
  description: string;
  type: string;
  priority: string;
  dueDate: Date;
  leadName?: string;
  companyName?: string;
  assignedTo: string;
}

class EmailService {
  private config: EmailConfig;
  private templates: EmailTemplate[];

  constructor(config: EmailConfig) {
    this.config = config;
    this.templates = this.initializeTemplates();
  }

  // Initialize default email templates
  private initializeTemplates(): EmailTemplate[] {
    return [
      {
        id: 'followup-reminder',
        name: 'Follow-up Reminder',
        subject: 'Follow-up Reminder: {{followUpType}} with {{leadName}}',
        htmlContent: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
              .content { padding: 20px; background: #f9fafb; }
              .footer { padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
              .priority-high { color: #dc2626; font-weight: bold; }
              .priority-medium { color: #ea580c; font-weight: bold; }
              .priority-low { color: #059669; font-weight: bold; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Follow-up Reminder</h1>
              </div>
              <div class="content">
                <h2>Hello {{assignedTo}},</h2>
                <p>This is a reminder for your scheduled follow-up:</p>
                
                <div style="background: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
                  <h3>Follow-up Details:</h3>
                  <ul>
                    <li><strong>Lead:</strong> {{leadName}}</li>
                    <li><strong>Company:</strong> {{companyName}}</li>
                    <li><strong>Type:</strong> {{followUpType}}</li>
                    <li><strong>Date:</strong> {{scheduledDate}}</li>
                    <li><strong>Priority:</strong> <span class="priority-{{priority}}">{{priority}}</span></li>
                    {{#if notes}}
                    <li><strong>Notes:</strong> {{notes}}</li>
                    {{/if}}
                  </ul>
                </div>
                
                <p>Please ensure you're prepared for this follow-up. You can view the full lead details in your CRM system.</p>
                
                <p>Best regards,<br>CRM System</p>
              </div>
              <div class="footer">
                <p>This is an automated reminder from your CRM system.</p>
              </div>
            </div>
          </body>
          </html>
        `,
        textContent: `
          Follow-up Reminder
        
          Hello {{assignedTo}},
          
          This is a reminder for your scheduled follow-up:
          
          Lead: {{leadName}}
          Company: {{companyName}}
          Type: {{followUpType}}
          Date: {{scheduledDate}}
          Priority: {{priority}}
          {{#if notes}}Notes: {{notes}}{{/if}}
          
          Please ensure you're prepared for this follow-up.
          
          Best regards,
          CRM System
        `,
        variables: ['leadName', 'companyName', 'followUpType', 'scheduledDate', 'priority', 'notes', 'assignedTo']
      },
      {
        id: 'reminder-notification',
        name: 'Reminder Notification',
        subject: 'Reminder: {{title}}',
        htmlContent: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
              .content { padding: 20px; background: #f9fafb; }
              .footer { padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
              .priority-high { color: #dc2626; font-weight: bold; }
              .priority-medium { color: #ea580c; font-weight: bold; }
              .priority-low { color: #059669; font-weight: bold; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Reminder Notification</h1>
              </div>
              <div class="content">
                <h2>Hello {{assignedTo}},</h2>
                <p>You have a reminder due:</p>
                
                <div style="background: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
                  <h3>Reminder Details:</h3>
                  <ul>
                    <li><strong>Title:</strong> {{title}}</li>
                    <li><strong>Description:</strong> {{description}}</li>
                    <li><strong>Type:</strong> {{type}}</li>
                    <li><strong>Due Date:</strong> {{dueDate}}</li>
                    <li><strong>Priority:</strong> <span class="priority-{{priority}}">{{priority}}</span></li>
                    {{#if leadName}}<li><strong>Lead:</strong> {{leadName}}</li>{{/if}}
                    {{#if companyName}}<li><strong>Company:</strong> {{companyName}}</li>{{/if}}
                  </ul>
                </div>
                
                <p>Please take action on this reminder as soon as possible.</p>
                
                <p>Best regards,<br>CRM System</p>
              </div>
              <div class="footer">
                <p>This is an automated reminder from your CRM system.</p>
              </div>
            </div>
          </body>
          </html>
        `,
        textContent: `
          Reminder Notification
        
          Hello {{assignedTo}},
          
          You have a reminder due:
          
          Title: {{title}}
          Description: {{description}}
          Type: {{type}}
          Due Date: {{dueDate}}
          Priority: {{priority}}
          {{#if leadName}}Lead: {{leadName}}{{/if}}
          {{#if companyName}}Company: {{companyName}}{{/if}}
          
          Please take action on this reminder as soon as possible.
          
          Best regards,
          CRM System
        `,
        variables: ['title', 'description', 'type', 'dueDate', 'priority', 'leadName', 'companyName', 'assignedTo']
      },
      {
        id: 'overdue-reminder',
        name: 'Overdue Reminder',
        subject: 'URGENT: Overdue Reminder - {{title}}',
        htmlContent: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
              .content { padding: 20px; background: #f9fafb; }
              .footer { padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
              .urgent { background: #fef2f2; border-left: 4px solid #dc2626; padding: 15px; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>⚠️ OVERDUE REMINDER</h1>
              </div>
              <div class="content">
                <h2>Hello {{assignedTo}},</h2>
                
                <div class="urgent">
                  <h3>⚠️ URGENT: This reminder is overdue!</h3>
                </div>
                
                <div style="background: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
                  <h3>Overdue Reminder Details:</h3>
                  <ul>
                    <li><strong>Title:</strong> {{title}}</li>
                    <li><strong>Description:</strong> {{description}}</li>
                    <li><strong>Type:</strong> {{type}}</li>
                    <li><strong>Due Date:</strong> {{dueDate}}</li>
                    <li><strong>Priority:</strong> {{priority}}</li>
                    {{#if leadName}}<li><strong>Lead:</strong> {{leadName}}</li>{{/if}}
                    {{#if companyName}}<li><strong>Company:</strong> {{companyName}}</li>{{/if}}
                  </ul>
                </div>
                
                <p><strong>This reminder is overdue. Please take immediate action!</strong></p>
                
                <p>Best regards,<br>CRM System</p>
              </div>
              <div class="footer">
                <p>This is an automated reminder from your CRM system.</p>
              </div>
            </div>
          </body>
          </html>
        `,
        textContent: `
          URGENT: OVERDUE REMINDER
        
          Hello {{assignedTo}},
          
          ⚠️ URGENT: This reminder is overdue!
          
          Title: {{title}}
          Description: {{description}}
          Type: {{type}}
          Due Date: {{dueDate}}
          Priority: {{priority}}
          {{#if leadName}}Lead: {{leadName}}{{/if}}
          {{#if companyName}}Company: {{companyName}}{{/if}}
          
          This reminder is overdue. Please take immediate action!
          
          Best regards,
          CRM System
        `,
        variables: ['title', 'description', 'type', 'dueDate', 'priority', 'leadName', 'companyName', 'assignedTo']
      }
    ];
  }

  // Send email using the configured service
  async sendEmail(emailData: EmailData): Promise<boolean> {
    try {
      switch (this.config.service) {
        case 'sendgrid':
          return await this.sendViaSendGrid(emailData);
        case 'resend':
          return await this.sendViaResend(emailData);
        case 'nodemailer':
          return await this.sendViaNodemailer(emailData);
        default:
          throw new Error(`Unsupported email service: ${this.config.service}`);
      }
    } catch (error) {
      console.error('Email sending failed:', error);
      return false;
    }
  }

  // SendGrid implementation
  private async sendViaSendGrid(emailData: EmailData): Promise<boolean> {
    // This would use SendGrid API
    // For now, we'll simulate the API call
    console.log('Sending email via SendGrid:', {
      to: emailData.to,
      from: this.config.fromEmail,
      subject: emailData.subject,
      html: emailData.htmlContent
    });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return true;
  }

  // Resend implementation
  private async sendViaResend(emailData: EmailData): Promise<boolean> {
    // This would use Resend API
    console.log('Sending email via Resend:', {
      to: emailData.to,
      from: this.config.fromEmail,
      subject: emailData.subject,
      html: emailData.htmlContent
    });
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    return true;
  }

  // Nodemailer implementation
  private async sendViaNodemailer(emailData: EmailData): Promise<boolean> {
    // This would use Nodemailer with SMTP
    console.log('Sending email via Nodemailer:', {
      to: emailData.to,
      from: this.config.fromEmail,
      subject: emailData.subject,
      html: emailData.htmlContent
    });
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    return true;
  }

  // Send follow-up reminder email
  async sendFollowUpReminder(data: FollowUpEmailData, recipientEmail: string): Promise<boolean> {
    const template = this.templates.find(t => t.id === 'followup-reminder');
    if (!template) {
      throw new Error('Follow-up reminder template not found');
    }

    const subject = this.replaceVariables(template.subject, {
      followUpType: data.followUpType,
      leadName: data.leadName
    });

    const htmlContent = this.replaceVariables(template.htmlContent, {
      leadName: data.leadName,
      companyName: data.companyName,
      followUpType: data.followUpType,
      scheduledDate: data.scheduledDate.toLocaleString(),
      priority: data.priority,
      notes: data.notes || '',
      assignedTo: data.assignedTo
    });

    const textContent = this.replaceVariables(template.textContent, {
      leadName: data.leadName,
      companyName: data.companyName,
      followUpType: data.followUpType,
      scheduledDate: data.scheduledDate.toLocaleString(),
      priority: data.priority,
      notes: data.notes || '',
      assignedTo: data.assignedTo
    });

    return await this.sendEmail({
      to: recipientEmail,
      subject,
      htmlContent,
      textContent
    });
  }

  // Send reminder notification email
  async sendReminderNotification(data: ReminderEmailData, recipientEmail: string): Promise<boolean> {
    const template = this.templates.find(t => t.id === 'reminder-notification');
    if (!template) {
      throw new Error('Reminder notification template not found');
    }

    const subject = this.replaceVariables(template.subject, {
      title: data.title
    });

    const htmlContent = this.replaceVariables(template.htmlContent, {
      title: data.title,
      description: data.description,
      type: data.type,
      dueDate: data.dueDate.toLocaleString(),
      priority: data.priority,
      leadName: data.leadName || '',
      companyName: data.companyName || '',
      assignedTo: data.assignedTo
    });

    const textContent = this.replaceVariables(template.textContent, {
      title: data.title,
      description: data.description,
      type: data.type,
      dueDate: data.dueDate.toLocaleString(),
      priority: data.priority,
      leadName: data.leadName || '',
      companyName: data.companyName || '',
      assignedTo: data.assignedTo
    });

    return await this.sendEmail({
      to: recipientEmail,
      subject,
      htmlContent,
      textContent
    });
  }

  // Send overdue reminder email
  async sendOverdueReminder(data: ReminderEmailData, recipientEmail: string): Promise<boolean> {
    const template = this.templates.find(t => t.id === 'overdue-reminder');
    if (!template) {
      throw new Error('Overdue reminder template not found');
    }

    const subject = this.replaceVariables(template.subject, {
      title: data.title
    });

    const htmlContent = this.replaceVariables(template.htmlContent, {
      title: data.title,
      description: data.description,
      type: data.type,
      dueDate: data.dueDate.toLocaleString(),
      priority: data.priority,
      leadName: data.leadName || '',
      companyName: data.companyName || '',
      assignedTo: data.assignedTo
    });

    const textContent = this.replaceVariables(template.textContent, {
      title: data.title,
      description: data.description,
      type: data.type,
      dueDate: data.dueDate.toLocaleString(),
      priority: data.priority,
      leadName: data.leadName || '',
      companyName: data.companyName || '',
      assignedTo: data.assignedTo
    });

    return await this.sendEmail({
      to: recipientEmail,
      subject,
      htmlContent,
      textContent
    });
  }

  // Replace variables in template
  private replaceVariables(template: string, variables: Record<string, string>): string {
    let result = template;
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      result = result.replace(regex, value);
    });
    return result;
  }

  // Get all templates
  getTemplates(): EmailTemplate[] {
    return this.templates;
  }

  // Add custom template
  addTemplate(template: EmailTemplate): void {
    this.templates.push(template);
  }

  // Update configuration
  updateConfig(newConfig: Partial<EmailConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}

// Create default email service instance
const defaultEmailService = new EmailService({
  apiKey: process.env.EMAIL_API_KEY || '',
  fromEmail: process.env.FROM_EMAIL || 'noreply@yourcrm.com',
  fromName: process.env.FROM_NAME || 'CRM System',
  service: 'sendgrid'
});

export { EmailService, defaultEmailService };
export type { EmailConfig, EmailTemplate, EmailData, FollowUpEmailData, ReminderEmailData }; 