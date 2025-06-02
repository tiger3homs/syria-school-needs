
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-8 w-8 px-0 text-primary-foreground hover:bg-primary-foreground/10"
      onClick={toggleLanguage}
    >
      <Globe className="h-4 w-4" />
      <span className="sr-only">Change language</span>
    </Button>
  );
};

export default LanguageSwitcher;
