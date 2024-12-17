import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Calendar } from "lucide-react";
import { useTasks } from "@/hooks/useTasks";
import { format } from "date-fns";

export default function Completed() {
  const { tasks, isLoading } = useTasks();
  
  const completedTasks = tasks?.filter(task => task.completed) || [];

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto">
          <div>Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Completed Tasks</h1>
          <div className="bg-green-100 px-4 py-2 rounded-full text-green-700 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>{completedTasks.length} tasks completed</span>
          </div>
        </div>

        <div className="grid gap-4">
          {completedTasks.map((task) => (
            <Card key={task.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{task.title}</h3>
                    {task.description && (
                      <p className="mt-1 text-sm text-gray-500">{task.description}</p>
                    )}
                    <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Completed: {format(new Date(task.updated_at), "PPp")}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                    {task.category}
                  </span>
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
              </div>
            </Card>
          ))}
          {completedTasks.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No completed tasks yet
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}