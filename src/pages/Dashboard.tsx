import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { 
  TrendingUp, 
  Users, 
  Building2, 
  Calendar, 
  DollarSign, 
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react';
import { motion } from 'framer-motion';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const stats = [
  {
    title: 'Total Leads',
    value: '1,234',
    change: '+12.5%',
    changeType: 'positive' as const,
    icon: Users,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/20'
  },
  {
    title: 'Active Companies',
    value: '89',
    change: '+8.2%',
    changeType: 'positive' as const,
    icon: Building2,
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-100 dark:bg-emerald-900/20'
  },
  {
    title: 'Revenue This Month',
    value: '$45,678',
    change: '+23.1%',
    changeType: 'positive' as const,
    icon: DollarSign,
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-100 dark:bg-amber-900/20'
  },
  {
    title: 'Conversion Rate',
    value: '12.4%',
    change: '-2.1%',
    changeType: 'negative' as const,
    icon: Target,
    color: 'text-rose-600 dark:text-rose-400',
    bgColor: 'bg-rose-100 dark:bg-rose-900/20'
  }
];

// Mock revenue data for the last 12 months
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

// Mock lead conversion data for pie chart
const leadConversionData = [
  { name: 'Prospects', value: 1240, color: '#3B82F6' },
  { name: 'Qualified', value: 868, color: '#10B981' },
  { name: 'Proposal', value: 434, color: '#F59E0B' },
  { name: 'Negotiation', value: 217, color: '#EF4444' },
  { name: 'Closed Won', value: 130, color: '#8B5CF6' }
];

const recentActivities = [
  {
    id: 1,
    type: 'lead',
    message: 'New lead added: John Smith from TechCorp',
    time: '2 minutes ago',
    icon: Users,
    color: 'text-blue-600 dark:text-blue-400'
  },
  {
    id: 2,
    type: 'company',
    message: 'Company updated: StartupXYZ contact information',
    time: '15 minutes ago',
    icon: Building2,
    color: 'text-emerald-600 dark:text-emerald-400'
  },
  {
    id: 3,
    type: 'followup',
    message: 'Follow-up scheduled: Meeting with Enterprise Ltd',
    time: '1 hour ago',
    icon: Calendar,
    color: 'text-amber-600 dark:text-amber-400'
  },
  {
    id: 4,
    type: 'revenue',
    message: 'Deal closed: $12,500 contract signed',
    time: '3 hours ago',
    icon: DollarSign,
    color: 'text-rose-600 dark:text-rose-400'
  }
];

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [chartType, setChartType] = useState<'area' | 'line' | 'bar'>('area');
  const [selectedPeriod, setSelectedPeriod] = useState<'6m' | '12m'>('12m');

  // Filter data based on selected period
  const filteredRevenueData = selectedPeriod === '6m' 
    ? revenueData.slice(-6) 
    : revenueData;

  // Quick action handlers
  const handleAddLead = () => {
    toast.success('Redirecting to Leads page...');
    setTimeout(() => navigate('/leads'), 1000);
  };

  const handleAddCompany = () => {
    toast.success('Redirecting to Companies page...');
    setTimeout(() => navigate('/companies'), 1000);
  };

  const handleScheduleFollowUp = () => {
    toast.success('Redirecting to Follow-ups page...');
    setTimeout(() => navigate('/followups'), 1000);
  };

  const handleViewReports = () => {
    toast.success('Redirecting to Reports page...');
    setTimeout(() => navigate('/reports'), 1000);
  };

  const handleViewAllActivities = () => {
    toast.success('Redirecting to Reports page...');
    setTimeout(() => navigate('/reports'), 1000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground dark:text-white">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back! Here's what's happening with your business today.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer" onClick={handleAddLead}>
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl w-fit mx-auto mb-4">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-foreground dark:text-white mb-2">Add New Lead</h3>
            <p className="text-sm text-muted-foreground">
              Create a new lead entry
            </p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer" onClick={handleAddCompany}>
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/20 rounded-xl w-fit mx-auto mb-4">
              <Building2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="font-semibold text-foreground dark:text-white mb-2">Add Company</h3>
            <p className="text-sm text-muted-foreground">
              Register a new company
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
              Set up a follow-up meeting
            </p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer" onClick={handleViewReports}>
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-rose-100 dark:bg-rose-900/20 rounded-xl w-fit mx-auto mb-4">
              <BarChart3 className="h-6 w-6 text-rose-600 dark:text-rose-400" />
            </div>
            <h3 className="font-semibold text-foreground dark:text-white mb-2">View Reports</h3>
            <p className="text-sm text-muted-foreground">
              Check performance metrics
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-border shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-foreground dark:text-white mt-1">
                      {stat.value}
                    </p>
                    <div className="flex items-center mt-2">
                      {stat.changeType === 'positive' ? (
                        <ArrowUpRight className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mr-1" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-rose-600 dark:text-rose-400 mr-1" />
                      )}
                      <span className={`text-sm font-medium ${
                        stat.changeType === 'positive' 
                          ? 'text-emerald-600 dark:text-emerald-400' 
                          : 'text-rose-600 dark:text-rose-400'
                      }`}>
                        {stat.change}
                      </span>
                      <span className="text-sm text-muted-foreground ml-1">
                        from last month
                      </span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts and Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2">
          <Card className="border-border shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-foreground dark:text-white">
                  Revenue Overview
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="flex rounded-lg border border-gray-300 dark:border-gray-600 p-1">
                    <button
                      onClick={() => setSelectedPeriod('6m')}
                      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                        selectedPeriod === '6m' 
                          ? 'bg-blue-600 text-white' 
                          : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
                      }`}
                    >
                      6M
                    </button>
                    <button
                      onClick={() => setSelectedPeriod('12m')}
                      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                        selectedPeriod === '12m' 
                          ? 'bg-blue-600 text-white' 
                          : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
                      }`}
                    >
                      12M
                    </button>
                  </div>
                  <div className="flex rounded-lg border border-gray-300 dark:border-gray-600 p-1">
                    <button
                      onClick={() => setChartType('area')}
                      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                        chartType === 'area' 
                          ? 'bg-blue-600 text-white' 
                          : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
                      }`}
                    >
                      Area
                    </button>
                    <button
                      onClick={() => setChartType('line')}
                      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                        chartType === 'line' 
                          ? 'bg-blue-600 text-white' 
                          : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
                      }`}
                    >
                      Line
                    </button>
                    <button
                      onClick={() => setChartType('bar')}
                      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                        chartType === 'bar' 
                          ? 'bg-blue-600 text-white' 
                          : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
                      }`}
                    >
                      Bar
                    </button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === 'area' ? (
                    <AreaChart data={filteredRevenueData}>
                      <defs>
                        <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
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
                        tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(17, 24, 39, 0.95)',
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#f9fafb'
                        }}
                        formatter={(value: any) => [`$${value.toLocaleString()}`, 'Revenue']}
                        labelStyle={{ color: '#f9fafb' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        fill="url(#revenueGradient)"
                      />
                    </AreaChart>
                  ) : chartType === 'line' ? (
                    <RechartsLineChart data={filteredRevenueData}>
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
                        tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(17, 24, 39, 0.95)',
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#f9fafb'
                        }}
                        formatter={(value: any) => [`$${value.toLocaleString()}`, 'Revenue']}
                        labelStyle={{ color: '#f9fafb' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                      />
                    </RechartsLineChart>
                  ) : (
                    <BarChart data={filteredRevenueData}>
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
                        tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(17, 24, 39, 0.95)',
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#f9fafb'
                        }}
                        formatter={(value: any) => [`$${value.toLocaleString()}`, 'Revenue']}
                        labelStyle={{ color: '#f9fafb' }}
                      />
                      <Bar 
                        dataKey="revenue" 
                        fill="#3b82f6" 
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities */}
        <div>
          <Card className="border-border shadow-sm h-full">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-foreground dark:text-white">
                Recent Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className={`p-2 rounded-lg bg-muted/50 ${activity.color}`}>
                      <activity.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground leading-relaxed">
                        {activity.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4 border-border" onClick={handleViewAllActivities}>
                View All Activities
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Additional Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lead Conversion Chart - Now Pie Chart */}
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground dark:text-white">
              Lead Conversion Funnel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={leadConversionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {leadConversionData.map((entry, index) => (
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
                    formatter={(value: any, name: any) => [value, name]}
                    labelStyle={{ color: '#f9fafb' }}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Performance */}
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground dark:text-white">
              Monthly Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={filteredRevenueData}>
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
                    formatter={(value: any, name: any) => [value, name === 'leads' ? 'Leads' : 'Deals']}
                    labelStyle={{ color: '#f9fafb' }}
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
                    dataKey="deals" 
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
      </div>

    </div>
  );
};
