import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
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
  Calendar, 
  Clock, 
  Plus, 
  Search, 
  Filter, 
  Phone,
  Mail,
  Users,
  Target,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Bell,
  Settings,
  AlertTriangle,
  Trash2,
  Edit,
  CalendarDays,
  List,
  Grid3X3
} from 'lucide-react';
import { motion } from 'framer-motion';
import { FollowUp } from '../types';
import CalendarComponent from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import toast from 'react-hot-toast';
import EmailNotification from '../components/EmailNotification';
import { defaultAutomationIntegration } from '../services/automationIntegration';

// Follow-up data structure
const mockFollowUps: FollowUp[] = [
  {
    id: '1',
    leadId: '1',
    companyId: '1',
    type: 'call',
    scheduledDate: new Date('2024-01-25T10:00:00'),
    status: 'scheduled',
    priority: 'high',
    notes: 'Follow up on product demo',
    createdBy: 'emp1'
  },
  {
    id: '2',
    leadId: '2',
    companyId: '2',
    type: 'email',
    scheduledDate: new Date('2024-01-25T14:00:00'),
    status: 'scheduled',
    priority: 'medium',
    notes: 'Send pricing proposal',
    createdBy: 'emp2'
  },
  {
    id: '3',
    leadId: '3',
    companyId: '3',
    type: 'meeting',
    scheduledDate: new Date('2024-01-25T16:30:00'),
    status: 'completed',
    priority: 'high',
    notes: 'Contract negotiation meeting',
    createdBy: 'emp1',
    completedAt: new Date('2024-01-25T17:00:00')
  },
  {
    id: '4',
    leadId: '4',
    companyId: '1',
    type: 'demo',
    scheduledDate: new Date('2024-01-24T09:00:00'),
    status: 'missed',
    priority: 'medium',
    notes: 'Product demonstration',
    createdBy: 'emp3'
  }
];

// Reminder data structure
interface Reminder {
  id: string;
  title: string;
  description: string;
  type: 'call' | 'email' | 'meeting' | 'task';
  priority: 'low' | 'medium' | 'high';
  dueDate: Date;
  leadId?: string;
  companyId?: string;
  status: 'pending' | 'completed' | 'overdue';
  createdAt: Date;
}

const mockReminders: Reminder[] = [
  {
    id: '1',
    title: 'Follow up with John Smith',
    description: 'Call regarding product demo feedback',
    type: 'call',
    priority: 'high',
    dueDate: new Date('2024-01-25T10:00:00'),
    leadId: '1',
    companyId: '1',
    status: 'pending',
    createdAt: new Date('2024-01-20')
  },
  {
    id: '2',
    title: 'Send proposal to StartupXYZ',
    description: 'Email pricing proposal with custom features',
    type: 'email',
    priority: 'medium',
    dueDate: new Date('2024-01-25T14:00:00'),
    leadId: '2',
    companyId: '2',
    status: 'pending',
    createdAt: new Date('2024-01-22')
  },
  {
    id: '3',
    title: 'Contract review meeting',
    description: 'Review contract terms with Enterprise Ltd',
    type: 'meeting',
    priority: 'high',
    dueDate: new Date('2024-01-24T16:00:00'),
    leadId: '3',
    companyId: '3',
    status: 'overdue',
    createdAt: new Date('2024-01-18')
  },
  {
    id: '4',
    title: 'Update CRM records',
    description: 'Update lead scores and contact information',
    type: 'task',
    priority: 'low',
    dueDate: new Date('2024-01-26T09:00:00'),
    status: 'pending',
    createdAt: new Date('2024-01-23')
  }
];

const leadNames = {
  '1': 'John Smith',
  '2': 'Sarah Johnson',
  '3': 'Mike Davis',
  '4': 'Lisa Chen'
};

const companyNames = {
  '1': 'TechCorp Solutions',
  '2': 'StartupXYZ',
  '3': 'Enterprise Ltd'
};

export const FollowUps: React.FC = () => {
  // State management
  const [followUps, setFollowUps] = useState<FollowUp[]>(mockFollowUps);
  const [reminders, setReminders] = useState<Reminder[]>(mockReminders);
  const [activeTab, setActiveTab] = useState<'followups' | 'reminders'>('followups');
  const [view, setView] = useState<'list' | 'calendar' | 'timeline'>('list');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [isScheduling, setIsScheduling] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // New item states
  const [newFollowUp, setNewFollowUp] = useState({
    leadId: '',
    companyId: '',
    type: 'call' as const,
    scheduledDate: new Date().toISOString().slice(0, 16),
    priority: 'medium' as const,
    notes: ''
  });
  
  const [newReminder, setNewReminder] = useState({
    title: '',
    description: '',
    type: 'task' as const,
    priority: 'medium' as const,
    dueDate: new Date().toISOString().slice(0, 16),
    leadId: '',
    companyId: ''
  });

  // Filtered data
  const filteredFollowUps = followUps.filter(followUp => {
    const matchesStatus = selectedStatus === 'all' || followUp.status === selectedStatus;
    const matchesPriority = selectedPriority === 'all' || followUp.priority === selectedPriority;
    const matchesType = selectedType === 'all' || followUp.type === selectedType;
    return matchesStatus && matchesPriority && matchesType;
  });

  const filteredReminders = reminders.filter(reminder => {
    const matchesPriority = selectedPriority === 'all' || reminder.priority === selectedPriority;
    const matchesType = selectedType === 'all' || reminder.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || reminder.status === selectedStatus;
    return matchesPriority && matchesType && matchesStatus;
  });

  // Helper functions
  const getStatusColor = (status: string) => {
    const colors = {
      scheduled: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      completed: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      missed: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      rescheduled: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      pending: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      overdue: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      low: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      call: Phone,
      email: Mail,
      meeting: Users,
      demo: Target,
      task: CheckCircle
    };
    return icons[type as keyof typeof icons] || Clock;
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      scheduled: Clock,
      completed: CheckCircle,
      missed: XCircle,
      rescheduled: AlertCircle,
      pending: Clock,
      overdue: AlertTriangle
    };
    return icons[status as keyof typeof icons] || Clock;
  };

  // Statistics calculations
  const todayFollowUps = filteredFollowUps.filter(followUp => {
    const today = new Date();
    return followUp.scheduledDate.toDateString() === today.toDateString();
  });

  const upcomingFollowUps = filteredFollowUps.filter(followUp => {
    const today = new Date();
    return followUp.scheduledDate > today;
  });

  const overdueFollowUps = filteredFollowUps.filter(followUp => {
    const today = new Date();
    return followUp.scheduledDate < today && followUp.status === 'scheduled';
  });

  const pendingReminders = reminders.filter(r => r.status === 'pending');
  const overdueReminders = reminders.filter(r => r.status === 'overdue');
  const completedReminders = reminders.filter(r => r.status === 'completed');

  // Action handlers
  const handleScheduleFollowUp = () => {
    if (!newFollowUp.leadId || !newFollowUp.companyId) {
      toast.error('Please fill in required fields');
      return;
    }

    const followUp: FollowUp = {
      id: Date.now().toString(),
      leadId: newFollowUp.leadId,
      companyId: newFollowUp.companyId,
      type: newFollowUp.type,
      scheduledDate: new Date(newFollowUp.scheduledDate),
      status: 'scheduled',
      priority: newFollowUp.priority,
      notes: newFollowUp.notes,
      createdBy: 'Current User'
    };

    setFollowUps([...followUps, followUp]);
    
    // Automatically schedule email notifications
    defaultAutomationIntegration.scheduleFollowUpEmails(followUp);
    
    setNewFollowUp({
      leadId: '',
      companyId: '',
      type: 'call',
      scheduledDate: new Date().toISOString().slice(0, 16),
      priority: 'medium',
      notes: ''
    });
    setIsAddModalOpen(false);
    toast.success('Follow-up scheduled successfully! Email notifications will be sent automatically.');
  };

  const handleAddReminder = () => {
    if (!newReminder.title || !newReminder.description) {
      toast.error('Please fill in required fields');
      return;
    }

    const reminder: Reminder = {
      id: Date.now().toString(),
      ...newReminder,
      dueDate: new Date(newReminder.dueDate),
      status: 'pending',
      createdAt: new Date(),
    };

    setReminders([...reminders, reminder]);
    
    // Automatically schedule email notifications
    defaultAutomationIntegration.scheduleReminderEmails(reminder);
    
    setNewReminder({
      title: '',
      description: '',
      type: 'task',
      priority: 'medium',
      dueDate: new Date().toISOString().slice(0, 16),
      leadId: '',
      companyId: ''
    });
    setIsAddModalOpen(false);
    toast.success('Reminder added successfully! Email notifications will be sent automatically.');
  };

  const markReminderAsCompleted = (id: string) => {
    setReminders(prev => 
      prev.map(reminder => 
        reminder.id === id ? { ...reminder, status: 'completed' as const } : reminder
      )
    );
    toast.success('Reminder marked as completed!');
  };

  const deleteReminder = (id: string) => {
    setReminders(prev => prev.filter(reminder => reminder.id !== id));
    toast.success('Reminder deleted successfully!');
  };

  const markFollowUpAsCompleted = (id: string) => {
    setFollowUps(prev => 
      prev.map(followUp => 
        followUp.id === id ? { ...followUp, status: 'completed' as const, completedAt: new Date() } : followUp
      )
    );
    toast.success('Follow-up marked as completed!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground dark:text-white">Follow-ups & Reminders</h1>
          <p className="text-muted-foreground mt-1">
            Manage your follow-up activities and reminders in one place
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex rounded-lg border border-gray-300 dark:border-gray-600 p-1">
            <button
              onClick={() => setActiveTab('followups')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                activeTab === 'followups' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
              }`}
            >
              Follow-ups
            </button>
            <button
              onClick={() => setActiveTab('reminders')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                activeTab === 'reminders' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
              }`}
            >
              Reminders
            </button>
          </div>
          
          {activeTab === 'followups' && (
            <div className="flex rounded-lg border border-gray-300 dark:border-gray-600 p-1">
              <button
                onClick={() => setView('list')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  view === 'list' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
              <button
                onClick={() => setView('calendar')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  view === 'calendar' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
                }`}
              >
                <CalendarDays className="h-4 w-4" />
              </button>
              <button
                onClick={() => setView('timeline')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  view === 'timeline' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
                }`}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
            </div>
          )}
          
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          
          {activeTab === 'followups' ? (
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setIsAddModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Follow-up
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-xl">Add New Follow-up</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Lead</label>
                    <Select value={newFollowUp.leadId} onValueChange={(value) => setNewFollowUp({...newFollowUp, leadId: value as any})}>
                      <SelectTrigger className="border-border">
                        <SelectValue placeholder="Select a lead" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(leadNames).map(([id, name]) => (
                          <SelectItem key={id} value={id}>{name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Company</label>
                    <Select value={newFollowUp.companyId} onValueChange={(value) => setNewFollowUp({...newFollowUp, companyId: value as any})}>
                      <SelectTrigger className="border-border">
                        <SelectValue placeholder="Select a company" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(companyNames).map(([id, name]) => (
                          <SelectItem key={id} value={id}>{name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Type</label>
                    <Select value={newFollowUp.type} onValueChange={(value) => setNewFollowUp({...newFollowUp, type: value as any})}>
                      <SelectTrigger className="border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="call">Call</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="meeting">Meeting</SelectItem>
                        <SelectItem value="demo">Demo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Priority</label>
                    <Select value={newFollowUp.priority} onValueChange={(value) => setNewFollowUp({...newFollowUp, priority: value as any})}>
                      <SelectTrigger className="border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Scheduled Date & Time *</label>
                    <Input
                      type="datetime-local"
                      value={newFollowUp.scheduledDate}
                      onChange={(e) => setNewFollowUp({...newFollowUp, scheduledDate: e.target.value})}
                      className="border-border"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-medium text-foreground">Notes</label>
                    <Textarea
                      placeholder="Enter follow-up notes..."
                      value={newFollowUp.notes}
                      onChange={(e) => setNewFollowUp({...newFollowUp, notes: e.target.value})}
                      rows={3}
                      className="border-border resize-none"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 pt-6">
                  <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleScheduleFollowUp}>
                    Add Follow-up
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          ) : (
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Reminder
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-xl">Add New Reminder</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Title *</label>
                    <Input
                      placeholder="Enter reminder title"
                      value={newReminder.title}
                      onChange={(e) => setNewReminder({...newReminder, title: e.target.value})}
                      className="border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Type</label>
                    <Select value={newReminder.type} onValueChange={(value) => setNewReminder({...newReminder, type: value as any})}>
                      <SelectTrigger className="border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="call">Call</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="meeting">Meeting</SelectItem>
                        <SelectItem value="task">Task</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Priority</label>
                    <Select value={newReminder.priority} onValueChange={(value) => setNewReminder({...newReminder, priority: value as any})}>
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
                    <label className="text-sm font-medium text-foreground">Due Date & Time *</label>
                    <Input
                      type="datetime-local"
                      value={newReminder.dueDate}
                      onChange={(e) => setNewReminder({...newReminder, dueDate: e.target.value})}
                      className="border-border"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-medium text-foreground">Description *</label>
                    <Textarea
                      placeholder="Enter reminder description..."
                      value={newReminder.description}
                      onChange={(e) => setNewReminder({...newReminder, description: e.target.value})}
                      rows={3}
                      className="border-border resize-none"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 pt-6">
                  <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddReminder}>
                    Add Reminder
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {activeTab === 'followups' ? (
          <>
            <Card className="border-border shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Today</p>
                    <p className="text-2xl font-bold text-foreground dark:text-white">
                      {todayFollowUps.length}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-border shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Upcoming</p>
                    <p className="text-2xl font-bold text-foreground dark:text-white">
                      {upcomingFollowUps.length}
                    </p>
                  </div>
                  <Calendar className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-border shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Overdue</p>
                    <p className="text-2xl font-bold text-foreground dark:text-white">
                      {overdueFollowUps.length}
                    </p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-border shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Completed</p>
                    <p className="text-2xl font-bold text-foreground dark:text-white">
                      {followUps.filter(f => f.status === 'completed').length}
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <Card className="border-border shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending</p>
                    <p className="text-2xl font-bold text-foreground dark:text-white">{pendingReminders.length}</p>
                  </div>
                  <Clock className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-border shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Overdue</p>
                    <p className="text-2xl font-bold text-red-600">{overdueReminders.length}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-border shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Completed</p>
                    <p className="text-2xl font-bold text-green-600">{completedReminders.length}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-border shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="text-2xl font-bold text-foreground dark:text-white">{reminders.length}</p>
                  </div>
                  <Bell className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Filters */}
      <Card className="border-border shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            {activeTab === 'followups' ? (
              <>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="all">All Status</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                  <option value="missed">Missed</option>
                  <option value="rescheduled">Rescheduled</option>
                </select>
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="all">All Priority</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="all">All Types</option>
                  <option value="call">Call</option>
                  <option value="email">Email</option>
                  <option value="meeting">Meeting</option>
                  <option value="demo">Demo</option>
                </select>
              </>
            ) : (
              <>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="overdue">Overdue</option>
                </select>
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="all">All Priority</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="all">All Types</option>
                  <option value="call">Call</option>
                  <option value="email">Email</option>
                  <option value="meeting">Meeting</option>
                  <option value="task">Task</option>
                </select>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Content based on active tab and view */}
      {activeTab === 'followups' ? (
        // Follow-ups content
        <>
          {view === 'list' && (
            <div className="space-y-4">
              {filteredFollowUps.map((followUp, index) => {
                const TypeIcon = getTypeIcon(followUp.type);
                const StatusIcon = getStatusIcon(followUp.status);
                
                return (
                  <motion.div
                    key={followUp.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="border-border shadow-sm hover:shadow-md transition-shadow duration-200">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                              <TypeIcon className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-medium text-foreground dark:text-white">
                                {leadNames[followUp.leadId as keyof typeof leadNames]}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {companyNames[followUp.companyId as keyof typeof companyNames]}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <p className="text-sm font-medium text-foreground dark:text-white">
                                {followUp.scheduledDate.toLocaleDateString()}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {followUp.scheduledDate.toLocaleTimeString([], { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </p>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(followUp.status)}`}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {followUp.status}
                              </span>
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(followUp.priority)}`}>
                                {followUp.priority}
                              </span>
                            </div>
                            
                            <div className="flex space-x-2">
                              {followUp.status === 'scheduled' && (
                                <>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => markFollowUpAsCompleted(followUp.id)}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Complete
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    <Clock className="h-4 w-4 mr-1" />
                                    Reschedule
                                  </Button>
                                </>
                              )}
                              <EmailNotification
                                type="followup"
                                data={{
                                  leadName: leadNames[followUp.leadId as keyof typeof leadNames],
                                  companyName: companyNames[followUp.companyId as keyof typeof companyNames],
                                  type: followUp.type,
                                  scheduledDate: followUp.scheduledDate,
                                  notes: followUp.notes,
                                  assignedTo: 'Team Member',
                                  priority: followUp.priority
                                }}
                                recipientEmail="team@yourcompany.com"
                                onEmailSent={(success) => {
                                  if (success) {
                                    toast.success('Follow-up reminder email sent!');
                                  }
                                }}
                              />
                            </div>
                          </div>
                        </div>
                        
                        {followUp.notes && (
                          <div className="mt-4 bg-muted/50 rounded-lg p-3">
                            <p className="text-sm text-muted-foreground">
                              {followUp.notes}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}

          {view === 'calendar' && (
            <Card className="border-border shadow-sm">
              <CardContent className="p-6">
                <div className="flex justify-center">
                  <CalendarComponent
                    onChange={(value) => setSelectedDate(value as Date)}
                    value={selectedDate}
                    className="border-none"
                    tileContent={({ date }) => {
                      const dayFollowUps = followUps.filter(followUp => 
                        followUp.scheduledDate.toDateString() === date.toDateString()
                      );
                      return dayFollowUps.length > 0 ? (
                        <div className="flex justify-center">
                          <div className="bg-blue-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                            {dayFollowUps.length}
                          </div>
                        </div>
                      ) : null;
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {view === 'timeline' && (
            <Card className="border-border shadow-sm">
              <CardContent className="p-6">
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
                  <div className="space-y-6">
                    {filteredFollowUps.map((followUp, index) => {
                      const TypeIcon = getTypeIcon(followUp.type);
                      const StatusIcon = getStatusIcon(followUp.status);
                      
                      return (
                        <motion.div
                          key={followUp.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="relative flex items-center space-x-4"
                        >
                          <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                            <TypeIcon className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-medium text-foreground dark:text-white">
                                  {leadNames[followUp.leadId as keyof typeof leadNames]}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {companyNames[followUp.companyId as keyof typeof companyNames]}
                                </p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(followUp.status)}`}>
                                  <StatusIcon className="h-3 w-3 mr-1" />
                                  {followUp.status}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  {followUp.scheduledDate.toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            {followUp.notes && (
                              <p className="text-sm text-muted-foreground mt-2">
                                {followUp.notes}
                              </p>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        // Reminders content
        <div className="space-y-4">
          {filteredReminders.map((reminder, index) => {
            const TypeIcon = getTypeIcon(reminder.type);
            const isOverdue = reminder.status === 'overdue';
            
            return (
              <motion.div
                key={reminder.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`border-border shadow-sm hover:shadow-md transition-shadow duration-200 ${isOverdue ? 'border-red-200 dark:border-red-800' : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-full ${isOverdue ? 'bg-red-100 dark:bg-red-900/20' : 'bg-blue-100 dark:bg-blue-900/20'}`}>
                          <TypeIcon className={`h-5 w-5 ${isOverdue ? 'text-red-600' : 'text-blue-600'}`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground dark:text-white">
                            {reminder.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {reminder.description}
                          </p>
                          <div className="flex items-center space-x-4 mt-2">
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4 mr-1" />
                              {reminder.dueDate.toLocaleDateString()} at {reminder.dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(reminder.priority)}`}>
                          {reminder.priority}
                        </span>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(reminder.status)}`}>
                          {reminder.status}
                        </span>
                        
                        <div className="flex space-x-2">
                          {reminder.status === 'pending' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => markReminderAsCompleted(reminder.id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Complete
                            </Button>
                          )}
                          <EmailNotification
                            type="reminder"
                            data={{
                              title: reminder.title,
                              description: reminder.description,
                              type: reminder.type,
                              priority: reminder.priority,
                              dueDate: reminder.dueDate,
                              leadName: reminder.leadId ? leadNames[reminder.leadId as keyof typeof leadNames] : undefined,
                              companyName: reminder.companyId ? companyNames[reminder.companyId as keyof typeof companyNames] : undefined,
                              assignedTo: 'Team Member'
                            }}
                            recipientEmail="team@yourcompany.com"
                            onEmailSent={(success) => {
                              if (success) {
                                toast.success('Reminder email sent!');
                              }
                            }}
                          />
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteReminder(reminder.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}

          {filteredReminders.length === 0 && (
            <Card className="border-border shadow-sm">
              <CardContent className="p-12 text-center">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground dark:text-white mb-2">
                  No reminders found
                </h3>
                <p className="text-muted-foreground mb-4">
                  Create your first reminder to stay organized and never miss important tasks.
                </p>
                <Button onClick={() => setIsAddModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Reminder
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};
