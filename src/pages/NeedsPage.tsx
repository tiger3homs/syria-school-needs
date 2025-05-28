
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { MapPin, Mail, Phone, Calendar, Package, AlertCircle } from "lucide-react";

interface Need {
  id: string;
  title: string;
  description: string;
  quantity: number;
  category: string;
  priority: string;
  image_url: string | null;
  status: string;
  created_at: string | null;
  schools: {
    name: string;
    governorate: string | null;
    contact_email: string | null;
    contact_phone: string | null;
  } | null;
}

const NeedsPage = () => {
  const [needs, setNeeds] = useState<Need[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [governorateFilter, setGovernorateFilter] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [governorateOptions, setGovernorateOptions] = useState<string[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("newest");

  useEffect(() => {
    const fetchNeeds = async () => {
      try {
        const { data, error } = await supabase
          .from('needs')
          .select('*, schools(name, governorate, contact_email, contact_phone)')

        if (error) {
          console.error("Error fetching needs:", error);
          return;
        }

        setNeeds(data || []);

        // Extract governorate options
        const governorates = data
          .map((need) => need.schools?.governorate)
          .filter((governorate, index, self) => governorate && self.indexOf(governorate) === index) as string[];
        setGovernorateOptions(governorates);

        // Extract category options
        const categories = data
          .map((need) => need.category)
          .filter((category, index, self) => category && self.indexOf(category) === index) as string[];
        setCategoryOptions(categories);

      } finally {
        setIsLoading(false);
      }
    };

    fetchNeeds();
  }, []);

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "secondary";
      case "low": return "outline";
      default: return "outline";
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    return status === "fulfilled" ? "default" : "secondary";
  };

  const filteredAndSortedNeeds = needs
    .filter((need) => {
      if (governorateFilter && governorateFilter !== "all" && need.schools?.governorate !== governorateFilter) return false;
      if (categoryFilter && categoryFilter !== "all" && need.category !== categoryFilter) return false;
      if (statusFilter && statusFilter !== "all" && need.status !== statusFilter) return false;
      if (searchQuery && !`${need.title} ${need.description}`.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime();
      }
      if (sortBy === "oldest") {
        return new Date(a.created_at!).getTime() - new Date(b.created_at!).getTime();
      }
      if (sortBy === "priority") {
        const priorityOrder = { high: 1, medium: 2, low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return 0;
    });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading needs...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">School Needs</h1>
          <p className="text-lg text-gray-600">Help schools across Syria by fulfilling their educational needs</p>
        </div>

        {/* Filters Section */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <Select value={governorateFilter} onValueChange={setGovernorateFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Governorates" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Governorates</SelectItem>
                  {governorateOptions.map((governorate) => (
                    <SelectItem key={governorate} value={governorate}>
                      {governorate}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categoryOptions.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="fulfilled">Fulfilled</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="priority">Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                type="text"
                placeholder="Search by title or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button
                variant="outline"
                onClick={() => {
                  setGovernorateFilter("all");
                  setCategoryFilter("all");
                  setStatusFilter("all");
                  setSearchQuery("");
                  setSortBy("newest");
                }}
              >
                Reset Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredAndSortedNeeds.length} of {needs.length} needs
          </p>
        </div>

        {/* Needs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedNeeds.map((need) => (
            <Card key={need.id} className="h-full flex flex-col hover:shadow-lg transition-shadow duration-200">
              {/* Image Header */}
              {need.image_url ? (
                <div className="relative h-48 overflow-hidden rounded-t-lg">
                  <img
                    src={`https://fdusgurjkmdroacxtrtb.supabase.co/storage/v1/object/public/need-images/${need.image_url}`}
                    alt={need.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="h-48 bg-gradient-to-br from-blue-100 to-teal-100 flex items-center justify-center rounded-t-lg">
                  <Package className="h-16 w-16 text-blue-500" />
                </div>
              )}

              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-xl font-semibold text-gray-900 line-clamp-2">
                    {need.title}
                  </CardTitle>
                  <div className="flex flex-col gap-1">
                    <Badge variant={getPriorityBadgeVariant(need.priority)} className="text-xs">
                      {need.priority}
                    </Badge>
                    <Badge variant={getStatusBadgeVariant(need.status)} className="text-xs">
                      {need.status}
                    </Badge>
                  </div>
                </div>
                <CardDescription className="text-gray-600 line-clamp-3">
                  {need.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-1 pt-0">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Package className="h-4 w-4" />
                    <span>Quantity: {need.quantity}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <AlertCircle className="h-4 w-4" />
                    <span>Category: {need.category}</span>
                  </div>

                  {need.created_at && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>Posted: {new Date(need.created_at).toLocaleDateString()}</span>
                    </div>
                  )}

                  {need.schools && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">{need.schools.name}</h4>
                      
                      {need.schools.governorate && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                          <MapPin className="h-4 w-4" />
                          <span>{need.schools.governorate}</span>
                        </div>
                      )}
                      
                      {need.schools.contact_email && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                          <Mail className="h-4 w-4" />
                          <span className="truncate">{need.schools.contact_email}</span>
                        </div>
                      )}
                      
                      {need.schools.contact_phone && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="h-4 w-4" />
                          <span>{need.schools.contact_phone}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>

              <CardFooter className="pt-4">
                <Button 
                  className="w-full"
                  onClick={() => {
                    if (need.schools?.contact_email) {
                      window.location.href = `mailto:${need.schools.contact_email}?subject=Interest in: ${need.title}`;
                    }
                  }}
                >
                  Contact School
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredAndSortedNeeds.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No needs found</h3>
            <p className="text-gray-600">Try adjusting your filters to see more results.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NeedsPage;
