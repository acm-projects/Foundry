import React from 'react'
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Home, DollarSign } from 'lucide-react';

interface CostMonitoringPageProps {
  onBackToHome: () => void;
  services: any[];
}

export function CostMonitoringPage({ onBackToHome, services }: CostMonitoringPageProps) {
  const serviceBreakdown = services.map(service => ({
    name: service.name,
    type: service.id,
    estimatedCost: 0.00, // Default to $0.00
  }));

  // Calculate total cost
  const totalCost = serviceBreakdown.reduce((total, service) => total + service.estimatedCost, 0);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
                <DollarSign size={20} className="text-white" />
              </div>
              Cost Monitoring
            </h1>
            <p className="text-muted-foreground">
              Estimated costs for your AWS services
            </p>
          </div>
          <Button
            onClick={onBackToHome}
            variant="outline"
            className="flex items-center gap-2 hover:border-orange-300 hover:bg-orange-50"
          >
            <Home size={20} />
            Back to Home
          </Button>
        </div>

        {/* Total Cost Summary */}
        <Card className="mb-6 border-orange-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Total Monthly Cost</p>
              <p className="text-4xl font-medium bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent">${totalCost.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {serviceBreakdown.length} service{serviceBreakdown.length !== 1 ? 's' : ''}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Service Cost List */}
        <Card>
          <CardHeader>
            <CardTitle>Service Pricing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {serviceBreakdown.length > 0 ? (
                serviceBreakdown.map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:border-orange-200 hover:bg-orange-50/30 transition-colors">
                    <div>
                      <h3 className="font-medium">{service.name}</h3>
                      <p className="text-sm text-muted-foreground capitalize">
                        {service.type === 'ec2' ? 'EC2 Instance' : 
                         service.type === 's3' ? 'S3 Bucket' :
                         service.type === 'rds' ? 'RDS Database' :
                         service.type === 'dynamodb' ? 'DynamoDB Table' : 
                         service.type}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-orange-600">${service.estimatedCost.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">per month</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No services deployed yet</p>
                  <p className="text-sm">Deploy some AWS services to see cost breakdown</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}