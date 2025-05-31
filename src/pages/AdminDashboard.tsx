
import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import AdminHeader from "@/components/AdminHeader";
import AdminAnalytics from "@/components/AdminAnalytics";
import SchoolModerationPanel from "@/components/SchoolModerationPanel";
import AdminNotifications from "@/components/AdminNotifications";
import AuditLog from "@/components/AuditLog";
import { BarChart3, Users, Bell, History } from "lucide-react";

const AdminDashboardComponent = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("analytics");

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">{t('admin.dashboard')}</h2>
          <p className="text-gray-600">{t('admin.systemStats')}</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="analytics" className="flex items-center">
              <BarChart3 className="h-4 w-4 mr-2" />
              {t('admin.analytics')}
            </TabsTrigger>
            <TabsTrigger value="moderation" className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              {t('admin.moderation')}
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center">
              <Bell className="h-4 w-4 mr-2" />
              {t('admin.notifications')}
            </TabsTrigger>
            <TabsTrigger value="audit" className="flex items-center">
              <History className="h-4 w-4 mr-2" />
              {t('admin.auditLog')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-6">
            <AdminAnalytics />
          </TabsContent>

          <TabsContent value="moderation" className="space-y-6">
            <SchoolModerationPanel />
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <AdminNotifications />
          </TabsContent>

          <TabsContent value="audit" className="space-y-6">
            <AuditLog />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

const AdminDashboard = () => (
  <ProtectedRoute requiredRole="admin">
    <AdminDashboardComponent />
  </ProtectedRoute>
);

export default AdminDashboard;
