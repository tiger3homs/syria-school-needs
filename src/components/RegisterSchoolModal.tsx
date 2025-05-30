
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, EyeOff, ArrowLeft, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const SYRIAN_GOVERNORATES = [
  "Damascus",
  "Rif Dimashq", 
  "Aleppo",
  "Homs",
  "Hama",
  "Latakia",
  "Tartus",
  "Deir ez-Zor",
  "Raqqa",
  "Hasakah",
  "Daraa",
  "Suwayda",
  "Quneitra",
  "Idlib"
];

const EDUCATION_LEVELS = [
  { value: "primary", label: "Primary School" },
  { value: "middle", label: "Middle School" },
  { value: "high_school", label: "High School" }
];

interface RegisterSchoolModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RegisterSchoolModal = ({ open, onOpenChange }: RegisterSchoolModalProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Location
    governorate: "",
    city: "",
    address: "",
    
    // Step 2: Basic Info
    schoolName: "",
    educationLevel: "",
    numberOfStudents: "",
    principalName: "",
    
    // Step 3: Contact & Security
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    description: ""
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { signUp } = useAuth();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.governorate && formData.city && formData.address);
      case 2:
        return !!(formData.schoolName && formData.educationLevel && formData.numberOfStudents && formData.principalName);
      case 3:
        return !!(formData.email && formData.phone && formData.password && formData.confirmPassword);
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    } else {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields before proceeding.",
        variant: "destructive"
      });
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both passwords are the same.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      await signUp(formData.email, formData.password, {
        principalName: formData.principalName,
        schoolName: formData.schoolName,
        address: `${formData.address}, ${formData.city}, ${formData.governorate}`,
        phone: formData.phone,
        numberOfStudents: formData.numberOfStudents,
        educationLevel: formData.educationLevel,
        description: formData.description
      });

      toast({
        title: "Registration successful!",
        description: "Please check your email for verification instructions.",
      });
      
      onOpenChange(false);
      // Reset form
      setCurrentStep(1);
      setFormData({
        governorate: "",
        city: "",
        address: "",
        schoolName: "",
        educationLevel: "",
        numberOfStudents: "",
        principalName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        description: ""
      });
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold">School Location</h3>
              <p className="text-sm text-gray-600">Tell us where your school is located</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="governorate">Governorate *</Label>
              <Select value={formData.governorate} onValueChange={(value) => handleInputChange("governorate", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select governorate" />
                </SelectTrigger>
                <SelectContent>
                  {SYRIAN_GOVERNORATES.map((gov) => (
                    <SelectItem key={gov} value={gov}>{gov}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                placeholder="Enter city name"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Street Address *</Label>
              <Textarea
                id="address"
                placeholder="Enter detailed street address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
              />
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold">School Information</h3>
              <p className="text-sm text-gray-600">Tell us about your school</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="schoolName">School Name *</Label>
              <Input
                id="schoolName"
                placeholder="Damascus Elementary School"
                value={formData.schoolName}
                onChange={(e) => handleInputChange("schoolName", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="educationLevel">Education Level *</Label>
              <Select value={formData.educationLevel} onValueChange={(value) => handleInputChange("educationLevel", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select education level" />
                </SelectTrigger>
                <SelectContent>
                  {EDUCATION_LEVELS.map((level) => (
                    <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="numberOfStudents">Number of Students *</Label>
              <Input
                id="numberOfStudents"
                type="number"
                placeholder="250"
                value={formData.numberOfStudents}
                onChange={(e) => handleInputChange("numberOfStudents", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="principalName">Principal Name *</Label>
              <Input
                id="principalName"
                placeholder="Dr. Ahmad Al-Hassan"
                value={formData.principalName}
                onChange={(e) => handleInputChange("principalName", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">School Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Brief description of your school"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
              />
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold">Contact & Security</h3>
              <p className="text-sm text-gray-600">Set up your account credentials</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="principal@school.edu"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+963 xxx xxx xxx"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center">Register Your School</DialogTitle>
        </DialogHeader>
        
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-6">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {step}
              </div>
              {step < 3 && (
                <div
                  className={`w-12 h-1 mx-2 ${
                    currentStep > step ? "bg-blue-600" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="min-h-[300px]">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </Button>
          
          {currentStep < 3 ? (
            <Button
              onClick={nextStep}
              className="flex items-center gap-2"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RegisterSchoolModal;
