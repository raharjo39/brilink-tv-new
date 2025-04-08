
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowRight, MonitorPlay, Calendar, BarChart3, Film, Shield } from 'lucide-react';

const Index = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header/Navigation */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-bri-blue text-white font-bold rounded-md h-8 w-8 flex items-center justify-center mr-2">
              B
            </div>
            <h1 className="font-heading font-bold text-xl text-bri-blue">BriLink TV</h1>
          </div>
          <div>
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button>
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button>
                  Sign In
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-bri-blue to-blue-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 mb-10 lg:mb-0">
              <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
                Centralized Ad Management for BriLink Agents
              </h1>
              <p className="text-lg mb-8 text-blue-100">
                Stream promotional content to BriLink TVs across Indonesia with our advanced campaign management system
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/login">
                  <Button size="lg" className="bg-white text-bri-blue hover:bg-gray-100">
                    Access Dashboard
                  </Button>
                </Link>
                <Link to="/tv-client/preview">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    Preview TV Client
                  </Button>
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2 lg:pl-10">
              <div className="bg-white rounded-lg shadow-xl overflow-hidden border-8 border-white">
                <div className="aspect-video bg-black flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-pulse bg-bri-blue text-white font-bold rounded-md h-16 w-16 flex items-center justify-center mx-auto mb-4">
                      B
                    </div>
                    <p className="text-white font-heading text-xl">BriLink TV Preview</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="h-12 w-12 rounded-lg bg-blue-100 text-bri-blue flex items-center justify-center mb-4">
                <MonitorPlay className="h-6 w-6" />
              </div>
              <h3 className="font-heading text-xl font-semibold mb-2">Remote Management</h3>
              <p className="text-gray-600">
                Control content across all BriLink TV devices from a central dashboard
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="h-12 w-12 rounded-lg bg-orange-100 text-bri-orange flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6" />
              </div>
              <h3 className="font-heading text-xl font-semibold mb-2">Campaign Scheduling</h3>
              <p className="text-gray-600">
                Schedule different ad campaigns based on time, location, and target audience
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="h-12 w-12 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="font-heading text-xl font-semibold mb-2">Analytics & Insights</h3>
              <p className="text-gray-600">
                Track performance with detailed analytics on ad plays and device status
              </p>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="h-12 w-12 rounded-lg bg-green-100 text-green-600 flex items-center justify-center mb-4">
                <Film className="h-6 w-6" />
              </div>
              <h3 className="font-heading text-xl font-semibold mb-2">Content Management</h3>
              <p className="text-gray-600">
                Upload, organize and manage all your promotional video content in one place
              </p>
            </div>
            
            {/* Feature 5 */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="h-12 w-12 rounded-lg bg-yellow-100 text-yellow-600 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="font-heading text-xl font-semibold mb-2">Reliable & Secure</h3>
              <p className="text-gray-600">
                Built with enterprise-grade security and reliability for nationwide deployment
              </p>
            </div>
            
            {/* Feature 6 */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="h-12 w-12 rounded-lg bg-red-100 text-red-600 flex items-center justify-center mb-4">
                <MonitorPlay className="h-6 w-6" />
              </div>
              <h3 className="font-heading text-xl font-semibold mb-2">Auto-Recovery</h3>
              <p className="text-gray-600">
                Smart devices automatically recover from power or network outages
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-bri-blue text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto text-blue-100">
            Log in to the BriLink TV Management Dashboard to start broadcasting your content to clients nationwide
          </p>
          <Link to="/login">
            <Button size="lg" className="bg-white text-bri-blue hover:bg-gray-100">
              Access Dashboard
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center">
                <div className="bg-white text-bri-blue font-bold rounded-md h-8 w-8 flex items-center justify-center mr-2">
                  B
                </div>
                <span className="font-heading font-bold text-lg">BriLink TV</span>
              </div>
              <p className="text-gray-400 text-sm mt-2">© 2024 Bank BRI. All rights reserved.</p>
            </div>
            <div className="flex flex-wrap gap-8">
              <div>
                <h4 className="font-medium mb-2">Platform</h4>
                <ul className="space-y-1 text-gray-400 text-sm">
                  <li><a href="#" className="hover:text-white">Features</a></li>
                  <li><a href="#" className="hover:text-white">Documentation</a></li>
                  <li><a href="#" className="hover:text-white">API</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Support</h4>
                <ul className="space-y-1 text-gray-400 text-sm">
                  <li><a href="#" className="hover:text-white">Help Center</a></li>
                  <li><a href="#" className="hover:text-white">Contact Us</a></li>
                  <li><a href="#" className="hover:text-white">Technical Support</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Legal</h4>
                <ul className="space-y-1 text-gray-400 text-sm">
                  <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                  <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-white">Security</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
