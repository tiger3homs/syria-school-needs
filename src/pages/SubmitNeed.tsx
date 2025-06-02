
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SubmitNeedForm from '@/components/SubmitNeedForm';
import DashboardBottomNav from '@/components/DashboardBottomNav';

const SubmitNeed = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-foreground">
              {t('needs.addNeed')}
            </CardTitle>
            <CardDescription>
              {t('needs.addNeedDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SubmitNeedForm />
          </CardContent>
        </Card>
      </div>
      <DashboardBottomNav />
    </div>
  );
};

export default SubmitNeed;
