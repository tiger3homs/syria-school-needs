import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Package, Search, X } from "lucide-react";
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import SchoolCard from '@/components/SchoolCard';

interface School {
  id: string;
  name: string;
  governorate: string | null;
  address: string;
  education_level: string | null;
  number_of_students: number;
  principal_id: string | null; // This is the contact person
  contact_phone: string | null;
  contact_email: string | null;
  description: string | null;
  image_url: string | null;
  status: string | null;
  created_at: string | null;
  updated_at: string | null;
}

const SchoolsPage: React.FC = () => {
  const { t } = useTranslation();
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGovernorate, setSelectedGovernorate] = useState<string>('all');
  const [selectedEducationLevel, setSelectedEducationLevel] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const governorates = Object.keys(t('governorates', { returnObjects: true }));
  const educationLevels = Object.keys(t('educationLevels', { returnObjects: true }));

  const fetchSchools = async () => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase.from('schools').select('*').eq('status', 'approved');

      // Apply governorate filter
      if (selectedGovernorate !== 'all') {
        query = query.ilike('governorate', selectedGovernorate);
      }

      // Apply education level filter
      if (selectedEducationLevel !== 'all') {
        query = query.ilike('education_level', selectedEducationLevel);
      }

      // Apply search term filter
      if (searchTerm.trim()) {
        // Use ilike for case-insensitive search and handle both name and description
        query = query.or(`name.ilike.%${searchTerm.trim()}%,description.ilike.%${searchTerm.trim()}%,address.ilike.%${searchTerm.trim()}%`);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      if (!data) {
        setSchools([]);
        return;
      }

      setSchools(data as School[]);
    } catch (err: any) {
      setError(err.message);
      setSchools([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, [selectedGovernorate, selectedEducationLevel, searchTerm]);

  const handleResetFilters = () => {
    setSelectedGovernorate('all');
    setSelectedEducationLevel('all');
    setSearchTerm('');
  };

  return (
    <div className="min-h-screen bg-light font-inter text-primary">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">{t('schoolsPage.title')}</h1>
          <p className="text-lg text-gray-700">{t('schoolsPage.description')}</p>
        </div>

        {/* Filters Section */}
        <Card className="mb-8 shadow-lg rounded-2xl border-t-4 border-primary">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="relative flex-grow">
                <Input
                  placeholder={t('schools.searchSchools')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 border-gray-300 focus:border-gold focus:ring-gold"
                />
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              <Select value={selectedGovernorate} onValueChange={setSelectedGovernorate}>
                <SelectTrigger className="border-gray-300 focus:border-gold focus:ring-gold">
                  <SelectValue placeholder={t('schools.allGovernorates')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('schools.allGovernorates')}</SelectItem>
                  {governorates.map((gov) => (
                    <SelectItem key={gov} value={gov}>
                      {t(`governorates.${gov}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedEducationLevel} onValueChange={setSelectedEducationLevel}>
                <SelectTrigger className="border-gray-300 focus:border-gold focus:ring-gold">
                  <SelectValue placeholder={t('schools.allEducationLevels')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('schools.allEducationLevels')}</SelectItem>
                  {educationLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {t(`educationLevels.${level}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={handleResetFilters} className="border-gold text-gold hover:bg-gold hover:text-primary">
                <X className="h-4 w-4 mr-2" />
                {t('common.resetFilters')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-700">
            {t('schools.showingResults', { count: schools.length, total: schools.length })}
          </p>
        </div>

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="h-full flex flex-col shadow-lg rounded-2xl border-t-4 border-primary">
                <CardHeader className="pb-3">
                  <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent className="flex-1 pt-0">
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>{t('common.error')}</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!loading && !error && schools.length === 0 && (
          <div className="text-center py-12 text-gray-600">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-primary mb-2">{t('schools.noSchools')}</h3>
            <p className="text-gray-700">{t('schools.noSchoolsDescription')}</p>
          </div>
        )}

        {!loading && !error && schools.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schools.map((school) => (
              <SchoolCard key={school.id} school={school} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SchoolsPage;
