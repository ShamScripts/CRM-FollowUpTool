import { defaultEmailService, type FollowUpEmailData, type ReminderEmailData } from './emailService';
import { FollowUp } from '../types';

// Email scheduling configuration
interface EmailScheduleConfig {
  enabled: boolean;
  checkInterval: number; // in minutes
  followUpReminderTimes: number[]; // hours before scheduled time
  reminderNotificationTimes: number[]; // hours before due date
  overdueCheckInterval: number; // in hours
  maxEmailsPerHour: number;
  retryAttempts: number;
  retryDelay: number; // in minutes
}

// Email job interface
interface EmailJob {
  id: string;
  type: 'followup' | 'reminder' | 'overdue';
  data: FollowUpEmailData | ReminderEmailData;
  recipientEmail: string;
  scheduledTime: Date;
  status: 'pending' | 'sent' | 'failed' | 'retrying';
  attempts: number;
  lastAttempt?: Date;
  nextAttempt?: Date;
  createdAt: Date;
}

// Email statistics
interface EmailStats {
  totalSent: number;
  totalFailed: number;
  totalPending: number;
  lastRun: Date;
  nextRun: Date;
  emailsThisHour: number;
  emailsToday: number;
}

class EmailScheduler {
  private config: EmailScheduleConfig;
  private jobs: EmailJob[] = [];
  private stats: EmailStats;
  private intervalId: NodeJS.Timeout | null = null;
  private isRunning = false;
  private lastHourReset = new Date();

  constructor(config?: Partial<EmailScheduleConfig>) {
    this.config = {
      enabled: true,
      checkInterval: 15, // Check every 15 minutes
      followUpReminderTimes: [24, 2, 1], // 24h, 2h, 1h before
      reminderNotificationTimes: [24, 2, 1], // 24h, 2h, 1h before
      overdueCheckInterval: 2, // Check overdue every 2 hours
      maxEmailsPerHour: 100,
      retryAttempts: 3,
      retryDelay: 30, // 30 minutes
      ...config
    };

    this.stats = {
      totalSent: 0,
      totalFailed: 0,
      totalPending: 0,
      lastRun: new Date(),
      nextRun: new Date(Date.now() + this.config.checkInterval * 60000),
      emailsThisHour: 0,
      emailsToday: 0
    };

    this.resetHourlyStats();
  }

  // Start the email scheduler
  start(): void {
    if (this.isRunning) {
      console.log('Email scheduler is already running');
      return;
    }

    if (!this.config.enabled) {
      console.log('Email scheduler is disabled');
      return;
    }

    console.log('Starting email scheduler...');
    this.isRunning = true;

    // Run initial check
    this.processJobs();

    // Set up interval for regular checks
    this.intervalId = setInterval(() => {
      this.processJobs();
    }, this.config.checkInterval * 60000);

    // Set up interval for overdue checks
    setInterval(() => {
      this.checkOverdueItems();
    }, this.config.overdueCheckInterval * 3600000);

    // Reset hourly stats every hour
    setInterval(() => {
      this.resetHourlyStats();
    }, 3600000);

    console.log(`Email scheduler started. Checking every ${this.config.checkInterval} minutes.`);
  }

  // Stop the email scheduler
  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    console.log('Email scheduler stopped');
  }

  // Add follow-up email job
  addFollowUpJob(followUp: FollowUp, recipientEmail: string): void {
    const followUpData: FollowUpEmailData = {
      leadName: this.getLeadName(followUp.leadId),
      leadEmail: this.getLeadEmail(followUp.leadId),
      companyName: this.getCompanyName(followUp.companyId),
      followUpType: followUp.type,
      scheduledDate: followUp.scheduledDate,
      notes: followUp.notes || '',
      assignedTo: this.getAssignedTo(followUp.createdBy),
      priority: followUp.priority
    };

    // Create jobs for each reminder time
    this.config.followUpReminderTimes.forEach(hoursBefore => {
      const scheduledTime = new Date(followUp.scheduledDate.getTime() - (hoursBefore * 3600000));
      
      // Only schedule if the time hasn't passed
      if (scheduledTime > new Date()) {
        const job: EmailJob = {
          id: `${followUp.id}-followup-${hoursBefore}h`,
          type: 'followup',
          data: followUpData,
          recipientEmail,
          scheduledTime,
          status: 'pending',
          attempts: 0,
          createdAt: new Date()
        };

        this.addJob(job);
      }
    });
  }

  // Add reminder email job
  addReminderJob(reminder: any, recipientEmail: string): void {
    const reminderData: ReminderEmailData = {
      title: reminder.title,
      description: reminder.description,
      type: reminder.type,
      priority: reminder.priority,
      dueDate: reminder.dueDate,
      leadName: reminder.leadId ? this.getLeadName(reminder.leadId) : undefined,
      companyName: reminder.companyId ? this.getCompanyName(reminder.companyId) : undefined,
      assignedTo: this.getAssignedTo(reminder.assignedTo || 'default')
    };

    // Create jobs for each notification time
    this.config.reminderNotificationTimes.forEach(hoursBefore => {
      const scheduledTime = new Date(reminder.dueDate.getTime() - (hoursBefore * 3600000));
      
      // Only schedule if the time hasn't passed
      if (scheduledTime > new Date()) {
        const job: EmailJob = {
          id: `${reminder.id}-reminder-${hoursBefore}h`,
          type: 'reminder',
          data: reminderData,
          recipientEmail,
          scheduledTime,
          status: 'pending',
          attempts: 0,
          createdAt: new Date()
        };

        this.addJob(job);
      }
    });
  }

  // Add overdue reminder job
  addOverdueJob(reminder: any, recipientEmail: string): void {
    const reminderData: ReminderEmailData = {
      title: reminder.title,
      description: reminder.description,
      type: reminder.type,
      priority: reminder.priority,
      dueDate: reminder.dueDate,
      leadName: reminder.leadId ? this.getLeadName(reminder.leadId) : undefined,
      companyName: reminder.companyId ? this.getCompanyName(reminder.companyId) : undefined,
      assignedTo: this.getAssignedTo(reminder.assignedTo || 'default')
    };

    const job: EmailJob = {
      id: `${reminder.id}-overdue`,
      type: 'overdue',
      data: reminderData,
      recipientEmail,
      scheduledTime: new Date(),
      status: 'pending',
      attempts: 0,
      createdAt: new Date()
    };

    this.addJob(job);
  }

  // Add job to the queue
  private addJob(job: EmailJob): void {
    // Check if job already exists
    const existingJob = this.jobs.find(j => j.id === job.id);
    if (existingJob) {
      console.log(`Job ${job.id} already exists, skipping...`);
      return;
    }

    this.jobs.push(job);
    this.stats.totalPending++;
    console.log(`Added email job: ${job.id} scheduled for ${job.scheduledTime.toLocaleString()}`);
  }

  // Process all pending jobs
  private async processJobs(): Promise<void> {
    if (!this.isRunning) return;

    const now = new Date();
    this.stats.lastRun = now;
    this.stats.nextRun = new Date(now.getTime() + this.config.checkInterval * 60000);

    const dueJobs = this.jobs.filter(job => 
      job.status === 'pending' && 
      job.scheduledTime <= now &&
      this.stats.emailsThisHour < this.config.maxEmailsPerHour
    );

    console.log(`Processing ${dueJobs.length} due email jobs...`);

    for (const job of dueJobs) {
      await this.processJob(job);
    }

    // Clean up old completed jobs (older than 7 days)
    this.cleanupOldJobs();
  }

  // Process individual job
  private async processJob(job: EmailJob): Promise<void> {
    try {
      job.attempts++;
      job.lastAttempt = new Date();
      job.status = 'retrying';

      let success = false;

      if (job.type === 'followup') {
        success = await defaultEmailService.sendFollowUpReminder(
          job.data as FollowUpEmailData,
          job.recipientEmail
        );
      } else if (job.type === 'reminder') {
        success = await defaultEmailService.sendReminderNotification(
          job.data as ReminderEmailData,
          job.recipientEmail
        );
      } else if (job.type === 'overdue') {
        success = await defaultEmailService.sendOverdueReminder(
          job.data as ReminderEmailData,
          job.recipientEmail
        );
      }

      if (success) {
        job.status = 'sent';
        this.stats.totalSent++;
        this.stats.emailsThisHour++;
        this.stats.emailsToday++;
        this.stats.totalPending--;
        console.log(`✅ Email sent successfully: ${job.id}`);
      } else {
        throw new Error('Email service returned false');
      }

    } catch (error) {
      console.error(`❌ Failed to send email ${job.id}:`, error);
      
      if (job.attempts >= this.config.retryAttempts) {
        job.status = 'failed';
        this.stats.totalFailed++;
        this.stats.totalPending--;
        console.log(`❌ Job ${job.id} failed after ${job.attempts} attempts`);
      } else {
        // Schedule retry
        job.nextAttempt = new Date(Date.now() + this.config.retryDelay * 60000);
        job.status = 'pending';
        console.log(`🔄 Scheduling retry for ${job.id} in ${this.config.retryDelay} minutes`);
      }
    }
  }

  // Check for overdue items
  private async checkOverdueItems(): Promise<void> {
    console.log('Checking for overdue items...');
    
    // This would typically fetch from your database
    // For now, we'll simulate checking overdue reminders
    const overdueReminders = this.getOverdueReminders();
    
    for (const reminder of overdueReminders) {
      // Only send overdue email if we haven't sent one recently
      const recentOverdueJob = this.jobs.find(job => 
        job.id === `${reminder.id}-overdue` && 
        job.status === 'sent' &&
        job.lastAttempt && 
        (Date.now() - job.lastAttempt.getTime()) < 3600000 // 1 hour
      );

      if (!recentOverdueJob) {
        this.addOverdueJob(reminder, this.getRecipientEmail(reminder.assignedTo));
      }
    }
  }

  // Reset hourly statistics
  private resetHourlyStats(): void {
    this.stats.emailsThisHour = 0;
    this.lastHourReset = new Date();
    console.log('Reset hourly email statistics');
  }

  // Clean up old completed jobs
  private cleanupOldJobs(): void {
    const cutoffDate = new Date(Date.now() - 7 * 24 * 3600000); // 7 days ago
    const initialCount = this.jobs.length;
    
    this.jobs = this.jobs.filter(job => 
      job.status === 'pending' || 
      (job.createdAt > cutoffDate)
    );

    const removedCount = initialCount - this.jobs.length;
    if (removedCount > 0) {
      console.log(`Cleaned up ${removedCount} old email jobs`);
    }
  }

  // Get scheduler statistics
  getStats(): EmailStats {
    return { ...this.stats };
  }

  // Get all jobs
  getJobs(): EmailJob[] {
    return [...this.jobs];
  }

  // Get pending jobs
  getPendingJobs(): EmailJob[] {
    return this.jobs.filter(job => job.status === 'pending');
  }

  // Get failed jobs
  getFailedJobs(): EmailJob[] {
    return this.jobs.filter(job => job.status === 'failed');
  }

  // Retry failed job
  retryJob(jobId: string): void {
    const job = this.jobs.find(j => j.id === jobId);
    if (job && job.status === 'failed') {
      job.status = 'pending';
      job.attempts = 0;
      job.scheduledTime = new Date();
      this.stats.totalFailed--;
      this.stats.totalPending++;
      console.log(`Retrying failed job: ${jobId}`);
    }
  }

  // Update configuration
  updateConfig(newConfig: Partial<EmailScheduleConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log('Email scheduler configuration updated');
  }

  // Mock data methods (replace with actual database calls)
  private getLeadName(leadId: string): string {
    const leadNames: Record<string, string> = {
      '1': 'John Smith',
      '2': 'Sarah Johnson',
      '3': 'Mike Davis',
      '4': 'Lisa Chen'
    };
    return leadNames[leadId] || 'Unknown Lead';
  }

  private getLeadEmail(leadId: string): string {
    const leadEmails: Record<string, string> = {
      '1': 'john@techcorp.com',
      '2': 'sarah@startupxyz.com',
      '3': 'mike@enterprise.com',
      '4': 'lisa@innovate.com'
    };
    return leadEmails[leadId] || 'unknown@example.com';
  }

  private getCompanyName(companyId: string): string {
    const companyNames: Record<string, string> = {
      '1': 'TechCorp Solutions',
      '2': 'StartupXYZ',
      '3': 'Enterprise Ltd',
      '4': 'Innovate Inc'
    };
    return companyNames[companyId] || 'Unknown Company';
  }

  private getAssignedTo(userId: string): string {
    const userNames: Record<string, string> = {
      'emp1': 'Sales Team',
      'emp2': 'Marketing Team',
      'emp3': 'Support Team',
      'default': 'Team Member'
    };
    return userNames[userId] || 'Team Member';
  }

  private getRecipientEmail(userId: string): string {
    const userEmails: Record<string, string> = {
      'emp1': 'sales@yourcompany.com',
      'emp2': 'marketing@yourcompany.com',
      'emp3': 'support@yourcompany.com',
      'default': 'team@yourcompany.com'
    };
    return userEmails[userId] || 'team@yourcompany.com';
  }

  private getOverdueReminders(): any[] {
    // This would fetch from your database
    // For now, return mock overdue reminders
    return [
      {
        id: 'overdue1',
        title: 'Contract Review Meeting',
        description: 'Review contract terms with Enterprise Ltd',
        type: 'meeting',
        priority: 'high',
        dueDate: new Date(Date.now() - 3600000), // 1 hour ago
        assignedTo: 'emp1'
      }
    ];
  }
}

// Create default email scheduler instance
const defaultEmailScheduler = new EmailScheduler();

export { EmailScheduler, defaultEmailScheduler };
export type { EmailScheduleConfig, EmailJob, EmailStats }; 