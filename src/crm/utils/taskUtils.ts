import { Task, TaskMetrics } from "../types/tasks";

export const getPriorityColor = (priority: "high" | "medium" | "low") => {
  switch (priority) {
    case "high":
      return "error";
    case "medium":
      return "warning";
    case "low":
      return "default";
    default:
      return "default";
  }
};

export const getStatusColor = (status: "todo" | "in_progress" | "completed" | "on_hold") => {
  switch (status) {
    case "todo":
      return "default";
    case "in_progress":
      return "info";
    case "completed":
      return "success";
    case "on_hold":
      return "warning";
    default:
      return "default";
  }
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return "Today";
  } else if (diffDays === 1) {
    return "Tomorrow";
  } else if (diffDays === -1) {
    return "Yesterday";
  } else if (diffDays > 0) {
    return `In ${diffDays} days`;
  } else {
    return `${Math.abs(diffDays)} days ago`;
  }
};

export const formatDateDetailed = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const isOverdue = (dueDate: string): boolean => {
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return new Date(dueDate) < today;
};

export const isDueToday = (dueDate: string): boolean => {
  const today = new Date();
  const due = new Date(dueDate);
  return (
    today.getFullYear() === due.getFullYear() &&
    today.getMonth() === due.getMonth() &&
    today.getDate() === due.getDate()
  );
};

export const calculateTaskMetrics = (tasks: Task[]): TaskMetrics => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  return {
    total: tasks.length,
    completed: tasks.filter(task => task.status === "completed").length,
    overdue: tasks.filter(task => 
      task.dueDate && isOverdue(task.dueDate) && task.status !== "completed"
    ).length,
    dueToday: tasks.filter(task => 
      task.dueDate && isDueToday(task.dueDate) && task.status !== "completed"
    ).length,
    inProgress: tasks.filter(task => task.status === "in_progress").length,
    onHold: tasks.filter(task => task.status === "on_hold").length,
  };
};

export const sortTasks = (tasks: Task[], sortBy: string): Task[] => {
  return [...tasks].sort((a, b) => {
    switch (sortBy) {
      case "title":
        return a.title.localeCompare(b.title);
      case "priority":
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      case "dueDate":
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      case "status":
        return a.status.localeCompare(b.status);
      case "assignee":
        const aName = a.assignee ? `${a.assignee.name.first} ${a.assignee.name.last}` : "";
        const bName = b.assignee ? `${b.assignee.name.first} ${b.assignee.name.last}` : "";
        return aName.localeCompare(bName);
      default:
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    }
  });
};

export const filterTasks = (tasks: Task[], filters: any): Task[] => {
  return tasks.filter(task => {
    if (filters.status && task.status !== filters.status) return false;
    if (filters.priority && task.priority !== filters.priority) return false;
    if (filters.assignee && task.assignee?.login.uuid !== filters.assignee) return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const titleMatch = task.title.toLowerCase().includes(searchLower);
      const descMatch = task.description?.toLowerCase().includes(searchLower) || false;
      const assigneeMatch = task.assignee ? 
        `${task.assignee.name.first} ${task.assignee.name.last}`.toLowerCase().includes(searchLower) : false;
      if (!titleMatch && !descMatch && !assigneeMatch) return false;
    }
    return true;
  });
};

export const getInitials = (firstName: string, lastName: string): string => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};
