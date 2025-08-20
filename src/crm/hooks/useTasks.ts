import * as React from "react";
import { Task, TaskFormData, User } from "../types/tasks";

interface UseTasksResult {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  createTask: (taskData: TaskFormData, assignee?: User) => Promise<void>;
  updateTask: (id: string | number, taskData: Partial<TaskFormData>, assignee?: User) => Promise<void>;
  deleteTask: (id: string | number) => Promise<void>;
  toggleTaskComplete: (id: string | number) => Promise<void>;
  updateTaskStatus: (id: string | number, status: Task["status"]) => Promise<void>;
}

// Mock task data generator
function generateMockTasks(users: User[]): Task[] {
  const sampleTasks = [
    {
      title: "Implement user authentication system",
      description: "Create login and registration functionality with JWT tokens",
      priority: "high" as const,
      status: "in_progress" as const,
      dueDate: "2024-02-15",
      tags: ["Backend", "Security", "Authentication"],
    },
    {
      title: "Design homepage mockups",
      description: "Create responsive design mockups for the new homepage layout",
      priority: "medium" as const,
      status: "todo" as const,
      dueDate: "2024-02-10",
      tags: ["Frontend", "Design", "UI/UX"],
    },
    {
      title: "Fix payment processing bug",
      description: "Resolve issue where payment confirmation emails are not being sent",
      priority: "high" as const,
      status: "completed" as const,
      dueDate: "2024-01-30",
      tags: ["Bug Fix", "Payment", "Email"],
    },
    {
      title: "Update API documentation",
      description: "Add documentation for new endpoints and update existing ones",
      priority: "low" as const,
      status: "on_hold" as const,
      dueDate: "2024-02-20",
      tags: ["Documentation", "API"],
    },
    {
      title: "Optimize database queries",
      description: "Improve performance of slow-running queries in the user dashboard",
      priority: "medium" as const,
      status: "todo" as const,
      dueDate: "2024-02-18",
      tags: ["Backend", "Performance", "Database"],
    },
    {
      title: "Create automated test suite",
      description: "Set up comprehensive testing framework for all components",
      priority: "medium" as const,
      status: "in_progress" as const,
      dueDate: "2024-02-25",
      tags: ["Testing", "Automation", "Quality"],
    },
    {
      title: "Implement real-time notifications",
      description: "Add WebSocket support for real-time user notifications",
      priority: "high" as const,
      status: "todo" as const,
      dueDate: "2024-02-12",
      tags: ["Frontend", "Backend", "Real-time"],
    },
    {
      title: "Security audit and penetration testing",
      description: "Conduct comprehensive security review of the application",
      priority: "high" as const,
      status: "todo" as const,
      dueDate: "2024-03-01",
      tags: ["Security", "Testing", "Audit"],
    },
    {
      title: "Mobile app responsive design",
      description: "Ensure all pages work properly on mobile devices",
      priority: "medium" as const,
      status: "completed" as const,
      dueDate: "2024-01-25",
      tags: ["Frontend", "Mobile", "Responsive"],
    },
    {
      title: "Analytics integration",
      description: "Integrate Google Analytics and custom event tracking",
      priority: "low" as const,
      status: "on_hold" as const,
      dueDate: "2024-02-28",
      tags: ["Analytics", "Tracking", "Integration"],
    },
  ];

  return sampleTasks.map((task, index) => ({
    id: `task-${index + 1}`,
    ...task,
    completed: task.status === "completed",
    assignee: users[index % users.length],
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
  }));
}

export function useTasks(users: User[]): UseTasksResult {
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Initialize with mock data
  React.useEffect(() => {
    if (users.length > 0) {
      setTasks(generateMockTasks(users));
    }
  }, [users]);

  const createTask = React.useCallback(async (taskData: TaskFormData, assignee?: User) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newTask: Task = {
        id: `task-${Date.now()}`,
        title: taskData.title,
        description: taskData.description,
        completed: taskData.status === "completed",
        priority: taskData.priority,
        status: taskData.status,
        dueDate: taskData.dueDate || undefined,
        assignee: assignee || undefined,
        tags: taskData.tags,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      setTasks(prev => [newTask, ...prev]);
    } catch (err) {
      console.error("Error creating task:", err);
      setError(err instanceof Error ? err.message : "Failed to create task");
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTask = React.useCallback(async (
    id: string | number, 
    taskData: Partial<TaskFormData>, 
    assignee?: User
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setTasks(prev => prev.map(task => {
        if (task.id === id) {
          return {
            ...task,
            ...taskData,
            completed: taskData.status ? taskData.status === "completed" : task.completed,
            assignee: assignee !== undefined ? assignee : task.assignee,
            updatedAt: new Date().toISOString(),
          };
        }
        return task;
      }));
    } catch (err) {
      console.error("Error updating task:", err);
      setError(err instanceof Error ? err.message : "Failed to update task");
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTask = React.useCallback(async (id: string | number) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (err) {
      console.error("Error deleting task:", err);
      setError(err instanceof Error ? err.message : "Failed to delete task");
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleTaskComplete = React.useCallback(async (id: string | number) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      setTasks(prev => prev.map(task => {
        if (task.id === id) {
          const newCompleted = !task.completed;
          return {
            ...task,
            completed: newCompleted,
            status: newCompleted ? "completed" : "todo",
            updatedAt: new Date().toISOString(),
          };
        }
        return task;
      }));
    } catch (err) {
      console.error("Error toggling task completion:", err);
      setError(err instanceof Error ? err.message : "Failed to update task");
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTaskStatus = React.useCallback(async (id: string | number, status: Task["status"]) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      setTasks(prev => prev.map(task => {
        if (task.id === id) {
          return {
            ...task,
            status,
            completed: status === "completed",
            updatedAt: new Date().toISOString(),
          };
        }
        return task;
      }));
    } catch (err) {
      console.error("Error updating task status:", err);
      setError(err instanceof Error ? err.message : "Failed to update task status");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    updateTaskStatus,
  };
}
