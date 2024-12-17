import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useFamilyGroups } from "./useFamilyGroups";

export const useTasks = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { currentFamilyGroup } = useFamilyGroups();

  // Set up real-time subscription
  useEffect(() => {
    // Only set up subscription if we have a family group
    if (!currentFamilyGroup?.id) return;

    const channel = supabase
      .channel(`tasks-${currentFamilyGroup.id}`) // Unique channel name per family group
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          filter: `family_group_id=eq.${currentFamilyGroup.id}` // Filter for specific family group
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['tasks', currentFamilyGroup.id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, currentFamilyGroup?.id]);

  const { data: tasks, isLoading } = useQuery({
    queryKey: ['tasks', currentFamilyGroup?.id],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      let query = supabase
        .from('tasks')
        .select(`
          *,
          family_groups (
            name
          )
        `)
        .order('created_at', { ascending: false });

      // Filter by family group if one is selected
      if (currentFamilyGroup) {
        query = query.eq('family_group_id', currentFamilyGroup.id);
      } else {
        // If no family group is selected, only show tasks without a family group
        // that belong to the current user
        query = query.filter('family_group_id', 'is', null)
          .filter('user_id', 'eq', user.id);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching tasks:', error);
        throw error;
      }
      return data;
    },
    enabled: true,
  });

  const createTask = async (data: {
    title: string;
    description?: string;
    priority: "low" | "medium" | "high";
    category: "home" | "school" | "shopping" | "other";
    dueDate: Date;
  }) => {
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
        family_group_id: currentFamilyGroup?.id || null,
        completed: false, // Set default value
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

  return { 
    createTask, 
    toggleTaskCompletion, 
    tasks, 
    isLoading,
    currentFamilyGroup
  };
};
