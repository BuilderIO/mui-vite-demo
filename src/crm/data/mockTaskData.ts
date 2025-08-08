import { TeamMember, Task, TaskStatusHistory, Priority, TaskStatus } from "../types/taskTypes";

export const mockTeamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Alex Thompson",
    email: "alex@acmecrm.com",
    avatar: "/static/images/avatar/7.jpg",
    role: "Product Manager",
    isActive: true,
  },
  {
    id: "2",
    name: "Sarah Chen",
    email: "sarah@acmecrm.com",
    avatar: "/static/images/avatar/1.jpg",
    role: "Senior Developer",
    isActive: true,
  },
  {
    id: "3",
    name: "Mike Rodriguez",
    email: "mike@acmecrm.com",
    avatar: "/static/images/avatar/2.jpg",
    role: "UX Designer",
    isActive: true,
  },
  {
    id: "4",
    name: "Emily Johnson",
    email: "emily@acmecrm.com",
    avatar: "/static/images/avatar/3.jpg",
    role: "QA Engineer",
    isActive: true,
  },
  {
    id: "5",
    name: "David Park",
    email: "david@acmecrm.com",
    avatar: "/static/images/avatar/4.jpg",
    role: "Developer",
    isActive: true,
  },
  {
    id: "6",
    name: "Lisa Wang",
    email: "lisa@acmecrm.com",
    avatar: "/static/images/avatar/5.jpg",
    role: "Marketing Manager",
    isActive: false,
  },
];

export const mockTasks: Task[] = [
  {
    id: "task-1",
    title: "Implement user authentication",
    description: "Add OAuth integration and secure login flow for the application. This includes setting up proper session management and token handling.",
    assigneeId: "2",
    assignee: mockTeamMembers[1],
    priority: "High" as Priority,
    status: "In Progress" as TaskStatus,
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    createdBy: "1",
    tags: ["authentication", "security", "backend"],
    estimatedHours: 16,
    actualHours: 8,
  },
  {
    id: "task-2",
    title: "Design dashboard mockups",
    description: "Create comprehensive UI/UX designs for the main dashboard including responsive layouts and dark mode variants.",
    assigneeId: "3",
    assignee: mockTeamMembers[2],
    priority: "Medium" as Priority,
    status: "Completed" as TaskStatus,
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    createdBy: "1",
    completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    tags: ["design", "ui", "mockups"],
    estimatedHours: 12,
    actualHours: 14,
  },
  {
    id: "task-3",
    title: "Fix responsive layout issues",
    description: "Address mobile layout problems on the customer management page. Ensure proper responsive behavior across all device sizes.",
    assigneeId: "2",
    assignee: mockTeamMembers[1],
    priority: "High" as Priority,
    status: "Not Started" as TaskStatus,
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago (overdue)
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    createdBy: "1",
    tags: ["frontend", "responsive", "bug"],
    estimatedHours: 6,
  },
  {
    id: "task-4",
    title: "Write API documentation",
    description: "Create comprehensive API documentation for all endpoints including examples and authentication details.",
    assigneeId: "4",
    assignee: mockTeamMembers[3],
    priority: "Low" as Priority,
    status: "In Progress" as TaskStatus,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    createdBy: "1",
    tags: ["documentation", "api", "backend"],
    estimatedHours: 8,
    actualHours: 3,
  },
  {
    id: "task-5",
    title: "Set up automated testing",
    description: "Implement unit tests and integration tests for core functionality. Set up CI/CD pipeline for automated testing.",
    assigneeId: "4",
    assignee: mockTeamMembers[3],
    priority: "Medium" as Priority,
    status: "On Hold" as TaskStatus,
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    createdBy: "1",
    tags: ["testing", "automation", "ci/cd"],
    estimatedHours: 20,
    actualHours: 5,
  },
  {
    id: "task-6",
    title: "Optimize database queries",
    description: "Improve performance of slow database queries in the reporting module. Add proper indexing and query optimization.",
    assigneeId: "5",
    assignee: mockTeamMembers[4],
    priority: "High" as Priority,
    status: "Not Started" as TaskStatus,
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    createdBy: "1",
    tags: ["backend", "performance", "database"],
    estimatedHours: 10,
  },
  {
    id: "task-7",
    title: "Create marketing materials",
    description: "Design and create marketing brochures and digital assets for the upcoming product launch.",
    assigneeId: "6",
    assignee: mockTeamMembers[5],
    priority: "Low" as Priority,
    status: "Not Started" as TaskStatus,
    dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    createdBy: "1",
    tags: ["marketing", "design", "launch"],
    estimatedHours: 15,
  },
];

export const mockTaskStatusHistory: TaskStatusHistory[] = [
  {
    id: "history-1",
    taskId: "task-1",
    fromStatus: "Not Started",
    toStatus: "In Progress",
    changedBy: "2",
    changedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    notes: "Started working on OAuth integration",
  },
  {
    id: "history-2",
    taskId: "task-2",
    fromStatus: "Not Started",
    toStatus: "In Progress",
    changedBy: "3",
    changedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
  },
  {
    id: "history-3",
    taskId: "task-2",
    fromStatus: "In Progress",
    toStatus: "Completed",
    changedBy: "3",
    changedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    notes: "All mockups completed and approved",
  },
  {
    id: "history-4",
    taskId: "task-5",
    fromStatus: "Not Started",
    toStatus: "In Progress",
    changedBy: "4",
    changedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: "history-5",
    taskId: "task-5",
    fromStatus: "In Progress",
    toStatus: "On Hold",
    changedBy: "4",
    changedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    notes: "Waiting for environment setup completion",
  },
];

// Helper functions for working with mock data
export const getTaskById = (id: string): Task | undefined => {
  return mockTasks.find(task => task.id === id);
};

export const getTasksByAssignee = (assigneeId: string): Task[] => {
  return mockTasks.filter(task => task.assigneeId === assigneeId);
};

export const getTasksByStatus = (status: TaskStatus): Task[] => {
  return mockTasks.filter(task => task.status === status);
};

export const getTasksByPriority = (priority: Priority): Task[] => {
  return mockTasks.filter(task => task.priority === priority);
};

export const getOverdueTasks = (): Task[] => {
  const now = new Date();
  return mockTasks.filter(task => 
    task.dueDate && 
    task.dueDate < now && 
    task.status !== "Completed"
  );
};

export const getTasksForReminder = (hoursBeforeDue: number = 24): Task[] => {
  const now = new Date();
  const reminderThreshold = new Date(now.getTime() + (hoursBeforeDue * 60 * 60 * 1000));
  
  return mockTasks.filter(task => 
    task.dueDate && 
    task.dueDate <= reminderThreshold && 
    task.dueDate > now &&
    task.status !== "Completed"
  );
};
