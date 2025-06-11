
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface CustomPage {
  id: string;
  subject: string;
  slug: string;
  content: string;
  created_by: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateCustomPageData {
  subject: string;
  slug: string;
  content: string;
  published?: boolean;
}

export const useCustomPages = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all custom pages (admin view)
  const {
    data: customPages,
    isLoading,
    error
  } = useQuery({
    queryKey: ['customPages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('custom_pages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as CustomPage[];
    }
  });

  // Create custom page mutation
  const createPageMutation = useMutation({
    mutationFn: async (pageData: CreateCustomPageData) => {
      const { data, error } = await supabase
        .from('custom_pages')
        .insert({
          subject: pageData.subject,
          slug: pageData.slug,
          content: pageData.content,
          published: pageData.published ?? true,
          created_by: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customPages'] });
      toast({
        title: "Success",
        description: "Custom page created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create custom page",
        variant: "destructive",
      });
    }
  });

  // Update custom page mutation
  const updatePageMutation = useMutation({
    mutationFn: async ({ id, ...pageData }: CreateCustomPageData & { id: string }) => {
      const { data, error } = await supabase
        .from('custom_pages')
        .update({
          subject: pageData.subject,
          slug: pageData.slug,
          content: pageData.content,
          published: pageData.published,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customPages'] });
      toast({
        title: "Success",
        description: "Custom page updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update custom page",
        variant: "destructive",
      });
    }
  });

  // Delete custom page mutation
  const deletePageMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('custom_pages')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customPages'] });
      toast({
        title: "Success",
        description: "Custom page deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete custom page",
        variant: "destructive",
      });
    }
  });

  return {
    customPages,
    isLoading,
    error,
    createPage: createPageMutation.mutate,
    updatePage: updatePageMutation.mutate,
    deletePage: deletePageMutation.mutate,
    isCreating: createPageMutation.isPending,
    isUpdating: updatePageMutation.isPending,
    isDeleting: deletePageMutation.isPending
  };
};

// Hook to fetch a single custom page by slug (for public viewing)
export const useCustomPage = (slug: string) => {
  return useQuery({
    queryKey: ['customPage', slug],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('custom_pages')
          .select('*')
          .eq('slug', slug)
          .eq('published', true)
          .single();

        if (error) {
          console.error('Error fetching custom page:', error);
          throw error;
        }

        if (!data) {
          const error = new Error('Page not found');
          (error as any).code = 'PGRST116';
          throw error;
        }
        
        return data as CustomPage;
      } catch (error) {
        // Log and re-throw the error
        console.error('Error in useCustomPage:', error);
        throw error;
      }
    },
    enabled: !!slug,
    retry: false // Don't retry if the page doesn't exist
  });
};
