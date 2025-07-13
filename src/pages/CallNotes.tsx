import { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { 
  Phone, 
  Upload, 
  Play, 
  Pause, 
  Download, 
  FileAudio, 
  MessageSquare, 
  Copy,
  Mic,
  Clock,
  User,
  Building2,
  Star,
  Search,
  Filter,
  Trash2,
  Edit
} from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface CallNote {
  id: string;
  leadName: string;
  companyName: string;
  duration: number;
  date: Date;
  audioUrl?: string;
  transcript?: string;
  keyPoints: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  rating: number;
  summary: string;
  nextSteps: string[];
}

const mockCallNotes: CallNote[] = [
  {
    id: '1',
    leadName: 'John Smith',
    companyName: 'TechCorp Solutions',
    duration: 1245, // seconds
    date: new Date('2024-01-25T10:30:00'),
    transcript: 'Thank you for taking the time to speak with me today. I wanted to discuss our enterprise solution and how it can help streamline your operations. We\'ve been working with companies similar to yours and have seen significant improvements in efficiency.',
    keyPoints: [
      'Interested in enterprise solution',
      'Current system causing inefficiencies',
      'Budget approved for Q2',
      'Decision maker identified'
    ],
    sentiment: 'positive',
    rating: 4,
    summary: 'Productive call with strong interest in enterprise solution. Budget approved for Q2 implementation.',
    nextSteps: [
      'Send detailed proposal by Friday',
      'Schedule demo for next week',
      'Connect with technical team'
    ]
  },
  {
    id: '2',
    leadName: 'Sarah Johnson',
    companyName: 'StartupXYZ',
    duration: 892,
    date: new Date('2024-01-24T14:15:00'),
    transcript: 'I appreciate the call, but I\'m not sure if this is the right fit for our current needs. We\'re a small startup and the pricing seems quite high for our budget.',
    keyPoints: [
      'Price sensitivity due to startup budget',
      'Interested in basic features only',
      'May revisit in 6 months',
      'Recommended by existing customer'
    ],
    sentiment: 'neutral',
    rating: 2,
    summary: 'Price-sensitive prospect. May be better fit for starter package or future opportunity.',
    nextSteps: [
      'Send starter package information',
      'Follow up in 6 months',
      'Provide case studies for similar startups'
    ]
  },
  {
    id: '3',
    leadName: 'Mike Davis',
    companyName: 'Enterprise Ltd',
    duration: 1567,
    date: new Date('2024-01-23T16:45:00'),
    transcript: 'This looks exactly like what we need. Our current solution is outdated and causing major bottlenecks. When can we get started?',
    keyPoints: [
      'Urgent need for replacement',
      'Current system failing',
      'Ready to move forward quickly',
      'Large implementation scope'
    ],
    sentiment: 'positive',
    rating: 5,
    summary: 'Excellent prospect with urgent need. Ready to proceed with large implementation.',
    nextSteps: [
      'Prepare contract and SOW',
      'Schedule implementation kickoff',
      'Introduce to customer success team'
    ]
  }
];

export const CallNotes: React.FC = () => {
  const [callNotes, setCallNotes] = useState<CallNote[]>(mockCallNotes);
  const [selectedCall, setSelectedCall] = useState<CallNote | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSentiment, setSelectedSentiment] = useState('all');
  const [isRecording, setIsRecording] = useState(false);

  const filteredCalls = callNotes.filter(call => {
    const matchesSearch = call.leadName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         call.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         call.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSentiment = selectedSentiment === 'all' || call.sentiment === selectedSentiment;
    return matchesSearch && matchesSentiment;
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    // Simulate upload process
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsUploading(false);
    
    setIsTranscribing(true);
    // Simulate transcription process
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsTranscribing(false);
  };

  const handleRecordCall = async () => {
    setIsRecording(true);
    try {
      // Simulate call recording
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Create a mock call note
      const newCallNote: CallNote = {
        id: Date.now().toString(),
        leadName: 'New Recorded Call',
        companyName: 'Unknown Company',
        duration: Math.floor(Math.random() * 1800) + 300, // 5-35 minutes
        date: new Date(),
        keyPoints: [
          'Discussed product features',
          'Addressed pricing concerns',
          'Scheduled follow-up meeting'
        ],
        sentiment: ['positive', 'neutral', 'negative'][Math.floor(Math.random() * 3)] as any,
        rating: Math.floor(Math.random() * 3) + 3, // 3-5 stars
        summary: 'Productive call with good engagement. Customer showed interest in our solution.',
        nextSteps: [
          'Send follow-up email with proposal',
          'Schedule demo for next week'
        ]
      };
      
      setCallNotes([newCallNote, ...callNotes]);
      setSelectedCall(newCallNote);
      toast.success('Call recorded successfully!');
    } catch (error) {
      toast.error('Failed to record call');
    } finally {
      setIsRecording(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getSentimentColor = (sentiment: string) => {
    const colors = {
      positive: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      neutral: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      negative: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
    };
    return colors[sentiment as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getSentimentIcon = (sentiment: string) => {
    if (sentiment === 'positive') return '😊';
    if (sentiment === 'negative') return '😞';
    return '😐';
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Call Notes</h1>
          <p className="text-gray-600 dark:text-white">
            Upload, transcribe, and analyze your sales calls with AI insights
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <input
            type="file"
            accept=".mp3,.wav,.m4a"
            onChange={handleFileUpload}
            className="hidden"
            id="audio-upload"
          />
          <label htmlFor="audio-upload">
            <Button variant="outline" isLoading={isUploading || isTranscribing}>
              <Upload className="h-4 w-4 mr-2" />
              {isUploading ? 'Uploading...' : isTranscribing ? 'Transcribing...' : 'Upload Audio'}
            </Button>
          </label>
          <Button variant="primary" onClick={handleRecordCall} isLoading={isRecording}>
            <Mic className="h-4 w-4 mr-2" />
            Record Call
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Calls</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{callNotes.length}</p>
            </div>
            <Phone className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg Duration</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatDuration(Math.round(callNotes.reduce((sum, call) => sum + call.duration, 0) / callNotes.length))}
              </p>
            </div>
            <Clock className="h-8 w-8 text-green-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Positive Calls</p>
              <p className="text-2xl font-bold text-green-600">
                {callNotes.filter(call => call.sentiment === 'positive').length}
              </p>
            </div>
            <MessageSquare className="h-8 w-8 text-green-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg Rating</p>
              <p className="text-2xl font-bold text-yellow-600">
                {(callNotes.reduce((sum, call) => sum + call.rating, 0) / callNotes.length).toFixed(1)}
              </p>
            </div>
            <Star className="h-8 w-8 text-yellow-600" />
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search calls..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
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
        </div>
      </Card>

      {/* Call Notes List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          {filteredCalls.map((call, index) => (
            <motion.div
              key={call.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                hover 
                className={`p-4 cursor-pointer ${selectedCall?.id === call.id ? 'ring-2 ring-blue-500' : ''}`}
                onClick={() => setSelectedCall(call)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                      <Phone className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {call.leadName}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {call.companyName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getSentimentColor(call.sentiment)}`}>
                      {getSentimentIcon(call.sentiment)} {call.sentiment}
                    </span>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < call.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {formatDuration(call.duration)}
                    </span>
                    <span>{call.date.toLocaleDateString()}</span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                  {call.summary}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Call Details */}
        <div className="sticky top-6">
          {selectedCall ? (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {selectedCall.leadName}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">{selectedCall.companyName}</p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Duration: {formatDuration(selectedCall.duration)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getSentimentColor(selectedCall.sentiment)}`}>
                      {getSentimentIcon(selectedCall.sentiment)} {selectedCall.sentiment}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">Summary</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    {selectedCall.summary}
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">Key Points</h3>
                  <ul className="space-y-1">
                    {selectedCall.keyPoints.map((point, index) => (
                      <li key={index} className="text-sm text-gray-700 dark:text-gray-300 flex items-start">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">Next Steps</h3>
                  <ul className="space-y-1">
                    {selectedCall.nextSteps.map((step, index) => (
                      <li key={index} className="text-sm text-gray-700 dark:text-gray-300 flex items-start">
                        <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>

                {selectedCall.transcript && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900 dark:text-white">Transcript</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(selectedCall.transcript!)}
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </Button>
                    </div>
                    <div className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 rounded-lg p-3 max-h-40 overflow-y-auto">
                      {selectedCall.transcript}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ) : (
            <Card className="p-12 text-center">
              <Phone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Select a call to view details
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Click on any call from the list to see transcript, key points, and analysis.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
