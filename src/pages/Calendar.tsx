import { Layout } from "@/components/Layout";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { format } from "date-fns";
import { Clock, Calendar as CalendarIcon } from "lucide-react";

// Sample data - in a real app, this would come from your backend
const tasks = [
  {
    id: 1,
    title: "Weekly Grocery Shopping",
    priority: "high",
    dueDate: "2024-03-20",
    assignedTo: ["Mom", "Dad"],
    category: "Shopping",
  },
  {
    id: 2,
    title: "Clean Garage",
    priority: "medium",
    dueDate: "2024-03-22",
    assignedTo: ["Dad", "Kids"],
    category: "Home",
  },
];

export default function CalendarView() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const tasksForSelectedDate = tasks.filter(
    (task) => task.dueDate === format(date || new Date(), "yyyy-MM-dd")
  );

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
                Tasks for {format(date || new Date(), "MMMM d, yyyy")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tasksForSelectedDate.length > 0 ? (
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
                            Assigned to: {task.assignedTo.join(", ")}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            task.priority === "high"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {task.priority}
                        </span>
                      </div>
                      <div className="flex items-center mt-3 text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        Due: {task.dueDate}
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