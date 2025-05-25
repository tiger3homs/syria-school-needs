
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface RegisterSchoolModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

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

export const RegisterSchoolModal = ({ open, onOpenChange, onSuccess }: RegisterSchoolModalProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    // Step 1: Location
    governorate: "",
    city: "",
    address: "",
    
    // Step 2: Basic Info
    schoolName: "",
    numberOfStudents: "",
    principalName: "",
    
    // Step 3: Contact Info
    contactPhone: "",
    contactEmail: "",
    description: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.governorate && formData.city && formData.address;
      case 2:
        return formData.schoolName && formData.numberOfStudents && formData.principalName;
      case 3:
        return formData.contactPhone && formData.contactEmail;
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to register a school",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const fullAddress = `${formData.address}, ${formData.city}, ${formData.governorate}`;
      
      const { error } = await supabase
        .from('schools')
        .insert({
          principal_id: user.id,
          name: formData.schoolName,
          address: fullAddress,
          number_of_students: parseInt(formData.numberOfStudents),
          contact_phone: formData.contactPhone,
          contact_email: formData.contactEmail,
          description: formData.description
        });

      if (error) throw error;

      toast({
        title: "School registered successfully!",
        description: "Your school has been added to the platform.",
      });
      
      onSuccess();
      onOpenChange(false);
      
      // Reset form
      setFormData({
        governorate: "",
        city: "",
        address: "",
        schoolName: "",
        numberOfStudents: "",
        principalName: "",
        contactPhone: "",
        contactEmail: "",
        description: ""
      });
      setCurrentStep(1);
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

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">School Location</h3>
            
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
              <Label htmlFor="city">City/District *</Label>
              <Input
                id="city"
                placeholder="Enter city or district"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Street Address *</Label>
              <Textarea
                id="address"
                placeholder="Enter detailed street address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                required
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            
            <div className="space-y-2">
              <Label htmlFor="schoolName">School Name *</Label>
              <Input
                id="schoolName"
                placeholder="Damascus Elementary School"
                value={formData.schoolName}
                onChange={(e) => handleInputChange("schoolName", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="numberOfStudents">Number of Students *</Label>
              <Input
                id="numberOfStudents"
                type="number"
                placeholder="250"
                value={formData.numberOfStudents}
                onChange={(e) => handleInputChange("numberOfStudents", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="principalName">Principal Name *</Label>
              <Input
                id="principalName"
                placeholder="Dr. Ahmad Al-Hassan"
                value={formData.principalName}
                onChange={(e) => handleInputChange("principalName", e.target.value)}
                required
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Information & Confirmation</h3>
            
            <div className="space-y-2">
              <Label htmlFor="contactPhone">Phone Number *</Label>
              <Input
                id="contactPhone"
                type="tel"
                placeholder="+963 xxx xxx xxx"
                value={formData.contactPhone}
                onChange={(e) => handleInputChange("contactPhone", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactEmail">Email Address *</Label>
              <Input
                id="contactEmail"
                type="email"
                placeholder="principal@school.edu"
                value={formData.contactEmail}
                onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">School Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of your school..."
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
              />
            </div>

            {/* Summary */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Review Your Information:</h4>
              <div className="text-sm space-y-1">
                <p><strong>School:</strong> {formData.schoolName}</p>
                <p><strong>Location:</strong> {formData.governorate}, {formData.city}</p>
                <p><strong>Students:</strong> {formData.numberOfStudents}</p>
                <p><strong>Principal:</strong> {formData.principalName}</p>
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Register Your School</DialogTitle>
          <DialogDescription>
            Step {currentStep} of 3: Complete the information about your school
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {/* Progress indicator */}
          <div className="flex items-center mb-6">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step <= currentStep
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step}
                </div>
                {step < 3 && (
                  <div
                    className={`h-1 w-12 mx-2 ${
                      step < currentStep ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step content */}
          {renderStep()}

          {/* Navigation buttons */}
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            {currentStep < 3 ? (
              <Button
                onClick={nextStep}
                disabled={!isStepValid()}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!isStepValid() || isLoading}
              >
                {isLoading ? "Registering..." : "Register School"}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
