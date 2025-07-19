import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from '../config/env';
import { ChatMessage, ChatSession } from '../types/api';
import { DigitalTwinProfile, UserProfile } from '../types/user';

// Database types
interface Database {
  public: {
    Tables: {
      users: {
        Row: UserProfile;
        Insert: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>;
        Update: Partial<Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>>;
      };
      digital_twins: {
        Row: DigitalTwinProfile;
        Insert: Omit<DigitalTwinProfile, 'id'>;
        Update: Partial<Omit<DigitalTwinProfile, 'id'>>;
      };
      chat_sessions: {
        Row: ChatSession;
        Insert: Omit<ChatSession, 'id' | 'createdAt' | 'updatedAt'>;
        Update: Partial<Omit<ChatSession, 'id' | 'createdAt' | 'updatedAt'>>;
      };
      chat_messages: {
        Row: ChatMessage;
        Insert: Omit<ChatMessage, 'id' | 'timestamp'>;
        Update: Partial<Omit<ChatMessage, 'id' | 'timestamp'>>;
      };
    };
  };
}

export class SupabaseService {
  private static instance: SupabaseService;
  private client: SupabaseClient<Database>;

  private constructor() {
    if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) {
      throw new Error('Supabase configuration missing');
    }

    this.client = createClient<Database>(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
  }

  public static getInstance(): SupabaseService {
    if (!SupabaseService.instance) {
      SupabaseService.instance = new SupabaseService();
    }
    return SupabaseService.instance;
  }

  // User management
  async createUser(userData: Database['public']['Tables']['users']['Insert']): Promise<UserProfile> {
    const { data, error } = await this.client
      .from('users')
      .insert(userData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getUserById(userId: string): Promise<UserProfile | null> {
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  }

  async updateUser(userId: string, updates: Database['public']['Tables']['users']['Update']): Promise<UserProfile> {
    const { data, error } = await this.client
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Digital Twin management
  async createDigitalTwin(twinData: Database['public']['Tables']['digital_twins']['Insert']): Promise<DigitalTwinProfile> {
    const { data, error } = await this.client
      .from('digital_twins')
      .insert(twinData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getDigitalTwinByUserId(userId: string): Promise<DigitalTwinProfile | null> {
    const { data, error } = await this.client
      .from('digital_twins')
      .select('*')
      .eq('userId', userId)
      .single();

    if (error) throw error;
    return data;
  }

  async updateDigitalTwin(twinId: string, updates: Database['public']['Tables']['digital_twins']['Update']): Promise<DigitalTwinProfile> {
    const { data, error } = await this.client
      .from('digital_twins')
      .update(updates)
      .eq('id', twinId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Chat management
  async createChatSession(sessionData: Database['public']['Tables']['chat_sessions']['Insert']): Promise<ChatSession> {
    const { data, error } = await this.client
      .from('chat_sessions')
      .insert(sessionData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getChatSessionsByUserId(userId: string): Promise<ChatSession[]> {
    const { data, error } = await this.client
      .from('chat_sessions')
      .select('*')
      .eq('userId', userId)
      .order('updatedAt', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async addChatMessage(messageData: Database['public']['Tables']['chat_messages']['Insert']): Promise<ChatMessage> {
    const { data, error } = await this.client
      .from('chat_messages')
      .insert(messageData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getChatMessagesBySessionId(sessionId: string): Promise<ChatMessage[]> {
    const { data, error } = await this.client
      .from('chat_messages')
      .select('*')
      .eq('sessionId', sessionId)
      .order('timestamp', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  // Real-time subscriptions
  subscribeToChatMessages(sessionId: string, callback: (message: ChatMessage) => void) {
    return this.client
      .channel(`chat_messages:${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `sessionId=eq.${sessionId}`,
        },
        (payload) => {
          callback(payload.new as ChatMessage);
        }
      )
      .subscribe();
  }

  // Analytics and insights
  async getUserAnalytics(userId: string): Promise<{
    totalMessages: number;
    averageMood: number;
    mostActiveTime: string;
    favoriteTopics: string[];
  }> {
    // This would contain complex queries to analyze user behavior
    // For now, returning mock data
    return {
      totalMessages: 0,
      averageMood: 5,
      mostActiveTime: 'evening',
      favoriteTopics: [],
    };
  }

  // Cleanup
  async cleanup() {
    await this.client.removeAllChannels();
  }
}

// Export singleton instance
export const supabaseService = SupabaseService.getInstance();

// Export the client for direct access if needed
export const supabase = supabaseService['client'];