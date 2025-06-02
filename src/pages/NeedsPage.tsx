import React from 'react';
import { useTranslation } from 'react-i18next';
import DashboardBottomNav from '@/components/DashboardBottomNav';

const NeedsPage = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-6">{t('nav.needs')}</h1>
        {/* Add your needs page content here */}
      </div>
      <DashboardBottomNav />
    </div>
  );
};

export default NeedsPage;
