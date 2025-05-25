
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { School, Search, Filter, Eye, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Need {
  id: string;
  title: string;
  description: string;
  category: string;
  quantity: number;
  priority: string;
  status: string;
  created_at: string;
  schools: {
    name: string;
    address: string;
    number_of_students: number;
  };
}

const SchoolNeeds = () => {
  const [needs, setNeeds] = useState<Need[]>([]);
  const [filteredNeeds, setFilteredNeeds] = useState<Need[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    fetchNeeds();
  }, []);

  useEffect(() => {
    filterNeeds();
  }, [needs, searchTerm, categoryFilter, priorityFilter]);

  const fetchNeeds = async () => {
    try {
      const { data, error } = await supabase
        .from('needs')
        .select(`
          *,
          schools (
            name,
            address,
            number_of_students
          )
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setNeeds(data || []);
    } catch (error: any) {
      console.error('Error fetching needs:', error);
      toast({
        title: "Error loading needs",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterNeeds = () => {
    let filtered = needs;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(need =>
        need.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        need.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        need.schools.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(need => need.category === categoryFilter);
    }

    // Priority filter
    if (priorityFilter !== "all") {
      filtered = filtered.filter(need => need.priority === priorityFilter);
    }

    setFilteredNeeds(filtered);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "furniture": return "bg-blue-100 text-blue-800";
      case "equipment": return "bg-purple-100 text-purple-800";
      case "outdoor_facilities": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading school needs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <School className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">School Rebuild Syria</span>
              </Link>
            </div>
            <nav className="flex space-x-6">
              <Link to="/" className="text-gray-600 hover:text-gray-900">Home</Link>
              <Link to="/needs" className="text-blue-600 font-medium">School Needs</Link>
              <Link to="/login" className="text-gray-600 hover:text-gray-900">Login</Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">School Needs</h1>
          <p className="text-gray-600">
            Discover schools across Syria that need your support. Browse by category, priority, or search for specific needs.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search needs or schools..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="furniture">Furniture</SelectItem>
                <SelectItem value="equipment">Equipment</SelectItem>
                <SelectItem value="outdoor_facilities">Outdoor Facilities</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="low">Low Priority</SelectItem>
              </SelectContent>
            </Select>

            <div className="text-sm text-gray-600 flex items-center">
              Showing {filteredNeeds.length} of {needs.length} needs
            </div>
          </div>
        </div>

        {/* Needs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNeeds.map((need) => (
            <Card key={need.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{need.title}</CardTitle>
                  <Badge className={getPriorityColor(need.priority)}>
                    {need.priority}
                  </Badge>
                </div>
                <CardDescription className="text-sm">
                  <div className="flex items-center text-gray-600 mb-1">
                    <School className="h-4 w-4 mr-1" />
                    {need.schools.name}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-1" />
                    {need.schools.address.split(',').slice(-2).join(',').trim()}
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4 line-clamp-3">{need.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <Badge className={getCategoryColor(need.category)}>
                    {need.category.replace('_', ' ')}
                  </Badge>
                  <span className="text-sm text-gray-600">
                    Qty: {need.quantity}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>{need.schools.number_of_students} students</span>
                  <span>{new Date(need.created_at).toLocaleDateString()}</span>
                </div>

                <Button className="w-full" variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredNeeds.length === 0 && (
          <div className="text-center py-12">
            <School className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No needs found</h3>
            <p className="text-gray-600">
              {searchTerm || categoryFilter !== "all" || priorityFilter !== "all"
                ? "Try adjusting your search or filters"
                : "No schools have submitted needs yet"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SchoolNeeds;
