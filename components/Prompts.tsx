import React, { useState } from 'react';
import { Plus, Trash2, Save, Search, FileText, MoreVertical, Sun, Moon } from './Icons';
import { Prompt } from '../types';

interface PromptsProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
  prompts: Prompt[];
  setPrompts: React.Dispatch<React.SetStateAction<Prompt[]>>;
}

export const Prompts: React.FC<PromptsProps> = ({ isDarkMode, toggleTheme, prompts, setPrompts }) => {
  const [selectedPromptId, setSelectedPromptId] = useState<string | null>('1');
  const [searchQuery, setSearchQuery] = useState('');

  const selectedPrompt = prompts.find(p => p.id === selectedPromptId);

  const handleSave = () => {
    alert('Prompt saved successfully!');
  };

  const handleDelete = (id: string) => {
    setPrompts(prompts.filter(p => p.id !== id));
    if (selectedPromptId === id) {
      setSelectedPromptId(null);
    }
  };

  const createNewPrompt = () => {
    const newPrompt: Prompt = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'Untitled Prompt',
      content: '',
      updatedAt: 'Just now'
    };
    setPrompts([newPrompt, ...prompts]);
    setSelectedPromptId(newPrompt.id);
  };

  const updatePrompt = (field: keyof Prompt, value: string) => {
    if (!selectedPromptId) return;
    setPrompts(prompts.map(p => 
      p.id === selectedPromptId ? { ...p, [field]: value } : p
    ));
  };

  const filteredPrompts = prompts.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`flex-1 h-full flex flex-col overflow-hidden ${isDarkMode ? 'bg-black text-white' : 'bg-zinc-50 text-zinc-900'}`}>
      <header className="flex items-center justify-between px-8 py-6 border-b border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-black/20 backdrop-blur-sm">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Prompts Library</h1>
          <p className="text-sm text-zinc-500 mt-1">Manage and edit your AI agent prompts.</p>
        </div>
        <div className="flex items-center gap-4">
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
        <div className="w-80 border-r border-zinc-200 dark:border-white/10 flex flex-col bg-white dark:bg-zinc-900/50">
          <div className="p-4 border-b border-zinc-200 dark:border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Saved Prompts</h2>
              <button 
                onClick={createNewPrompt}
                className="p-1.5 hover:bg-zinc-100 dark:hover:bg-white/10 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search prompts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-zinc-100 dark:bg-black/50 border border-transparent focus:bg-white dark:focus:bg-black focus:border-blue-500 rounded-lg text-sm outline-none transition-all"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filteredPrompts.map(prompt => (
              <button
                key={prompt.id}
                onClick={() => setSelectedPromptId(prompt.id)}
                className={`w-full text-left p-3 rounded-xl transition-all group relative ${
                  selectedPromptId === prompt.id 
                    ? 'bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20' 
                    : 'hover:bg-zinc-100 dark:hover:bg-white/5 border border-transparent'
                }`}
              >
                <div className="flex items-start justify-between mb-1">
                  <span className={`font-medium text-sm ${selectedPromptId === prompt.id ? 'text-blue-700 dark:text-blue-300' : 'text-zinc-900 dark:text-zinc-200'}`}>
                    {prompt.name}
                  </span>
                  {selectedPromptId === prompt.id && (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="w-3 h-3 text-blue-400" />
                    </div>
                  )}
                </div>
                <p className="text-xs text-zinc-500 line-clamp-2 mb-2">
                  {prompt.content || 'No content...'}
                </p>
                <div className="flex items-center gap-2 text-[10px] text-zinc-400">
                  <FileText className="w-3 h-3" />
                  <span>{prompt.updatedAt}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col h-full overflow-hidden bg-zinc-50/50 dark:bg-black">
          {selectedPrompt ? (
            <>
              <header className="flex items-center justify-between px-8 py-4 border-b border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900">
                <input
                  type="text"
                  value={selectedPrompt.name}
                  onChange={(e) => updatePrompt('name', e.target.value)}
                  className="text-xl font-semibold bg-transparent border-none focus:ring-0 p-0 w-full max-w-md placeholder-zinc-400"
                  placeholder="Prompt Name"
                />
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleDelete(selectedPrompt.id)}
                    className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={handleSave}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/20"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>
              </header>
              
              <div className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-3xl mx-auto">
                  <label className="block text-sm font-medium text-zinc-500 mb-2 uppercase tracking-wider">Prompt Content</label>
                  <textarea
                    value={selectedPrompt.content}
                    onChange={(e) => updatePrompt('content', e.target.value)}
                    className="w-full h-[calc(100vh-250px)] p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none text-base leading-relaxed font-mono shadow-sm"
                    placeholder="Type your prompt here..."
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-zinc-400">
              <FileText className="w-12 h-12 mb-4 opacity-20" />
              <p>Select a prompt to edit or create a new one.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
