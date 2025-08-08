import * as React from "react";

export type TaskPriority = "high" | "medium" | "low";
export type TaskStatus = "not_started" | "in_progress" | "completed" | "on_hold";

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
  dueDate?: Date;
  priority: TaskPriority;
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
  statusHistory: {
    status: TaskStatus;
    timestamp: Date;
    changedBy: string;
  }[];
}

export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: string;
  search?: string;
  overdue?: boolean;
}

export interface TaskStats {
  total: number;
  notStarted: number;
  inProgress: number;
  completed: number;
  onHold: number;
  overdue: number;
}

interface TaskContextType {
  tasks: Task[];
  teamMembers: TeamMember[];
  filters: TaskFilters;
  stats: TaskStats;
  notifications: TaskNotification[];
  createTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt" | "statusHistory">) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  setFilters: (filters: TaskFilters) => void;
  clearFilters: () => void;
  markNotificationRead: (id: string) => void;
  getFilteredTasks: () => Task[];
}

export interface TaskNotification {
  id: string;
  taskId: string;
  type: "due_soon" | "overdue" | "assigned";
  message: string;
  read: boolean;
  createdAt: Date;
}

const TaskContext = React.createContext<TaskContextType | undefined>(undefined);

// Sample team members
const sampleTeamMembers: TeamMember[] = [
  { id: "1", name: "Alex Thompson", email: "alex@acmecrm.com", avatar: "AT" },
  { id: "2", name: "Sarah Johnson", email: "sarah@acmecrm.com", avatar: "SJ" },
  { id: "3", name: "Mike Chen", email: "mike@acmecrm.com", avatar: "MC" },
  { id: "4", name: "Emily Davis", email: "emily@acmecrm.com", avatar: "ED" },
  { id: "5", name: "David Wilson", email: "david@acmecrm.com", avatar: "DW" },
];

// Sample tasks data
const sampleTasks: Task[] = [
  {
    id: "1",
    title: "Follow up with TechSolutions Inc on cloud proposal",
    description: "Need to discuss pricing and implementation timeline",
    assigneeId: "1",
    assignee: sampleTeamMembers[0],
    dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    priority: "high",
    status: "in_progress",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    statusHistory: [
      {
        status: "not_started",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        changedBy: "Alex Thompson",
      },
      {
        status: "in_progress",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        changedBy: "Alex Thompson",
      },
    ],
  },
  {
    id: "2",
    title: "Prepare presentation for Global Media website project",
    description: "Create slides for project kickoff meeting",
    assigneeId: "2",
    assignee: sampleTeamMembers[1],
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    priority: "medium",
    status: "not_started",
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    statusHistory: [
      {
        status: "not_started",
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
        changedBy: "Sarah Johnson",
      },
    ],
  },
  {
    id: "3",
    title: "Call HealthCare Pro about contract details",
    description: "Clarify terms and conditions for the new contract",
    assigneeId: "3",
    assignee: sampleTeamMembers[2],
    dueDate: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago (overdue)
    priority: "high",
    status: "not_started",
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
    statusHistory: [
      {
        status: "not_started",
        timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
        changedBy: "Mike Chen",
      },
    ],
  },
  {
    id: "4",
    title: "Update CRM implementation timeline for RetailGiant",
    description: "Revise project milestones based on client feedback",
    assigneeId: "1",
    assignee: sampleTeamMembers[0],
    dueDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
    priority: "medium",
    status: "completed",
    createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    statusHistory: [
      {
        status: "not_started",
        timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000),
        changedBy: "Alex Thompson",
      },
      {
        status: "in_progress",
        timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
        changedBy: "Alex Thompson",
      },
      {
        status: "completed",
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        changedBy: "Alex Thompson",
      },
    ],
  },
  {
    id: "5",
    title: "Send proposal documents to Acme Corp",
    description: "Include all technical specifications and pricing",
    assigneeId: "4",
    assignee: sampleTeamMembers[3],
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Next week
    priority: "low",
    status: "not_started",
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    statusHistory: [
      {
        status: "not_started",
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        changedBy: "Emily Davis",
      },
    ],
  },
];

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = React.useState<Task[]>(sampleTasks);
  const [filters, setFiltersState] = React.useState<TaskFilters>({});
  const [notifications, setNotifications] = React.useState<TaskNotification[]>([]);

  // Calculate stats
  const stats = React.useMemo((): TaskStats => {
    const now = new Date();
    const overdueTasks = tasks.filter(
      (task) => task.dueDate && task.dueDate < now && task.status !== "completed"
    );

    return {
      total: tasks.length,
      notStarted: tasks.filter((task) => task.status === "not_started").length,
      inProgress: tasks.filter((task) => task.status === "in_progress").length,
      completed: tasks.filter((task) => task.status === "completed").length,
      onHold: tasks.filter((task) => task.status === "on_hold").length,
      overdue: overdueTasks.length,
    };
  }, [tasks]);

  // Generate notifications for due tasks
  React.useEffect(() => {
    const now = new Date();
    const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const newNotifications: TaskNotification[] = [];

    tasks.forEach((task) => {
      if (!task.dueDate || task.status === "completed") return;

      // Overdue tasks
      if (task.dueDate < now) {
        newNotifications.push({
          id: `overdue-${task.id}`,
          taskId: task.id,
          type: "overdue",
          message: `Task "${task.title}" is overdue`,
          read: false,
          createdAt: now,
        });
      }
      // Due soon tasks (within 24 hours)
      else if (task.dueDate <= in24Hours) {
        newNotifications.push({
          id: `due-soon-${task.id}`,
          taskId: task.id,
          type: "due_soon",
          message: `Task "${task.title}" is due soon`,
          read: false,
          createdAt: now,
        });
      }
    });

    setNotifications(newNotifications);
  }, [tasks]);

  const createTask = (taskData: Omit<Task, "id" | "createdAt" | "updatedAt" | "statusHistory">) => {
    const now = new Date();
    const assignee = taskData.assigneeId 
      ? sampleTeamMembers.find(member => member.id === taskData.assigneeId)
      : undefined;

    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      assignee,
      createdAt: now,
      updatedAt: now,
      statusHistory: [
        {
          status: taskData.status,
          timestamp: now,
          changedBy: "Alex Thompson", // Current user
        },
      ],
    };

    setTasks((prev) => [newTask, ...prev]);

    // Create assignment notification
    if (taskData.assigneeId && assignee) {
      const assignmentNotification: TaskNotification = {
        id: `assigned-${newTask.id}`,
        taskId: newTask.id,
        type: "assigned",
        message: `You have been assigned to task "${newTask.title}"`,
        read: false,
        createdAt: now,
      };
      setNotifications((prev) => [assignmentNotification, ...prev]);
    }
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== id) return task;

        const updatedTask = { ...task, ...updates, updatedAt: new Date() };
        
        // Update assignee object if assigneeId changed
        if (updates.assigneeId !== undefined) {
          updatedTask.assignee = updates.assigneeId 
            ? sampleTeamMembers.find(member => member.id === updates.assigneeId)
            : undefined;
        }

        return updatedTask;
      })
    );
  };

  const updateTaskStatus = (id: string, status: TaskStatus) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== id) return task;

        const now = new Date();
        return {
          ...task,
          status,
          updatedAt: now,
          statusHistory: [
            ...task.statusHistory,
            {
              status,
              timestamp: now,
              changedBy: "Alex Thompson", // Current user
            },
          ],
        };
      })
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
    setNotifications((prev) => prev.filter((notification) => notification.taskId !== id));
  };

  const setFilters = (newFilters: TaskFilters) => {
    setFiltersState(newFilters);
  };

  const clearFilters = () => {
    setFiltersState({});
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const getFilteredTasks = (): Task[] => {
    return tasks.filter((task) => {
      // Status filter
      if (filters.status && task.status !== filters.status) return false;

      // Priority filter
      if (filters.priority && task.priority !== filters.priority) return false;

      // Assignee filter
      if (filters.assigneeId && task.assigneeId !== filters.assigneeId) return false;

      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const titleMatch = task.title.toLowerCase().includes(searchLower);
        const descriptionMatch = task.description?.toLowerCase().includes(searchLower);
        if (!titleMatch && !descriptionMatch) return false;
      }

      // Overdue filter
      if (filters.overdue) {
        const now = new Date();
        const isOverdue = task.dueDate && task.dueDate < now && task.status !== "completed";
        if (!isOverdue) return false;
      }

      return true;
    });
  };

  const value: TaskContextType = {
    tasks,
    teamMembers: sampleTeamMembers,
    filters,
    stats,
    notifications,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    setFilters,
    clearFilters,
    markNotificationRead,
    getFilteredTasks,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTaskContext() {
  const context = React.useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }
  return context;
}
