
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Filter, ArrowUpDown, CheckCircle, XCircle, Trash2, Download, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import AdminHeader from "@/components/AdminHeader";
import { exportToCSV, exportToExcel, ExportNeed } from "@/utils/exportUtils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface Need {
  id: string;
  title: string;
  description: string;
  category: string;
  quantity: number;
  priority: string;
  status: string;
  image_url?: string;
  created_at: string;
  school: {
    name: string;
    governorate: string;
  };
}

const AdminNeedsComponent = () => {
  const [needs, setNeeds] = useState<Need[]>([]);
  const [filteredNeeds, setFilteredNeeds] = useState<Need[]>([]);
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    category: "all",
    status: "all",
    priority: "all",
    governorate: "all"
  });
  const [sortField, setSortField] = useState<keyof Need | 'school.name'>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const { toast } = useToast();

  const fetchNeeds = async () => {
    try {
      const { data, error } = await supabaseAdmin
        .from('needs')
        .select(`
          id,
          title,
          description,
          category,
          quantity,
          priority,
          status,
          image_url,
          created_at,
          school:schools!inner(name, governorate)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const transformedData: Need[] = (data || []).map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        category: item.category,
        quantity: item.quantity,
        priority: item.priority,
        status: item.status,
        image_url: item.image_url,
        created_at: item.created_at,
        school: {
          name: Array.isArray(item.school) ? item.school[0]?.name || 'Unknown' : item.school?.name || 'Unknown',
          governorate: Array.isArray(item.school) ? item.school[0]?.governorate || 'Unknown' : item.school?.governorate || 'Unknown'
        }
      }));
      
      setNeeds(transformedData);
    } catch (error: any) {
      toast({
        title: "Error fetching needs",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNeeds();
  }, []);

  useEffect(() => {
    let filtered = needs.filter(need => {
      const matchesSearch = need.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           need.school.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filters.category === "all" || need.category === filters.category;
      const matchesStatus = filters.status === "all" || need.status === filters.status;
      const matchesPriority = filters.priority === "all" || need.priority === filters.priority;
      const matchesGovernorate = filters.governorate === "all" || need.school.governorate === filters.governorate;
      
      return matchesSearch && matchesCategory && matchesStatus && matchesPriority && matchesGovernorate;
    });

    if (sortField) {
      filtered.sort((a, b) => {
        let aValue: any, bValue: any;
        
        if (sortField === 'school.name') {
          aValue = a.school.name;
          bValue = b.school.name;
        } else {
          aValue = a[sortField as keyof Need];
          bValue = b[sortField as keyof Need];
        }
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          const comparison = aValue.localeCompare(bValue);
          return sortDirection === 'asc' ? comparison : -comparison;
        }
        
        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    setFilteredNeeds(filtered);
  }, [needs, searchTerm, filters, sortField, sortDirection]);

  const handleSort = (field: keyof Need | 'school.name') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const toggleNeedStatus = async (needId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'pending' ? 'fulfilled' : 'pending';
    
    try {
      const { error } = await supabaseAdmin
        .from('needs')
        .update({ status: newStatus })
        .eq('id', needId);

      if (error) throw error;

      setNeeds(needs.map(need => 
        need.id === needId ? { ...need, status: newStatus } : need
      ));

      toast({
        title: "Status updated",
        description: `Need marked as ${newStatus}`,
      });
    } catch (error: any) {
      toast({
        title: "Error updating status",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleBulkAction = async (action: 'fulfill' | 'pending' | 'delete') => {
    if (selectedNeeds.length === 0) {
      toast({
        title: "No items selected",
        description: "Please select items to perform bulk action",
        variant: "destructive",
      });
      return;
    }

    try {
      if (action === 'delete') {
        const { error } = await supabaseAdmin
          .from('needs')
          .delete()
          .in('id', selectedNeeds);

        if (error) throw error;
        
        setNeeds(needs.filter(need => !selectedNeeds.includes(need.id)));
        toast({
          title: "Items deleted",
          description: `${selectedNeeds.length} items deleted successfully`,
        });
      } else {
        const newStatus = action === 'fulfill' ? 'fulfilled' : 'pending';
        const { error } = await supabaseAdmin
          .from('needs')
          .update({ status: newStatus })
          .in('id', selectedNeeds);

        if (error) throw error;

        setNeeds(needs.map(need => 
          selectedNeeds.includes(need.id) ? { ...need, status: newStatus } : need
        ));

        toast({
          title: "Status updated",
          description: `${selectedNeeds.length} items marked as ${newStatus}`,
        });
      }
      
      setSelectedNeeds([]);
    } catch (error: any) {
      toast({
        title: "Error performing bulk action",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleExport = (format: 'csv' | 'excel', dataToExport: 'all' | 'filtered' | 'selected') => {
    let exportData: Need[] = [];
    
    switch (dataToExport) {
      case 'all':
        exportData = needs;
        break;
      case 'filtered':
        exportData = filteredNeeds;
        break;
      case 'selected':
        exportData = needs.filter(need => selectedNeeds.includes(need.id));
        break;
    }

    if (exportData.length === 0) {
      toast({
        title: "No data to export",
        description: "Please select some items or adjust your filters.",
        variant: "destructive",
      });
      return;
    }

    const transformedData: ExportNeed[] = exportData.map(need => ({
      school_name: need.school.name,
      need_title: need.title,
      description: need.description || '',
      category: need.category,
      priority: need.priority,
      status: need.status,
      quantity: need.quantity,
      governorate: need.school.governorate,
      created_at: need.created_at
    }));

    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `needs-${dataToExport}-${timestamp}`;

    if (format === 'csv') {
      exportToCSV(transformedData, `${filename}.csv`);
    } else {
      exportToExcel(transformedData, `${filename}.xlsx`);
    }

    toast({
      title: "Export successful",
      description: `${exportData.length} needs exported as ${format.toUpperCase()}`,
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'fulfilled' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-orange-100 text-orange-800';
  };

  const uniqueGovernorates = [...new Set(needs.map(need => need.school.governorate))].filter(Boolean);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading needs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Needs Management</h2>
              <p className="text-gray-600 mt-2">Review and manage school needs submitted by principals</p>
            </div>
            
            {/* Export Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Export Data
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => handleExport('csv', 'all')}>
                  <FileText className="h-4 w-4 mr-2" />
                  Export All (CSV)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('excel', 'all')}>
                  <FileText className="h-4 w-4 mr-2" />
                  Export All (Excel)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('csv', 'filtered')}>
                  <Filter className="h-4 w-4 mr-2" />
                  Export Filtered (CSV)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('excel', 'filtered')}>
                  <Filter className="h-4 w-4 mr-2" />
                  Export Filtered (Excel)
                </DropdownMenuItem>
                {selectedNeeds.length > 0 && (
                  <>
                    <DropdownMenuItem onClick={() => handleExport('csv', 'selected')}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Export Selected (CSV)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExport('excel', 'selected')}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Export Selected (Excel)
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search needs or schools..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              <Select value={filters.category} onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="furniture">Furniture</SelectItem>
                  <SelectItem value="outdoor_facilities">Outdoor Facilities</SelectItem>
                  <SelectItem value="equipment">Equipment</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.priority} onValueChange={(value) => setFilters(prev => ({ ...prev, priority: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="All Priorities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="fulfilled">Fulfilled</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.governorate} onValueChange={(value) => setFilters(prev => ({ ...prev, governorate: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="All Governorates" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Governorates</SelectItem>
                  {uniqueGovernorates.map(gov => (
                    <SelectItem key={gov} value={gov}>{gov}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="text-sm text-gray-600 flex items-center">
                Showing {filteredNeeds.length} of {needs.length} needs
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bulk Actions */}
        {selectedNeeds.length > 0 && (
          <Card className="mb-6 border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-blue-900">
                  {selectedNeeds.length} item(s) selected
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" onClick={() => handleBulkAction('fulfill')}>
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Mark as Fulfilled
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction('pending')}>
                    <XCircle className="h-4 w-4 mr-1" />
                    Mark as Pending
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleBulkAction('delete')}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Needs Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedNeeds.length === filteredNeeds.length && filteredNeeds.length > 0}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedNeeds(filteredNeeds.map(need => need.id));
                          } else {
                            setSelectedNeeds([]);
                          }
                        }}
                      />
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSort('school.name')}
                    >
                      <div className="flex items-center">
                        School Name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSort('title')}
                    >
                      <div className="flex items-center">
                        Need Title
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Governorate</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSort('priority')}
                    >
                      <div className="flex items-center">
                        Priority
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredNeeds.map((need) => (
                    <TableRow key={need.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedNeeds.includes(need.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedNeeds([...selectedNeeds, need.id]);
                            } else {
                              setSelectedNeeds(selectedNeeds.filter(id => id !== need.id));
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{need.school.name}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{need.title}</div>
                          {need.description && (
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {need.description}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {need.category.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{need.school.governorate}</div>
                      </TableCell>
                      <TableCell>{need.quantity}</TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(need.priority)}>
                          {need.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(need.status)}>
                          {need.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={need.status === 'fulfilled'}
                            onCheckedChange={() => toggleNeedStatus(need.id, need.status)}
                          />
                          <span className="text-sm text-gray-500">
                            {need.status === 'fulfilled' ? 'Fulfilled' : 'Mark as fulfilled'}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

const AdminNeeds = () => (
  <ProtectedRoute requiredRole="admin">
    <AdminNeedsComponent />
  </ProtectedRoute>
);

export default AdminNeeds;
