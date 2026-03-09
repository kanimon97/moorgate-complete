import React, { useState, useRef } from 'react';
import { Upload, Plus, Trash2, Edit2, Save, FileText, Sun, Moon } from './Icons';
import { Prompt, Lead } from '../types';

interface LeadsProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
  prompts: Prompt[];
}

export const Leads: React.FC<LeadsProps> = ({ isDarkMode, toggleTheme, prompts }) => {
  const [leads, setLeads] = useState<Lead[]>([
    { id: '1', name: 'John Doe', number: '+1234567890', email: 'john@example.com', address: '123 Main St', policyNumber: 'POL-001', promptId: '1' },
    { id: '2', name: 'Jane Smith', number: '+0987654321', email: 'jane@example.com', address: '456 Oak Ave', policyNumber: 'POL-002', promptId: '2' },
  ]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Lead>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n');
      const newLeads: Lead[] = [];
      
      // Simple CSV parsing (assuming Name,Number,Email,Address,PolicyNumber format)
      lines.forEach((line, index) => {
        if (index === 0) return; // Skip header
        const [name, number, email, address, policyNumber] = line.split(',');
        if (name && number) {
          newLeads.push({
            id: Math.random().toString(36).substr(2, 9),
            name: name.trim(),
            number: number.trim(),
            email: email?.trim() || '',
            address: address?.trim() || '',
            policyNumber: policyNumber?.trim() || '',
            promptId: prompts[0]?.id || '', // Default prompt
          });
        }
      });

      setLeads([...leads, ...newLeads]);
    };
    reader.readAsText(file);
  };

  const startEdit = (lead: Lead) => {
    setEditingId(lead.id);
    setEditForm(lead);
  };

  const saveEdit = () => {
    setLeads(leads.map(l => l.id === editingId ? { ...l, ...editForm } as Lead : l));
    setEditingId(null);
    setEditForm({});
  };

  const deleteLead = (id: string) => {
    setLeads(leads.filter(l => l.id !== id));
  };

  const addNewLead = () => {
    const newLead: Lead = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'New Lead',
      number: '',
      email: '',
      address: '',
      policyNumber: '',
      promptId: prompts[0]?.id || '',
    };
    setLeads([...leads, newLead]);
    startEdit(newLead);
  };

  return (
    <div className={`flex-1 h-full flex flex-col ${isDarkMode ? 'bg-black text-white' : 'bg-zinc-50 text-zinc-900'}`}>
      <header className="flex items-center justify-between px-8 py-6 border-b border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-black/20 backdrop-blur-sm">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Leads Management</h1>
          <p className="text-sm text-zinc-500 mt-1">Manage customer contacts and assign prompts.</p>
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
          <input
            type="file"
            accept=".csv"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileUpload}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-lg text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            <Upload className="w-4 h-4" />
            Import CSV
          </button>
          <button
            onClick={addNewLead}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/20"
          >
            <Plus className="w-4 h-4" />
            Add Lead
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-8">
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-white/10 shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-white/10 bg-zinc-50/50 dark:bg-white/5">
                <th className="px-6 py-4 font-medium text-zinc-500">Customer Name</th>
                <th className="px-6 py-4 font-medium text-zinc-500">Phone Number</th>
                <th className="px-6 py-4 font-medium text-zinc-500">Email</th>
                <th className="px-6 py-4 font-medium text-zinc-500">Address</th>
                <th className="px-6 py-4 font-medium text-zinc-500">Policy Number</th>
                <th className="px-6 py-4 font-medium text-zinc-500">Assigned Prompt</th>
                <th className="px-6 py-4 font-medium text-zinc-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-white/5">
              {leads.map((lead) => (
                <tr key={lead.id} className="group hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    {editingId === lead.id ? (
                      <input
                        type="text"
                        value={editForm.name || ''}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="w-full bg-transparent border-b border-blue-500 focus:outline-none px-1 py-0.5"
                      />
                    ) : (
                      <div className="font-medium">{lead.name}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 font-mono text-zinc-500">
                    {editingId === lead.id ? (
                      <input
                        type="text"
                        value={editForm.number || ''}
                        onChange={(e) => setEditForm({ ...editForm, number: e.target.value })}
                        className="w-full bg-transparent border-b border-blue-500 focus:outline-none px-1 py-0.5"
                      />
                    ) : (
                      lead.number
                    )}
                  </td>
                  <td className="px-6 py-4 text-zinc-500">
                    {editingId === lead.id ? (
                      <input
                        type="text"
                        value={editForm.email || ''}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        className="w-full bg-transparent border-b border-blue-500 focus:outline-none px-1 py-0.5"
                      />
                    ) : (
                      lead.email || '-'
                    )}
                  </td>
                  <td className="px-6 py-4 text-zinc-500">
                    {editingId === lead.id ? (
                      <input
                        type="text"
                        value={editForm.address || ''}
                        onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                        className="w-full bg-transparent border-b border-blue-500 focus:outline-none px-1 py-0.5"
                      />
                    ) : (
                      lead.address || '-'
                    )}
                  </td>
                  <td className="px-6 py-4 font-mono text-zinc-500">
                    {editingId === lead.id ? (
                      <input
                        type="text"
                        value={editForm.policyNumber || ''}
                        onChange={(e) => setEditForm({ ...editForm, policyNumber: e.target.value })}
                        className="w-full bg-transparent border-b border-blue-500 focus:outline-none px-1 py-0.5"
                      />
                    ) : (
                      lead.policyNumber || '-'
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editingId === lead.id ? (
                      <select
                        value={editForm.promptId || ''}
                        onChange={(e) => setEditForm({ ...editForm, promptId: e.target.value })}
                        className="bg-zinc-100 dark:bg-zinc-800 border-none rounded px-2 py-1 text-xs focus:ring-1 focus:ring-blue-500"
                      >
                        {prompts.map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    ) : (
                      <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs w-fit border border-blue-200 dark:border-blue-500/20">
                        <FileText className="w-3 h-3" />
                        {prompts.find(p => p.id === lead.promptId)?.name || 'Unknown Prompt'}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {editingId === lead.id ? (
                        <button
                          onClick={saveEdit}
                          className="p-1.5 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => startEdit(lead)}
                          className="p-1.5 text-zinc-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteLead(lead.id)}
                        className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {leads.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-zinc-500">
                    No leads found. Import a CSV or add one manually.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
