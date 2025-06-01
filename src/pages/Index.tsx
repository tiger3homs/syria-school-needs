
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ShieldCheck, Building2, GraduationCap, Handshake, BookOpen, Lightbulb, ArrowRight, MapPin, Users, CheckCircle } from "lucide-react";

const Index = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <div className="min-h-screen bg-light font-inter text-primary">
      {/* Hero Section - Mobile-first with enhanced design */}
      <section 
        className="relative py-20 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-cover bg-center text-white overflow-hidden" 
        style={{ backgroundImage: `url('/banner.jpg')` }}
      >
        {/* Enhanced overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/90 to-primary/85 backdrop-blur-[1px]"></div> 
        <div className="relative z-10 max-w-5xl mx-auto text-center">

          {/* Hero Content */}
          <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 sm:mb-8 leading-tight text-shadow-sm  text-center`}>
            {t('home.hero.title')}
            <span className="block text-gold mt-2">{t('home.hero.subtitle')}</span>
          </h1>
          
          <p className={`text-xl sm:text-2xl md:text-3xl mb-10 sm:mb-12 max-w-4xl mx-auto font-light opacity-95 leading-relaxed text-center`}>
            {t('home.hero.description')}
          </p>
          
          <p className={`text-lg sm:text-xl mb-12 sm:mb-16 max-w-3xl mx-auto leading-relaxed text-center`}>
            {t('home.hero.mission')}
          </p>
          
          {/* Enhanced CTA buttons */}
          <div className={`flex flex-col sm:flex-row gap-6 sm:gap-8 justify-center items-center`}>
            <Link to="/register" className="w-full sm:w-auto">
              <Button className={`mobile-button-primary w-full sm:w-auto text-lg px-8 py-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                {t('home.cta.registerSchool')}
                <ArrowRight className={`h-5 w-5 ${isRTL ? 'mr-3 rotate-180' : 'ml-3'}`} />
              </Button>
            </Link>
            <Link to="/needs" className="w-full sm:w-auto">
              <Button className={`mobile-button-secondary w-full sm:w-auto text-lg px-8 py-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                {t('home.cta.viewNeeds')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section className="py-12 sm:py-16 bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            <div className="mobile-card text-center hover:shadow-lg transition-shadow duration-300">
              <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">500+</div>
              <div className="text-base sm:text-lg text-gray-600 font-medium">{t('home.stats.schoolsRegistered')}</div>
            </div>
            <div className="mobile-card text-center hover:shadow-lg transition-shadow duration-300">
              <div className="text-3xl sm:text-4xl font-bold text-gold mb-2">150+</div>
              <div className="text-base sm:text-lg text-gray-600 font-medium">{t('home.stats.schoolsRebuilt')}</div>
            </div>
            <div className="mobile-card text-center hover:shadow-lg transition-shadow duration-300">
              <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">1,200+</div>
              <div className="text-base sm:text-lg text-gray-600 font-medium">{t('home.stats.needsFulfilled')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced How It Works Section */}
      <section className="py-16 sm:py-20 md:py-24 bg-light">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-12 sm:mb-16  text-center`}>
            <h2 className="text-4xl sm:text-5xl font-bold text-primary mb-6">
              {t('home.howItWorks.title')}
            </h2>
            <p className="text-xl sm:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              {t('home.howItWorks.description')}
            </p>
          </div>
          
          <div className="space-y-8 md:grid md:grid-cols-3 md:gap-10 md:space-y-0">
            {/* Step 1 */}
            <Card className="mobile-card border-t-4 border-gold hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <CardHeader className="text-center pb-6">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl font-bold text-primary">1</span>
                </div>
                <CardTitle className="text-2xl sm:text-3xl font-semibold text-primary mb-3">
                  {t('home.howItWorks.step1.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-gray-700 leading-relaxed text-lg">
                  {t('home.howItWorks.step1.description')}
                </CardDescription>
              </CardContent>
            </Card>

            {/* Step 2 */}
            <Card className="mobile-card border-t-4 border-primary hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <CardHeader className="text-center pb-6">
                <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl font-bold text-gold">2</span>
                </div>
                <CardTitle className="text-2xl sm:text-3xl font-semibold text-primary mb-3">
                  {t('home.howItWorks.step2.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-gray-700 leading-relaxed text-lg">
                  {t('home.howItWorks.step2.description')}
                </CardDescription>
              </CardContent>
            </Card>

            {/* Step 3 */}
            <Card className="mobile-card border-t-4 border-syrian-red hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <CardHeader className="text-center pb-6">
                <div className="w-20 h-20 bg-syrian-red/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl font-bold text-syrian-red">3</span>
                </div>
                <CardTitle className="text-2xl sm:text-3xl font-semibold text-primary mb-3">
                  {t('home.howItWorks.step3.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-gray-700 leading-relaxed text-lg">
                  {t('home.howItWorks.step3.description')}
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Enhanced Mission & Values Section */}
      <section className="py-16 sm:py-20 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-12 sm:mb-16  text-center`}>
            <h2 className="text-4xl sm:text-5xl font-bold text-primary mb-6">
              {t('home.mission.title')}
            </h2>
            <p className="text-xl sm:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
              {t('home.mission.description')}
            </p>
          </div>
          
          <div className="space-y-8 md:grid md:grid-cols-3 md:gap-10 md:space-y-0">
            <div className="mobile-card border-t-4 border-syrian-red hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <ShieldCheck className="h-16 w-16 sm:h-20 sm:w-20 text-gold mx-auto mb-6" />
              <h3 className="text-2xl sm:text-3xl font-semibold text-primary mb-4">
                {t('home.mission.transparency.title')}
              </h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                {t('home.mission.transparency.description')}
              </p>
            </div>
            
            <div className="mobile-card border-t-4 border-syrian-red hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <GraduationCap className="h-16 w-16 sm:h-20 sm:w-20 text-primary mx-auto mb-6" />
              <h3 className="text-2xl sm:text-3xl font-semibold text-primary mb-4">
                {t('home.mission.education.title')}
              </h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                {t('home.mission.education.description')}
              </p>
            </div>
            
            <div className="mobile-card border-t-4 border-syrian-red hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <Building2 className="h-16 w-16 sm:h-20 sm:w-20 text-gold mx-auto mb-6" />
              <h3 className="text-2xl sm:text-3xl font-semibold text-primary mb-4">
                {t('home.mission.infrastructure.title')}
              </h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                {t('home.mission.infrastructure.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 sm:mb-8">
            {t('home.cta2.title')}
          </h2>
          <p className="text-xl sm:text-2xl md:text-3xl mb-12 sm:mb-16 leading-relaxed opacity-95 max-w-4xl mx-auto">
            {t('home.cta2.description')}
          </p>
          <div className="flex justify-center">
            <Link to="/register">
              <Button className={`mobile-button-primary bg-gold text-primary hover:bg-gold/90 text-xl px-10 py-5 transform hover:scale-105 transition-all duration-300`}>
                {t('home.cta2.button')}
                <ArrowRight className={`h-6 w-6 ${isRTL ? 'mr-3 rotate-180' : 'ml-3'}`} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-primary text-white py-16 sm:py-20 font-inter">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-12 sm:gap-16 ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className={`text-center ${isRTL ? 'md:text-right' : 'md:text-left'}`}>
              <div className={`flex items-center justify-center mb-6 sm:mb-8 ${isRTL ? 'md:justify-end flex-row-reverse' : 'md:justify-start'}`}>
                <img src="/logo.jpg" alt="Syrian Emblem" className={`h-14 sm:h-16 w-auto rounded shadow-lg ${isRTL ? 'ml-4' : 'mr-4'}`} />
                <span className="text-2xl sm:text-3xl font-bold">
                  {t('site.title')}
                </span>
              </div>
              <p className="text-white/90 leading-relaxed text-base sm:text-lg">
                {t('footer.initiative')}
              </p>
            </div>
            
            <div className="text-center">
              <h3 className="text-xl sm:text-2xl font-semibold mb-6 sm:mb-8 text-gold">
                {t('footer.quickLinks')}
              </h3>
              <ul className="space-y-3 sm:space-y-4">
                <li><Link to="/" className="text-white/90 hover:text-gold transition-colors text-base sm:text-lg font-medium">{t('nav.home')}</Link></li>
                <li><Link to="/needs" className="text-white/90 hover:text-gold transition-colors text-base sm:text-lg font-medium">{t('nav.needs')}</Link></li>
                <li><Link to="/schools" className="text-white/90 hover:text-gold transition-colors text-base sm:text-lg font-medium">{t('nav.schools')}</Link></li>
                <li><Link to="/contact" className="text-white/90 hover:text-gold transition-colors text-base sm:text-lg font-medium">{t('footer.contact')}</Link></li>
              </ul>
            </div>
            
            <div className={`text-center ${isRTL ? 'md:text-right' : 'md:text-left'}`}>
              <h3 className="text-xl sm:text-2xl font-semibold mb-6 sm:mb-8 text-gold">
                {t('footer.officialInfo')}
              </h3>
              <ul className="space-y-3 sm:space-y-4">
                <li><Link to="/privacy" className="text-white/90 hover:text-gold transition-colors text-base sm:text-lg font-medium">{t('footer.privacy')}</Link></li>
                <li><Link to="/terms" className="text-white/90 hover:text-gold transition-colors text-base sm:text-lg font-medium">{t('footer.terms')}</Link></li>
                <li><Link to="/accessibility" className="text-white/90 hover:text-gold transition-colors text-base sm:text-lg font-medium">{t('footer.accessibility')}</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gold/30 mt-12 sm:mt-16 pt-8 sm:pt-10 text-center">
            <p className="text-white/90 text-sm sm:text-base leading-relaxed">
              © {new Date().getFullYear()} {t('site.title')}. {t('footer.copyright')}
              <br className="sm:hidden" />
              <span className="block mt-2">
                {t('footer.initiative')}
              </span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
