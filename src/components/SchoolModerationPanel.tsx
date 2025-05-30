
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, X, Eye, School, Phone, Mail, MapPin, Users, Clock } from "lucide-react";
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
          <div className="space-y-4">
            {pendingSchools.map((school) => (
              <Card key={school.id} className="border border-yellow-200 bg-yellow-50">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <School className="h-5 w-5 text-blue-600 mr-2" />
                        <h3 className="text-lg font-semibold text-gray-900">{school.name}</h3>
                        <Badge variant="outline" className="ml-2 bg-yellow-100 text-yellow-800">
                          Pending Review
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="h-4 w-4 mr-2" />
                            {school.address}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Users className="h-4 w-4 mr-2" />
                            {school.number_of_students} students
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="h-4 w-4 mr-2" />
                            Submitted {new Date(school.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          {school.contact_email && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Mail className="h-4 w-4 mr-2" />
                              {school.contact_email}
                            </div>
                          )}
                          {school.contact_phone && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Phone className="h-4 w-4 mr-2" />
                              {school.contact_phone}
                            </div>
                          )}
                          {school.governorate && (
                            <div className="text-sm text-gray-600">
                              <strong>Governorate:</strong> {school.governorate}
                            </div>
                          )}
                        </div>
                      </div>

                      {school.description && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-1">Description:</h4>
                          <p className="text-sm text-gray-600">{school.description}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-4 border-t">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedSchool(school)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>{school.name}</DialogTitle>
                          <DialogDescription>School registration details</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium">School Name</label>
                              <p className="text-sm text-gray-600">{school.name}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Students</label>
                              <p className="text-sm text-gray-600">{school.number_of_students}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Address</label>
                              <p className="text-sm text-gray-600">{school.address}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Governorate</label>
                              <p className="text-sm text-gray-600">{school.governorate}</p>
                            </div>
                            {school.contact_phone && (
                              <div>
                                <label className="text-sm font-medium">Contact Phone</label>
                                <p className="text-sm text-gray-600">{school.contact_phone}</p>
                              </div>
                            )}
                            {school.contact_email && (
                              <div>
                                <label className="text-sm font-medium">Contact Email</label>
                                <p className="text-sm text-gray-600">{school.contact_email}</p>
                              </div>
                            )}
                          </div>
                          
                          {school.description && (
                            <div>
                              <label className="text-sm font-medium">Description</label>
                              <p className="text-sm text-gray-600">{school.description}</p>
                            </div>
                          )}
                          
                          <div className="flex space-x-2 pt-4">
                            <Button
                              onClick={() => updateSchoolStatus(school.id, 'approved')}
                              className="flex-1 bg-green-600 hover:bg-green-700"
                            >
                              <Check className="h-4 w-4 mr-2" />
                              Approve School
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => updateSchoolStatus(school.id, 'rejected')}
                              className="flex-1"
                            >
                              <X className="h-4 w-4 mr-2" />
                              Reject School
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => updateSchoolStatus(school.id, 'approved')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => updateSchoolStatus(school.id, 'rejected')}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SchoolModerationPanel;
