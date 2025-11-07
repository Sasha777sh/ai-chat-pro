// Типы для приложения

export interface User {
  id: string;
  email: string;
}

export interface Profile {
  id: string;
  email: string | null;
  subscription_tier: 'free' | 'pro';
  subscription_expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ChatSession {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  role: 'user' | 'assistant' | 'ai';
  content: string;
  created_at: string;
}

export interface ApiError {
  error: string;
  status?: number;
}

export interface ChatResponse {
  message?: string;
  error?: string;
}

export interface StreamChunk {
  content?: string;
  error?: string;
  done?: boolean;
}

