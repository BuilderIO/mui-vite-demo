import { useState, useEffect, useMemo } from 'react';
import {
  Task,
  User,
  TaskFilters,
  TaskSortOptions,
  TaskStats,
  TaskPriority,
  TaskStatus,
  Notification,
} from '../types/TaskTypes';

// Mock data for demonstration
const mockUsers: User[] = [
  { id: '1', name: 'Alex Thompson', email: 'alex@acmecrm.com', avatar: 'AT' },
  { id: '2', name: 'Sarah Johnson', email: 'sarah@acmecrm.com', avatar: 'SJ' },
  { id: '3', name: 'Mike Chen', email: 'mike@acmecrm.com', avatar: 'MC' },
  { id: '4', name: 'Emily Rodriguez', email: 'emily@acmecrm.com', avatar: 'ER' },
  { id: '5', name: 'David Kim', email: 'david@acmecrm.com', avatar: 'DK' },
];

const generateMockTasks = (): Task[] => {
  const tasks: Task[] = [
    {
      id: '1',
      title: 'Implement user authentication system',
      description: 'Create a secure authentication system with JWT tokens and role-based access control.',
      assigneeId: '2',
      assigneeName: 'Sarah Johnson',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      priority: 'High',
      status: 'In Progress',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      statusHistory: [
        { status: 'Not Started', timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), changedBy: 'Alex Thompson' },
        { status: 'In Progress', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), changedBy: 'Sarah Johnson' },
      ],
    },
    {
      id: '2',
      title: 'Design responsive dashboard layout',
      description: 'Create wireframes and mockups for the main dashboard interface.',
      assigneeId: '3',
      assigneeName: 'Mike Chen',
      dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Overdue
      priority: 'Medium',
      status: 'Not Started',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      statusHistory: [
        { status: 'Not Started', timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), changedBy: 'Alex Thompson' },
      ],
    },
    {
      id: '3',
      title: 'Write API documentation',
      description: 'Document all REST API endpoints with examples and response schemas.',
      assigneeId: '4',
      assigneeName: 'Emily Rodriguez',
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
      priority: 'Low',
      status: 'Completed',
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      statusHistory: [
        { status: 'Not Started', timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), changedBy: 'Alex Thompson' },
        { status: 'In Progress', timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), changedBy: 'Emily Rodriguez' },
        { status: 'Completed', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), changedBy: 'Emily Rodriguez' },
      ],
    },
    {
      id: '4',
      title: 'Set up continuous integration pipeline',
      description: 'Configure CI/CD pipeline with automated testing and deployment.',
      assigneeId: '5',
      assigneeName: 'David Kim',
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      priority: 'High',
      status: 'On Hold',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      statusHistory: [
        { status: 'Not Started', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), changedBy: 'Alex Thompson' },
        { status: 'In Progress', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), changedBy: 'David Kim' },
        { status: 'On Hold', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), changedBy: 'David Kim' },
      ],
    },
    {
      id: '5',
      title: 'Optimize database queries',
      description: 'Review and optimize slow database queries for better performance.',
      assigneeId: '1',
      assigneeName: 'Alex Thompson',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      priority: 'Medium',
      status: 'In Progress',
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
      statusHistory: [
        { status: 'Not Started', timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), changedBy: 'Alex Thompson' },
        { status: 'In Progress', timestamp: new Date(), changedBy: 'Alex Thompson' },
      ],
    },
  ];
  return tasks;
};

export const useTaskData = () => {
  const [tasks, setTasks] = useState<Task[]>(generateMockTasks());
  const [users] = useState<User[]>(mockUsers);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filters, setFilters] = useState<TaskFilters>({});
  const [sortOptions, setSortOptions] = useState<TaskSortOptions>({
    field: 'createdAt',
    direction: 'desc',
  });

  // Create task
  const createTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'statusHistory'>) => {
    const newTask: Task = {
      ...taskData,
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      statusHistory: [
        {
          status: taskData.status,
          timestamp: new Date(),
          changedBy: 'Alex Thompson', // Current user
        },
      ],
    };
    setTasks(prev => [newTask, ...prev]);
    
    // Create assignment notification
    if (taskData.assigneeId !== '1') { // If not assigning to self
      const notification: Notification = {
        id: `notif_${Date.now()}`,
        taskId: newTask.id,
        type: 'assignment',
        title: 'New Task Assigned',
        message: `You have been assigned a new task: "${newTask.title}"`,
        createdAt: new Date(),
        read: false,
      };
      setNotifications(prev => [notification, ...prev]);
    }
    
    return newTask;
  };

  // Update task
  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const updatedTask = {
          ...task,
          ...updates,
          updatedAt: new Date(),
        };
        
        // Add status history entry if status changed
        if (updates.status && updates.status !== task.status) {
          updatedTask.statusHistory = [
            ...task.statusHistory,
            {
              status: updates.status,
              timestamp: new Date(),
              changedBy: 'Alex Thompson', // Current user
            },
          ];
          
          // Create status change notification
          const notification: Notification = {
            id: `notif_${Date.now()}`,
            taskId: taskId,
            type: 'status_change',
            title: 'Task Status Updated',
            message: `Task "${task.title}" status changed to ${updates.status}`,
            createdAt: new Date(),
            read: false,
          };
          setNotifications(prev => [notification, ...prev]);
        }
        
        return updatedTask;
      }
      return task;
    }));
  };

  // Delete task
  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  // Filter and sort tasks
  const filteredAndSortedTasks = useMemo(() => {
    let filtered = [...tasks];

    // Apply filters
    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter(task => filters.status!.includes(task.status));
    }

    if (filters.priority && filters.priority.length > 0) {
      filtered = filtered.filter(task => filters.priority!.includes(task.priority));
    }

    if (filters.assignee && filters.assignee.length > 0) {
      filtered = filtered.filter(task => filters.assignee!.includes(task.assigneeId));
    }

    if (filters.overdue) {
      filtered = filtered.filter(task => {
        if (!task.dueDate) return false;
        return task.dueDate < new Date() && task.status !== 'Completed';
      });
    }

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query)
      );
    }

    if (filters.dueDateRange) {
      filtered = filtered.filter(task => {
        if (!task.dueDate) return false;
        const { start, end } = filters.dueDateRange!;
        if (start && task.dueDate < start) return false;
        if (end && task.dueDate > end) return false;
        return true;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const { field, direction } = sortOptions;
      let aValue: any = a[field];
      let bValue: any = b[field];

      if (field === 'priority') {
        const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
        aValue = priorityOrder[a.priority];
        bValue = priorityOrder[b.priority];
      }

      if (aValue instanceof Date) aValue = aValue.getTime();
      if (bValue instanceof Date) bValue = bValue.getTime();

      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [tasks, filters, sortOptions]);

  // Calculate task statistics
  const taskStats = useMemo((): TaskStats => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

    const stats = tasks.reduce(
      (acc, task) => {
        acc.total++;
        acc[task.status.toLowerCase().replace(' ', '') as keyof TaskStats]++;

        if (task.dueDate) {
          if (task.dueDate < now && task.status !== 'Completed') {
            acc.overdue++;
          } else if (task.dueDate >= today && task.dueDate < tomorrow) {
            acc.dueToday++;
          } else if (task.dueDate >= tomorrow && task.dueDate < new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000)) {
            acc.dueTomorrow++;
          }
        }

        return acc;
      },
      {
        total: 0,
        notStarted: 0,
        inProgress: 0,
        completed: 0,
        onHold: 0,
        overdue: 0,
        dueToday: 0,
        dueTomorrow: 0,
        completionRate: 0,
      } as TaskStats
    );

    stats.completionRate = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;

    return stats;
  }, [tasks]);

  // Mark notification as read
  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  // Simulate automated reminders
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const twentyFourHoursFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

      tasks.forEach(task => {
        if (
          task.dueDate &&
          task.status !== 'Completed' &&
          task.dueDate <= twentyFourHoursFromNow &&
          task.dueDate > now
        ) {
          // Check if reminder already exists
          const existingReminder = notifications.find(
            notif => notif.taskId === task.id && notif.type === 'reminder'
          );

          if (!existingReminder) {
            const reminder: Notification = {
              id: `reminder_${Date.now()}_${task.id}`,
              taskId: task.id,
              type: 'reminder',
              title: 'Task Due Soon',
              message: `Task "${task.title}" is due in less than 24 hours`,
              createdAt: new Date(),
              read: false,
            };
            setNotifications(prev => [reminder, ...prev]);
          }
        }
      });
    };

    const interval = setInterval(checkReminders, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [tasks, notifications]);

  return {
    tasks: filteredAndSortedTasks,
    allTasks: tasks,
    users,
    notifications,
    taskStats,
    filters,
    sortOptions,
    setFilters,
    setSortOptions,
    createTask,
    updateTask,
    deleteTask,
    markNotificationAsRead,
  };
};
