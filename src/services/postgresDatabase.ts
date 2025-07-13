import { Pool, PoolClient } from 'pg';
import { Lead, Company, FollowUp, CallNote, EmailRecord, User, Notification } from '../types';

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'crm_database',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

class PostgresDatabase {
  private pool: Pool;

  constructor() {
    this.pool = new Pool(dbConfig);
  }

  // Initialize database with tables and constraints
  async initialize(): Promise<void> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');

      // Create tables with proper constraints
      await this.createTables(client);
      await this.createIndexes(client);
      await this.createTriggers(client);

      await client.query('COMMIT');
      console.log('PostgreSQL database initialized successfully!');
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Failed to initialize database:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  private async createTables(client: PoolClient): Promise<void> {
    // Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'manager', 'employee')),
        status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP
      )
    `);

    // Companies table
    await client.query(`
      CREATE TABLE IF NOT EXISTS companies (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        industry VARCHAR(100) NOT NULL,
        size VARCHAR(20) NOT NULL CHECK (size IN ('small', 'medium', 'large')),
        company_url VARCHAR(500),
        linkedin_url VARCHAR(500),
        phone VARCHAR(20),
        email VARCHAR(255) CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
        address TEXT,
        country VARCHAR(100) NOT NULL,
        notes TEXT,
        date_added DATE DEFAULT CURRENT_DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT valid_company_url CHECK (company_url IS NULL OR company_url ~* '^https?://'),
        CONSTRAINT valid_linkedin_url CHECK (linkedin_url IS NULL OR linkedin_url ~* '^https?://linkedin\.com')
      )
    `);

    // Leads table
    await client.query(`
      CREATE TABLE IF NOT EXISTS leads (
        id SERIAL PRIMARY KEY,
        company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        designation VARCHAR(100) NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'converted', 'lost')),
        linkedin_url VARCHAR(500),
        email VARCHAR(255) NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
        phone VARCHAR(20),
        additional_emails JSONB DEFAULT '[]',
        additional_phones JSONB DEFAULT '[]',
        short_note TEXT,
        stage VARCHAR(20) NOT NULL DEFAULT 'prospect' CHECK (stage IN ('prospect', 'qualified', 'proposal', 'negotiation', 'closed-won', 'closed-lost')),
        priority VARCHAR(10) NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
        score INTEGER CHECK (score >= 0 AND score <= 100),
        assigned_to INTEGER REFERENCES users(id),
        initial_contact_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT valid_linkedin_url CHECK (linkedin_url IS NULL OR linkedin_url ~* '^https?://linkedin\.com'),
        CONSTRAINT valid_phone CHECK (phone IS NULL OR phone ~* '^[+]?[0-9\s\-\(\)]+$')
      )
    `);

    // Follow-ups table
    await client.query(`
      CREATE TABLE IF NOT EXISTS follow_ups (
        id SERIAL PRIMARY KEY,
        lead_id INTEGER NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
        type VARCHAR(20) NOT NULL CHECK (type IN ('call', 'email', 'meeting', 'demo')),
        scheduled_date TIMESTAMP NOT NULL,
        completed_date TIMESTAMP,
        status VARCHAR(20) NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'rescheduled')),
        notes TEXT,
        outcome VARCHAR(20) CHECK (outcome IN ('positive', 'neutral', 'negative')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT valid_scheduled_date CHECK (scheduled_date > CURRENT_TIMESTAMP),
        CONSTRAINT valid_completed_date CHECK (completed_date IS NULL OR completed_date >= scheduled_date)
      )
    `);

    // Call notes table
    await client.query(`
      CREATE TABLE IF NOT EXISTS call_notes (
        id SERIAL PRIMARY KEY,
        lead_id INTEGER NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
        audio_url VARCHAR(500),
        transcript TEXT,
        call_type VARCHAR(20) NOT NULL CHECK (call_type IN ('inbound', 'outbound')),
        duration INTEGER CHECK (duration > 0),
        outcome VARCHAR(20) NOT NULL CHECK (outcome IN ('completed', 'no-answer', 'busy', 'voicemail', 'wrong-number')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT valid_audio_url CHECK (audio_url IS NULL OR audio_url ~* '^https?://'),
        CONSTRAINT valid_duration CHECK (duration IS NULL OR duration > 0)
      )
    `);

    // Email records table
    await client.query(`
      CREATE TABLE IF NOT EXISTS email_records (
        id SERIAL PRIMARY KEY,
        lead_id INTEGER NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
        subject VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        sent_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(20) NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'opened', 'clicked', 'bounced')),
        template_used VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT valid_sent_date CHECK (sent_date <= CURRENT_TIMESTAMP)
      )
    `);

    // Notifications table
    await client.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type VARCHAR(20) NOT NULL CHECK (type IN ('info', 'success', 'warning', 'error')),
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        read_at TIMESTAMP
      )
    `);

    // Lead remarks table (for tracking lead history)
    await client.query(`
      CREATE TABLE IF NOT EXISTS lead_remarks (
        id SERIAL PRIMARY KEY,
        lead_id INTEGER NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
        remark TEXT NOT NULL,
        created_by INTEGER NOT NULL REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Lead follow-up dates table
    await client.query(`
      CREATE TABLE IF NOT EXISTS lead_follow_up_dates (
        id SERIAL PRIMARY KEY,
        lead_id INTEGER NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
        follow_up_date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT valid_follow_up_date CHECK (follow_up_date >= CURRENT_DATE)
      )
    `);
  }

  private async createIndexes(client: PoolClient): Promise<void> {
    // Performance indexes
    await client.query('CREATE INDEX IF NOT EXISTS idx_leads_company_id ON leads(company_id)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_leads_assigned_to ON leads(assigned_to)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_leads_stage ON leads(stage)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_follow_ups_lead_id ON follow_ups(lead_id)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_follow_ups_scheduled_date ON follow_ups(scheduled_date)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_call_notes_lead_id ON call_notes(lead_id)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_email_records_lead_id ON email_records(lead_id)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read)');
  }

  private async createTriggers(client: PoolClient): Promise<void> {
    // Update timestamp trigger function
    await client.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    // Apply triggers to tables with updated_at columns
    await client.query(`
      DROP TRIGGER IF EXISTS update_users_updated_at ON users;
      CREATE TRIGGER update_users_updated_at
        BEFORE UPDATE ON users
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `);

    await client.query(`
      DROP TRIGGER IF EXISTS update_companies_updated_at ON companies;
      CREATE TRIGGER update_companies_updated_at
        BEFORE UPDATE ON companies
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `);

    await client.query(`
      DROP TRIGGER IF EXISTS update_leads_updated_at ON leads;
      CREATE TRIGGER update_leads_updated_at
        BEFORE UPDATE ON leads
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `);

    await client.query(`
      DROP TRIGGER IF EXISTS update_follow_ups_updated_at ON follow_ups;
      CREATE TRIGGER update_follow_ups_updated_at
        BEFORE UPDATE ON follow_ups
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `);
  }

  // Connection management
  async connect(): Promise<void> {
    try {
      await this.pool.query('SELECT NOW()');
      console.log('Connected to PostgreSQL database');
    } catch (error) {
      console.error('Failed to connect to database:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    await this.pool.end();
    console.log('Disconnected from PostgreSQL database');
  }

  // Get pool for direct queries
  getPool(): Pool {
    return this.pool;
  }
}

// Export singleton instance
export const postgresDatabase = new PostgresDatabase(); 