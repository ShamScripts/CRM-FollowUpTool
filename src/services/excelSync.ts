import { Lead, Company } from '../types';
import { databaseService } from './database';

export interface ExcelSyncConfig {
  // Excel file configuration
  sheetName?: string;
  headerRow?: number;
  startRow?: number;
  
  // Field mappings
  fieldMappings: {
    [key: string]: string; // Excel column name -> Database field name
  };
  
  // Sync options
  conflictResolution: 'crm' | 'excel' | 'manual' | 'newest';
  createMissingRecords: boolean;
  updateExistingRecords: boolean;
}

export interface SyncResult {
  success: boolean;
  recordsProcessed: number;
  recordsCreated: number;
  recordsUpdated: number;
  recordsSkipped: number;
  conflicts: ConflictItem[];
  errors: string[];
}

export interface ConflictItem {
  id: string;
  field: string;
  crmValue: string;
  excelValue: string;
  recordName: string;
  resolved: boolean;
  resolution?: 'crm' | 'excel' | 'manual';
}

export class ExcelSyncService {
  private config: ExcelSyncConfig;

  constructor(config: ExcelSyncConfig) {
    this.config = {
      sheetName: 'Sheet1',
      headerRow: 1,
      startRow: 2,
      conflictResolution: 'newest',
      createMissingRecords: true,
      updateExistingRecords: true,
      ...config
    };
  }

  // Export data from database to Excel
  async exportToExcel(dataType: 'leads' | 'companies'): Promise<Blob> {
    try {
      let data: any[] = [];
      
      if (dataType === 'leads') {
        data = await databaseService.getLeads();
      } else if (dataType === 'companies') {
        data = await databaseService.getCompanies();
      }

      // Convert data to Excel format
      const excelData = this.convertToExcelFormat(data, dataType);
      
      // In a real implementation, you would use a library like 'xlsx' or 'exceljs'
      // For now, we'll create a CSV format that Excel can open
      const csvContent = this.convertToCSV(excelData);
      
      return new Blob([csvContent], { type: 'text/csv' });
    } catch (error) {
      console.error('Export failed:', error);
      throw error;
    }
  }

  // Import data from Excel to database
  async importFromExcel(file: File, dataType: 'leads' | 'companies'): Promise<SyncResult> {
    try {
      const excelData = await this.parseExcelFile(file);
      const result: SyncResult = {
        success: true,
        recordsProcessed: 0,
        recordsCreated: 0,
        recordsUpdated: 0,
        recordsSkipped: 0,
        conflicts: [],
        errors: []
      };

      for (const row of excelData) {
        try {
          result.recordsProcessed++;
          
          if (dataType === 'leads') {
            await this.processLeadRow(row, result);
          } else if (dataType === 'companies') {
            await this.processCompanyRow(row, result);
          }
        } catch (error) {
          result.errors.push(`Row ${result.recordsProcessed}: ${error}`);
        }
      }

      return result;
    } catch (error) {
      console.error('Import failed:', error);
      throw error;
    }
  }

  // Parse Excel file
  private async parseExcelFile(file: File): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const lines = text.split('\n');
          const headers = lines[this.config.headerRow! - 1].split(',').map(h => h.trim());
          const data: any[] = [];

          for (let i = this.config.startRow! - 1; i < lines.length; i++) {
            if (lines[i].trim()) {
              const values = lines[i].split(',').map(v => v.trim());
              const row: any = {};
              
              headers.forEach((header, index) => {
                row[header] = values[index] || '';
              });
              
              data.push(row);
            }
          }

          resolve(data);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }

  // Process a lead row from Excel
  private async processLeadRow(row: any, result: SyncResult): Promise<void> {
    const leadData = this.mapExcelRowToLead(row);
    
    // Check if lead exists (by email or ID)
    const existingLeads = await databaseService.getLeads();
    const existingLead = existingLeads.find(l => 
      l.email === leadData.email || l.id === leadData.id
    );

    if (existingLead) {
      if (this.config.updateExistingRecords) {
        // Check for conflicts
        const conflicts = this.detectConflicts(existingLead, leadData);
        
        if (conflicts.length > 0) {
          if (this.config.conflictResolution === 'manual') {
            result.conflicts.push(...conflicts);
            result.recordsSkipped++;
            return;
          } else if (this.config.conflictResolution === 'newest') {
            // Use the most recent data
            const mergedLead = this.mergeLeadData(existingLead, leadData, conflicts);
            await databaseService.updateLead(mergedLead);
          } else {
            // Use CRM or Excel data based on conflict resolution setting
            const mergedLead = this.resolveConflicts(existingLead, leadData, conflicts);
            await databaseService.updateLead(mergedLead);
          }
        } else {
          await databaseService.updateLead(leadData);
        }
        result.recordsUpdated++;
      } else {
        result.recordsSkipped++;
      }
    } else {
      if (this.config.createMissingRecords) {
        await databaseService.createLead(leadData);
        result.recordsCreated++;
      } else {
        result.recordsSkipped++;
      }
    }
  }

  // Process a company row from Excel
  private async processCompanyRow(row: any, result: SyncResult): Promise<void> {
    const companyData = this.mapExcelRowToCompany(row);
    
    // Check if company exists (by name or ID)
    const existingCompanies = await databaseService.getCompanies();
    const existingCompany = existingCompanies.find(c => 
      c.name === companyData.name || c.id === companyData.id
    );

    if (existingCompany) {
      if (this.config.updateExistingRecords) {
        // Check for conflicts
        const conflicts = this.detectCompanyConflicts(existingCompany, companyData);
        
        if (conflicts.length > 0) {
          if (this.config.conflictResolution === 'manual') {
            result.conflicts.push(...conflicts);
            result.recordsSkipped++;
            return;
          } else if (this.config.conflictResolution === 'newest') {
            // Use the most recent data
            const mergedCompany = this.mergeCompanyData(existingCompany, companyData, conflicts);
            await databaseService.updateCompany(mergedCompany);
          } else {
            // Use CRM or Excel data based on conflict resolution setting
            const mergedCompany = this.resolveCompanyConflicts(existingCompany, companyData, conflicts);
            await databaseService.updateCompany(mergedCompany);
          }
        } else {
          await databaseService.updateCompany(companyData);
        }
        result.recordsUpdated++;
      } else {
        result.recordsSkipped++;
      }
    } else {
      if (this.config.createMissingRecords) {
        await databaseService.createCompany(companyData);
        result.recordsCreated++;
      } else {
        result.recordsSkipped++;
      }
    }
  }

  // Map Excel row to Lead object
  private mapExcelRowToLead(row: any): Lead {
    return {
      id: row[this.config.fieldMappings.id] || this.generateId(),
      companyId: row[this.config.fieldMappings.companyId] || '',
      name: row[this.config.fieldMappings.name] || '',
      designation: row[this.config.fieldMappings.designation] || '',
      status: (row[this.config.fieldMappings.status] as any) || 'active',
      linkedinUrl: row[this.config.fieldMappings.linkedinUrl] || '',
      email: row[this.config.fieldMappings.email] || '',
      phone: row[this.config.fieldMappings.phone] || '',
      additionalEmails: row[this.config.fieldMappings.additionalEmails] ? 
        row[this.config.fieldMappings.additionalEmails].split(';') : [],
      additionalPhones: row[this.config.fieldMappings.additionalPhones] ? 
        row[this.config.fieldMappings.additionalPhones].split(';') : [],
      shortNote: row[this.config.fieldMappings.shortNote] || '',
      stage: (row[this.config.fieldMappings.stage] as any) || 'prospect',
      priority: (row[this.config.fieldMappings.priority] as any) || 'medium',
      initialContactDate: row[this.config.fieldMappings.initialContactDate] ? 
        new Date(row[this.config.fieldMappings.initialContactDate]) : undefined,
      followUpDates: row[this.config.fieldMappings.followUpDates] ? 
        row[this.config.fieldMappings.followUpDates].split(';').map((d: string) => new Date(d)) : [],
      remarks: row[this.config.fieldMappings.remarks] ? 
        row[this.config.fieldMappings.remarks].split(';') : [],
      emailsSent: [],
      score: parseInt(row[this.config.fieldMappings.score]) || 0,
      assignedTo: row[this.config.fieldMappings.assignedTo] || '',
      createdAt: new Date(),
      updatedAt: new Date(),
      notes: row[this.config.fieldMappings.notes] || ''
    };
  }

  // Map Excel row to Company object
  private mapExcelRowToCompany(row: any): Company {
    return {
      id: row[this.config.fieldMappings.id] || this.generateId(),
      name: row[this.config.fieldMappings.name] || '',
      industry: row[this.config.fieldMappings.industry] || '',
      size: (row[this.config.fieldMappings.size] as any) || 'medium',
      companyUrl: row[this.config.fieldMappings.companyUrl] || '',
      linkedinUrl: row[this.config.fieldMappings.linkedinUrl] || '',
      address: row[this.config.fieldMappings.address] || '',
      country: row[this.config.fieldMappings.country] || '',
      notes: row[this.config.fieldMappings.notes] || '',
      dateAdded: new Date(),
      phone: row[this.config.fieldMappings.phone] || '',
      email: row[this.config.fieldMappings.email] || '',
      assignedEmployees: row[this.config.fieldMappings.assignedEmployees] ? 
        row[this.config.fieldMappings.assignedEmployees].split(';') : [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  // Convert data to Excel format
  private convertToExcelFormat(data: any[], dataType: 'leads' | 'companies'): any[] {
    return data.map(item => {
      if (dataType === 'leads') {
        return {
          'ID': item.id,
          'Company ID': item.companyId,
          'Name': item.name,
          'Designation': item.designation,
          'Status': item.status,
          'Email': item.email,
          'Phone': item.phone,
          'Stage': item.stage,
          'Priority': item.priority,
          'Score': item.score,
          'Assigned To': item.assignedTo,
          'Notes': item.notes,
          'Created At': item.createdAt.toISOString(),
          'Updated At': item.updatedAt.toISOString()
        };
      } else {
        return {
          'ID': item.id,
          'Name': item.name,
          'Industry': item.industry,
          'Size': item.size,
          'Company URL': item.companyUrl,
          'LinkedIn URL': item.linkedinUrl,
          'Address': item.address,
          'Country': item.country,
          'Phone': item.phone,
          'Email': item.email,
          'Notes': item.notes,
          'Date Added': item.dateAdded.toISOString(),
          'Created At': item.createdAt.toISOString(),
          'Updated At': item.updatedAt.toISOString()
        };
      }
    });
  }

  // Convert data to CSV format
  private convertToCSV(data: any[]): string {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(',')];
    
    for (const row of data) {
      const values = headers.map(header => {
        const value = row[header];
        // Escape commas and quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      });
      csvRows.push(values.join(','));
    }
    
    return csvRows.join('\n');
  }

  // Detect conflicts between existing and new data
  private detectConflicts(existing: Lead, newData: Lead): ConflictItem[] {
    const conflicts: ConflictItem[] = [];
    const fieldsToCheck = ['name', 'email', 'phone', 'stage', 'priority', 'score', 'notes'];

    for (const field of fieldsToCheck) {
      const existingValue = String(existing[field as keyof Lead] || '');
      const newValue = String(newData[field as keyof Lead] || '');
      
      if (existingValue && newValue && existingValue !== newValue) {
        conflicts.push({
          id: existing.id,
          field,
          crmValue: existingValue,
          excelValue: newValue,
          recordName: existing.name,
          resolved: false
        });
      }
    }

    return conflicts;
  }

  // Detect conflicts for companies
  private detectCompanyConflicts(existing: Company, newData: Company): ConflictItem[] {
    const conflicts: ConflictItem[] = [];
    const fieldsToCheck = ['name', 'industry', 'size', 'phone', 'email', 'notes'];

    for (const field of fieldsToCheck) {
      const existingValue = String(existing[field as keyof Company] || '');
      const newValue = String(newData[field as keyof Company] || '');
      
      if (existingValue && newValue && existingValue !== newValue) {
        conflicts.push({
          id: existing.id,
          field,
          crmValue: existingValue,
          excelValue: newValue,
          recordName: existing.name,
          resolved: false
        });
      }
    }

    return conflicts;
  }

  // Merge lead data
  private mergeLeadData(existing: Lead, newData: Lead, conflicts: ConflictItem[]): Lead {
    const merged = { ...existing };
    
    for (const conflict of conflicts) {
      if (this.config.conflictResolution === 'newest') {
        // Use the most recent data based on updatedAt
        if (newData.updatedAt > existing.updatedAt) {
          (merged as any)[conflict.field] = conflict.excelValue;
        }
      }
    }
    
    merged.updatedAt = new Date();
    return merged;
  }

  // Merge company data
  private mergeCompanyData(existing: Company, newData: Company, conflicts: ConflictItem[]): Company {
    const merged = { ...existing };
    
    for (const conflict of conflicts) {
      if (this.config.conflictResolution === 'newest') {
        // Use the most recent data based on updatedAt
        if (newData.updatedAt > existing.updatedAt) {
          (merged as any)[conflict.field] = conflict.excelValue;
        }
      }
    }
    
    merged.updatedAt = new Date();
    return merged;
  }

  // Resolve conflicts based on configuration
  private resolveConflicts(existing: Lead, newData: Lead, conflicts: ConflictItem[]): Lead {
    const resolved = { ...existing };
    
    for (const conflict of conflicts) {
      if (this.config.conflictResolution === 'excel') {
        (resolved as any)[conflict.field] = conflict.excelValue;
      }
      // If conflictResolution is 'crm', keep existing value (no change needed)
    }
    
    resolved.updatedAt = new Date();
    return resolved;
  }

  // Resolve company conflicts
  private resolveCompanyConflicts(existing: Company, newData: Company, conflicts: ConflictItem[]): Company {
    const resolved = { ...existing };
    
    for (const conflict of conflicts) {
      if (this.config.conflictResolution === 'excel') {
        (resolved as any)[conflict.field] = conflict.excelValue;
      }
      // If conflictResolution is 'crm', keep existing value (no change needed)
    }
    
    resolved.updatedAt = new Date();
    return resolved;
  }

  // Generate a unique ID
  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  // Resolve a specific conflict
  async resolveConflict(conflictId: string, resolution: 'crm' | 'excel'): Promise<void> {
    // In a real implementation, you would update the conflict resolution
    // and then re-process the affected record
    console.log(`Resolving conflict ${conflictId} with resolution: ${resolution}`);
  }
}

// Default field mappings for leads
export const defaultLeadFieldMappings = {
  id: 'ID',
  companyId: 'Company ID',
  name: 'Name',
  designation: 'Designation',
  status: 'Status',
  email: 'Email',
  phone: 'Phone',
  stage: 'Stage',
  priority: 'Priority',
  score: 'Score',
  assignedTo: 'Assigned To',
  notes: 'Notes'
};

// Default field mappings for companies
export const defaultCompanyFieldMappings = {
  id: 'ID',
  name: 'Name',
  industry: 'Industry',
  size: 'Size',
  companyUrl: 'Company URL',
  linkedinUrl: 'LinkedIn URL',
  address: 'Address',
  country: 'Country',
  phone: 'Phone',
  email: 'Email',
  notes: 'Notes'
};

// Export default sync service instances
export const leadSyncService = new ExcelSyncService({
  fieldMappings: defaultLeadFieldMappings,
  conflictResolution: 'newest',
  createMissingRecords: true,
  updateExistingRecords: true
});

export const companySyncService = new ExcelSyncService({
  fieldMappings: defaultCompanyFieldMappings,
  conflictResolution: 'newest',
  createMissingRecords: true,
  updateExistingRecords: true
}); 