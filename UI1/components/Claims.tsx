import React, { useState } from 'react';
import { 
    Search, FileText, MoreHorizontal, Sun, Moon, CheckCircle, AlertCircle, X, Shield, CalendarCheck, DollarSign, Users
} from './Icons';
import { cn } from '../utils/cn';

interface Claim {
    id: string;
    policyId: string;
    claimant: string;
    type: 'Accident' | 'Medical' | 'Theft' | 'Natural Disaster';
    status: 'Approved' | 'In Review' | 'Rejected' | 'Paid';
    amount: string;
    date: string;
    details: string;
}

const MOCK_CLAIMS: Claim[] = [
  { 
      id: "CLM-9901", 
      policyId: "POL-2024-001",
      claimant: "Alice Johnson", 
      type: "Accident", 
      status: "In Review", 
      amount: "$2,500", 
      date: "2024-09-15",
      details: "Rear-ended collision at intersection. Police report filed. Waiting for garage estimate."
  },
  { 
      id: "CLM-9822", 
      policyId: "POL-2023-089",
      claimant: "Sarah Connor", 
      type: "Theft", 
      status: "Rejected", 
      amount: "$5,000", 
      date: "2023-11-01",
      details: "Claim filed after policy expiration date. Coverage not applicable."
  },
  { 
      id: "CLM-9945", 
      policyId: "POL-2024-002",
      claimant: "Mark Smith", 
      type: "Medical", 
      status: "Approved", 
      amount: "$12,000", 
      date: "2024-08-20",
      details: "Emergency surgery following cardiac event. Hospital bills verified."
  },
  { 
      id: "CLM-8800", 
      policyId: "POL-2024-105",
      claimant: "John Doe", 
      type: "Medical", 
      status: "Paid", 
      amount: "$450", 
      date: "2024-05-10",
      details: "Routine dental checkup and cleaning reimbursement."
  },
];

interface ClaimsProps {
    isDarkMode: boolean;
    toggleTheme: () => void;
}

export const Claims: React.FC<ClaimsProps> = ({ isDarkMode, toggleTheme }) => {
    const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredClaims = MOCK_CLAIMS.filter(c => 
        c.claimant.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        switch(status) {
            case 'Approved': 
            case 'Paid':
                return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400";
            case 'Rejected': return "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400";
            case 'In Review': return "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400";
            default: return "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400";
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-zinc-50 dark:bg-[#0a0a0a] relative overflow-hidden font-sans transition-colors duration-300">
             {/* Header */}
            <header className="h-16 flex items-center justify-between px-8 z-20 border-b border-zinc-200 dark:border-white/5 bg-white/50 dark:bg-black/20 backdrop-blur-sm sticky top-0">
                <h2 className="text-sm font-medium text-zinc-600 dark:text-zinc-400 uppercase tracking-widest">Claims</h2>
                <div className="flex items-center space-x-4">
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
                            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">All Claims</h1>
                            <p className="text-zinc-500 dark:text-zinc-400 mt-1">Track and process insurance claims.</p>
                        </div>
                        
                        <div className="relative">
                             <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                             <input 
                                type="text" 
                                placeholder="Search by claimant or ID..." 
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
                                    <th className="px-6 py-4">Claim ID</th>
                                    <th className="px-6 py-4">Claimant</th>
                                    <th className="px-6 py-4">Type</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200 dark:divide-white/5">
                                {filteredClaims.map((claim) => (
                                    <tr 
                                        key={claim.id} 
                                        onClick={() => setSelectedClaim(claim)}
                                        className={cn(
                                            "hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors cursor-pointer",
                                            selectedClaim?.id === claim.id ? "bg-blue-50/50 dark:bg-blue-500/10" : ""
                                        )}
                                    >
                                        <td className="px-6 py-4 font-mono text-xs text-zinc-500 dark:text-zinc-400">
                                            {claim.id}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-zinc-900 dark:text-white">
                                            {claim.claimant}
                                        </td>
                                        <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">
                                            {claim.type}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={cn("px-2.5 py-1 rounded-full text-xs font-semibold", getStatusColor(claim.status))}>
                                                {claim.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-zinc-900 dark:text-white">
                                            {claim.amount}
                                        </td>
                                        <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">
                                            {claim.date}
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
                {selectedClaim && (
                    <div className="w-[400px] border-l border-zinc-200 dark:border-white/5 bg-white dark:bg-zinc-900 p-8 flex flex-col overflow-y-auto transition-colors duration-300 shadow-xl shadow-zinc-200/50 dark:shadow-none z-10">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Claim Details</h2>
                                <p className="text-sm text-zinc-500 font-mono mt-1">{selectedClaim.id}</p>
                            </div>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => setSelectedClaim(null)}
                                    className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-500 dark:text-zinc-400 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-zinc-100 dark:border-white/5">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-2">
                                        <AlertCircle className="w-5 h-5 text-zinc-500" />
                                        <span className="font-semibold text-zinc-900 dark:text-white">{selectedClaim.type}</span>
                                    </div>
                                    <span className={cn("px-2.5 py-1 rounded-full text-xs font-semibold", getStatusColor(selectedClaim.status))}>
                                        {selectedClaim.status}
                                    </span>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-zinc-500">Amount</span>
                                        <span className="font-semibold text-zinc-900 dark:text-white">{selectedClaim.amount}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-zinc-500">Date Filed</span>
                                        <span className="text-zinc-700 dark:text-zinc-300">{selectedClaim.date}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-white dark:bg-zinc-800/20 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
                                    <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Description</h3>
                                    <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                        {selectedClaim.details}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-zinc-50 dark:bg-zinc-800/30 p-3 rounded-lg border border-zinc-100 dark:border-white/5">
                                        <div className="flex items-center gap-2 mb-1 text-zinc-500 dark:text-zinc-400">
                                            <Users className="w-3.5 h-3.5" />
                                            <span className="text-xs">Claimant</span>
                                        </div>
                                        <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">{selectedClaim.claimant}</p>
                                    </div>
                                    <div className="bg-zinc-50 dark:bg-zinc-800/30 p-3 rounded-lg border border-zinc-100 dark:border-white/5">
                                        <div className="flex items-center gap-2 mb-1 text-zinc-500 dark:text-zinc-400">
                                            <Shield className="w-3.5 h-3.5" />
                                            <span className="text-xs">Policy Ref</span>
                                        </div>
                                        <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">{selectedClaim.policyId}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
                                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Processing Steps</h3>
                                <div className="space-y-3 relative">
                                    <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-zinc-200 dark:bg-zinc-800"></div>
                                    <div className="flex gap-3 relative z-10">
                                        <div className="w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-zinc-900 flex-shrink-0"></div>
                                        <p className="text-xs text-zinc-500">Claim filed by {selectedClaim.claimant}</p>
                                    </div>
                                    <div className="flex gap-3 relative z-10">
                                        <div className={cn("w-4 h-4 rounded-full border-2 border-white dark:border-zinc-900 flex-shrink-0", 
                                            selectedClaim.status !== 'In Review' ? "bg-emerald-500" : "bg-blue-500 animate-pulse")}></div>
                                        <p className="text-xs text-zinc-500">Initial review by Agent</p>
                                    </div>
                                    <div className="flex gap-3 relative z-10">
                                        <div className={cn("w-4 h-4 rounded-full border-2 border-white dark:border-zinc-900 flex-shrink-0", 
                                            ['Paid', 'Approved', 'Rejected'].includes(selectedClaim.status) ? (selectedClaim.status === 'Rejected' ? "bg-red-500" : "bg-emerald-500") : "bg-zinc-300 dark:bg-zinc-700")}></div>
                                        <p className="text-xs text-zinc-500">Decision: {selectedClaim.status}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-4 mt-auto">
                                <button className="bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm">
                                    Process Claim
                                </button>
                                <button className="bg-white dark:bg-transparent border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800 py-2.5 rounded-lg text-sm font-medium transition-colors">
                                    Contact
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
