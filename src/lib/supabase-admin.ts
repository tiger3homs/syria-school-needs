
import { supabase } from '@/integrations/supabase/client';

// Define our database schema types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          role: string;
          created_at?: string;
          updated_at?: string;
        };
        Insert: {
          id: string;
          email: string;
          role?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          role?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      schools: {
        Row: {
          id: string;
          principal_id: string;
          name: string;
          address: string;
          number_of_students: number;
          contact_phone?: string;
          contact_email?: string;
          description?: string;
          created_at?: string;
          updated_at?: string;
        };
        Insert: {
          id?: string;
          principal_id: string;
          name: string;
          address: string;
          number_of_students: number;
          contact_phone?: string;
          contact_email?: string;
          description?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          principal_id?: string;
          name?: string;
          address?: string;
          number_of_students?: number;
          contact_phone?: string;
          contact_email?: string;
          description?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      needs: {
        Row: {
          id: string;
          school_id: string;
          title: string;
          description?: string;
          category: string;
          quantity: number;
          priority: string;
          status: string;
          created_at?: string;
          updated_at?: string;
        };
        Insert: {
          id?: string;
          school_id: string;
          title: string;
          description?: string;
          category: string;
          quantity: number;
          priority?: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          school_id?: string;
          title?: string;
          description?: string;
          category?: string;
          quantity?: number;
          priority?: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

// Create typed client for admin operations
export const supabaseAdmin = supabase as any;
