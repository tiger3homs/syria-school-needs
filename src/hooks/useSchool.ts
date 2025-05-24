
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface School {
  id: string;
  name: string;
  address: string;
  number_of_students: number;
  contact_phone?: string;
  contact_email?: string;
  description?: string;
}

export const useSchool = () => {
  const [school, setSchool] = useState<School | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchSchool();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchSchool = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('schools')
        .select('*')
        .eq('principal_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        throw error;
      }

      setSchool(data);
    } catch (error: any) {
      console.error('Error fetching school:', error);
      toast({
        title: "Error loading school",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createSchool = async (schoolData: Omit<School, 'id'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('schools')
        .insert([{
          ...schoolData,
          principal_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;

      setSchool(data);
      toast({
        title: "School created successfully",
        description: "Your school profile has been created.",
      });

      return data;
    } catch (error: any) {
      toast({
        title: "Error creating school",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateSchool = async (updates: Partial<Omit<School, 'id'>>) => {
    if (!user || !school) return;

    try {
      const { data, error } = await supabase
        .from('schools')
        .update(updates)
        .eq('id', school.id)
        .select()
        .single();

      if (error) throw error;

      setSchool(data);
      toast({
        title: "School updated successfully",
        description: "Your school profile has been updated.",
      });

      return data;
    } catch (error: any) {
      toast({
        title: "Error updating school",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    school,
    loading,
    createSchool,
    updateSchool,
    refetch: fetchSchool
  };
};
