
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { sanitizeInput, isValidEmail, validatePassword, rateLimiter } from '@/utils/security';
import { performanceMonitor } from '@/utils/performance';

interface UserProfile {
  id: string;
  email: string;
  role: 'admin' | 'principal';
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<UserProfile | null>;
  signUp: (email: string, password: string, userData: any) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  isPrincipal: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    performanceMonitor.mark('auth-init-start');
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    performanceMonitor.mark('auth-init-end');
    performanceMonitor.measure('auth-initialization', 'auth-init-start', 'auth-init-end');

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      // Use maybeSingle() instead of single() to handle case where no profile exists
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        // Only show toast for actual errors, not missing profiles
        if (error.code !== 'PGRST116') {
          toast({
            title: "Error loading profile",
            description: error.message,
            variant: "destructive",
          });
        }
      } else if (data) {
        setProfile({...data, role: data.role as 'admin' | 'principal'});
      }
      // If no profile exists, we just continue without showing an error
    } catch (error: any) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string): Promise<UserProfile | null> => {
    // Security: Input validation and sanitization
    const sanitizedEmail = sanitizeInput(email.toLowerCase().trim());
    
    if (!isValidEmail(sanitizedEmail)) {
      throw new Error('Please enter a valid email address');
    }
    
    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    // Security: Rate limiting
    const clientId = `signin_${sanitizedEmail}`;
    if (!rateLimiter.isAllowed(clientId)) {
      throw new Error('Too many login attempts. Please try again later.');
    }

    performanceMonitor.mark('signin-start');

    const { data, error } = await supabase.auth.signInWithPassword({
      email: sanitizedEmail,
      password,
    });

    if (error) {
      performanceMonitor.mark('signin-error');
      throw error;
    }

    if (data.user) {
      // Fetch profile immediately after successful sign-in
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .maybeSingle();

      if (profileError) {
        console.error('Error fetching profile after sign-in:', profileError);
        toast({
          title: "Error loading profile",
          description: profileError.message,
          variant: "destructive",
        });
        return null;
      }

      if (profileData) {
        const userProfile: UserProfile = { ...profileData, role: profileData.role as 'admin' | 'principal' };
        setProfile(userProfile);
        setUser(data.user);
        setLoading(false);
        
        performanceMonitor.mark('signin-success');
        performanceMonitor.measure('signin-duration', 'signin-start', 'signin-success');
        
        return userProfile;
      }
    }
    return null;
  };

  const signUp = async (email: string, password: string, userData: any) => {
    // Security: Input validation and sanitization
    const sanitizedEmail = sanitizeInput(email.toLowerCase().trim());
    
    if (!isValidEmail(sanitizedEmail)) {
      throw new Error('Please enter a valid email address');
    }
    
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.errors[0]);
    }

    // Sanitize user data
    const sanitizedUserData = {
      ...userData,
      name: userData.name ? sanitizeInput(userData.name) : '',
      phone: userData.phone ? sanitizeInput(userData.phone) : '',
    };

    // Security: Rate limiting
    const clientId = `signup_${sanitizedEmail}`;
    if (!rateLimiter.isAllowed(clientId, 3)) { // More restrictive for signup
      throw new Error('Too many signup attempts. Please try again later.');
    }

    const { error } = await supabase.auth.signUp({
      email: sanitizedEmail,
      password,
      options: {
        data: {
          role: 'principal',
          ...sanitizedUserData
        },
        emailRedirectTo: `${window.location.origin}/`
      }
    });

    if (error) throw error;
  };

  const signOut = async () => {
    setLoading(true);
    
    // Security: Clear any cached sensitive data
    try {
      localStorage.removeItem('i18nextLng'); // Keep language preference
      sessionStorage.clear(); // Clear session data
    } catch (error) {
      console.warn('Error clearing storage:', error);
    }
    
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  const value = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    isAdmin: profile?.role === 'admin',
    isPrincipal: profile?.role === 'principal',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
