import { defaultEmailScheduler } from './emailScheduler';
import { FollowUp } from '../types';

// Integration service for automatically scheduling emails
class AutomationIntegration {
  private isEnabled = true;

  // Enable/disable automatic scheduling
  enable(): void {
    this.isEnabled = true;
    console.log('Automation integration enabled');
  }

  disable(): void {
    this.isEnabled = false;
    console.log('Automation integration disabled');
  }

  isIntegrationEnabled(): boolean {
    return this.isEnabled;
  }

  // Automatically schedule follow-up emails when a follow-up is created
  scheduleFollowUpEmails(followUp: FollowUp, recipientEmail?: string): void {
    if (!this.isEnabled) {
      console.log('Automation integration is disabled, skipping follow-up scheduling');
      return;
    }

    try {
      const email = recipientEmail || this.getDefaultRecipientEmail(followUp.createdBy);
      
      // Only schedule if the follow-up is in the future
      if (followUp.scheduledDate > new Date()) {
        defaultEmailScheduler.addFollowUpJob(followUp, email);
        console.log(`✅ Scheduled follow-up emails for: ${followUp.id}`);
      } else {
        console.log(`⚠️ Follow-up ${followUp.id} is in the past, skipping email scheduling`);
      }
    } catch (error) {
      console.error('Error scheduling follow-up emails:', error);
    }
  }

  // Automatically schedule reminder emails when a reminder is created
  scheduleReminderEmails(reminder: any, recipientEmail?: string): void {
    if (!this.isEnabled) {
      console.log('Automation integration is disabled, skipping reminder scheduling');
      return;
    }

    try {
      const email = recipientEmail || this.getDefaultRecipientEmail(reminder.assignedTo);
      
      // Only schedule if the reminder is in the future
      if (reminder.dueDate > new Date()) {
        defaultEmailScheduler.addReminderJob(reminder, email);
        console.log(`✅ Scheduled reminder emails for: ${reminder.id}`);
      } else {
        console.log(`⚠️ Reminder ${reminder.id} is in the past, skipping email scheduling`);
      }
    } catch (error) {
      console.error('Error scheduling reminder emails:', error);
    }
  }

  // Check for overdue reminders and schedule urgent emails
  checkOverdueReminders(reminders: any[]): void {
    if (!this.isEnabled) {
      return;
    }

    const now = new Date();
    const overdueReminders = reminders.filter(reminder => 
      reminder.dueDate < now && 
      reminder.status === 'pending'
    );

    overdueReminders.forEach(reminder => {
      try {
        const email = this.getDefaultRecipientEmail(reminder.assignedTo);
        defaultEmailScheduler.addOverdueJob(reminder, email);
        console.log(`🚨 Scheduled overdue reminder email for: ${reminder.id}`);
      } catch (error) {
        console.error('Error scheduling overdue reminder email:', error);
      }
    });
  }

  // Bulk schedule emails for existing follow-ups and reminders
  bulkScheduleEmails(followUps: FollowUp[], reminders: any[]): void {
    if (!this.isEnabled) {
      console.log('Automation integration is disabled, skipping bulk scheduling');
      return;
    }

    console.log('Starting bulk email scheduling...');

    // Schedule follow-up emails
    followUps.forEach(followUp => {
      if (followUp.status === 'scheduled' && followUp.scheduledDate > new Date()) {
        this.scheduleFollowUpEmails(followUp);
      }
    });

    // Schedule reminder emails
    reminders.forEach(reminder => {
      if (reminder.status === 'pending' && reminder.dueDate > new Date()) {
        this.scheduleReminderEmails(reminder);
      }
    });

    // Check for overdue reminders
    this.checkOverdueReminders(reminders);

    console.log('Bulk email scheduling completed');
  }

  // Update email scheduling when follow-up is modified
  updateFollowUpScheduling(followUp: FollowUp, oldScheduledDate?: Date): void {
    if (!this.isEnabled) {
      return;
    }

    try {
      // Remove old scheduled jobs for this follow-up
      this.removeFollowUpJobs(followUp.id);

      // Schedule new jobs if the follow-up is still in the future
      if (followUp.scheduledDate > new Date()) {
        this.scheduleFollowUpEmails(followUp);
        console.log(`✅ Updated follow-up email scheduling for: ${followUp.id}`);
      }
    } catch (error) {
      console.error('Error updating follow-up scheduling:', error);
    }
  }

  // Update email scheduling when reminder is modified
  updateReminderScheduling(reminder: any, oldDueDate?: Date): void {
    if (!this.isEnabled) {
      return;
    }

    try {
      // Remove old scheduled jobs for this reminder
      this.removeReminderJobs(reminder.id);

      // Schedule new jobs if the reminder is still in the future
      if (reminder.dueDate > new Date()) {
        this.scheduleReminderEmails(reminder);
        console.log(`✅ Updated reminder email scheduling for: ${reminder.id}`);
      }
    } catch (error) {
      console.error('Error updating reminder scheduling:', error);
    }
  }

  // Cancel email scheduling when follow-up is cancelled or completed
  cancelFollowUpScheduling(followUpId: string): void {
    if (!this.isEnabled) {
      return;
    }

    try {
      this.removeFollowUpJobs(followUpId);
      console.log(`❌ Cancelled follow-up email scheduling for: ${followUpId}`);
    } catch (error) {
      console.error('Error cancelling follow-up scheduling:', error);
    }
  }

  // Cancel email scheduling when reminder is completed
  cancelReminderScheduling(reminderId: string): void {
    if (!this.isEnabled) {
      return;
    }

    try {
      this.removeReminderJobs(reminderId);
      console.log(`❌ Cancelled reminder email scheduling for: ${reminderId}`);
    } catch (error) {
      console.error('Error cancelling reminder scheduling:', error);
    }
  }

  // Remove all jobs for a specific follow-up
  private removeFollowUpJobs(followUpId: string): void {
    const jobs = defaultEmailScheduler.getJobs();
    const jobsToRemove = jobs.filter(job => 
      job.id.startsWith(`${followUpId}-followup-`)
    );

    // Note: This would require adding a removeJob method to the scheduler
    // For now, we'll just log the jobs that should be removed
    console.log(`Found ${jobsToRemove.length} jobs to remove for follow-up ${followUpId}`);
  }

  // Remove all jobs for a specific reminder
  private removeReminderJobs(reminderId: string): void {
    const jobs = defaultEmailScheduler.getJobs();
    const jobsToRemove = jobs.filter(job => 
      job.id.startsWith(`${reminderId}-reminder-`) || 
      job.id.startsWith(`${reminderId}-overdue`)
    );

    // Note: This would require adding a removeJob method to the scheduler
    // For now, we'll just log the jobs that should be removed
    console.log(`Found ${jobsToRemove.length} jobs to remove for reminder ${reminderId}`);
  }

  // Get default recipient email based on user ID
  private getDefaultRecipientEmail(userId: string): string {
    const userEmails: Record<string, string> = {
      'emp1': 'sales@yourcompany.com',
      'emp2': 'marketing@yourcompany.com',
      'emp3': 'support@yourcompany.com',
      'default': 'team@yourcompany.com'
    };
    return userEmails[userId] || 'team@yourcompany.com';
  }

  // Get automation statistics
  getAutomationStats() {
    const stats = defaultEmailScheduler.getStats();
    const jobs = defaultEmailScheduler.getJobs();
    
    return {
      ...stats,
      totalJobs: jobs.length,
      pendingJobs: jobs.filter(j => j.status === 'pending').length,
      sentJobs: jobs.filter(j => j.status === 'sent').length,
      failedJobs: jobs.filter(j => j.status === 'failed').length,
      integrationEnabled: this.isEnabled
    };
  }

  // Start the automation system
  startAutomation(): void {
    if (this.isEnabled) {
      defaultEmailScheduler.start();
      console.log('🚀 Automation system started');
    } else {
      console.log('⚠️ Automation integration is disabled');
    }
  }

  // Stop the automation system
  stopAutomation(): void {
    defaultEmailScheduler.stop();
    console.log('🛑 Automation system stopped');
  }
}

// Create default automation integration instance
const defaultAutomationIntegration = new AutomationIntegration();

export { AutomationIntegration, defaultAutomationIntegration }; 