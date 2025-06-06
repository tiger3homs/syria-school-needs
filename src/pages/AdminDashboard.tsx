
import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import AdminHeader from "@/components/AdminHeader";
import AdminAnalytics from "@/components/AdminAnalytics";
import SchoolModerationPanel from "@/components/SchoolModerationPanel";
import AuditLog from "@/components/AuditLog";
import AdminCustomPages from "./AdminCustomPages";
import { BarChart3, Users, History, FileText } from "lucide-react";

const AdminDashboardComponent = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("analytics");

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground">{t('admin.dashboard')}</h2>
          <p className="text-muted-foreground">{t('admin.systemStats')}</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-secondary">
            <TabsTrigger 
              value="analytics" 
              className="flex items-center text-muted-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              {t('admin.analytics')}
            </TabsTrigger>
            <TabsTrigger 
              value="moderation" 
              className="flex items-center text-muted-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Users className="h-4 w-4 mr-2" />
              {t('admin.moderation')}
            </TabsTrigger>
            <TabsTrigger 
              value="pages" 
              className="flex items-center text-muted-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <FileText className="h-4 w-4 mr-2" />
              {t('customPages.title')}
            </TabsTrigger>
            <TabsTrigger 
              value="audit" 
              className="flex items-center text-muted-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
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

          <TabsContent value="pages" className="space-y-6">
            <AdminCustomPages />
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
