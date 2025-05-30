
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { History, Search, User, Calendar } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { useToast } from "@/hooks/use-toast";

interface AuditLogEntry {
  id: string;
  user_id?: string;
  action: string;
  entity_type: string;
  entity_id: string;
  old_values?: any;
  new_values?: any;
  created_at: string;
  user_email?: string;
}

const AuditLog = () => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    action: 'all',
    entity_type: 'all',
    search: ''
  });
  const { toast } = useToast();

  const fetchAuditLogs = async () => {
    try {
      // First fetch audit logs
      let query = supabaseAdmin
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      // Apply filters
      if (filter.action !== 'all') {
        query = query.eq('action', filter.action);
      }
      if (filter.entity_type !== 'all') {
        query = query.eq('entity_type', filter.entity_type);
      }

      const { data: auditData, error: auditError } = await query;

      if (auditError) throw auditError;

      // Get unique user IDs
      const userIds = [...new Set(auditData?.map(log => log.user_id).filter(Boolean) || [])];

      // Fetch user profiles for these IDs
      const { data: profilesData, error: profilesError } = await supabaseAdmin
        .from('profiles')
        .select('id, email')
        .in('id', userIds);

      if (profilesError) throw profilesError;

      // Create a map of user ID to email
      const userEmailMap = new Map(profilesData?.map(profile => [profile.id, profile.email]) || []);

      // Transform the data to include user email
      const transformedData = auditData?.map(log => ({
        ...log,
        user_email: log.user_id ? userEmailMap.get(log.user_id) || 'Unknown' : 'System'
      })) || [];

      setLogs(transformedData);
    } catch (error: any) {
      toast({
        title: "Error fetching audit logs",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, [filter]);

  const getActionBadge = (action: string) => {
    const variants = {
      created: 'default',
      updated: 'secondary',
      approved: 'default',
      rejected: 'destructive',
      fulfilled: 'default'
    } as const;

    return (
      <Badge variant={variants[action as keyof typeof variants] || 'outline'}>
        {action.toUpperCase()}
      </Badge>
    );
  };

  const getEntityBadge = (entityType: string) => {
    const colors = {
      school: 'bg-blue-100 text-blue-800',
      need: 'bg-green-100 text-green-800'
    } as const;

    return (
      <Badge variant="outline" className={colors[entityType as keyof typeof colors] || ''}>
        {entityType.toUpperCase()}
      </Badge>
    );
  };

  const filteredLogs = logs.filter(log => {
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      return (
        log.user_email?.toLowerCase().includes(searchLower) ||
        log.action.toLowerCase().includes(searchLower) ||
        log.entity_type.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Audit Log</CardTitle>
          <CardDescription>Track all system changes and user actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <History className="h-5 w-5 mr-2" />
          Audit Log
        </CardTitle>
        <CardDescription>Track all system changes and user actions</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by user, action, or entity..."
              value={filter.search}
              onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
              className="pl-9"
            />
          </div>
          <Select value={filter.action} onValueChange={(value) => setFilter(prev => ({ ...prev, action: value }))}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="All Actions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              <SelectItem value="created">Created</SelectItem>
              <SelectItem value="updated">Updated</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="fulfilled">Fulfilled</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filter.entity_type} onValueChange={(value) => setFilter(prev => ({ ...prev, entity_type: value }))}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="All Entities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Entities</SelectItem>
              <SelectItem value="school">Schools</SelectItem>
              <SelectItem value="need">Needs</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Audit Log Table */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>Date & Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                    <History className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No audit logs found</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="text-sm">{log.user_email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getActionBadge(log.action)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getEntityBadge(log.entity_type)}
                        <span className="text-xs text-gray-500 font-mono">
                          {log.entity_id.substring(0, 8)}...
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(log.created_at).toLocaleString()}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuditLog;
