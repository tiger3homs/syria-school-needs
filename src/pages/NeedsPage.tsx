import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Package } from "lucide-react";
import NeedCard from "@/components/NeedCard";

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
  const { t } = useTranslation();
  const [needs, setNeeds] = useState<Need[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [governorateFilter, setGovernorateFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [governorateOptions, setGovernorateOptions] = useState<string[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [error, setError] = useState<string | null>(null);

  // Fetch options separately to avoid re-fetching them on every filter change
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        // Fetch unique governorates
        const { data: govData } = await supabase
          .from('needs')
          .select('schools(governorate)')
          .not('schools', 'is', null);
        
        if (govData) {
          const governorates = [...new Set(govData
            .map(n => n.schools?.governorate)
            .filter(Boolean))] as string[];
          setGovernorateOptions(governorates);
        }

        // Fetch unique categories
        const { data: catData } = await supabase
          .from('needs')
          .select('category')
          .not('category', 'is', null);
        
        if (catData) {
          const categories = [...new Set(catData
            .map(n => n.category)
            .filter(Boolean))] as string[];
          setCategoryOptions(categories);
        }
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };

    fetchOptions();
  }, []);

  // Fetch needs with filters
  useEffect(() => {
    const fetchNeeds = async () => {
      setIsLoading(true);
      setError(null);
      try {
        let query = supabase
          .from('needs')
          .select('*, schools(name, governorate, contact_email, contact_phone)');

        // Apply status filter
        if (statusFilter !== "all") {
          query = query.eq('status', statusFilter);
        }

        // Apply category filter
        if (categoryFilter !== "all") {
          query = query.ilike('category', categoryFilter);
        }

        // Apply governorate filter
        if (governorateFilter !== "all") {
          query = query.eq('schools.governorate', governorateFilter);
        }

        // Apply search query
        if (searchQuery.trim()) {
          query = query.or(`title.ilike.%${searchQuery.trim()}%,description.ilike.%${searchQuery.trim()}%`);
        }

        // Apply sorting
        switch (sortBy) {
          case "newest":
            query = query.order('created_at', { ascending: false });
            break;
          case "oldest":
            query = query.order('created_at', { ascending: true });
            break;
          case "priority":
            // First high priority, then medium, then low
            query = query.order('priority', { ascending: false });
            break;
        }

        const { data, error: fetchError } = await query;

        if (fetchError) {
          throw new Error(fetchError.message);
        }

        setNeeds(data || []);
      } catch (err: any) {
        setError(err.message);
        setNeeds([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNeeds();
  }, [governorateFilter, categoryFilter, statusFilter, searchQuery, sortBy]);

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
      <div className="min-h-screen bg-light font-inter text-primary flex items-center justify-center">
        <div className="text-xl text-primary">{t('common.loadingNeeds')}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light font-inter text-primary">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">{t('needsPage.title')}</h1>
          <p className="text-lg text-gray-700">{t('needsPage.description')}</p>
        </div>

        {/* Filters Section */}
        <Card className="mb-8 shadow-lg rounded-2xl border-t-4 border-primary">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <Select value={governorateFilter} onValueChange={setGovernorateFilter}>
                <SelectTrigger className="border-gray-300 focus:border-gold focus:ring-gold">
                  <SelectValue placeholder={t('needs.filters.allGovernorates')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('needs.filters.allGovernorates')}</SelectItem>
                  {governorateOptions.map((governorate) => (
                    <SelectItem key={governorate} value={governorate}>
                      {t(`governorates.${governorate}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="border-gray-300 focus:border-gold focus:ring-gold">
                  <SelectValue placeholder={t('needs.filters.allCategories')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('needs.filters.allCategories')}</SelectItem>
                  {categoryOptions.map((category) => (
                    <SelectItem key={category} value={category}>
                      {t(`categories.${category}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="border-gray-300 focus:border-gold focus:ring-gold">
                  <SelectValue placeholder={t('needs.filters.allStatuses')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('needs.filters.allStatuses')}</SelectItem>
                  <SelectItem value="pending">{t('status.pending')}</SelectItem>
                  <SelectItem value="fulfilled">{t('status.fulfilled')}</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="border-gray-300 focus:border-gold focus:ring-gold">
                  <SelectValue placeholder={t('needs.filters.sortBy')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">{t('needs.filters.newest')}</SelectItem>
                  <SelectItem value="oldest">{t('needs.filters.oldest')}</SelectItem>
                  <SelectItem value="priority">{t('needs.filters.priority')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                type="text"
                placeholder={t('needs.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 border-gray-300 focus:border-gold focus:ring-gold"
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
                className="border-gold text-gold hover:bg-gold hover:text-primary"
              >
                {t('needs.filters.resetFilters')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-700">
            {t('needs.showingResults', { count: filteredAndSortedNeeds.length, total: needs.length })}
          </p>
        </div>

        {/* Needs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedNeeds.map((need) => (
            <NeedCard key={need.id} need={need} />
          ))}
        </div>

        {filteredAndSortedNeeds.length === 0 && (
          <div className="text-center py-12 text-gray-600">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-primary mb-2">{t('needs.noNeeds')}</h3>
            <p className="text-gray-700">{t('needs.noNeedsDescription')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NeedsPage;
