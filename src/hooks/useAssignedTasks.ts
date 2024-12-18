import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const useAssignedTasks = () => {
  return useQuery({
    queryKey: ['assigned-tasks'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: assignments, error } = await supabase
        .from('task_assignments')
        .select(`
          *,
          task:tasks(
            *,
            family_groups(
              name
            )
          ),
          assigned_by_user:profiles!task_assignments_assigned_by_fkey(
            full_name,
            email
          )
        `)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching assigned tasks:', error);
        throw error;
      }

      return assignments;
    },
  });
};