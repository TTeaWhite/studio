"use client";

import { useState } from 'react';
import type { Priority } from '@/types/task';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from 'lucide-react';
import { PriorityIcon } from '@/components/priority-icon';

interface AddTaskFormProps {
  onAddTask: (description: string, priority: Priority) => void;
}

export function AddTaskForm({ onAddTask }: AddTaskFormProps) {
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium'); // Default priority

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;
    onAddTask(description, priority);
    setDescription(''); // Reset input after adding
    setPriority('medium'); // Reset priority
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 p-4 bg-card rounded-lg shadow-sm border">
      <Input
        type="text"
        placeholder="添加一个新任务..." // Updated placeholder
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="flex-grow focus:ring-accent"
        aria-label="新任务描述" // Updated aria-label
      />
      <Select value={priority} onValueChange={(value: Priority) => setPriority(value)}>
        <SelectTrigger className="w-[120px] focus:ring-accent" aria-label="选择任务优先级"> {/* Updated aria-label */}
           <div className="flex items-center gap-1">
              <PriorityIcon priority={priority} className="h-4 w-4"/>
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
      <Button type="submit" size="icon" aria-label="添加任务"> {/* Updated aria-label */}
        <Plus className="h-4 w-4" />
      </Button>
    </form>
  );
}
