import { Task, TaskPriority, TaskStatus, TaskStats, TeamMember } from '../types/Task';

export const getPriorityColor = (priority: TaskPriority): string => {
  switch (priority) {
    case 'High':
      return '#f44336'; // Red
    case 'Medium':
      return '#ff9800'; // Orange
    case 'Low':
      return '#4caf50'; // Green
    default:
      return '#9e9e9e'; // Gray
  }
};

export const getStatusColor = (status: TaskStatus): string => {
  switch (status) {
    case 'Not Started':
      return '#9e9e9e'; // Gray
    case 'In Progress':
      return '#2196f3'; // Blue
    case 'Completed':
      return '#4caf50'; // Green
    case 'On Hold':
      return '#ff9800'; // Orange
    default:
      return '#9e9e9e'; // Gray
  }
};

export const isTaskOverdue = (task: Task): boolean => {
  if (!task.dueDate) return false;
  return new Date() > task.dueDate && task.status !== 'Completed';
};

export const isTaskDueToday = (task: Task): boolean => {
  if (!task.dueDate) return false;
  const today = new Date();
  const dueDate = new Date(task.dueDate);
  return (
    today.getDate() === dueDate.getDate() &&
    today.getMonth() === dueDate.getMonth() &&
    today.getFullYear() === dueDate.getFullYear()
  );
};

export const isTaskDueTomorrow = (task: Task): boolean => {
  if (!task.dueDate) return false;
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dueDate = new Date(task.dueDate);
  return (
    tomorrow.getDate() === dueDate.getDate() &&
    tomorrow.getMonth() === dueDate.getMonth() &&
    tomorrow.getFullYear() === dueDate.getFullYear()
  );
};

export const calculateTaskStats = (tasks: Task[]): TaskStats => {
  const stats: TaskStats = {
    total: tasks.length,
    notStarted: 0,
    inProgress: 0,
    completed: 0,
    onHold: 0,
    overdue: 0,
    dueToday: 0,
    dueTomorrow: 0,
  };

  tasks.forEach(task => {
    // Count by status
    switch (task.status) {
      case 'Not Started':
        stats.notStarted++;
        break;
      case 'In Progress':
        stats.inProgress++;
        break;
      case 'Completed':
        stats.completed++;
        break;
      case 'On Hold':
        stats.onHold++;
        break;
    }

    // Count special date conditions
    if (isTaskOverdue(task)) stats.overdue++;
    if (isTaskDueToday(task)) stats.dueToday++;
    if (isTaskDueTomorrow(task)) stats.dueTomorrow++;
  });

  return stats;
};

export const sortTasks = (tasks: Task[], sortBy: string, sortOrder: 'asc' | 'desc' = 'asc'): Task[] => {
  return [...tasks].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'dueDate':
        const aDate = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
        const bDate = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
        comparison = aDate - bDate;
        break;
      case 'priority':
        const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
        comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
        break;
      case 'status':
        comparison = a.status.localeCompare(b.status);
        break;
      case 'createdAt':
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
      case 'assignee':
        const aAssignee = a.assignee?.name || '';
        const bAssignee = b.assignee?.name || '';
        comparison = aAssignee.localeCompare(bAssignee);
        break;
      default:
        comparison = 0;
    }

    return sortOrder === 'desc' ? -comparison : comparison;
  });
};

export const formatDueDate = (dueDate: Date): string => {
  const now = new Date();
  const due = new Date(dueDate);
  const diffInMs = due.getTime() - now.getTime();
  const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return 'Due today';
  if (diffInDays === 1) return 'Due tomorrow';
  if (diffInDays === -1) return '1 day overdue';
  if (diffInDays < -1) return `${Math.abs(diffInDays)} days overdue`;
  if (diffInDays <= 7) return `Due in ${diffInDays} days`;
  
  return due.toLocaleDateString();
};

export const generateTaskId = (): string => {
  return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .substring(0, 2);
};

export const validateTask = (task: Partial<Task>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!task.title || task.title.trim().length === 0) {
    errors.push('Task title is required');
  }

  if (task.title && task.title.trim().length > 100) {
    errors.push('Task title must be less than 100 characters');
  }

  if (task.description && task.description.length > 1000) {
    errors.push('Task description must be less than 1000 characters');
  }

  if (task.dueDate && new Date(task.dueDate) < new Date()) {
    errors.push('Due date cannot be in the past');
  }

  if (task.estimatedHours && (task.estimatedHours < 0 || task.estimatedHours > 1000)) {
    errors.push('Estimated hours must be between 0 and 1000');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
