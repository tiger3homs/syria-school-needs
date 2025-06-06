
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import NotFound from './NotFound';

const CustomPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const { data: page, isLoading, error } = useQuery({
    queryKey: ['custom-page', slug],
    queryFn: async () => {
      if (!slug) throw new Error('No slug provided');
      
      const { data, error } = await supabase
        .from('custom_pages')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !page) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <article className={`prose prose-lg max-w-none ${isRTL ? 'prose-right' : 'prose-left'}`}>
          <header className="mb-8">
            <h1 className={`text-3xl font-bold text-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
              {page.subject}
            </h1>
            <div className={`text-sm text-muted-foreground mt-2 ${isRTL ? 'text-right' : 'text-left'}`}>
              {new Date(page.created_at).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </header>
          
          <div 
            className={`prose-content ${isRTL ? 'text-right' : 'text-left'}`}
            dir={isRTL ? 'rtl' : 'ltr'}
            style={{ direction: isRTL ? 'rtl' : 'ltr' }}
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        </article>
      </main>
    </div>
  );
};

export default CustomPage;
