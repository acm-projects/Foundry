import { Button } from './ui/button';
import { Cloud, Server, Database, HardDrive, ArrowRight, Zap, Shield, Globe } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-orange-200/30">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
                <Cloud className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent">
                Foundry
              </span>
            </div>
            <Button 
              variant="outline" 
              className="border-orange-300 text-orange-600 hover:bg-orange-50 hover:border-orange-400"
              onClick={() => console.log('Login clicked')}
            >
              Login
            </Button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20" style={{ marginTop: 'calc(1rem + 10vh)' }}>
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-orange-600 via-orange-700 to-orange-800 bg-clip-text text-transparent leading-tight" style={{ marginTop: '-10vh' }}>
            Foundry
          </h1>
          <p className="text-4xl text-black mb-4 font-bold mt-16">
            Drag. Drop. Deploy.
          </p>
          <p className="text-lg text-gray-600 mb-12 font-medium">
            Visual AWS service management with powerful automation
          </p>
          
          <Button 
            onClick={onGetStarted}
            size="lg"
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            Get Started
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Services Preview - Moved up */}
      <div className="container mx-auto px-6 py-16" style={{ marginTop: '-10vh' }}>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
          <div className="flex flex-col items-center p-4 rounded-xl bg-white/70 backdrop-blur-sm border border-orange-200/30">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-3">
              <Server className="w-5 h-5 text-orange-600" />
            </div>
            <span className="text-sm font-medium text-gray-700">EC2 Instance</span>
          </div>
          
          <div className="flex flex-col items-center p-4 rounded-xl bg-white/70 backdrop-blur-sm border border-orange-200/30">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-3">
              <HardDrive className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-sm font-medium text-gray-700">S3 Bucket</span>
          </div>
          
          <div className="flex flex-col items-center p-4 rounded-xl bg-white/70 backdrop-blur-sm border border-orange-200/30">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
              <Database className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-700">RDS</span>
          </div>
          
          <div className="flex flex-col items-center p-4 rounded-xl bg-white/70 backdrop-blur-sm border border-orange-200/30">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
              <Database className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-sm font-medium text-gray-700">DynamoDB</span>
          </div>
        </div>
      </div>

      {/* Features Section - Moved down */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose Foundry?</h2>
          <p className="text-lg text-gray-600">
            Built for developers, by developers
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-orange-200/30 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Lightning Fast</h3>
            <p className="text-gray-600">
              Deploy AWS infrastructure in minutes, not hours. Our visual interface streamlines the entire process.
            </p>
          </div>

          <div className="text-center p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-orange-200/30 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Secure by Default</h3>
            <p className="text-gray-600">
              Built-in security best practices and automated compliance checks ensure your infrastructure stays protected.
            </p>
          </div>

          <div className="text-center p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-orange-200/30 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Scale Globally</h3>
            <p className="text-gray-600">
              From prototype to production, scale your applications across AWS regions with just a few clicks.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to simplify your AWS journey?
          </h2>
          <p className="text-orange-100 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of developers who have already streamlined their cloud infrastructure with Foundry.
          </p>
          <Button 
            onClick={onGetStarted}
            size="lg"
            variant="secondary"
            className="bg-white text-orange-600 hover:bg-orange-50 px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            Start Building Now
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white/80 backdrop-blur-sm border-t border-orange-200/30 py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-600">
            © 2024 Foundry. Making AWS accessible to everyone.
          </p>
        </div>
      </div>
    </div>
  );
}