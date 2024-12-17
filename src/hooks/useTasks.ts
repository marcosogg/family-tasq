import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export const useTasks = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const createTask = async (data: {
    title: string;
    description?: string;
    priority: "low" | "medium" | "high";
    category: "home" | "school" | "shopping" | "other";
    dueDate: Date;
  }) => {
    const { error } = await supabase.from("tasks").insert({
      title: data.title,
      description: data.description,
      priority: data.priority,
      category: data.category,
      due_date: data.dueDate.toISOString(),
      user_id: (await supabase.auth.getUser()).data.user?.id,
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive",
      });
      throw error;
    }

    toast({
      title: "Success",
      description: "Task created successfully!",
    });

    navigate("/");
  };

  return { createTask };
};