"use client";

import { AddTaskForm } from '@/components/add-task-form';
import { TaskList } from '@/components/task-list';
import { useTasks } from '@/hooks/useTasks';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListTodo, CheckCircle, Palette } from 'lucide-react'; // Import Palette

export default function Home() {
  const {
    activeTasks,
    completedTasks,
    addTask,
    toggleTaskCompletion,
    deleteTask,
    updateTask,
    isLoading, // Get loading state
  } = useTasks();

  return (
    <div className="container mx-auto max-w-2xl p-4 md:p-8 min-h-screen">
      <header className="mb-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
           <Palette className="h-8 w-8 text-accent" /> {/* Use Palette icon */}
          <h1 className="text-3xl font-bold text-foreground">PriorityFlow</h1>
        </div>
        <p className="text-muted-foreground">Organize your tasks by priority.</p>
      </header>

      <AddTaskForm onAddTask={addTask} />

      <Tabs defaultValue="active" className="mt-6">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="active">
            <ListTodo className="mr-2 h-4 w-4" /> Active ({activeTasks.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            <CheckCircle className="mr-2 h-4 w-4" /> Completed ({completedTasks.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="active">
           <TaskList
            tasks={activeTasks}
            title="Active Tasks"
            emptyMessage="No active tasks. Add one above!"
            isLoading={isLoading} // Pass loading state
            onToggleComplete={toggleTaskCompletion}
            onDelete={deleteTask}
            onUpdate={updateTask}
          />
        </TabsContent>
        <TabsContent value="completed">
           <TaskList
            tasks={completedTasks}
            title="Completed Tasks"
            emptyMessage="No tasks completed yet."
            isLoading={isLoading} // Pass loading state
            onToggleComplete={toggleTaskCompletion}
            onDelete={deleteTask}
            onUpdate={updateTask}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
