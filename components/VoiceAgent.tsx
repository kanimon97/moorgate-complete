import React, { useRef, useEffect } from 'react';
import { Phone, PhoneOff, Sun, Moon } from './Icons';
import { Orb, AgentState } from './Orb';
import { cn } from '../utils/cn';
import { useVapi } from '../hooks/useVapi';

interface VoiceAgentProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const VoiceAgent: React.FC<VoiceAgentProps> = ({ isDarkMode, toggleTheme }) => {
  const { volumeLevel, callStatus, conversationState, toggleCall } = useVapi();
  
  const inputVolumeRef = useRef<number>(0);
  const outputVolumeRef = useRef<number>(0);

  // Map Vapi conversation state to Orb's AgentState
  const getOrbState = (): AgentState => {
    return conversationState === 'inactive' ? null : conversationState;
  };

  // Update volume refs for Orb
  useEffect(() => {
    if (conversationState === 'listening') {
      inputVolumeRef.current = volumeLevel;
      outputVolumeRef.current = 0;
    } else if (conversationState === 'talking') {
      inputVolumeRef.current = 0;
      outputVolumeRef.current = volumeLevel;
    } else {
      inputVolumeRef.current = 0;
      outputVolumeRef.current = 0;
    }
  }, [volumeLevel, conversationState]);

  const isConnected = callStatus === 'active';
  const isConnecting = callStatus === 'loading';

  return (
    <div className="flex-1 flex flex-col h-full bg-zinc-50 dark:bg-[#0a0a0a] relative overflow-hidden font-sans transition-colors duration-300">
      
      {/* Header */}
      <header className="h-16 flex items-center justify-between px-8 z-20 border-b border-zinc-200 dark:border-white/5 bg-white/50 dark:bg-black/20 backdrop-blur-sm transition-colors duration-300">
        <div className="flex items-center space-x-3">
          <h2 className="text-sm font-medium text-zinc-600 dark:text-zinc-400 uppercase tracking-widest">Voice Assistant</h2>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-white/10 transition-colors"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Status Badge */}
          <div className={cn("flex items-center space-x-2 px-3 py-1.5 rounded-full border transition-all duration-300", 
            isConnected 
              ? "bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400" 
              : "bg-zinc-200 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-800 text-zinc-600 dark:text-zinc-500")}>
            <div className={cn("w-1.5 h-1.5 rounded-full", isConnected ? "bg-blue-500 dark:bg-blue-400 animate-pulse shadow-[0_0_8px_rgba(96,165,250,0.5)]" : "bg-zinc-500")} />
            <span className="text-xs font-medium">
              {callStatus === 'inactive' ? 'Offline' : 
               callStatus === 'loading' ? 'Connecting' : 
               callStatus === 'active' ? (
                 conversationState === 'listening' ? 'Listening' : 
                 conversationState === 'talking' ? 'Speaking' : 
                 conversationState === 'thinking' ? 'Thinking' : 'Active'
               ) : 
               callStatus === 'error' ? 'Error' : 'Offline'}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center relative p-8">
        
        {callStatus === 'error' && (
          <div className="absolute top-8 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 px-4 py-2 rounded-lg text-sm z-50">
            Connection error. Please try again.
          </div>
        )}

        {/* Ambient Glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={cn("absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[100px] transition-all duration-1000",
            isConnected ? "bg-blue-500/10 opacity-100" : "bg-zinc-900/0 opacity-0"
          )} />
        </div>

        <div className="relative z-10 flex flex-col items-center w-full max-w-lg">
          
          {/* Orb Container */}
          <div className="w-[160px] h-[160px] flex items-center justify-center mb-10 relative z-30">
            <Orb 
              agentState={getOrbState()}
              inputVolumeRef={inputVolumeRef}
              outputVolumeRef={outputVolumeRef}
              colors={isConnected ? ["#22d3ee", "#3b82f6"] : (isDarkMode ? ["#71717a", "#3f3f46"] : ["#d4d4d8", "#a1a1aa"])}
            />
          </div>

          {/* Controls */}
          <div className="flex flex-col items-center space-y-6">
            <button 
              onClick={toggleCall}
              disabled={isConnecting}
              className={cn(
                "flex items-center justify-center w-16 h-16 rounded-full transition-all duration-300 border backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed",
                isConnected 
                  ? "bg-red-500/10 hover:bg-red-500/20 text-red-500 border-red-500/30" 
                  : "bg-white dark:bg-white text-black border-transparent hover:scale-105 shadow-xl shadow-zinc-200/50 dark:shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]"
              )}
            >
              {isConnecting ? (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : isConnected ? (
                <PhoneOff className="w-6 h-6" />
              ) : (
                <Phone className="w-6 h-6 fill-current" />
              )}
            </button>
            
            <p className={cn("text-xs font-medium tracking-widest uppercase transition-colors duration-300", 
              isConnected ? "text-blue-500 dark:text-blue-400" : "text-zinc-500 dark:text-zinc-600")}>
              {isConnected ? (
                conversationState === 'talking' ? "Speaking" : 
                conversationState === 'listening' ? "Listening" : 
                conversationState === 'thinking' ? "Thinking" : "Active"
              ) : "Start Conversation"}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};