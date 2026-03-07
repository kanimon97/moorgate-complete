import React, { useState } from 'react';
import { 
    Search, PhoneIncoming, PhoneOutgoing, MoreHorizontal, 
    Play, Clock, Sun, Moon, PhoneCall, PhoneMissed, Phone, FileText, X, Sparkles
} from './Icons';
import { cn } from '../utils/cn';
import { GoogleGenAI } from "@google/genai";

interface CallLog {
    id: number;
    customer: string;
    phoneNumber: string;
    status: 'Completed' | 'Missed' | 'Voicemail' | 'Ongoing';
    duration: string;
    time: string;
    sentiment: 'Positive' | 'Neutral' | 'Negative';
    transcript: string;
    summary: string;
}

const INITIAL_CALL_LOGS: CallLog[] = [
  { 
      id: 1, 
      customer: "Alice Johnson", 
      phoneNumber: "+1 (555) 010-9988", 
      status: "Completed", 
      duration: "5m 23s", 
      time: "16:00", 
      sentiment: "Positive",
      summary: "Customer interested in a 2-week trip to Bali for honeymoon. Budget approx $5k.",
      transcript: "Agent: Hello, thanks for calling Wanderlust Travel. How can I help? Alice: Hi, looking for a honeymoon package to Bali..." 
  },
  { 
      id: 2, 
      customer: "Mark Smith", 
      phoneNumber: "+1 (555) 012-3344", 
      status: "Missed", 
      duration: "0m 45s", 
      time: "14:45", 
      sentiment: "Neutral",
      summary: "Missed call from potential client.",
      transcript: "No transcript available."
  },
  { 
      id: 3, 
      customer: "Sarah Connor", 
      phoneNumber: "+1 (555) 998-2211", 
      status: "Completed", 
      duration: "8m 10s", 
      time: "22:15", 
      sentiment: "Neutral",
      summary: "Inquired about changing flight dates for upcoming trip to Mexico.",
      transcript: "Agent: Ceylinco Insurance, Sarah speaking. Sarah C: Hi, I need to check if my travel insurance covers flight changes..."
  },
  { 
      id: 4, 
      customer: "John Doe", 
      phoneNumber: "+1 (555) 123-4567", 
      status: "Voicemail", 
      duration: "2m 15s", 
      time: "19:50", 
      sentiment: "Positive",
      summary: "Left voicemail regarding policy renewal.",
      transcript: "Voicemail: Hi, this is John. Just calling to confirm my policy renewal details. Please call back."
  },
  { 
      id: 5, 
      customer: "Emily Blunt", 
      phoneNumber: "+1 (555) 777-8888", 
      status: "Completed", 
      duration: "6m 05s", 
      time: "16:30", 
      sentiment: "Negative",
      summary: "Customer upset about claim processing delay.",
      transcript: "Agent: Hello. Emily: I've been waiting for 3 weeks for my claim! This is unacceptable."
  }
];

interface CallLogsProps {
    isDarkMode: boolean;
    toggleTheme: () => void;
}

export const CallLogs: React.FC<CallLogsProps> = ({ isDarkMode, toggleTheme }) => {
    const [callLogs, setCallLogs] = useState<CallLog[]>(INITIAL_CALL_LOGS);
    const [selectedCall, setSelectedCall] = useState<CallLog | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [analyzingId, setAnalyzingId] = useState<number | null>(null);

    const filteredLogs = callLogs.filter(log => 
        log.customer.toLowerCase().includes(searchTerm.toLowerCase()) || 
        log.phoneNumber.includes(searchTerm)
    );

    const getStatusColor = (status: string) => {
        switch(status) {
            case 'Completed': return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400";
            case 'Missed': return "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400";
            case 'Voicemail': return "bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400";
            default: return "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400";
        }
    };

    const getSentimentColor = (sentiment: string) => {
        switch(sentiment) {
            case 'Positive': return "text-emerald-600 dark:text-emerald-400";
            case 'Negative': return "text-red-600 dark:text-red-400";
            default: return "text-zinc-500 dark:text-zinc-400";
        }
    };

    const analyzeSentiment = async (log: CallLog) => {
        if (!log.transcript || log.transcript === "No transcript available.") return;
        
        setAnalyzingId(log.id);
        try {
            const apiKey = process.env.API_KEY;
            if (!apiKey) throw new Error("API Key not found");

            const ai = new GoogleGenAI({ apiKey });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `Analyze the sentiment of the following customer service call transcript. Return ONLY one word: "Positive", "Negative", or "Neutral".
                
                Transcript: "${log.transcript}"`
            });

            const sentiment = response.text?.trim() as 'Positive' | 'Negative' | 'Neutral';
            
            if (['Positive', 'Negative', 'Neutral'].includes(sentiment)) {
                const updatedLogs = callLogs.map(l => l.id === log.id ? { ...l, sentiment } : l);
                setCallLogs(updatedLogs);
                if (selectedCall?.id === log.id) {
                    setSelectedCall({ ...selectedCall, sentiment });
                }
            }
        } catch (error) {
            console.error("Error analyzing sentiment:", error);
        } finally {
            setAnalyzingId(null);
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-zinc-50 dark:bg-[#0a0a0a] relative overflow-hidden font-sans transition-colors duration-300">
             {/* Header */}
            <header className="h-16 flex items-center justify-between px-8 z-20 border-b border-zinc-200 dark:border-white/5 bg-white/50 dark:bg-black/20 backdrop-blur-sm sticky top-0">
                <h2 className="text-sm font-medium text-zinc-600 dark:text-zinc-400 uppercase tracking-widest">Call Logs</h2>
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

            <div className="flex-1 flex overflow-hidden">
                {/* Main List */}
                <div className="flex-1 flex flex-col p-8 overflow-y-auto min-w-[600px] transition-all duration-300">
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Call Logs</h1>
                            <p className="text-zinc-500 dark:text-zinc-400 mt-1">Detailed history of all inbound and outbound calls.</p>
                        </div>
                        
                        <div className="relative">
                             <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                             <input 
                                type="text" 
                                placeholder="Search by name or phone..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-500 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-700 w-64 border border-zinc-200 dark:border-zinc-700 transition-colors"
                             />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-white/5 shadow-sm overflow-hidden transition-colors duration-300">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-zinc-50 dark:bg-zinc-800/50 text-zinc-500 dark:text-zinc-400 font-medium border-b border-zinc-200 dark:border-white/5">
                                <tr>
                                    <th className="px-6 py-4">Customer</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Duration</th>
                                    <th className="px-6 py-4">Time</th>
                                    <th className="px-6 py-4">Sentiment</th>
                                    <th className="px-6 py-4">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200 dark:divide-white/5">
                                {filteredLogs.map((log) => (
                                    <tr 
                                        key={log.id} 
                                        onClick={() => setSelectedCall(log)}
                                        className={cn(
                                            "hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors cursor-pointer",
                                            selectedCall?.id === log.id ? "bg-blue-50/50 dark:bg-blue-500/10" : ""
                                        )}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-zinc-900 dark:text-white">{log.customer}</div>
                                            <div className="text-xs text-zinc-500">{log.phoneNumber}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={cn("px-2.5 py-1 rounded-full text-xs font-semibold", getStatusColor(log.status))}>
                                                {log.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                                            <Clock className="w-3.5 h-3.5" />
                                            {log.duration}
                                        </td>
                                        <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">
                                            {log.time}
                                        </td>
                                        <td className="px-6 py-4 font-medium">
                                            <span className={getSentimentColor(log.sentiment)}>{log.sentiment}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full text-zinc-400 transition-colors">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Detail Panel */}
                {selectedCall && (
                    <div className="w-[400px] border-l border-zinc-200 dark:border-white/5 bg-white dark:bg-zinc-900 p-8 flex flex-col overflow-y-auto transition-colors duration-300 shadow-xl shadow-zinc-200/50 dark:shadow-none z-10">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h2 className="text-xl font-bold text-zinc-900 dark:text-white">{selectedCall.customer}</h2>
                                <p className="text-sm text-emerald-500 font-medium mt-1">{selectedCall.phoneNumber}</p>
                            </div>
                            <div className="flex gap-2">
                                <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-zinc-500 dark:text-zinc-400 transition-colors">
                                    <PhoneCall className="w-5 h-5" />
                                </div>
                                <button 
                                    onClick={() => setSelectedCall(null)}
                                    className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-500 dark:text-zinc-400 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-zinc-50 dark:bg-zinc-800/30 p-4 rounded-xl border border-zinc-100 dark:border-white/5 transition-colors">
                                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 block">Summary</label>
                                <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                                    {selectedCall.summary}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">Recording</label>
                                <div className="bg-zinc-100 dark:bg-zinc-950 rounded-xl p-4 flex items-center gap-4 border border-zinc-200 dark:border-white/5 transition-colors">
                                    <button className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white hover:bg-emerald-400 transition shadow-sm">
                                        <Play className="w-4 h-4 fill-current ml-0.5" />
                                    </button>
                                    <div className="flex-1 h-1 bg-zinc-300 dark:bg-zinc-800 rounded-full overflow-hidden transition-colors">
                                        <div className="w-1/3 h-full bg-emerald-500 rounded-full" />
                                    </div>
                                    <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">{selectedCall.duration}</span>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-zinc-800/20 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 transition-colors">
                                <div className="flex items-center justify-between mb-3">
                                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block flex items-center gap-2">
                                        <FileText className="w-3 h-3" /> Transcript
                                    </label>
                                    <button 
                                        onClick={() => analyzeSentiment(selectedCall)}
                                        disabled={analyzingId === selectedCall.id || !selectedCall.transcript || selectedCall.transcript === "No transcript available."}
                                        className="text-xs flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Sparkles className="w-3 h-3" />
                                        {analyzingId === selectedCall.id ? "Analyzing..." : "Analyze Sentiment"}
                                    </button>
                                </div>
                                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-mono whitespace-pre-wrap">
                                    {selectedCall.transcript}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-4">
                                <button className="bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm">
                                    Call Back
                                </button>
                                <button className="bg-white dark:bg-transparent border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800 py-2.5 rounded-lg text-sm font-medium transition-colors">
                                    Add Note
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
