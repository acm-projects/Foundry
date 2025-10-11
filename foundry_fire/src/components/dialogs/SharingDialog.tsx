import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Avatar, Avatar as AvatarComponent } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { UserPlus, Mail, Users, Crown, User, X } from "lucide-react";

interface ProjectMember {
  id: string;
  name: string;
  email: string;
  role: "owner" | "admin" | "editor" | "viewer";
  avatar?: string;
  joinedAt: string;
}

interface SharingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  workflowName: string;
  workflowId: string;
}

export function SharingDialog({
  isOpen,
  onClose,
  workflowName,
  workflowId,
}: SharingDialogProps) {
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"admin" | "editor" | "viewer">(
    "viewer"
  );
  const [isInviting, setIsInviting] = useState(false);

  // Project members state - starts empty by default
  const [projectMembers, setProjectMembers] = useState<ProjectMember[]>([]);

  const handleInviteUser = async () => {
    if (!inviteEmail.trim()) return;

    setIsInviting(true);

    // Simulate API call
    setTimeout(() => {
      const newMember: ProjectMember = {
        id: Date.now().toString(),
        name: inviteEmail.split("@")[0],
        email: inviteEmail,
        role: inviteRole,
        avatar: inviteEmail.substring(0, 2).toUpperCase(),
        joinedAt: new Date().toISOString().split("T")[0],
      };

      setProjectMembers((prev) => [...prev, newMember]);
      setInviteEmail("");
      setIsInviting(false);

      // Show success message
      alert(`Invitation sent to ${inviteEmail}!`);
    }, 1000);
  };

  const handleRemoveMember = (memberId: string) => {
    const member = projectMembers.find((m) => m.id === memberId);
    if (member?.role === "owner") {
      alert("Cannot remove the project owner.");
      return;
    }

    if (confirm(`Remove ${member?.name} from this project?`)) {
      setProjectMembers((prev) => prev.filter((m) => m.id !== memberId));
    }
  };

  const handleRoleChange = (
    memberId: string,
    newRole: "admin" | "editor" | "viewer"
  ) => {
    setProjectMembers((prev) =>
      prev.map((member) =>
        member.id === memberId ? { ...member, role: newRole } : member
      )
    );
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "owner":
        return <Crown size={14} className="text-yellow-500" />;
      case "admin":
        return <User size={14} className="text-purple-500" />;
      case "editor":
        return <User size={14} className="text-blue-500" />;
      case "viewer":
        return <User size={14} className="text-gray-500" />;
      default:
        return null;
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "owner":
        return "default";
      case "admin":
        return "secondary";
      case "editor":
        return "outline";
      case "viewer":
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users size={20} />
            Share "{workflowName}"
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Members Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Users size={16} />
              <h3 className="font-medium">
                Project Members ({projectMembers.length})
              </h3>
            </div>

            <div className="space-y-3 max-h-48 overflow-y-auto">
              {projectMembers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Users size={32} className="mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No members yet</p>
                  <p className="text-xs mt-1">
                    Invite team members to collaborate on this workflow
                  </p>
                </div>
              ) : (
                projectMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 p-3 rounded-lg border bg-card"
                  >
                    <AvatarComponent className="h-8 w-8 bg-muted">
                      <div className="w-full h-full flex items-center justify-center text-xs font-medium">
                        {member.avatar}
                      </div>
                    </AvatarComponent>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium truncate">{member.name}</p>
                        {getRoleIcon(member.role)}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {member.email}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {member.role !== "owner" && (
                        <select
                          value={member.role}
                          onChange={(e) =>
                            handleRoleChange(
                              member.id,
                              e.target.value as "admin" | "editor" | "viewer"
                            )
                          }
                          className="text-xs border rounded px-2 py-1 bg-background"
                        >
                          <option value="admin">Admin</option>
                          <option value="editor">Editor</option>
                          <option value="viewer">Viewer</option>
                        </select>
                      )}

                      {member.role === "owner" && (
                        <Badge
                          variant={getRoleBadgeVariant(member.role)}
                          className="text-xs"
                        >
                          Owner
                        </Badge>
                      )}

                      {member.role !== "owner" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveMember(member.id)}
                          className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                        >
                          <X size={12} />
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <Separator />

          {/* Invite New User Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <UserPlus size={16} />
              <h3 className="font-medium">Invite New User</h3>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="inviteEmail">Email Address</Label>
                <Input
                  id="inviteEmail"
                  type="email"
                  placeholder="Enter email address..."
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="inviteRole">Role</Label>
                <select
                  id="inviteRole"
                  value={inviteRole}
                  onChange={(e) =>
                    setInviteRole(
                      e.target.value as "admin" | "editor" | "viewer"
                    )
                  }
                  className="w-full mt-1 border rounded-md px-3 py-2 bg-background"
                >
                  <option value="viewer">Viewer - Can view the workflow</option>
                  <option value="editor">Editor - Can edit the workflow</option>
                  <option value="admin">
                    Admin - Can manage users and edit workflow
                  </option>
                </select>
              </div>

              <Button
                onClick={handleInviteUser}
                disabled={!inviteEmail.trim() || isInviting}
                className="w-full"
              >
                {isInviting ? (
                  "Sending Invitation..."
                ) : (
                  <>
                    <Mail size={16} className="mr-2" />
                    Send Invitation
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Copy Link Section */}
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">Share Link</p>
            <div className="flex gap-2">
              <Input
                value={`https://app.example.com/workflow/${workflowId}`}
                readOnly
                className="text-xs"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `https://app.example.com/workflow/${workflowId}`
                  );
                  alert("Link copied to clipboard!");
                }}
              >
                Copy
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
