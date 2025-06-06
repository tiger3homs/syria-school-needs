
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
      
      {/* Main Content - Mobile First */}
      <main className="px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-7xl mx-auto">
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-1 sm:mb-2">
            {t('admin.dashboard')}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            {t('admin.systemStats')}
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          {/* Mobile-First Tab Navigation */}
          <div className="bg-secondary rounded-lg p-1">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 bg-transparent gap-1 h-auto">
              <TabsTrigger 
                value="analytics" 
                className="flex flex-col sm:flex-row items-center justify-center px-2 py-3 sm:py-2 text-xs sm:text-sm text-muted-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md transition-all"
              >
                <BarChart3 className="h-4 w-4 mb-1 sm:mb-0 sm:mr-2" />
                <span className="hidden sm:inline">{t('admin.analytics')}</span>
                <span className="sm:hidden">Analytics</span>
              </TabsTrigger>
              <TabsTrigger 
                value="moderation" 
                className="flex flex-col sm:flex-row items-center justify-center px-2 py-3 sm:py-2 text-xs sm:text-sm text-muted-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md transition-all"
              >
                <Users className="h-4 w-4 mb-1 sm:mb-0 sm:mr-2" />
                <span className="hidden sm:inline">{t('admin.moderation')}</span>
                <span className="sm:hidden">Schools</span>
              </TabsTrigger>
              <TabsTrigger 
                value="pages" 
                className="flex flex-col sm:flex-row items-center justify-center px-2 py-3 sm:py-2 text-xs sm:text-sm text-muted-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md transition-all"
              >
                <FileText className="h-4 w-4 mb-1 sm:mb-0 sm:mr-2" />
                <span className="hidden sm:inline">{t('customPages.title')}</span>
                <span className="sm:hidden">Pages</span>
              </TabsTrigger>
              <TabsTrigger 
                value="audit" 
                className="flex flex-col sm:flex-row items-center justify-center px-2 py-3 sm:py-2 text-xs sm:text-sm text-muted-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md transition-all"
              >
                <History className="h-4 w-4 mb-1 sm:mb-0 sm:mr-2" />
                <span className="hidden sm:inline">{t('admin.auditLog')}</span>
                <span className="sm:hidden">Audit</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab Content - Mobile Optimized */}
          <TabsContent value="analytics" className="space-y-4 sm:space-y-6">
            <AdminAnalytics />
          </TabsContent>

          <TabsContent value="moderation" className="space-y-4 sm:space-y-6">
            <SchoolModerationPanel />
          </TabsContent>

          <TabsContent value="pages" className="space-y-4 sm:space-y-6">
            <AdminCustomPages />
          </TabsContent>

          <TabsContent value="audit" className="space-y-4 sm:space-y-6">
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
