import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { Home } from 'lucide-react';
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-8xl font-bold text-primary mb-4">404</h1>
          <p className="text-2xl font-semibold text-foreground mb-2">{t('errors.pageNotFoundTitle')}</p>
          <p className="text-muted-foreground mb-8">{t('errors.pageNotFoundDescription')}</p>
        </div>
        
        <Link to="/">
          <Button className="gap-2">
            <Home className="h-4 w-4" />
            {t('errors.returnHome')}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
