import React from 'react';
import { cn } from '../utils/cn';

export const Conversation = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return <div className={cn("flex-1 flex flex-col overflow-hidden relative", className)}>{children}</div>;
};

export const ConversationContent = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <div className={cn("flex-1 overflow-y-auto scroll-smooth custom-scrollbar", className)}>
      {children}
    </div>
  );
};

export const ConversationEmptyState = ({ icon, title, description, className }: { icon: React.ReactNode, title: string, description: string, className?: string }) => {
  return (
    <div className={cn("flex-1 flex flex-col items-center justify-center p-8 text-center animate-fade-in", className)}>
      {icon}
      <h3 className="text-lg font-semibold mt-4 mb-2">{title}</h3>
      <p className="max-w-xs mx-auto text-sm opacity-70 leading-relaxed">{description}</p>
    </div>
  );
};

export const ConversationScrollButton = () => {
  // Placeholder for scroll-to-bottom logic if needed in the future
  return null;
};
