import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { TaskFormFields } from "./TaskFormFields";
import { useTasks } from "@/hooks/useTasks";

const taskSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  description: z.string().max(500, "Description is too long").optional(),
  priority: z.enum(["low", "medium", "high"], {
    required_error: "Please select a priority level",
  }),
  category: z.enum(["home", "school", "shopping", "other"], {
    required_error: "Please select a category",
  }),
  dueDate: z.date({
    required_error: "Please select a due date",
  }),
});

export type TaskFormData = z.infer<typeof taskSchema>;

export function TaskForm() {
  const { createTask } = useTasks();
  
  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "low",
      category: "home",
      dueDate: new Date(),
    },
  });

  const onSubmit = async (data: TaskFormData) => {
    try {
      await createTask(data);
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <TaskFormFields form={form} />
        <Button type="submit" className="w-full">
          Create Task
        </Button>
      </form>
    </Form>
  );
}