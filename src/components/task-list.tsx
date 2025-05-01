import type { Task } from '@/types/task';
import { TaskItem } from '@/components/task-item';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton

interface TaskListProps {
  tasks: Task[];
  title: string;
  emptyMessage: string;
  isLoading: boolean; // Add isLoading prop
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => void;
}

export function TaskList({
  tasks,
  title,
  emptyMessage,
  isLoading, // Destructure isLoading
  onToggleComplete,
  onDelete,
  onUpdate,
}: TaskListProps) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <ScrollArea className="h-[calc(100vh-280px)] pr-4"> {/* Adjust height as needed */}
        <div className="space-y-2">
          {isLoading ? (
            // Show skeletons while loading
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                <Skeleton className="h-5 w-5 rounded-sm" />
                <Skeleton className="h-4 flex-grow" />
                <Skeleton className="h-8 w-[110px] rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            ))
          ) : tasks.length > 0 ? (
            tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggleComplete={onToggleComplete}
                onDelete={onDelete}
                onUpdate={onUpdate}
              />
            ))
          ) : (
            <p className="text-sm text-muted-foreground p-4 text-center">{emptyMessage}</p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
