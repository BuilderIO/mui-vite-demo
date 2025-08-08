import { TaskPriority, TaskStatus, Task } from "../contexts/TaskContext";

export const getPriorityColor = (
  priority: TaskPriority
): "error" | "warning" | "success" => {
  switch (priority) {
    case "high":
      return "error";
    case "medium":
      return "warning";
    case "low":
      return "success";
    default:
      return "warning";
  }
};

export const getStatusColor = (
  status: TaskStatus
): "default" | "primary" | "success" | "warning" => {
  switch (status) {
    case "not_started":
      return "default";
    case "in_progress":
      return "primary";
    case "completed":
      return "success";
    case "on_hold":
      return "warning";
    default:
      return "default";
  }
};

export const getPriorityLabel = (priority: TaskPriority): string => {
  switch (priority) {
    case "high":
      return "High";
    case "medium":
      return "Medium";
    case "low":
      return "Low";
    default:
      return "Medium";
  }
};

export const getStatusLabel = (status: TaskStatus): string => {
  switch (status) {
    case "not_started":
      return "Not Started";
    case "in_progress":
      return "In Progress";
    case "completed":
      return "Completed";
    case "on_hold":
      return "On Hold";
    default:
      return "Not Started";
  }
};

export const isTaskOverdue = (task: Task): boolean => {
  if (!task.dueDate || task.status === "completed") return false;
  return task.dueDate < new Date();
};

export const isTaskDueSoon = (task: Task, hoursThreshold: number = 24): boolean => {
  if (!task.dueDate || task.status === "completed") return false;
  const now = new Date();
  const threshold = new Date(now.getTime() + hoursThreshold * 60 * 60 * 1000);
  return task.dueDate <= threshold && task.dueDate > now;
};

export const formatDueDate = (dueDate: Date): string => {
  const now = new Date();
  const diffMs = dueDate.getTime() - now.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffMs < 0) {
    // Overdue
    const overdueDays = Math.abs(diffDays);
    const overdueHours = Math.abs(diffHours);
    
    if (overdueDays > 0) {
      return `${overdueDays} day${overdueDays === 1 ? "" : "s"} overdue`;
    } else if (overdueHours > 0) {
      return `${overdueHours} hour${overdueHours === 1 ? "" : "s"} overdue`;
    } else {
      return "Overdue";
    }
  } else if (diffDays === 0 && diffHours < 24) {
    // Due today
    if (diffHours <= 0) {
      if (diffMinutes <= 0) {
        return "Due now";
      }
      return `Due in ${diffMinutes} minute${diffMinutes === 1 ? "" : "s"}`;
    }
    return `Due in ${diffHours} hour${diffHours === 1 ? "" : "s"}`;
  } else if (diffDays === 1) {
    return "Due tomorrow";
  } else if (diffDays < 7) {
    return `Due in ${diffDays} days`;
  } else {
    // Format as date
    return dueDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: dueDate.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  }
};

export const sortTasks = (tasks: Task[], sortBy: string, sortOrder: "asc" | "desc"): Task[] => {
  return [...tasks].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case "title":
        comparison = a.title.localeCompare(b.title);
        break;
      case "priority":
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
        break;
      case "status":
        const statusOrder = { not_started: 1, in_progress: 2, on_hold: 3, completed: 4 };
        comparison = statusOrder[a.status] - statusOrder[b.status];
        break;
      case "dueDate":
        if (!a.dueDate && !b.dueDate) comparison = 0;
        else if (!a.dueDate) comparison = 1;
        else if (!b.dueDate) comparison = -1;
        else comparison = a.dueDate.getTime() - b.dueDate.getTime();
        break;
      case "createdAt":
        comparison = a.createdAt.getTime() - b.createdAt.getTime();
        break;
      case "updatedAt":
        comparison = a.updatedAt.getTime() - b.updatedAt.getTime();
        break;
      case "assignee":
        const aAssignee = a.assignee?.name || "";
        const bAssignee = b.assignee?.name || "";
        comparison = aAssignee.localeCompare(bAssignee);
        break;
      default:
        comparison = 0;
    }

    return sortOrder === "desc" ? -comparison : comparison;
  });
};

export const getTaskCompletionPercentage = (tasks: Task[]): number => {
  if (tasks.length === 0) return 0;
  const completedTasks = tasks.filter((task) => task.status === "completed").length;
  return Math.round((completedTasks / tasks.length) * 100);
};

export const getWorkloadDistribution = (tasks: Task[], teamMembers: any[]) => {
  const distribution = teamMembers.map((member) => ({
    member,
    taskCount: tasks.filter((task) => task.assigneeId === member.id).length,
    completedCount: tasks.filter(
      (task) => task.assigneeId === member.id && task.status === "completed"
    ).length,
    overdueCount: tasks.filter(
      (task) => task.assigneeId === member.id && isTaskOverdue(task)
    ).length,
  }));

  return distribution;
};
