export interface User {
  login: {
    uuid: string;
    username: string;
  };
  name: {
    title: string;
    first: string;
    last: string;
  };
  email: string;
  picture?: {
    large: string;
    medium: string;
    thumbnail: string;
  };
}

export interface Task {
  id: string | number;
  title: string;
  description?: string;
  completed: boolean;
  priority: "high" | "medium" | "low";
  status: "todo" | "in_progress" | "completed" | "on_hold";
  dueDate?: string;
  assignee?: User;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TaskFormData {
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  status: "todo" | "in_progress" | "completed" | "on_hold";
  dueDate: string;
  assigneeId: string;
  tags: string[];
}

export interface TaskFilters {
  status?: string;
  priority?: string;
  assignee?: string;
  search?: string;
  dueDateRange?: {
    start?: string;
    end?: string;
  };
}

export interface TaskMetrics {
  total: number;
  completed: number;
  overdue: number;
  dueToday: number;
  inProgress: number;
  onHold: number;
}
