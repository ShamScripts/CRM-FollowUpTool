# Database Structure and Usage Guide

This document provides a comprehensive overview of the database structure, field definitions, and how to use the database services in your CRM application.

## 📊 Database Schema Overview

The CRM application uses a relational database with the following main entities:

### Core Tables

1. **users** - User accounts and authentication
2. **companies** - Company/organization information
3. **leads** - Lead/contact information
4. **follow_ups** - Follow-up tasks and reminders
5. **call_notes** - Call recordings and transcripts
6. **notifications** - System notifications
7. **email_records** - Email communication history
8. **api_keys** - External API integrations
9. **email_templates** - Email template management
10. **sync_history** - Excel sync operations
11. **sentiment_data** - Sentiment analysis results

## 🗄️ Detailed Table Schemas

### 1. Users Table

```sql
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role ENUM('admin', 'manager', 'employee') NOT NULL DEFAULT 'employee',
  avatar VARCHAR(500),
  last_login TIMESTAMP,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Fields:**
- `id` - Unique identifier (UUID)
- `email` - User's email address (unique)
- `name` - Full name
- `role` - User role (admin/manager/employee)
- `avatar` - Profile picture URL
- `last_login` - Last login timestamp
- `status` - Account status (active/inactive)
- `created_at` - Account creation timestamp
- `updated_at` - Last update timestamp

### 2. Companies Table

```sql
CREATE TABLE companies (
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
);
```

**Fields:**
- `id` - Unique identifier (UUID)
- `name` - Company name
- `industry` - Industry sector
- `size` - Company size (small/medium/large)
- `company_url` - Company website
- `linkedin_url` - LinkedIn company page
- `address` - Physical address
- `country` - Country location
- `notes` - Additional notes
- `date_added` - Date when company was added
- `phone` - Company phone number
- `email` - Company email address
- `assigned_employees` - JSON array of assigned user IDs
- `created_at` - Record creation timestamp
- `updated_at` - Last update timestamp

### 3. Leads Table

```sql
CREATE TABLE leads (
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
);
```

**Fields:**
- `id` - Unique identifier (UUID)
- `company_id` - Reference to companies table
- `name` - Lead's full name
- `designation` - Job title/position
- `status` - Lead status (active/inactive/qualified/disqualified)
- `linkedin_url` - LinkedIn profile URL
- `email` - Primary email address
- `phone` - Primary phone number
- `additional_emails` - JSON array of additional email addresses
- `additional_phones` - JSON array of additional phone numbers
- `short_note` - Brief description/note
- `stage` - Sales stage (prospect/qualified/proposal/negotiation/closed-won/closed-lost)
- `priority` - Priority level (low/medium/high)
- `initial_contact_date` - First contact date
- `follow_up_dates` - JSON array of follow-up dates
- `remarks` - JSON array of remarks/notes
- `emails_sent` - JSON array of sent emails
- `score` - Lead score (0-100)
- `assigned_to` - Reference to users table (assigned employee)
- `notes` - Additional notes
- `created_at` - Record creation timestamp
- `updated_at` - Last update timestamp

### 4. Follow-ups Table

```sql
CREATE TABLE follow_ups (
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
);
```

**Fields:**
- `id` - Unique identifier (UUID)
- `lead_id` - Reference to leads table
- `company_id` - Reference to companies table
- `type` - Follow-up type (call/email/meeting/demo)
- `scheduled_date` - Scheduled date and time
- `status` - Follow-up status (scheduled/completed/missed/rescheduled)
- `priority` - Priority level (low/medium/high)
- `notes` - Additional notes
- `created_by` - Reference to users table (who created the follow-up)
- `completed_at` - Completion timestamp
- `created_at` - Record creation timestamp
- `updated_at` - Last update timestamp

### 5. Call Notes Table

```sql
CREATE TABLE call_notes (
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
);
```

**Fields:**
- `id` - Unique identifier (UUID)
- `lead_id` - Reference to leads table
- `audio_url` - URL to call recording
- `transcript` - Call transcript text
- `call_type` - Call direction (inbound/outbound)
- `duration` - Call duration in seconds
- `outcome` - Call outcome (completed/no-answer/voicemail/scheduled)
- `notes` - Additional notes
- `created_at` - Record creation timestamp

### 6. Notifications Table

```sql
CREATE TABLE notifications (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type ENUM('info', 'success', 'warning', 'error') DEFAULT 'info',
  read BOOLEAN DEFAULT FALSE,
  user_id VARCHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

**Fields:**
- `id` - Unique identifier (UUID)
- `title` - Notification title
- `message` - Notification message
- `type` - Notification type (info/success/warning/error)
- `read` - Whether notification has been read
- `user_id` - Reference to users table
- `created_at` - Record creation timestamp

### 7. Email Records Table

```sql
CREATE TABLE email_records (
  id VARCHAR(36) PRIMARY KEY,
  lead_id VARCHAR(36) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  sent_date TIMESTAMP NOT NULL,
  status ENUM('sent', 'delivered', 'opened', 'clicked', 'bounced') DEFAULT 'sent',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE
);
```

**Fields:**
- `id` - Unique identifier (UUID)
- `lead_id` - Reference to leads table
- `subject` - Email subject
- `content` - Email content
- `sent_date` - When email was sent
- `status` - Email status (sent/delivered/opened/clicked/bounced)
- `created_at` - Record creation timestamp

## 🔧 Database Services

### DatabaseService

The main database service that handles all database operations:

```typescript
import { databaseService } from './services/database';

// Connect to database
await databaseService.connect();

// Create a new company
const company = await databaseService.createCompany({
  name: 'TechCorp Solutions',
  industry: 'Technology',
  size: 'large',
  // ... other fields
});

// Get all leads
const leads = await databaseService.getAllLeads();

// Update a lead
await databaseService.updateLead(leadId, {
  stage: 'qualified',
  priority: 'high'
});

// Disconnect from database
await databaseService.disconnect();
```

### DataService

A higher-level service that provides business logic and data aggregation:

```typescript
import { DataService } from './services/dataService';

// Get dashboard statistics
const stats = await DataService.getDashboardStats();

// Search across all entities
const results = await DataService.searchAll('techcorp');

// Get lead analytics
const analytics = await DataService.getLeadAnalytics();

// Export data to CSV
const csvData = await DataService.exportLeadsToCSV();
```

### SeedDataService

Service for populating the database with initial data:

```typescript
import { SeedDataService } from './services/seedData';

// Seed all data
await SeedDataService.seedAllData();

// Reset database (clear and reseed)
await SeedDataService.resetDatabase();

// Clear all data
await SeedDataService.clearAllData();
```

## 🚀 Usage Examples

### 1. Creating a New Lead

```typescript
import { DataService } from './services/dataService';

const newLead = await DataService.createLead({
  companyId: 'company-uuid',
  name: 'John Smith',
  designation: 'CTO',
  email: 'john.smith@company.com',
  phone: '+1-555-123-4567',
  stage: 'prospect',
  priority: 'medium',
  assignedTo: 'user-uuid',
  // ... other fields
});
```

### 2. Adding a Call Note

```typescript
import { DataService } from './services/dataService';

const callNote = await DataService.createCallNote({
  leadId: 'lead-uuid',
  callType: 'outbound',
  duration: 1200, // 20 minutes
  outcome: 'completed',
  transcript: 'Call transcript text...',
  notes: 'Productive call about enterprise solution'
});
```

### 3. Creating a Follow-up

```typescript
import { DataService } from './services/dataService';

const followUp = await DataService.createFollowUp({
  leadId: 'lead-uuid',
  companyId: 'company-uuid',
  type: 'demo',
  scheduledDate: new Date('2024-02-01T10:00:00'),
  priority: 'high',
  notes: 'Product demo for enterprise solution',
  createdBy: 'user-uuid'
});
```

### 4. Getting Dashboard Statistics

```typescript
import { DataService } from './services/dataService';

const stats = await DataService.getDashboardStats();
console.log(`Total Leads: ${stats.totalLeads}`);
console.log(`Conversion Rate: ${stats.conversionRate}%`);
console.log(`Today's Follow-ups: ${stats.todayFollowUps}`);
```

### 5. Searching and Filtering

```typescript
import { DataService } from './services/dataService';

// Search leads
const leads = await DataService.searchLeads('john smith');

// Get leads by company
const companyLeads = await DataService.getLeadsByCompany('company-uuid');

// Get leads by assignee
const assignedLeads = await DataService.getLeadsByAssignee('user-uuid');
```

## 📊 Data Relationships

### One-to-Many Relationships

- **Company → Leads**: One company can have multiple leads
- **User → Leads**: One user can be assigned multiple leads
- **Lead → Call Notes**: One lead can have multiple call notes
- **Lead → Follow-ups**: One lead can have multiple follow-ups
- **Lead → Email Records**: One lead can have multiple email records
- **User → Notifications**: One user can have multiple notifications

### Foreign Key Constraints

- `leads.company_id` → `companies.id` (CASCADE DELETE)
- `leads.assigned_to` → `users.id` (SET NULL ON DELETE)
- `follow_ups.lead_id` → `leads.id` (CASCADE DELETE)
- `follow_ups.company_id` → `companies.id` (CASCADE DELETE)
- `follow_ups.created_by` → `users.id` (CASCADE DELETE)
- `call_notes.lead_id` → `leads.id` (CASCADE DELETE)
- `notifications.user_id` → `users.id` (CASCADE DELETE)
- `email_records.lead_id` → `leads.id` (CASCADE DELETE)

## 🔄 Data Flow

1. **Initialization**: Database is created and seeded with sample data
2. **User Authentication**: Users are authenticated and their data is loaded
3. **Data Operations**: CRUD operations are performed through DataService
4. **Real-time Updates**: Changes are reflected immediately in the UI
5. **Data Export**: Data can be exported to CSV/Excel formats
6. **Analytics**: Reports and analytics are generated from the data

## 🛠️ Database Configuration

The database can be configured for different environments:

```typescript
// Development (SQLite)
const config = {
  type: 'sqlite',
  database: 'crm_database.db'
};

// Production (PostgreSQL)
const config = {
  type: 'postgresql',
  host: 'localhost',
  port: 5432,
  database: 'crm_production',
  username: 'crm_user',
  password: 'secure_password'
};

// Production (MySQL)
const config = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  database: 'crm_production',
  username: 'crm_user',
  password: 'secure_password'
};
```

## 📈 Performance Considerations

1. **Indexing**: Ensure proper indexes on frequently queried fields
2. **Pagination**: Use pagination for large datasets
3. **Caching**: Implement caching for frequently accessed data
4. **Connection Pooling**: Use connection pooling in production
5. **Query Optimization**: Optimize complex queries and joins

## 🔒 Security Considerations

1. **Input Validation**: Validate all user inputs
2. **SQL Injection**: Use parameterized queries
3. **Access Control**: Implement proper user permissions
4. **Data Encryption**: Encrypt sensitive data
5. **Audit Logging**: Log all database operations

## 🧪 Testing

The database services include comprehensive error handling and can be easily tested:

```typescript
// Test database connection
try {
  await databaseService.connect();
  console.log('Database connected successfully');
} catch (error) {
  console.error('Database connection failed:', error);
}

// Test data operations
try {
  const companies = await DataService.getAllCompanies();
  console.log(`Found ${companies.length} companies`);
} catch (error) {
  console.error('Data operation failed:', error);
}
```

This database structure provides a solid foundation for your CRM application with proper relationships, constraints, and scalability considerations. 