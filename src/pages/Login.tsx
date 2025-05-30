
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { School, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { signIn, signOut } = useAuth(); // Destructure signOut
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const userProfile = await signIn(email, password);
      if (userProfile?.role === 'principal') {
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        navigate('/dashboard');
      } else {
        // If an admin tries to log in via the principal login page
        await signOut(); // Clear the session
        toast({
          title: "Access Denied",
          description: "Only principals can access this page.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-light font-inter text-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center">
            <School className="h-8 w-8 text-primary" />
            <span className="ml-2 text-xl font-extrabold text-primary">School Rebuild Syria</span>
          </Link>
        </div>

        <Card className="shadow-lg rounded-2xl border-t-4 border-primary">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-primary">Welcome Back</CardTitle>
            <CardDescription className="text-gray-700">
              Sign in to your school account to manage needs and connect with supporters
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-primary">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="principal@school.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-gray-300 focus:border-gold focus:ring-gold"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-primary">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="border-gray-300 focus:border-gold focus:ring-gold"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gold text-primary hover:bg-gold/90 rounded-full shadow-md px-6 py-2 text-lg font-semibold transition-all duration-300 ease-in-out transform hover:scale-105" 
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6">
              <div className="text-center text-sm text-gray-700">
                Don't have an account?{" "}
                <Link to="/register" className="text-primary hover:underline font-semibold">
                  Register your school
                </Link>
              </div>
              
              <div className="text-center mt-4">
                <Link to="/admin/login" className="text-gold hover:underline font-semibold">
                  Admin Login
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Link to="/" className="text-primary hover:text-gold font-medium">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
