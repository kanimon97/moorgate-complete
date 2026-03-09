import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { VoiceAgent } from './components/VoiceAgent';
import { Chat } from './components/Chat';
import { Dashboard } from './components/Dashboard';
import { Policies } from './components/Policies';
import { Claims } from './components/Claims';
import { Payments } from './components/Payments';
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
    { id: '1', name: 'Default Prompt', content: 'You are a helpful assistant...', updatedAt: '2 days ago' },
    { id: '2', name: 'Sales Prompt', content: 'You are a sales expert...', updatedAt: '1 week ago' },
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

  const renderContent = () => {
    switch (activeTab) {
      case 'voice':
        return <VoiceAgent isDarkMode={isDarkMode} toggleTheme={toggleTheme} />;
      case 'chat':
        return <Chat isDarkMode={isDarkMode} toggleTheme={toggleTheme} />;
      case 'dashboard':
        return <Dashboard isDarkMode={isDarkMode} toggleTheme={toggleTheme} />;
      case 'leads':
        return <Leads isDarkMode={isDarkMode} toggleTheme={toggleTheme} prompts={prompts} />;
      case 'prompts':
        return <Prompts isDarkMode={isDarkMode} toggleTheme={toggleTheme} prompts={prompts} setPrompts={setPrompts} />;
      case 'rules':
        return <RulesEngine isDarkMode={isDarkMode} toggleTheme={toggleTheme} />;
      case 'call-logs':
        return <CallLogs isDarkMode={isDarkMode} toggleTheme={toggleTheme} />;
      case 'settings':
        return <Settings isDarkMode={isDarkMode} toggleTheme={toggleTheme} />;
      // Temporarily commented out
      // case 'policies':
      //   return <Policies isDarkMode={isDarkMode} toggleTheme={toggleTheme} />;
      // case 'claims':
      //   return <Claims isDarkMode={isDarkMode} toggleTheme={toggleTheme} />;
      // case 'payments':
      //   return <Payments isDarkMode={isDarkMode} toggleTheme={toggleTheme} />;
      default:
        return <VoiceAgent isDarkMode={isDarkMode} toggleTheme={toggleTheme} />;
    }
  };

  return (
    <div className="h-screen w-full bg-zinc-50 dark:bg-black text-zinc-900 dark:text-white selection:bg-blue-500/30 overflow-hidden font-sans transition-colors duration-300 flex">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      {renderContent()}
    </div>
  );
};

export default App;
