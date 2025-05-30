
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { MapPin, Book, Users, TrendingUp } from "lucide-react";

interface AnalyticsData {
  schoolsByGovernorate: Array<{ governorate: string; count: number }>;
  needsByCategory: Array<{ category: string; count: number; fulfilled: number; pending: number }>;
  monthlyTrends: Array<{ month: string; schools: number; needs: number }>;
  totalStats: {
    totalSchools: number;
    approvedSchools: number;
    pendingSchools: number;
    totalNeeds: number;
    fulfilledNeeds: number;
  };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const AdminAnalytics = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      // Fetch schools by governorate
      const { data: schools } = await supabaseAdmin
        .from('schools')
        .select('governorate, status');

      // Fetch needs by category
      const { data: needs } = await supabaseAdmin
        .from('needs')
        .select('category, status, created_at');

      if (schools && needs) {
        // Process schools by governorate
        const governorateCount = schools.reduce((acc, school) => {
          const gov = school.governorate || 'Unknown';
          acc[gov] = (acc[gov] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const schoolsByGovernorate = Object.entries(governorateCount).map(([governorate, count]) => ({
          governorate,
          count
        }));

        // Process needs by category
        const categoryStats = needs.reduce((acc, need) => {
          const category = need.category;
          if (!acc[category]) {
            acc[category] = { total: 0, fulfilled: 0, pending: 0 };
          }
          acc[category].total += 1;
          if (need.status === 'fulfilled') {
            acc[category].fulfilled += 1;
          } else {
            acc[category].pending += 1;
          }
          return acc;
        }, {} as Record<string, { total: number; fulfilled: number; pending: number }>);

        const needsByCategory = Object.entries(categoryStats).map(([category, stats]) => ({
          category: category.replace('_', ' ').toUpperCase(),
          count: stats.total,
          fulfilled: stats.fulfilled,
          pending: stats.pending
        }));

        // Calculate total stats
        const totalStats = {
          totalSchools: schools.length,
          approvedSchools: schools.filter(s => s.status === 'approved').length,
          pendingSchools: schools.filter(s => s.status === 'pending').length,
          totalNeeds: needs.length,
          fulfilledNeeds: needs.filter(n => n.status === 'fulfilled').length,
        };

        setData({
          schoolsByGovernorate,
          needsByCategory,
          monthlyTrends: [], // Simplified for now
          totalStats
        });
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!data) return null;

  const chartConfig = {
    count: {
      label: "Count",
      color: "#2563eb",
    },
    fulfilled: {
      label: "Fulfilled",
      color: "#16a34a",
    },
    pending: {
      label: "Pending",
      color: "#ea580c",
    },
  };

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Schools</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalStats.totalSchools}</div>
            <p className="text-xs text-muted-foreground">
              {data.totalStats.pendingSchools} pending approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Schools</CardTitle>
            <Badge variant="default" className="text-xs">
              {Math.round((data.totalStats.approvedSchools / data.totalStats.totalSchools) * 100)}%
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{data.totalStats.approvedSchools}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Needs</CardTitle>
            <Book className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalStats.totalNeeds}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fulfilled Needs</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{data.totalStats.fulfilledNeeds}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((data.totalStats.fulfilledNeeds / data.totalStats.totalNeeds) * 100)}% completion rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Schools by Governorate */}
        <Card>
          <CardHeader>
            <CardTitle>Schools by Governorate</CardTitle>
            <CardDescription>Distribution of schools across Syrian governorates</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.schoolsByGovernorate}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="governorate" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#2563eb" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Needs by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Needs by Category</CardTitle>
            <CardDescription>Most requested items and fulfillment status</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.needsByCategory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="fulfilled" stackId="a" fill="#16a34a" />
                  <Bar dataKey="pending" stackId="a" fill="#ea580c" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAnalytics;
