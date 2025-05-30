import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ShieldCheck, Building2, GraduationCap, Handshake, BookOpen, Lightbulb } from "lucide-react"; // Icons for Mission and Categories

const Index = () => {
  return (
    <div className="min-h-screen bg-light font-inter text-primary">
      {/* Hero Section - Full-width with impactful background and clear message */}
      <section 
        className="relative py-32 px-4 sm:px-6 lg:px-8 bg-cover bg-center text-white overflow-hidden" 
        style={{ backgroundImage: `url('/banner.jpg')` }}
      >
        {/* Darker overlay for better text contrast and governmental feel */}
        <div className="absolute inset-0 bg-primary opacity-85"></div> 
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight drop-shadow-lg">
            Rebuilding Hope,
            <span className="text-gold block md:inline"> One School at a Time</span>
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl mb-10 max-w-3xl mx-auto font-light opacity-90">
            Dedicated to restoring and enhancing educational infrastructure across the Syrian Arab Republic.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/register">
              <Button size="lg" className="bg-gold text-primary hover:bg-gold/90 rounded-full shadow-xl px-10 py-4 text-lg font-semibold transition-all duration-300 ease-in-out transform hover:scale-105">
                Get Started
              </Button>
            </Link>
            <Link to="/needs">
              <Button size="lg" variant="outline" className="border-2 border-gold text-primary hover:bg-gold hover:text-white rounded-full shadow-xl px-10 py-4 text-lg font-semibold transition-all duration-300 ease-in-out transform hover:scale-105">
                View School Needs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section - Clean and easy to follow */}
      <section className="py-20 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4">How It Works</h2>
            <p className="text-xl text-gray-800 max-w-2xl mx-auto">Simple, structured steps to connect schools with the support they need.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center shadow-lg hover:shadow-xl transition-shadow rounded-2xl p-8 border-t-4 border-gold">
              <CardHeader>
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mx-auto mb-6">
                  <span className="text-primary font-extrabold text-3xl">1</span>
                </div>
                <CardTitle className="text-2xl font-semibold text-primary">Register Your School</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-800 leading-relaxed">
                  School principals create a secure profile with essential details, contact information, and student count.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center shadow-lg hover:shadow-xl transition-shadow rounded-2xl p-8 border-t-4 border-primary">
              <CardHeader>
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gold/10 rounded-full mx-auto mb-6">
                  <span className="text-gold font-extrabold text-3xl">2</span>
                </div>
                <CardTitle className="text-2xl font-semibold text-primary">Submit Needs</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-800 leading-relaxed">
                  Clearly list specific needs like furniture, equipment, or facilities with detailed descriptions and priorities.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center shadow-lg hover:shadow-xl transition-shadow rounded-2xl p-8 border-t-4 border-gold">
              <CardHeader>
                <div className="inline-flex items-center justify-center w-16 h-16 bg-syrian-red/10 rounded-full mx-auto mb-6">
                  <span className="text-syrian-red font-extrabold text-3xl">3</span>
                </div>
                <CardTitle className="text-2xl font-semibold text-primary">Get Connected</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-800 leading-relaxed">
                  Donors and organizations review submitted needs and connect directly to provide essential support.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Progress Overview Section - Clear and impactful statistics */}
      <section className="py-20 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-12">Our Progress at a Glance</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-primary text-white rounded-2xl shadow-xl">
              <h3 className="text-5xl font-extrabold mb-2">500+</h3>
              <p className="text-xl font-semibold">Schools Registered</p>
            </div>
            <div className="p-8 bg-light text-primary rounded-2xl shadow-xl">
              <h3 className="text-5xl font-extrabold mb-2">150+</h3>
              <p className="text-xl font-semibold">Schools Rebuilt</p>
            </div>
            <div className="p-8 bg-primary text-white rounded-2xl shadow-xl">
              <h3 className="text-5xl font-extrabold mb-2">1,200+</h3>
              <p className="text-xl font-semibold">Needs Fulfilled</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values Section - Structured and authoritative */}
      <section className="py-20 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-primary mb-12">Our Mission & Values</h2>
          <p className="text-xl text-gray-800 max-w-4xl mx-auto mb-16">
            The Ministry of Education is committed to fostering a resilient and educated generation. Our efforts are rooted in core values that guide every step of the rebuilding process.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-white rounded-2xl shadow-lg flex flex-col items-center text-center border-t-4 border-primary">
              <ShieldCheck className="h-16 w-16 text-gold mb-6" />
              <h3 className="text-2xl font-semibold text-primary mb-3">Transparency</h3>
              <p className="text-gray-700 leading-relaxed">Ensuring every resource and donation is managed with utmost integrity and accountability.</p>
            </div>
            <div className="p-8 bg-white rounded-2xl shadow-lg flex flex-col items-center text-center border-t-4 border-gold">
              <GraduationCap className="h-16 w-16 text-primary mb-6" />
              <h3 className="text-2xl font-semibold text-primary mb-3">Education for All</h3>
              <p className="text-gray-700 leading-relaxed">Providing equitable access to quality education for every child, regardless of circumstance.</p>
            </div>
            <div className="p-8 bg-white rounded-2xl shadow-lg flex flex-col items-center text-center border-t-4 border-primary">
              <Building2 className="h-16 w-16 text-gold mb-6" />
              <h3 className="text-2xl font-semibold text-primary mb-3">Sustainable Infrastructure</h3>
              <p className="text-gray-700 leading-relaxed">Building durable and modern learning environments that stand the test of time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section - Prominent and inviting */}
      <section className="py-20 bg-primary text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl md:text-2xl mb-10">
            Join our national mission to rebuild and strengthen educational infrastructure in Syria.
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-gold text-primary hover:bg-gold/90 rounded-full shadow-xl px-10 py-4 text-lg font-semibold transition-all duration-300 ease-in-out transform hover:scale-105">
              Register Your School Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer - Official and informative */}
      <footer className="bg-primary text-white py-16 font-inter">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <div className="flex items-center mb-6">
                <img src="/logo.jpg" alt="Syrian Emblem" className="h-14 w-auto mr-4" />
                <span className="text-2xl font-extrabold">School Rebuild Syria</span>
              </div>
              <p className="text-white leading-relaxed">
                Connecting Syrian schools with global supporters to rebuild and enhance educational infrastructure for a brighter future.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-6 text-gold">Quick Links</h3>
              <ul className="space-y-3">
                <li><Link to="/" className="text-white hover:text-gold transition-colors">Home</Link></li>
                <li><Link to="/needs" className="text-white hover:text-gold transition-colors">View Needs</Link></li>
                <li><Link to="/schools" className="text-white hover:text-gold transition-colors">Our Schools</Link></li>
                <li><Link to="/contact" className="text-white hover:text-gold transition-colors">Contact Us</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-6 text-gold">Official Information</h3>
              <ul className="space-y-3">
                <li><Link to="/privacy" className="text-white hover:text-gold transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-white hover:text-gold transition-colors">Terms of Service</Link></li>
                <li><Link to="/accessibility" className="text-white hover:text-gold transition-colors">Accessibility Statement</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gold/50 mt-12 pt-8 text-center">
            <p className="text-white text-sm">
              &copy; {new Date().getFullYear()} School Rebuild Syria. All rights reserved.
              <br />
              A national initiative by the Ministry of Education, Syrian Arab Republic.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
