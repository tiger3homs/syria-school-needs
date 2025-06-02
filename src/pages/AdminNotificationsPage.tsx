
import React from 'react';
import { useTranslation } from 'react-i18next';
import AdminHeader from '@/components/AdminHeader';
import AdminNotificationsList from '@/components/AdminNotificationsList';
import AdminBottomNav from '@/components/AdminBottomNav';

const AdminNotificationsPage = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <AdminHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-6">{t('admin.notifications.title')}</h1>
        <AdminNotificationsList />
      </main>
      <AdminBottomNav />
    </div>
  );
};

export default AdminNotificationsPage;
