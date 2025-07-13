import { Pool } from 'pg';
import { postgresDatabase } from './postgresDatabase';
import { Lead, Company, FollowUp, CallNote, EmailRecord, User, Notification } from '../types';

export class PostgresDataService {
  private pool: Pool;

  constructor() {
    this.pool = postgresDatabase.getPool();
  }

  // ==================== USERS ====================
  async createUser(userData: Omit<User, 'id'>): Promise<User> {
    const query = `
      INSERT INTO users (name, email, role)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    
    const values = [
      userData.name,
      userData.email,
      userData.role
    ];

    const result = await this.pool.query(query, values);
    return this.mapUserFromDb(result.rows[0]);
  }

  async getAllUsers(): Promise<User[]> {
    const query = 'SELECT * FROM users ORDER BY created_at DESC';
    const result = await this.pool.query(query);
    return result.rows.map(this.mapUserFromDb);
  }

  async getUserById(id: number): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await this.pool.query(query, [id]);
    return result.rows.length > 0 ? this.mapUserFromDb(result.rows[0]) : null;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const fields = Object.keys(updates).filter(key => key !== 'id');
    if (fields.length === 0) return null;

    const setClause = fields.map((field, index) => `${this.camelToSnake(field)} = $${index + 2}`).join(', ');
    const query = `UPDATE users SET ${setClause} WHERE id = $1 RETURNING *`;
    
    const values = [id, ...fields.map(field => updates[field as keyof User])];
    const result = await this.pool.query(query, values);
    
    return result.rows.length > 0 ? this.mapUserFromDb(result.rows[0]) : null;
  }

  // ==================== COMPANIES ====================
  async createCompany(companyData: Omit<Company, 'id' | 'createdAt' | 'updatedAt'>): Promise<Company> {
    const query = `
      INSERT INTO companies (name, industry, size, company_url, linkedin_url, phone, email, address, country, notes)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;
    
    const values = [
      companyData.name,
      companyData.industry,
      companyData.size,
      companyData.companyUrl,
      companyData.linkedinUrl,
      companyData.phone,
      companyData.email,
      companyData.address,
      companyData.country,
      companyData.notes
    ];

    const result = await this.pool.query(query, values);
    return this.mapCompanyFromDb(result.rows[0]);
  }

  async getAllCompanies(): Promise<Company[]> {
    const query = 'SELECT * FROM companies ORDER BY created_at DESC';
    const result = await this.pool.query(query);
    return result.rows.map(this.mapCompanyFromDb);
  }

  async getCompanyById(id: number): Promise<Company | null> {
    const query = 'SELECT * FROM companies WHERE id = $1';
    const result = await this.pool.query(query, [id]);
    return result.rows.length > 0 ? this.mapCompanyFromDb(result.rows[0]) : null;
  }

  async updateCompany(id: number, updates: Partial<Company>): Promise<Company | null> {
    const fields = Object.keys(updates).filter(key => key !== 'id' && key !== 'createdAt' && key !== 'updatedAt');
    if (fields.length === 0) return null;

    const setClause = fields.map((field, index) => `${this.camelToSnake(field)} = $${index + 2}`).join(', ');
    const query = `UPDATE companies SET ${setClause} WHERE id = $1 RETURNING *`;
    
    const values = [id, ...fields.map(field => updates[field as keyof Company])];
    const result = await this.pool.query(query, values);
    
    return result.rows.length > 0 ? this.mapCompanyFromDb(result.rows[0]) : null;
  }

  // ==================== LEADS ====================
  async createLead(leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Promise<Lead> {
    const query = `
      INSERT INTO leads (company_id, name, designation, status, linkedin_url, email, phone, additional_emails, additional_phones, short_note, stage, priority, score, assigned_to, initial_contact_date)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *
    `;
    
    const values = [
      leadData.companyId,
      leadData.name,
      leadData.designation,
      leadData.status,
      leadData.linkedinUrl,
      leadData.email,
      leadData.phone,
      JSON.stringify(leadData.additionalEmails || []),
      JSON.stringify(leadData.additionalPhones || []),
      leadData.shortNote,
      leadData.stage,
      leadData.priority,
      leadData.score,
      leadData.assignedTo,
      leadData.initialContactDate
    ];

    const result = await this.pool.query(query, values);
    const lead = this.mapLeadFromDb(result.rows[0]);
    
    // Insert initial remark if provided
    if (leadData.notes) {
      await this.addLeadRemark(lead.id, leadData.notes, leadData.assignedTo || 1);
    }

    return lead;
  }

  async getAllLeads(): Promise<Lead[]> {
    const query = `
      SELECT l.*, c.name as company_name, c.industry as company_industry
      FROM leads l
      LEFT JOIN companies c ON l.company_id = c.id
      ORDER BY l.created_at DESC
    `;
    const result = await this.pool.query(query);
    return result.rows.map(this.mapLeadFromDb);
  }

  async getLeadById(id: number): Promise<Lead | null> {
    const query = `
      SELECT l.*, c.name as company_name, c.industry as company_industry
      FROM leads l
      LEFT JOIN companies c ON l.company_id = c.id
      WHERE l.id = $1
    `;
    const result = await this.pool.query(query, [id]);
    return result.rows.length > 0 ? this.mapLeadFromDb(result.rows[0]) : null;
  }

  async updateLead(id: number, updates: Partial<Lead>): Promise<Lead | null> {
    const fields = Object.keys(updates).filter(key => key !== 'id' && key !== 'createdAt' && key !== 'updatedAt');
    if (fields.length === 0) return null;

    const setClause = fields.map((field, index) => `${this.camelToSnake(field)} = $${index + 2}`).join(', ');
    const query = `UPDATE leads SET ${setClause} WHERE id = $1 RETURNING *`;
    
    const values = [id, ...fields.map(field => {
      const value = updates[field as keyof Lead];
      if (field === 'additionalEmails' || field === 'additionalPhones') {
        return JSON.stringify(value);
      }
      return value;
    })];
    
    const result = await this.pool.query(query, values);
    return result.rows.length > 0 ? this.mapLeadFromDb(result.rows[0]) : null;
  }

  async addLeadRemark(leadId: number, remark: string, createdBy: number): Promise<void> {
    const query = `
      INSERT INTO lead_remarks (lead_id, remark, created_by)
      VALUES ($1, $2, $3)
    `;
    await this.pool.query(query, [leadId, remark, createdBy]);
  }

  async getLeadRemarks(leadId: number): Promise<string[]> {
    const query = `
      SELECT remark FROM lead_remarks 
      WHERE lead_id = $1 
      ORDER BY created_at DESC
    `;
    const result = await this.pool.query(query, [leadId]);
    return result.rows.map(row => row.remark);
  }

  // ==================== FOLLOW-UPS ====================
  async createFollowUp(followUpData: Omit<FollowUp, 'id' | 'createdAt' | 'updatedAt'>): Promise<FollowUp> {
    const query = `
      INSERT INTO follow_ups (lead_id, type, scheduled_date, notes)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    
    const values = [
      followUpData.leadId,
      followUpData.type,
      followUpData.scheduledDate,
      followUpData.notes
    ];

    const result = await this.pool.query(query, values);
    return this.mapFollowUpFromDb(result.rows[0]);
  }

  async getFollowUpsByLeadId(leadId: number): Promise<FollowUp[]> {
    const query = 'SELECT * FROM follow_ups WHERE lead_id = $1 ORDER BY scheduled_date ASC';
    const result = await this.pool.query(query, [leadId]);
    return result.rows.map(this.mapFollowUpFromDb);
  }

  // ==================== CALL NOTES ====================
  async createCallNote(callNoteData: Omit<CallNote, 'id' | 'createdAt'>): Promise<CallNote> {
    const query = `
      INSERT INTO call_notes (lead_id, audio_url, transcript, call_type, duration, outcome)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    
    const values = [
      callNoteData.leadId,
      callNoteData.audioUrl,
      callNoteData.transcript,
      callNoteData.callType,
      callNoteData.duration,
      callNoteData.outcome
    ];

    const result = await this.pool.query(query, values);
    return this.mapCallNoteFromDb(result.rows[0]);
  }

  async getCallNotesByLeadId(leadId: number): Promise<CallNote[]> {
    const query = 'SELECT * FROM call_notes WHERE lead_id = $1 ORDER BY created_at DESC';
    const result = await this.pool.query(query, [leadId]);
    return result.rows.map(this.mapCallNoteFromDb);
  }

  // ==================== EMAIL RECORDS ====================
  async createEmailRecord(emailData: Omit<EmailRecord, 'id' | 'createdAt'>): Promise<EmailRecord> {
    const query = `
      INSERT INTO email_records (lead_id, subject, content, template_used)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    
    const values = [
      emailData.leadId,
      emailData.subject,
      emailData.content,
      emailData.templateUsed
    ];

    const result = await this.pool.query(query, values);
    return this.mapEmailRecordFromDb(result.rows[0]);
  }

  async getEmailRecordsByLeadId(leadId: number): Promise<EmailRecord[]> {
    const query = 'SELECT * FROM email_records WHERE lead_id = $1 ORDER BY sent_date DESC';
    const result = await this.pool.query(query, [leadId]);
    return result.rows.map(this.mapEmailRecordFromDb);
  }

  // ==================== NOTIFICATIONS ====================
  async createNotification(notificationData: Omit<Notification, 'id' | 'createdAt'>): Promise<Notification> {
    const query = `
      INSERT INTO notifications (user_id, title, message, type)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    
    const values = [
      notificationData.userId,
      notificationData.title,
      notificationData.message,
      notificationData.type
    ];

    const result = await this.pool.query(query, values);
    return this.mapNotificationFromDb(result.rows[0]);
  }

  async getNotificationsByUserId(userId: number): Promise<Notification[]> {
    const query = 'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC';
    const result = await this.pool.query(query, [userId]);
    return result.rows.map(this.mapNotificationFromDb);
  }

  // ==================== MAPPING FUNCTIONS ====================
  private mapUserFromDb(row: any): User {
    return {
      id: row.id,
      username: row.username,
      email: row.email,
      passwordHash: row.password_hash,
      role: row.role,
      status: row.status,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      lastLogin: row.last_login ? new Date(row.last_login) : undefined
    };
  }

  private mapCompanyFromDb(row: any): Company {
    return {
      id: row.id,
      name: row.name,
      industry: row.industry,
      size: row.size,
      companyUrl: row.company_url,
      linkedinUrl: row.linkedin_url,
      phone: row.phone,
      email: row.email,
      address: row.address,
      country: row.country,
      notes: row.notes,
      dateAdded: new Date(row.date_added),
      assignedEmployees: [], // This would need a separate query
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };
  }

  private mapLeadFromDb(row: any): Lead {
    return {
      id: row.id,
      companyId: row.company_id,
      name: row.name,
      designation: row.designation,
      status: row.status,
      linkedinUrl: row.linkedin_url,
      email: row.email,
      phone: row.phone,
      additionalEmails: row.additional_emails || [],
      additionalPhones: row.additional_phones || [],
      shortNote: row.short_note,
      stage: row.stage,
      priority: row.priority,
      score: row.score,
      assignedTo: row.assigned_to,
      initialContactDate: row.initial_contact_date ? new Date(row.initial_contact_date) : undefined,
      followUpDates: [], // This would need a separate query
      remarks: [], // This would need a separate query
      emailsSent: [], // This would need a separate query
      callNotes: [], // This would need a separate query
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      notes: '' // This would need to be populated from remarks
    };
  }

  private mapFollowUpFromDb(row: any): FollowUp {
    return {
      id: row.id,
      leadId: row.lead_id,
      type: row.type,
      scheduledDate: new Date(row.scheduled_date),
      completedDate: row.completed_date ? new Date(row.completed_date) : undefined,
      status: row.status,
      notes: row.notes,
      outcome: row.outcome,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };
  }

  private mapCallNoteFromDb(row: any): CallNote {
    return {
      id: row.id,
      leadId: row.lead_id,
      audioUrl: row.audio_url,
      transcript: row.transcript,
      callType: row.call_type,
      duration: row.duration,
      outcome: row.outcome,
      createdAt: new Date(row.created_at)
    };
  }

  private mapEmailRecordFromDb(row: any): EmailRecord {
    return {
      id: row.id,
      leadId: row.lead_id,
      subject: row.subject,
      content: row.content,
      sentDate: new Date(row.sent_date),
      status: row.status,
      templateUsed: row.template_used,
      createdAt: new Date(row.created_at)
    };
  }

  private mapNotificationFromDb(row: any): Notification {
    return {
      id: row.id,
      userId: row.user_id,
      title: row.title,
      message: row.message,
      type: row.type,
      isRead: row.is_read,
      createdAt: new Date(row.created_at),
      readAt: row.read_at ? new Date(row.read_at) : undefined
    };
  }

  private camelToSnake(str: string): string {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
  }
}

// Export singleton instance
export const postgresDataService = new PostgresDataService(); 