export interface User {
  id: string;
  email?: string;
}

export interface Profile {
  id: string;
  email?: string;
  subscription_tier: SubscriptionTier;
  created_at?: string;
  updated_at?: string;
}

export type SubscriptionTier = 'free' | 'basic' | 'plus' | 'pro';

export interface ChatSession {
  id: string;
  user_id: string;
  title: string;
  voice_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at?: string;
}

export interface ApiError {
  error: string;
}

export interface ChatResponse {
  content: string;
}

export interface StreamChunk {
  content?: string;
  error?: string;
}
