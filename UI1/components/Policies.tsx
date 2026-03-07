import React, { useState } from 'react';
import { 
    Search, FileText, MoreHorizontal, Sun, Moon, CheckCircle, AlertCircle, X, Shield, CalendarCheck, DollarSign
} from './Icons';
import { cn } from '../utils/cn';

interface Policy {
    id: string;
    type: 'Vehicle' | 'Life' | 'Health' | 'Home';
    holder: string;
    status: 'Active' | 'Expired' | 'Pending';
    premium: string;
    renewalDate: string;
    coverage: string;
    details: string;
}

const MOCK_POLICIES: Policy[] = [
  { 
      id: "POL-2024-001", 
      type: "Vehicle", 
      holder: "Alice Johnson", 
      status: "Active", 
      premium: "$1,200/yr", 
      renewalDate: "2024-12-01",
      coverage: "Full Comprehensive",
      details: "Covers third-party liability, collision, theft, and fire. Includes 24/7 roadside assistance."
  },
  { 
      id: "POL-2024-002", 
      type: "Life", 
      holder: "Mark Smith", 
      status: "Active", 
      premium: "$250/mo", 
      renewalDate: "2025-01-15",
      coverage: "Term Life - 20 Years",
      details: "Payout of $500,000 to beneficiaries. Includes terminal illness rider."
  },
  { 
      id: "POL-2023-089", 
      type: "Home", 
      holder: "Sarah Connor", 
      status: "Expired", 
      premium: "$800/yr", 
      renewalDate: "2023-11-20",
      coverage: "Structure & Contents",
      details: "Policy lapsed due to non-payment. Grace period ended."
  },
  { 
      id: "POL-2024-105", 
      type: "Health", 
      holder: "John Doe", 
      status: "Pending", 
      premium: "$450/mo", 
      renewalDate: "N/A",
      coverage: "Family Floater",
      details: "Application under underwriting review. Pending medical check-up results."
  },
  { 
      id: "POL-2024-055", 
      type: "Vehicle", 
      holder: "Emily Blunt", 
      status: "Active", 
      premium: "$950/yr", 
      renewalDate: "2025-03-10",
      coverage: "Third Party Only",
      details: "Basic coverage mandated by law. Covers damages to other vehicles/property."
  }
];

interface PoliciesProps {
    isDarkMode: boolean;
    toggleTheme: () => void;
}

export const Policies: React.FC<PoliciesProps> = ({ isDarkMode, toggleTheme }) => {
    const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredPolicies = MOCK_POLICIES.filter(p => 
        p.holder.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        switch(status) {
            case 'Active': return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400";
            case 'Expired': return "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400";
            case 'Pending': return "bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400";
            default: return "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400";
        }
    };

    const getTypeIcon = (type: string) => {
        // You could return different icons based on type if you have them
        return <Shield className="w-4 h-4" />;
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-zinc-50 dark:bg-[#0a0a0a] relative overflow-hidden font-sans transition-colors duration-300">
             {/* Header */}
            <header className="h-16 flex items-center justify-between px-8 z-20 border-b border-zinc-200 dark:border-white/5 bg-white/50 dark:bg-black/20 backdrop-blur-sm sticky top-0">
                <h2 className="text-sm font-medium text-zinc-600 dark:text-zinc-400 uppercase tracking-widest">Policies</h2>
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
                            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">All Policies</h1>
                            <p className="text-zinc-500 dark:text-zinc-400 mt-1">Manage and review client insurance policies.</p>
                        </div>
                        
                        <div className="relative">
                             <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                             <input 
                                type="text" 
                                placeholder="Search by name or policy ID..." 
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
                                    <th className="px-6 py-4">Policy ID</th>
                                    <th className="px-6 py-4">Type</th>
                                    <th className="px-6 py-4">Holder</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Premium</th>
                                    <th className="px-6 py-4">Renewal</th>
                                    <th className="px-6 py-4">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200 dark:divide-white/5">
                                {filteredPolicies.map((policy) => (
                                    <tr 
                                        key={policy.id} 
                                        onClick={() => setSelectedPolicy(policy)}
                                        className={cn(
                                            "hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors cursor-pointer",
                                            selectedPolicy?.id === policy.id ? "bg-blue-50/50 dark:bg-blue-500/10" : ""
                                        )}
                                    >
                                        <td className="px-6 py-4 font-mono text-xs text-zinc-500 dark:text-zinc-400">
                                            {policy.id}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-zinc-900 dark:text-white">
                                                {getTypeIcon(policy.type)}
                                                {policy.type}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-zinc-900 dark:text-white">
                                            {policy.holder}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={cn("px-2.5 py-1 rounded-full text-xs font-semibold", getStatusColor(policy.status))}>
                                                {policy.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">
                                            {policy.premium}
                                        </td>
                                        <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">
                                            {policy.renewalDate}
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
                {selectedPolicy && (
                    <div className="w-[400px] border-l border-zinc-200 dark:border-white/5 bg-white dark:bg-zinc-900 p-8 flex flex-col overflow-y-auto transition-colors duration-300 shadow-xl shadow-zinc-200/50 dark:shadow-none z-10">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h2 className="text-xl font-bold text-zinc-900 dark:text-white">{selectedPolicy.holder}</h2>
                                <p className="text-sm text-zinc-500 font-mono mt-1">{selectedPolicy.id}</p>
                            </div>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => setSelectedPolicy(null)}
                                    className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-500 dark:text-zinc-400 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-zinc-100 dark:border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                        <Shield className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-zinc-900 dark:text-white">{selectedPolicy.type} Insurance</p>
                                        <p className="text-xs text-zinc-500">{selectedPolicy.coverage}</p>
                                    </div>
                                </div>
                                <span className={cn("px-2.5 py-1 rounded-full text-xs font-semibold", getStatusColor(selectedPolicy.status))}>
                                    {selectedPolicy.status}
                                </span>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Policy Details</h3>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-zinc-50 dark:bg-zinc-800/30 p-3 rounded-lg border border-zinc-100 dark:border-white/5">
                                        <div className="flex items-center gap-2 mb-1 text-zinc-500 dark:text-zinc-400">
                                            <DollarSign className="w-3.5 h-3.5" />
                                            <span className="text-xs">Premium</span>
                                        </div>
                                        <p className="text-sm font-semibold text-zinc-900 dark:text-white">{selectedPolicy.premium}</p>
                                    </div>
                                    <div className="bg-zinc-50 dark:bg-zinc-800/30 p-3 rounded-lg border border-zinc-100 dark:border-white/5">
                                        <div className="flex items-center gap-2 mb-1 text-zinc-500 dark:text-zinc-400">
                                            <CalendarCheck className="w-3.5 h-3.5" />
                                            <span className="text-xs">Renewal</span>
                                        </div>
                                        <p className="text-sm font-semibold text-zinc-900 dark:text-white">{selectedPolicy.renewalDate}</p>
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-zinc-800/20 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
                                    <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                        {selectedPolicy.details}
                                    </p>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
                                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Coverage Features</h3>
                                <ul className="space-y-2">
                                    <li className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
                                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                                        <span>Primary Policy Holder</span>
                                    </li>
                                    <li className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
                                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                                        <span>Automated Renewal</span>
                                    </li>
                                    <li className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
                                        <AlertCircle className="w-4 h-4 text-orange-500" />
                                        <span>Claims history: 1 in last 3 years</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-4 mt-auto">
                                <button className="bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm">
                                    Edit Policy
                                </button>
                                <button className="bg-white dark:bg-transparent border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800 py-2.5 rounded-lg text-sm font-medium transition-colors">
                                    Download Doc
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
