import React, { useState } from 'react';
import { Plus, ArrowRight, Trash2, GitBranch, Phone, MessageSquare, Clock, AlertCircle, Sun, Moon } from 'lucide-react';

interface Rule {
  id: string;
  condition: string;
  action: string;
  isActive: boolean;
}

export const RulesEngine: React.FC<{ isDarkMode: boolean; toggleTheme: () => void }> = ({ isDarkMode, toggleTheme }) => {
  const [rules, setRules] = useState<Rule[]>([
    { 
      id: '1', 
      condition: 'Customer mentions "Speak to manager"', 
      action: 'Forward to Supervisor', 
      isActive: true 
    },
    { 
      id: '2', 
      condition: 'Call duration > 10 minutes', 
      action: 'Flag for review', 
      isActive: true 
    },
    { 
      id: '3', 
      condition: 'Sentiment is Negative', 
      action: 'Offer callback', 
      isActive: false 
    },
  ]);

  const addRule = () => {
    const newRule: Rule = {
      id: Math.random().toString(36).substr(2, 9),
      condition: 'New Condition',
      action: 'New Action',
      isActive: true
    };
    setRules([...rules, newRule]);
  };

  const deleteRule = (id: string) => {
    setRules(rules.filter(r => r.id !== id));
  };

  const toggleRule = (id: string) => {
    setRules(rules.map(r => r.id === id ? { ...r, isActive: !r.isActive } : r));
  };

  const updateRule = (id: string, field: keyof Rule, value: string) => {
    setRules(rules.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  return (
    <div className={`flex-1 h-full flex flex-col ${isDarkMode ? 'bg-black text-white' : 'bg-zinc-50 text-zinc-900'}`}>
      <header className="flex items-center justify-between px-8 py-6 border-b border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-black/20 backdrop-blur-sm">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Rules Engine</h1>
          <p className="text-sm text-zinc-500 mt-1">Configure call routing and automated actions.</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-white/10 transition-colors"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <div className="h-6 w-px bg-zinc-200 dark:bg-white/10 mx-2"></div>
          <button
            onClick={addRule}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/20"
          >
            <Plus className="w-4 h-4" />
            Add Rule
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-8">
        <div className="grid gap-4 max-w-4xl mx-auto">
          {rules.map((rule, index) => (
            <div 
              key={rule.id}
              className={`relative group bg-white dark:bg-zinc-900 rounded-xl border transition-all duration-200 ${
                rule.isActive 
                  ? 'border-zinc-200 dark:border-white/10 shadow-sm hover:shadow-md' 
                  : 'border-zinc-100 dark:border-white/5 opacity-60'
              }`}
            >
              <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl bg-gradient-to-b from-blue-500 to-purple-500 opacity-0 transition-opacity group-hover:opacity-100" />
              
              <div className="p-6 flex items-center gap-6">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 font-mono text-xs font-bold border border-blue-100 dark:border-blue-500/20">
                    {index + 1}
                  </div>
                  <GitBranch className="w-4 h-4 text-zinc-300 dark:text-zinc-700" />
                </div>

                <div className="flex-1 grid grid-cols-[1fr,auto,1fr] gap-4 items-center">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400">If Condition</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={rule.condition}
                        onChange={(e) => updateRule(rule.id, 'condition', e.target.value)}
                        className="w-full bg-zinc-50 dark:bg-black/50 border border-zinc-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center pt-5 text-zinc-300 dark:text-zinc-600">
                    <ArrowRight className="w-5 h-5" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400">Then Action</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={rule.action}
                        onChange={(e) => updateRule(rule.id, 'action', e.target.value)}
                        className="w-full bg-zinc-50 dark:bg-black/50 border border-zinc-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pl-6 border-l border-zinc-100 dark:border-white/5">
                  <button
                    onClick={() => toggleRule(rule.id)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      rule.isActive ? 'bg-blue-600' : 'bg-zinc-200 dark:bg-zinc-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        rule.isActive ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  <button
                    onClick={() => deleteRule(rule.id)}
                    className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {rules.length === 0 && (
            <div className="text-center py-12 text-zinc-500 border-2 border-dashed border-zinc-200 dark:border-white/10 rounded-xl">
              <p>No rules configured. Add a rule to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
