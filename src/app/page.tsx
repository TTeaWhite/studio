"use client";

import { AddTaskForm } from '@/components/add-task-form';
import { TaskList } from '@/components/task-list';
import { useTasks } from '@/hooks/useTasks';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListTodo, CheckCircle, Code } from 'lucide-react'; // Changed Palette to Code

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
    <div className="container mx-auto max-w-2xl p-4 md:p-8 min-h-screen">
      <header className="mb-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
           <Code className="h-8 w-8 text-primary" /> {/* Changed icon and color */}
          <h1 className="text-3xl font-bold text-foreground">优先流</h1> {/* Updated title */}
        </div>
        <p className="text-muted-foreground">按优先级组织您的任务。</p> {/* Updated description */}
      </header>

      <AddTaskForm onAddTask={addTask} />

      <Tabs defaultValue="active" className="mt-6">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="active">
            <ListTodo className="mr-2 h-4 w-4" /> 进行中 ({activeTasks.length}) {/* Updated tab title */}
          </TabsTrigger>
          <TabsTrigger value="completed">
            <CheckCircle className="mr-2 h-4 w-4" /> 已完成 ({completedTasks.length}) {/* Updated tab title */}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="active">
           <TaskList
            tasks={activeTasks}
            title="进行中的任务" // Updated list title
            emptyMessage="没有进行中的任务。在上方添加一个！" // Updated empty message
            isLoading={isLoading}
            onToggleComplete={toggleTaskCompletion}
            onDelete={deleteTask}
            onUpdate={updateTask}
          />
        </TabsContent>
        <TabsContent value="completed">
           <TaskList
            tasks={completedTasks}
            title="已完成的任务" // Updated list title
            emptyMessage="还没有已完成的任务。" // Updated empty message
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
