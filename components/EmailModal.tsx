
import React, { useState, useEffect } from 'react';
import { EmailDetails } from '../types';
import { Icon } from './Icon';

interface EmailModalProps {
  details: EmailDetails | null;
  onSend: (recipient: string) => void;
  onClose: () => void;
}

export const EmailModal: React.FC<EmailModalProps> = ({ details, onSend, onClose }) => {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);

  useEffect(() => {
    if (details) {
      setEmail(details.recipient || '');
      setIsSent(false);
    }
  }, [details]);

  if (!details) return null;

  const handleSend = () => {
    if (email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      onSend(email);
      setIsSent(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } else {
      alert('Please enter a valid email address.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full transform transition-all duration-300 scale-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Email Conversation Summary</h2>
        {!isSent ? (
          <>
            <p className="text-gray-600 mb-6">The agent has prepared a summary of your discussion. Please confirm your email address to receive it.</p>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Recipient Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                placeholder="you@example.com"
              />
            </div>
            <p className="text-xs text-gray-500 mb-6 bg-gray-50 p-3 rounded-lg border">
              <strong>Summary:</strong> {details.summary}
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={onClose}
                className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSend}
                className="px-6 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition flex items-center space-x-2"
              >
                <Icon type="send" className="w-5 h-5" />
                <span>Send</span>
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-xl font-semibold text-gray-700">Email Sent Successfully!</p>
          </div>
        )}
      </div>
    </div>
  );
};
