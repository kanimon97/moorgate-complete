import React, { useState, useRef, useEffect } from 'react';
import { Conversation, ConversationContent, ConversationEmptyState, ConversationScrollButton } from './Conversation';
import { MessageSquare, ArrowDown, Sun, Moon } from './Icons';
import { cn } from '../utils/cn';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface ChatProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const Chat: React.FC<ChatProps> = ({ isDarkMode, toggleTheme }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const contentRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (contentRef.current) {
        contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');

    // Simulate response
    setTimeout(() => {
        setMessages(prev => [...prev, {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: "Thank you for your message. An agent will review your inquiry shortly."
        }]);
    }, 1000);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-zinc-50 dark:bg-[#0a0a0a] relative overflow-hidden font-sans transition-colors duration-300">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-8 z-20 border-b border-zinc-200 dark:border-white/5 bg-white/50 dark:bg-black/20 backdrop-blur-sm transition-colors duration-300">
            <h2 className="text-sm font-medium text-zinc-600 dark:text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-500" />
                Chat Support
            </h2>

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

        <div ref={contentRef} className="flex-1 overflow-y-auto scroll-smooth">
          <Conversation className="w-full max-w-4xl mx-auto z-10 pb-4">
              {messages.length === 0 ? (
                  <ConversationEmptyState 
                      icon={
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white mb-4 shadow-lg shadow-blue-500/20">
                           <MessageSquare className="w-8 h-8" />
                        </div>
                      }
                      title="Welcome to Support Chat"
                      description="Type a message below to start a new conversation with our AI assistant."
                      className="text-zinc-500 dark:text-zinc-400 mt-20"
                  />
              ) : (
                  <ConversationContent className="p-6 space-y-6">
                      {messages.map((msg) => (
                          <div key={msg.id} className={cn("flex w-full animate-fade-in", msg.role === 'user' ? "justify-end" : "justify-start")}>
                              <div className={cn(
                                  "max-w-[80%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed shadow-sm",
                                  msg.role === 'user' 
                                      ? "bg-blue-600 text-white rounded-br-none" 
                                      : "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 rounded-bl-none"
                              )}>
                                  {msg.content}
                              </div>
                          </div>
                      ))}
                  </ConversationContent>
              )}
          </Conversation>
        </div>

        {/* Input Area */}
        <div className="p-6 z-20">
            <div className="max-w-4xl mx-auto">
                <form onSubmit={handleSubmit} className="relative flex items-center gap-2 bg-white dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200 dark:border-white/10 p-2 rounded-full shadow-lg shadow-black/5 dark:shadow-black/20 transition-colors duration-300">
                    <input 
                        type="text" 
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 bg-transparent px-6 py-3 text-sm text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none"
                    />
                    <button 
                        type="submit"
                        disabled={!inputValue.trim()}
                        className="p-3 rounded-full bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95 shadow-md shadow-blue-500/20"
                    >
                        <ArrowDown className="w-5 h-5 rotate-[-90deg]" />
                    </button>
                </form>
                <p className="text-center text-[10px] text-zinc-400 dark:text-zinc-600 mt-3 transition-colors duration-300">
                    AI can make mistakes. Please verify important information.
                </p>
            </div>
        </div>
    </div>
  );
};
