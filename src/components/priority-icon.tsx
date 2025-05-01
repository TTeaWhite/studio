import type { Priority } from '@/types/task';
import { Flame, ChevronsUp, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PriorityIconProps {
  priority: Priority;
  className?: string;
}

const priorityMap: Record<Priority, { icon: React.ElementType; color: string; label: string }> = {
  high: { icon: Flame, color: 'text-red-500', label: 'High Priority' }, // Using Tailwind color for consistency
  medium: { icon: ChevronsUp, color: 'text-orange-500', label: 'Medium Priority' }, // Using Tailwind color for consistency
  low: { icon: ChevronUp, color: 'text-green-500', label: 'Low Priority' }, // Using Tailwind color for consistency
};

export function PriorityIcon({ priority, className }: PriorityIconProps) {
  const { icon: Icon, color, label } = priorityMap[priority];
  return <Icon className={cn('h-4 w-4', color, className)} aria-label={label} />;
}
