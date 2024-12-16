import { Layout } from "@/components/Layout";
import { TaskForm } from "@/components/TaskForm";

export default function NewTask() {
  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Create New Task</h1>
        <TaskForm />
      </div>
    </Layout>
  );
}