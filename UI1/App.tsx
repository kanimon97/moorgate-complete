import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { VoiceAgent } from './components/VoiceAgent';
import { Chat } from './components/Chat';
import { Dashboard } from './components/Dashboard';
import { CallLogs } from './components/CallLogs';
import { Settings } from './components/Settings';
import { Leads } from './components/Leads';
import { Prompts } from './components/Prompts';
import { RulesEngine } from './components/RulesEngine';
import { Prompt } from './types';

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState('voice');
  const [prompts, setPrompts] = useState<Prompt[]>([
    { 
      id: '1', 
      name: 'Insurance Renewal', 
      content: 'Hello, I am calling from Ceylinco Insurance regarding your upcoming policy renewal. Is now a good time to talk?',
      updatedAt: '2 mins ago'
    },
    { 
      id: '2', 
      name: 'Claims Follow-up', 
      content: 'Hi, this is an automated follow-up on your recent claim #12345. We need a few more details to process your request.',
      updatedAt: '1 hour ago'
    },
  ]);

  useEffect(() => {
    // Initial check
    if (document.documentElement.classList.contains('dark')) {
      setIsDarkMode(true);
    } else {
      setIsDarkMode(false);
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    }
  };

  return (
    <div className="flex h-screen w-full bg-zinc-50 dark:bg-black text-zinc-900 dark:text-white selection:bg-blue-500/30 overflow-hidden font-sans transition-colors duration-300">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === 'voice' && (
        <VoiceAgent isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      )}
      {activeTab === 'chat' && (
        <Chat isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      )}
      {activeTab === 'leads' && (
        <Leads isDarkMode={isDarkMode} toggleTheme={toggleTheme} prompts={prompts} />
      )}
      {activeTab === 'prompts' && (
        <Prompts isDarkMode={isDarkMode} toggleTheme={toggleTheme} prompts={prompts} setPrompts={setPrompts} />
      )}
      {activeTab === 'rules' && (
        <RulesEngine isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      )}
      {activeTab === 'dashboard' && (
        <Dashboard isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      )}
      {activeTab === 'call-logs' && (
        <CallLogs isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      )}
      {activeTab === 'settings' && (
        <Settings isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      )}
    </div>
  );
};

export default App;
