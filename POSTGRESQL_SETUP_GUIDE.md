# PostgreSQL Database Setup Guide

This guide will help you set up PostgreSQL with proper constraints for your CRM application.

## 🎯 Why PostgreSQL?

### **Best Choice for Your CRM:**
- **ACID Compliance** - Ensures data integrity
- **Advanced Constraints** - Foreign keys, check constraints, unique constraints
- **Rich Data Types** - JSON, arrays, custom types
- **Scalability** - Handles large datasets efficiently
- **Free & Open Source** - No licensing costs
- **Excellent Performance** - Optimized for complex queries

## 📋 Prerequisites

1. **PostgreSQL Installation**
   - Download from [postgresql.org](https://www.postgresql.org/download/)
   - Or use Docker: `docker run --name postgres-crm -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres`

2. **Node.js Dependencies**
   ```bash
   npm install pg @types/pg
   ```

## 🚀 Installation Options

### Option 1: Local PostgreSQL Installation

1. **Download & Install**
   - Go to [postgresql.org/download](https://www.postgresql.org/download/)
   - Choose your operating system
   - Follow installation wizard

2. **Create Database**
   ```sql
   CREATE DATABASE crm_database;
   CREATE USER crm_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE crm_database TO crm_user;
   ```

### Option 2: Docker (Recommended for Development)

```bash
# Pull PostgreSQL image
docker pull postgres:15

# Run PostgreSQL container
docker run --name postgres-crm \
  -e POSTGRES_DB=crm_database \
  -e POSTGRES_USER=crm_user \
  -e POSTGRES_PASSWORD=your_password \
  -p 5432:5432 \
  -d postgres:15

# Connect to database
docker exec -it postgres-crm psql -U crm_user -d crm_database
```

### Option 3: Cloud Services

- **AWS RDS** - Managed PostgreSQL service
- **Google Cloud SQL** - Fully managed database
- **Azure Database** - Enterprise-grade PostgreSQL
- **Supabase** - Open source Firebase alternative
- **Railway** - Simple deployment platform

## 🔧 Database Schema

### Core Tables with Constraints

```sql
-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'manager', 'employee')),
  avatar VARCHAR(500),
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Companies table
CREATE TABLE companies (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  industry VARCHAR(100) NOT NULL,
  size VARCHAR(20) NOT NULL CHECK (size IN ('small', 'medium', 'large')),
  company_url VARCHAR(500) CHECK (company_url ~* '^https?://'),
  linkedin_url VARCHAR(500) CHECK (linkedin_url ~* '^https?://linkedin\.com'),
  phone VARCHAR(20) CHECK (phone ~* '^[+]?[0-9\s\-\(\)]+$'),
  email VARCHAR(255) CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  address TEXT,
  country VARCHAR(100) NOT NULL,
  notes TEXT,
  date_added DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Leads table
CREATE TABLE leads (
  id SERIAL PRIMARY KEY,
  company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  designation VARCHAR(100) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'qualified', 'disqualified')),
  linkedin_url VARCHAR(500) CHECK (linkedin_url ~* '^https?://linkedin\.com'),
  email VARCHAR(255) NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  phone VARCHAR(20) CHECK (phone ~* '^[+]?[0-9\s\-\(\)]+$'),
  additional_emails JSONB DEFAULT '[]',
  additional_phones JSONB DEFAULT '[]',
  short_note TEXT,
  stage VARCHAR(20) NOT NULL DEFAULT 'prospect' CHECK (stage IN ('prospect', 'qualified', 'proposal', 'negotiation', 'closed-won', 'closed-lost')),
  priority VARCHAR(10) NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  score INTEGER CHECK (score >= 0 AND score <= 100),
  assigned_to VARCHAR(255),
  initial_contact_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Follow-ups table
CREATE TABLE follow_ups (
  id SERIAL PRIMARY KEY,
  lead_id INTEGER NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('call', 'email', 'meeting', 'demo')),
  scheduled_date TIMESTAMP NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'missed', 'rescheduled')),
  priority VARCHAR(10) NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  notes TEXT,
  created_by VARCHAR(255) NOT NULL,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_scheduled_date CHECK (scheduled_date > CURRENT_TIMESTAMP),
  CONSTRAINT valid_completed_at CHECK (completed_at IS NULL OR completed_at >= scheduled_date)
);

-- Call notes table
CREATE TABLE call_notes (
  id SERIAL PRIMARY KEY,
  lead_id INTEGER NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  audio_url VARCHAR(500) CHECK (audio_url ~* '^https?://'),
  transcript TEXT,
  call_type VARCHAR(20) NOT NULL CHECK (call_type IN ('inbound', 'outbound')),
  duration INTEGER CHECK (duration > 0),
  outcome VARCHAR(20) NOT NULL CHECK (outcome IN ('completed', 'no-answer', 'voicemail', 'scheduled')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Email records table
CREATE TABLE email_records (
  id SERIAL PRIMARY KEY,
  lead_id INTEGER NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  subject VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  sent_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(20) NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'opened', 'clicked', 'bounced')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_sent_date CHECK (sent_date <= CURRENT_TIMESTAMP)
);

-- Notifications table
CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('info', 'success', 'warning', 'error')),
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Performance Indexes

```sql
-- Create indexes for better performance
CREATE INDEX idx_leads_company_id ON leads(company_id);
CREATE INDEX idx_leads_assigned_to ON leads(assigned_to);
CREATE INDEX idx_leads_stage ON leads(stage);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_follow_ups_lead_id ON follow_ups(lead_id);
CREATE INDEX idx_follow_ups_scheduled_date ON follow_ups(scheduled_date);
CREATE INDEX idx_call_notes_lead_id ON call_notes(lead_id);
CREATE INDEX idx_email_records_lead_id ON email_records(lead_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
```

### Triggers for Auto-updating Timestamps

```sql
-- Function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON companies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_follow_ups_updated_at
  BEFORE UPDATE ON follow_ups
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

## 🔐 Environment Configuration

Create a `.env` file in your project root:

```env
# PostgreSQL Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=crm_database
DB_USER=crm_user
DB_PASSWORD=your_password

# Optional: Connection Pool Settings
DB_MAX_CONNECTIONS=20
DB_IDLE_TIMEOUT=30000
DB_CONNECTION_TIMEOUT=2000
```

## 🧪 Sample Data

```sql
-- Insert sample companies
INSERT INTO companies (name, industry, size, country, notes) VALUES
('TechCorp Solutions', 'Technology', 'large', 'United States', 'Enterprise client with high potential'),
('StartupXYZ', 'Fintech', 'small', 'United States', 'Fast-growing startup'),
('Enterprise Ltd', 'Manufacturing', 'large', 'United States', 'Established manufacturing company');

-- Insert sample users
INSERT INTO users (name, email, role) VALUES
('John Doe', 'john.doe@company.com', 'admin'),
('Sarah Johnson', 'sarah.johnson@company.com', 'manager'),
('Mike Davis', 'mike.davis@company.com', 'employee');

-- Insert sample leads
INSERT INTO leads (company_id, name, designation, email, stage, priority, score, assigned_to) VALUES
(1, 'John Smith', 'CTO', 'john.smith@techcorp.com', 'qualified', 'high', 85, 'John Doe'),
(2, 'Sarah Johnson', 'CEO', 'sarah.johnson@startupxyz.com', 'proposal', 'high', 90, 'Sarah Johnson'),
(3, 'Mike Davis', 'VP Sales', 'mike.davis@enterprise.com', 'prospect', 'medium', 75, 'Mike Davis');
```

## 🔍 Data Validation Examples

### Email Validation
```sql
-- Check for valid emails
SELECT * FROM leads WHERE email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
```

### Phone Number Validation
```sql
-- Check for valid phone numbers
SELECT * FROM leads WHERE phone IS NOT NULL AND phone !~ '^[+]?[0-9\s\-\(\)]+$';
```

### URL Validation
```sql
-- Check for valid LinkedIn URLs
SELECT * FROM leads WHERE linkedin_url IS NOT NULL AND linkedin_url !~ '^https?://linkedin\.com';
```

## 📊 Useful Queries

### Lead Analytics
```sql
-- Leads by stage
SELECT stage, COUNT(*) as count 
FROM leads 
GROUP BY stage 
ORDER BY count DESC;

-- Conversion rate
SELECT 
  COUNT(CASE WHEN stage = 'closed-won' THEN 1 END) * 100.0 / COUNT(*) as conversion_rate
FROM leads;

-- Average score by priority
SELECT priority, AVG(score) as avg_score 
FROM leads 
GROUP BY priority;
```

### Follow-up Management
```sql
-- Overdue follow-ups
SELECT l.name, f.scheduled_date, f.type
FROM follow_ups f
JOIN leads l ON f.lead_id = l.id
WHERE f.scheduled_date < CURRENT_TIMESTAMP 
AND f.status = 'scheduled';

-- Today's follow-ups
SELECT l.name, f.scheduled_date, f.type
FROM follow_ups f
JOIN leads l ON f.lead_id = l.id
WHERE DATE(f.scheduled_date) = CURRENT_DATE;
```

## 🚀 Production Deployment

### 1. **Security Best Practices**
```sql
-- Create read-only user for reports
CREATE USER crm_readonly WITH PASSWORD 'secure_password';
GRANT CONNECT ON DATABASE crm_database TO crm_readonly;
GRANT USAGE ON SCHEMA public TO crm_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO crm_readonly;
```

### 2. **Backup Strategy**
```bash
# Automated daily backup
pg_dump -h localhost -U crm_user -d crm_database > backup_$(date +%Y%m%d).sql

# Restore from backup
psql -h localhost -U crm_user -d crm_database < backup_20240101.sql
```

### 3. **Performance Monitoring**
```sql
-- Check slow queries
SELECT query, mean_time, calls 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;

-- Table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

## 🔧 Troubleshooting

### Common Issues

1. **Connection Refused**
   ```bash
   # Check if PostgreSQL is running
   sudo systemctl status postgresql
   
   # Start PostgreSQL
   sudo systemctl start postgresql
   ```

2. **Permission Denied**
   ```sql
   -- Grant necessary permissions
   GRANT ALL PRIVILEGES ON DATABASE crm_database TO crm_user;
   GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO crm_user;
   ```

3. **Port Already in Use**
   ```bash
   # Check what's using port 5432
   sudo netstat -tlnp | grep 5432
   
   # Kill process if needed
   sudo kill -9 <PID>
   ```

## 📚 Additional Resources

- [PostgreSQL Official Documentation](https://www.postgresql.org/docs/)
- [PostgreSQL Performance Tuning](https://www.postgresql.org/docs/current/performance.html)
- [PostgreSQL Security](https://www.postgresql.org/docs/current/security.html)
- [pgAdmin - GUI Tool](https://www.pgadmin.org/)

## 🎯 Next Steps

1. **Install PostgreSQL** using one of the methods above
2. **Create the database schema** using the provided SQL
3. **Configure environment variables** in your `.env` file
4. **Test the connection** with your application
5. **Migrate existing data** from mock data to PostgreSQL
6. **Set up automated backups** for production

Your CRM application will now have a robust, scalable database with proper data constraints and validation! 