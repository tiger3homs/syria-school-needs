
import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { School, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import RegisterSchoolModal from "@/components/RegisterSchoolModal";

const Register = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-light via-white to-light font-inter text-primary py-8 px-4">
      <div className="max-w-lg mx-auto">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className={`inline-flex items-center group ${isRTL ? 'flex-row-reverse' : ''}`}>
            <School className={`h-10 w-10 text-primary group-hover:text-gold transition-colors ${isRTL ? 'ml-3' : 'mr-3'}`} />
            <span className="text-2xl font-extrabold text-primary group-hover:text-gold transition-colors">
              {t('site.title')}
            </span>
          </Link>
        </div>

        <Card className="shadow-2xl rounded-3xl border-t-4 border-primary overflow-hidden">
          <CardHeader className="text-center bg-gradient-to-r from-primary/5 to-gold/5 pb-8">
            <CardTitle className="text-3xl font-bold text-primary mb-3">
              {t('auth.register.title')}
            </CardTitle>
            <CardDescription className="text-gray-700 text-lg leading-relaxed">
              {t('auth.register.description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <div className="text-center">
              <div className="bg-gradient-to-br from-primary/10 to-gold/10 rounded-2xl p-8 mb-8">
                <School className="h-16 w-16 text-primary mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-primary mb-4">
                  {t('auth.register.getStarted')}
                </h3>
                <p className="text-gray-700 text-base leading-relaxed">
                  {t('auth.register.registerDescription')}
                </p>
              </div>
              
              <Button 
                onClick={() => setShowModal(true)}
                className="w-full bg-gold text-primary hover:bg-gold/90 rounded-xl shadow-lg px-8 py-4 text-xl font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 h-16"
                size="lg"
              >
                {t('nav.register')}
              </Button>
            </div>

            <div className="text-center text-base text-gray-700">
              {t('auth.register.alreadyHaveAccount')}{" "}
              <Link to="/login" className="text-primary hover:text-gold font-semibold transition-colors">
                {t('auth.register.signInHere')}
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <Link to="/" className={`text-primary hover:text-gold font-medium text-base transition-colors inline-flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
            <ArrowLeft className={`h-4 w-4 ${isRTL ? 'ml-2 rotate-180' : 'mr-2'}`} />
            {t('auth.login.backToHome')}
          </Link>
        </div>

        <RegisterSchoolModal 
          open={showModal} 
          onOpenChange={setShowModal}
        />
      </div>
    </div>
  );
};

export default Register;
