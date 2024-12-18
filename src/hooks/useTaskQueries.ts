import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const useTaskQueries = (familyGroupId: string | null) => {
  const { data: tasks, isLoading } = useQuery({
    queryKey: ['tasks', familyGroupId],
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
      if (familyGroupId) {
        query = query.eq('family_group_id', familyGroupId);
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

  return { tasks, isLoading };
};