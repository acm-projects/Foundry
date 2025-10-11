import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Users, Plus, Settings, Crown, User } from "lucide-react";

interface TeamsPageProps {
  onBackToHome: () => void;
}

export function TeamsPage({ onBackToHome }: TeamsPageProps) {
  // Mock teams data
  const teams = [
    {
      id: 1,
      name: "Development Team",
      description: "Main development team for AWS infrastructure",
      members: 8,
      role: "admin",
      workflows: 12,
    },
    {
      id: 2,
      name: "DevOps Engineers",
      description: "Infrastructure and deployment specialists",
      members: 5,
      role: "member",
      workflows: 18,
    },
    {
      id: 3,
      name: "QA Team",
      description: "Quality assurance and testing workflows",
      members: 4,
      role: "member",
      workflows: 6,
    },
  ];

  const invitations = [
    {
      id: 1,
      teamName: "Frontend Team",
      invitedBy: "John Doe",
      role: "member",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="flex items-center gap-3 mb-2">
              <Users size={32} className="text-primary" />
              Teams
            </h1>
            <p className="text-muted-foreground">
              Collaborate with your team on AWS workflows
            </p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus size={20} />
            Create Team
          </Button>
        </div>

        {/* Pending Invitations */}
        {invitations.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-4">Pending Invitations</h2>
            <div className="space-y-3">
              {invitations.map((invitation) => (
                <Card
                  key={invitation.id}
                  className="border-orange-200 bg-orange-50"
                >
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{invitation.teamName}</p>
                        <p className="text-sm text-muted-foreground">
                          Invited by {invitation.invitedBy} as {invitation.role}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Decline
                        </Button>
                        <Button size="sm">Accept</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Teams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <Card
              key={team.id}
              className="hover:shadow-md transition-shadow cursor-pointer"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {team.name}
                      {team.role === "admin" && (
                        <Crown size={16} className="text-yellow-600" />
                      )}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {team.description}
                    </CardDescription>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Settings size={16} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <User size={14} />
                      <span>{team.members} members</span>
                    </div>
                    <Badge
                      variant={team.role === "admin" ? "default" : "secondary"}
                    >
                      {team.role}
                    </Badge>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    {team.workflows} workflows
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      View Workflows
                    </Button>
                    <Button size="sm" className="flex-1">
                      Open Team
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Create New Team Card */}
          <Card className="border-dashed border-2 hover:border-primary transition-colors cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center h-full py-12">
              <Plus size={32} className="text-muted-foreground mb-3" />
              <h3 className="font-medium mb-1">Create New Team</h3>
              <p className="text-sm text-muted-foreground text-center">
                Start collaborating with your colleagues
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
