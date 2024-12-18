import { Card } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { Database } from "@/integrations/supabase/types";
import { TaskDetail } from "@/components/TaskDetail";
import { useState } from "react";

type Task = Database["public"]["Tables"]["tasks"]["Row"];

interface TaskListProps {
  tasks: Task[];
  title: string;
  emptyMessage?: string;
}

export function TaskList({ tasks, title, emptyMessage = "No tasks found" }: TaskListProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="space-y-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="p-4 rounded-lg border border-gray-200 hover:border-primary/50 transition-colors cursor-pointer"
            onClick={() => setSelectedTask(task)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-900">{task.title}</h3>
                {task.description && (
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {task.description}
                  </p>
                )}
              </div>
              <span
                className={`px-2 py-1 rounded text-xs ${
                  task.priority === "high"
                    ? "bg-red-100 text-red-700"
                    : task.priority === "medium"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {task.priority}
              </span>
            </div>
            <div className="flex items-center mt-3 text-sm text-gray-500">
              <Clock className="h-4 w-4 mr-1" />
              Due: {new Date(task.due_date).toLocaleDateString()}
            </div>
          </div>
        ))}
        {tasks.length === 0 && (
          <p className="text-gray-500 text-center py-4">{emptyMessage}</p>
        )}
      </div>
      <TaskDetail
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
      />
    </Card>
  );
}