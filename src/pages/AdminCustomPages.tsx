
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import AdminHeader from '@/components/AdminHeader';
import { CustomPagesManager } from '@/components/CustomPagesManager';

const AdminCustomPagesComponent = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CustomPagesManager />
      </main>
    </div>
  );
};

const AdminCustomPages = () => (
  <ProtectedRoute requiredRole="admin">
    <AdminCustomPagesComponent />
  </ProtectedRoute>
);

export default AdminCustomPages;
