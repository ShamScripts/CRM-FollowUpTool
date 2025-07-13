# Database and Excel Sync Setup Guide

This guide will help you set up proper database connectivity and Excel sync functionality for your CRM tool.

## 🗄️ Database Setup

### Option 1: SQLite (Recommended for Development)

SQLite is perfect for development and small to medium applications. It requires no server setup.

#### Installation:
```bash
npm install better-sqlite3
npm install @types/better-sqlite3 --save-dev
```

#### Configuration:
Update `src/services/database.ts`:
```typescript
import Database from 'better-sqlite3';

// Update the initSQLite method:
private async initSQLite() {
  const db = new Database(this.config.database);
  return db;
}

// Update the executeQuery method:
async executeQuery(query: string, params: any[] = []): Promise<any> {
  if (!this.connection) {
    throw new Error('Database not connected');
  }
  
  const stmt = this.connection.prepare(query);
  const result = stmt.run(...params);
  return { rows: result, rowCount: result.changes };
}
```

### Option 2: PostgreSQL (Recommended for Production)

PostgreSQL is ideal for production environments with multiple users.

#### Installation:
```bash
npm install pg
npm install @types/pg --save-dev
```

#### Configuration:
```typescript
// Update the initPostgreSQL method:
private async initPostgreSQL() {
  const { Client } = require('pg');
  const client = new Client({
    host: this.config.host,
    port: this.config.port,
    database: this.config.database,
    user: this.config.username,
    password: this.config.password,
    ssl: this.config.ssl
  });
  await client.connect();
  return client;
}

// Update the executeQuery method:
async executeQuery(query: string, params: any[] = []): Promise<any> {
  if (!this.connection) {
    throw new Error('Database not connected');
  }
  
  const result = await this.connection.query(query, params);
  return result;
}
```

### Option 3: MySQL

#### Installation:
```bash
npm install mysql2
```

#### Configuration:
```typescript
// Update the initMySQL method:
private async initMySQL() {
  const mysql = require('mysql2/promise');
  const connection = await mysql.createConnection({
    host: this.config.host,
    port: this.config.port,
    database: this.config.database,
    user: this.config.username,
    password: this.config.password
  });
  return connection;
}
```

## 📊 Excel Sync Setup

### Installation:
```bash
npm install xlsx
npm install @types/xlsx --save-dev
```

### Update Excel Sync Service

Update `src/services/excelSync.ts` to use the xlsx library:

```typescript
import * as XLSX from 'xlsx';

// Update the parseExcelFile method:
private async parseExcelFile(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        // Skip header row and convert to objects
        const headers = jsonData[0] as string[];
        const rows = jsonData.slice(1) as any[][];
        
        const result = rows.map(row => {
          const obj: any = {};
          headers.forEach((header, index) => {
            obj[header] = row[index] || '';
          });
          return obj;
        });
        
        resolve(result);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
}

// Update the exportToExcel method:
async exportToExcel(dataType: 'leads' | 'companies'): Promise<Blob> {
  try {
    let data: any[] = [];
    
    if (dataType === 'leads') {
      data = await databaseService.getLeads();
    } else if (dataType === 'companies') {
      data = await databaseService.getCompanies();
    }

    const excelData = this.convertToExcelFormat(data, dataType);
    
    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, dataType);
    
    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    
    return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  } catch (error) {
    console.error('Export failed:', error);
    throw error;
  }
}
```

## 🔧 Environment Configuration

Create a `.env` file in your project root:

```env
# Database Configuration
DB_TYPE=sqlite
DB_HOST=localhost
DB_PORT=5432
DB_NAME=crm_db
DB_USER=your_username
DB_PASSWORD=your_password
DB_SSL=false

# For SQLite (use this for development)
DB_TYPE=sqlite
DB_NAME=crm.db
```

Update your database service initialization:

```typescript
// src/services/database.ts
export const databaseService = new DatabaseService({
  type: process.env.DB_TYPE as 'sqlite' | 'postgresql' | 'mysql' | 'mongodb',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'crm.db',
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: process.env.DB_SSL === 'true'
});
```

## 📋 Excel Template Setup

### Lead Import Template

Create a CSV/Excel file with these columns:
```csv
ID,Company ID,Name,Designation,Status,Email,Phone,Stage,Priority,Score,Assigned To,Notes
,1,John Smith,CTO,active,john@company.com,+1234567890,qualified,high,85,user1,Very interested
,2,Jane Doe,CEO,active,jane@company.com,+1234567891,proposal,medium,92,user2,Looking for solution
```

### Company Import Template

Create a CSV/Excel file with these columns:
```csv
ID,Name,Industry,Size,Company URL,LinkedIn URL,Address,Country,Phone,Email,Notes
,Acme Corp,Technology,large,https://acme.com,https://linkedin.com/company/acme,123 Main St,USA,+1234567890,contact@acme.com,Enterprise client
,TechStart,Fintech,small,https://techstart.com,https://linkedin.com/company/techstart,456 Oak Ave,USA,+1234567891,hello@techstart.com,Startup
```

## 🚀 Usage Instructions

### 1. Initialize Database

```typescript
// In your main App component or initialization
import { databaseService } from './services/database';

useEffect(() => {
  const initDB = async () => {
    try {
      await databaseService.connect();
      console.log('Database connected successfully');
    } catch (error) {
      console.error('Database connection failed:', error);
    }
  };
  
  initDB();
}, []);
```

### 2. Import Data from Excel

```typescript
// In your Excel Sync component
const handleImport = async (file: File) => {
  try {
    const result = await leadSyncService.importFromExcel(file, 'leads');
    console.log('Import result:', result);
  } catch (error) {
    console.error('Import failed:', error);
  }
};
```

### 3. Export Data to Excel

```typescript
// In your Excel Sync component
const handleExport = async () => {
  try {
    const blob = await leadSyncService.exportToExcel('leads');
    // Download the file
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'leads_export.xlsx';
    a.click();
  } catch (error) {
    console.error('Export failed:', error);
  }
};
```

## 🔄 Sync Configuration

### Conflict Resolution Options

1. **'crm'**: Always use CRM data when conflicts occur
2. **'excel'**: Always use Excel data when conflicts occur
3. **'newest'**: Use the most recently updated data
4. **'manual'**: Require manual resolution for each conflict

### Field Mappings

Customize field mappings for different Excel formats:

```typescript
const customFieldMappings = {
  id: 'Lead ID',
  name: 'Full Name',
  email: 'Email Address',
  phone: 'Phone Number',
  stage: 'Sales Stage',
  priority: 'Priority Level',
  score: 'Lead Score',
  notes: 'Comments'
};

const customSyncService = new ExcelSyncService({
  fieldMappings: customFieldMappings,
  conflictResolution: 'newest',
  createMissingRecords: true,
  updateExistingRecords: true
});
```

## 🛠️ Troubleshooting

### Common Issues:

1. **Database Connection Failed**
   - Check your database credentials
   - Ensure the database server is running
   - Verify network connectivity

2. **Excel Import Errors**
   - Check file format (CSV/XLSX)
   - Verify column headers match field mappings
   - Ensure data types are correct

3. **Sync Conflicts**
   - Review conflict resolution settings
   - Check data consistency between CRM and Excel
   - Use manual resolution for complex conflicts

### Debug Mode:

Enable debug logging:

```typescript
// Add to your database service
private debug = true;

async executeQuery(query: string, params: any[] = []): Promise<any> {
  if (this.debug) {
    console.log('Executing query:', query);
    console.log('Parameters:', params);
  }
  // ... rest of the method
}
```

## 📈 Performance Optimization

1. **Batch Processing**: Process records in batches for large imports
2. **Indexing**: Add database indexes for frequently queried fields
3. **Connection Pooling**: Use connection pools for production databases
4. **Caching**: Implement caching for frequently accessed data

## 🔒 Security Considerations

1. **Input Validation**: Validate all imported data
2. **SQL Injection**: Use parameterized queries (already implemented)
3. **File Upload Security**: Validate file types and sizes
4. **Access Control**: Implement proper user authentication and authorization

This setup provides a robust foundation for database connectivity and Excel sync functionality in your CRM tool. 