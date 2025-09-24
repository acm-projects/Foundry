import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Save, FileText } from 'lucide-react';

interface WorkflowNamingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, description: string) => void;
  initialName?: string;
  initialDescription?: string;
}

export function WorkflowNamingDialog({ 
  isOpen, 
  onClose, 
  onSave, 
  initialName = '', 
  initialDescription = '' 
}: WorkflowNamingDialogProps) {
  const [workflowName, setWorkflowName] = useState(initialName);
  const [workflowDescription, setWorkflowDescription] = useState(initialDescription);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!workflowName.trim()) return;
    
    setIsSaving(true);
    
    // Simulate a brief delay for UX
    setTimeout(() => {
      onSave(workflowName.trim(), workflowDescription.trim());
      
      // Reset form only if not updating existing workflow
      if (!initialName) {
        setWorkflowName('');
        setWorkflowDescription('');
      }
      setIsSaving(false);
      onClose();
    }, 300);
  };

  const handleCancel = () => {
    // Reset to initial values if canceling
    setWorkflowName(initialName);
    setWorkflowDescription(initialDescription);
    onClose();
  };

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      setWorkflowName(initialName);
      setWorkflowDescription(initialDescription);
    }
  }, [isOpen, initialName, initialDescription]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
              <Save size={12} className="text-white" />
            </div>
            Save Workflow
          </DialogTitle>
          <DialogDescription>
            Give your workflow a name and description to save your progress.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="workflow-name">Workflow Name *</Label>
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
                    {initialName ? 'Updated' : 'Created'} {new Date().toLocaleDateString()}
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
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!workflowName.trim() || isSaving}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
          >
            {isSaving ? (
              'Saving...'
            ) : (
              <>
                <Save size={16} className="mr-2" />
                Save Workflow
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}