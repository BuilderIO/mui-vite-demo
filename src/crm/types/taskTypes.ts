export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  isActive: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assigneeId: string;
  assignee: TeamMember;
  priority: Priority;
  status: TaskStatus;
  dueDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  tags?: string[];
  completedAt?: Date;
  estimatedHours?: number;
  actualHours?: number;
}

export type Priority = "High" | "Medium" | "Low";

export type TaskStatus = "Not Started" | "In Progress" | "Completed" | "On Hold";

export interface TaskStatusHistory {
  id: string;
  taskId: string;
  fromStatus: TaskStatus;
  toStatus: TaskStatus;
  changedBy: string;
  changedAt: Date;
  notes?: string;
}

export interface TaskFormData {
  title: string;
  description: string;
  assigneeId: string;
  priority: Priority;
  dueDate: Date | null;
  tags: string[];
  estimatedHours?: number;
}

export interface TaskFilters {
  status?: TaskStatus[];
  priority?: Priority[];
  assigneeId?: string[];
  dueDateRange?: {
    start: Date | null;
    end: Date | null;
  };
  overdue?: boolean;
  search?: string;
}

export interface TaskSortConfig {
  field: keyof Task;
  direction: "asc" | "desc";
}

export interface TaskStats {
  total: number;
  notStarted: number;
  inProgress: number;
  completed: number;
  onHold: number;
  overdue: number;
  completionRate: number;
  averageCompletionTime: number;
}

export interface NotificationSettings {
  emailReminders: boolean;
  inAppNotifications: boolean;
  reminderHours: number;
  weeklyDigest: boolean;
}

export interface TaskReminder {
  id: string;
  taskId: string;
  type: "due_date" | "overdue" | "status_update";
  scheduledFor: Date;
  sent: boolean;
  sentAt?: Date;
}

export const PRIORITY_COLORS = {
  High: "#f44336",      // Red
  Medium: "#ff9800",    // Orange  
  Low: "#4caf50",       // Green
} as const;

export const STATUS_COLORS = {
  "Not Started": "#9e9e9e",    // Gray
  "In Progress": "#2196f3",    // Blue
  "Completed": "#4caf50",      // Green
  "On Hold": "#ff9800",        // Orange
} as const;

export const PRIORITY_OPTIONS: Priority[] = ["High", "Medium", "Low"];
export const STATUS_OPTIONS: TaskStatus[] = ["Not Started", "In Progress", "Completed", "On Hold"];
