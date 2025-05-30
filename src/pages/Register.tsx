
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { School } from "lucide-react";
import { Link } from "react-router-dom";
import RegisterSchoolModal from "@/components/RegisterSchoolModal";

const Register = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen bg-light font-inter text-primary py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center">
            <School className="h-8 w-8 text-primary" />
            <span className="ml-2 text-xl font-extrabold text-primary">School Rebuild Syria</span>
          </Link>
        </div>

        <Card className="shadow-lg rounded-2xl border-t-4 border-primary">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-primary">Register Your School</CardTitle>
            <CardDescription className="text-gray-700">
              Join our platform to connect with supporters and get the resources your school needs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="bg-primary/10 rounded-lg p-6 mb-6">
                <School className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-primary mb-2">Get Started</h3>
                <p className="text-gray-700 text-sm">
                  Register your school in just a few simple steps and start receiving support from our community.
                </p>
              </div>
              
              <Button 
                onClick={() => setShowModal(true)}
                className="w-full bg-gold text-primary hover:bg-gold/90 rounded-full shadow-md px-6 py-2 text-lg font-semibold transition-all duration-300 ease-in-out transform hover:scale-105"
                size="lg"
              >
                Register School
              </Button>
            </div>

            <div className="text-center text-sm text-gray-700">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline font-semibold">
                Sign in here
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Link to="/" className="text-primary hover:text-gold font-medium">
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
