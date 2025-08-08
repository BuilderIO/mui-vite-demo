export type TaskStatus = 'Not Started' | 'In Progress' | 'Completed' | 'On Hold';
export type TaskPriority = 'High' | 'Medium' | 'Low';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
}

export interface TaskComment {
  id: string;
  content: string;
  author: TeamMember;
  createdAt: Date;
}

export interface TaskStatusHistory {
  id: string;
  status: TaskStatus;
  changedBy: TeamMember;
  changedAt: Date;
  comment?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignee?: TeamMember;
  dueDate?: Date;
  priority: TaskPriority;
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
  createdBy: TeamMember;
  tags: string[];
  comments: TaskComment[];
  statusHistory: TaskStatusHistory[];
  estimatedHours?: number;
  actualHours?: number;
}

export interface TaskFilters {
  status?: TaskStatus[];
  priority?: TaskPriority[];
  assignee?: string[];
  dueDate?: {
    from?: Date;
    to?: Date;
  };
  searchQuery?: string;
  tags?: string[];
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
}

export interface Notification {
  id: string;
  type: 'task_assigned' | 'task_due' | 'task_overdue' | 'task_completed' | 'task_commented';
  title: string;
  message: string;
  taskId: string;
  recipientId: string;
  createdAt: Date;
  isRead: boolean;
  actionUrl?: string;
}
