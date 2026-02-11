import React, { useState } from 'react';
import { 
    Search, DollarSign, CreditCard, MoreHorizontal, Sun, Moon, CheckCircle, AlertCircle, X, Download, Clock, ArrowUpRight
} from './Icons';
import { cn } from '../utils/cn';

interface Transaction {
    id: string;
    customer: string;
    description: string;
    amount: string;
    date: string;
    status: 'Completed' | 'Pending' | 'Failed';
    method: string;
    invoiceUrl: string;
}

const MOCK_TRANSACTIONS: Transaction[] = [
  { 
      id: "TRX-8821", 
      customer: "Alice Johnson", 
      description: "Vehicle Insurance Premium - Annual", 
      amount: "$1,200.00", 
      date: "Oct 24, 2024", 
      status: "Completed",
      method: "Visa •••• 4242",
      invoiceUrl: "#"
  },
  { 
      id: "TRX-8822", 
      customer: "Mark Smith", 
      description: "Life Insurance - Monthly", 
      amount: "$250.00", 
      date: "Oct 23, 2024", 
      status: "Completed",
      method: "MasterCard •••• 5599",
      invoiceUrl: "#"
  },
  { 
      id: "TRX-8823", 
      customer: "Sarah Connor", 
      description: "Home Insurance Renewal", 
      amount: "$800.00", 
      date: "Oct 22, 2024", 
      status: "Failed",
      method: "PayPal",
      invoiceUrl: "#"
  },
  { 
      id: "TRX-8824", 
      customer: "John Doe", 
      description: "Health Insurance - Quarterly", 
      amount: "$1,350.00", 
      date: "Oct 21, 2024", 
      status: "Pending",
      method: "Bank Transfer",
      invoiceUrl: "#"
  },
  { 
      id: "TRX-8825", 
      customer: "Emily Blunt", 
      description: "Vehicle Insurance - Addition", 
      amount: "$450.00", 
      date: "Oct 20, 2024", 
      status: "Completed",
      method: "Visa •••• 1234",
      invoiceUrl: "#"
  }
];

interface PaymentsProps {
    isDarkMode: boolean;
    toggleTheme: () => void;
}

export const Payments: React.FC<PaymentsProps> = ({ isDarkMode, toggleTheme }) => {
    const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredTx = MOCK_TRANSACTIONS.filter(t => 
        t.customer.toLowerCase().includes(searchTerm.toLowerCase()) || 
        t.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        switch(status) {
            case 'Completed': return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400";
            case 'Failed': return "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400";
            case 'Pending': return "bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400";
            default: return "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400";
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-zinc-50 dark:bg-[#0a0a0a] relative overflow-hidden font-sans transition-colors duration-300">
             {/* Header */}
            <header className="h-16 flex items-center justify-between px-8 z-20 border-b border-zinc-200 dark:border-white/5 bg-white/50 dark:bg-black/20 backdrop-blur-sm sticky top-0">
                <h2 className="text-sm font-medium text-zinc-600 dark:text-zinc-400 uppercase tracking-widest">Payments</h2>
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
                            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Transactions</h1>
                            <p className="text-zinc-500 dark:text-zinc-400 mt-1">Monitor recent payments and invoices.</p>
                        </div>
                        
                        <div className="relative">
                             <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                             <input 
                                type="text" 
                                placeholder="Search by name or transaction ID..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-500 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-700 w-64 border border-zinc-200 dark:border-zinc-700 transition-colors"
                             />
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-3 gap-6 mb-8">
                        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-white/5 shadow-sm">
                            <div className="flex items-center gap-3 text-zinc-500 dark:text-zinc-400 mb-2">
                                <div className="p-2 bg-emerald-100 dark:bg-emerald-500/20 rounded-lg text-emerald-600 dark:text-emerald-400">
                                    <DollarSign className="w-4 h-4" />
                                </div>
                                <span className="text-sm font-medium">Total Revenue</span>
                            </div>
                            <div className="flex items-end gap-2">
                                <span className="text-2xl font-bold text-zinc-900 dark:text-white">$45,231.00</span>
                                <span className="text-xs text-emerald-500 font-medium mb-1 flex items-center">+12% <ArrowUpRight className="w-3 h-3" /></span>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-white/5 shadow-sm">
                            <div className="flex items-center gap-3 text-zinc-500 dark:text-zinc-400 mb-2">
                                <div className="p-2 bg-orange-100 dark:bg-orange-500/20 rounded-lg text-orange-600 dark:text-orange-400">
                                    <Clock className="w-4 h-4" />
                                </div>
                                <span className="text-sm font-medium">Pending</span>
                            </div>
                            <div className="flex items-end gap-2">
                                <span className="text-2xl font-bold text-zinc-900 dark:text-white">$3,450.00</span>
                                <span className="text-xs text-zinc-400 font-medium mb-1">5 transactions</span>
                            </div>
                        </div>
                         <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-white/5 shadow-sm">
                            <div className="flex items-center gap-3 text-zinc-500 dark:text-zinc-400 mb-2">
                                <div className="p-2 bg-blue-100 dark:bg-blue-500/20 rounded-lg text-blue-600 dark:text-blue-400">
                                    <CreditCard className="w-4 h-4" />
                                </div>
                                <span className="text-sm font-medium">Avg. Transaction</span>
                            </div>
                            <div className="flex items-end gap-2">
                                <span className="text-2xl font-bold text-zinc-900 dark:text-white">$845.00</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-white/5 shadow-sm overflow-hidden transition-colors duration-300">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-zinc-50 dark:bg-zinc-800/50 text-zinc-500 dark:text-zinc-400 font-medium border-b border-zinc-200 dark:border-white/5">
                                <tr>
                                    <th className="px-6 py-4">Transaction ID</th>
                                    <th className="px-6 py-4">Customer</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Method</th>
                                    <th className="px-6 py-4">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200 dark:divide-white/5">
                                {filteredTx.map((tx) => (
                                    <tr 
                                        key={tx.id} 
                                        onClick={() => setSelectedTx(tx)}
                                        className={cn(
                                            "hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors cursor-pointer",
                                            selectedTx?.id === tx.id ? "bg-blue-50/50 dark:bg-blue-500/10" : ""
                                        )}
                                    >
                                        <td className="px-6 py-4 font-mono text-xs text-zinc-500 dark:text-zinc-400">
                                            {tx.id}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-zinc-900 dark:text-white">{tx.customer}</div>
                                            <div className="text-xs text-zinc-500 truncate max-w-[150px]">{tx.description}</div>
                                        </td>
                                        <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">
                                            {tx.date}
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-zinc-900 dark:text-white">
                                            {tx.amount}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={cn("px-2.5 py-1 rounded-full text-xs font-semibold", getStatusColor(tx.status))}>
                                                {tx.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
                                            <CreditCard className="w-3 h-3" />
                                            {tx.method}
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
                {selectedTx && (
                    <div className="w-[400px] border-l border-zinc-200 dark:border-white/5 bg-white dark:bg-zinc-900 p-8 flex flex-col overflow-y-auto transition-colors duration-300 shadow-xl shadow-zinc-200/50 dark:shadow-none z-10">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Transaction Details</h2>
                                <p className="text-sm text-zinc-500 font-mono mt-1">{selectedTx.id}</p>
                            </div>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => setSelectedTx(null)}
                                    className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-500 dark:text-zinc-400 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col items-center justify-center py-8 bg-zinc-50 dark:bg-zinc-800/30 rounded-2xl border border-zinc-100 dark:border-white/5 mb-6">
                            <span className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">Total Amount</span>
                            <span className="text-4xl font-bold text-zinc-900 dark:text-white mb-4">{selectedTx.amount}</span>
                            <span className={cn("px-3 py-1 rounded-full text-xs font-semibold", getStatusColor(selectedTx.status))}>
                                {selectedTx.status}
                            </span>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-4">
                                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Payment Information</h3>
                                
                                <div className="flex justify-between text-sm py-2 border-b border-zinc-100 dark:border-zinc-800">
                                    <span className="text-zinc-500">Customer</span>
                                    <span className="font-medium text-zinc-900 dark:text-white">{selectedTx.customer}</span>
                                </div>
                                <div className="flex justify-between text-sm py-2 border-b border-zinc-100 dark:border-zinc-800">
                                    <span className="text-zinc-500">Date</span>
                                    <span className="font-medium text-zinc-900 dark:text-white">{selectedTx.date}</span>
                                </div>
                                <div className="flex justify-between text-sm py-2 border-b border-zinc-100 dark:border-zinc-800">
                                    <span className="text-zinc-500">Method</span>
                                    <span className="font-medium text-zinc-900 dark:text-white">{selectedTx.method}</span>
                                </div>
                                <div className="flex justify-between text-sm py-2 border-b border-zinc-100 dark:border-zinc-800">
                                    <span className="text-zinc-500">Description</span>
                                    <span className="font-medium text-zinc-900 dark:text-white text-right max-w-[200px]">{selectedTx.description}</span>
                                </div>
                            </div>

                            <div className="pt-4">
                                <button className="w-full flex items-center justify-center gap-2 bg-white dark:bg-transparent border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800 py-3 rounded-lg text-sm font-medium transition-colors">
                                    <Download className="w-4 h-4" />
                                    Download Invoice
                                </button>
                            </div>
                            
                            {selectedTx.status === 'Failed' && (
                                <button className="w-full bg-red-600 hover:bg-red-500 text-white py-3 rounded-lg text-sm font-medium transition-colors shadow-sm">
                                    Retry Payment
                                </button>
                            )}
                             {selectedTx.status === 'Pending' && (
                                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 text-xs rounded-lg">
                                    This payment is currently being processed. It usually takes 1-2 business days.
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
