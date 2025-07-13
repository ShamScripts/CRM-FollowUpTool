import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { 
  Building2, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Users,
  Phone,
  Mail,
  Globe,
  MapPin,
  Calendar,
  Linkedin,
  ExternalLink,
  Briefcase,
  Flag,
  Eye,
  Clock,
  Star,
  TrendingUp,
  MessageSquare,
  FileText,
  CalendarDays,
  User,
  Building,
  Mail as MailIcon,
  Phone as PhoneIcon,
  MapPin as MapPinIcon,
  Globe as GlobeIcon,
  X
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Company, Lead } from '../types';
import toast from 'react-hot-toast';

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
    notes: 'Enterprise client with high potential for long-term partnership. Strong decision-making process and budget allocation.',
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
    notes: 'Fast-growing startup with innovative approach. Budget conscious but open to strategic partnerships.',
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
    notes: 'Established manufacturing company with global presence. Long-term partnership potential with significant contract value.',
    dateAdded: new Date('2024-01-05'),
    assignedEmployees: ['emp1', 'emp3'],
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-22'),
  }
];

// Enhanced mock leads data with comprehensive information
const mockLeads: Lead[] = [
  {
    id: '1',
    companyId: '1',
    name: 'John Smith',
    designation: 'Senior Manager',
    status: 'active',
    email: 'john.smith@techcorp.com',
    phone: '+1 (555) 123-4567',
    additionalEmails: ['john.smith.personal@gmail.com'],
    additionalPhones: ['+1 (555) 987-6543'],
    shortNote: 'Interested in enterprise solution',
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
      'Scheduled demo for next week',
      'Followed up with proposal'
    ],
    emailsSent: [
      {
        id: '1',
        subject: 'Introduction and Demo Request',
        content: 'Hi John, I hope this email finds you well...',
        sentDate: new Date('2024-01-15'),
        status: 'opened'
      },
      {
        id: '2',
        subject: 'Demo Confirmation',
        content: 'Thank you for your interest in our solution...',
        sentDate: new Date('2024-01-18'),
        status: 'clicked'
      }
    ],
    score: 85,
    assignedTo: 'Sarah Johnson',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-25'),
    notes: 'Very responsive and shows genuine interest in our solution.'
  },
  {
    id: '2',
    companyId: '1',
    name: 'Jane Doe',
    designation: 'Director of Sales',
    status: 'active',
    email: 'jane.doe@techcorp.com',
    phone: '+1 (555) 234-5678',
    additionalEmails: ['jane.doe@outlook.com'],
    additionalPhones: ['+1 (555) 876-5432'],
    shortNote: 'Looking for scalable solution',
    stage: 'proposal',
    priority: 'medium',
    initialContactDate: new Date('2024-01-10'),
    followUpDates: [
      new Date('2024-01-17'),
      new Date('2024-01-24')
    ],
    remarks: [
      'Met at industry conference',
      'Provided initial proposal',
      'Waiting for budget approval'
    ],
    emailsSent: [
      {
        id: '3',
        subject: 'Proposal for TechCorp',
        content: 'Dear Jane, Please find attached our proposal...',
        sentDate: new Date('2024-01-20'),
        status: 'delivered'
      }
    ],
    score: 72,
    assignedTo: 'Mike Wilson',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-22'),
    notes: 'Decision maker with budget authority. Needs ROI justification.'
  },
  {
    id: '3',
    companyId: '2',
    name: 'Robert Johnson',
    designation: 'CTO',
    status: 'active',
    email: 'robert.johnson@startupxyz.com',
    phone: '+1 (555) 345-6789',
    additionalEmails: ['rjohnson@startupxyz.com'],
    additionalPhones: ['+1 (555) 765-4321'],
    shortNote: 'Technical evaluation in progress',
    stage: 'negotiation',
    priority: 'high',
    initialContactDate: new Date('2024-01-05'),
    followUpDates: [
      new Date('2024-01-12'),
      new Date('2024-01-19'),
      new Date('2024-01-26')
    ],
    remarks: [
      'Technical demo completed',
      'Security review requested',
      'Contract terms discussed'
    ],
    emailsSent: [
      {
        id: '4',
        subject: 'Technical Demo Follow-up',
        content: 'Hi Robert, Thank you for the detailed technical discussion...',
        sentDate: new Date('2024-01-16'),
        status: 'opened'
      },
      {
        id: '5',
        subject: 'Security Documentation',
        content: 'As requested, please find our security documentation...',
        sentDate: new Date('2024-01-23'),
        status: 'sent'
      }
    ],
    score: 90,
    assignedTo: 'Sarah Johnson',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-24'),
    notes: 'Technical decision maker. Very thorough in evaluation process.'
  },
  {
    id: '4',
    companyId: '3',
    name: 'Emily Chen',
    designation: 'VP of Operations',
    status: 'active',
    email: 'emily.chen@enterprise.com',
    phone: '+1 (555) 456-7890',
    additionalEmails: ['echen@enterprise.com'],
    additionalPhones: ['+1 (555) 654-3210'],
    shortNote: 'Looking for manufacturing solutions',
    stage: 'proposal',
    priority: 'high',
    initialContactDate: new Date('2024-01-08'),
    followUpDates: [
      new Date('2024-01-15'),
      new Date('2024-01-22'),
      new Date('2024-01-29')
    ],
    remarks: [
      'Initial meeting at trade show',
      'Site visit scheduled',
      'Budget approved for Q2'
    ],
    emailsSent: [
      {
        id: '6',
        subject: 'Enterprise Solutions Overview',
        content: 'Dear Emily, Thank you for your interest in our manufacturing solutions...',
        sentDate: new Date('2024-01-12'),
        status: 'opened'
      },
      {
        id: '7',
        subject: 'Site Visit Confirmation',
        content: 'We are excited to confirm your site visit on...',
        sentDate: new Date('2024-01-18'),
        status: 'clicked'
      }
    ],
    score: 88,
    assignedTo: 'Mike Wilson',
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-26'),
    notes: 'Key decision maker with significant budget. Very interested in automation solutions.'
  }
];

export const Companies: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>(mockCompanies);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [selectedSize, setSelectedSize] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewLeadsModalOpen, setIsViewLeadsModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isLeadDetailModalOpen, setIsLeadDetailModalOpen] = useState(false);

  // Form state for adding company
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

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.industry.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = selectedIndustry === 'all' || company.industry === selectedIndustry;
    const matchesSize = selectedSize === 'all' || company.size === selectedSize;
    
    return matchesSearch && matchesIndustry && matchesSize;
  });

  const getSizeLabel = (size: string) => {
    const labels = {
      small: 'Small (1-50)',
      medium: 'Medium (51-500)',
      large: 'Large (500+)'
    };
    return labels[size as keyof typeof labels] || size;
  };

  const getSizeColor = (size: string) => {
    const colors = {
      small: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
      medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 border-amber-200 dark:border-amber-800',
      large: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-800'
    };
    return colors[size as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  const handleAddCompany = () => {
    if (!newCompany.name || !newCompany.industry) {
      toast.error('Please fill in required fields');
      return;
    }

    const company: Company = {
      id: Date.now().toString(),
      ...newCompany,
      dateAdded: new Date(),
      assignedEmployees: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setCompanies([...companies, company]);
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
    setIsAddModalOpen(false);
    toast.success('Company added successfully!');
  };

  const handleViewLeads = (company: Company) => {
    setSelectedCompany(company);
    setIsViewLeadsModalOpen(true);
  };

  const handleViewLeadDetails = (lead: Lead) => {
    setSelectedLead(lead);
    setIsLeadDetailModalOpen(true);
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

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      low: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground dark:text-white">Companies</h1>
          <p className="text-muted-foreground mt-1">
            Manage your company database and relationships
          </p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="shadow-sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Company
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">Add New Company</DialogTitle>
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
                  <SelectTrigger className="border-border dark:text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="dark:text-white">
                    <SelectItem value="small" className="dark:text-white">Small (1-50)</SelectItem>
                    <SelectItem value="medium" className="dark:text-white">Medium (51-500)</SelectItem>
                    <SelectItem value="large" className="dark:text-white">Large (500+)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Company URL</label>
                                  <Input
                    placeholder="https://company.com"
                    value={newCompany.companyUrl}
                    onChange={(e) => setNewCompany({...newCompany, companyUrl: e.target.value})}
                    className="border-border dark:text-white dark:placeholder:text-gray-400"
                  />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">LinkedIn URL</label>
                                  <Input
                    placeholder="https://linkedin.com/company/..."
                    value={newCompany.linkedinUrl}
                    onChange={(e) => setNewCompany({...newCompany, linkedinUrl: e.target.value})}
                    className="border-border dark:text-white dark:placeholder:text-gray-400"
                  />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Phone Number</label>
                                  <Input
                    placeholder="+1 (555) 123-4567"
                    value={newCompany.phone}
                    onChange={(e) => setNewCompany({...newCompany, phone: e.target.value})}
                    className="border-border dark:text-white dark:placeholder:text-gray-400"
                  />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email</label>
                                  <Input
                    placeholder="contact@company.com"
                    type="email"
                    value={newCompany.email}
                    onChange={(e) => setNewCompany({...newCompany, email: e.target.value})}
                    className="border-border dark:text-white dark:placeholder:text-gray-400"
                  />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Country</label>
                                  <Input
                    placeholder="United States"
                    value={newCompany.country}
                    onChange={(e) => setNewCompany({...newCompany, country: e.target.value})}
                    className="border-border dark:text-white dark:placeholder:text-gray-400"
                  />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-medium text-foreground">Address</label>
                                  <Input
                    placeholder="123 Business St, City, State, ZIP"
                    value={newCompany.address}
                    onChange={(e) => setNewCompany({...newCompany, address: e.target.value})}
                    className="border-border dark:text-white dark:placeholder:text-gray-400"
                  />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-medium text-foreground">Short Note</label>
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
              <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddCompany}>
                Add Company
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
              <Input
                type="text"
                placeholder="Search companies by name or industry..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-border bg-background text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <div className="flex gap-3">
              <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                <SelectTrigger className="w-[180px] border-border dark:text-white">
                  <SelectValue placeholder="All Industries" />
                </SelectTrigger>
                <SelectContent className="dark:text-white">
                  <SelectItem value="all" className="dark:text-white">All Industries</SelectItem>
                  <SelectItem value="Technology" className="dark:text-white">Technology</SelectItem>
                  <SelectItem value="Fintech" className="dark:text-white">Fintech</SelectItem>
                  <SelectItem value="Manufacturing" className="dark:text-white">Manufacturing</SelectItem>
                  <SelectItem value="Healthcare" className="dark:text-white">Healthcare</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedSize} onValueChange={setSelectedSize}>
                <SelectTrigger className="w-[140px] border-border dark:text-white">
                  <SelectValue placeholder="All Sizes" />
                </SelectTrigger>
                <SelectContent className="dark:text-white">
                  <SelectItem value="all" className="dark:text-white">All Sizes</SelectItem>
                  <SelectItem value="small" className="dark:text-white">Small</SelectItem>
                  <SelectItem value="medium" className="dark:text-white">Medium</SelectItem>
                  <SelectItem value="large" className="dark:text-white">Large</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="border-border">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCompanies.map((company, index) => (
          <motion.div
            key={company.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full border-border shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-3">
                                      <div className="p-3 bg-primary/10 rounded-xl">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-lg">
                        {company.name}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          {company.industry}
                        </p>
                      </div>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                    <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>

                <div className="space-y-4 mb-6">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getSizeColor(company.size)}`}>
                    {getSizeLabel(company.size)}
                  </span>

                  {company.companyUrl && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Globe className="h-4 w-4 mr-3 flex-shrink-0" />
                      <a href={company.companyUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center">
                        {company.companyUrl.replace('https://', '')}
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </div>
                  )}

                  {company.linkedinUrl && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Linkedin className="h-4 w-4 mr-3 flex-shrink-0" />
                      <a href={company.linkedinUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center">
                        LinkedIn Profile
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </div>
                  )}

                  {company.phone && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Phone className="h-4 w-4 mr-3 flex-shrink-0" />
                      {company.phone}
                    </div>
                  )}

                  {company.email && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Mail className="h-4 w-4 mr-3 flex-shrink-0" />
                      {company.email}
                    </div>
                  )}

                  {company.address && (
                    <div className="flex items-start text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="leading-relaxed">{company.address}</span>
                    </div>
                  )}

                  {company.country && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Flag className="h-4 w-4 mr-3 flex-shrink-0" />
                      {company.country}
                    </div>
                  )}

                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-3 flex-shrink-0" />
                    {company.assignedEmployees.length} assigned employee{company.assignedEmployees.length !== 1 ? 's' : ''}
                  </div>

                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-3 flex-shrink-0" />
                    Added {company.dateAdded.toLocaleDateString()}
                  </div>
                </div>

                                  {company.notes && (
                    <div className="mb-6">
                      <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3 leading-relaxed">
                        {company.notes}
                      </p>
                    </div>
                  )}

                <div className="flex gap-3">
                  <Button variant="outline" size="sm" className="flex-1 border-border">
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleViewLeads(company)}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    View Leads
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* View Leads Modal */}
      <Dialog open={isViewLeadsModalOpen} onOpenChange={setIsViewLeadsModalOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">
              Leads for {selectedCompany?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                {mockLeads.filter(lead => lead.companyId === selectedCompany?.id).length} leads found
              </p>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Lead
              </Button>
            </div>
            
            {/* Leads List */}
            <div className="space-y-4">
              {mockLeads
                .filter(lead => lead.companyId === selectedCompany?.id)
                .map((lead, index) => (
                  <motion.div
                    key={lead.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="border-border cursor-pointer hover:shadow-md transition-shadow duration-200" 
                          onClick={() => handleViewLeadDetails(lead)}>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-3">
                              <div className="p-2 bg-primary/10 rounded-lg">
                                <User className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-foreground text-lg">{lead.name}</h4>
                                <p className="text-sm text-muted-foreground">{lead.designation}</p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                              <div className="flex items-center text-sm text-muted-foreground">
                                <MailIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                                {lead.email}
                              </div>
                              {lead.phone && (
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <PhoneIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                                  {lead.phone}
                                </div>
                              )}
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                                Updated {lead.updatedAt.toLocaleDateString()}
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStageColor(lead.stage)}`}>
                                  {lead.stage.charAt(0).toUpperCase() + lead.stage.slice(1)}
                                </span>
                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(lead.priority)}`}>
                                  {lead.priority}
                                </span>
                                <div className="flex items-center space-x-1">
                                  <Star className={`h-4 w-4 ${getScoreColor(lead.score)}`} />
                                  <span className={`text-sm font-medium ${getScoreColor(lead.score)}`}>
                                    {lead.score}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-muted-foreground">
                                  Assigned to: {lead.assignedTo}
                                </span>
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4 mr-1" />
                                  View Details
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Lead Details Modal */}
      <Dialog open={isLeadDetailModalOpen} onOpenChange={setIsLeadDetailModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center justify-between">
              <span>Lead Details - {selectedLead?.name}</span>
              <Button variant="outline" size="sm" onClick={() => setIsLeadDetailModalOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          {selectedLead && (
            <div className="space-y-6">
              {/* Contact Information */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center text-sm">
                        <MailIcon className="h-4 w-4 mr-3 text-muted-foreground" />
                        <span className="font-medium">Primary Email:</span>
                        <span className="ml-2 text-muted-foreground">{selectedLead.email}</span>
                      </div>
                      {selectedLead.additionalEmails && selectedLead.additionalEmails.length > 0 && (
                        <div className="flex items-center text-sm">
                          <MailIcon className="h-4 w-4 mr-3 text-muted-foreground" />
                          <span className="font-medium">Additional Emails:</span>
                          <span className="ml-2 text-muted-foreground">{selectedLead.additionalEmails.join(', ')}</span>
                        </div>
                      )}
                      {selectedLead.phone && (
                        <div className="flex items-center text-sm">
                          <PhoneIcon className="h-4 w-4 mr-3 text-muted-foreground" />
                          <span className="font-medium">Primary Phone:</span>
                          <span className="ml-2 text-muted-foreground">{selectedLead.phone}</span>
                        </div>
                      )}
                      {selectedLead.additionalPhones && selectedLead.additionalPhones.length > 0 && (
                        <div className="flex items-center text-sm">
                          <PhoneIcon className="h-4 w-4 mr-3 text-muted-foreground" />
                          <span className="font-medium">Additional Phones:</span>
                          <span className="ml-2 text-muted-foreground">{selectedLead.additionalPhones.join(', ')}</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm">
                        <Building className="h-4 w-4 mr-3 text-muted-foreground" />
                        <span className="font-medium">Company:</span>
                        <span className="ml-2 text-muted-foreground">{selectedCompany?.name}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <User className="h-4 w-4 mr-3 text-muted-foreground" />
                        <span className="font-medium">Designation:</span>
                        <span className="ml-2 text-muted-foreground">{selectedLead.designation}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <User className="h-4 w-4 mr-3 text-muted-foreground" />
                        <span className="font-medium">Assigned To:</span>
                        <span className="ml-2 text-muted-foreground">{selectedLead.assignedTo}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-3 text-muted-foreground" />
                        <span className="font-medium">Initial Contact:</span>
                        <span className="ml-2 text-muted-foreground">
                          {selectedLead.initialContactDate?.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Lead Status */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Lead Status
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm font-medium">Stage:</span>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStageColor(selectedLead.stage)}`}>
                        {selectedLead.stage.charAt(0).toUpperCase() + selectedLead.stage.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm font-medium">Priority:</span>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(selectedLead.priority)}`}>
                        {selectedLead.priority}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm font-medium">Score:</span>
                      <div className="flex items-center space-x-1">
                        <Star className={`h-4 w-4 ${getScoreColor(selectedLead.score)}`} />
                        <span className={`font-medium ${getScoreColor(selectedLead.score)}`}>
                          {selectedLead.score}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Follow-up Dates */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                    <CalendarDays className="h-5 w-5 mr-2" />
                    Follow-up Schedule
                  </h3>
                  <div className="space-y-3">
                    {selectedLead.followUpDates.map((date, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-3 text-muted-foreground" />
                          <span className="font-medium">Follow-up {index + 1}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {date.toLocaleDateString()} at {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Communication History */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Communication History
                  </h3>
                  <div className="space-y-4">
                    {selectedLead.emailsSent.map((email) => (
                      <div key={email.id} className="border border-border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <MailIcon className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{email.subject}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-muted-foreground">
                              {email.sentDate.toLocaleDateString()}
                            </span>
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              email.status === 'opened' ? 'bg-green-100 text-green-800' :
                              email.status === 'clicked' ? 'bg-blue-100 text-blue-800' :
                              email.status === 'delivered' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {email.status}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {email.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Remarks and Notes */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Remarks & Notes
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Activity Remarks</h4>
                      <div className="space-y-2">
                        {selectedLead.remarks.map((remark, index) => (
                          <div key={index} className="flex items-start space-x-2 p-2 bg-muted/50 rounded">
                            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-sm text-muted-foreground">{remark}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    {selectedLead.notes && (
                      <div>
                        <h4 className="font-medium text-foreground mb-2">Additional Notes</h4>
                        <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
                          {selectedLead.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {filteredCompanies.length === 0 && (
        <Card className="p-12 text-center border-border">
          <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground dark:text-white mb-2">
            No companies found
          </h3>
          <p className="text-muted-foreground mb-6">
            Try adjusting your search or filter criteria
          </p>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Company
          </Button>
        </Card>
      )}
    </div>
  );
};
