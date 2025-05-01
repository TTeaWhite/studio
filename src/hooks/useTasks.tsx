"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Task, Priority } from '@/types/task';

const LOCAL_STORAGE_KEY = 'priorityflow_tasks';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load tasks from localStorage on initial mount (client-side only)
  useEffect(() => {
    try {
      const storedTasks = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error("Failed to load tasks from localStorage:", error);
      // Handle potential parsing errors or corrupted data
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } finally {
       setIsLoaded(true); // Mark as loaded after attempting to read localStorage
    }
  }, []);

  // Save tasks to localStorage whenever they change (client-side only)
  useEffect(() => {
     // Only save if loading is complete to avoid overwriting initial load with empty array
    if (isLoaded) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
      } catch (error) {
        console.error("Failed to save tasks to localStorage:", error);
      }
    }
  }, [tasks, isLoaded]);

  const addTask = useCallback((description: string, priority: Priority) => {
    if (!description.trim()) return; // Prevent adding empty tasks
    const newTask: Task = {
      id: crypto.randomUUID(),
      description: description.trim(),
      priority,
      completed: false,
      createdAt: Date.now(),
    };
    setTasks((prevTasks) => [...prevTasks, newTask]);
  }, []);

  const toggleTaskCompletion = useCallback((id: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }, []);

   const deleteTask = useCallback((id: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, ...updates } : task
      )
    );
  }, []);


  const activeTasks = tasks.filter((task) => !task.completed).sort((a, b) => {
    const priorityOrder: Record<Priority, number> = { high: 0, medium: 1, low: 2 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return a.createdAt - b.createdAt; // Secondary sort by creation time
  });

  const completedTasks = tasks.filter((task) => task.completed).sort((a,b) => b.createdAt - a.createdAt); // Show recently completed first

  return {
    tasks,
    activeTasks,
    completedTasks,
    addTask,
    toggleTaskCompletion,
    deleteTask,
    updateTask,
    isLoading: !isLoaded, // Expose loading state
  };
}
