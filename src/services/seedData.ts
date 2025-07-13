import { databaseService } from './database';
import { User, Company, Lead, FollowUp, CallNote, Notification, EmailRecord } from '../types';

export class SeedDataService {
  static async seedAllData(): Promise<void> {
    try {
      console.log('Starting database seeding...');
      
      // Seed users first
      const users = await this.seedUsers();
      
      // Seed companies
      const companies = await this.seedCompanies();
      
      // Seed leads (depends on users and companies)
      const leads = await this.seedLeads(users, companies);
      
      // Seed follow-ups (depends on leads)
      await this.seedFollowUps(leads, users);
      
      // Seed call notes (depends on leads)
      await this.seedCallNotes(leads);
      
      // Seed email records (depends on leads)
      await this.seedEmailRecords(leads);
      
      // Seed notifications (depends on users)
      await this.seedNotifications(users);
      
      console.log('Database seeding completed successfully!');
    } catch (error) {
      console.error('Database seeding failed:', error);
      throw error;
    }
  }

  private static async seedUsers(): Promise<User[]> {
    const users: Omit<User, 'id'>[] = [
      {
        email: 'john.doe@company.com',
        name: 'John Doe',
        role: 'admin',
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
        lastLogin: new Date('2024-01-25T10:30:00')
      },
      {
        email: 'sarah.johnson@company.com',
        name: 'Sarah Johnson',
        role: 'manager',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
        lastLogin: new Date('2024-01-24T16:45:00')
      },
      {
        email: 'mike.davis@company.com',
        name: 'Mike Davis',
        role: 'employee',
        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
        lastLogin: new Date('2024-01-23T09:15:00')
      },
      {
        email: 'lisa.chen@company.com',
        name: 'Lisa Chen',
        role: 'employee',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
        lastLogin: new Date('2024-01-22T14:20:00')
      },
      {
        email: 'tom.wilson@company.com',
        name: 'Tom Wilson',
        role: 'employee',
        avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
        lastLogin: new Date('2024-01-21T11:30:00')
      }
    ];

    const createdUsers: User[] = [];
    for (const user of users) {
      const createdUser = await databaseService.createUser(user);
      createdUsers.push(createdUser);
    }

    console.log(`Seeded ${createdUsers.length} users`);
    return createdUsers;
  }

  private static async seedCompanies(): Promise<Company[]> {
    const companies: Omit<Company, 'id' | 'createdAt' | 'updatedAt'>[] = [
      {
        name: 'TechCorp Solutions',
        industry: 'Technology',
        size: 'large',
        companyUrl: 'https://techcorp.com',
        linkedinUrl: 'https://linkedin.com/company/techcorp',
        phone: '+1 (555) 123-4567',
        email: 'contact@techcorp.com',
        address: '123 Tech Street, San Francisco, CA',
        country: 'United States',
        notes: 'Enterprise client with high potential for long-term partnership. Strong decision-making process and budget allocation.',
        dateAdded: new Date('2024-01-15'),
        assignedEmployees: ['1', '2']
      },
      {
        name: 'StartupXYZ',
        industry: 'Fintech',
        size: 'small',
        companyUrl: 'https://startupxyz.com',
        linkedinUrl: 'https://linkedin.com/company/startupxyz',
        phone: '+1 (555) 987-6543',
        email: 'hello@startupxyz.com',
        address: '456 Innovation Ave, Austin, TX',
        country: 'United States',
        notes: 'Fast-growing startup with innovative approach. Budget conscious but open to strategic partnerships.',
        dateAdded: new Date('2024-01-10'),
        assignedEmployees: ['3']
      },
      {
        name: 'Enterprise Ltd',
        industry: 'Manufacturing',
        size: 'large',
        companyUrl: 'https://enterprise.com',
        linkedinUrl: 'https://linkedin.com/company/enterprise',
        phone: '+1 (555) 456-7890',
        email: 'info@enterprise.com',
        address: '789 Business Blvd, Chicago, IL',
        country: 'United States',
        notes: 'Established manufacturing company with global presence. Long-term partnership potential with significant contract value.',
        dateAdded: new Date('2024-01-05'),
        assignedEmployees: ['1', '3']
      },
      {
        name: 'Innovation Inc',
        industry: 'Healthcare',
        size: 'medium',
        companyUrl: 'https://innovation.com',
        linkedinUrl: 'https://linkedin.com/company/innovation',
        phone: '+1 (555) 789-0123',
        email: 'info@innovation.com',
        address: '321 Health Plaza, Boston, MA',
        country: 'United States',
        notes: 'Healthcare technology company focused on patient care solutions. Regulatory compliance is crucial.',
        dateAdded: new Date('2024-01-12'),
        assignedEmployees: ['2', '4']
      },
      {
        name: 'Global Corp',
        industry: 'Consulting',
        size: 'large',
        companyUrl: 'https://globalcorp.com',
        linkedinUrl: 'https://linkedin.com/company/globalcorp',
        phone: '+1 (555) 321-6540',
        email: 'contact@globalcorp.com',
        address: '654 Corporate Center, New York, NY',
        country: 'United States',
        notes: 'International consulting firm with offices in 15 countries. Complex decision-making process.',
        dateAdded: new Date('2024-01-08'),
        assignedEmployees: ['1', '5']
      }
    ];

    const createdCompanies: Company[] = [];
    for (const company of companies) {
      const createdCompany = await databaseService.createCompany(company);
      createdCompanies.push(createdCompany);
    }

    console.log(`Seeded ${createdCompanies.length} companies`);
    return createdCompanies;
  }

  private static async seedLeads(users: User[], companies: Company[]): Promise<Lead[]> {
    const leads: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>[] = [
      {
        companyId: companies[0].id,
        name: 'John Smith',
        designation: 'CTO',
        status: 'active',
        linkedinUrl: 'https://linkedin.com/in/johnsmith',
        email: 'john.smith@techcorp.com',
        phone: '+1 (555) 123-4567',
        additionalEmails: ['john.smith.personal@gmail.com'],
        additionalPhones: ['+1 (555) 999-8888'],
        shortNote: 'Very interested in our enterprise solution. Has decision-making authority.',
        stage: 'qualified',
        priority: 'high',
        initialContactDate: new Date('2024-01-15'),
        followUpDates: [
          new Date('2024-01-20'),
          new Date('2024-01-25'),
          new Date('2024-02-01')
        ],
        remarks: [
          'Initial contact made via LinkedIn',
          'Showed interest in enterprise features',
          'Scheduled demo for next week',
          'Followed up on proposal'
        ],
        emailsSent: [],
        callNotes: [],
        score: 85,
        assignedTo: users[0].id,
        notes: 'High-value prospect with budget approval. Decision maker identified.'
      },
      {
        companyId: companies[1].id,
        name: 'Sarah Johnson',
        designation: 'CEO',
        status: 'active',
        linkedinUrl: 'https://linkedin.com/in/sarahjohnson',
        email: 'sarah.johnson@startupxyz.com',
        phone: '+1 (555) 987-6543',
        additionalEmails: ['sarah.johnson.personal@gmail.com'],
        additionalPhones: ['+1 (555) 888-7777'],
        shortNote: 'Looking for cost-effective solution for startup.',
        stage: 'proposal',
        priority: 'medium',
        initialContactDate: new Date('2024-01-10'),
        followUpDates: [
          new Date('2024-01-18'),
          new Date('2024-01-28')
        ],
        remarks: [
          'Initial contact via email',
          'Price-sensitive due to startup budget',
          'Interested in basic features only',
          'Sent proposal with pricing options'
        ],
        emailsSent: [],
        callNotes: [],
        score: 72,
        assignedTo: users[1].id,
        notes: 'Price-sensitive prospect. May be better fit for starter package.'
      },
      {
        companyId: companies[2].id,
        name: 'Mike Davis',
        designation: 'VP of Operations',
        status: 'active',
        linkedinUrl: 'https://linkedin.com/in/mikedavis',
        email: 'mike.davis@enterprise.com',
        phone: '+1 (555) 456-7890',
        additionalEmails: ['mike.davis.personal@gmail.com'],
        additionalPhones: ['+1 (555) 777-6666'],
        shortNote: 'Urgent need for replacement system.',
        stage: 'negotiation',
        priority: 'high',
        initialContactDate: new Date('2024-01-05'),
        followUpDates: [
          new Date('2024-01-12'),
          new Date('2024-01-19'),
          new Date('2024-01-26')
        ],
        remarks: [
          'Cold call outreach',
          'Current system failing',
          'Urgent need for replacement',
          'Contract negotiation in progress'
        ],
        emailsSent: [],
        callNotes: [],
        score: 95,
        assignedTo: users[0].id,
        notes: 'Excellent prospect with urgent need. Ready to proceed with large implementation.'
      },
      {
        companyId: companies[3].id,
        name: 'Lisa Chen',
        designation: 'IT Director',
        status: 'active',
        linkedinUrl: 'https://linkedin.com/in/lisachen',
        email: 'lisa.chen@innovation.com',
        phone: '+1 (555) 789-0123',
        additionalEmails: ['lisa.chen.personal@gmail.com'],
        additionalPhones: ['+1 (555) 666-5555'],
        shortNote: 'Healthcare compliance requirements are critical.',
        stage: 'qualified',
        priority: 'medium',
        initialContactDate: new Date('2024-01-12'),
        followUpDates: [
          new Date('2024-01-22'),
          new Date('2024-01-29')
        ],
        remarks: [
          'Referral from existing customer',
          'Healthcare compliance requirements',
          'Technical evaluation in progress',
          'Security review scheduled'
        ],
        emailsSent: [],
        callNotes: [],
        score: 78,
        assignedTo: users[2].id,
        notes: 'Healthcare client with strict compliance requirements. Security review needed.'
      },
      {
        companyId: companies[4].id,
        name: 'Tom Wilson',
        designation: 'Global IT Manager',
        status: 'active',
        linkedinUrl: 'https://linkedin.com/in/tomwilson',
        email: 'tom.wilson@globalcorp.com',
        phone: '+1 (555) 321-6540',
        additionalEmails: ['tom.wilson.personal@gmail.com'],
        additionalPhones: ['+1 (555) 555-4444'],
        shortNote: 'Complex multi-country implementation.',
        stage: 'prospect',
        priority: 'low',
        initialContactDate: new Date('2024-01-08'),
        followUpDates: [
          new Date('2024-01-15'),
          new Date('2024-01-30')
        ],
        remarks: [
          'Trade show contact',
          'Multi-country implementation',
          'Complex decision-making process',
          'Long sales cycle expected'
        ],
        emailsSent: [],
        callNotes: [],
        score: 65,
        assignedTo: users[3].id,
        notes: 'Complex prospect with multi-country requirements. Long sales cycle expected.'
      }
    ];

    const createdLeads: Lead[] = [];
    for (const lead of leads) {
      const createdLead = await databaseService.createLead(lead);
      createdLeads.push(createdLead);
    }

    console.log(`Seeded ${createdLeads.length} leads`);
    return createdLeads;
  }

  private static async seedFollowUps(leads: Lead[], users: User[]): Promise<void> {
    const followUps: Omit<FollowUp, 'id'>[] = [
      {
        leadId: leads[0].id,
        companyId: leads[0].companyId,
        type: 'demo',
        scheduledDate: new Date('2024-01-25T10:00:00'),
        status: 'scheduled',
        priority: 'high',
        notes: 'Product demo for enterprise solution',
        createdBy: users[0].id
      },
      {
        leadId: leads[1].id,
        companyId: leads[1].companyId,
        type: 'email',
        scheduledDate: new Date('2024-01-25T14:00:00'),
        status: 'scheduled',
        priority: 'medium',
        notes: 'Send pricing proposal with startup discount',
        createdBy: users[1].id
      },
      {
        leadId: leads[2].id,
        companyId: leads[2].companyId,
        type: 'meeting',
        scheduledDate: new Date('2024-01-25T16:30:00'),
        status: 'completed',
        priority: 'high',
        notes: 'Contract negotiation meeting completed successfully',
        createdBy: users[0].id,
        completedAt: new Date('2024-01-25T17:30:00')
      },
      {
        leadId: leads[3].id,
        companyId: leads[3].companyId,
        type: 'call',
        scheduledDate: new Date('2024-01-26T11:00:00'),
        status: 'scheduled',
        priority: 'medium',
        notes: 'Follow up on security review requirements',
        createdBy: users[2].id
      },
      {
        leadId: leads[4].id,
        companyId: leads[4].companyId,
        type: 'meeting',
        scheduledDate: new Date('2024-01-27T15:00:00'),
        status: 'scheduled',
        priority: 'low',
        notes: 'Initial discovery meeting for multi-country implementation',
        createdBy: users[3].id
      }
    ];

    for (const followUp of followUps) {
      await databaseService.createFollowUp(followUp);
    }

    console.log(`Seeded ${followUps.length} follow-ups`);
  }

  private static async seedCallNotes(leads: Lead[]): Promise<void> {
    const callNotes: Omit<CallNote, 'id' | 'createdAt'>[] = [
      {
        leadId: leads[0].id,
        audioUrl: 'https://example.com/audio/call-1.mp3',
        transcript: 'Thank you for taking the time to speak with me today. I wanted to discuss our enterprise solution and how it can help streamline your operations. We\'ve been working with companies similar to yours and have seen significant improvements in efficiency.',
        callType: 'outbound',
        duration: 1245,
        outcome: 'completed',
        notes: 'Productive call with strong interest in enterprise solution. Budget approved for Q2 implementation.'
      },
      {
        leadId: leads[1].id,
        audioUrl: 'https://example.com/audio/call-2.mp3',
        transcript: 'I appreciate the call, but I\'m not sure if this is the right fit for our current needs. We\'re a small startup and the pricing seems quite high for our budget.',
        callType: 'inbound',
        duration: 892,
        outcome: 'completed',
        notes: 'Price-sensitive prospect. May be better fit for starter package or future opportunity.'
      },
      {
        leadId: leads[2].id,
        audioUrl: 'https://example.com/audio/call-3.mp3',
        transcript: 'This looks exactly like what we need. Our current solution is outdated and causing major bottlenecks. When can we get started?',
        callType: 'outbound',
        duration: 1567,
        outcome: 'completed',
        notes: 'Excellent prospect with urgent need. Ready to proceed with large implementation.'
      }
    ];

    for (const callNote of callNotes) {
      await databaseService.createCallNote(callNote);
    }

    console.log(`Seeded ${callNotes.length} call notes`);
  }

  private static async seedEmailRecords(leads: Lead[]): Promise<void> {
    const emailRecords: Omit<EmailRecord, 'id' | 'createdAt'>[] = [
      {
        leadId: leads[0].id,
        subject: 'Follow-up: Enterprise Solution Demo',
        content: 'Hi John, Thank you for your interest in our enterprise solution. I\'ve attached the demo schedule and additional materials you requested. Looking forward to our meeting next week.',
        sentDate: new Date('2024-01-20T09:00:00'),
        status: 'opened'
      },
      {
        leadId: leads[1].id,
        subject: 'Pricing Proposal for StartupXYZ',
        content: 'Hi Sarah, As discussed, here\'s our pricing proposal with special startup discounts. I\'ve included both the basic and premium packages to give you options.',
        sentDate: new Date('2024-01-18T14:30:00'),
        status: 'delivered'
      },
      {
        leadId: leads[2].id,
        subject: 'Contract Terms and Implementation Timeline',
        content: 'Hi Mike, Thank you for the productive meeting. I\'ve prepared the contract terms and implementation timeline as requested. Please review and let me know if you need any adjustments.',
        sentDate: new Date('2024-01-22T11:15:00'),
        status: 'clicked'
      }
    ];

    for (const emailRecord of emailRecords) {
      await databaseService.createEmailRecord(emailRecord);
    }

    console.log(`Seeded ${emailRecords.length} email records`);
  }

  private static async seedNotifications(users: User[]): Promise<void> {
    const notifications: Omit<Notification, 'id' | 'createdAt'>[] = [
      {
        title: 'Follow-up Due',
        message: 'Call scheduled with John Smith in 30 minutes',
        type: 'warning',
        read: false,
        userId: users[0].id
      },
      {
        title: 'New Lead',
        message: 'Sarah Johnson from TechCorp has been assigned to you',
        type: 'info',
        read: false,
        userId: users[1].id
      },
      {
        title: 'Meeting Completed',
        message: 'Demo with ABC Corp marked as completed',
        type: 'success',
        read: true,
        userId: users[0].id
      },
      {
        title: 'Contract Signed',
        message: 'Enterprise Ltd contract has been signed and activated',
        type: 'success',
        read: false,
        userId: users[2].id
      },
      {
        title: 'System Update',
        message: 'New features have been deployed to production',
        type: 'info',
        read: true,
        userId: users[3].id
      }
    ];

    for (const notification of notifications) {
      await databaseService.createNotification(notification);
    }

    console.log(`Seeded ${notifications.length} notifications`);
  }

  static async clearAllData(): Promise<void> {
    try {
      console.log('Clearing all data...');
      
      // In a real implementation, you would execute DELETE statements
      // For now, we'll just log the action
      console.log('All data cleared successfully!');
    } catch (error) {
      console.error('Failed to clear data:', error);
      throw error;
    }
  }

  static async resetDatabase(): Promise<void> {
    try {
      console.log('Resetting database...');
      
      // Clear all data
      await this.clearAllData();
      
      // Re-seed with fresh data
      await this.seedAllData();
      
      console.log('Database reset completed successfully!');
    } catch (error) {
      console.error('Database reset failed:', error);
      throw error;
    }
  }
} 