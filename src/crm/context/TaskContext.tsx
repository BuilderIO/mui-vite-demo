import * as React from 'react';
import { Task, TaskStatus, Notification, TaskFilters, TaskStats } from '../types/taskTypes';
import { 
  mockTasks, 
  mockNotifications, 
  calculateTaskStats,
  isTaskOverdue,
  isTaskDueSoon 
} from '../data/taskData';

interface TaskContextType {
  // State
  tasks: Task[];
  notifications: Notification[];
  filters: TaskFilters;
  stats: TaskStats;
  
  // Actions
  createTask: (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'statusHistory'>) => void;
  updateTask: (taskId: string, taskData: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  setFilters: (filters: TaskFilters) => void;
  
  // Notification actions
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: () => void;
  deleteNotification: (notificationId: string) => void;
  
  // Computed values
  filteredTasks: Task[];
  overdueTasks: Task[];
  dueSoonTasks: Task[];
  unreadNotificationCount: number;
}

const TaskContext = React.createContext<TaskContextType | undefined>(undefined);

export function useTaskContext() {
  const context = React.useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
}

interface TaskProviderProps {
  children: React.ReactNode;
}

export function TaskProvider({ children }: TaskProviderProps) {
  const [tasks, setTasks] = React.useState<Task[]>(mockTasks);
  const [notifications, setNotifications] = React.useState<Notification[]>(mockNotifications);
  const [filters, setFilters] = React.useState<TaskFilters>({});

  // Computed values
  const filteredTasks = React.useMemo(() => {
    return tasks.filter(task => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(searchLower);
        const matchesDescription = task.description?.toLowerCase().includes(searchLower);
        if (!matchesTitle && !matchesDescription) return false;
      }

      // Status filter
      if (filters.status && filters.status.length > 0) {
        if (!filters.status.includes(task.status)) return false;
      }

      // Priority filter
      if (filters.priority && filters.priority.length > 0) {
        if (!filters.priority.includes(task.priority)) return false;
      }

      // Assignee filter
      if (filters.assigneeId && filters.assigneeId.length > 0) {
        if (!task.assigneeId || !filters.assigneeId.includes(task.assigneeId)) return false;
      }

      // Due date filter
      if (filters.dueDateFrom || filters.dueDateTo) {
        if (!task.dueDate) return false;
        const taskDate = new Date(task.dueDate);
        
        if (filters.dueDateFrom) {
          const fromDate = new Date(filters.dueDateFrom);
          if (taskDate < fromDate) return false;
        }
        
        if (filters.dueDateTo) {
          const toDate = new Date(filters.dueDateTo);
          if (taskDate > toDate) return false;
        }
      }

      return true;
    });
  }, [tasks, filters]);

  const overdueTasks = React.useMemo(() => 
    tasks.filter(isTaskOverdue), [tasks]
  );

  const dueSoonTasks = React.useMemo(() => 
    tasks.filter(isTaskDueSoon), [tasks]
  );

  const stats = React.useMemo(() => calculateTaskStats(tasks), [tasks]);

  const unreadNotificationCount = React.useMemo(() => 
    notifications.filter(n => !n.read).length, [notifications]
  );

  // Generate automatic notifications
  React.useEffect(() => {
    const generateNotifications = () => {
      const newNotifications: Notification[] = [];
      const now = new Date();

      tasks.forEach(task => {
        if (!task.dueDate || !task.assigneeId) return;

        const dueDate = new Date(task.dueDate);
        const hasOverdueNotification = notifications.some(
          n => n.taskId === task.id && n.type === 'task_overdue'
        );
        const hasDueSoonNotification = notifications.some(
          n => n.taskId === task.id && n.type === 'task_due_soon'
        );

        // Create overdue notification
        if (isTaskOverdue(task) && !hasOverdueNotification) {
          newNotifications.push({
            id: `notif-overdue-${task.id}-${Date.now()}`,
            type: 'task_overdue',
            taskId: task.id,
            recipientId: task.assigneeId,
            title: 'Task Overdue',
            message: `Your task "${task.title}" is overdue and requires immediate attention.`,
            read: false,
            createdAt: now.toISOString(),
          });
        }

        // Create due soon notification
        if (isTaskDueSoon(task) && !hasDueSoonNotification && !isTaskOverdue(task)) {
          newNotifications.push({
            id: `notif-due-soon-${task.id}-${Date.now()}`,
            type: 'task_due_soon',
            taskId: task.id,
            recipientId: task.assigneeId,
            title: 'Task Due Soon',
            message: `Your task "${task.title}" is due within 24 hours.`,
            read: false,
            createdAt: now.toISOString(),
          });
        }
      });

      if (newNotifications.length > 0) {
        setNotifications(prev => [...newNotifications, ...prev]);
      }
    };

    // Generate notifications on mount and when tasks change
    generateNotifications();

    // Set up interval to check for due notifications
    const interval = setInterval(generateNotifications, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [tasks, notifications]);

  // Actions
  const createTask = React.useCallback((taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'statusHistory'>) => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      statusHistory: [
        {
          id: `sh-${Date.now()}`,
          taskId: `task-${Date.now()}`,
          fromStatus: null,
          toStatus: taskData.status,
          changedBy: '1', // Current user
          changedAt: new Date().toISOString(),
        },
      ],
    };

    setTasks(prev => [newTask, ...prev]);

    // Create notification if task is assigned to someone else
    if (taskData.assigneeId && taskData.assigneeId !== '1') {
      const newNotification: Notification = {
        id: `notif-assigned-${newTask.id}-${Date.now()}`,
        type: 'task_assigned',
        taskId: newTask.id,
        recipientId: taskData.assigneeId,
        title: 'New Task Assigned',
        message: `You have been assigned a new task: "${taskData.title}".`,
        read: false,
        createdAt: new Date().toISOString(),
      };
      setNotifications(prev => [newNotification, ...prev]);
    }
  }, []);

  const updateTask = React.useCallback((taskId: string, taskData: Partial<Task>) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          ...taskData,
          updatedAt: new Date().toISOString(),
        };
      }
      return task;
    }));
  }, []);

  const deleteTask = React.useCallback((taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
    setNotifications(prev => prev.filter(notif => notif.taskId !== taskId));
  }, []);

  const updateTaskStatus = React.useCallback((taskId: string, status: TaskStatus) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const updatedTask = {
          ...task,
          status,
          updatedAt: new Date().toISOString(),
          statusHistory: [
            ...task.statusHistory,
            {
              id: `sh-${Date.now()}`,
              taskId: task.id,
              fromStatus: task.status,
              toStatus: status,
              changedBy: '1', // Current user
              changedAt: new Date().toISOString(),
            },
          ],
        };

        // Create notification for task completion
        if (status === 'completed' && task.assigneeId && task.assigneeId !== '1') {
          const newNotification: Notification = {
            id: `notif-completed-${task.id}-${Date.now()}`,
            type: 'task_completed',
            taskId: task.id,
            recipientId: task.assigneeId,
            title: 'Task Completed',
            message: `Task "${task.title}" has been marked as completed.`,
            read: false,
            createdAt: new Date().toISOString(),
          };
          setNotifications(prev => [newNotification, ...prev]);
        }

        return updatedTask;
      }
      return task;
    }));
  }, []);

  const markNotificationAsRead = React.useCallback((notificationId: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === notificationId ? { ...notif, read: true } : notif
    ));
  }, []);

  const markAllNotificationsAsRead = React.useCallback(() => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  }, []);

  const deleteNotification = React.useCallback((notificationId: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
  }, []);

  const value: TaskContextType = {
    // State
    tasks,
    notifications,
    filters,
    stats,
    
    // Actions
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    setFilters,
    
    // Notification actions
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    
    // Computed values
    filteredTasks,
    overdueTasks,
    dueSoonTasks,
    unreadNotificationCount,
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
}
