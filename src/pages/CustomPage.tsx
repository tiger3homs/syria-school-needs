
import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useCustomPage } from '@/hooks/useCustomPages';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';

const CustomPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: page, isLoading, error } = useCustomPage(slug || '');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading page...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !page) {
    return <Navigate to="/404" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <article className="prose prose-lg max-w-none">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              {page.subject}
            </h1>
            <div className="text-sm text-muted-foreground">
              Last updated: {new Date(page.updated_at).toLocaleDateString()}
            </div>
          </header>
          
          <div className="text-foreground">
            <MarkdownRenderer content={page.content} />
          </div>
        </article>
      </div>
    </div>
  );
};

export default CustomPage;
