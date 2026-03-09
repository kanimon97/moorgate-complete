

export enum AgentStatus {
  IDLE = 'IDLE',
  CONNECTING = 'CONNECTING',
  LISTENING = 'LISTENING',
  THINKING = 'THINKING',
  SPEAKING = 'SPEAKING',
  ERROR = 'ERROR',
}

export interface TranscriptMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}

// Fix: Add EmailDetails interface to resolve the import error in EmailModal.tsx.
export interface EmailDetails {
  recipient?: string;
  summary: string;
}

export interface Prompt {
  id: string;
  name: string;
  content: string;
  updatedAt: string;
}

export interface Lead {
  id: string;
  name: string;
  number: string;
  email: string;
  address: string;
  policyNumber: string;
  promptId: string;
}
