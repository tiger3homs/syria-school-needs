
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import { useCallback, useMemo } from 'react';
import { performanceMonitor } from '@/utils/performance';

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();

  // Performance: Memoize current language info
  const currentLanguageInfo = useMemo(() => {
    const isArabic = i18n.language === 'ar';
    return {
      current: isArabic ? 'ar' : 'en',
      next: isArabic ? 'en' : 'ar',
      nextLabel: isArabic ? 'English' : 'العربية',
      isRTL: isArabic
    };
  }, [i18n.language]);

  // Performance: Use useCallback to prevent unnecessary re-renders
  const toggleLanguage = useCallback(() => {
    performanceMonitor.mark('language-switch-start');
    
    const newLang = currentLanguageInfo.next;
    const isRTL = newLang === 'ar';
    
    // Update i18n language
    i18n.changeLanguage(newLang);
    
    // Update document attributes for RTL support
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
    
    // Update meta tags for better SEO
    const htmlLangMeta = document.querySelector('meta[property="og:locale"]');
    if (htmlLangMeta) {
      htmlLangMeta.setAttribute('content', isRTL ? 'ar_SY' : 'en_US');
    }
    
    performanceMonitor.mark('language-switch-end');
    performanceMonitor.measure('language-switch-duration', 'language-switch-start', 'language-switch-end');
  }, [currentLanguageInfo.next, i18n]);

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-8 w-8 px-0 text-white hover:bg-white/10 transition-colors duration-200"
      onClick={toggleLanguage}
      aria-label={`Switch to ${currentLanguageInfo.nextLabel}`}
      title={`Switch to ${currentLanguageInfo.nextLabel}`}
    >
      <Globe className="h-4 w-4" />
      <span className="sr-only">
        {t('common.switchLanguage', `Switch to ${currentLanguageInfo.nextLabel}`)}
      </span>
    </Button>
  );
};

export default LanguageSwitcher;
