import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Mail, Phone, Calendar, Package, AlertCircle, ChevronDown } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

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

interface NeedCardProps {
  need: Need;
}

const NeedCard: React.FC<NeedCardProps> = ({ need }) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

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

  return (
    <Card 
      key={need.id} 
      className="h-full flex flex-col shadow-lg rounded-2xl border-t-4 border-primary hover:shadow-xl transition-shadow duration-200 cursor-pointer"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* Front of the card (Image and Title/Badges) */}
      {!isExpanded && (
        <>
          {need.image_url ? (
            <div className="relative h-48 overflow-hidden rounded-t-2xl">
              <img
                src={`${need.image_url}`}
                alt={need.title}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="h-48 bg-primary/10 flex items-center justify-center rounded-t-2xl">
              <Package className="h-16 w-16 text-primary" />
            </div>
          )}

          <CardHeader className="pb-3 flex justify-between items-start">
            <div className="flex flex-col gap-1">
              <CardTitle className="text-xl font-semibold text-primary line-clamp-2">
                {need.title}
              </CardTitle>
              <div className="flex gap-1">
                <Badge variant={getPriorityBadgeVariant(need.priority)} className="text-xs">
                  {t(`priority.${need.priority.toLowerCase()}`)}
                </Badge>
                <Badge variant={getStatusBadgeVariant(need.status)} className="text-xs">
                  {t(`status.${need.status.toLowerCase()}`)}
                </Badge>
              </div>
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
          <CardTitle className="text-xl font-semibold text-primary line-clamp-2">{need.title}</CardTitle>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <span>{t('common.showLess')}</span>
            <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <CardDescription className="text-gray-700 line-clamp-3 mb-3">
            {need.description}
          </CardDescription>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Package className="h-4 w-4 text-gray-500" />
              <span>{t('needs.quantity')}: {need.quantity}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <AlertCircle className="h-4 w-4 text-gray-500" />
              <span>{t('needs.category')}: {t(`categories.${need.category.toLowerCase()}`)}</span>
            </div>

            {need.created_at && (
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>{t('needs.posted')}: {new Date(need.created_at).toLocaleDateString()}</span>
              </div>
            )}

            {need.schools && (
              <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                <h4 className="font-semibold text-primary mb-2">{need.schools.name}</h4>
                
                {need.schools.governorate && (
                  <div className="flex items-center gap-2 text-sm text-gray-700 mb-1">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>{t(`governorates.${need.schools.governorate.toLowerCase().replace(/\s/g, '_')}`)}</span>
                  </div>
                )}
                
                {need.schools.contact_email && (
                  <div className="flex items-center gap-2 text-sm text-gray-700 mb-1">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="truncate">{need.schools.contact_email}</span>
                  </div>
                )}
                
                {need.schools.contact_phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>{need.schools.contact_phone}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="pt-4">
          <Button 
            className="w-full bg-gold text-primary hover:bg-gold/90 rounded-full shadow-md px-6 py-2 text-lg font-semibold transition-all duration-300 ease-in-out transform hover:scale-105"
            onClick={(e) => {
              e.stopPropagation(); // Prevent card from collapsing when button is clicked
              if (need.schools?.contact_phone) {
                window.open(`https://wa.me/${need.schools.contact_phone}`, '_blank');
              } else if (need.schools?.contact_email) {
                window.location.href = `mailto:${need.schools.contact_email}?subject=Interest in: ${need.title}`;
              }
            }}
          >
            <FaWhatsapp className="inline-block mr-2" />
            {t('needs.contactWhatsapp')}
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
};

export default NeedCard;
