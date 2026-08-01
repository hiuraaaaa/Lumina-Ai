export type ChatRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: number;
  error?: boolean;
  pending?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  model: string;
  messages: ChatMessage[];
}

export interface AiModelOption {
  id: string;
  label: string;
}

export interface AiSettings {
  baseUrl: string;
  apiKey: string;
  model: string;
}
