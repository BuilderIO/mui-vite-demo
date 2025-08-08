export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export type TaskPriority = 'High' | 'Medium' | 'Low';
export type TaskStatus = 'Not Started' | 'In Progress' | 'Completed' | 'On Hold';

export interface Task {
  id: string;
  title: string;
  description: string;
  assigneeId: string;
  assigneeName: string;
  dueDate: Date | null;
  priority: TaskPriority;
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
  statusHistory: StatusHistoryEntry[];
}

export interface StatusHistoryEntry {
  status: TaskStatus;
  timestamp: Date;
  changedBy: string;
}

export interface TaskFilters {
  status?: TaskStatus[];
  priority?: TaskPriority[];
  assignee?: string[];
  overdue?: boolean;
  dueDateRange?: {
    start: Date | null;
    end: Date | null;
  };
  searchQuery?: string;
}

export interface TaskSortOptions {
  field: 'createdAt' | 'dueDate' | 'priority' | 'title' | 'status';
  direction: 'asc' | 'desc';
}

export interface TaskStats {
  total: number;
  notStarted: number;
  inProgress: number;
  completed: number;
  onHold: number;
  overdue: number;
  dueToday: number;
  dueTomorrow: number;
  completionRate: number;
}

export interface Notification {
  id: string;
  taskId: string;
  type: 'reminder' | 'assignment' | 'status_change';
  title: string;
  message: string;
  createdAt: Date;
  read: boolean;
}
