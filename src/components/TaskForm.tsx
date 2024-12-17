import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { TaskFormFields } from "./TaskFormFields";
import { useTasks } from "@/hooks/useTasks";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

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
  const { createTask, currentFamilyGroup } = useTasks();
  const { toast } = useToast();
  
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

  const onSubmit = async (values: TaskFormData) => {
    // Ensure all required fields are present
    if (!values.title || !values.priority || !values.category || !values.dueDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      await createTask({
        title: values.title,
        description: values.description,
        priority: values.priority,
        category: values.category,
        dueDate: values.dueDate,
      });
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {currentFamilyGroup ? (
          <Alert>
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              This task will be associated with the family group: <strong>{currentFamilyGroup.name}</strong>
            </AlertDescription>
          </Alert>
        ) : (
          <Alert>
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              This task will be created as a personal task since no family group is selected.
            </AlertDescription>
          </Alert>
        )}
        <TaskFormFields form={form} />
        <Button type="submit" className="w-full">
          Create Task
        </Button>
      </form>
    </Form>
  );
}
