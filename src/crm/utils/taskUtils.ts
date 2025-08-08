import { Task, TaskPriority, TaskStatus, TaskSummary, TaskFilters, TaskSortOptions } from '../types/task';

export const getPriorityColor = (priority: TaskPriority) => {
  switch (priority) {
    case 'High':
      return 'error';
    case 'Medium':
      return 'warning';
    case 'Low':
      return 'success';
    default:
      return 'default';
  }
};

export const getPriorityColorHex = (priority: TaskPriority) => {
  switch (priority) {
    case 'High':
      return '#f44336';
    case 'Medium':
      return '#ff9800';
    case 'Low':
      return '#4caf50';
    default:
      return '#9e9e9e';
  }
};

export const getStatusColor = (status: TaskStatus) => {
  switch (status) {
    case 'Not Started':
      return 'default';
    case 'In Progress':
      return 'info';
    case 'Completed':
      return 'success';
    case 'On Hold':
      return 'warning';
    default:
      return 'default';
  }
};

export const isTaskOverdue = (task: Task): boolean => {
  if (!task.dueDate || task.status === 'Completed') {
    return false;
  }
  return new Date(task.dueDate) < new Date();
};

export const isTaskDueSoon = (task: Task, daysAhead: number = 3): boolean => {
  if (!task.dueDate || task.status === 'Completed') {
    return false;
  }
  const now = new Date();
  const dueDate = new Date(task.dueDate);
  const soonDate = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000);
  
  return dueDate >= now && dueDate <= soonDate;
};

export const getDaysUntilDue = (dueDate: Date): number => {
  const now = new Date();
  const due = new Date(dueDate);
  const diffTime = due.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const formatDueDate = (dueDate: Date): string => {
  const now = new Date();
  const due = new Date(dueDate);
  const diffTime = due.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return `${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''} overdue`;
  } else if (diffDays === 0) {
    return 'Due today';
  } else if (diffDays === 1) {
    return 'Due tomorrow';
  } else if (diffDays <= 7) {
    return `Due in ${diffDays} days`;
  } else {
    return due.toLocaleDateString();
  }
};

export const calculateTaskSummary = (tasks: Task[]): TaskSummary => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'Completed').length;
  const inProgressTasks = tasks.filter(task => task.status === 'In Progress').length;
  const overdueTasks = tasks.filter(task => isTaskOverdue(task)).length;

  const tasksByPriority = tasks.reduce((acc, task) => {
    acc[task.priority] = (acc[task.priority] || 0) + 1;
    return acc;
  }, {} as Record<TaskPriority, number>);

  const tasksByStatus = tasks.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1;
    return acc;
  }, {} as Record<TaskStatus, number>);

  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return {
    totalTasks,
    completedTasks,
    inProgressTasks,
    overdueTasks,
    tasksByPriority: {
      High: tasksByPriority.High || 0,
      Medium: tasksByPriority.Medium || 0,
      Low: tasksByPriority.Low || 0,
    },
    tasksByStatus: {
      'Not Started': tasksByStatus['Not Started'] || 0,
      'In Progress': tasksByStatus['In Progress'] || 0,
      'Completed': tasksByStatus['Completed'] || 0,
      'On Hold': tasksByStatus['On Hold'] || 0,
    },
    completionRate,
  };
};

export const filterTasks = (tasks: Task[], filters: TaskFilters): Task[] => {
  return tasks.filter(task => {
    // Status filter
    if (filters.status && filters.status.length > 0) {
      if (!filters.status.includes(task.status)) {
        return false;
      }
    }

    // Priority filter
    if (filters.priority && filters.priority.length > 0) {
      if (!filters.priority.includes(task.priority)) {
        return false;
      }
    }

    // Assignee filter
    if (filters.assigneeId && filters.assigneeId.length > 0) {
      if (!task.assigneeId || !filters.assigneeId.includes(task.assigneeId)) {
        return false;
      }
    }

    // Due date range filter
    if (filters.dueDateRange) {
      const { start, end } = filters.dueDateRange;
      if (task.dueDate) {
        const dueDate = new Date(task.dueDate);
        if (start && dueDate < start) {
          return false;
        }
        if (end && dueDate > end) {
          return false;
        }
      } else if (start || end) {
        return false; // Task has no due date but filter requires one
      }
    }

    // Overdue filter
    if (filters.overdue !== undefined) {
      const taskIsOverdue = isTaskOverdue(task);
      if (filters.overdue !== taskIsOverdue) {
        return false;
      }
    }

    // Search filter
    if (filters.search && filters.search.trim()) {
      const searchTerm = filters.search.toLowerCase().trim();
      const searchableText = [
        task.title,
        task.description || '',
        task.assignee?.name || '',
        task.createdBy.name,
        ...(task.tags || [])
      ].join(' ').toLowerCase();
      
      if (!searchableText.includes(searchTerm)) {
        return false;
      }
    }

    return true;
  });
};

export const sortTasks = (tasks: Task[], sortOptions: TaskSortOptions): Task[] => {
  const { field, direction } = sortOptions;
  
  return [...tasks].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (field) {
      case 'createdAt':
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
        break;
      case 'dueDate':
        aValue = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
        bValue = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
        break;
      case 'priority':
        const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
        aValue = priorityOrder[a.priority];
        bValue = priorityOrder[b.priority];
        break;
      case 'status':
        const statusOrder = { 'Not Started': 1, 'In Progress': 2, 'On Hold': 3, 'Completed': 4 };
        aValue = statusOrder[a.status];
        bValue = statusOrder[b.status];
        break;
      case 'title':
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      default:
        return 0;
    }

    if (aValue < bValue) {
      return direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return direction === 'asc' ? 1 : -1;
    }
    return 0;
  });
};

export const getTaskCompletionPercentage = (task: Task): number => {
  if (task.status === 'Completed') return 100;
  if (task.status === 'Not Started') return 0;
  if (task.status === 'On Hold') return task.actualHours && task.estimatedHours 
    ? Math.min((task.actualHours / task.estimatedHours) * 100, 90) : 25;
  if (task.status === 'In Progress') return task.actualHours && task.estimatedHours 
    ? Math.min((task.actualHours / task.estimatedHours) * 100, 90) : 50;
  return 0;
};

export const generateTaskId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const validateTaskData = (task: Partial<Task>): string[] => {
  const errors: string[] = [];

  if (!task.title || task.title.trim().length === 0) {
    errors.push('Task title is required');
  }

  if (task.title && task.title.length > 200) {
    errors.push('Task title must be less than 200 characters');
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

  return errors;
};
