import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Avatar } from "../ui/avatar";
import { Separator } from "../ui/separator";

import {
  ArrowLeft,
  Activity,
  Clock,
  Plus,
  Edit,
  Trash2,
  Save,
  Settings,
  Eye,
  GitBranch,
  Share2,
} from "lucide-react";

interface ActivityLog {
  id: string;
  timestamp: string;
  user: {
    name: string;
    email: string;
    avatar: string;
  };
  action:
    | "created"
    | "edited"
    | "deleted"
    | "configured"
    | "saved"
    | "shared"
    | "viewed"
    | "deployed";
  target: string;
  details: string;
  workflowName?: string;
  metadata?: {
    serviceName?: string;
    configChanges?: string[];
    previousValue?: string;
    newValue?: string;
  };
}

interface LoggingPageProps {
  onBackToCanvas: () => void;
}

export function LoggingPage({ onBackToCanvas }: LoggingPageProps) {
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);

  // Initialize with empty activity logs - activities will be populated when users perform actions
  useEffect(() => {
    // No mock data - start with empty state
    setActivityLogs([]);
  }, []);

  const getActionIcon = (action: string) => {
    switch (action) {
      case "created":
        return <Plus size={16} className="text-green-600" />;
      case "edited":
        return <Edit size={16} className="text-blue-600" />;
      case "deleted":
        return <Trash2 size={16} className="text-red-600" />;
      case "configured":
        return <Settings size={16} className="text-purple-600" />;
      case "saved":
        return <Save size={16} className="text-orange-600" />;
      case "shared":
        return <Share2 size={16} className="text-teal-600" />;
      case "viewed":
        return <Eye size={16} className="text-gray-600" />;
      case "deployed":
        return <GitBranch size={16} className="text-indigo-600" />;
      default:
        return <Activity size={16} className="text-gray-600" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case "created":
        return "bg-green-100 text-green-700 border-green-200";
      case "edited":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "deleted":
        return "bg-red-100 text-red-700 border-red-200";
      case "configured":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "saved":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "shared":
        return "bg-teal-100 text-teal-700 border-teal-200";
      case "viewed":
        return "bg-gray-100 text-gray-700 border-gray-200";
      case "deployed":
        return "bg-indigo-100 text-indigo-700 border-indigo-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  // Show all logs without filtering
  const filteredLogs = activityLogs;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={onBackToCanvas}
              className="flex items-center gap-2 hover:border-orange-300 hover:bg-orange-50"
            >
              <ArrowLeft size={18} />
              Back to Canvas
            </Button>
            <div>
              <h1 className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
                  <Activity size={20} className="text-white" />
                </div>
                Activity Logging
              </h1>
              <p className="text-muted-foreground">
                Track all changes and activities across your workflows
              </p>
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="space-y-4">
          {filteredLogs.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Activity
                  size={48}
                  className="mx-auto text-muted-foreground mb-4"
                />
                <h3 className="font-medium mb-2">No activity has happened</h3>
                <p className="text-muted-foreground">
                  Activities will appear here as team members create, edit, and
                  manage workflows
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredLogs.map((log, index) => (
              <Card key={log.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    {/* User Avatar */}
                    <Avatar className="h-10 w-10 bg-muted">
                      <div className="w-full h-full flex items-center justify-center text-sm font-medium">
                        {log.user.avatar}
                      </div>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">{log.user.name}</span>
                        {getActionIcon(log.action)}
                        <Badge className={getActionColor(log.action)}>
                          {log.action}
                        </Badge>
                        <span className="text-muted-foreground">•</span>
                        <span className="font-medium">{log.target}</span>
                      </div>

                      <p className="text-muted-foreground mb-2">
                        {log.details}
                      </p>

                      {log.workflowName && (
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm text-muted-foreground">
                            in
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {log.workflowName}
                          </Badge>
                        </div>
                      )}

                      {/* Metadata */}
                      {log.metadata && (
                        <div className="mt-3 p-3 bg-muted rounded-lg">
                          {log.metadata.configChanges && (
                            <div>
                              <p className="text-sm font-medium mb-1">
                                Changes:
                              </p>
                              <ul className="text-sm text-muted-foreground space-y-1">
                                {log.metadata.configChanges.map((change, i) => (
                                  <li
                                    key={i}
                                    className="flex items-center gap-2"
                                  >
                                    <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                                    {change}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {log.metadata.previousValue &&
                            log.metadata.newValue && (
                              <div className="text-sm">
                                <span className="text-muted-foreground">
                                  Changed from{" "}
                                </span>
                                <code className="bg-red-100 text-red-700 px-1 rounded text-xs">
                                  {log.metadata.previousValue}
                                </code>
                                <span className="text-muted-foreground">
                                  {" "}
                                  to{" "}
                                </span>
                                <code className="bg-green-100 text-green-700 px-1 rounded text-xs">
                                  {log.metadata.newValue}
                                </code>
                              </div>
                            )}

                          {log.metadata.serviceName && (
                            <div className="text-sm text-muted-foreground">
                              Service:{" "}
                              <code className="bg-muted px-1 rounded text-xs">
                                {log.metadata.serviceName}
                              </code>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Timestamp */}
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock size={14} />
                      {formatTimestamp(log.timestamp)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
