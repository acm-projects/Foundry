import React from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { 
  Palette, 
  ArrowRight, 
  Layers, 
  Zap, 
  Cloud, 
  Settings, 
  Home,
  Workflow
} from 'lucide-react';
import { PageType } from '../../types';

interface DashboardPageProps {
  onNavigate: (page: PageType) => void;
  workflowName?: string;
}

export function DashboardPage({ onNavigate, workflowName }: DashboardPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Workflow className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Dashboard
            </h1>
          </div>
          <p className="text-xl text-gray-600 mb-2">
            {workflowName ? `Workflow: ${workflowName}` : 'New Workflow'}
          </p>
          <p className="text-gray-500">
            Set up your AWS infrastructure with visual components
          </p>
        </div>

        {/* Main Action Card */}
        <div className="max-w-4xl mx-auto mb-8">
          <Card className="border-2 border-blue-200 shadow-xl bg-gradient-to-r from-blue-50 to-white">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl text-blue-800 flex items-center justify-center gap-2">
                <Palette className="w-6 h-6" />
                Visual Service Designer
              </CardTitle>
              <CardDescription className="text-lg text-gray-600">
                Drag and drop AWS services to build your infrastructure
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="bg-white rounded-lg p-6 mb-6 border border-blue-100">
                <div className="flex justify-center items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Cloud className="w-6 h-6 text-orange-600" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Layers className="w-6 h-6 text-green-600" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Zap className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  EC2 → S3 → Lambda - Build complex architectures visually
                </p>
              </div>
              
              <Button 
                onClick={() => onNavigate('canvas')}
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-12 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                <Palette className="mr-3 w-5 h-5" />
                Open Canvas
                <ArrowRight className="ml-3 w-5 h-5" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow border border-blue-100">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Layers className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-lg text-blue-800">Service Library</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600">
                Access a comprehensive library of AWS services including EC2, S3, RDS, Lambda, and more
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border border-blue-100">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-lg text-blue-800">Auto-Configuration</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600">
                Intelligent service configuration with best practices and security recommendations
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border border-blue-100">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-lg text-blue-800">One-Click Deploy</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600">
                Generate CloudFormation templates and deploy your infrastructure with a single click
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Back Button */}
        <div className="text-center mt-12">
          <Button 
            onClick={() => onNavigate('workflows')} 
            variant="outline"
            className="border-blue-300 text-blue-600 hover:bg-blue-50"
          >
            <Home className="mr-2 w-4 h-4" />
            Back to Workflows
          </Button>
        </div>
      </div>
    </div>
  );
}