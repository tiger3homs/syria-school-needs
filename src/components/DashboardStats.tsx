
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, CheckCircle, AlertTriangle, Users, TrendingUp } from 'lucide-react';

interface Need {
  id: string;
  title: string;
  description: string | null;
  category: string;
  priority: string;
  quantity: number;
  status: string;
  image_url: string | null;
  created_at: string;
}

interface School {
  id: string;
  name: string;
  address: string;
  governorate: string | null;
  number_of_students: number;
  contact_phone: string | null;
  contact_email: string | null;
  description: string | null;
  image_url: string | null;
}

interface DashboardStatsProps {
  needs: Need[];
  school: School;
}

export const DashboardStats = ({ needs, school }: DashboardStatsProps) => {
  const totalNeeds = needs.length;
  const pendingNeeds = needs.filter(need => need.status === 'pending').length;
  const fulfilledNeeds = needs.filter(need => need.status === 'fulfilled').length;
  const highPriorityNeeds = needs.filter(need => need.priority === 'high').length;
  const inProgressNeeds = needs.filter(need => need.status === 'in_progress').length;

  const fulfillmentRate = totalNeeds > 0 ? Math.round((fulfilledNeeds / totalNeeds) * 100) : 0;

  // Get most common category
  const categoryCount = needs.reduce((acc, need) => {
    acc[need.category] = (acc[need.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const mostCommonCategory = Object.entries(categoryCount).length > 0 
    ? Object.entries(categoryCount).sort(([,a], [,b]) => b - a)[0][0] 
    : 'None';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Needs</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalNeeds}</div>
          <p className="text-xs text-muted-foreground">
            {pendingNeeds} pending, {inProgressNeeds} in progress
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Fulfilled</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{fulfilledNeeds}</div>
          <p className="text-xs text-muted-foreground">
            {fulfillmentRate}% completion rate
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">High Priority</CardTitle>
          <AlertTriangle className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{highPriorityNeeds}</div>
          <p className="text-xs text-muted-foreground">Urgent attention needed</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Students</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{school.number_of_students}</div>
          <p className="text-xs text-muted-foreground">Total enrollment</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Most Needed</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-sm font-bold truncate">{mostCommonCategory}</div>
          <p className="text-xs text-muted-foreground">
            {categoryCount[mostCommonCategory] || 0} requests
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{inProgressNeeds}</div>
          <p className="text-xs text-muted-foreground">Being processed</p>
        </CardContent>
      </Card>
    </div>
  );
};
