"use client";

import { AddTaskForm } from '@/components/add-task-form';
import { TaskList } from '@/components/task-list';
import { useTasks } from '@/hooks/useTasks';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListTodo, CheckCircle } from 'lucide-react'; // Removed Code icon

export default function Home() {
  const {
    activeTasks,
    completedTasks,
    addTask,
    toggleTaskCompletion,
    deleteTask,
    updateTask,
    isLoading,
  } = useTasks();

  return (
    <div className="container mx-auto max-w-2xl p-4 md:p-8"> {/* Removed min-h-screen */}
      {/* Header section removed, now handled by layout/header.tsx */}

      <AddTaskForm onAddTask={addTask} />

      <Tabs defaultValue="active" className="mt-6">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="active">
            <ListTodo className="mr-2 h-4 w-4" /> 进行中 ({activeTasks.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            <CheckCircle className="mr-2 h-4 w-4" /> 已完成 ({completedTasks.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="active">
           <TaskList
            tasks={activeTasks}
            title="进行中的任务"
            emptyMessage="没有进行中的任务。在上方添加一个！"
            isLoading={isLoading}
            onToggleComplete={toggleTaskCompletion}
            onDelete={deleteTask}
            onUpdate={updateTask}
          />
        </TabsContent>
        <TabsContent value="completed">
           <TaskList
            tasks={completedTasks}
            title="已完成的任务"
            emptyMessage="还没有已完成的任务。"
            isLoading={isLoading}
            onToggleComplete={toggleTaskCompletion}
            onDelete={deleteTask}
            onUpdate={updateTask}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
