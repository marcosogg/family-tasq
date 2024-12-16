import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Calendar, User2 } from "lucide-react";

const completedTasks = [
  {
    id: 1,
    title: "Buy School Supplies",
    completedBy: "Mom",
    completedDate: "2024-03-15",
    category: "Shopping",
  },
  {
    id: 2,
    title: "Fix Kitchen Sink",
    completedBy: "Dad",
    completedDate: "2024-03-14",
    category: "Home",
  },
];

export default function Completed() {
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
                    <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <User2 className="w-4 h-4" />
                        <span>Completed by: {task.completedBy}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Date: {task.completedDate}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                  {task.category}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}