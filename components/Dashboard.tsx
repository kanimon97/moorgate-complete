import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Phone, PhoneMissed, CalendarCheck, Clock, ArrowUpRight, Sparkles, Sun, Moon } from './Icons';
// import { GoogleGenAI } from "@google/genai"; // Removed - using Vapi with Gemini instead
import ReactMarkdown from 'react-markdown';
import { cn } from '../utils/cn';

// --- MOCK DATA ---
const CHART_DATA = [
  { name: 'Mon', calls: 12, bookings: 5 },
  { name: 'Tue', calls: 19, bookings: 9 },
  { name: 'Wed', calls: 15, bookings: 7 },
  { name: 'Thu', calls: 25, bookings: 16 },
  { name: 'Fri', calls: 28, bookings: 21 },
  { name: 'Sat', calls: 10, bookings: 2 },
  { name: 'Sun', calls: 5, bookings: 0 },
];

const MOCK_STATS = {
  totalCalls: 142,
  missedCalls: 8,
  bookingsCreated: 34,
  avgDuration: '4m 12s'
};

const MOCK_CALL_LOGS = `
[
  {"id": 1, "duration": "5m 20s", "outcome": "Booking Confirmed", "sentiment": "Positive", "transcript_summary": "Customer asked for vehicle insurance quote for a Toyota Prius. Agent provided 3 options. Customer chose comprehensive plan."},
  {"id": 2, "duration": "2m 10s", "outcome": "Missed", "sentiment": "Neutral", "transcript_summary": "Customer hung up while waiting for agent connection."},
  {"id": 3, "duration": "8m 45s", "outcome": "Booking Confirmed", "sentiment": "Positive", "transcript_summary": "Complex inquiry about life insurance for a family of 4. Agent explained policy details thoroughly."},
  {"id": 4, "duration": "3m 30s", "outcome": "Information Only", "sentiment": "Neutral", "transcript_summary": "Customer asked about office hours and location."}
]
`;

interface DashboardProps {
    isDarkMode: boolean;
    toggleTheme: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ isDarkMode, toggleTheme }) => {
  const [insights, setInsights] = useState<string | null>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);

  const handleGenerateInsights = async () => {
    setLoadingInsights(true);
    try {
        // TODO: Implement AI insights using Vapi API or backend service
        // For now, showing mock insights
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
        
        setInsights(`### Key Insights from Call Analysis

**1. Strong Conversion Rate**
Your booking conversion rate of 23.9% (34 bookings from 142 calls) is above industry average. Thursday and Friday show peak performance with conversion rates exceeding 60%.

**2. Missed Call Opportunity**
8 missed calls represent potential lost revenue. Consider implementing callback automation or extending coverage hours to capture these opportunities.

**3. Customer Sentiment Trends**
Positive sentiment correlates strongly with longer call durations (5+ minutes), suggesting customers value detailed explanations. Brief calls tend to result in information-only outcomes.`);
    } catch (e) {
        console.error(e);
        setInsights("Unable to generate insights at this time.");
    } finally {
      setLoadingInsights(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-zinc-50 dark:bg-[#0a0a0a] relative overflow-y-auto font-sans transition-colors duration-300">
      
      {/* Header */}
      <header className="h-16 flex items-center justify-between px-8 z-20 border-b border-zinc-200 dark:border-white/5 bg-white/50 dark:bg-black/20 backdrop-blur-sm sticky top-0">
        <h2 className="text-sm font-medium text-zinc-600 dark:text-zinc-400 uppercase tracking-widest">Dashboard</h2>
        <div className="flex items-center space-x-4">
             {/* Theme Toggle */}
             <button 
                onClick={toggleTheme}
                className="p-2 rounded-full text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-white/10 transition-colors"
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
             >
                 {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
             </button>
        </div>
      </header>

      <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Overview</h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-1">Real-time overview of your agency's voice interactions.</p>
          </div>
          <div className="flex gap-3">
            <button className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 px-4 py-2 rounded-xl font-medium hover:bg-zinc-50 dark:hover:bg-zinc-700 transition text-sm shadow-sm">
              Export Report
            </button>
            <button 
              onClick={handleGenerateInsights}
              disabled={loadingInsights}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-xl font-medium hover:shadow-lg hover:opacity-90 transition flex items-center gap-2 disabled:opacity-70 text-sm shadow-md"
            >
              <Sparkles className="w-4 h-4" />
              {loadingInsights ? 'Analyzing...' : 'Ask AI Insights'}
            </button>
          </div>
        </div>
        
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-200 dark:border-white/5">
            <div className="flex justify-between items-start">
              <div className="bg-blue-100 dark:bg-blue-500/20 p-3 rounded-xl text-blue-600 dark:text-blue-400">
                <Phone className="w-5 h-5" />
              </div>
              <span className="text-emerald-500 flex items-center text-xs font-bold bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-lg">
                +12% <ArrowUpRight className="ml-1 w-3 h-3" />
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">{MOCK_STATS.totalCalls}</h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium mt-1">Total Calls (Weekly)</p>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-200 dark:border-white/5">
            <div className="flex justify-between items-start">
              <div className="bg-red-100 dark:bg-red-500/20 p-3 rounded-xl text-red-600 dark:text-red-400">
                <PhoneMissed className="w-5 h-5" />
              </div>
              <span className="text-red-500 flex items-center text-xs font-bold bg-red-50 dark:bg-red-500/10 px-2 py-1 rounded-lg">
                +2% <ArrowUpRight className="ml-1 w-3 h-3" />
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">{MOCK_STATS.missedCalls}</h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium mt-1">Missed Calls</p>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-200 dark:border-white/5">
            <div className="flex justify-between items-start">
              <div className="bg-teal-100 dark:bg-teal-500/20 p-3 rounded-xl text-teal-600 dark:text-teal-400">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <span className="text-emerald-500 flex items-center text-xs font-bold bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-lg">
                +8% <ArrowUpRight className="ml-1 w-3 h-3" />
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">{MOCK_STATS.bookingsCreated}</h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium mt-1">Bookings Created</p>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-200 dark:border-white/5">
            <div className="flex justify-between items-start">
              <div className="bg-purple-100 dark:bg-purple-500/20 p-3 rounded-xl text-purple-600 dark:text-purple-400">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">{MOCK_STATS.avgDuration}</h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium mt-1">Avg. Duration</p>
            </div>
          </div>
        </div>

        {/* AI Insights Section */}
        {insights && (
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-6 rounded-2xl border border-indigo-100 dark:border-indigo-500/20 animate-fade-in">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="text-indigo-600 dark:text-indigo-400 w-5 h-5" />
              <h2 className="text-lg font-bold text-indigo-900 dark:text-indigo-100">Gemini AI Analysis</h2>
            </div>
            <div className="prose prose-sm max-w-none text-zinc-700 dark:text-zinc-300">
              <ReactMarkdown>{insights}</ReactMarkdown>
            </div>
          </div>
        )}

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-200 dark:border-white/5">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-6">Call Volume Trends</h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={CHART_DATA}>
                  <defs>
                    <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0d9488" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#333' : '#f1f5f9'} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: isDarkMode ? '#9ca3af' : '#64748b', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: isDarkMode ? '#9ca3af' : '#64748b', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{borderRadius: '12px', border: 'none', backgroundColor: isDarkMode ? '#18181b' : '#fff', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', color: isDarkMode ? '#fff' : '#000'}}
                    itemStyle={{ color: isDarkMode ? '#fff' : '#000' }}
                  />
                  <Area type="monotone" dataKey="calls" stroke="#0d9488" strokeWidth={3} fillOpacity={1} fill="url(#colorCalls)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-200 dark:border-white/5">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-6">Call Conversion</h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={CHART_DATA}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#333' : '#f1f5f9'} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: isDarkMode ? '#9ca3af' : '#64748b', fontSize: 12}} dy={10} />
                  <Tooltip 
                    cursor={{fill: isDarkMode ? '#27272a' : '#f8fafc'}}
                    contentStyle={{borderRadius: '12px', border: 'none', backgroundColor: isDarkMode ? '#18181b' : '#fff', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                    itemStyle={{ color: isDarkMode ? '#fff' : '#000' }}
                  />
                  <Bar dataKey="bookings" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};