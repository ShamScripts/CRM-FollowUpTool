export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'employee';
  avatar?: string;
  lastLogin?: Date;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  size: 'small' | 'medium' | 'large';
  companyUrl?: string;
  linkedinUrl?: string;
  address?: string;
  country?: string;
  notes?: string;
  dateAdded: Date;
  phone?: string;
  email?: string;
  assignedEmployees: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Lead {
  id: string;
  companyId: string;
  name: string;
  designation: string;
  status: 'active' | 'inactive' | 'qualified' | 'disqualified';
  linkedinUrl?: string;
  email: string;
  phone?: string;
  additionalEmails?: string[];
  additionalPhones?: string[];
  shortNote?: string;
  stage: 'prospect' | 'qualified' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
  priority: 'low' | 'medium' | 'high';
  initialContactDate?: Date;
  followUpDates: Date[];
  remarks: string[];
  emailsSent: EmailRecord[];
  callNotes: CallNote[];
  score: number;
  assignedTo: string;
  createdAt: Date;
  updatedAt: Date;
  notes?: string;
}

export interface EmailRecord {
  id: string;
  subject: string;
  content: string;
  sentDate: Date;
  status: 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced';
}

export interface FollowUp {
  id: string;
  leadId: string;
  companyId: string;
  type: 'call' | 'email' | 'meeting' | 'demo';
  scheduledDate: Date;
  status: 'scheduled' | 'completed' | 'missed' | 'rescheduled';
  priority: 'low' | 'medium' | 'high';
  notes?: string;
  createdBy: string;
  completedAt?: Date;
}

export interface CallNote {
  id: string;
  leadId: string;
  audioUrl?: string;
  transcript?: string;
  callType: 'inbound' | 'outbound';
  duration: number;
  outcome: 'completed' | 'no-answer' | 'voicemail' | 'scheduled';
  createdAt: Date;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: Date;
  userId: string;
}

export interface DashboardStats {
  totalLeads: number;
  totalCompanies: number;
  todayFollowUps: number;
  overdueFollowUps: number;
  conversionRate: number;
  avgResponseTime: number;
}