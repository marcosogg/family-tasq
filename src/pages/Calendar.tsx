import { Layout } from "@/components/Layout";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { format } from "date-fns";
import { Clock, Calendar as CalendarIcon } from "lucide-react";
import { useTasks } from "@/hooks/useTasks";

export default function CalendarView() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { tasks, isLoading } = useTasks();

  const tasksForSelectedDate = tasks?.filter((task) => {
    if (!date) return false;
    const taskDate = new Date(task.due_date);
    return (
      taskDate.getFullYear() === date.getFullYear() &&
      taskDate.getMonth() === date.getMonth() &&
      taskDate.getDate() === date.getDate()
    );
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Calendar View</h1>
          <p className="text-gray-600 mt-2">View and manage tasks by date</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-primary" />
                Select Date
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Tasks for {date ? format(date, "MMMM d, yyyy") : "No date selected"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tasksForSelectedDate && tasksForSelectedDate.length > 0 ? (
                  tasksForSelectedDate.map((task) => (
                    <div
                      key={task.id}
                      className="p-4 rounded-lg border border-gray-200 hover:border-primary/50 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {task.title}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {task.description}
                          </p>
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
                        Due: {format(new Date(task.due_date), "PPp")}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-8">
                    No tasks scheduled for this date
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}