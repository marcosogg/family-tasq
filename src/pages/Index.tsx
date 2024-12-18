import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Calendar, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTasks } from "@/hooks/useTasks";
import { useFamilyGroups } from "@/hooks/useFamilyGroups";
import { FamilyGroupManager } from "@/components/FamilyGroupManager";
import { TaskList } from "@/components/TaskList";
import { TaskStats } from "@/components/TaskStats";
import { useAssignedTasks } from "@/hooks/useAssignedTasks";

export default function Index() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("dueDate");
  const [filterPriority, setFilterPriority] = useState("all");
  const { tasks, isLoading } = useTasks();
  const { data: assignedTasks, isLoading: isLoadingAssigned } = useAssignedTasks();
  const { familyGroups, currentFamilyGroup, switchFamilyGroup } = useFamilyGroups();

  const filteredAndSortedTasks = (tasks || [])
    .filter((task) => {
      if (filterPriority === "all") return true;
      return task.priority === filterPriority;
    })
    .filter((task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "dueDate") {
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      }
      if (sortBy === "priority") {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return (
          priorityOrder[b.priority as keyof typeof priorityOrder] -
          priorityOrder[a.priority as keyof typeof priorityOrder]
        );
      }
      return 0;
    });

  if (isLoading || isLoadingAssigned) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto">
          <div>Loading...</div>
        </div>
      </Layout>
    );
  }

  const assignedTasksList = assignedTasks?.map(assignment => assignment.task) || [];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome to Tazq</h1>
            <p className="text-gray-600 mt-2">Manage your family tasks efficiently</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <FamilyGroupManager />
            <Button
              onClick={() => navigate("/tasks/new")}
              className="bg-primary hover:bg-primary/90"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              New Task
            </Button>
          </div>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <Select
            value={currentFamilyGroup?.id || "personal"}
            onValueChange={(value) => {
              const group = familyGroups.find((g) => g.id === value);
              if (group) {
                switchFamilyGroup(group);
              }
            }}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Family Group">
                {currentFamilyGroup ? (
                  <div className="flex items-center">
                    <Users className="mr-2 h-4 w-4" />
                    {currentFamilyGroup.name}
                  </div>
                ) : (
                  "Personal Tasks"
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="personal">Personal Tasks</SelectItem>
              {familyGroups.map((group) => (
                <SelectItem key={group.id} value={group.id}>
                  <div className="flex items-center">
                    <Users className="mr-2 h-4 w-4" />
                    {group.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-xs"
          />
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dueDate">Due Date</SelectItem>
              <SelectItem value="priority">Priority</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="high">High Priority</SelectItem>
              <SelectItem value="medium">Medium Priority</SelectItem>
              <SelectItem value="low">Low Priority</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <TaskList
              tasks={filteredAndSortedTasks}
              title={
                <div className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-primary" />
                  {currentFamilyGroup
                    ? `${currentFamilyGroup.name}'s Tasks`
                    : "Personal Tasks"}
                </div>
              }
            />
            {assignedTasksList.length > 0 && (
              <TaskList
                tasks={assignedTasksList}
                title={
                  <div className="flex items-center">
                    <Users className="mr-2 h-5 w-5 text-primary" />
                    Tasks Assigned to Me
                  </div>
                }
                emptyMessage="No tasks assigned to you"
              />
            )}
          </div>
          <TaskStats tasks={filteredAndSortedTasks} />
        </div>
      </div>
    </Layout>
  );
}