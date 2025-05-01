"use client";

import type { Task, Priority } from '@/types/task';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Trash2, Edit } from 'lucide-react';
import { PriorityIcon } from '@/components/priority-icon';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import React, { useState } from 'react';


interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => void;
}

export function TaskItem({ task, onToggleComplete, onDelete, onUpdate }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.description);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditText(task.description); // Reset edit text
  };

  const handleSaveEdit = () => {
    if (editText.trim() !== task.description && editText.trim() !== '') {
      onUpdate(task.id, { description: editText.trim() });
    }
    setIsEditing(false);
  };

  const handlePriorityChange = (newPriority: Priority) => {
     onUpdate(task.id, { priority: newPriority });
  };


  return (
    <div className={cn(
        "flex items-center gap-3 p-3 rounded-lg border border-border transition-colors duration-150 ease-in-out bg-card", // Use theme border
        task.completed ? 'bg-card/50 border-border/30 opacity-70' : 'hover:bg-secondary/80' // Adjust completed and hover styles
    )}>
      <Checkbox
        id={`task-${task.id}`}
        checked={task.completed}
        onCheckedChange={() => onToggleComplete(task.id)}
        aria-labelledby={`task-desc-${task.id}`}
        className="shrink-0 data-[state=checked]:bg-primary data-[state=checked]:border-primary" // Ensure checkbox uses primary color
      />
      <div className="flex-grow grid gap-1">
        {isEditing ? (
           <div className="flex gap-2 items-center">
            <Input
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSaveEdit(); if (e.key === 'Escape') handleCancelEdit(); }}
              className="h-8 text-sm flex-grow focus:ring-accent" // Use accent for focus
              autoFocus
            />
            <Button size="sm" variant="default" onClick={handleSaveEdit}>保存</Button> {/* Use default (primary) variant */}
            <Button size="sm" variant="outline" onClick={handleCancelEdit}>取消</Button>
          </div>
        ) : (
          <label
            htmlFor={`task-${task.id}`}
            id={`task-desc-${task.id}`}
            className={cn(
              "text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
              task.completed ? 'line-through text-muted-foreground/70' : 'text-foreground' // Adjust completed text style
            )}
          >
            {task.description}
          </label>
        )}

      </div>
      {!isEditing && (
        <>
         <Select value={task.priority} onValueChange={handlePriorityChange} disabled={task.completed}>
            <SelectTrigger className={cn(
                "w-[110px] h-8 text-xs shrink-0 focus:ring-accent", // Use accent focus ring
                task.completed && "opacity-50 cursor-not-allowed"
                )} aria-label="更改优先级"> {/* Added aria-label */}
                <div className="flex items-center gap-1">
                    <PriorityIcon priority={task.priority} className="h-3 w-3" />
                    <SelectValue placeholder="优先级" /> {/* Updated placeholder */}
                </div>
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="high">
                    <div className="flex items-center gap-2">
                        <PriorityIcon priority="high" /> 高 {/* Updated label */}
                    </div>
                </SelectItem>
                <SelectItem value="medium">
                     <div className="flex items-center gap-2">
                        <PriorityIcon priority="medium" /> 中 {/* Updated label */}
                    </div>
                </SelectItem>
                <SelectItem value="low">
                     <div className="flex items-center gap-2">
                        <PriorityIcon priority="low" /> 低 {/* Updated label */}
                    </div>
                </SelectItem>
            </SelectContent>
        </Select>

        {!task.completed && (
           <Button
             variant="ghost"
             size="icon"
             className="h-8 w-8 text-muted-foreground hover:text-accent-foreground shrink-0" // Use accent-foreground on hover
             onClick={handleEdit}
             aria-label="编辑任务" // Updated aria-label
           >
             <Edit className="h-4 w-4" />
           </Button>
         )}

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0" // Keep destructive for delete hover
            onClick={() => onDelete(task.id)}
            aria-label="删除任务" // Updated aria-label
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  );
}
