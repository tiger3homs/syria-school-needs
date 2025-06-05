
import { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import { Skeleton } from '@/components/ui/skeleton';

interface CustomPageData {
  id: string;
  subject: string;
  slug: string;
  content: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

const CustomPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const [page, setPage] = useState<CustomPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchPage = async () => {
      if (!slug) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('custom_pages')
          .select('*')
          .eq('slug', slug)
          .eq('published', true)
          .single();

        if (error || !data) {
          setNotFound(true);
        } else {
          setPage(data);
          // Update document title
          document.title = `${data.subject} - School Rebuild Syria`;
        }
      } catch (error) {
        console.error('Error fetching custom page:', error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [slug]);

  // Add dynamic styles for RTL support
  useEffect(() => {
    const styleId = 'custom-page-styles';
    let existingStyle = document.getElementById(styleId);
    
    if (!existingStyle) {
      existingStyle = document.createElement('style');
      existingStyle.id = styleId;
      document.head.appendChild(existingStyle);
    }

    existingStyle.textContent = `
      .prose-rtl {
        direction: rtl;
        text-align: right;
      }
      .prose-rtl h1,
      .prose-rtl h2,
      .prose-rtl h3,
      .prose-rtl h4,
      .prose-rtl h5,
      .prose-rtl h6 {
        text-align: right;
      }
      .prose-rtl p {
        text-align: right;
      }
      .prose-rtl ul,
      .prose-rtl ol {
        padding-right: 1.5rem;
        padding-left: 0;
      }
      .prose img {
        max-width: 100%;
        height: auto;
        border-radius: 8px;
        margin: 1rem auto;
        display: block;
      }
    `;

    return () => {
      if (existingStyle && existingStyle.parentNode) {
        existingStyle.parentNode.removeChild(existingStyle);
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-12 w-3/4 mb-6" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (notFound) {
    return <Navigate to="/404" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <article className={`bg-white rounded-lg shadow-sm p-8 ${isRTL ? 'rtl' : 'ltr'}`}>
            <header className="mb-8">
              <h1 className={`text-4xl font-bold text-gray-900 mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                {page?.subject}
              </h1>
              <div className={`text-sm text-gray-500 ${isRTL ? 'text-right' : 'text-left'}`}>
                {page?.updated_at && (
                  <time dateTime={page.updated_at}>
                    آخر تحديث: {new Date(page.updated_at).toLocaleDateString('ar-SY')}
                  </time>
                )}
              </div>
            </header>

            <div 
              className={`prose prose-lg max-w-none ${isRTL ? 'prose-rtl' : ''}`}
              style={{
                direction: isRTL ? 'rtl' : 'ltr',
                textAlign: isRTL ? 'right' : 'left'
              }}
              dangerouslySetInnerHTML={{ __html: page?.content || '' }}
            />
          </article>
        </div>
      </div>
    </div>
  );
};

export default CustomPage;
