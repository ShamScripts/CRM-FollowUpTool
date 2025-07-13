import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
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
  Play, 
  Pause, 
  Settings, 
  Clock, 
  Mail, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  RefreshCw,
  Calendar,
  Users,
  BarChart3,
  Zap,
  Eye,
  Edit,
  Save,
  Trash2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { defaultEmailScheduler, type EmailScheduleConfig, type EmailJob, type EmailStats } from '../services/emailScheduler';
import toast from 'react-hot-toast';

export const AutomatedEmailManager: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [stats, setStats] = useState<EmailStats | null>(null);
  const [jobs, setJobs] = useState<EmailJob[]>([]);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [config, setConfig] = useState<EmailScheduleConfig>({
    enabled: true,
    checkInterval: 15,
    followUpReminderTimes: [24, 2, 1],
    reminderNotificationTimes: [24, 2, 1],
    overdueCheckInterval: 2,
    maxEmailsPerHour: 100,
    retryAttempts: 3,
    retryDelay: 30
  });

  // Update stats and jobs periodically
  useEffect(() => {
    const updateData = () => {
      setStats(defaultEmailScheduler.getStats());
      setJobs(defaultEmailScheduler.getJobs());
    };

    updateData();
    const interval = setInterval(updateData, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const startAutomation = () => {
    defaultEmailScheduler.start();
    setIsRunning(true);
    toast.success('Email automation started!');
  };

  const stopAutomation = () => {
    defaultEmailScheduler.stop();
    setIsRunning(false);
    toast.success('Email automation stopped!');
  };

  const saveConfig = () => {
    defaultEmailScheduler.updateConfig(config);
    setIsConfigOpen(false);
    toast.success('Configuration saved!');
  };

  const retryFailedJob = (jobId: string) => {
    defaultEmailScheduler.retryJob(jobId);
    toast.success('Job queued for retry!');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'failed':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      case 'pending':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      case 'retrying':
        return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'followup':
        return <Clock className="h-4 w-4" />;
      case 'reminder':
        return <AlertTriangle className="h-4 w-4" />;
      case 'overdue':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Mail className="h-4 w-4" />;
    }
  };

  const formatTimeArray = (times: number[]): string => {
    return times.map(time => `${time}h`).join(', ');
  };

  const parseTimeArray = (timeString: string): number[] => {
    return timeString.split(',').map(t => parseInt(t.replace('h', '').trim())).filter(n => !isNaN(n));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Automated Email Manager</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Automatically send follow-up and reminder emails
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={() => setIsConfigOpen(true)}
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            Configure
          </Button>
          <Button
            onClick={isRunning ? stopAutomation : startAutomation}
            className={`flex items-center gap-2 ${
              isRunning ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="h-4 w-4" />
                Stop Automation
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Start Automation
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                <p className={`text-2xl font-bold ${isRunning ? 'text-green-600' : 'text-red-600'}`}>
                  {isRunning ? 'Running' : 'Stopped'}
                </p>
              </div>
              <div className={`p-2 rounded-full ${isRunning ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'}`}>
                {isRunning ? <CheckCircle className="h-6 w-6 text-green-600" /> : <XCircle className="h-6 w-6 text-red-600" />}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Emails Sent Today</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats?.emailsToday || 0}
                </p>
              </div>
              <Mail className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pending Jobs</p>
                <p className="text-2xl font-bold text-orange-600">
                  {stats?.totalPending || 0}
                </p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Failed Jobs</p>
                <p className="text-2xl font-bold text-red-600">
                  {stats?.totalFailed || 0}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Configuration Dialog */}
      <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Automation Configuration
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* General Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">General Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="enabled"
                    checked={config.enabled}
                    onChange={(e) => setConfig({...config, enabled: e.target.checked})}
                    className="rounded"
                  />
                  <label htmlFor="enabled" className="text-sm font-medium">
                    Enable automated email sending
                  </label>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Check Interval (minutes)
                  </label>
                  <Input
                    type="number"
                    value={config.checkInterval}
                    onChange={(e) => setConfig({...config, checkInterval: parseInt(e.target.value) || 15})}
                    min="1"
                    max="60"
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Max Emails Per Hour
                  </label>
                  <Input
                    type="number"
                    value={config.maxEmailsPerHour}
                    onChange={(e) => setConfig({...config, maxEmailsPerHour: parseInt(e.target.value) || 100})}
                    min="1"
                    max="1000"
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Follow-up Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Follow-up Reminders</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Reminder Times (hours before scheduled time)
                  </label>
                  <Input
                    value={formatTimeArray(config.followUpReminderTimes)}
                    onChange={(e) => setConfig({
                      ...config, 
                      followUpReminderTimes: parseTimeArray(e.target.value)
                    })}
                    placeholder="24h, 2h, 1h"
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Separate times with commas (e.g., 24h, 2h, 1h)
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Reminder Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Reminder Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Notification Times (hours before due date)
                  </label>
                  <Input
                    value={formatTimeArray(config.reminderNotificationTimes)}
                    onChange={(e) => setConfig({
                      ...config, 
                      reminderNotificationTimes: parseTimeArray(e.target.value)
                    })}
                    placeholder="24h, 2h, 1h"
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Overdue Check Interval (hours)
                  </label>
                  <Input
                    type="number"
                    value={config.overdueCheckInterval}
                    onChange={(e) => setConfig({...config, overdueCheckInterval: parseInt(e.target.value) || 2})}
                    min="1"
                    max="24"
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Retry Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Retry Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Max Retry Attempts
                  </label>
                  <Input
                    type="number"
                    value={config.retryAttempts}
                    onChange={(e) => setConfig({...config, retryAttempts: parseInt(e.target.value) || 3})}
                    min="1"
                    max="10"
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Retry Delay (minutes)
                  </label>
                  <Input
                    type="number"
                    value={config.retryDelay}
                    onChange={(e) => setConfig({...config, retryDelay: parseInt(e.target.value) || 30})}
                    min="5"
                    max="120"
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsConfigOpen(false)}>
                Cancel
              </Button>
              <Button onClick={saveConfig} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Configuration
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Email Jobs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Email Jobs
            </CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                Total: {jobs.length} | Pending: {jobs.filter(j => j.status === 'pending').length} | 
                Sent: {jobs.filter(j => j.status === 'sent').length} | 
                Failed: {jobs.filter(j => j.status === 'failed').length}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {jobs.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No email jobs found</p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {jobs.map((job) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {getTypeIcon(job.type)}
                    <div>
                      <p className="font-medium text-sm">{job.id}</p>
                      <p className="text-xs text-gray-500">
                        Scheduled: {job.scheduledTime.toLocaleString()}
                      </p>
                      {job.lastAttempt && (
                        <p className="text-xs text-gray-500">
                          Last attempt: {job.lastAttempt.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(job.status)}`}>
                      {job.status}
                    </span>
                    
                    {job.status === 'failed' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => retryFailedJob(job.id)}
                        className="flex items-center gap-1"
                      >
                        <RefreshCw className="h-3 w-3" />
                        Retry
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Automation Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            How It Works
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Follow-up Automation</h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <li>• Automatically schedules emails for follow-ups</li>
                <li>• Sends reminders 24h, 2h, and 1h before scheduled time</li>
                <li>• Includes lead details, company info, and notes</li>
                <li>• Respects priority levels and assigned team members</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Reminder Automation</h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <li>• Sends notifications before reminder due dates</li>
                <li>• Automatically detects overdue items</li>
                <li>• Sends urgent emails for overdue reminders</li>
                <li>• Tracks email delivery and retry failed sends</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AutomatedEmailManager; 