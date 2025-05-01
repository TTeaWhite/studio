export type Priority = 'high' | 'medium' | 'low';

export interface Task {
  id: string;
  description: string;
  priority: Priority;
  completed: boolean;
  createdAt: number; // 存储创建时间用于排序
}
