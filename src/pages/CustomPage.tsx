import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useCustomPage } from '@/hooks/useCustomPages';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from 'react-i18next';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

interface SupabaseError extends Error {
  code?: string;
  details?: string;
  hint?: string | null;
}

// Special routes that should be handled differently
const SPECIAL_ROUTES = new Set(['404', 'not-found', 'error', 'admin', 'dashboard', 'login', 'register']);

const CustomPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  
  // Handle special routes that shouldn't be treated as custom pages
  if (!slug || SPECIAL_ROUTES.has(slug.toLowerCase())) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Alert variant="destructive">
            <AlertTitle>{t('errors.pageNotFound')}</AlertTitle>
            <AlertDescription>{t('errors.invalidPageRoute')}</AlertDescription>
          </Alert>
          <div className="mt-6">
            <Button variant="outline" onClick={() => window.history.back()} className="flex items-center gap-2">
              <ChevronLeft className="h-4 w-4" />
              {t('common.goBack')}
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  const { data: page, isLoading, error } = useCustomPage(slug);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            <Skeleton className="h-12 w-3/4" /> {/* Title skeleton */}
            <Skeleton className="h-4 w-1/4" /> {/* Date skeleton */}
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Handle various error cases
  if (error || !page) {
    console.error('Error fetching custom page:', error as SupabaseError);
    
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Alert variant="destructive">
            <AlertTitle>
              {(error as SupabaseError)?.code === 'PGRST116' 
                ? t('errors.pageNotFound') 
                : t('errors.errorLoadingPage')}
            </AlertTitle>
            <AlertDescription>
              {(error as SupabaseError)?.code === 'PGRST116' 
                ? t('errors.pageDoesNotExist') 
                : t('errors.tryAgainLater')}
            </AlertDescription>
          </Alert>
          <div className="mt-6">
            <Button variant="outline" onClick={() => window.history.back()} className="flex items-center gap-2">
              <ChevronLeft className="h-4 w-4" />
              {t('common.goBack')}
            </Button>
          </div>
        </div>
      </div>
    );
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
              {t('common.lastUpdated')}: {new Date(page.updated_at).toLocaleDateString()}
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
