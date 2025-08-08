import { Task, TaskFilters, TaskSortConfig, TaskStats, Priority, TaskStatus } from "../types/taskTypes";

export const filterTasks = (tasks: Task[], filters: TaskFilters): Task[] => {
  return tasks.filter(task => {
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
      if (!filters.assigneeId.includes(task.assigneeId)) return false;
    }

    // Due date range filter
    if (filters.dueDateRange) {
      const { start, end } = filters.dueDateRange;
      if (start && task.dueDate && task.dueDate < start) return false;
      if (end && task.dueDate && task.dueDate > end) return false;
    }

    // Overdue filter
    if (filters.overdue === true) {
      if (!isTaskOverdue(task)) return false;
    } else if (filters.overdue === false) {
      if (isTaskOverdue(task)) return false;
    }

    // Search filter
    if (filters.search && filters.search.trim()) {
      const searchLower = filters.search.toLowerCase();
      const titleMatch = task.title.toLowerCase().includes(searchLower);
      const descriptionMatch = task.description.toLowerCase().includes(searchLower);
      const assigneeMatch = task.assignee.name.toLowerCase().includes(searchLower);
      const tagsMatch = task.tags?.some(tag => tag.toLowerCase().includes(searchLower));
      
      if (!titleMatch && !descriptionMatch && !assigneeMatch && !tagsMatch) {
        return false;
      }
    }

    return true;
  });
};

export const sortTasks = (tasks: Task[], sortConfig: TaskSortConfig): Task[] => {
  const { field, direction } = sortConfig;
  
  return [...tasks].sort((a, b) => {
    let aValue = a[field];
    let bValue = b[field];

    // Handle nested properties
    if (field === 'assignee') {
      aValue = a.assignee.name;
      bValue = b.assignee.name;
    }

    // Handle date values
    if (aValue instanceof Date && bValue instanceof Date) {
      return direction === 'asc' 
        ? aValue.getTime() - bValue.getTime()
        : bValue.getTime() - aValue.getTime();
    }

    // Handle null/undefined values
    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return direction === 'asc' ? 1 : -1;
    if (bValue == null) return direction === 'asc' ? -1 : 1;

    // Handle string values
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return direction === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    // Handle priority ordering
    if (field === 'priority') {
      const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
      const aPriority = priorityOrder[aValue as Priority];
      const bPriority = priorityOrder[bValue as Priority];
      return direction === 'asc' 
        ? aPriority - bPriority
        : bPriority - aPriority;
    }

    // Handle status ordering
    if (field === 'status') {
      const statusOrder = { 'Not Started': 1, 'In Progress': 2, 'On Hold': 3, 'Completed': 4 };
      const aStatus = statusOrder[aValue as TaskStatus];
      const bStatus = statusOrder[bValue as TaskStatus];
      return direction === 'asc' 
        ? aStatus - bStatus
        : bStatus - aStatus;
    }

    // Default comparison
    return direction === 'asc' 
      ? (aValue > bValue ? 1 : -1)
      : (bValue > aValue ? 1 : -1);
  });
};

export const calculateTaskStats = (tasks: Task[]): TaskStats => {
  const total = tasks.length;
  const notStarted = tasks.filter(t => t.status === 'Not Started').length;
  const inProgress = tasks.filter(t => t.status === 'In Progress').length;
  const completed = tasks.filter(t => t.status === 'Completed').length;
  const onHold = tasks.filter(t => t.status === 'On Hold').length;
  const overdue = tasks.filter(t => isTaskOverdue(t)).length;
  
  const completionRate = total > 0 ? (completed / total) * 100 : 0;
  
  // Calculate average completion time for completed tasks
  const completedTasks = tasks.filter(t => t.status === 'Completed' && t.completedAt);
  const avgCompletionTime = completedTasks.length > 0 
    ? completedTasks.reduce((sum, task) => {
        const completionTime = task.completedAt!.getTime() - task.createdAt.getTime();
        return sum + completionTime;
      }, 0) / completedTasks.length / (1000 * 60 * 60 * 24) // Convert to days
    : 0;

  return {
    total,
    notStarted,
    inProgress,
    completed,
    onHold,
    overdue,
    completionRate,
    averageCompletionTime: Math.round(avgCompletionTime * 10) / 10, // Round to 1 decimal
  };
};

export const isTaskOverdue = (task: Task): boolean => {
  if (!task.dueDate || task.status === 'Completed') return false;
  return task.dueDate < new Date();
};

export const getDaysUntilDue = (task: Task): number | null => {
  if (!task.dueDate) return null;
  const now = new Date();
  const timeDiff = task.dueDate.getTime() - now.getTime();
  return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
};

export const formatDueDate = (dueDate: Date | null): string => {
  if (!dueDate) return 'No due date';
  
  const now = new Date();
  const diffInDays = getDaysUntilDue({ dueDate } as Task);
  
  if (diffInDays === null) return 'No due date';
  if (diffInDays < 0) return `Overdue by ${Math.abs(diffInDays)} day${Math.abs(diffInDays) === 1 ? '' : 's'}`;
  if (diffInDays === 0) return 'Due today';
  if (diffInDays === 1) return 'Due tomorrow';
  if (diffInDays <= 7) return `Due in ${diffInDays} days`;
  
  return dueDate.toLocaleDateString();
};

export const getPriorityColor = (priority: Priority): string => {
  const colors = {
    'High': '#f44336',
    'Medium': '#ff9800',
    'Low': '#4caf50',
  };
  return colors[priority];
};

export const getStatusColor = (status: TaskStatus): string => {
  const colors = {
    'Not Started': '#9e9e9e',
    'In Progress': '#2196f3',
    'Completed': '#4caf50',
    'On Hold': '#ff9800',
  };
  return colors[status];
};

export const generateTaskId = (): string => {
  return `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const validateTaskForm = (formData: Partial<Task>): string[] => {
  const errors: string[] = [];

  if (!formData.title?.trim()) {
    errors.push('Task title is required');
  }

  if (!formData.assigneeId) {
    errors.push('Assignee is required');
  }

  if (!formData.priority) {
    errors.push('Priority is required');
  }

  if (formData.dueDate && formData.dueDate < new Date()) {
    errors.push('Due date cannot be in the past');
  }

  if (formData.estimatedHours && formData.estimatedHours <= 0) {
    errors.push('Estimated hours must be positive');
  }

  return errors;
};

export const getTasksForUser = (tasks: Task[], userId: string): Task[] => {
  return tasks.filter(task => task.assigneeId === userId);
};

export const getUpcomingDeadlines = (tasks: Task[], daysAhead: number = 7): Task[] => {
  const now = new Date();
  const futureDate = new Date(now.getTime() + (daysAhead * 24 * 60 * 60 * 1000));
  
  return tasks.filter(task => 
    task.dueDate && 
    task.dueDate >= now && 
    task.dueDate <= futureDate &&
    task.status !== 'Completed'
  );
};

export const groupTasksByStatus = (tasks: Task[]): Record<TaskStatus, Task[]> => {
  return tasks.reduce((groups, task) => {
    if (!groups[task.status]) {
      groups[task.status] = [];
    }
    groups[task.status].push(task);
    return groups;
  }, {} as Record<TaskStatus, Task[]>);
};

export const groupTasksByPriority = (tasks: Task[]): Record<Priority, Task[]> => {
  return tasks.reduce((groups, task) => {
    if (!groups[task.priority]) {
      groups[task.priority] = [];
    }
    groups[task.priority].push(task);
    return groups;
  }, {} as Record<Priority, Task[]>);
};
