export type TaskPriority = 'High' | 'Medium' | 'Low';
export type TaskStatus = 'Not Started' | 'In Progress' | 'Completed' | 'On Hold';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}

export interface TaskStatusChange {
  id: string;
  status: TaskStatus;
  changedBy: string;
  changedAt: Date;
  notes?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  assignee?: TeamMember;
  assigneeId?: string;
  createdBy: TeamMember;
  createdById: string;
  dueDate?: Date;
  priority: TaskPriority;
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
  statusHistory: TaskStatusChange[];
  tags?: string[];
  estimatedHours?: number;
  actualHours?: number;
}

export interface TaskFilters {
  status?: TaskStatus[];
  priority?: TaskPriority[];
  assigneeId?: string[];
  dueDateRange?: {
    start?: Date;
    end?: Date;
  };
  overdue?: boolean;
  search?: string;
}

export interface TaskSortOptions {
  field: 'createdAt' | 'dueDate' | 'priority' | 'status' | 'title';
  direction: 'asc' | 'desc';
}

export interface TaskSummary {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  overdueTasks: number;
  tasksByPriority: Record<TaskPriority, number>;
  tasksByStatus: Record<TaskStatus, number>;
  completionRate: number;
}

export interface Notification {
  id: string;
  type: 'task_assigned' | 'task_due_soon' | 'task_overdue' | 'task_completed';
  title: string;
  message: string;
  taskId: string;
  userId: string;
  createdAt: Date;
  read: boolean;
  actionUrl?: string;
}
