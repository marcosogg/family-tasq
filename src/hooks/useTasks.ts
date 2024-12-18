import { useTaskQueries } from "./useTaskQueries";
import { useTaskMutations } from "./useTaskMutations";
import { useFamilyGroups } from "./useFamilyGroups";

export const useTasks = () => {
  const { currentFamilyGroup } = useFamilyGroups();
  const { tasks, isLoading } = useTaskQueries(currentFamilyGroup?.id || null);
  const { createTask, toggleTaskCompletion } = useTaskMutations(currentFamilyGroup?.id || null);

  return {
    tasks,
    isLoading,
    createTask,
    toggleTaskCompletion,
    currentFamilyGroup,
  };
};