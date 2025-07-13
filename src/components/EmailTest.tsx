import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from './ui/select';
import { Mail, Send, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { defaultEmailService } from '../services/emailService';
import toast from 'react-hot-toast';

export const EmailTest: React.FC = () => {
  const [recipientEmail, setRecipientEmail] = useState('test@example.com');
  const [isSending, setIsSending] = useState(false);
  const [testResults, setTestResults] = useState<Array<{
    type: string;
    success: boolean;
    timestamp: Date;
  }>>([]);

  const testFollowUpEmail = async () => {
    setIsSending(true);
    try {
      const followUpData = {
        leadName: 'John Smith',
        leadEmail: 'john@techcorp.com',
        companyName: 'TechCorp Solutions',
        followUpType: 'call',
        scheduledDate: new Date(Date.now() + 3600000), // 1 hour from now
        notes: 'Follow up on product demo and pricing discussion',
        assignedTo: 'Sales Team',
        priority: 'high'
      };

      const success = await defaultEmailService.sendFollowUpReminder(
        followUpData,
        recipientEmail
      );

      setTestResults(prev => [...prev, {
        type: 'Follow-up Reminder',
        success,
        timestamp: new Date()
      }]);

      if (success) {
        toast.success('Follow-up reminder email sent successfully!');
      } else {
        toast.error('Failed to send follow-up reminder email');
      }
    } catch (error) {
      console.error('Error sending follow-up email:', error);
      toast.error('Error sending follow-up email');
      setTestResults(prev => [...prev, {
        type: 'Follow-up Reminder',
        success: false,
        timestamp: new Date()
      }]);
    } finally {
      setIsSending(false);
    }
  };

  const testReminderEmail = async () => {
    setIsSending(true);
    try {
      const reminderData = {
        title: 'Send Proposal to StartupXYZ',
        description: 'Email pricing proposal with custom features and implementation timeline',
        type: 'email',
        priority: 'medium',
        dueDate: new Date(Date.now() + 7200000), // 2 hours from now
        leadName: 'Sarah Johnson',
        companyName: 'StartupXYZ',
        assignedTo: 'Sales Team'
      };

      const success = await defaultEmailService.sendReminderNotification(
        reminderData,
        recipientEmail
      );

      setTestResults(prev => [...prev, {
        type: 'Reminder Notification',
        success,
        timestamp: new Date()
      }]);

      if (success) {
        toast.success('Reminder notification email sent successfully!');
      } else {
        toast.error('Failed to send reminder notification email');
      }
    } catch (error) {
      console.error('Error sending reminder email:', error);
      toast.error('Error sending reminder email');
      setTestResults(prev => [...prev, {
        type: 'Reminder Notification',
        success: false,
        timestamp: new Date()
      }]);
    } finally {
      setIsSending(false);
    }
  };

  const testOverdueEmail = async () => {
    setIsSending(true);
    try {
      const overdueData = {
        title: 'Contract Review Meeting',
        description: 'Review contract terms with Enterprise Ltd and finalize negotiations',
        type: 'meeting',
        priority: 'high',
        dueDate: new Date(Date.now() - 3600000), // 1 hour ago (overdue)
        leadName: 'Mike Davis',
        companyName: 'Enterprise Ltd',
        assignedTo: 'Sales Team'
      };

      const success = await defaultEmailService.sendOverdueReminder(
        overdueData,
        recipientEmail
      );

      setTestResults(prev => [...prev, {
        type: 'Overdue Reminder',
        success,
        timestamp: new Date()
      }]);

      if (success) {
        toast.success('Overdue reminder email sent successfully!');
      } else {
        toast.error('Failed to send overdue reminder email');
      }
    } catch (error) {
      console.error('Error sending overdue email:', error);
      toast.error('Error sending overdue email');
      setTestResults(prev => [...prev, {
        type: 'Overdue Reminder',
        success: false,
        timestamp: new Date()
      }]);
    } finally {
      setIsSending(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Notification Test
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Recipient Email
            </label>
            <Input
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              placeholder="Enter recipient email..."
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={testFollowUpEmail}
              disabled={isSending}
              className="flex items-center gap-2"
            >
              <Clock className="h-4 w-4" />
              Test Follow-up
            </Button>

            <Button
              onClick={testReminderEmail}
              disabled={isSending}
              className="flex items-center gap-2"
            >
              <AlertTriangle className="h-4 w-4" />
              Test Reminder
            </Button>

            <Button
              onClick={testOverdueEmail}
              disabled={isSending}
              className="flex items-center gap-2"
            >
              <AlertTriangle className="h-4 w-4" />
              Test Overdue
            </Button>
          </div>

          {isSending && (
            <div className="flex items-center gap-2 text-blue-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              Sending email...
            </div>
          )}
        </CardContent>
      </Card>

      {/* Test Results */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Test Results
            </CardTitle>
            <Button variant="outline" size="sm" onClick={clearResults}>
              Clear Results
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {testResults.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No test results yet. Run a test to see results here.
            </p>
          ) : (
            <div className="space-y-3">
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    result.success 
                      ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
                      : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {result.success ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                    )}
                    <div>
                      <p className="font-medium text-sm">
                        {result.type}
                      </p>
                      <p className="text-xs text-gray-500">
                        {result.timestamp.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs font-medium ${
                    result.success ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {result.success ? 'SUCCESS' : 'FAILED'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Email Templates Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Available Email Templates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h4 className="font-medium mb-2">Follow-up Reminder</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Sent for scheduled follow-ups with leads
              </p>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>• Lead and company details</li>
                <li>• Scheduled date and time</li>
                <li>• Priority level</li>
                <li>• Follow-up notes</li>
              </ul>
            </div>

            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h4 className="font-medium mb-2">Reminder Notification</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Sent for general reminders and tasks
              </p>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>• Reminder title and description</li>
                <li>• Due date and time</li>
                <li>• Priority level</li>
                <li>• Associated lead/company</li>
              </ul>
            </div>

            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h4 className="font-medium mb-2">Overdue Reminder</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Sent for overdue reminders with urgent styling
              </p>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>• Urgent warning styling</li>
                <li>• Overdue notification</li>
                <li>• All reminder details</li>
                <li>• Immediate action required</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailTest; 