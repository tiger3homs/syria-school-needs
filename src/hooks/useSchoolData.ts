
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Tables } from '@/integrations/supabase/types';

type School = Tables<'schools'>;
type Need = Tables<'needs'>;

export const useSchoolData = () => {
  const { user } = useAuth();
  const [school, setSchool] = useState<School | null>(null);
  const [needs, setNeeds] = useState<Need[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSchoolData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      
      // Fetch school data using maybeSingle() instead of single()
      const { data: schoolData, error: schoolError } = await supabase
        .from('schools')
        .select('*')
        .eq('principal_id', user.id)
        .maybeSingle();

      if (schoolError) {
        console.error('Error fetching school:', schoolError);
        // Only set error for actual database errors, not missing records
        if (schoolError.code !== 'PGRST116') {
          setError('Failed to fetch school data');
        }
        return;
      }

      if (schoolData) {
        setSchool(schoolData);

        // Fetch needs data if school exists
        const { data: needsData, error: needsError } = await supabase
          .from('needs')
          .select('*')
          .eq('school_id', schoolData.id)
          .order('created_at', { ascending: false });

        if (needsError) {
          console.error('Error fetching needs:', needsError);
          setError('Failed to fetch needs data');
          return;
        }

        setNeeds(needsData || []);
      }
      // If no school exists, we just continue without showing an error
    } catch (err) {
      console.error('Error:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const updateSchool = async (updates: Partial<School>) => {
    if (!school || !user) return false;

    try {
      const { error } = await supabase
        .from('schools')
        .update(updates)
        .eq('id', school.id)
        .eq('principal_id', user.id);

      if (error) {
        console.error('Error updating school:', error);
        return false;
      }

      setSchool({ ...school, ...updates });
      return true;
    } catch (err) {
      console.error('Error updating school:', err);
      return false;
    }
  };

  const createNeed = async (needData: {
    title: string;
    description: string;
    category: string;
    priority: string;
    quantity: number;
    image_url?: string;
  }) => {
    if (!school || !user) return false;

    try {
      const { data, error } = await supabase
        .from('needs')
        .insert({
          ...needData,
          school_id: school.id,
          status: 'pending',
          submitted_by: user.id
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating need:', error);
        return false;
      }

      setNeeds([data, ...needs]);
      return true;
    } catch (err) {
      console.error('Error creating need:', err);
      return false;
    }
  };

  const updateNeed = async (needId: string, updates: Partial<Need>) => {
    if (!school || !user) return false;

    try {
      const { error } = await supabase
        .from('needs')
        .update(updates)
        .eq('id', needId)
        .eq('school_id', school.id);

      if (error) {
        console.error('Error updating need:', error);
        return false;
      }

      setNeeds(needs.map(need => 
        need.id === needId ? { ...need, ...updates } : need
      ));
      return true;
    } catch (err) {
      console.error('Error updating need:', err);
      return false;
    }
  };

  const deleteNeed = async (needId: string) => {
    if (!school || !user) return false;

    try {
      const { error } = await supabase
        .from('needs')
        .delete()
        .eq('id', needId)
        .eq('school_id', school.id);

      if (error) {
        console.error('Error deleting need:', error);
        return false;
      }

      setNeeds(needs.filter(need => need.id !== needId));
      return true;
    } catch (err) {
      console.error('Error deleting need:', err);
      return false;
    }
  };

  useEffect(() => {
    fetchSchoolData();
  }, [user]);

  return {
    school,
    needs,
    loading,
    error,
    updateSchool,
    createNeed,
    updateNeed,
    deleteNeed,
    refetch: fetchSchoolData
  };
};
