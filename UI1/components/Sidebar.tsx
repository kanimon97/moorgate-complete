import React from 'react';
import { Activity, Settings, MoreVertical, MessageSquare, LayoutDashboard, Phone, Users, FileText, GitBranch } from './Icons';
import { cn } from '../utils/cn';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={cn(
      "w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all duration-200 group text-sm font-medium",
      active 
        ? "bg-zinc-100 dark:bg-white/10 text-zinc-900 dark:text-white shadow-sm border border-zinc-200 dark:border-white/5" 
        : "text-zinc-500 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/5"
    )}
  >
    <div className={cn(
      "transition-colors",
      active ? "text-zinc-900 dark:text-white" : "text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-600 dark:group-hover:text-zinc-300"
    )}>
      {icon}
    </div>
    <span>{label}</span>
  </button>
);

interface SidebarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab = 'voice', onTabChange = () => {} }) => {
  return (
    <div className="h-full w-[280px] bg-white dark:bg-black border-r border-zinc-200 dark:border-white/5 flex flex-col p-6 flex-shrink-0 relative z-20 transition-colors duration-300">
      <div className="flex items-center space-x-3 mb-10 px-2">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <span className="font-bold text-white text-lg">C</span>
        </div>
        <div>
          <h1 className="text-sm font-bold text-zinc-900 dark:text-white leading-tight">Ceylinco</h1>
          <p className="text-[10px] text-zinc-500 font-medium tracking-wide uppercase mt-0.5">Insurance Assistant</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        <div className="px-4 py-2 text-[11px] font-semibold text-zinc-400 dark:text-zinc-600 uppercase tracking-wider mb-2">Platform</div>
        <SidebarItem 
          icon={<Activity className="w-4 h-4" />} 
          label="Voice Agent" 
          active={activeTab === 'voice'} 
          onClick={() => onTabChange('voice')}
        />
        <SidebarItem 
          icon={<MessageSquare className="w-4 h-4" />} 
          label="Chat Support" 
          active={activeTab === 'chat'} 
          onClick={() => onTabChange('chat')}
        />
        
        <div className="px-4 py-2 text-[11px] font-semibold text-zinc-400 dark:text-zinc-600 uppercase tracking-wider mt-6 mb-2">Management</div>
        <SidebarItem 
          icon={<Users className="w-4 h-4" />} 
          label="Leads" 
          active={activeTab === 'leads'} 
          onClick={() => onTabChange('leads')}
        />
        <SidebarItem 
          icon={<FileText className="w-4 h-4" />} 
          label="Prompts" 
          active={activeTab === 'prompts'} 
          onClick={() => onTabChange('prompts')}
        />
        <SidebarItem 
          icon={<GitBranch className="w-4 h-4" />} 
          label="Rules Engine" 
          active={activeTab === 'rules'} 
          onClick={() => onTabChange('rules')}
        />

        <div className="px-4 py-2 text-[11px] font-semibold text-zinc-400 dark:text-zinc-600 uppercase tracking-wider mt-6 mb-2">Account</div>
        <SidebarItem 
          icon={<LayoutDashboard className="w-4 h-4" />} 
          label="Dashboard" 
          active={activeTab === 'dashboard'} 
          onClick={() => onTabChange('dashboard')}
        />
        <SidebarItem 
          icon={<Phone className="w-4 h-4" />} 
          label="Call Logs" 
          active={activeTab === 'call-logs'} 
          onClick={() => onTabChange('call-logs')}
        />
        <SidebarItem 
          icon={<Settings className="w-4 h-4" />} 
          label="Settings" 
          active={activeTab === 'settings'}
          onClick={() => onTabChange('settings')}
        />
      </nav>

      <div className="mt-auto">
         <div className="flex items-center p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/5 hover:border-zinc-300 dark:hover:border-white/10 transition-colors cursor-pointer group">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white shadow-md">
                JD
            </div>
            <div className="ml-3 flex-1 overflow-hidden">
                <p className="text-sm font-medium text-zinc-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-200 transition-colors">John Doe</p>
                <p className="text-xs text-zinc-500 truncate">Premium Member</p>
            </div>
            <MoreVertical className="w-4 h-4 text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors" />
         </div>
      </div>
    </div>
  );
};
