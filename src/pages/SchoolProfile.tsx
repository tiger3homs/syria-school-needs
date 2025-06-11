import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Phone, Mail, Package } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';

interface School {
  id: string;
  name: string;
  governorate: string | null;
  address: string;
  education_level: string | null;
  number_of_students: number;
  principal_id: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  description: string | null;
  image_url: string | null;
  status: string | null;
  created_at: string | null;
  updated_at: string | null;
}

const SchoolProfile: React.FC = () => {
  const { schoolName } = useParams<{ schoolName: string }>();
  const { t } = useTranslation();
  const [school, setSchool] = useState<School | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchool = async () => {
      setLoading(true);
      setError(null);
      // Find by slugified name
      const { data, error } = await supabase
        .from('schools')
        .select('*')
        .eq('status', 'approved')
        .ilike('name', schoolName?.replace(/-/g, ' '));
      if (error) {
        setError(error.message);
        setSchool(null);
      } else if (data && data.length > 0) {
        setSchool(data[0]);
      } else {
        setSchool(null);
      }
      setLoading(false);
    };
    if (schoolName) fetchSchool();
  }, [schoolName]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
        <span className="text-gray-600">{t('common.loading', 'Loading...')}</span>
      </div>
    );
  }

  if (error || !school) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold text-primary mb-4">{t('schools.notFound', 'School Not Found')}</h2>
        <p className="text-gray-600">{t('schools.notFoundDesc', 'We could not find a school with this name.')}</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-10">
      <Card className="shadow-lg rounded-2xl border-t-4 border-primary">
        {school.image_url ? (
          <div className="relative h-48 overflow-hidden rounded-t-2xl">
            <img
              src={school.image_url}
              alt={school.name}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="h-48 bg-primary/10 flex items-center justify-center rounded-t-2xl">
            <Package className="h-16 w-16 text-primary" />
          </div>
        )}
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">{school.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 text-md text-gray-700">
            <MapPin className="h-5 w-5 text-gray-500" />
            <span>{school.governorate ? t(`governorates.${school.governorate.toLowerCase().replace(/\s/g, '_')}`) : t('common.notSpecified')}</span>
          </div>
          <div className="flex items-center gap-2 text-md text-gray-700">
            <span className="font-medium">{t('form.educationLevel')}:</span>
            <span>{school.education_level ? t(`educationLevels.${school.education_level.toLowerCase().replace(/\s/g, '')}`) : t('common.notSpecified')}</span>
          </div>
          <div className="flex items-center gap-2 text-md text-gray-700">
            <span className="font-medium">{t('form.numberOfStudents')}:</span>
            <span>{school.number_of_students}</span>
          </div>
          <div className="flex items-center gap-2 text-md text-gray-700">
            <MapPin className="h-5 w-5 text-gray-500" />
            <span>{school.address}</span>
          </div>
          {school.contact_phone && (
            <div className="flex items-center gap-2 text-md text-gray-700">
              <Phone className="h-5 w-5 text-gray-500" />
              <span>{school.contact_phone}</span>
            </div>
          )}
          {school.contact_email && (
            <div className="flex items-center gap-2 text-md text-gray-700">
              <Mail className="h-5 w-5 text-gray-500" />
              <span>{school.contact_email}</span>
            </div>
          )}
          <div className="text-gray-800 mt-4">
            {school.description}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SchoolProfile;
