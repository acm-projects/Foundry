import React from "react";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Workflow, Plus, Play, Circle, FileText } from "lucide-react";

interface SavedWorkflow {
  id: string;
  name: string;
  description: string;
  services: any[];
  connections: any[];
  configurations: Record<string, any>;
  status: "draft" | "deployed" | "live";
  lastModified: string;
  createdAt: string;
  cost: number;
  hasCreated: boolean;
  hasDeployedCode: boolean;
}

interface WorkflowsPageProps {
  workflows: SavedWorkflow[];
  onCreateNew: () => void;
  onOpenWorkflow: (workflowId: string) => void;
  onDeleteWorkflow: (workflowId: string) => void;
  onBack: () => void;
}

export function WorkflowsPage({
  workflows,
  onCreateNew,
  onOpenWorkflow,
  onDeleteWorkflow,
  onBack,
}: WorkflowsPageProps) {
  // Show message if no workflows exist
  const displayWorkflows = workflows.length > 0 ? workflows : [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "live":
        return "bg-green-100 text-green-700 border-green-200";
      case "deployed":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "draft":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getServiceIcon = (service: string) => {
    // You can expand this with actual AWS service icons
    switch (service) {
      case "ec2":
        return "🖥️";
      case "s3":
        return "🪣";
      case "rds":
        return "🗄️";
      case "dynamodb":
        return "⚡";
      case "lambda":
        return "λ";
      case "cloudfront":
        return "🌐";
      default:
        return "⚙️";
    }
  };

  const isWorkflowLive = (workflow: SavedWorkflow) => {
    const hasEC2 = workflow.services.some((service) => service.id === "ec2");
    return hasEC2 && workflow.hasCreated && workflow.hasDeployedCode;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
                <Workflow size={20} className="text-white" />
              </div>
              My Workflows
            </h1>
            <p className="text-muted-foreground">
              Manage and monitor your AWS infrastructure workflows
            </p>
          </div>
          <Button
            onClick={onCreateNew}
            className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
          >
            <Plus size={20} />
            New Workflow
          </Button>
        </div>

        {/* Workflows Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Create New Workflow Panel */}
          <Card
            className="border-2 border-dashed border-orange-200 hover:border-orange-300 hover:bg-orange-50/50 transition-all cursor-pointer group"
            onClick={onCreateNew}
          >
            <CardContent className="flex flex-col items-center justify-center p-8 text-center h-full min-h-[200px]">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Plus size={24} className="text-white" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2 group-hover:text-orange-700 transition-colors">
                Create New Workflow
              </h3>
              <p className="text-sm text-gray-600 group-hover:text-orange-600 transition-colors">
                Start building your AWS infrastructure with drag-and-drop
                services
              </p>
            </CardContent>
          </Card>

          {displayWorkflows.map((workflow) => (
            <Card
              key={workflow.id}
              className="hover:shadow-md transition-shadow cursor-pointer group hover:border-orange-200"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="group-hover:text-orange-600 transition-colors">
                        {workflow.name}
                      </CardTitle>
                      {/* Live Status Indicator */}
                      <div
                        className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                          isWorkflowLive(workflow)
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        <Circle
                          size={6}
                          className={`${
                            isWorkflowLive(workflow)
                              ? "fill-green-500 text-green-500 animate-pulse"
                              : "fill-gray-400 text-gray-400"
                          }`}
                        />
                        {isWorkflowLive(workflow) ? "Live" : "Not Live"}
                      </div>
                    </div>
                    {workflow.description && (
                      <CardDescription className="text-xs text-muted-foreground line-clamp-2">
                        {workflow.description}
                      </CardDescription>
                    )}
                  </div>
                  <Badge className={getStatusColor(workflow.status)}>
                    {workflow.status}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  {/* Services */}
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Services ({workflow.services.length})
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {workflow.services.slice(0, 4).map((service, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs hover:border-orange-300 hover:bg-orange-50 transition-colors"
                        >
                          {getServiceIcon(service.id)}{" "}
                          {service.id.toUpperCase()}
                        </Badge>
                      ))}
                      {workflow.services.length > 4 && (
                        <Badge
                          variant="outline"
                          className="text-xs text-muted-foreground"
                        >
                          +{workflow.services.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Last Modified */}
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>Modified:</span>
                    <span>
                      {new Date(workflow.lastModified).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        onOpenWorkflow(workflow.id);
                      }}
                    >
                      <FileText size={14} className="mr-1" />
                      Open
                    </Button>
                    {isWorkflowLive(workflow) && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-green-200 text-green-700 hover:bg-green-50"
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          // Handle go to live application
                          console.log("Go to live application:", workflow.id);
                        }}
                      >
                        <Play size={14} className="mr-1" />
                        Live
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
