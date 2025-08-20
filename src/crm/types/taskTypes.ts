export interface TeamMember {
  id: string;
  name: {
    first: string;
    last: string;
  };
  email: string;
  picture?: {
    thumbnail: string;
  };
}

export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'in_progress' | 'completed' | 'on_hold';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  assignee?: TeamMember;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: TeamMember;
  tags?: string[];
  estimatedHours?: number;
  actualHours?: number;
  reminderDate?: string;
}

export interface TaskFilters {
  status?: TaskStatus[];
  priority?: TaskPriority[];
  assignee?: string[];
  dueDateRange?: {
    start?: string;
    end?: string;
  };
  search?: string;
}

export interface TaskSortOptions {
  field: 'dueDate' | 'priority' | 'status' | 'createdAt' | 'title';
  direction: 'asc' | 'desc';
}

export interface TaskStats {
  total: number;
  completed: number;
  inProgress: number;
  overdue: number;
  dueSoon: number;
  byPriority: {
    high: number;
    medium: number;
    low: number;
  };
  byStatus: {
    todo: number;
    in_progress: number;
    completed: number;
    on_hold: number;
  };
}

export interface TaskFormData {
  title: string;
  description?: string;
  priority: TaskPriority;
  assigneeId?: string;
  dueDate?: string;
  tags?: string[];
  estimatedHours?: number;
  reminderDate?: string;
}
