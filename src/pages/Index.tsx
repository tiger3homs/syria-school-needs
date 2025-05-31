
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ShieldCheck, Building2, GraduationCap, Handshake, BookOpen, Lightbulb, ArrowRight, MapPin, Users, CheckCircle } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-light font-inter text-primary">
      {/* Hero Section - Mobile-first with touch-optimized layout */}
      <section 
        className="relative py-16 sm:py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-cover bg-center text-white overflow-hidden" 
        style={{ backgroundImage: `url('/banner.jpg')` }}
      >
        {/* Optimized overlay for mobile readability */}
        <div className="absolute inset-0 bg-primary/90 backdrop-blur-[1px]"></div> 
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          {/* Mobile-optimized hero content */}
          <div className="mb-6 sm:mb-8">
            <img src="/logo.jpg" alt="Syrian Ministry Logo" className="h-16 sm:h-20 w-auto mx-auto mb-4 rounded-lg shadow-lg" />
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight text-shadow-sm">
            إعادة بناء الأمل
            <span className="block text-gold mt-2">Rebuilding Hope</span>
            <span className="block text-lg sm:text-xl md:text-2xl font-normal mt-2 opacity-90">One School at a Time</span>
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl mb-8 sm:mb-12 max-w-3xl mx-auto font-light opacity-95 leading-relaxed">
            وزارة التربية والتعليم - الجمهورية العربية السورية
            <span className="block mt-2">Ministry of Education - Syrian Arab Republic</span>
          </p>
          
          {/* Mobile-optimized CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
            <Link to="/register" className="w-full sm:w-auto">
              <Button className="mobile-button-primary w-full sm:w-auto text-lg">
                تسجيل المدرسة
                <span className="block text-sm font-normal">Register School</span>
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/needs" className="w-full sm:w-auto">
              <Button className="mobile-button-secondary w-full sm:w-auto text-lg">
                عرض الاحتياجات
                <span className="block text-sm font-normal">View Needs</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Stats - Mobile-optimized cards */}
      <section className="py-8 sm:py-12 bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="mobile-card text-center">
              <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">500+</div>
              <div className="text-sm sm:text-base text-gray-600">مدرسة مسجلة<br />Schools Registered</div>
            </div>
            <div className="mobile-card text-center">
              <div className="text-2xl sm:text-3xl font-bold text-gold mb-1">150+</div>
              <div className="text-sm sm:text-base text-gray-600">مدرسة تم إعادة بناؤها<br />Schools Rebuilt</div>
            </div>
            <div className="mobile-card text-center">
              <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">1,200+</div>
              <div className="text-sm sm:text-base text-gray-600">احتياج تم تلبيته<br />Needs Fulfilled</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Mobile-first layout */}
      <section className="py-12 sm:py-16 md:py-20 bg-light">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
              كيف يعمل النظام
              <span className="block text-2xl sm:text-3xl mt-2">How It Works</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
              خطوات بسيطة لربط المدارس بالدعم المطلوب
              <span className="block mt-1">Simple steps to connect schools with needed support</span>
            </p>
          </div>
          
          <div className="space-y-6 md:grid md:grid-cols-3 md:gap-8 md:space-y-0">
            {/* Step 1 */}
            <Card className="mobile-card border-t-4 border-gold hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">١</span>
                </div>
                <CardTitle className="text-xl sm:text-2xl font-semibold text-primary">
                  تسجيل المدرسة
                  <span className="block text-lg font-normal mt-1">Register School</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-gray-700 leading-relaxed text-base">
                  يقوم مدير المدرسة بإنشاء ملف تعريفي آمن مع المعلومات الأساسية
                  <span className="block mt-2">School principals create a secure profile with essential details</span>
                </CardDescription>
              </CardContent>
            </Card>

            {/* Step 2 */}
            <Card className="mobile-card border-t-4 border-primary hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-gold">٢</span>
                </div>
                <CardTitle className="text-xl sm:text-2xl font-semibold text-primary">
                  تقديم الاحتياجات
                  <span className="block text-lg font-normal mt-1">Submit Needs</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-gray-700 leading-relaxed text-base">
                  إدراج الاحتياجات المحددة مع الأوصاف التفصيلية والأولويات
                  <span className="block mt-2">List specific needs with detailed descriptions and priorities</span>
                </CardDescription>
              </CardContent>
            </Card>

            {/* Step 3 */}
            <Card className="mobile-card border-t-4 border-syrian-red hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-syrian-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-syrian-red">٣</span>
                </div>
                <CardTitle className="text-xl sm:text-2xl font-semibold text-primary">
                  الحصول على الدعم
                  <span className="block text-lg font-normal mt-1">Get Support</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-gray-700 leading-relaxed text-base">
                  المتبرعون والمنظمات تراجع الاحتياجات وتقدم الدعم المطلوب
                  <span className="block mt-2">Donors and organizations review needs and provide essential support</span>
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Mission & Values - Mobile-optimized */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
              مهمتنا وقيمنا
              <span className="block text-2xl sm:text-3xl mt-2">Our Mission & Values</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
              وزارة التربية ملتزمة بتعزيز جيل متعلم ومقاوم. جهودنا متجذرة في القيم الأساسية التي توجه كل خطوة في عملية إعادة البناء
              <span className="block mt-2">The Ministry of Education is committed to fostering a resilient and educated generation</span>
            </p>
          </div>
          
          <div className="space-y-6 md:grid md:grid-cols-3 md:gap-8 md:space-y-0">
            <div className="mobile-card border-t-4 border-primary text-center">
              <ShieldCheck className="h-12 w-12 sm:h-16 sm:w-16 text-gold mx-auto mb-4" />
              <h3 className="text-xl sm:text-2xl font-semibold text-primary mb-3">
                الشفافية
                <span className="block text-lg font-normal mt-1">Transparency</span>
              </h3>
              <p className="text-gray-700 leading-relaxed">
                ضمان إدارة كل مورد وتبرع بأقصى درجات النزاهة والمساءلة
                <span className="block mt-2">Ensuring every resource is managed with utmost integrity</span>
              </p>
            </div>
            
            <div className="mobile-card border-t-4 border-gold text-center">
              <GraduationCap className="h-12 w-12 sm:h-16 sm:w-16 text-primary mx-auto mb-4" />
              <h3 className="text-xl sm:text-2xl font-semibold text-primary mb-3">
                التعليم للجميع
                <span className="block text-lg font-normal mt-1">Education for All</span>
              </h3>
              <p className="text-gray-700 leading-relaxed">
                توفير وصول عادل للتعليم الجيد لكل طفل
                <span className="block mt-2">Providing equitable access to quality education for every child</span>
              </p>
            </div>
            
            <div className="mobile-card border-t-4 border-primary text-center">
              <Building2 className="h-12 w-12 sm:h-16 sm:w-16 text-gold mx-auto mb-4" />
              <h3 className="text-xl sm:text-2xl font-semibold text-primary mb-3">
                البنية التحتية المستدامة
                <span className="block text-lg font-normal mt-1">Sustainable Infrastructure</span>
              </h3>
              <p className="text-gray-700 leading-relaxed">
                بناء بيئات تعلم دائمة وحديثة تصمد أمام اختبار الزمن
                <span className="block mt-2">Building durable learning environments that stand the test of time</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Mobile-optimized */}
      <section className="py-12 sm:py-16 md:py-20 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6">
            مستعد لإحداث فرق؟
            <span className="block text-2xl sm:text-3xl mt-2">Ready to Make a Difference?</span>
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl mb-8 sm:mb-10 leading-relaxed opacity-90">
            انضم إلى مهمتنا الوطنية لإعادة بناء وتقوية البنية التحتية التعليمية في سوريا
            <span className="block mt-2">Join our national mission to rebuild educational infrastructure in Syria</span>
          </p>
          <Link to="/register">
            <Button className="mobile-button-primary bg-gold text-primary hover:bg-gold/90 text-lg">
              سجل مدرستك اليوم
              <span className="block text-sm font-normal">Register Your School Today</span>
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer - Mobile-optimized */}
      <footer className="bg-primary text-white py-12 sm:py-16 font-inter">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
            <div className="text-center md:text-right">
              <div className="flex items-center justify-center md:justify-start mb-4 sm:mb-6">
                <img src="/logo.jpg" alt="Syrian Emblem" className="h-12 sm:h-14 w-auto mr-4 rounded" />
                <span className="text-xl sm:text-2xl font-bold">
                  إعادة بناء المدارس
                  <span className="block text-lg font-normal">School Rebuild Syria</span>
                </span>
              </div>
              <p className="text-white/90 leading-relaxed text-sm sm:text-base">
                ربط المدارس السورية بالداعمين العالميين لإعادة بناء وتعزيز البنية التحتية التعليمية
                <span className="block mt-2">Connecting Syrian schools with global supporters for a brighter future</span>
              </p>
            </div>
            
            <div className="text-center">
              <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-gold">
                روابط سريعة
                <span className="block text-base font-normal">Quick Links</span>
              </h3>
              <ul className="space-y-2 sm:space-y-3">
                <li><Link to="/" className="text-white/90 hover:text-gold transition-colors text-sm sm:text-base">الرئيسية / Home</Link></li>
                <li><Link to="/needs" className="text-white/90 hover:text-gold transition-colors text-sm sm:text-base">الاحتياجات / View Needs</Link></li>
                <li><Link to="/schools" className="text-white/90 hover:text-gold transition-colors text-sm sm:text-base">مدارسنا / Our Schools</Link></li>
                <li><Link to="/contact" className="text-white/90 hover:text-gold transition-colors text-sm sm:text-base">اتصل بنا / Contact</Link></li>
              </ul>
            </div>
            
            <div className="text-center md:text-left">
              <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-gold">
                معلومات رسمية
                <span className="block text-base font-normal">Official Information</span>
              </h3>
              <ul className="space-y-2 sm:space-y-3">
                <li><Link to="/privacy" className="text-white/90 hover:text-gold transition-colors text-sm sm:text-base">سياسة الخصوصية / Privacy</Link></li>
                <li><Link to="/terms" className="text-white/90 hover:text-gold transition-colors text-sm sm:text-base">شروط الخدمة / Terms</Link></li>
                <li><Link to="/accessibility" className="text-white/90 hover:text-gold transition-colors text-sm sm:text-base">إمكانية الوصول / Accessibility</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gold/30 mt-8 sm:mt-12 pt-6 sm:pt-8 text-center">
            <p className="text-white/90 text-xs sm:text-sm leading-relaxed">
              © {new Date().getFullYear()} إعادة بناء المدارس السورية. جميع الحقوق محفوظة
              <br />
              School Rebuild Syria. All rights reserved.
              <br className="sm:hidden" />
              <span className="block mt-2">
                مبادرة وطنية من وزارة التربية والتعليم - الجمهورية العربية السورية
                <br />
                A national initiative by the Ministry of Education, Syrian Arab Republic
              </span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
