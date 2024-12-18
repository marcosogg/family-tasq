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

      if (familyGroupId) {
        query = query.eq('family_group_id', familyGroupId);
      } else {
        query = query
          .is('family_group_id', null)
          .eq('user_id', user.id);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching tasks:', error);
        throw error;
      }

      return data;
    },
  });

  return { tasks, isLoading };
};