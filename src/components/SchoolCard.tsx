import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Mail, Phone, Package, ChevronDown } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

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

interface SchoolCardProps {
  school: School;
}

const SchoolCard: React.FC<SchoolCardProps> = ({ school }) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card 
      key={school.id} 
      className="h-full flex flex-col shadow-lg rounded-2xl border-t-4 border-primary hover:shadow-xl transition-shadow duration-200 cursor-pointer"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* Front of the card (Image and Title/Description) */}
      {!isExpanded && (
        <>
          {school.image_url ? (
            <div className="relative h-48 overflow-hidden rounded-t-2xl">
              <img
                src={`${school.image_url}`}
                alt={school.name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="h-48 bg-primary/10 flex items-center justify-center rounded-t-2xl">
              <Package className="h-16 w-16 text-primary" />
            </div>
          )}

          <CardHeader className="pb-3 flex justify-between items-start">
            <div>
              <CardTitle className="text-xl font-semibold text-primary line-clamp-2">{school.name}</CardTitle>
              <CardDescription className="text-gray-700 line-clamp-3">
                {school.description || t('common.noDescriptionProvided')}
              </CardDescription>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <span>{t('common.showMore')}</span>
              <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
            </div>
          </CardHeader>
        </>
      )}

      {/* Back of the card (All details) */}
      <div 
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isExpanded ? 'max-h-screen' : 'max-h-0'
        }`}
      >
        <CardHeader className="pb-3 flex justify-between items-start">
          <CardTitle className="text-xl font-semibold text-primary line-clamp-2">{school.name}</CardTitle>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <span>{t('common.showLess')}</span>
            <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span>{school.governorate ? t(`governorates.${school.governorate.toLowerCase().replace(/\s/g, '_')}`) : t('common.notSpecified')}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Package className="h-4 w-4 text-gray-500" />
              <span>{t('form.educationLevel')}: {school.education_level ? t(`educationLevels.${school.education_level.toLowerCase().replace(/\s/g, '')}`) : t('common.notSpecified')}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Package className="h-4 w-4 text-gray-500" />
              <span>{t('form.numberOfStudents')}: {school.number_of_students}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span>{school.address}</span>
            </div>
            {school.contact_phone && (
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Phone className="h-4 w-4 text-gray-500" />
                <span>{school.contact_phone}</span>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="pt-4">
          <Button 
            className="w-full bg-gold text-primary hover:bg-gold/90 rounded-full shadow-md px-6 py-2 text-lg font-semibold transition-all duration-300 ease-in-out transform hover:scale-105"
            onClick={(e) => {
              e.stopPropagation(); // Prevent card from collapsing when button is clicked
              if (school.contact_phone) {
                window.open(`https://wa.me/${school.contact_phone}`, '_blank');
              } else if (school.contact_email) {
                window.location.href = `mailto:${school.contact_email}?subject=Interest in: ${school.name}`;
              }
            }}
          >
            <FaWhatsapp className="inline-block mr-2" />
            {t('schools.contactWhatsapp')}
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
};

export default SchoolCard;
