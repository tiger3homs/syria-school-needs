
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://fdusgurjkmdroacxtrtb.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkdXNndXJqa21kcm9hY3h0cnRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxMTEwMDgsImV4cCI6MjA2MzY4NzAwOH0.Kpq_kpqiT74BmHZx9AlRGjTJSzZ3O4WfkkCRZ4wfuDk";

// Define our database schema types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: string;
          created_at?: string;
          updated_at?: string;
        };
        Insert: {
          id: string;
          role: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          role?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      schools: {
        Row: {
          id: string;
          name: string;
          address: string;
          number_of_students: number;
          contact_phone?: string;
          contact_email?: string;
          created_at?: string;
          updated_at?: string;
        };
        Insert: {
          id?: string;
          name: string;
          address: string;
          number_of_students: number;
          contact_phone?: string;
          contact_email?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          address?: string;
          number_of_students?: number;
          contact_phone?: string;
          contact_email?: string;
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
          priority: string;
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
export const supabaseAdmin = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
