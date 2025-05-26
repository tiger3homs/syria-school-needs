
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { School } from "lucide-react";
import { Link } from "react-router-dom";
import RegisterSchoolModal from "@/components/RegisterSchoolModal";

const Register = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center">
            <School className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">School Rebuild Syria</span>
          </Link>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Register Your School</CardTitle>
            <CardDescription>
              Join our platform to connect with supporters and get the resources your school needs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <School className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Get Started</h3>
                <p className="text-gray-600 text-sm">
                  Register your school in just a few simple steps and start receiving support from our community.
                </p>
              </div>
              
              <Button 
                onClick={() => setShowModal(true)}
                className="w-full"
                size="lg"
              >
                Register School
              </Button>
            </div>

            <div className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 hover:underline font-medium">
                Sign in here
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Link to="/" className="text-sm text-gray-600 hover:text-gray-900">
            ← Back to home
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
