
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface School {
  id: string;
  name: string;
  address: string;
  governorate: string | null;
  education_level: string | null;
  number_of_students: number;
  contact_phone: string | null;
  contact_email: string | null;
  description: string | null;
  image_url: string | null;
  status: string | null;
}

interface Need {
  id: string;
  title: string;
  description: string | null;
  category: string;
  priority: string;
  quantity: number;
  status: string;
  image_url: string | null;
  created_at: string;
  submitted_by: string | null;
  fulfilled_by: string | null;
  fulfilled_at: string | null;
}

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
        // Create a complete School object with all fields including education_level
        const completeSchoolData: School = {
          id: schoolData.id,
          name: schoolData.name,
          address: schoolData.address,
          governorate: schoolData.governorate,
          education_level: schoolData.education_level,
          number_of_students: schoolData.number_of_students,
          contact_phone: schoolData.contact_phone,
          contact_email: schoolData.contact_email,
          description: schoolData.description,
          image_url: schoolData.image_url || null,
          status: schoolData.status || null
        };
        setSchool(completeSchoolData);

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

        // Transform needs data to include new audit fields
        const transformedNeeds: Need[] = (needsData || []).map(need => ({
          id: need.id,
          title: need.title,
          description: need.description,
          category: need.category,
          priority: need.priority,
          quantity: need.quantity,
          status: need.status,
          image_url: need.image_url,
          created_at: need.created_at,
          submitted_by: need.submitted_by,
          fulfilled_by: need.fulfilled_by,
          fulfilled_at: need.fulfilled_at
        }));

        setNeeds(transformedNeeds);
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

      // Transform the response to match our Need interface
      const transformedNeed: Need = {
        id: data.id,
        title: data.title,
        description: data.description,
        category: data.category,
        priority: data.priority,
        quantity: data.quantity,
        status: data.status,
        image_url: data.image_url,
        created_at: data.created_at,
        submitted_by: data.submitted_by,
        fulfilled_by: data.fulfilled_by,
        fulfilled_at: data.fulfilled_at
      };

      setNeeds([transformedNeed, ...needs]);
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
