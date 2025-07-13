import { User, Company, Lead, FollowUp, CallNote, Notification, EmailRecord } from '../types';

// Database configuration
interface DatabaseConfig {
  type: 'sqlite' | 'postgresql' | 'mysql';
  host?: string;
  port?: number;
  database: string;
  username?: string;
  password?: string;
}

// Database schema definitions
export const DATABASE_SCHEMA = {
  users: `
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(36) PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      name VARCHAR(255) NOT NULL,
      role ENUM('admin', 'manager', 'employee') NOT NULL DEFAULT 'employee',
      avatar VARCHAR(500),
      last_login TIMESTAMP,
      status ENUM('active', 'inactive') DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `,
  
  companies: `
    CREATE TABLE IF NOT EXISTS companies (
      id VARCHAR(36) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      industry VARCHAR(100) NOT NULL,
      size ENUM('small', 'medium', 'large') NOT NULL,
      company_url VARCHAR(500),
      linkedin_url VARCHAR(500),
      address TEXT,
      country VARCHAR(100),
      notes TEXT,
      date_added DATE NOT NULL,
      phone VARCHAR(50),
      email VARCHAR(255),
      assigned_employees JSON,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `,
  
  leads: `
    CREATE TABLE IF NOT EXISTS leads (
      id VARCHAR(36) PRIMARY KEY,
      company_id VARCHAR(36) NOT NULL,
      name VARCHAR(255) NOT NULL,
      designation VARCHAR(255) NOT NULL,
      status ENUM('active', 'inactive', 'qualified', 'disqualified') DEFAULT 'active',
      linkedin_url VARCHAR(500),
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(50),
      additional_emails JSON,
      additional_phones JSON,
      short_note TEXT,
      stage ENUM('prospect', 'qualified', 'proposal', 'negotiation', 'closed-won', 'closed-lost') DEFAULT 'prospect',
      priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
      initial_contact_date DATE,
      follow_up_dates JSON,
      remarks JSON,
      emails_sent JSON,
      score INTEGER DEFAULT 0,
      assigned_to VARCHAR(36),
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
      FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL
    )
  `,
  
  follow_ups: `
    CREATE TABLE IF NOT EXISTS follow_ups (
      id VARCHAR(36) PRIMARY KEY,
      lead_id VARCHAR(36) NOT NULL,
      company_id VARCHAR(36) NOT NULL,
      type ENUM('call', 'email', 'meeting', 'demo') NOT NULL,
      scheduled_date TIMESTAMP NOT NULL,
      status ENUM('scheduled', 'completed', 'missed', 'rescheduled') DEFAULT 'scheduled',
      priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
      notes TEXT,
      created_by VARCHAR(36) NOT NULL,
      completed_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE,
      FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
      FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
    )
  `,
  
  call_notes: `
    CREATE TABLE IF NOT EXISTS call_notes (
      id VARCHAR(36) PRIMARY KEY,
      lead_id VARCHAR(36) NOT NULL,
      audio_url VARCHAR(500),
      transcript TEXT,
      call_type ENUM('inbound', 'outbound') NOT NULL,
      duration INTEGER DEFAULT 0,
      outcome ENUM('completed', 'no-answer', 'voicemail', 'scheduled') NOT NULL,
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE
    )
  `,
  
  notifications: `
    CREATE TABLE IF NOT EXISTS notifications (
      id VARCHAR(36) PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      type ENUM('info', 'success', 'warning', 'error') DEFAULT 'info',
      read BOOLEAN DEFAULT FALSE,
      user_id VARCHAR(36) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `,
  
  email_records: `
    CREATE TABLE IF NOT EXISTS email_records (
      id VARCHAR(36) PRIMARY KEY,
      lead_id VARCHAR(36) NOT NULL,
      subject VARCHAR(255) NOT NULL,
      content TEXT NOT NULL,
      sent_date TIMESTAMP NOT NULL,
      status ENUM('sent', 'delivered', 'opened', 'clicked', 'bounced') DEFAULT 'sent',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE
    )
  `,
  
  api_keys: `
    CREATE TABLE IF NOT EXISTS api_keys (
      id VARCHAR(36) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      service VARCHAR(100) NOT NULL,
      key_value TEXT NOT NULL,
      status ENUM('active', 'inactive') DEFAULT 'active',
      last_used TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `,
  
  email_templates: `
    CREATE TABLE IF NOT EXISTS email_templates (
      id VARCHAR(36) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      subject VARCHAR(255) NOT NULL,
      content TEXT NOT NULL,
      type VARCHAR(100) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `,
  
  sync_history: `
    CREATE TABLE IF NOT EXISTS sync_history (
      id VARCHAR(36) PRIMARY KEY,
      date TIMESTAMP NOT NULL,
      user_id VARCHAR(36) NOT NULL,
      action ENUM('sync', 'upload', 'download') NOT NULL,
      rows_affected INTEGER DEFAULT 0,
      status ENUM('success', 'warning', 'error') NOT NULL,
      details TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `,
  
  sentiment_data: `
    CREATE TABLE IF NOT EXISTS sentiment_data (
      id VARCHAR(36) PRIMARY KEY,
      lead_id VARCHAR(36) NOT NULL,
      company_id VARCHAR(36) NOT NULL,
      feedback TEXT NOT NULL,
      sentiment ENUM('positive', 'neutral', 'negative') NOT NULL,
      confidence DECIMAL(3,2) NOT NULL,
      source VARCHAR(50) NOT NULL,
      suggested_action TEXT,
      keywords JSON,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE,
      FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
    )
  `
};

export class DatabaseService {
  private config: DatabaseConfig;
  private connection: any = null;

  constructor(config: DatabaseConfig) {
    this.config = config;
  }

  async connect(): Promise<void> {
    try {
      if (this.config.type === 'sqlite') {
        await this.initSQLite();
      } else if (this.config.type === 'postgresql') {
        await this.initPostgreSQL();
      } else if (this.config.type === 'mysql') {
        await this.initMySQL();
      }
      
      await this.createTables();
      console.log('Database connected successfully');
    } catch (error) {
      console.error('Database connection failed:', error);
      throw error;
    }
  }

  private async initSQLite() {
    // In a real implementation, you would use a library like 'sqlite3' or 'better-sqlite3'
    // For now, we'll simulate the connection
    this.connection = {
      type: 'sqlite',
      file: this.config.database
    };
  }

  private async initPostgreSQL() {
    // In a real implementation, you would use 'pg' library
    this.connection = {
      type: 'postgresql',
      host: this.config.host,
      port: this.config.port,
      database: this.config.database,
      username: this.config.username,
      password: this.config.password
    };
  }

  private async initMySQL() {
    // In a real implementation, you would use 'mysql2' library
    this.connection = {
      type: 'mysql',
      host: this.config.host,
      port: this.config.port,
      database: this.config.database,
      username: this.config.username,
      password: this.config.password
    };
  }

  private async createTables(): Promise<void> {
    // In a real implementation, you would execute the schema SQL
    console.log('Creating database tables...');
    for (const [tableName, schema] of Object.entries(DATABASE_SCHEMA)) {
      console.log(`Creating table: ${tableName}`);
      // await this.execute(schema);
    }
  }

  // Generic query execution method
  private async execute(query: string, params: any[] = []): Promise<any> {
    // In a real implementation, you would execute the query against the database
    console.log('Executing query:', query, 'with params:', params);
    return [];
  }

  // User operations
  async createUser(user: Omit<User, 'id'>): Promise<User> {
    const id = this.generateId();
    const newUser = { ...user, id };
    // await this.execute(
    //   'INSERT INTO users (id, email, name, role, avatar, last_login, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
    //   [id, user.email, user.name, user.role, user.avatar, user.lastLogin, 'active']
    // );
    return newUser;
  }

  async getUserById(id: string): Promise<User | null> {
    // const result = await this.execute('SELECT * FROM users WHERE id = ?', [id]);
    // return result.length > 0 ? this.mapUserFromDB(result[0]) : null;
    return null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    // const result = await this.execute('SELECT * FROM users WHERE email = ?', [email]);
    // return result.length > 0 ? this.mapUserFromDB(result[0]) : null;
    return null;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    // await this.execute(
    //   'UPDATE users SET name = ?, role = ?, avatar = ?, last_login = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    //   [updates.name, updates.role, updates.avatar, updates.lastLogin, id]
    // );
    return this.getUserById(id);
  }

  async deleteUser(id: string): Promise<boolean> {
    // const result = await this.execute('DELETE FROM users WHERE id = ?', [id]);
    // return result.affectedRows > 0;
    return true;
  }

  async getAllUsers(): Promise<User[]> {
    // const result = await this.execute('SELECT * FROM users ORDER BY created_at DESC');
    // return result.map(this.mapUserFromDB);
    return [];
  }

  // Company operations
  async createCompany(company: Omit<Company, 'id' | 'createdAt' | 'updatedAt'>): Promise<Company> {
    const id = this.generateId();
    const now = new Date();
    const newCompany = { 
      ...company, 
      id, 
      createdAt: now, 
      updatedAt: now 
    };
    // await this.execute(
    //   'INSERT INTO companies (id, name, industry, size, company_url, linkedin_url, address, country, notes, date_added, phone, email, assigned_employees) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    //   [id, company.name, company.industry, company.size, company.companyUrl, company.linkedinUrl, company.address, company.country, company.notes, company.dateAdded, company.phone, company.email, JSON.stringify(company.assignedEmployees)]
    // );
    return newCompany;
  }

  async getCompanyById(id: string): Promise<Company | null> {
    // const result = await this.execute('SELECT * FROM companies WHERE id = ?', [id]);
    // return result.length > 0 ? this.mapCompanyFromDB(result[0]) : null;
    return null;
  }

  async updateCompany(id: string, updates: Partial<Company>): Promise<Company | null> {
    // await this.execute(
    //   'UPDATE companies SET name = ?, industry = ?, size = ?, company_url = ?, linkedin_url = ?, address = ?, country = ?, notes = ?, phone = ?, email = ?, assigned_employees = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    //   [updates.name, updates.industry, updates.size, updates.companyUrl, updates.linkedinUrl, updates.address, updates.country, updates.notes, updates.phone, updates.email, JSON.stringify(updates.assignedEmployees), id]
    // );
    return this.getCompanyById(id);
  }

  async deleteCompany(id: string): Promise<boolean> {
    // const result = await this.execute('DELETE FROM companies WHERE id = ?', [id]);
    // return result.affectedRows > 0;
    return true;
  }

  async getAllCompanies(): Promise<Company[]> {
    // const result = await this.execute('SELECT * FROM companies ORDER BY created_at DESC');
    // return result.map(this.mapCompanyFromDB);
    return [];
  }

  async searchCompanies(query: string): Promise<Company[]> {
    // const result = await this.execute(
    //   'SELECT * FROM companies WHERE name LIKE ? OR industry LIKE ? OR notes LIKE ? ORDER BY created_at DESC',
    //   [`%${query}%`, `%${query}%`, `%${query}%`]
    // );
    // return result.map(this.mapCompanyFromDB);
    return [];
  }

  // Lead operations
  async createLead(lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Promise<Lead> {
    const id = this.generateId();
    const now = new Date();
    const newLead = { 
      ...lead, 
      id, 
      createdAt: now, 
      updatedAt: now 
    };
    // await this.execute(
    //   'INSERT INTO leads (id, company_id, name, designation, status, linkedin_url, email, phone, additional_emails, additional_phones, short_note, stage, priority, initial_contact_date, follow_up_dates, remarks, emails_sent, score, assigned_to, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    //   [id, lead.companyId, lead.name, lead.designation, lead.status, lead.linkedinUrl, lead.email, lead.phone, JSON.stringify(lead.additionalEmails), JSON.stringify(lead.additionalPhones), lead.shortNote, lead.stage, lead.priority, lead.initialContactDate, JSON.stringify(lead.followUpDates), JSON.stringify(lead.remarks), JSON.stringify(lead.emailsSent), lead.score, lead.assignedTo, lead.notes]
    // );
    return newLead;
  }

  async getLeadById(id: string): Promise<Lead | null> {
    // const result = await this.execute('SELECT * FROM leads WHERE id = ?', [id]);
    // return result.length > 0 ? this.mapLeadFromDB(result[0]) : null;
    return null;
  }

  async updateLead(id: string, updates: Partial<Lead>): Promise<Lead | null> {
    // await this.execute(
    //   'UPDATE leads SET company_id = ?, name = ?, designation = ?, status = ?, linkedin_url = ?, email = ?, phone = ?, additional_emails = ?, additional_phones = ?, short_note = ?, stage = ?, priority = ?, initial_contact_date = ?, follow_up_dates = ?, remarks = ?, emails_sent = ?, score = ?, assigned_to = ?, notes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    //   [updates.companyId, updates.name, updates.designation, updates.status, updates.linkedinUrl, updates.email, updates.phone, JSON.stringify(updates.additionalEmails), JSON.stringify(updates.additionalPhones), updates.shortNote, updates.stage, updates.priority, updates.initialContactDate, JSON.stringify(updates.followUpDates), JSON.stringify(updates.remarks), JSON.stringify(updates.emailsSent), updates.score, updates.assignedTo, updates.notes, id]
    // );
    return this.getLeadById(id);
  }

  async deleteLead(id: string): Promise<boolean> {
    // const result = await this.execute('DELETE FROM leads WHERE id = ?', [id]);
    // return result.affectedRows > 0;
    return true;
  }

  async getAllLeads(): Promise<Lead[]> {
    // const result = await this.execute('SELECT * FROM leads ORDER BY created_at DESC');
    // return result.map(this.mapLeadFromDB);
    return [];
  }

  async getLeadsByCompany(companyId: string): Promise<Lead[]> {
    // const result = await this.execute('SELECT * FROM leads WHERE company_id = ? ORDER BY created_at DESC', [companyId]);
    // return result.map(this.mapLeadFromDB);
    return [];
  }

  async getLeadsByAssignee(userId: string): Promise<Lead[]> {
    // const result = await this.execute('SELECT * FROM leads WHERE assigned_to = ? ORDER BY created_at DESC', [userId]);
    // return result.map(this.mapLeadFromDB);
    return [];
  }

  async searchLeads(query: string): Promise<Lead[]> {
    // const result = await this.execute(
    //   'SELECT * FROM leads WHERE name LIKE ? OR email LIKE ? OR designation LIKE ? OR notes LIKE ? ORDER BY created_at DESC',
    //   [`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`]
    // );
    // return result.map(this.mapLeadFromDB);
    return [];
  }

  // Follow-up operations
  async createFollowUp(followUp: Omit<FollowUp, 'id'>): Promise<FollowUp> {
    const id = this.generateId();
    const newFollowUp = { ...followUp, id };
    // await this.execute(
    //   'INSERT INTO follow_ups (id, lead_id, company_id, type, scheduled_date, status, priority, notes, created_by, completed_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    //   [id, followUp.leadId, followUp.companyId, followUp.type, followUp.scheduledDate, followUp.status, followUp.priority, followUp.notes, followUp.createdBy, followUp.completedAt]
    // );
    return newFollowUp;
  }

  async getFollowUpById(id: string): Promise<FollowUp | null> {
    // const result = await this.execute('SELECT * FROM follow_ups WHERE id = ?', [id]);
    // return result.length > 0 ? this.mapFollowUpFromDB(result[0]) : null;
    return null;
  }

  async updateFollowUp(id: string, updates: Partial<FollowUp>): Promise<FollowUp | null> {
    // await this.execute(
    //   'UPDATE follow_ups SET lead_id = ?, company_id = ?, type = ?, scheduled_date = ?, status = ?, priority = ?, notes = ?, created_by = ?, completed_at = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    //   [updates.leadId, updates.companyId, updates.type, updates.scheduledDate, updates.status, updates.priority, updates.notes, updates.createdBy, updates.completedAt, id]
    // );
    return this.getFollowUpById(id);
  }

  async deleteFollowUp(id: string): Promise<boolean> {
    // const result = await this.execute('DELETE FROM follow_ups WHERE id = ?', [id]);
    // return result.affectedRows > 0;
    return true;
  }

  async getAllFollowUps(): Promise<FollowUp[]> {
    // const result = await this.execute('SELECT * FROM follow_ups ORDER BY scheduled_date ASC');
    // return result.map(this.mapFollowUpFromDB);
    return [];
  }

  async getFollowUpsByLead(leadId: string): Promise<FollowUp[]> {
    // const result = await this.execute('SELECT * FROM follow_ups WHERE lead_id = ? ORDER BY scheduled_date ASC', [leadId]);
    // return result.map(this.mapFollowUpFromDB);
    return [];
  }

  async getFollowUpsByDate(date: Date): Promise<FollowUp[]> {
    // const result = await this.execute('SELECT * FROM follow_ups WHERE DATE(scheduled_date) = DATE(?) ORDER BY scheduled_date ASC', [date]);
    // return result.map(this.mapFollowUpFromDB);
    return [];
  }

  // Call note operations
  async createCallNote(callNote: Omit<CallNote, 'id' | 'createdAt'>): Promise<CallNote> {
    const id = this.generateId();
    const now = new Date();
    const newCallNote = { ...callNote, id, createdAt: now };
    // await this.execute(
    //   'INSERT INTO call_notes (id, lead_id, audio_url, transcript, call_type, duration, outcome, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    //   [id, callNote.leadId, callNote.audioUrl, callNote.transcript, callNote.callType, callNote.duration, callNote.outcome, callNote.notes]
    // );
    return newCallNote;
  }

  async getCallNoteById(id: string): Promise<CallNote | null> {
    // const result = await this.execute('SELECT * FROM call_notes WHERE id = ?', [id]);
    // return result.length > 0 ? this.mapCallNoteFromDB(result[0]) : null;
    return null;
  }

  async updateCallNote(id: string, updates: Partial<CallNote>): Promise<CallNote | null> {
    // await this.execute(
    //   'UPDATE call_notes SET lead_id = ?, audio_url = ?, transcript = ?, call_type = ?, duration = ?, outcome = ?, notes = ? WHERE id = ?',
    //   [updates.leadId, updates.audioUrl, updates.transcript, updates.callType, updates.duration, updates.outcome, updates.notes, id]
    // );
    return this.getCallNoteById(id);
  }

  async deleteCallNote(id: string): Promise<boolean> {
    // const result = await this.execute('DELETE FROM call_notes WHERE id = ?', [id]);
    // return result.affectedRows > 0;
    return true;
  }

  async getAllCallNotes(): Promise<CallNote[]> {
    // const result = await this.execute('SELECT * FROM call_notes ORDER BY created_at DESC');
    // return result.map(this.mapCallNoteFromDB);
    return [];
  }

  async getCallNotesByLead(leadId: string): Promise<CallNote[]> {
    // const result = await this.execute('SELECT * FROM call_notes WHERE lead_id = ? ORDER BY created_at DESC', [leadId]);
    // return result.map(this.mapCallNoteFromDB);
    return [];
  }

  // Notification operations
  async createNotification(notification: Omit<Notification, 'id' | 'createdAt'>): Promise<Notification> {
    const id = this.generateId();
    const now = new Date();
    const newNotification = { ...notification, id, createdAt: now };
    // await this.execute(
    //   'INSERT INTO notifications (id, title, message, type, read, user_id) VALUES (?, ?, ?, ?, ?, ?)',
    //   [id, notification.title, notification.message, notification.type, notification.read, notification.userId]
    // );
    return newNotification;
  }

  async getNotificationById(id: string): Promise<Notification | null> {
    // const result = await this.execute('SELECT * FROM notifications WHERE id = ?', [id]);
    // return result.length > 0 ? this.mapNotificationFromDB(result[0]) : null;
    return null;
  }

  async updateNotification(id: string, updates: Partial<Notification>): Promise<Notification | null> {
    // await this.execute(
    //   'UPDATE notifications SET title = ?, message = ?, type = ?, read = ?, user_id = ? WHERE id = ?',
    //   [updates.title, updates.message, updates.type, updates.read, updates.userId, id]
    // );
    return this.getNotificationById(id);
  }

  async deleteNotification(id: string): Promise<boolean> {
    // const result = await this.execute('DELETE FROM notifications WHERE id = ?', [id]);
    // return result.affectedRows > 0;
    return true;
  }

  async getNotificationsByUser(userId: string): Promise<Notification[]> {
    // const result = await this.execute('SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC', [userId]);
    // return result.map(this.mapNotificationFromDB);
    return [];
  }

  async markNotificationAsRead(id: string): Promise<boolean> {
    // const result = await this.execute('UPDATE notifications SET read = TRUE WHERE id = ?', [id]);
    // return result.affectedRows > 0;
    return true;
  }

  // Email record operations
  async createEmailRecord(emailRecord: Omit<EmailRecord, 'id' | 'createdAt'>): Promise<EmailRecord> {
    const id = this.generateId();
    const now = new Date();
    const newEmailRecord = { ...emailRecord, id, createdAt: now };
    // await this.execute(
    //   'INSERT INTO email_records (id, lead_id, subject, content, sent_date, status) VALUES (?, ?, ?, ?, ?, ?)',
    //   [id, emailRecord.leadId, emailRecord.subject, emailRecord.content, emailRecord.sentDate, emailRecord.status]
    // );
    return newEmailRecord;
  }

  async getEmailRecordById(id: string): Promise<EmailRecord | null> {
    // const result = await this.execute('SELECT * FROM email_records WHERE id = ?', [id]);
    // return result.length > 0 ? this.mapEmailRecordFromDB(result[0]) : null;
    return null;
  }

  async updateEmailRecord(id: string, updates: Partial<EmailRecord>): Promise<EmailRecord | null> {
    // await this.execute(
    //   'UPDATE email_records SET lead_id = ?, subject = ?, content = ?, sent_date = ?, status = ? WHERE id = ?',
    //   [updates.leadId, updates.subject, updates.content, updates.sentDate, updates.status, id]
    // );
    return this.getEmailRecordById(id);
  }

  async deleteEmailRecord(id: string): Promise<boolean> {
    // const result = await this.execute('DELETE FROM email_records WHERE id = ?', [id]);
    // return result.affectedRows > 0;
    return true;
  }

  async getEmailRecordsByLead(leadId: string): Promise<EmailRecord[]> {
    // const result = await this.execute('SELECT * FROM email_records WHERE lead_id = ? ORDER BY sent_date DESC', [leadId]);
    // return result.map(this.mapEmailRecordFromDB);
    return [];
  }

  // Utility methods
  private generateId(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  // Database mapping methods (for converting between DB format and TypeScript interfaces)
  private mapUserFromDB(dbUser: any): User {
    return {
      id: dbUser.id,
      email: dbUser.email,
      name: dbUser.name,
      role: dbUser.role,
      avatar: dbUser.avatar,
      lastLogin: dbUser.last_login ? new Date(dbUser.last_login) : undefined
    };
  }

  private mapCompanyFromDB(dbCompany: any): Company {
    return {
      id: dbCompany.id,
      name: dbCompany.name,
      industry: dbCompany.industry,
      size: dbCompany.size,
      companyUrl: dbCompany.company_url,
      linkedinUrl: dbCompany.linkedin_url,
      address: dbCompany.address,
      country: dbCompany.country,
      notes: dbCompany.notes,
      dateAdded: new Date(dbCompany.date_added),
      phone: dbCompany.phone,
      email: dbCompany.email,
      assignedEmployees: dbCompany.assigned_employees ? JSON.parse(dbCompany.assigned_employees) : [],
      createdAt: new Date(dbCompany.created_at),
      updatedAt: new Date(dbCompany.updated_at)
    };
  }

  private mapLeadFromDB(dbLead: any): Lead {
    return {
      id: dbLead.id,
      companyId: dbLead.company_id,
      name: dbLead.name,
      designation: dbLead.designation,
      status: dbLead.status,
      linkedinUrl: dbLead.linkedin_url,
      email: dbLead.email,
      phone: dbLead.phone,
      additionalEmails: dbLead.additional_emails ? JSON.parse(dbLead.additional_emails) : [],
      additionalPhones: dbLead.additional_phones ? JSON.parse(dbLead.additional_phones) : [],
      shortNote: dbLead.short_note,
      stage: dbLead.stage,
      priority: dbLead.priority,
      initialContactDate: dbLead.initial_contact_date ? new Date(dbLead.initial_contact_date) : undefined,
      followUpDates: dbLead.follow_up_dates ? JSON.parse(dbLead.follow_up_dates).map((date: string) => new Date(date)) : [],
      remarks: dbLead.remarks ? JSON.parse(dbLead.remarks) : [],
      emailsSent: dbLead.emails_sent ? JSON.parse(dbLead.emails_sent) : [],
      callNotes: [], // This would be loaded separately
      score: dbLead.score,
      assignedTo: dbLead.assigned_to,
      notes: dbLead.notes,
      createdAt: new Date(dbLead.created_at),
      updatedAt: new Date(dbLead.updated_at)
    };
  }

  private mapFollowUpFromDB(dbFollowUp: any): FollowUp {
    return {
      id: dbFollowUp.id,
      leadId: dbFollowUp.lead_id,
      companyId: dbFollowUp.company_id,
      type: dbFollowUp.type,
      scheduledDate: new Date(dbFollowUp.scheduled_date),
      status: dbFollowUp.status,
      priority: dbFollowUp.priority,
      notes: dbFollowUp.notes,
      createdBy: dbFollowUp.created_by,
      completedAt: dbFollowUp.completed_at ? new Date(dbFollowUp.completed_at) : undefined
    };
  }

  private mapCallNoteFromDB(dbCallNote: any): CallNote {
    return {
      id: dbCallNote.id,
      leadId: dbCallNote.lead_id,
      audioUrl: dbCallNote.audio_url,
      transcript: dbCallNote.transcript,
      callType: dbCallNote.call_type,
      duration: dbCallNote.duration,
      outcome: dbCallNote.outcome,
      createdAt: new Date(dbCallNote.created_at)
    };
  }

  private mapNotificationFromDB(dbNotification: any): Notification {
    return {
      id: dbNotification.id,
      title: dbNotification.title,
      message: dbNotification.message,
      type: dbNotification.type,
      read: dbNotification.read,
      createdAt: new Date(dbNotification.created_at),
      userId: dbNotification.user_id
    };
  }

  private mapEmailRecordFromDB(dbEmailRecord: any): EmailRecord {
    return {
      id: dbEmailRecord.id,
      subject: dbEmailRecord.subject,
      content: dbEmailRecord.content,
      sentDate: new Date(dbEmailRecord.sent_date),
      status: dbEmailRecord.status
    };
  }

  // Close database connection
  async disconnect(): Promise<void> {
    if (this.connection) {
      // In a real implementation, you would close the database connection
      console.log('Database connection closed');
      this.connection = null;
    }
  }
}

// Create a singleton instance
export const databaseService = new DatabaseService({
  type: 'sqlite',
  database: 'crm_database.db'
}); 