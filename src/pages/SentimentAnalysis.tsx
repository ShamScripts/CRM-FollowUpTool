import { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { 
  Heart, 
  MessageSquare, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  BarChart3,
  Filter,
  Calendar,
  User,
  Building2,
  AlertCircle,
  CheckCircle,
  Clock,
  Target
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import toast from 'react-hot-toast';

interface SentimentData {
  id: string;
  leadName: string;
  companyName: string;
  feedback: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  confidence: number;
  date: Date;
  source: 'call' | 'email' | 'meeting' | 'survey';
  suggestedAction: string;
  keywords: string[];
}

const mockSentimentData: SentimentData[] = [
  {
    id: '1',
    leadName: 'John Smith',
    companyName: 'TechCorp Solutions',
    feedback: 'The demo was fantastic! Your solution exactly addresses our pain points. The team is excited to move forward.',
    sentiment: 'positive',
    confidence: 0.92,
    date: new Date('2024-01-25T10:30:00'),
    source: 'call',
    suggestedAction: 'Send proposal immediately',
    keywords: ['fantastic', 'excited', 'move forward', 'addresses pain points']
  },
  {
    id: '2',
    leadName: 'Sarah Johnson',
    companyName: 'StartupXYZ',
    feedback: 'The pricing seems quite high for our current budget. We need to think about it more.',
    sentiment: 'negative',
    confidence: 0.78,
    date: new Date('2024-01-24T14:15:00'),
    source: 'email',
    suggestedAction: 'Offer alternative pricing or starter package',
    keywords: ['pricing high', 'budget', 'think about it']
  },
  {
    id: '3',
    leadName: 'Mike Davis',
    companyName: 'Enterprise Ltd',
    feedback: 'The features look good, but we need to evaluate a few more options before making a decision.',
    sentiment: 'neutral',
    confidence: 0.85,
    date: new Date('2024-01-23T16:45:00'),
    source: 'meeting',
    suggestedAction: 'Provide competitive analysis and follow up in 1 week',
    keywords: ['features good', 'evaluate options', 'decision']
  },
  {
    id: '4',
    leadName: 'Lisa Chen',
    companyName: 'Innovation Inc',
    feedback: 'This is exactly what we\'ve been looking for! When can we start the implementation?',
    sentiment: 'positive',
    confidence: 0.95,
    date: new Date('2024-01-22T11:20:00'),
    source: 'survey',
    suggestedAction: 'Schedule implementation kickoff meeting',
    keywords: ['exactly looking for', 'start implementation']
  },
  {
    id: '5',
    leadName: 'Tom Wilson',
    companyName: 'Global Corp',
    feedback: 'I\'m not convinced this will work for our complex setup. Too many unknowns.',
    sentiment: 'negative',
    confidence: 0.88,
    date: new Date('2024-01-21T09:15:00'),
    source: 'call',
    suggestedAction: 'Schedule technical deep-dive session',
    keywords: ['not convinced', 'complex setup', 'unknowns']
  }
];

const sentimentTrends = [
  { date: '2024-01-15', positive: 12, neutral: 8, negative: 3 },
  { date: '2024-01-16', positive: 15, neutral: 6, negative: 4 },
  { date: '2024-01-17', positive: 18, neutral: 9, negative: 2 },
  { date: '2024-01-18', positive: 14, neutral: 11, negative: 5 },
  { date: '2024-01-19', positive: 20, neutral: 7, negative: 3 },
  { date: '2024-01-20', positive: 16, neutral: 10, negative: 6 },
  { date: '2024-01-21', positive: 22, neutral: 8, negative: 4 }
];

const sentimentDistribution = [
  { name: 'Positive', value: 65, color: '#10B981' },
  { name: 'Neutral', value: 25, color: '#F59E0B' },
  { name: 'Negative', value: 10, color: '#EF4444' }
];

export const SentimentAnalysis: React.FC = () => {
  const [sentimentData] = useState<SentimentData[]>(mockSentimentData);
  const [selectedSentiment, setSelectedSentiment] = useState('all');
  const [selectedSource, setSelectedSource] = useState('all');
  const [inputText, setInputText] = useState('');
  const [analyzedSentiment, setAnalyzedSentiment] = useState<{
    sentiment: 'positive' | 'neutral' | 'negative';
    confidence: number;
    suggestedAction: string;
  } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const filteredData = sentimentData.filter(item => {
    const matchesSentiment = selectedSentiment === 'all' || item.sentiment === selectedSentiment;
    const matchesSource = selectedSource === 'all' || item.source === selectedSource;
    return matchesSentiment && matchesSource;
  });

  const analyzeSentiment = async () => {
    if (!inputText.trim()) return;
    
    setIsAnalyzing(true);
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock sentiment analysis result
    const sentiments = ['positive', 'neutral', 'negative'] as const;
    const randomSentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
    const confidence = Math.random() * 0.3 + 0.7; // 0.7 to 1.0
    
    const actions = {
      positive: 'Schedule follow-up meeting to close the deal',
      neutral: 'Provide additional information and schedule demo',
      negative: 'Address concerns and offer alternative solutions'
    };
    
    setAnalyzedSentiment({
      sentiment: randomSentiment,
      confidence,
      suggestedAction: actions[randomSentiment]
    });
    setIsAnalyzing(false);
  };

  const generateReport = async () => {
    setIsGeneratingReport(true);
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create a mock report download
      const reportData = {
        totalFeedback: sentimentData.length,
        positiveCount,
        neutralCount,
        negativeCount,
        avgConfidence,
        generatedAt: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sentiment_report_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('Report generated and downloaded successfully!');
    } catch (error) {
      toast.error('Failed to generate report');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    const icons = {
      positive: TrendingUp,
      neutral: Minus,
      negative: TrendingDown
    };
    return icons[sentiment as keyof typeof icons] || Minus;
  };

  const getSentimentColor = (sentiment: string) => {
    const colors = {
      positive: 'text-green-600',
      neutral: 'text-yellow-600',
      negative: 'text-red-600'
    };
    return colors[sentiment as keyof typeof colors] || 'text-gray-600';
  };

  const getSentimentBg = (sentiment: string) => {
    const colors = {
      positive: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      neutral: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      negative: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
    };
    return colors[sentiment as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getSourceIcon = (source: string) => {
    const icons = {
      call: MessageSquare,
      email: MessageSquare,
      meeting: User,
      survey: BarChart3
    };
    return icons[source as keyof typeof icons] || MessageSquare;
  };

  const positiveCount = sentimentData.filter(item => item.sentiment === 'positive').length;
  const neutralCount = sentimentData.filter(item => item.sentiment === 'neutral').length;
  const negativeCount = sentimentData.filter(item => item.sentiment === 'negative').length;
  const avgConfidence = (sentimentData.reduce((sum, item) => sum + item.confidence, 0) / sentimentData.length * 100).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sentiment Analysis</h1>
          <p className="text-gray-600 dark:text-white">
            Analyze customer feedback and emotions to improve your sales approach
          </p>
        </div>
        <Button variant="primary" onClick={generateReport} isLoading={isGeneratingReport}>
          <Target className="h-4 w-4 mr-2" />
          Generate Report
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-white">Positive</p>
              <p className="text-2xl font-bold text-green-600">{positiveCount}</p>
              <p className="text-xs text-gray-500">{((positiveCount / sentimentData.length) * 100).toFixed(1)}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-white">Neutral</p>
              <p className="text-2xl font-bold text-yellow-600">{neutralCount}</p>
              <p className="text-xs text-gray-500">{((neutralCount / sentimentData.length) * 100).toFixed(1)}%</p>
            </div>
            <Minus className="h-8 w-8 text-yellow-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-white">Negative</p>
              <p className="text-2xl font-bold text-red-600">{negativeCount}</p>
              <p className="text-xs text-gray-500">{((negativeCount / sentimentData.length) * 100).toFixed(1)}%</p>
            </div>
            <TrendingDown className="h-8 w-8 text-red-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-white">Avg Confidence</p>
              <p className="text-2xl font-bold text-blue-600">{avgConfidence}%</p>
            </div>
            <CheckCircle className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
      </div>

      {/* Sentiment Analyzer */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Analyze New Feedback
        </h3>
        <div className="space-y-4">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter customer feedback, email content, or call notes to analyze sentiment..."
            className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
          />
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">
              {inputText.length}/500 characters
            </span>
            <Button 
              variant="primary" 
              onClick={analyzeSentiment}
              isLoading={isAnalyzing}
              disabled={!inputText.trim()}
            >
              <Heart className="h-4 w-4 mr-2" />
              Analyze Sentiment
            </Button>
          </div>
        </div>

        {analyzedSentiment && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-lg border border-blue-200 dark:border-blue-800"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-gray-900 dark:text-white">Analysis Result</span>
              </div>
              <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getSentimentBg(analyzedSentiment.sentiment)}`}>
                {analyzedSentiment.sentiment.charAt(0).toUpperCase() + analyzedSentiment.sentiment.slice(1)}
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Confidence:</span>
                <span className="font-medium">{(analyzedSentiment.confidence * 100).toFixed(1)}%</span>
              </div>
              <div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Suggested Action:</span>
                <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                  {analyzedSentiment.suggestedAction}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Sentiment Trends
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={sentimentTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
              <YAxis />
              <Tooltip labelFormatter={(value) => new Date(value).toLocaleDateString()} />
              <Area type="monotone" dataKey="positive" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
              <Area type="monotone" dataKey="neutral" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.6} />
              <Area type="monotone" dataKey="negative" stackId="1" stroke="#EF4444" fill="#EF4444" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Sentiment Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={sentimentDistribution}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
              >
                {sentimentDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex gap-4">
          <select
            value={selectedSentiment}
            onChange={(e) => setSelectedSentiment(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="all">All Sentiments</option>
            <option value="positive">Positive</option>
            <option value="neutral">Neutral</option>
            <option value="negative">Negative</option>
          </select>
          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="all">All Sources</option>
            <option value="call">Calls</option>
            <option value="email">Emails</option>
            <option value="meeting">Meetings</option>
            <option value="survey">Surveys</option>
          </select>
        </div>
      </Card>

      {/* Feedback List */}
      <div className="space-y-4">
        {filteredData.map((item, index) => {
          const SentimentIcon = getSentimentIcon(item.sentiment);
          const SourceIcon = getSourceIcon(item.source);
          
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card hover className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                      <SourceIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {item.leadName}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {item.companyName}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getSentimentBg(item.sentiment)}`}>
                      <SentimentIcon className="h-3 w-3 mr-1" />
                      {item.sentiment}
                    </span>
                    <span className="text-sm text-gray-500">
                      {(item.confidence * 100).toFixed(0)}% confidence
                    </span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    "{item.feedback}"
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {item.date.toLocaleDateString()}
                    </span>
                    <span className="capitalize">{item.source}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-blue-600 font-medium">
                      {item.suggestedAction}
                    </span>
                  </div>
                </div>
                
                {item.keywords.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex flex-wrap gap-2">
                      {item.keywords.map((keyword, keyIndex) => (
                        <span
                          key={keyIndex}
                          className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 rounded"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
