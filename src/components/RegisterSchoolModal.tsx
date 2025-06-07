
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
import { useTranslation } from "react-i18next";

const SYRIAN_GOVERNORATES = [
  "damascus",
  "rif_damascus",
  "aleppo",
  "homs",
  "hama",
  "latakia",
  "tartus",
  "deir_ez_zor",
  "raqqa",
  "hasakah",
  "daraa",
  "sweida",
  "quneitra",
  "idlib"
] as const;

const EDUCATION_LEVELS = [
  { value: "primary", label: "Primary School" },
  { value: "middle", label: "Middle School" },
  { value: "high_school", label: "High School" },
  { value: "mixed", label: "Mixed Levels" }
];

interface RegisterSchoolModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RegisterSchoolModal = ({ open, onOpenChange }: RegisterSchoolModalProps) => {
  const { t } = useTranslation();
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
    let processedValue = value;
    if (field === "phone") {
      if (value && !value.startsWith("+963")) {
        processedValue = "+963" + value;
      } else if (!value) {
        processedValue = ""; // Allow clearing the input
      }
    }
    setFormData(prev => ({
      ...prev,
      [field]: processedValue
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
        title: t("toast.missingInfoTitle"),
        description: t("toast.fillAllFieldsProceed"),
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
        title: t("toast.missingInfoTitle"),
        description: t("toast.fillAllFields"),
        variant: "destructive"
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: t("toast.passwordsDontMatchTitle"),
        description: t("toast.passwordsDontMatchDescription"),
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
        title: t("toast.registrationSuccessTitle"),
        description: t("toast.registrationSuccessDescription"),
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
        title: t("toast.registrationFailedTitle"),
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
              <h3 className="text-lg font-semibold">{t("registerSchoolModal.step1Title")}</h3>
              <p className="text-sm text-gray-600">{t("registerSchoolModal.step1Description")}</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="governorate">{t("registerSchoolModal.governorateLabel")}</Label>
              <Select value={formData.governorate} onValueChange={(value) => handleInputChange("governorate", value)}>
                <SelectTrigger>
                  <SelectValue placeholder={t("registerSchoolModal.selectGovernoratePlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  {SYRIAN_GOVERNORATES.map((gov) => (
                    <SelectItem key={gov} value={gov}>
                      {t(`governorates.${gov}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="city">{t("registerSchoolModal.cityLabel")}</Label>
              <Input
                id="city"
                placeholder={t("registerSchoolModal.cityPlaceholder")}
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">{t("registerSchoolModal.addressLabel")}</Label>
              <Textarea
                id="address"
                placeholder={t("registerSchoolModal.addressPlaceholder")}
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
              <h3 className="text-lg font-semibold">{t("registerSchoolModal.step2Title")}</h3>
              <p className="text-sm text-gray-600">{t("registerSchoolModal.step2Description")}</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="schoolName">{t("registerSchoolModal.schoolNameLabel")}</Label>
              <Input
                id="schoolName"
                placeholder={t("registerSchoolModal.schoolNamePlaceholder")}
                value={formData.schoolName}
                onChange={(e) => handleInputChange("schoolName", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="educationLevel">{t("registerSchoolModal.educationLevelLabel")}</Label>
              <Select value={formData.educationLevel} onValueChange={(value) => handleInputChange("educationLevel", value)}>
                <SelectTrigger>
                  <SelectValue placeholder={t("registerSchoolModal.selectEducationLevelPlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  {EDUCATION_LEVELS.map((level) => (
                    <SelectItem key={level.value} value={level.value}>{t(`educationLevels.${level.value}`)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="numberOfStudents">{t("registerSchoolModal.numberOfStudentsLabel")}</Label>
              <Input
                id="numberOfStudents"
                type="number"
                placeholder={t("registerSchoolModal.numberOfStudentsPlaceholder")}
                value={formData.numberOfStudents}
                onChange={(e) => handleInputChange("numberOfStudents", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="principalName">{t("registerSchoolModal.principalNameLabel")}</Label>
              <Input
                id="principalName"
                placeholder={t("registerSchoolModal.principalNamePlaceholder")}
                value={formData.principalName}
                onChange={(e) => handleInputChange("principalName", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">{t("registerSchoolModal.descriptionLabel")}</Label>
              <Textarea
                id="description"
                placeholder={t("registerSchoolModal.descriptionPlaceholder")}
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
              <h3 className="text-lg font-semibold">{t("registerSchoolModal.step3Title")}</h3>
              <p className="text-sm text-gray-600">{t("registerSchoolModal.step3Description")}</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">{t("registerSchoolModal.emailLabel")}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t("registerSchoolModal.emailPlaceholder")}
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">{t("registerSchoolModal.phoneLabel")}</Label>
              <Input
                id="phone"
                type="tel"
                placeholder={t("registerSchoolModal.phonePlaceholder")}
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">{t("registerSchoolModal.passwordLabel")}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={t("registerSchoolModal.passwordPlaceholder")}
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
                <Label htmlFor="confirmPassword">{t("registerSchoolModal.confirmPasswordLabel")}</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder={t("registerSchoolModal.passwordPlaceholder")}
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
          <DialogTitle className="text-center">{t("registerSchoolModal.title")}</DialogTitle>
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
            {t("registerSchoolModal.previousButton")}
          </Button>
          
          {currentStep < 3 ? (
            <Button
              onClick={nextStep}
              className="flex items-center gap-2"
            >
              {t("registerSchoolModal.nextButton")}
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              {isLoading ? t("registerSchoolModal.creatingAccountButton") : t("registerSchoolModal.createAccountButton")}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RegisterSchoolModal;
