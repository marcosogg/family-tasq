import { Card } from "@/components/ui/card";
import { Database } from "@/integrations/supabase/types";

type Task = Database["public"]["Tables"]["tasks"]["Row"];

interface TaskStatsProps {
  tasks: Task[];
}

export function TaskStats({ tasks }: TaskStatsProps) {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-primary/10 rounded-lg">
          <div className="text-2xl font-bold text-primary">{tasks?.length || 0}</div>
          <div className="text-sm text-gray-600">Active Tasks</div>
        </div>
        <div className="p-4 bg-secondary/10 rounded-lg">
          <div className="text-2xl font-bold text-secondary">
            {tasks?.filter((t) => t.completed)?.length || 0}
          </div>
          <div className="text-sm text-gray-600">Completed Tasks</div>
        </div>
        <div className="p-4 bg-accent/10 rounded-lg">
          <div className="text-2xl font-bold text-accent">
            {tasks?.filter((t) => new Date(t.due_date) < new Date())?.length || 0}
          </div>
          <div className="text-sm text-gray-600">Overdue Tasks</div>
        </div>
        <div className="p-4 bg-gray-100 rounded-lg">
          <div className="text-2xl font-bold text-gray-700">
            {
              tasks?.filter(
                (t) =>
                  new Date(t.due_date) > new Date() &&
                  new Date(t.due_date) < new Date(Date.now() + 24 * 60 * 60 * 1000)
              )?.length || 0
            }
          </div>
          <div className="text-sm text-gray-600">Due Today</div>
        </div>
      </div>
    </Card>
  );
}