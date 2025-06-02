import React from 'react';
import { useTranslation } from 'react-i18next';
import AdminHeader from '@/components/AdminHeader';
import AdminNotificationsList from '@/components/AdminNotificationsList';

const AdminNotificationsPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <AdminHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-6">{t('admin.notifications.title')}</h1>
        <AdminNotificationsList />
      </main>
    </>
  );
};

export default AdminNotificationsPage;
