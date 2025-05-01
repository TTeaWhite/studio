import type { Priority } from '@/types/task';
import { Flame, ChevronsUp, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PriorityIconProps {
  priority: Priority;
  className?: string;
}

// Use theme colors (accent for high, muted-foreground for medium/low maybe?)
// Let's try destructive for high, primary for medium, accent for low? Or stick to semantic colors?
// Sticking to semantic colors might be better for clarity, but let's adjust them slightly.
// Let's use text-destructive for high, text-primary for medium, and text-accent for low for strong cyberpunk feel.

const priorityMap: Record<Priority, { icon: React.ElementType; color: string; label: string }> = {
  high: { icon: Flame, color: 'text-destructive', label: '高优先级' }, // Use destructive (Neon Red)
  medium: { icon: ChevronsUp, color: 'text-primary', label: '中优先级' }, // Use primary (Neon Pink)
  low: { icon: ChevronUp, color: 'text-accent', label: '低优先级' }, // Use accent (Neon Cyan)
};

export function PriorityIcon({ priority, className }: PriorityIconProps) {
  const { icon: Icon, color, label } = priorityMap[priority];
  return <Icon className={cn('h-4 w-4', color, className)} aria-label={label} />;
}
