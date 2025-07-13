import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from './ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from './ui/select';
import { 
  Mail, 
  Send, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Settings,
  Eye,
  Edit,
  Trash2,
  Plus,
  Bell,
  Calendar,
  User,
  Building,
  Phone
} from 'lucide-react';
import { motion } from 'framer-motion';
import { defaultEmailService, type FollowUpEmailData, type ReminderEmailData } from '../services/emailService';
import toast from 'react-hot-toast';

interface EmailNotificationProps {
  type: 'followup' | 'reminder';
  data: any;
  recipientEmail: string;
  onEmailSent?: (success: boolean) => void;
}

interface EmailHistory {
  id: string;
  type: 'followup' | 'reminder' | 'overdue';
  subject: string;
  recipient: string;
  sentAt: Date;
  status: 'sent' | 'delivered' | 'failed';
  template: string;
}

export const EmailNotification: React.FC<EmailNotificationProps> = ({
  type,
  data,
  recipientEmail,
  onEmailSent
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [emailHistory, setEmailHistory] = useState<EmailHistory[]>([]);
  const [customSubject, setCustomSubject] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [useCustomTemplate, setUseCustomTemplate] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');

  // Mock email history
  useEffect(() => {
    const mockHistory: EmailHistory[] = [
      {
        id: '1',
        type: 'followup',
        subject: 'Follow-up Reminder: Call with John Smith',
        recipient: recipientEmail,
        sentAt: new Date(Date.now() - 3600000),
        status: 'delivered',
        template: 'followup-reminder'
      },
      {
        id: '2',
        type: 'reminder',
        subject: 'Reminder: Send proposal to StartupXYZ',
        recipient: recipientEmail,
        sentAt: new Date(Date.now() - 7200000),
        status: 'sent',
        template: 'reminder-notification'
      }
    ];
    setEmailHistory(mockHistory);
  }, [recipientEmail]);

  const getEmailData = (): FollowUpEmailData | ReminderEmailData => {
    if (type === 'followup') {
      return {
        leadName: data.leadName || 'Unknown Lead',
        leadEmail: data.leadEmail || '',
        companyName: data.companyName || 'Unknown Company',
        followUpType: data.type || 'follow-up',
        scheduledDate: data.scheduledDate || new Date(),
        notes: data.notes || '',
        assignedTo: data.assignedTo || 'Team Member',
        priority: data.priority || 'medium'
      } as FollowUpEmailData;
    } else {
      return {
        title: data.title || 'Reminder',
        description: data.description || '',
        type: data.type || 'task',
        priority: data.priority || 'medium',
        dueDate: data.dueDate || new Date(),
        leadName: data.leadName,
        companyName: data.companyName,
        assignedTo: data.assignedTo || 'Team Member'
      } as ReminderEmailData;
    }
  };

  const sendEmail = async () => {
    setIsSending(true);
    try {
      const emailData = getEmailData();
      let success = false;

      if (type === 'followup') {
        success = await defaultEmailService.sendFollowUpReminder(
          emailData as FollowUpEmailData,
          recipientEmail
        );
      } else {
        // Check if it's overdue
        const isOverdue = data.dueDate && new Date(data.dueDate) < new Date();
        if (isOverdue) {
          success = await defaultEmailService.sendOverdueReminder(
            emailData as ReminderEmailData,
            recipientEmail
          );
        } else {
          success = await defaultEmailService.sendReminderNotification(
            emailData as ReminderEmailData,
            recipientEmail
          );
        }
      }

      if (success) {
        // Add to email history
        const newEmail: EmailHistory = {
          id: Date.now().toString(),
          type: type,
          subject: customSubject || `Reminder: ${data.title || data.leadName}`,
          recipient: recipientEmail,
          sentAt: new Date(),
          status: 'sent',
          template: selectedTemplate || `${type}-reminder`
        };
        setEmailHistory(prev => [newEmail, ...prev]);

        toast.success('Email sent successfully!');
        onEmailSent?.(true);
        setIsOpen(false);
      } else {
        toast.error('Failed to send email');
        onEmailSent?.(false);
      }
    } catch (error) {
      console.error('Email sending error:', error);
      toast.error('Error sending email');
      onEmailSent?.(false);
    } finally {
      setIsSending(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'sent':
        return <Send className="h-4 w-4 text-blue-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'followup':
        return <Phone className="h-4 w-4" />;
      case 'reminder':
        return <Bell className="h-4 w-4" />;
      case 'overdue':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Mail className="h-4 w-4" />;
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Send Email
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Send Email Notification
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Email Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Email Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Recipient
                    </label>
                    <Input value={recipientEmail} readOnly className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Type
                    </label>
                    <Input value={type} readOnly className="mt-1" />
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Email Content Preview:</h4>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {type === 'followup' ? (
                      <div>
                        <p><strong>Lead:</strong> {data.leadName || 'Unknown'}</p>
                        <p><strong>Company:</strong> {data.companyName || 'Unknown'}</p>
                        <p><strong>Type:</strong> {data.type || 'follow-up'}</p>
                        <p><strong>Date:</strong> {data.scheduledDate?.toLocaleString() || 'Not set'}</p>
                        <p><strong>Priority:</strong> {data.priority || 'medium'}</p>
                      </div>
                    ) : (
                      <div>
                        <p><strong>Title:</strong> {data.title || 'Reminder'}</p>
                        <p><strong>Description:</strong> {data.description || 'No description'}</p>
                        <p><strong>Type:</strong> {data.type || 'task'}</p>
                        <p><strong>Due Date:</strong> {data.dueDate?.toLocaleString() || 'Not set'}</p>
                        <p><strong>Priority:</strong> {data.priority || 'medium'}</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Email Template Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Email Template
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="useCustom"
                    checked={useCustomTemplate}
                    onChange={(e) => setUseCustomTemplate(e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="useCustom" className="text-sm font-medium">
                    Use custom template
                  </label>
                </div>

                {useCustomTemplate ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Subject
                      </label>
                      <Input
                        value={customSubject}
                        onChange={(e) => setCustomSubject(e.target.value)}
                        placeholder="Enter email subject..."
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Message
                      </label>
                      <Textarea
                        value={customMessage}
                        onChange={(e) => setCustomMessage(e.target.value)}
                        placeholder="Enter custom message..."
                        rows={4}
                        className="mt-1"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Template
                    </label>
                    <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select template" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="followup-reminder">Follow-up Reminder</SelectItem>
                        <SelectItem value="reminder-notification">Reminder Notification</SelectItem>
                        <SelectItem value="overdue-reminder">Overdue Reminder</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Email History */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Email History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {emailHistory.map((email) => (
                    <motion.div
                      key={email.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {getTypeIcon(email.type)}
                        <div>
                          <p className="font-medium text-sm">{email.subject}</p>
                          <p className="text-xs text-gray-500">
                            {email.sentAt.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(email.status)}
                        <span className="text-xs text-gray-500 capitalize">
                          {email.status}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isSending}
              >
                Cancel
              </Button>
              <Button
                onClick={sendEmail}
                disabled={isSending}
                className="flex items-center gap-2"
              >
                {isSending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send Email
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EmailNotification; 