import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

export type TaskData = {
  title: string;
  description?: string;
  priority: "low" | "medium" | "high";
  category: "home" | "school" | "shopping" | "other";
  dueDate: Date;
};

export const useTaskMutations = (familyGroupId: string | null) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const createTask = async (data: TaskData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase.from("tasks").insert({
        title: data.title,
        description: data.description,
        priority: data.priority,
        category: data.category,
        due_date: data.dueDate.toISOString(),
        user_id: user.id,
        family_group_id: familyGroupId,
        completed: false,
      });

      if (error) {
        console.error('Error creating task:', error);
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
    } catch (err) {
      console.error('Error in createTask:', err);
      throw err;
    }
  };

  const toggleTaskCompletion = async (taskId: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from("tasks")
        .update({ 
          completed,
          updated_at: new Date().toISOString()
        })
        .eq("id", taskId);

      if (error) {
        console.error('Error toggling task completion:', error);
        toast({
          title: "Error",
          description: "Failed to update task. Please try again.",
          variant: "destructive",
        });
        throw error;
      }

      toast({
        title: "Success",
        description: completed ? "Task marked as completed!" : "Task marked as incomplete!",
      });
    } catch (err) {
      console.error('Error in toggleTaskCompletion:', err);
      throw err;
    }
  };

  return { createTask, toggleTaskCompletion };
};