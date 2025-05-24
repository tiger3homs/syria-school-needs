
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { School, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const SubmitNeed = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    quantity: "",
    priority: "",
    estimatedCost: "",
    urgencyReason: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const categories = [
    { value: "furniture", label: "Furniture" },
    { value: "equipment", label: "Equipment" },
    { value: "outdoor", label: "Outdoor Facilities" },
    { value: "other", label: "Other" }
  ];

  const priorities = [
    { value: "high", label: "High" },
    { value: "medium", label: "Medium" },
    { value: "low", label: "Low" }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate submission
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Need submitted successfully!",
        description: "Your need has been recorded and will be reviewed by our team.",
      });
      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "",
        quantity: "",
        priority: "",
        estimatedCost: "",
        urgencyReason: ""
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <School className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">School Rebuild Syria</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Submit a New Need</h1>
          <p className="text-gray-600">Tell us what your school needs to improve the learning environment</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Need Details</CardTitle>
            <CardDescription>
              Please provide detailed information about what your school needs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Need Title *</Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="e.g., Student Desks for Grade 3"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select onValueChange={(value) => handleSelectChange("category", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Detailed description of the need, including specifications, current condition, and how it will benefit students"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    required
                  />
                </div>
              </div>

              {/* Specifications */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Specifications</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity Needed *</Label>
                    <Input
                      id="quantity"
                      name="quantity"
                      type="number"
                      placeholder="e.g., 25"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority Level *</Label>
                    <Select onValueChange={(value) => handleSelectChange("priority", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        {priorities.map((priority) => (
                          <SelectItem key={priority.value} value={priority.value}>
                            {priority.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="estimatedCost">Estimated Cost (Optional)</Label>
                    <Input
                      id="estimatedCost"
                      name="estimatedCost"
                      placeholder="e.g., $500"
                      value={formData.estimatedCost}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              {/* Urgency */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Additional Information</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="urgencyReason">Why is this urgent? (For high priority items)</Label>
                  <Textarea
                    id="urgencyReason"
                    name="urgencyReason"
                    placeholder="Explain why this need is urgent and how it affects students' education"
                    value={formData.urgencyReason}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </div>
              </div>

              {/* Categories Info */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Category Guidelines:</h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <p><strong>Furniture:</strong> Desks, chairs, storage, classroom furniture</p>
                  <p><strong>Equipment:</strong> Whiteboards, projectors, computers, teaching tools</p>
                  <p><strong>Outdoor Facilities:</strong> Playground equipment, sports facilities, outdoor learning spaces</p>
                  <p><strong>Other:</strong> Books, supplies, utilities, special requirements</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={isLoading} className="flex-1">
                  {isLoading ? "Submitting..." : "Submit Need"}
                </Button>
                <Link to="/dashboard">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubmitNeed;
