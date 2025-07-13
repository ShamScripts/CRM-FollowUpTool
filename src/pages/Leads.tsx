import { useState, useMemo } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '../components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../components/ui/select';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal, 
  Building2, 
  Mail, 
  Phone, 
  Clock, 
  Star, 
  Calendar, 
  TrendingUp,
  Linkedin,
  ExternalLink,
  MessageSquare,
  FileText,
  CalendarDays,
  User,
  Briefcase,
  Target,
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye,
  MousePointer,
  Play
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Lead, EmailRecord, Company, CallNote } from '../types';

import toast from 'react-hot-toast';

// Mock companies data
const mockCompanies: Company[] = [
  {
    id: '1',
    name: 'TechCorp Solutions',
    industry: 'Technology',
    size: 'large',
    companyUrl: 'https://techcorp.com',
    linkedinUrl: 'https://linkedin.com/company/techcorp',
    phone: '+1 (555) 123-4567',
    email: 'contact@techcorp.com',
    address: '123 Tech Street, San Francisco, CA',
    country: 'United States',
    notes: 'Enterprise client with high potential for long-term partnership.',
    dateAdded: new Date('2024-01-15'),
    assignedEmployees: ['emp1', 'emp2'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: '2',
    name: 'StartupXYZ',
    industry: 'Fintech',
    size: 'small',
    companyUrl: 'https://startupxyz.com',
    linkedinUrl: 'https://linkedin.com/company/startupxyz',
    phone: '+1 (555) 987-6543',
    email: 'hello@startupxyz.com',
    address: '456 Innovation Ave, Austin, TX',
    country: 'United States',
    notes: 'Fast-growing startup with innovative approach.',
    dateAdded: new Date('2024-01-10'),
    assignedEmployees: ['emp3'],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-18'),
  },
  {
    id: '3',
    name: 'Enterprise Ltd',
    industry: 'Manufacturing',
    size: 'large',
    companyUrl: 'https://enterprise.com',
    linkedinUrl: 'https://linkedin.com/company/enterprise',
    phone: '+1 (555) 456-7890',
    email: 'info@enterprise.com',
    address: '789 Business Blvd, Chicago, IL',
    country: 'United States',
    notes: 'Established manufacturing company with global presence.',
    dateAdded: new Date('2024-01-05'),
    assignedEmployees: ['emp1', 'emp3'],
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-22'),
  }
];

const mockLeads: Lead[] = [
  {
    id: '1',
    companyId: '1',
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
    emailsSent: [
      {
        id: '1',
        subject: 'Introduction and Product Overview',
        content: 'Hi John, thanks for connecting...',
        sentDate: new Date('2024-01-15'),
        status: 'opened'
      },
      {
        id: '2',
        subject: 'Enterprise Solution Demo',
        content: 'Hi John, as discussed...',
        sentDate: new Date('2024-01-20'),
        status: 'clicked'
      }
    ],
    callNotes: [
      {
        id: '1',
        leadId: '1',
        audioUrl: 'https://example.com/audio1.mp3',
        transcript: 'Thank you for taking the time to speak with me today. I wanted to discuss our enterprise solution and how it can help streamline your operations. We\'ve been working with companies similar to yours and have seen significant improvements in efficiency.',
        callType: 'outbound',
        duration: 1245,
        outcome: 'completed',
        createdAt: new Date('2024-01-25T10:30:00')
      }
    ],
    score: 85,
    assignedTo: 'emp1',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    notes: 'Very interested in our enterprise solution'
  },
  {
    id: '2',
    companyId: '2',
    name: 'Sarah Johnson',
    designation: 'CEO',
    status: 'active',
    linkedinUrl: 'https://linkedin.com/in/sarahjohnson',
    email: 'sarah.johnson@startupxyz.com',
    phone: '+1 (555) 987-6543',
    additionalEmails: ['sarah@startupxyz.com'],
    additionalPhones: [],
    shortNote: 'Looking for cost-effective solution for startup growth.',
    stage: 'proposal',
    priority: 'high',
    initialContactDate: new Date('2024-01-10'),
    followUpDates: [
      new Date('2024-01-18'),
      new Date('2024-01-25')
    ],
    remarks: [
      'Met at startup conference',
      'Interested in pricing for small teams',
      'Needs budget approval'
    ],
    emailsSent: [
      {
        id: '3',
        subject: 'Startup Package Proposal',
        content: 'Hi Sarah, based on our discussion...',
        sentDate: new Date('2024-01-18'),
        status: 'delivered'
      }
    ],
    callNotes: [
      {
        id: '2',
        leadId: '2',
        audioUrl: 'https://example.com/audio2.mp3',
        transcript: 'I appreciate the call, but I\'m not sure if this is the right fit for our current needs. We\'re a small startup and the pricing seems quite high for our budget.',
        callType: 'outbound',
        duration: 892,
        outcome: 'completed',
        createdAt: new Date('2024-01-24T14:15:00')
      }
    ],
    score: 92,
    assignedTo: 'emp2',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-18'),
    notes: 'Looking for cost-effective solution'
  },
  {
    id: '3',
    companyId: '3',
    name: 'Mike Davis',
    designation: 'VP of Operations',
    status: 'active',
    linkedinUrl: 'https://linkedin.com/in/mikedavis',
    email: 'mike.davis@enterprise.com',
    phone: '+1 (555) 456-7890',
    additionalEmails: ['mike.davis@enterprise.com', 'mdavis@enterprise.com'],
    additionalPhones: ['+1 (555) 777-6666'],
    shortNote: 'Needs approval from board. Large enterprise deal potential.',
    stage: 'negotiation',
    priority: 'medium',
    initialContactDate: new Date('2024-01-05'),
    followUpDates: [
      new Date('2024-01-22'),
      new Date('2024-02-05')
    ],
    remarks: [
      'Cold outreach via email',
      'Scheduled initial call',
      'Presented to leadership team',
      'Negotiating contract terms'
    ],
    emailsSent: [
      {
        id: '4',
        subject: 'Enterprise Solution Overview',
        content: 'Hi Mike, I hope this email finds you well...',
        sentDate: new Date('2024-01-05'),
        status: 'opened'
      },
      {
        id: '5',
        subject: 'Contract Proposal',
        content: 'Hi Mike, attached is our proposal...',
        sentDate: new Date('2024-01-22'),
        status: 'sent'
      }
    ],
    callNotes: [
      {
        id: '3',
        leadId: '3',
        audioUrl: 'https://example.com/audio3.mp3',
        transcript: 'This looks exactly like what we need. Our current solution is outdated and causing major bottlenecks. When can we get started?',
        callType: 'outbound',
        duration: 1567,
        outcome: 'completed',
        createdAt: new Date('2024-01-23T16:45:00')
      }
    ],
    score: 78,
    assignedTo: 'emp1',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-22'),
    notes: 'Needs approval from board'
  },
  {
    id: '4',
    companyId: '1',
    name: 'Lisa Chen',
    designation: 'Head of IT',
    status: 'active',
    linkedinUrl: 'https://linkedin.com/in/lisachen',
    email: 'lisa.chen@techcorp.com',
    phone: '+1 (555) 234-5678',
    additionalEmails: [],
    additionalPhones: [],
    shortNote: 'Technical decision maker. Interested in integration capabilities.',
    stage: 'prospect',
    priority: 'medium',
    initialContactDate: new Date('2024-01-12'),
    followUpDates: [
      new Date('2024-01-19')
    ],
    remarks: [
      'Referred by John Smith',
      'Initial technical discussion',
      'Scheduled technical demo'
    ],
    emailsSent: [
      {
        id: '6',
        subject: 'Technical Integration Overview',
        content: 'Hi Lisa, as discussed with John...',
        sentDate: new Date('2024-01-12'),
        status: 'opened'
      }
    ],
    callNotes: [],
    score: 65,
    assignedTo: 'emp3',
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-19'),
    notes: 'Initial contact made'
  }
];

const companyNames = {
  '1': 'TechCorp Solutions',
  '2': 'StartupXYZ',
  '3': 'Enterprise Ltd'
};

export const Leads: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [companies, setCompanies] = useState<Company[]>(mockCompanies);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStage, setSelectedStage] = useState('all');
  const [selectedScore, setSelectedScore] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isUpdateStageModalOpen, setIsUpdateStageModalOpen] = useState(false);
  const [isScheduleMeetingModalOpen, setIsScheduleMeetingModalOpen] = useState(false);
  const [isSendEmailModalOpen, setIsSendEmailModalOpen] = useState(false);
  const [newLead, setNewLead] = useState({
    name: '',
    designation: '',
    status: 'active' as const,
    linkedinUrl: '',
    email: '',
    phone: '',
    additionalEmails: '',
    additionalPhones: '',
    shortNote: '',
    companyId: '',
    stage: 'prospect' as const,
    priority: 'medium' as const,
    score: 50,
    notes: ''
  });

  const [newCompany, setNewCompany] = useState({
    name: '',
    industry: '',
    size: 'medium' as 'small' | 'medium' | 'large',
    companyUrl: '',
    linkedinUrl: '',
    phone: '',
    email: '',
    address: '',
    country: '',
    notes: ''
  });

  // New state for action modals
  const [updateStageData, setUpdateStageData] = useState({
    stage: 'prospect' as Lead['stage'],
    notes: ''
  });

  const [meetingData, setMeetingData] = useState({
    title: '',
    date: new Date().toISOString().slice(0, 16),
    duration: '30',
    type: 'meeting' as const,
    notes: ''
  });

  const [emailData, setEmailData] = useState({
    subject: '',
    content: '',
    template: 'custom'
  });

  // Call notes state
  const [isCallNotesModalOpen, setIsCallNotesModalOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [newCallNote, setNewCallNote] = useState({
    notes: '',
    callType: 'inbound' as 'inbound' | 'outbound',
    duration: 0,
    outcome: 'completed' as 'completed' | 'no-answer' | 'voicemail' | 'scheduled'
  });

  const emailTemplates = {
    introduction: {
      subject: 'Introduction and Product Overview',
      content: `Hi ${selectedLead?.name || '[Name]'},

Thank you for your interest in our solutions. I'd like to introduce you to our comprehensive product suite that can help [Company Name] achieve your business goals.

Our platform offers:
• Advanced analytics and reporting
• Seamless integration capabilities
• 24/7 customer support
• Scalable solutions for growth

Would you be interested in a brief 15-minute call to discuss how we can help your organization?

Best regards,
[Your Name]
[Your Company]`
    },
    proposal: {
      subject: 'Custom Proposal for [Company Name]',
      content: `Dear ${selectedLead?.name || '[Name]'},

Thank you for taking the time to discuss your requirements. I'm pleased to present our customized proposal for [Company Name].

Based on our discussion, here's what we recommend:
• [Specific Solution 1]
• [Specific Solution 2]
• [Implementation Timeline]
• [Investment Details]

I've attached the detailed proposal for your review. Please let me know if you have any questions or would like to schedule a follow-up meeting.

Looking forward to your feedback.

Best regards,
[Your Name]
[Your Company]`
    },
    followup: {
      subject: 'Following up on our discussion',
      content: `Hi ${selectedLead?.name || '[Name]'},

I hope this email finds you well. I wanted to follow up on our recent discussion about [specific topic].

I wanted to check if you had any questions about our proposal or if there's anything additional information you need to move forward.

I'm available for a quick call this week if you'd like to discuss further.

Best regards,
[Your Name]
[Your Company]`
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.designation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = selectedStage === 'all' || lead.stage === selectedStage;
    const matchesScore = selectedScore === 'all' || 
                        (selectedScore === 'high' && lead.score >= 80) ||
                        (selectedScore === 'medium' && lead.score >= 60 && lead.score < 80) ||
                        (selectedScore === 'low' && lead.score < 60);
    
    return matchesSearch && matchesStage && matchesScore;
  });

  const getStageLabel = (stage: string) => {
    const labels = {
      prospect: 'Prospect',
      qualified: 'Qualified',
      proposal: 'Proposal',
      negotiation: 'Negotiation',
      'closed-won': 'Closed Won',
      'closed-lost': 'Closed Lost'
    };
    return labels[stage as keyof typeof labels] || stage;
  };

  const getStageColor = (stage: string) => {
    const colors = {
      prospect: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
      qualified: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      proposal: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      negotiation: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
      'closed-won': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      'closed-lost': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
    };
    return colors[stage as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
      medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      high: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleAddLead = () => {
    if (!newLead.name || !newLead.email || !newLead.companyId) {
      toast.error('Please fill in required fields');
      return;
    }

    const lead: Lead = {
      id: Date.now().toString(),
      companyId: newLead.companyId,
      name: newLead.name,
      designation: newLead.designation,
      status: newLead.status,
      linkedinUrl: newLead.linkedinUrl || undefined,
      email: newLead.email,
      phone: newLead.phone || undefined,
      additionalEmails: newLead.additionalEmails ? newLead.additionalEmails.split(',').map(e => e.trim()) : undefined,
      additionalPhones: newLead.additionalPhones ? newLead.additionalPhones.split(',').map(p => p.trim()) : undefined,
      shortNote: newLead.shortNote || undefined,
      stage: newLead.stage,
      priority: newLead.priority,
      initialContactDate: new Date(),
      followUpDates: [],
      remarks: [],
      emailsSent: [],
      callNotes: [],
      score: newLead.score,
      assignedTo: 'Current User',
      createdAt: new Date(),
      updatedAt: new Date(),
      notes: newLead.notes || undefined
    };

    setLeads([...leads, lead]);
    setNewLead({
      name: '',
      designation: '',
      status: 'active',
      linkedinUrl: '',
      email: '',
      phone: '',
      additionalEmails: '',
      additionalPhones: '',
      shortNote: '',
      companyId: '',
      stage: 'prospect',
      priority: 'medium',
      score: 50,
      notes: ''
    });
    setIsAddModalOpen(false);
    toast.success('Lead added successfully!');
  };

  const handleAddCompany = () => {
    if (!newCompany.name || !newCompany.industry) {
      toast.error('Please fill in required fields');
      return;
    }

    const company: Company = {
      id: Date.now().toString(),
      name: newCompany.name,
      industry: newCompany.industry,
      size: newCompany.size,
      companyUrl: newCompany.companyUrl || undefined,
      linkedinUrl: newCompany.linkedinUrl || undefined,
      phone: newCompany.phone || undefined,
      email: newCompany.email || undefined,
      address: newCompany.address || undefined,
      country: newCompany.country || undefined,
      notes: newCompany.notes || undefined,
      dateAdded: new Date(),
      assignedEmployees: ['Current User'],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setCompanies([...companies, company]);
    // Automatically select the newly registered company
    setNewLead({...newLead, companyId: company.id});
    setNewCompany({
      name: '',
      industry: '',
      size: 'medium',
      companyUrl: '',
      linkedinUrl: '',
      phone: '',
      email: '',
      address: '',
      country: '',
      notes: ''
    });
    setIsCompanyModalOpen(false);
    toast.success('Company registered successfully!');
  };

  const handleCompanySelect = (value: string) => {
    if (value === 'new') {
      setIsCompanyModalOpen(true);
    } else {
      setNewLead({...newLead, companyId: value});
    }
  };

  const handleLeadClick = (lead: Lead) => {
    setSelectedLead(lead);
    setIsDetailModalOpen(true);
  };

  const handleUpdateStage = () => {
    if (!selectedLead) return;

    const updatedLead = {
      ...selectedLead,
      stage: updateStageData.stage,
      updatedAt: new Date(),
      remarks: [...selectedLead.remarks, `Stage updated to ${updateStageData.stage}${updateStageData.notes ? `: ${updateStageData.notes}` : ''}`]
    };

    setLeads(leads.map(lead => lead.id === selectedLead.id ? updatedLead : lead));
    setSelectedLead(updatedLead);
    setUpdateStageData({ stage: 'prospect', notes: '' });
    setIsUpdateStageModalOpen(false);
    toast.success('Lead stage updated successfully!');
  };

  const handleScheduleMeeting = () => {
    if (!selectedLead || !meetingData.title) {
      toast.error('Please fill in required fields');
      return;
    }

    const newFollowUp = {
      id: Date.now().toString(),
      leadId: selectedLead.id,
      companyId: selectedLead.companyId,
      type: meetingData.type,
      scheduledDate: new Date(meetingData.date),
      status: 'scheduled',
      priority: selectedLead.priority,
      notes: meetingData.notes,
      createdBy: 'Current User'
    };

    // Add to follow-ups (you would typically save this to your database)
    // For now, we'll just show a success message
    toast.success('Meeting scheduled successfully!');
    
    // Update lead with new remark
    const updatedLead = {
      ...selectedLead,
      updatedAt: new Date(),
      remarks: [...selectedLead.remarks, `Meeting scheduled: ${meetingData.title} on ${new Date(meetingData.date).toLocaleDateString()}`]
    };

    setLeads(leads.map(lead => lead.id === selectedLead.id ? updatedLead : lead));
    setSelectedLead(updatedLead);
    setMeetingData({
      title: '',
      date: new Date().toISOString().slice(0, 16),
      duration: '30',
      type: 'meeting',
      notes: ''
    });
    setIsScheduleMeetingModalOpen(false);
  };

  const handleSendEmail = () => {
    if (!selectedLead || !emailData.subject || !emailData.content) {
      toast.error('Please fill in required fields');
      return;
    }

    const newEmail: EmailRecord = {
      id: Date.now().toString(),
      subject: emailData.subject,
      content: emailData.content,
      sentDate: new Date(),
      status: 'sent' as const
    };

    // Update lead with new email
    const updatedLead = {
      ...selectedLead,
      updatedAt: new Date(),
      emailsSent: [...selectedLead.emailsSent, newEmail],
      remarks: [...selectedLead.remarks, `Email sent: ${emailData.subject}`]
    };

    setLeads(leads.map(lead => lead.id === selectedLead.id ? updatedLead : lead));
    setSelectedLead(updatedLead);
    setEmailData({ subject: '', content: '', template: 'custom' });
    setIsSendEmailModalOpen(false);
    toast.success('Email sent successfully!');
  };

  // Call notes handlers
  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    // In a real app, this would start actual audio recording
    toast.success('Recording started');
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setNewCallNote(prev => ({ ...prev, duration: recordingTime }));
    toast.success('Recording stopped');
  };

  const handleAddCallNote = () => {
    if (!newCallNote.notes) {
      toast.error('Please add notes for the call');
      return;
    }

    if (!selectedLead) return;

    const callNote: CallNote = {
      id: Date.now().toString(),
      leadId: selectedLead.id,
      audioUrl: isRecording ? `https://example.com/audio/${Date.now()}.mp3` : undefined,
      transcript: newCallNote.notes,
      callType: newCallNote.callType,
      duration: newCallNote.duration,
      outcome: newCallNote.outcome,
      createdAt: new Date()
    };

    const updatedLeads = leads.map(lead => {
      if (lead.id === selectedLead.id) {
        return {
          ...lead,
          callNotes: [...lead.callNotes, callNote]
        };
      }
      return lead;
    });

    setLeads(updatedLeads);
    setSelectedLead({
      ...selectedLead,
      callNotes: [...selectedLead.callNotes, callNote]
    });

    setNewCallNote({
      notes: '',
      callType: 'inbound',
      duration: 0,
      outcome: 'completed'
    });
    setRecordingTime(0);
    setIsCallNotesModalOpen(false);
    toast.success('Call note added successfully!');
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTemplateChange = (template: string) => {
    if (template === 'custom') {
      setEmailData({ subject: '', content: '', template: 'custom' });
    } else {
      const selectedTemplate = emailTemplates[template as keyof typeof emailTemplates];
      setEmailData({
        subject: selectedTemplate.subject,
        content: selectedTemplate.content,
        template
      });
    }
  };

  const getEmailStatusIcon = (status: string) => {
    switch (status) {
      case 'sent': return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case 'delivered': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'opened': return <Eye className="h-4 w-4 text-yellow-500" />;
      case 'clicked': return <MousePointer className="h-4 w-4 text-purple-500" />;
      case 'bounced': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <MessageSquare className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground dark:text-white">Leads</h1>
          <p className="text-muted-foreground mt-1">
            Manage your leads and track their progress through the sales pipeline
          </p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="shadow-sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Lead
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">Add New Lead</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Full Name *</label>
                <Input
                  placeholder="Enter full name"
                  value={newLead.name}
                  onChange={(e) => setNewLead({...newLead, name: e.target.value})}
                  className="border-border"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Designation</label>
                <Input
                  placeholder="e.g., Senior Manager, CTO"
                  value={newLead.designation}
                  onChange={(e) => setNewLead({...newLead, designation: e.target.value})}
                  className="border-border"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Status</label>
                <Select value={newLead.status} onValueChange={(value) => setNewLead({...newLead, status: value as any})}>
                  <SelectTrigger className="border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="qualified">Qualified</SelectItem>
                    <SelectItem value="disqualified">Disqualified</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">LinkedIn URL</label>
                <Input
                  placeholder="https://linkedin.com/in/username"
                  value={newLead.linkedinUrl}
                  onChange={(e) => setNewLead({...newLead, linkedinUrl: e.target.value})}
                  className="border-border"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email *</label>
                <Input
                  placeholder="email@company.com"
                  type="email"
                  value={newLead.email}
                  onChange={(e) => setNewLead({...newLead, email: e.target.value})}
                  className="border-border"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Phone</label>
                <Input
                  placeholder="+1 (555) 123-4567"
                  value={newLead.phone}
                  onChange={(e) => setNewLead({...newLead, phone: e.target.value})}
                  className="border-border"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Additional Emails</label>
                <Input
                  placeholder="email1@company.com, email2@company.com"
                  value={newLead.additionalEmails}
                  onChange={(e) => setNewLead({...newLead, additionalEmails: e.target.value})}
                  className="border-border"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Additional Phones</label>
                <Input
                  placeholder="+1 (555) 999-8888, +1 (555) 777-6666"
                  value={newLead.additionalPhones}
                  onChange={(e) => setNewLead({...newLead, additionalPhones: e.target.value})}
                  className="border-border"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Short Note</label>
                <Textarea
                  placeholder="Brief note about the lead..."
                  value={newLead.shortNote}
                  onChange={(e) => setNewLead({...newLead, shortNote: e.target.value})}
                  rows={2}
                  className="border-border resize-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Company *</label>
                <Select value={newLead.companyId} onValueChange={handleCompanySelect}>
                  <SelectTrigger className="border-border">
                    <SelectValue placeholder="Select company" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))}
                    <SelectItem value="new" className="text-blue-600 dark:text-blue-400 font-medium">
                      + Register New Company
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Stage</label>
                <Select value={newLead.stage} onValueChange={(value) => setNewLead({...newLead, stage: value as any})}>
                  <SelectTrigger className="border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prospect">Prospect</SelectItem>
                    <SelectItem value="qualified">Qualified</SelectItem>
                    <SelectItem value="proposal">Proposal</SelectItem>
                    <SelectItem value="negotiation">Negotiation</SelectItem>
                    <SelectItem value="closed-won">Closed Won</SelectItem>
                    <SelectItem value="closed-lost">Closed Lost</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Priority</label>
                <Select value={newLead.priority} onValueChange={(value) => setNewLead({...newLead, priority: value as any})}>
                  <SelectTrigger className="border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Lead Score</label>
                <Select value={newLead.score.toString()} onValueChange={(value) => setNewLead({...newLead, score: parseInt(value)})}>
                  <SelectTrigger className="border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="20">20 - Low</SelectItem>
                    <SelectItem value="40">40 - Below Average</SelectItem>
                    <SelectItem value="50">50 - Average</SelectItem>
                    <SelectItem value="60">60 - Above Average</SelectItem>
                    <SelectItem value="80">80 - High</SelectItem>
                    <SelectItem value="90">90 - Very High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-medium text-foreground">Notes</label>
                <Textarea
                  placeholder="Additional notes about the lead..."
                  value={newLead.notes}
                  onChange={(e) => setNewLead({...newLead, notes: e.target.value})}
                  rows={3}
                  className="border-border resize-none"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 pt-6">
              <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddLead}>
                Add Lead
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Company Registration Modal */}
        <Dialog open={isCompanyModalOpen} onOpenChange={setIsCompanyModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">Register New Company</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Company Name *</label>
                <Input
                  placeholder="Enter company name"
                  value={newCompany.name}
                  onChange={(e) => setNewCompany({...newCompany, name: e.target.value})}
                  className="border-border"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Industry *</label>
                <Select value={newCompany.industry} onValueChange={(value) => setNewCompany({...newCompany, industry: value})}>
                  <SelectTrigger className="border-border">
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Fintech">Fintech</SelectItem>
                    <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                    <SelectItem value="Retail">Retail</SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                    <SelectItem value="Real Estate">Real Estate</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Company Size</label>
                <Select value={newCompany.size} onValueChange={(value) => setNewCompany({...newCompany, size: value as 'small' | 'medium' | 'large'})}>
                  <SelectTrigger className="border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small (1-50)</SelectItem>
                    <SelectItem value="medium">Medium (51-500)</SelectItem>
                    <SelectItem value="large">Large (500+)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Company URL</label>
                <Input
                  placeholder="https://company.com"
                  value={newCompany.companyUrl}
                  onChange={(e) => setNewCompany({...newCompany, companyUrl: e.target.value})}
                  className="border-border"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">LinkedIn URL</label>
                <Input
                  placeholder="https://linkedin.com/company/..."
                  value={newCompany.linkedinUrl}
                  onChange={(e) => setNewCompany({...newCompany, linkedinUrl: e.target.value})}
                  className="border-border"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Phone Number</label>
                <Input
                  placeholder="+1 (555) 123-4567"
                  value={newCompany.phone}
                  onChange={(e) => setNewCompany({...newCompany, phone: e.target.value})}
                  className="border-border"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email</label>
                <Input
                  placeholder="contact@company.com"
                  type="email"
                  value={newCompany.email}
                  onChange={(e) => setNewCompany({...newCompany, email: e.target.value})}
                  className="border-border"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Country</label>
                <Input
                  placeholder="United States"
                  value={newCompany.country}
                  onChange={(e) => setNewCompany({...newCompany, country: e.target.value})}
                  className="border-border"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-medium text-foreground">Address</label>
                <Input
                  placeholder="123 Business St, City, State, ZIP"
                  value={newCompany.address}
                  onChange={(e) => setNewCompany({...newCompany, address: e.target.value})}
                  className="border-border"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-medium text-foreground">Notes</label>
                <Textarea
                  placeholder="Brief description about the company..."
                  value={newCompany.notes}
                  onChange={(e) => setNewCompany({...newCompany, notes: e.target.value})}
                  rows={3}
                  className="border-border resize-none"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 pt-6">
              <Button variant="outline" onClick={() => setIsCompanyModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddCompany}>
                Register Company
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <Card className="border-border shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search leads by name, email, or position..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground placeholder:text-muted-foreground transition-all duration-200"
              />
            </div>
            <div className="flex gap-3">
              <select
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value)}
                className="px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
              >
                <option value="all">All Stages</option>
                <option value="prospect">Prospect</option>
                <option value="qualified">Qualified</option>
                <option value="proposal">Proposal</option>
                <option value="negotiation">Negotiation</option>
                <option value="closed-won">Closed Won</option>
                <option value="closed-lost">Closed Lost</option>
              </select>
              <select
                value={selectedScore}
                onChange={(e) => setSelectedScore(e.target.value)}
                className="px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
              >
                <option value="all">All Scores</option>
                <option value="high">High (80+)</option>
                <option value="medium">Medium (60-79)</option>
                <option value="low">Low (&lt;60)</option>
              </select>
              <Button variant="outline" className="border-border">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leads Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredLeads.map((lead, index) => (
          <motion.div
            key={lead.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card 
              className="h-full border-border shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
              onClick={() => handleLeadClick(lead)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-primary/10 rounded-xl">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground dark:text-white text-lg">
                        {lead.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {lead.designation}
                      </p>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                    <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStageColor(lead.stage)}`}>
                      {getStageLabel(lead.stage)}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Star className={`h-4 w-4 ${getScoreColor(lead.score)}`} />
                      <span className={`text-sm font-medium ${getScoreColor(lead.score)}`}>
                        {lead.score}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center text-sm text-muted-foreground">
                    <Building2 className="h-4 w-4 mr-3 flex-shrink-0" />
                    {companyNames[lead.companyId as keyof typeof companyNames]}
                  </div>

                  <div className="flex items-center text-sm text-muted-foreground">
                    <Mail className="h-4 w-4 mr-3 flex-shrink-0" />
                    {lead.email}
                  </div>

                  {lead.phone && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Phone className="h-4 w-4 mr-3 flex-shrink-0" />
                      {lead.phone}
                    </div>
                  )}

                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-3 flex-shrink-0" />
                    Updated {lead.updatedAt.toLocaleDateString()}
                  </div>
                </div>

                {lead.shortNote && (
                  <div className="mb-6">
                    <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3 leading-relaxed">
                      {lead.shortNote}
                    </p>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button variant="outline" size="sm" className="flex-1 border-border">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule
                  </Button>
                  <Button size="sm" className="flex-1">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Update Stage
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredLeads.length === 0 && (
        <Card className="p-12 text-center border-border">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground dark:text-white mb-2">
            No leads found
          </h3>
          <p className="text-muted-foreground mb-6">
            Try adjusting your search criteria or add a new lead to get started.
          </p>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Lead
          </Button>
        </Card>
      )}

      {/* Lead Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Lead Details</DialogTitle>
          </DialogHeader>
          {selectedLead && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-primary/10 rounded-xl">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-foreground dark:text-white">
                        {selectedLead.name}
                      </h2>
                      <p className="text-lg text-muted-foreground">
                        {selectedLead.designation}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <Building2 className="h-4 w-4 mr-3 text-muted-foreground" />
                      <span className="text-foreground dark:text-white font-medium">Company:</span>
                      <span className="ml-2 text-muted-foreground">
                        {companyNames[selectedLead.companyId as keyof typeof companyNames]}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <Target className="h-4 w-4 mr-3 text-muted-foreground" />
                      <span className="text-foreground dark:text-white font-medium">Stage:</span>
                      <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStageColor(selectedLead.stage)}`}>
                        {getStageLabel(selectedLead.stage)}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <AlertCircle className="h-4 w-4 mr-3 text-muted-foreground" />
                      <span className="text-foreground dark:text-white font-medium">Priority:</span>
                      <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedLead.priority)}`}>
                        {selectedLead.priority.charAt(0).toUpperCase() + selectedLead.priority.slice(1)}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <Star className="h-4 w-4 mr-3 text-muted-foreground" />
                      <span className="text-foreground dark:text-white font-medium">Score:</span>
                      <span className={`ml-2 font-medium ${getScoreColor(selectedLead.score)}`}>
                        {selectedLead.score}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground dark:text-white">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <Mail className="h-4 w-4 mr-3 text-muted-foreground" />
                      <span className="text-foreground dark:text-white font-medium">Email:</span>
                      <span className="ml-2 text-muted-foreground">{selectedLead.email}</span>
                    </div>
                    
                    {selectedLead.phone && (
                      <div className="flex items-center text-sm">
                        <Phone className="h-4 w-4 mr-3 text-muted-foreground" />
                        <span className="text-foreground dark:text-white font-medium">Phone:</span>
                        <span className="ml-2 text-muted-foreground">{selectedLead.phone}</span>
                      </div>
                    )}
                    
                    {selectedLead.linkedinUrl && (
                      <div className="flex items-center text-sm">
                        <Linkedin className="h-4 w-4 mr-3 text-muted-foreground" />
                        <span className="text-foreground dark:text-white font-medium">LinkedIn:</span>
                        <a 
                          href={selectedLead.linkedinUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="ml-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
                        >
                          View Profile
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </div>
                    )}
                    
                    {selectedLead.additionalEmails && selectedLead.additionalEmails.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-sm font-medium text-foreground dark:text-white">Additional Emails:</span>
                        {selectedLead.additionalEmails.map((email, index) => (
                          <div key={index} className="flex items-center text-sm ml-6">
                            <Mail className="h-3 w-3 mr-2 text-muted-foreground" />
                            <span className="text-muted-foreground">{email}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {selectedLead.additionalPhones && selectedLead.additionalPhones.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-sm font-medium text-foreground dark:text-white">Additional Phones:</span>
                        {selectedLead.additionalPhones.map((phone, index) => (
                          <div key={index} className="flex items-center text-sm ml-6">
                            <Phone className="h-3 w-3 mr-2 text-muted-foreground" />
                            <span className="text-muted-foreground">{phone}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Timeline Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground dark:text-white">Timeline</h3>
                  <div className="space-y-3">
                    {selectedLead.initialContactDate && (
                      <div className="flex items-center text-sm">
                        <CalendarDays className="h-4 w-4 mr-3 text-muted-foreground" />
                        <span className="text-foreground dark:text-white font-medium">Initial Contact:</span>
                        <span className="ml-2 text-muted-foreground">
                          {selectedLead.initialContactDate.toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-center text-sm">
                      <CalendarDays className="h-4 w-4 mr-3 text-muted-foreground" />
                      <span className="text-foreground dark:text-white font-medium">Created:</span>
                      <span className="ml-2 text-muted-foreground">
                        {selectedLead.createdAt.toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-3 text-muted-foreground" />
                      <span className="text-foreground dark:text-white font-medium">Last Updated:</span>
                      <span className="ml-2 text-muted-foreground">
                        {selectedLead.updatedAt.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground dark:text-white">Follow-up Dates</h3>
                  {selectedLead.followUpDates.length > 0 ? (
                    <div className="space-y-2">
                      {selectedLead.followUpDates.map((date, index) => (
                        <div key={index} className="flex items-center text-sm">
                          <Calendar className="h-4 w-4 mr-3 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            {date.toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No follow-up dates scheduled</p>
                  )}
                </div>
              </div>

              {/* Notes and Remarks */}
              <div className="space-y-4">
                {selectedLead.shortNote && (
                  <div>
                    <h3 className="text-lg font-semibold text-foreground dark:text-white mb-3">Short Note</h3>
                    <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-4 leading-relaxed">
                      {selectedLead.shortNote}
                    </p>
                  </div>
                )}
                
                {selectedLead.notes && (
                  <div>
                    <h3 className="text-lg font-semibold text-foreground dark:text-white mb-3">Notes</h3>
                    <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-4 leading-relaxed">
                      {selectedLead.notes}
                    </p>
                  </div>
                )}
                
                {selectedLead.remarks.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-foreground dark:text-white mb-3">Remarks</h3>
                    <div className="space-y-2">
                      {selectedLead.remarks.map((remark, index) => (
                        <div key={index} className="flex items-start text-sm">
                          <FileText className="h-4 w-4 mr-3 text-muted-foreground mt-0.5" />
                          <span className="text-muted-foreground">{remark}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Emails Sent */}
              {selectedLead.emailsSent.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground dark:text-white">Emails Sent</h3>
                  <div className="space-y-3">
                    {selectedLead.emailsSent.map((email) => (
                      <div key={email.id} className="border border-border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-foreground dark:text-white">{email.subject}</h4>
                          <div className="flex items-center space-x-2">
                            {getEmailStatusIcon(email.status)}
                            <span className="text-xs text-muted-foreground">
                              {email.sentDate.toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {email.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Call Notes */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground dark:text-white">Call Notes</h3>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsCallNotesModalOpen(true)}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Add Call Note
                  </Button>
                </div>
                
                {selectedLead.callNotes.length > 0 ? (
                  <div className="space-y-3">
                    {selectedLead.callNotes.map((callNote) => (
                      <div key={callNote.id} className="border border-border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                              callNote.callType === 'inbound' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                            }`}>
                              {callNote.callType === 'inbound' ? 'Inbound' : 'Outbound'}
                            </div>
                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                              callNote.outcome === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                              callNote.outcome === 'scheduled' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                              callNote.outcome === 'voicemail' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400' :
                              'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                            }`}>
                              {callNote.outcome.charAt(0).toUpperCase() + callNote.outcome.slice(1).replace('-', ' ')}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                            {callNote.audioUrl && (
                              <Button variant="ghost" size="sm" className="h-6 px-2">
                                <Play className="h-3 w-3 mr-1" />
                                Play
                              </Button>
                            )}
                            <span>{callNote.createdAt.toLocaleDateString()}</span>
                            {callNote.duration > 0 && (
                              <span>• {formatDuration(callNote.duration)}</span>
                            )}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {callNote.transcript}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 border border-dashed border-border rounded-lg">
                    <Phone className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground mb-3">No call notes yet</p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setIsCallNotesModalOpen(true)}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Add First Call Note
                    </Button>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="border-t border-border pt-6">
                <h3 className="text-lg font-semibold text-foreground dark:text-white mb-4">Actions</h3>
                <div className="flex flex-wrap gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setUpdateStageData({ stage: selectedLead.stage, notes: '' });
                      setIsUpdateStageModalOpen(true);
                    }}
                  >
                    <Target className="h-4 w-4 mr-2" />
                    Update Stage
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsScheduleMeetingModalOpen(true)}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Meeting
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsSendEmailModalOpen(true)}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Send Email
                  </Button>
                </div>
              </div>


            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Update Stage Modal */}
      <Dialog open={isUpdateStageModalOpen} onOpenChange={setIsUpdateStageModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">Update Lead Stage</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">New Stage</label>
              <Select value={updateStageData.stage} onValueChange={(value) => setUpdateStageData({...updateStageData, stage: value as any})}>
                <SelectTrigger className="border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="prospect">Prospect</SelectItem>
                  <SelectItem value="qualified">Qualified</SelectItem>
                  <SelectItem value="proposal">Proposal</SelectItem>
                  <SelectItem value="negotiation">Negotiation</SelectItem>
                  <SelectItem value="closed-won">Closed Won</SelectItem>
                  <SelectItem value="closed-lost">Closed Lost</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Notes (Optional)</label>
              <Textarea
                placeholder="Add notes about the stage change..."
                value={updateStageData.notes}
                onChange={(e) => setUpdateStageData({...updateStageData, notes: e.target.value})}
                rows={3}
                className="border-border resize-none"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-6">
            <Button variant="outline" onClick={() => setIsUpdateStageModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateStage}>
              Update Stage
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Schedule Meeting Modal */}
      <Dialog open={isScheduleMeetingModalOpen} onOpenChange={setIsScheduleMeetingModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">Schedule Meeting</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Meeting Title *</label>
              <Input
                placeholder="Enter meeting title"
                value={meetingData.title}
                onChange={(e) => setMeetingData({...meetingData, title: e.target.value})}
                className="border-border"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Date & Time *</label>
              <Input
                type="datetime-local"
                value={meetingData.date}
                onChange={(e) => setMeetingData({...meetingData, date: e.target.value})}
                className="border-border"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Duration (minutes)</label>
              <Select value={meetingData.duration} onValueChange={(value) => setMeetingData({...meetingData, duration: value})}>
                <SelectTrigger className="border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="90">1.5 hours</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Meeting Type</label>
              <Select value={meetingData.type} onValueChange={(value) => setMeetingData({...meetingData, type: value as any})}>
                <SelectTrigger className="border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="call">Call</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="demo">Demo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Notes</label>
              <Textarea
                placeholder="Add meeting notes..."
                value={meetingData.notes}
                onChange={(e) => setMeetingData({...meetingData, notes: e.target.value})}
                rows={3}
                className="border-border resize-none"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-6">
            <Button variant="outline" onClick={() => setIsScheduleMeetingModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleScheduleMeeting}>
              Schedule Meeting
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Send Email Modal */}
      <Dialog open={isSendEmailModalOpen} onOpenChange={setIsSendEmailModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Send Email</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email Template</label>
              <Select value={emailData.template} onValueChange={handleTemplateChange}>
                <SelectTrigger className="border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="custom">Custom Email</SelectItem>
                  <SelectItem value="introduction">Introduction</SelectItem>
                  <SelectItem value="proposal">Proposal</SelectItem>
                  <SelectItem value="followup">Follow-up</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Subject *</label>
              <Input
                placeholder="Enter email subject"
                value={emailData.subject}
                onChange={(e) => setEmailData({...emailData, subject: e.target.value})}
                className="border-border"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Content *</label>
              <Textarea
                placeholder="Enter email content..."
                value={emailData.content}
                onChange={(e) => setEmailData({...emailData, content: e.target.value})}
                rows={10}
                className="border-border resize-none"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-6">
            <Button variant="outline" onClick={() => setIsSendEmailModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendEmail}>
              Send Email
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Call Notes Modal */}
      <Dialog open={isCallNotesModalOpen} onOpenChange={setIsCallNotesModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Add Call Note</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Call Type</label>
                <Select value={newCallNote.callType} onValueChange={(value) => setNewCallNote({...newCallNote, callType: value as any})}>
                  <SelectTrigger className="border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inbound">Inbound</SelectItem>
                    <SelectItem value="outbound">Outbound</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Call Outcome</label>
                <Select value={newCallNote.outcome} onValueChange={(value) => setNewCallNote({...newCallNote, outcome: value as any})}>
                  <SelectTrigger className="border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="no-answer">No Answer</SelectItem>
                    <SelectItem value="voicemail">Voicemail</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Recording Section */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">Call Recording</label>
              <div className="flex items-center space-x-3">
                {!isRecording ? (
                  <Button 
                    variant="outline" 
                    onClick={handleStartRecording}
                    className="flex items-center"
                  >
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                    Start Recording
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    onClick={handleStopRecording}
                    className="flex items-center"
                  >
                    <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
                    Stop Recording ({formatDuration(recordingTime)})
                  </Button>
                )}
                {recordingTime > 0 && !isRecording && (
                  <span className="text-sm text-muted-foreground">
                    Duration: {formatDuration(recordingTime)}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Call Notes *</label>
              <Textarea
                placeholder="Enter detailed notes about the call..."
                value={newCallNote.notes}
                onChange={(e) => setNewCallNote({...newCallNote, notes: e.target.value})}
                rows={6}
                className="border-border resize-none"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-6">
            <Button variant="outline" onClick={() => setIsCallNotesModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCallNote}>
              Add Call Note
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
