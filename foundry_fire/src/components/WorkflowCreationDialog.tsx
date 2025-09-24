import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Plus, FileText } from 'lucide-react';

interface WorkflowCreationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, description: string) => void;
}

export function WorkflowCreationDialog({ isOpen, onClose, onCreate }: WorkflowCreationDialogProps) {
  const [workflowName, setWorkflowName] = useState('');
  const [workflowDescription, setWorkflowDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    if (!workflowName.trim()) return;
    
    setIsCreating(true);
    
    // Simulate a brief delay for UX
    setTimeout(() => {
      onCreate(workflowName.trim(), workflowDescription.trim());
      
      // Reset form
      setWorkflowName('');
      setWorkflowDescription('');
      setIsCreating(false);
      onClose();
    }, 300);
  };

  const handleCancel = () => {
    setWorkflowName('');
    setWorkflowDescription('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
              <Plus size={12} className="text-white" />
            </div>
            Create New Workflow
          </DialogTitle>
          <DialogDescription>
            Set up your new AWS workflow with a title and description to help organize your projects.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="workflow-name">Workflow Title *</Label>
            <Input
              id="workflow-name"
              placeholder="e.g., Web Application Stack"
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              className="w-full"
              autoFocus
            />
            <p className="text-xs text-muted-foreground">
              Give your workflow a descriptive name
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="workflow-description">Description (Optional)</Label>
            <Textarea
              id="workflow-description"
              placeholder="Describe what this workflow does, its purpose, or any important notes..."
              value={workflowDescription}
              onChange={(e) => setWorkflowDescription(e.target.value)}
              className="w-full min-h-[80px] resize-none"
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              Add details about your workflow's purpose and architecture
            </p>
          </div>

          {/* Preview Section */}
          {workflowName && (
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-start gap-2">
                <FileText size={16} className="text-orange-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-orange-900 truncate">{workflowName}</h4>
                  {workflowDescription && (
                    <p className="text-sm text-orange-700 mt-1 line-clamp-2">
                      {workflowDescription}
                    </p>
                  )}
                  <p className="text-xs text-orange-600 mt-1">
                    Created {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isCreating}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!workflowName.trim() || isCreating}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
          >
            {isCreating ? (
              'Creating...'
            ) : (
              <>
                <Plus size={16} className="mr-2" />
                Create Workflow
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}