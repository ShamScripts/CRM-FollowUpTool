import { useState, useEffect } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { 
  FileSpreadsheet, 
  Upload, 
  Download, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  FileText,
  Database,
  ArrowUpDown,
  Settings,
  History,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { databaseService } from '../services/database';
import { leadSyncService, companySyncService, SyncResult } from '../services/excelSync';
import toast from 'react-hot-toast';

interface SyncHistory {
  id: string;
  date: Date;
  user: string;
  action: 'upload' | 'download' | 'sync';
  rowsAffected: number;
  status: 'success' | 'error' | 'warning';
  details: string;
}

interface ConflictItem {
  id: string;
  field: string;
  crmValue: string;
  excelValue: string;
  leadName: string;
  resolved: boolean;
  resolution?: 'crm' | 'excel' | 'manual';
}

const mockSyncHistory: SyncHistory[] = [
  {
    id: '1',
    date: new Date('2024-01-25T10:30:00'),
    user: 'John Doe',
    action: 'sync',
    rowsAffected: 45,
    status: 'success',
    details: 'Two-way sync completed successfully'
  },
  {
    id: '2',
    date: new Date('2024-01-24T14:15:00'),
    user: 'Sarah Johnson',
    action: 'upload',
    rowsAffected: 23,
    status: 'warning',
    details: '3 conflicts resolved automatically'
  },
  {
    id: '3',
    date: new Date('2024-01-23T09:45:00'),
    user: 'Mike Davis',
    action: 'download',
    rowsAffected: 67,
    status: 'success',
    details: 'Excel export completed'
  }
];

const mockConflicts: ConflictItem[] = [
  {
    id: '1',
    field: 'Phone',
    crmValue: '+1 (555) 123-4567',
    excelValue: '+1-555-123-4567',
    leadName: 'John Smith',
    resolved: false
  },
  {
    id: '2',
    field: 'Stage',
    crmValue: 'Qualified',
    excelValue: 'Proposal',
    leadName: 'Sarah Johnson',
    resolved: false
  },
  {
    id: '3',
    field: 'Score',
    crmValue: '85',
    excelValue: '90',
    leadName: 'Mike Davis',
    resolved: true,
    resolution: 'crm'
  }
];

export const ExcelSync: React.FC = () => {
  const [syncHistory, setSyncHistory] = useState<SyncHistory[]>([]);
  const [conflicts, setConflicts] = useState<ConflictItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showConflicts, setShowConflicts] = useState(false);
  const [lastSync, setLastSync] = useState<Date>(new Date());
  const [syncStats, setSyncStats] = useState({
    totalRecords: 0,
    conflicts: 0,
    successRate: 0
  });

  // Initialize database connection on component mount
  useEffect(() => {
    const initDatabase = async () => {
      try {
        await databaseService.connect();
        await loadSyncHistory();
        await loadSyncStats();
      } catch (error) {
        console.error('Failed to initialize database:', error);
        toast.error('Failed to connect to database');
      }
    };

    initDatabase();
  }, []);

  // Load sync history from database
  const loadSyncHistory = async () => {
    try {
      // In a real implementation, you would load from database
      // For now, we'll use mock data
      setSyncHistory(mockSyncHistory);
    } catch (error) {
      console.error('Failed to load sync history:', error);
    }
  };

  // Load sync statistics
  const loadSyncStats = async () => {
    try {
      const leads = await databaseService.getLeads();
      const companies = await databaseService.getCompanies();
      const totalRecords = leads.length + companies.length;
      
      setSyncStats({
        totalRecords,
        conflicts: conflicts.length,
        successRate: totalRecords > 0 ? 95.5 : 0
      });
    } catch (error) {
      console.error('Failed to load sync stats:', error);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv') && !file.name.endsWith('.xlsx')) {
      toast.error('Please upload a CSV or Excel file');
      return;
    }

    setIsUploading(true);
    try {
      // Determine data type based on file content or user selection
      const dataType = file.name.toLowerCase().includes('lead') ? 'leads' : 'companies';
      const syncService = dataType === 'leads' ? leadSyncService : companySyncService;
      
      const result: SyncResult = await syncService.importFromExcel(file, dataType);
      
      if (result.success) {
        toast.success(`Successfully processed ${result.recordsProcessed} records`);
        setConflicts(result.conflicts.map(c => ({
          ...c,
          leadName: c.recordName
        })));
        setShowConflicts(result.conflicts.length > 0);
        
        // Update sync history
        const newSyncRecord: SyncHistory = {
          id: Date.now().toString(),
          date: new Date(),
          user: 'Current User',
          action: 'upload',
          rowsAffected: result.recordsProcessed,
          status: result.errors.length > 0 ? 'warning' : 'success',
          details: `Created: ${result.recordsCreated}, Updated: ${result.recordsUpdated}, Skipped: ${result.recordsSkipped}`
        };
        
        setSyncHistory(prev => [newSyncRecord, ...prev]);
        await loadSyncStats();
      } else {
        toast.error('Import failed');
      }
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      // Perform two-way sync
      const leads = await databaseService.getLeads();
      const companies = await databaseService.getCompanies();
      
      // In a real implementation, you would sync with external systems
      // For now, we'll simulate the sync process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newSyncRecord: SyncHistory = {
        id: Date.now().toString(),
        date: new Date(),
        user: 'Current User',
        action: 'sync',
        rowsAffected: leads.length + companies.length,
        status: 'success',
        details: 'Two-way sync completed successfully'
      };
      
      setSyncHistory(prev => [newSyncRecord, ...prev]);
      setLastSync(new Date());
      await loadSyncStats();
      
      toast.success('Sync completed successfully');
    } catch (error) {
      console.error('Sync failed:', error);
      toast.error('Sync failed');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleExport = async (dataType: 'leads' | 'companies') => {
    try {
      const syncService = dataType === 'leads' ? leadSyncService : companySyncService;
      const blob = await syncService.exportToExcel(dataType);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${dataType}_export_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success(`${dataType} exported successfully`);
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Export failed');
    }
  };

  const resolveConflict = (conflictId: string, resolution: 'crm' | 'excel') => {
    setConflicts(prev => 
      prev.map(conflict => 
        conflict.id === conflictId 
          ? { ...conflict, resolved: true, resolution }
          : conflict
      )
    );
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      success: CheckCircle,
      error: AlertTriangle,
      warning: AlertCircle
    };
    return icons[status as keyof typeof icons] || Clock;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      success: 'text-green-600',
      error: 'text-red-600',
      warning: 'text-yellow-600'
    };
    return colors[status as keyof typeof colors] || 'text-gray-600';
  };

  const unresolvedConflicts = conflicts.filter(c => !c.resolved);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Excel Sync</h1>
          <p className="text-gray-600 dark:text-white">
            Synchronize your CRM data with Excel files and OneDrive
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button variant="primary" onClick={handleSync} isLoading={isSyncing}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync Now
          </Button>
        </div>
      </div>

      {/* Sync Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Last Sync</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {lastSync.toLocaleDateString()}
              </p>
              <p className="text-xs text-gray-500">
                {lastSync.toLocaleTimeString()}
              </p>
            </div>
            <Clock className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Records Synced</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{syncStats.totalRecords}</p>
            </div>
            <Database className="h-8 w-8 text-green-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Conflicts</p>
              <p className="text-2xl font-bold text-red-600">{syncStats.conflicts}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Success Rate</p>
              <p className="text-2xl font-bold text-green-600">{syncStats.successRate}%</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </Card>
      </div>

      {/* Upload/Download Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="text-center">
            <div className="p-4 bg-blue-100 dark:bg-blue-900/20 rounded-full w-16 h-16 mx-auto mb-4">
              <Upload className="h-8 w-8 text-blue-600 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Upload Excel File
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Upload an Excel file to sync with your CRM data
            </p>
            <div className="space-y-3">
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
                id="excel-upload"
              />
              <label htmlFor="excel-upload">
                <Button variant="primary" className="w-full" isLoading={isUploading}>
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Choose Excel File
                </Button>
              </label>
              <Button variant="outline" className="w-full">
                <Database className="h-4 w-4 mr-2" />
                Fetch from OneDrive
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="text-center">
            <div className="p-4 bg-green-100 dark:bg-green-900/20 rounded-full w-16 h-16 mx-auto mb-4">
              <Download className="h-8 w-8 text-green-600 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Export to Excel
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Download your CRM data as an Excel file
            </p>
            <div className="space-y-3">
              <Button variant="primary" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download All Data
              </Button>
              <Button variant="outline" className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                Custom Export
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Conflict Resolution */}
      {showConflicts && unresolvedConflicts.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Resolve Conflicts
            </h3>
            <span className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 px-2 py-1 rounded-full text-sm">
              {unresolvedConflicts.length} conflicts
            </span>
          </div>
          <div className="space-y-4">
            {unresolvedConflicts.map((conflict, index) => (
              <motion.div
                key={conflict.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {conflict.leadName} - {conflict.field}
                    </h4>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">CRM:</span>
                        <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 px-2 py-1 rounded text-sm">
                          {conflict.crmValue}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Excel:</span>
                        <span className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 px-2 py-1 rounded text-sm">
                          {conflict.excelValue}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => resolveConflict(conflict.id, 'crm')}
                    >
                      Keep CRM
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => resolveConflict(conflict.id, 'excel')}
                    >
                      Keep Excel
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      {/* Sync History */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Sync History
          </h3>
          <Button variant="outline" size="sm">
            <History className="h-4 w-4 mr-2" />
            View All
          </Button>
        </div>
        <div className="space-y-4">
          {syncHistory.map((item, index) => {
            const StatusIcon = getStatusIcon(item.status);
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <StatusIcon className={`h-5 w-5 ${getStatusColor(item.status)}`} />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {item.action.charAt(0).toUpperCase() + item.action.slice(1)} by {item.user}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {item.details} • {item.rowsAffected} rows affected
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-900 dark:text-white">
                    {item.date.toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {item.date.toLocaleTimeString()}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
