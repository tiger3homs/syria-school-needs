
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
// For admin operations, ideally you would use the Supabase Service Role Key
// on a secure backend (e.g., Supabase Edge Function, serverless function)
// to bypass Row Level Security (RLS).
//
// In this client-side context, `supabaseAdmin` is currently just the
// regular Supabase client initialized with the public publishable key.
// If RLS is enabled on your tables, this client might not have the
// necessary permissions to perform all admin-like operations.
//
// For development/testing, you might temporarily adjust RLS policies
// in your Supabase project to allow read access for the 'anon' role
// on tables like 'schools' and 'needs'.
export const supabaseAdmin = supabase;
