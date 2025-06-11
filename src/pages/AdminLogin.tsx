import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const AdminLogin = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { signIn, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const userProfile = await signIn(email, password);
      if (userProfile?.role === 'admin') {
        toast({
          title: t('common.success'),
          description: t('auth.login.signingIn'),
        });
        navigate('/admin/dashboard');
      } else {
        await signOut();
        toast({
          title: t('common.error'),
          description: t('auth.adminLogin.accessDenied'),
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: t('common.error'),
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-light via-white to-light font-inter text-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className={`inline-flex items-center group ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Shield className={`h-10 w-10 text-primary group-hover:text-gold transition-colors ${isRTL ? 'ml-3' : 'mr-3'}`} />
            <span className="text-2xl font-extrabold text-primary group-hover:text-gold transition-colors">
              {t('site.adminPanel')}
            </span>
          </Link>
        </div>

        <Card className="shadow-2xl rounded-3xl border-t-4 border-primary overflow-hidden">
          <CardHeader className="text-center bg-gradient-to-r from-primary/5 to-gold/5 pb-8">
            <CardTitle className="text-3xl font-bold text-primary mb-3">
              {t('auth.adminLogin.title')}
            </CardTitle>
            <CardDescription className="text-gray-700 text-lg leading-relaxed">
              {t('auth.adminLogin.description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="email" className="text-primary font-semibold text-base">
                  {t('auth.login.email')}
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@schoolrebuild.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-2 border-gray-300 focus:border-gold focus:ring-gold focus:ring-2 h-12 text-base rounded-xl"
                  dir={isRTL ? 'rtl' : 'ltr'}
                />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="password" className="text-primary font-semibold text-base">
                  {t('auth.login.password')}
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="border-2 border-gray-300 focus:border-gold focus:ring-gold focus:ring-2 h-12 text-base rounded-xl pr-12"
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className={`absolute top-0 h-full px-3 py-2 hover:bg-transparent ${isRTL ? 'left-0' : 'right-0'}`}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-500" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-500" />
                    )}
                  </Button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gold text-primary hover:bg-gold/90 rounded-xl shadow-lg px-6 py-4 text-lg font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 h-14" 
                disabled={isLoading}
              >
                {isLoading ? t('auth.login.signingIn') : t('auth.login.signIn')}
              </Button>
            </form>

            <div className="mt-8 space-y-6">
              <div className="text-center text-base text-gray-700">
                <Link to="/login" className="text-gold hover:text-primary font-semibold text-base transition-colors">
                  {t('auth.adminLogin.backToSchoolLogin')}
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <Link to="/" className={`text-primary hover:text-gold font-medium text-base transition-colors inline-flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
            <ArrowLeft className={`h-4 w-4 ${isRTL ? 'ml-2 rotate-180' : 'mr-2'}`} />
            {t('auth.login.backToHome')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
