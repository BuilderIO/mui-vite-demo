export type TaskPriority = 'high' | 'medium' | 'low';
export type TaskStatus = 'not_started' | 'in_progress' | 'completed' | 'on_hold';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  assigneeId?: string;
  assignee?: TeamMember;
  dueDate?: string;
  priority: TaskPriority;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  statusHistory: TaskStatusChange[];
}

export interface TaskStatusChange {
  id: string;
  taskId: string;
  fromStatus: TaskStatus | null;
  toStatus: TaskStatus;
  changedBy: string;
  changedAt: string;
  comment?: string;
}

export interface Notification {
  id: string;
  type: 'task_assigned' | 'task_due_soon' | 'task_overdue' | 'task_completed';
  taskId: string;
  recipientId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface TaskFilters {
  status?: TaskStatus[];
  priority?: TaskPriority[];
  assigneeId?: string[];
  dueDateFrom?: string;
  dueDateTo?: string;
  search?: string;
}

export interface TaskStats {
  total: number;
  notStarted: number;
  inProgress: number;
  completed: number;
  onHold: number;
  overdue: number;
  dueSoon: number;
  byPriority: {
    high: number;
    medium: number;
    low: number;
  };
  completionRate: number;
}
