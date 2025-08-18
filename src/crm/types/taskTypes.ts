export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'in_progress' | 'completed' | 'on_hold';

export interface TeamMember {
  id: string;
  name: {
    first: string;
    last: string;
  };
  email: string;
  avatar?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  assignee?: TeamMember;
  createdBy: TeamMember;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  reminderDate?: string;
  tags?: string[];
}

export interface TaskFormData {
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  assigneeId?: string;
  dueDate?: string;
  reminderDate?: string;
  tags?: string[];
}

export interface TaskFilters {
  status?: TaskStatus[];
  priority?: TaskPriority[];
  assigneeId?: string;
  search?: string;
  dueDateFrom?: string;
  dueDateTo?: string;
}
