
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, X, Eye, School, Phone, Mail, MapPin, Users } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface PendingSchool {
  id: string;
  name: string;
  address: string;
  governorate: string;
  number_of_students: number;
  contact_phone?: string;
  contact_email?: string;
  description?: string;
  status: string;
  created_at: string;
  principal_id: string;
}

const SchoolModerationPanel = () => {
  const [pendingSchools, setPendingSchools] = useState<PendingSchool[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSchool, setSelectedSchool] = useState<PendingSchool | null>(null);
  const { toast } = useToast();

  const fetchPendingSchools = async () => {
    try {
      const { data, error } = await supabaseAdmin
        .from('schools')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPendingSchools(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching pending schools",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSchoolStatus = async (schoolId: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabaseAdmin
        .from('schools')
        .update({ status })
        .eq('id', schoolId);

      if (error) throw error;

      setPendingSchools(prev => prev.filter(school => school.id !== schoolId));
      
      toast({
        title: `School ${status}`,
        description: `The school has been ${status} successfully.`,
        variant: status === 'approved' ? 'default' : 'destructive',
      });
    } catch (error: any) {
      toast({
        title: "Error updating school status",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchPendingSchools();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>School Moderation</CardTitle>
          <CardDescription>Review and approve pending school registrations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
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
          <School className="h-5 w-5 mr-2" />
          School Moderation
          {pendingSchools.length > 0 && (
            <Badge variant="outline" className="ml-2">
              {pendingSchools.length} pending
            </Badge>
          )}
        </CardTitle>
        <CardDescription>Review and approve pending school registrations</CardDescription>
      </CardHeader>
      <CardContent>
        {pendingSchools.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <School className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No schools pending approval</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>School Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingSchools.map((school) => (
                <TableRow key={school.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{school.name}</div>
                      {school.contact_email && (
                        <div className="text-sm text-gray-500 flex items-center mt-1">
                          <Mail className="h-3 w-3 mr-1" />
                          {school.contact_email}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <MapPin className="h-3 w-3 mr-1" />
                      {school.governorate || 'Unknown'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <Users className="h-3 w-3 mr-1" />
                      {school.number_of_students}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-500">
                      {new Date(school.created_at).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedSchool(school)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>{school.name}</DialogTitle>
                            <DialogDescription>School details and information</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium">Address</label>
                              <p className="text-sm text-gray-600">{school.address}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Number of Students</label>
                              <p className="text-sm text-gray-600">{school.number_of_students}</p>
                            </div>
                            {school.contact_phone && (
                              <div>
                                <label className="text-sm font-medium">Contact Phone</label>
                                <p className="text-sm text-gray-600">{school.contact_phone}</p>
                              </div>
                            )}
                            {school.description && (
                              <div>
                                <label className="text-sm font-medium">Description</label>
                                <p className="text-sm text-gray-600">{school.description}</p>
                              </div>
                            )}
                            <div className="flex space-x-2 pt-4">
                              <Button
                                onClick={() => updateSchoolStatus(school.id, 'approved')}
                                className="flex-1"
                              >
                                <Check className="h-4 w-4 mr-2" />
                                Approve
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={() => updateSchoolStatus(school.id, 'rejected')}
                                className="flex-1"
                              >
                                <X className="h-4 w-4 mr-2" />
                                Reject
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => updateSchoolStatus(school.id, 'approved')}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => updateSchoolStatus(school.id, 'rejected')}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default SchoolModerationPanel;
