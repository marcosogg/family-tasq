import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";
import { Calendar, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTasks } from "@/hooks/useTasks";
import { Database } from "@/integrations/supabase/types";

type Task = Database["public"]["Tables"]["tasks"]["Row"];

interface TaskDetailProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TaskDetail({ task, isOpen, onClose }: TaskDetailProps) {
  const { toggleTaskCompletion } = useTasks();

  if (!task) return null;

  const handleToggleComplete = async () => {
    await toggleTaskCompletion(task.id, !task.completed);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{task.title}</DialogTitle>
        </DialogHeader>
        <div className="mt-6 space-y-4">
          {task.description && (
            <div>
              <h4 className="text-sm font-medium mb-1">Description</h4>
              <p className="text-sm text-gray-500">{task.description}</p>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              <span>Due: {format(new Date(task.due_date), "PPp")}</span>
            </div>
            <span className={`px-2 py-1 rounded text-xs ${
              task.priority === "high" 
                ? "bg-red-100 text-red-700"
                : task.priority === "medium"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-green-100 text-green-700"
            }`}>
              {task.priority}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
              {task.category}
            </span>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Created: {format(new Date(task.created_at), "PP")}</span>
            </div>
          </div>

          <div className="pt-4">
            <Button 
              onClick={handleToggleComplete}
              variant="outline"
              className="w-full"
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Mark as {task.completed ? "incomplete" : "complete"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}