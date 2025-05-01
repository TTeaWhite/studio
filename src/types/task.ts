export type Priority = 'high' | 'medium' | 'low';

export interface Task {
  id: string;
  description: string;
  priority: Priority;
  completed: boolean;
  createdAt: number; // Store creation time for sorting
}
