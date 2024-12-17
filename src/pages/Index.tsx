import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Calendar, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTasks } from "@/hooks/useTasks";
import { TaskDetail } from "@/components/TaskDetail";
import { Database } from "@/integrations/supabase/types";

type Task = Database["public"]["Tables"]["tasks"]["Row"];

export default function Index() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("dueDate");
  const [filterPriority, setFilterPriority] = useState("all");
  const { tasks, isLoading } = useTasks();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const filteredAndSortedTasks = (tasks || [])
    .filter((task) => {
      if (filterPriority === "all") return true;
      return task.priority === filterPriority;
    })
    .filter((task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "dueDate") {
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      }
      if (sortBy === "priority") {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority as keyof typeof priorityOrder] - priorityOrder[a.priority as keyof typeof priorityOrder];
      }
      return 0;
    });

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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome to Tazq</h1>
            <p className="text-gray-600 mt-2">Manage your family tasks efficiently</p>
          </div>
          <Button 
            onClick={() => navigate("/tasks/new")}
            className="bg-primary hover:bg-primary/90"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            New Task
          </Button>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-xs"
          />
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dueDate">Due Date</SelectItem>
              <SelectItem value="priority">Priority</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="high">High Priority</SelectItem>
              <SelectItem value="medium">Medium Priority</SelectItem>
              <SelectItem value="low">Low Priority</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-primary" />
              Today's Tasks
            </h2>
            <div className="space-y-4">
              {filteredAndSortedTasks.map((task) => (
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
                  <div className="flex items-center mt-3 text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    Due: {new Date(task.due_date).toLocaleDateString()}
                  </div>
                </div>
              ))}
              {filteredAndSortedTasks.length === 0 && (
                <p className="text-gray-500 text-center py-4">No tasks found</p>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-primary/10 rounded-lg">
                <div className="text-2xl font-bold text-primary">{tasks?.length || 0}</div>
                <div className="text-sm text-gray-600">Active Tasks</div>
              </div>
              <div className="p-4 bg-secondary/10 rounded-lg">
                <div className="text-2xl font-bold text-secondary">
                  {tasks?.filter(t => t.completed)?.length || 0}
                </div>
                <div className="text-sm text-gray-600">Completed Tasks</div>
              </div>
              <div className="p-4 bg-accent/10 rounded-lg">
                <div className="text-2xl font-bold text-accent">
                  {tasks?.filter(t => new Date(t.due_date) < new Date())?.length || 0}
                </div>
                <div className="text-sm text-gray-600">Overdue Tasks</div>
              </div>
              <div className="p-4 bg-gray-100 rounded-lg">
                <div className="text-2xl font-bold text-gray-700">
                  {tasks?.filter(t => 
                    new Date(t.due_date) > new Date() && 
                    new Date(t.due_date) < new Date(Date.now() + 24 * 60 * 60 * 1000)
                  )?.length || 0}
                </div>
                <div className="text-sm text-gray-600">Due Today</div>
              </div>
            </div>
          </Card>
        </div>

        <TaskDetail
          task={selectedTask}
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      </div>
    </Layout>
  );
}