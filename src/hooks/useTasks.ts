import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export const useTasks = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks'
        },
        () => {
          // Invalidate and refetch tasks when there's a change
          queryClient.invalidateQueries({ queryKey: ['tasks'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const { data: tasks, isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

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

  return { createTask, tasks, isLoading };
};