import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Task, TaskFilters, TeamMember, Notification, TaskStats } from '../types/Task';
import { mockTasks, mockTeamMembers, mockNotifications, getCurrentUser } from '../data/mockData';
import { calculateTaskStats, generateTaskId } from '../utils/taskUtils';

interface TaskState {
  tasks: Task[];
  teamMembers: TeamMember[];
  notifications: Notification[];
  currentUser: TeamMember;
  filters: TaskFilters;
  stats: TaskStats;
  loading: boolean;
  error: string | null;
}

type TaskAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'SET_FILTERS'; payload: TaskFilters }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'UPDATE_STATS'; payload: TaskStats };

const initialState: TaskState = {
  tasks: [],
  teamMembers: mockTeamMembers,
  notifications: [],
  currentUser: getCurrentUser(),
  filters: {},
  stats: {
    total: 0,
    notStarted: 0,
    inProgress: 0,
    completed: 0,
    onHold: 0,
    overdue: 0,
    dueToday: 0,
    dueTomorrow: 0,
  },
  loading: true,
  error: null,
};

const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };

    case 'SET_TASKS':
      const stats = calculateTaskStats(action.payload);
      return { 
        ...state, 
        tasks: action.payload, 
        stats,
        loading: false,
        error: null 
      };

    case 'ADD_TASK':
      const newTasks = [...state.tasks, action.payload];
      const newStats = calculateTaskStats(newTasks);
      return { 
        ...state, 
        tasks: newTasks,
        stats: newStats
      };

    case 'UPDATE_TASK':
      const updatedTasks = state.tasks.map(task =>
        task.id === action.payload.id ? action.payload : task
      );
      const updatedStats = calculateTaskStats(updatedTasks);
      return { 
        ...state, 
        tasks: updatedTasks,
        stats: updatedStats
      };

    case 'DELETE_TASK':
      const filteredTasks = state.tasks.filter(task => task.id !== action.payload);
      const filteredStats = calculateTaskStats(filteredTasks);
      return { 
        ...state, 
        tasks: filteredTasks,
        stats: filteredStats
      };

    case 'SET_FILTERS':
      return { ...state, filters: action.payload };

    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [action.payload, ...state.notifications]
      };

    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(notif =>
          notif.id === action.payload ? { ...notif, isRead: true } : notif
        )
      };

    case 'UPDATE_STATS':
      return { ...state, stats: action.payload };

    default:
      return state;
  }
};

interface TaskContextType extends TaskState {
  createTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'comments' | 'statusHistory'>) => void;
  updateTask: (task: Task) => void;
  deleteTask: (taskId: string) => void;
  updateFilters: (filters: TaskFilters) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  markNotificationAsRead: (notificationId: string) => void;
  getFilteredTasks: () => Task[];
  assignTask: (taskId: string, assigneeId: string) => void;
  updateTaskStatus: (taskId: string, status: Task['status'], comment?: string) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        dispatch({ type: 'SET_TASKS', payload: mockTasks });
        
        // Set notifications
        state.notifications = mockNotifications;
        
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load tasks' });
      }
    };

    initializeData();
  }, []);

  const createTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'comments' | 'statusHistory'>) => {
    const newTask: Task = {
      ...taskData,
      id: generateTaskId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: state.currentUser,
      comments: [],
      statusHistory: [{
        id: generateTaskId(),
        status: taskData.status,
        changedBy: state.currentUser,
        changedAt: new Date(),
        comment: 'Task created'
      }]
    };

    dispatch({ type: 'ADD_TASK', payload: newTask });

    // Create notification for assignee if different from current user
    if (newTask.assignee && newTask.assignee.id !== state.currentUser.id) {
      addNotification({
        type: 'task_assigned',
        title: 'New Task Assigned',
        message: `You have been assigned: ${newTask.title}`,
        taskId: newTask.id,
        recipientId: newTask.assignee.id,
        isRead: false,
        actionUrl: '/tasks'
      });
    }
  };

  const updateTask = (task: Task) => {
    const updatedTask = {
      ...task,
      updatedAt: new Date()
    };
    dispatch({ type: 'UPDATE_TASK', payload: updatedTask });
  };

  const deleteTask = (taskId: string) => {
    dispatch({ type: 'DELETE_TASK', payload: taskId });
  };

  const updateFilters = (filters: TaskFilters) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  };

  const addNotification = (notificationData: Omit<Notification, 'id' | 'createdAt'>) => {
    const notification: Notification = {
      ...notificationData,
      id: generateTaskId(),
      createdAt: new Date()
    };
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
  };

  const markNotificationAsRead = (notificationId: string) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: notificationId });
  };

  const getFilteredTasks = (): Task[] => {
    let filtered = [...state.tasks];

    if (state.filters.status && state.filters.status.length > 0) {
      filtered = filtered.filter(task => state.filters.status!.includes(task.status));
    }

    if (state.filters.priority && state.filters.priority.length > 0) {
      filtered = filtered.filter(task => state.filters.priority!.includes(task.priority));
    }

    if (state.filters.assignee && state.filters.assignee.length > 0) {
      filtered = filtered.filter(task => 
        task.assignee && state.filters.assignee!.includes(task.assignee.id)
      );
    }

    if (state.filters.searchQuery) {
      const query = state.filters.searchQuery.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query) ||
        task.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    if (state.filters.tags && state.filters.tags.length > 0) {
      filtered = filtered.filter(task =>
        state.filters.tags!.some(filterTag => task.tags.includes(filterTag))
      );
    }

    if (state.filters.dueDate) {
      if (state.filters.dueDate.from) {
        filtered = filtered.filter(task =>
          task.dueDate && new Date(task.dueDate) >= state.filters.dueDate!.from!
        );
      }
      if (state.filters.dueDate.to) {
        filtered = filtered.filter(task =>
          task.dueDate && new Date(task.dueDate) <= state.filters.dueDate!.to!
        );
      }
    }

    return filtered;
  };

  const assignTask = (taskId: string, assigneeId: string) => {
    const task = state.tasks.find(t => t.id === taskId);
    const assignee = state.teamMembers.find(m => m.id === assigneeId);
    
    if (task && assignee) {
      const updatedTask = {
        ...task,
        assignee,
        updatedAt: new Date()
      };
      dispatch({ type: 'UPDATE_TASK', payload: updatedTask });

      // Create notification
      if (assignee.id !== state.currentUser.id) {
        addNotification({
          type: 'task_assigned',
          title: 'Task Reassigned',
          message: `You have been assigned: ${task.title}`,
          taskId: task.id,
          recipientId: assignee.id,
          isRead: false,
          actionUrl: '/tasks'
        });
      }
    }
  };

  const updateTaskStatus = (taskId: string, status: Task['status'], comment?: string) => {
    const task = state.tasks.find(t => t.id === taskId);
    
    if (task) {
      const statusHistoryEntry = {
        id: generateTaskId(),
        status,
        changedBy: state.currentUser,
        changedAt: new Date(),
        comment
      };

      const updatedTask = {
        ...task,
        status,
        statusHistory: [...task.statusHistory, statusHistoryEntry],
        updatedAt: new Date()
      };

      dispatch({ type: 'UPDATE_TASK', payload: updatedTask });

      // Create notification for assignee if task is completed
      if (status === 'Completed' && task.assignee && task.assignee.id !== state.currentUser.id) {
        addNotification({
          type: 'task_completed',
          title: 'Task Completed',
          message: `Task "${task.title}" has been marked as completed`,
          taskId: task.id,
          recipientId: task.createdBy.id,
          isRead: false,
          actionUrl: '/tasks'
        });
      }
    }
  };

  const value: TaskContextType = {
    ...state,
    createTask,
    updateTask,
    deleteTask,
    updateFilters,
    addNotification,
    markNotificationAsRead,
    getFilteredTasks,
    assignTask,
    updateTaskStatus,
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};
