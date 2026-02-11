import React, { useState } from 'react';
import { 
    Sun, Moon, User, Bell, Lock, Shield, ChevronRight
} from './Icons';
import { cn } from '../utils/cn';

interface SettingsProps {
    isDarkMode: boolean;
    toggleTheme: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ isDarkMode, toggleTheme }) => {
    const [activeSection, setActiveSection] = useState('profile');

    const sections = [
        { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
        { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
        { id: 'security', label: 'Security', icon: <Lock className="w-4 h-4" /> },
        { id: 'plan', label: 'Plan & Billing', icon: <Shield className="w-4 h-4" /> },
    ];

    return (
        <div className="flex-1 flex flex-col h-full bg-zinc-50 dark:bg-[#0a0a0a] relative overflow-hidden font-sans transition-colors duration-300">
             {/* Header */}
            <header className="h-16 flex items-center justify-between px-8 z-20 border-b border-zinc-200 dark:border-white/5 bg-white/50 dark:bg-black/20 backdrop-blur-sm sticky top-0">
                <h2 className="text-sm font-medium text-zinc-600 dark:text-zinc-400 uppercase tracking-widest">Settings</h2>
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
                {/* Sidebar */}
                <div className="w-64 flex flex-col p-6 border-r border-zinc-200 dark:border-white/5 bg-white dark:bg-zinc-900/50">
                    <nav className="space-y-1">
                        {sections.map(section => (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                className={cn(
                                    "w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                                    activeSection === section.id 
                                        ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white" 
                                        : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-200"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    {section.icon}
                                    {section.label}
                                </div>
                                {activeSection === section.id && <ChevronRight className="w-4 h-4 text-zinc-400" />}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-12">
                    <div className="max-w-2xl">
                        {activeSection === 'profile' && (
                            <div className="space-y-8 animate-fade-in">
                                <div>
                                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Profile</h2>
                                    <p className="text-zinc-500 dark:text-zinc-400 mt-1">Manage your personal information.</p>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                                        JD
                                    </div>
                                    <div>
                                        <button className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors">
                                            Change Avatar
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">First Name</label>
                                        <input type="text" defaultValue="John" className="w-full px-4 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors text-zinc-900 dark:text-white" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Last Name</label>
                                        <input type="text" defaultValue="Doe" className="w-full px-4 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors text-zinc-900 dark:text-white" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Email Address</label>
                                    <input type="email" defaultValue="john.doe@ceylinco.com" className="w-full px-4 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors text-zinc-900 dark:text-white" />
                                </div>
                                <div className="pt-4">
                                    <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm">
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeSection === 'notifications' && (
                            <div className="space-y-8 animate-fade-in">
                                <div>
                                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Notifications</h2>
                                    <p className="text-zinc-500 dark:text-zinc-400 mt-1">Configure how you receive alerts.</p>
                                </div>
                                <div className="space-y-4">
                                    {['Email Notifications', 'Push Notifications', 'SMS Alerts', 'Weekly Digest'].map(item => (
                                        <div key={item} className="flex items-center justify-between p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                                            <span className="font-medium text-zinc-900 dark:text-white">{item}</span>
                                            <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                                                <input type="checkbox" name="toggle" id={item} className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer border-zinc-300 checked:right-0 checked:border-blue-600" />
                                                <label htmlFor={item} className="toggle-label block overflow-hidden h-5 rounded-full bg-zinc-300 cursor-pointer checked:bg-blue-600"></label>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeSection === 'security' && (
                            <div className="space-y-8 animate-fade-in">
                                <div>
                                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Security</h2>
                                    <p className="text-zinc-500 dark:text-zinc-400 mt-1">Protect your account.</p>
                                </div>
                                <div className="space-y-6">
                                    <button className="w-full flex items-center justify-between p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                                        <div className="text-left">
                                            <p className="font-medium text-zinc-900 dark:text-white">Change Password</p>
                                            <p className="text-xs text-zinc-500">Last changed 3 months ago</p>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-zinc-400" />
                                    </button>
                                    <button className="w-full flex items-center justify-between p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                                        <div className="text-left">
                                            <p className="font-medium text-zinc-900 dark:text-white">Two-Factor Authentication</p>
                                            <p className="text-xs text-emerald-500">Enabled</p>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-zinc-400" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeSection === 'plan' && (
                            <div className="space-y-8 animate-fade-in">
                                <div>
                                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Plan & Billing</h2>
                                    <p className="text-zinc-500 dark:text-zinc-400 mt-1">Manage your subscription.</p>
                                </div>
                                <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <p className="text-blue-100 font-medium mb-1">Current Plan</p>
                                            <h3 className="text-2xl font-bold">Enterprise Pro</h3>
                                        </div>
                                        <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm">Active</span>
                                    </div>
                                    <div className="mb-6">
                                        <p className="text-3xl font-bold">$99<span className="text-lg font-normal text-blue-200">/mo</span></p>
                                    </div>
                                    <button className="w-full bg-white text-blue-600 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                                        Upgrade Plan
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
