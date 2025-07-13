import { databaseService } from './database';
import { User, Company, Lead, FollowUp, CallNote, Notification, EmailRecord, DashboardStats } from '../types';

export class DataService {
  // User operations
  static async getCurrentUser(): Promise<User | null> {
    const userId = localStorage.getItem('currentUserId');
    if (!userId) return null;
    return await databaseService.getUserById(userId);
  }

  static async getAllUsers(): Promise<User[]> {
    return await databaseService.getAllUsers();
  }

  static async createUser(user: Omit<User, 'id'>): Promise<User> {
    return await databaseService.createUser(user);
  }

  static async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    return await databaseService.updateUser(id, updates);
  }

  static async deleteUser(id: string): Promise<boolean> {
    return await databaseService.deleteUser(id);
  }

  // Company operations
  static async getAllCompanies(): Promise<Company[]> {
    return await databaseService.getAllCompanies();
  }

  static async getCompanyById(id: string): Promise<Company | null> {
    return await databaseService.getCompanyById(id);
  }

  static async createCompany(company: Omit<Company, 'id' | 'createdAt' | 'updatedAt'>): Promise<Company> {
    return await databaseService.createCompany(company);
  }

  static async updateCompany(id: string, updates: Partial<Company>): Promise<Company | null> {
    return await databaseService.updateCompany(id, updates);
  }

  static async deleteCompany(id: string): Promise<boolean> {
    return await databaseService.deleteCompany(id);
  }

  static async searchCompanies(query: string): Promise<Company[]> {
    return await databaseService.searchCompanies(query);
  }

  // Lead operations
  static async getAllLeads(): Promise<Lead[]> {
    const leads = await databaseService.getAllLeads();
    
    // Load call notes for each lead
    for (const lead of leads) {
      lead.callNotes = await databaseService.getCallNotesByLead(lead.id);
    }
    
    return leads;
  }

  static async getLeadById(id: string): Promise<Lead | null> {
    const lead = await databaseService.getLeadById(id);
    if (lead) {
      lead.callNotes = await databaseService.getCallNotesByLead(lead.id);
    }
    return lead;
  }

  static async createLead(lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Promise<Lead> {
    return await databaseService.createLead(lead);
  }

  static async updateLead(id: string, updates: Partial<Lead>): Promise<Lead | null> {
    return await databaseService.updateLead(id, updates);
  }

  static async deleteLead(id: string): Promise<boolean> {
    return await databaseService.deleteLead(id);
  }

  static async getLeadsByCompany(companyId: string): Promise<Lead[]> {
    const leads = await databaseService.getLeadsByCompany(companyId);
    
    // Load call notes for each lead
    for (const lead of leads) {
      lead.callNotes = await databaseService.getCallNotesByLead(lead.id);
    }
    
    return leads;
  }

  static async getLeadsByAssignee(userId: string): Promise<Lead[]> {
    const leads = await databaseService.getLeadsByAssignee(userId);
    
    // Load call notes for each lead
    for (const lead of leads) {
      lead.callNotes = await databaseService.getCallNotesByLead(lead.id);
    }
    
    return leads;
  }

  static async searchLeads(query: string): Promise<Lead[]> {
    const leads = await databaseService.searchLeads(query);
    
    // Load call notes for each lead
    for (const lead of leads) {
      lead.callNotes = await databaseService.getCallNotesByLead(lead.id);
    }
    
    return leads;
  }

  // Follow-up operations
  static async getAllFollowUps(): Promise<FollowUp[]> {
    return await databaseService.getAllFollowUps();
  }

  static async getFollowUpById(id: string): Promise<FollowUp | null> {
    return await databaseService.getFollowUpById(id);
  }

  static async createFollowUp(followUp: Omit<FollowUp, 'id'>): Promise<FollowUp> {
    return await databaseService.createFollowUp(followUp);
  }

  static async updateFollowUp(id: string, updates: Partial<FollowUp>): Promise<FollowUp | null> {
    return await databaseService.updateFollowUp(id, updates);
  }

  static async deleteFollowUp(id: string): Promise<boolean> {
    return await databaseService.deleteFollowUp(id);
  }

  static async getFollowUpsByLead(leadId: string): Promise<FollowUp[]> {
    return await databaseService.getFollowUpsByLead(leadId);
  }

  static async getFollowUpsByDate(date: Date): Promise<FollowUp[]> {
    return await databaseService.getFollowUpsByDate(date);
  }

  // Call note operations
  static async getAllCallNotes(): Promise<CallNote[]> {
    return await databaseService.getAllCallNotes();
  }

  static async getCallNoteById(id: string): Promise<CallNote | null> {
    return await databaseService.getCallNoteById(id);
  }

  static async createCallNote(callNote: Omit<CallNote, 'id' | 'createdAt'>): Promise<CallNote> {
    return await databaseService.createCallNote(callNote);
  }

  static async updateCallNote(id: string, updates: Partial<CallNote>): Promise<CallNote | null> {
    return await databaseService.updateCallNote(id, updates);
  }

  static async deleteCallNote(id: string): Promise<boolean> {
    return await databaseService.deleteCallNote(id);
  }

  static async getCallNotesByLead(leadId: string): Promise<CallNote[]> {
    return await databaseService.getCallNotesByLead(leadId);
  }

  // Notification operations
  static async getNotificationsByUser(userId: string): Promise<Notification[]> {
    return await databaseService.getNotificationsByUser(userId);
  }

  static async createNotification(notification: Omit<Notification, 'id' | 'createdAt'>): Promise<Notification> {
    return await databaseService.createNotification(notification);
  }

  static async markNotificationAsRead(id: string): Promise<boolean> {
    return await databaseService.markNotificationAsRead(id);
  }

  static async deleteNotification(id: string): Promise<boolean> {
    return await databaseService.deleteNotification(id);
  }

  // Email record operations
  static async getEmailRecordsByLead(leadId: string): Promise<EmailRecord[]> {
    return await databaseService.getEmailRecordsByLead(leadId);
  }

  static async createEmailRecord(emailRecord: Omit<EmailRecord, 'id' | 'createdAt'>): Promise<EmailRecord> {
    return await databaseService.createEmailRecord(emailRecord);
  }

  // Dashboard statistics
  static async getDashboardStats(): Promise<DashboardStats> {
    const leads = await this.getAllLeads();
    const companies = await this.getAllCompanies();
    const followUps = await this.getAllFollowUps();
    
    const today = new Date();
    const todayFollowUps = followUps.filter(fu => {
      const fuDate = new Date(fu.scheduledDate);
      return fuDate.toDateString() === today.toDateString() && fu.status === 'scheduled';
    });
    
    const overdueFollowUps = followUps.filter(fu => {
      const fuDate = new Date(fu.scheduledDate);
      return fuDate < today && fu.status === 'scheduled';
    });
    
    const closedWon = leads.filter(lead => lead.stage === 'closed-won').length;
    const totalLeads = leads.length;
    const conversionRate = totalLeads > 0 ? (closedWon / totalLeads) * 100 : 0;
    
    // Calculate average response time (mock calculation)
    const avgResponseTime = 2.5; // hours
    
    return {
      totalLeads,
      totalCompanies: companies.length,
      todayFollowUps: todayFollowUps.length,
      overdueFollowUps: overdueFollowUps.length,
      conversionRate,
      avgResponseTime
    };
  }

  // Search and filter operations
  static async searchAll(query: string): Promise<{
    leads: Lead[];
    companies: Company[];
    users: User[];
  }> {
    const [leads, companies, users] = await Promise.all([
      this.searchLeads(query),
      this.searchCompanies(query),
      this.getAllUsers() // In a real app, you might want to search users by name/email
    ]);
    
    return { leads, companies, users };
  }

  // Bulk operations
  static async bulkUpdateLeads(leadIds: string[], updates: Partial<Lead>): Promise<boolean> {
    try {
      for (const id of leadIds) {
        await this.updateLead(id, updates);
      }
      return true;
    } catch (error) {
      console.error('Bulk update failed:', error);
      return false;
    }
  }

  static async bulkDeleteLeads(leadIds: string[]): Promise<boolean> {
    try {
      for (const id of leadIds) {
        await this.deleteLead(id);
      }
      return true;
    } catch (error) {
      console.error('Bulk delete failed:', error);
      return false;
    }
  }

  // Analytics and reporting
  static async getLeadAnalytics(): Promise<{
    byStage: { stage: string; count: number }[];
    byPriority: { priority: string; count: number }[];
    byAssignee: { assignee: string; count: number }[];
    conversionRate: number;
  }> {
    const leads = await this.getAllLeads();
    const users = await this.getAllUsers();
    
    // Group by stage
    const stageCounts = leads.reduce((acc, lead) => {
      acc[lead.stage] = (acc[lead.stage] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const byStage = Object.entries(stageCounts).map(([stage, count]) => ({
      stage,
      count
    }));
    
    // Group by priority
    const priorityCounts = leads.reduce((acc, lead) => {
      acc[lead.priority] = (acc[lead.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const byPriority = Object.entries(priorityCounts).map(([priority, count]) => ({
      priority,
      count
    }));
    
    // Group by assignee
    const assigneeCounts = leads.reduce((acc, lead) => {
      const assignee = users.find(u => u.id === lead.assignedTo)?.name || 'Unassigned';
      acc[assignee] = (acc[assignee] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const byAssignee = Object.entries(assigneeCounts).map(([assignee, count]) => ({
      assignee,
      count
    }));
    
    // Calculate conversion rate
    const closedWon = leads.filter(lead => lead.stage === 'closed-won').length;
    const conversionRate = leads.length > 0 ? (closedWon / leads.length) * 100 : 0;
    
    return {
      byStage,
      byPriority,
      byAssignee,
      conversionRate
    };
  }

  static async getCompanyAnalytics(): Promise<{
    byIndustry: { industry: string; count: number }[];
    bySize: { size: string; count: number }[];
    byCountry: { country: string; count: number }[];
  }> {
    const companies = await this.getAllCompanies();
    
    // Group by industry
    const industryCounts = companies.reduce((acc, company) => {
      acc[company.industry] = (acc[company.industry] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const byIndustry = Object.entries(industryCounts).map(([industry, count]) => ({
      industry,
      count
    }));
    
    // Group by size
    const sizeCounts = companies.reduce((acc, company) => {
      acc[company.size] = (acc[company.size] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const bySize = Object.entries(sizeCounts).map(([size, count]) => ({
      size,
      count
    }));
    
    // Group by country
    const countryCounts = companies.reduce((acc, company) => {
      const country = company.country || 'Unknown';
      acc[country] = (acc[country] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const byCountry = Object.entries(countryCounts).map(([country, count]) => ({
      country,
      count
    }));
    
    return {
      byIndustry,
      bySize,
      byCountry
    };
  }

  // Data export operations
  static async exportLeadsToCSV(): Promise<string> {
    const leads = await this.getAllLeads();
    const companies = await this.getAllCompanies();
    
    const headers = [
      'ID',
      'Name',
      'Email',
      'Phone',
      'Designation',
      'Company',
      'Stage',
      'Priority',
      'Status',
      'Score',
      'Assigned To',
      'Created Date'
    ];
    
    const rows = leads.map(lead => {
      const company = companies.find(c => c.id === lead.companyId);
      return [
        lead.id,
        lead.name,
        lead.email,
        lead.phone || '',
        lead.designation,
        company?.name || '',
        lead.stage,
        lead.priority,
        lead.status,
        lead.score,
        lead.assignedTo,
        lead.createdAt.toISOString().split('T')[0]
      ];
    });
    
    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');
    
    return csvContent;
  }

  static async exportCompaniesToCSV(): Promise<string> {
    const companies = await this.getAllCompanies();
    
    const headers = [
      'ID',
      'Name',
      'Industry',
      'Size',
      'Email',
      'Phone',
      'Country',
      'Website',
      'LinkedIn',
      'Date Added'
    ];
    
    const rows = companies.map(company => [
      company.id,
      company.name,
      company.industry,
      company.size,
      company.email || '',
      company.phone || '',
      company.country || '',
      company.companyUrl || '',
      company.linkedinUrl || '',
      company.dateAdded.toISOString().split('T')[0]
    ]);
    
    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');
    
    return csvContent;
  }
} 