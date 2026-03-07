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
  email?: string;
  address?: string;
  policyNumber?: string;
  promptId: string;
}

export interface Rule {
  id: string;
  condition: string;
  action: string;
  isActive: boolean;
}
