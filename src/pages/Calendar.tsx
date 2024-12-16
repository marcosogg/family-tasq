import { Layout } from "@/components/Layout";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { format } from "date-fns";
import { Clock, CheckCircle2 } from "lucide-react";

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

  const selectedDateTasks = tasks.filter(
    (task) => task.dueDate === format(date || new Date(), "yyyy-MM-dd")
  );

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Calendar</h1>
        
        <div className="grid md:grid-cols-[400px,1fr] gap-8">
          <Card className="p-6">
            <CalendarComponent
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">
              Tasks for {date ? format(date, "MMMM d, yyyy") : "Selected Date"}
            </h2>
            
            <div className="space-y-4">
              {selectedDateTasks.length === 0 ? (
                <p className="text-gray-500">No tasks scheduled for this date.</p>
              ) : (
                selectedDateTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-4 rounded-lg border border-gray-200 hover:border-primary/50 transition-colors cursor-pointer"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{task.title}</h3>
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
              )}
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}