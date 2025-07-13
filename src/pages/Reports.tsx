import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { 
  BarChart3, 
  Download, 
  Filter, 
  Calendar, 
  Users, 
  TrendingUp, 
  Target,
  DollarSign,
  Clock,
  Award,
  FileText,
  Printer,
  Activity,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  LineChart as LineChartIcon,
  Download as DownloadIcon,
  Settings
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const performanceData = [
  { name: 'John Doe', leads: 45, closed: 12, revenue: 125000 },
  { name: 'Sarah Johnson', leads: 38, closed: 15, revenue: 180000 },
  { name: 'Mike Davis', leads: 52, closed: 18, revenue: 220000 },
  { name: 'Lisa Chen', leads: 41, closed: 11, revenue: 95000 },
  { name: 'Tom Wilson', leads: 35, closed: 9, revenue: 110000 }
];

const conversionData = [
  { stage: 'Prospect', count: 150, percentage: 100, color: '#3B82F6' },
  { stage: 'Qualified', count: 120, percentage: 80, color: '#10B981' },
  { stage: 'Proposal', count: 85, percentage: 57, color: '#F59E0B' },
  { stage: 'Negotiation', count: 45, percentage: 30, color: '#EF4444' },
  { stage: 'Closed Won', count: 28, percentage: 19, color: '#8B5CF6' }
];

const monthlyTrends = [
  { month: 'Jan', leads: 120, closed: 25, revenue: 250000 },
  { month: 'Feb', leads: 135, closed: 32, revenue: 320000 },
  { month: 'Mar', leads: 148, closed: 38, revenue: 380000 },
  { month: 'Apr', leads: 162, closed: 42, revenue: 420000 },
  { month: 'May', leads: 178, closed: 48, revenue: 480000 },
  { month: 'Jun', leads: 195, closed: 55, revenue: 550000 }
];

const industryData = [
  { name: 'Technology', value: 35, color: '#3B82F6' },
  { name: 'Healthcare', value: 25, color: '#10B981' },
  { name: 'Finance', value: 20, color: '#F59E0B' },
  { name: 'Manufacturing', value: 15, color: '#EF4444' },
  { name: 'Other', value: 5, color: '#8B5CF6' }
];

// Revenue data for the moved metrics
const revenueData = [
  { month: 'Jan', revenue: 32000, leads: 45, deals: 12 },
  { month: 'Feb', revenue: 28000, leads: 38, deals: 10 },
  { month: 'Mar', revenue: 35000, leads: 52, deals: 15 },
  { month: 'Apr', revenue: 42000, leads: 61, deals: 18 },
  { month: 'May', revenue: 38000, leads: 55, deals: 14 },
  { month: 'Jun', revenue: 45000, leads: 68, deals: 20 },
  { month: 'Jul', revenue: 52000, leads: 72, deals: 22 },
  { month: 'Aug', revenue: 48000, leads: 65, deals: 19 },
  { month: 'Sep', revenue: 55000, leads: 78, deals: 25 },
  { month: 'Oct', revenue: 62000, leads: 85, deals: 28 },
  { month: 'Nov', revenue: 58000, leads: 79, deals: 24 },
  { month: 'Dec', revenue: 65000, leads: 92, deals: 30 }
];

// Linear regression for forecasting
function linearRegression(data: { x: number; y: number }[]) {
  const n = data.length;
  const sumX = data.reduce((sum, d) => sum + d.x, 0);
  const sumY = data.reduce((sum, d) => sum + d.y, 0);
  const sumXY = data.reduce((sum, d) => sum + d.x * d.y, 0);
  const sumX2 = data.reduce((sum, d) => sum + d.x * d.x, 0);
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  return { slope, intercept };
}

// Prepare data for forecasting
const months = monthlyTrends.map((d, i) => ({ x: i + 1, y: d.revenue }));
const leadsMonths = monthlyTrends.map((d, i) => ({ x: i + 1, y: d.leads }));
const revenueReg = linearRegression(months);
const leadsReg = linearRegression(leadsMonths);
const nextMonth = months.length + 1;
const predictedRevenue = revenueReg.slope * nextMonth + revenueReg.intercept;
const predictedLeads = leadsReg.slope * nextMonth + leadsReg.intercept;
const forecastData = [
  ...monthlyTrends.map((d, i) => ({ month: d.month, revenue: d.revenue, leads: d.leads, predicted: null })),
  { month: 'Next', revenue: null, leads: null, predicted: Math.round(predictedRevenue), predictedLeads: Math.round(predictedLeads) }
];

// Top performer
const topPerformer = performanceData.reduce((top, curr) => curr.closed > top.closed ? curr : top, performanceData[0]);

// Customer Segmentation mock data
const customerSegments = [
  { type: 'New', value: 120, color: '#3B82F6' },
  { type: 'Returning', value: 80, color: '#10B981' },
  { type: 'VIP', value: 30, color: '#F59E0B' },
  { type: 'Churned', value: 15, color: '#EF4444' }
];

// Activity Heatmap mock data (days x hours)
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const hours = [9, 10, 11, 12, 13, 14, 15, 16, 17];
const activityHeatmap = days.map(day =>
  hours.map(hour => ({ day, hour, value: Math.floor(Math.random() * 10) }))
).flat();

export const Reports: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedReport, setSelectedReport] = useState('overview');
  const [isExporting, setIsExporting] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Calculate moved revenue metrics
  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
  const avgMonthlyRevenue = totalRevenue / revenueData.length;
  const currentMonthRevenue = revenueData[revenueData.length - 1].revenue;
  const revenueGrowth = ((currentMonthRevenue - avgMonthlyRevenue) / avgMonthlyRevenue * 100).toFixed(1);
  
  const totalLeads = revenueData.reduce((sum, item) => sum + item.leads, 0);
  const totalDeals = revenueData.reduce((sum, item) => sum + item.deals, 0);
  const conversionRate = ((totalDeals / totalLeads) * 100).toFixed(1);

  const totalReportRevenue = monthlyTrends.reduce((sum, item) => sum + item.revenue, 0);
  const totalReportLeads = monthlyTrends.reduce((sum, item) => sum + item.leads, 0);
  const totalReportClosed = monthlyTrends.reduce((sum, item) => sum + item.closed, 0);
  const reportConversionRate = ((totalReportClosed / totalReportLeads) * 100).toFixed(1);

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      // Simulate PDF export
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create a mock PDF download
      const reportData = {
        period: selectedPeriod,
        report: selectedReport,
        totalRevenue,
        totalLeads,
        totalDeals,
        conversionRate,
        generatedAt: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sales_report_${selectedPeriod}_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('PDF exported successfully!');
    } catch (error) {
      toast.error('Failed to export PDF');
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = async () => {
    setIsPrinting(true);
    try {
      // Simulate print functionality
      await new Promise(resolve => setTimeout(resolve, 1000));
      window.print();
      toast.success('Print dialog opened!');
    } catch (error) {
      toast.error('Failed to open print dialog');
    } finally {
      setIsPrinting(false);
    }
  };

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Report generated successfully!');
    } catch (error) {
      toast.error('Failed to generate report');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRefresh = () => {
    toast.success('Data refreshed successfully!');
  };

  const handleScheduleFollowUp = () => {
    toast.success('Redirecting to Follow-ups page...');
    setTimeout(() => navigate('/followups'), 1000);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'performance', label: 'Performance', icon: TrendingUp },
    { id: 'analytics', label: 'Analytics', icon: PieChartIcon },
    { id: 'export', label: 'Export', icon: DownloadIcon }
  ];

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Moved Revenue Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue (YTD)</p>
                <p className="text-2xl font-bold text-foreground dark:text-white">
                  ${totalRevenue.toLocaleString()}
                </p>
              </div>
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Monthly Revenue</p>
                <p className="text-2xl font-bold text-foreground dark:text-white">
                  ${avgMonthlyRevenue.toLocaleString()}
                </p>
              </div>
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg">
                <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Revenue Growth</p>
                <p className="text-2xl font-bold text-foreground dark:text-white">
                  {revenueGrowth}%
                </p>
              </div>
              <div className="p-2 bg-amber-100 dark:bg-amber-900/20 rounded-lg">
                <Activity className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
                <p className="text-2xl font-bold text-foreground dark:text-white">
                  {conversionRate}%
                </p>
              </div>
              <div className="p-2 bg-rose-100 dark:bg-rose-900/20 rounded-lg">
                <Target className="h-5 w-5 text-rose-600 dark:text-rose-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performer Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-border shadow-lg bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900/40 dark:to-blue-800/20">
          <CardContent className="p-6 flex items-center">
            <div className="flex-1">
              <h2 className="text-lg font-bold text-blue-700 dark:text-blue-300 mb-1">Top Performing Salesperson</h2>
              <p className="text-2xl font-bold text-foreground dark:text-white">{topPerformer.name}</p>
              <div className="flex gap-6 mt-2">
                <span className="text-sm text-muted-foreground">Leads: <span className="font-semibold text-blue-600 dark:text-blue-400">{topPerformer.leads}</span></span>
                <span className="text-sm text-muted-foreground">Closed: <span className="font-semibold text-green-600 dark:text-green-400">{topPerformer.closed}</span></span>
                <span className="text-sm text-muted-foreground">Revenue: <span className="font-semibold text-emerald-600 dark:text-emerald-400">${topPerformer.revenue.toLocaleString()}</span></span>
              </div>
            </div>
            <Award className="h-12 w-12 text-yellow-500 ml-4" />
          </CardContent>
        </Card>
        {/* Forecasting Chart */}
        <Card className="border-border shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground dark:text-white">Forecasting (Next Month)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={forecastData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                  <XAxis dataKey="month" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(17, 24, 39, 0.95)', border: '1px solid #374151', borderRadius: '8px', color: '#f9fafb' }} />
                  <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 4 }} name="Actual Revenue" />
                  <Line type="monotone" dataKey="predicted" stroke="#f59e42" strokeDasharray="5 5" strokeWidth={2} dot={{ fill: '#f59e42', r: 6 }} name="Predicted Revenue" />
                  <Line type="monotone" dataKey="leads" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 4 }} name="Actual Leads" />
                  <Line type="monotone" dataKey="predictedLeads" stroke="#e11d48" strokeDasharray="5 5" strokeWidth={2} dot={{ fill: '#e11d48', r: 6 }} name="Predicted Leads" />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              <span>Next Month Revenue: <span className="font-semibold text-blue-600 dark:text-blue-400">${Math.round(predictedRevenue).toLocaleString()}</span></span>
              <span className="ml-6">Leads: <span className="font-semibold text-green-600 dark:text-green-400">{Math.round(predictedLeads)}</span></span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderPerformanceTab = () => {
    console.log('Conversion Data:', conversionData);
    return (
      <div className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-border shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold text-foreground dark:text-white">
                    ${(totalReportRevenue / 1000000).toFixed(1)}M
                  </p>
                  <p className="text-sm text-green-600">+12.5% from last period</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-border shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Leads</p>
                  <p className="text-2xl font-bold text-foreground dark:text-white">{totalReportLeads}</p>
                  <p className="text-sm text-blue-600">+8.3% from last period</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-border shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Closed Deals</p>
                  <p className="text-2xl font-bold text-foreground dark:text-white">{totalReportClosed}</p>
                  <p className="text-sm text-purple-600">+15.2% from last period</p>
                </div>
                <Target className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-border shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Conversion Rate</p>
                  <p className="text-2xl font-bold text-foreground dark:text-white">{reportConversionRate}%</p>
                  <p className="text-sm text-orange-600">+2.1% from last period</p>
                </div>
                <Award className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance Chart */}
          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-foreground dark:text-white">
                Team Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                    <XAxis 
                      dataKey="name" 
                      stroke="#6b7280" 
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      stroke="#6b7280" 
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(17, 24, 39, 0.95)',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#f9fafb'
                      }}
                    />
                    <Bar dataKey="leads" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="closed" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Conversion Funnel */}
          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-foreground dark:text-white">
                Conversion Funnel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                {conversionData && conversionData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={conversionData} layout="horizontal" margin={{ left: 100, right: 20, top: 20, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                      <XAxis 
                        type="number"
                        stroke="#6b7280" 
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${value}%`}
                        domain={[0, 100]}
                      />
                      <YAxis 
                        type="category"
                        dataKey="stage"
                        stroke="#6b7280" 
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        width={80}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(17, 24, 39, 0.95)',
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#f9fafb'
                        }}
                        formatter={(value: any, name: any, props: any) => [
                          `${value}% (${props.payload.count} leads)`, 
                          props.payload.stage
                        ]}
                        labelStyle={{ color: '#f9fafb' }}
                      />
                      <Bar 
                        dataKey="percentage" 
                        radius={[0, 4, 4, 0]}
                      >
                        {conversionData.map((entry, index) => (
                          <Cell key={`cell-funnel-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </RechartsBarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <p>No conversion data available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const renderAnalyticsTab = () => (
    <div className="space-y-6">
      {/* Customer Segmentation & Activity Heatmap */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Customer Segmentation Pie Chart */}
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground dark:text-white">Customer Segmentation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72 flex flex-col items-center justify-center">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={customerSegments}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ type, percent }) => `${type} ${((percent ?? 0) * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {customerSegments.map((entry, index) => (
                      <Cell key={`cell-seg-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: 'rgba(17, 24, 39, 0.95)', border: '1px solid #374151', borderRadius: '8px', color: '#f9fafb' }}
                    formatter={(value, name, props) => [`${value}`, props.payload.type]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        {/* Activity Heatmap */}
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground dark:text-white">Activity Heatmap</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full text-center">
                <thead>
                  <tr>
                    <th className="p-1"></th>
                    {hours.map(h => (
                      <th key={h} className="p-1 text-xs font-medium text-muted-foreground">{h}:00</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {days.map(day => (
                    <tr key={day}>
                      <td className="p-1 text-xs font-medium text-muted-foreground">{day}</td>
                      {hours.map(hour => {
                        const cell = activityHeatmap.find(a => a.day === day && a.hour === hour);
                        const intensity = cell ? Math.min(1, cell.value / 10) : 0;
                        const bg = `rgba(59, 130, 246, ${intensity})`;
                        return (
                          <td key={hour} className="p-1">
                            <div style={{ background: bg, borderRadius: 4, width: 24, height: 24, display: 'inline-block', color: intensity > 0.5 ? '#fff' : '#222', fontWeight: 600 }}>
                              {cell?.value || 0}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground dark:text-white">
              Monthly Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                  <XAxis 
                    dataKey="month" 
                    stroke="#6b7280" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="#6b7280" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(17, 24, 39, 0.95)',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#f9fafb'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="leads" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="closed" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Industry Distribution */}
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground dark:text-white">
              Industry Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={industryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {industryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(17, 24, 39, 0.95)',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#f9fafb'
                    }}
                    formatter={(value: any, name: any) => [`${value}%`, name]}
                    labelStyle={{ color: '#f9fafb' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderExportTab = () => (
    <div className="space-y-6">
      {/* Report Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer" onClick={handleGenerateReport}>
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl w-fit mx-auto mb-4">
              <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-foreground dark:text-white mb-2">Generate Report</h3>
            <p className="text-sm text-muted-foreground">
              Create detailed performance report
            </p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer" onClick={handleRefresh}>
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/20 rounded-xl w-fit mx-auto mb-4">
              <Clock className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="font-semibold text-foreground dark:text-white mb-2">Refresh Data</h3>
            <p className="text-sm text-muted-foreground">
              Update with latest metrics
            </p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer" onClick={handleScheduleFollowUp}>
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-amber-100 dark:bg-amber-900/20 rounded-xl w-fit mx-auto mb-4">
              <Calendar className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="font-semibold text-foreground dark:text-white mb-2">Schedule Follow-up</h3>
            <p className="text-sm text-muted-foreground">
              Set up follow-up meetings
            </p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer" onClick={handleExportPDF}>
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-rose-100 dark:bg-rose-900/20 rounded-xl w-fit mx-auto mb-4">
              <Download className="h-6 w-6 text-rose-600 dark:text-rose-400" />
            </div>
            <h3 className="font-semibold text-foreground dark:text-white mb-2">Export Report</h3>
            <p className="text-sm text-muted-foreground">
              Download as PDF
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Export Options */}
      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground dark:text-white">Export Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2" onClick={handleExportPDF}>
              <Download className="h-6 w-6" />
              <span>Export PDF</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2" onClick={handlePrint}>
              <Printer className="h-6 w-6" />
              <span>Print Report</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2" onClick={handleRefresh}>
              <Settings className="h-6 w-6" />
              <span>Configure</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground dark:text-white">Reports & Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive insights into your sales performance and team metrics
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <Button variant="outline" onClick={handlePrint} isLoading={isPrinting}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button onClick={handleExportPDF} isLoading={isExporting}>
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'performance' && renderPerformanceTab()}
        {activeTab === 'analytics' && renderAnalyticsTab()}
        {activeTab === 'export' && renderExportTab()}
      </div>
    </div>
  );
};
