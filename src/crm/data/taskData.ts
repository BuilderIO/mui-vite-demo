import { Task, TeamMember, TaskStatus, TaskPriority, Notification, TaskStats } from '../types/taskTypes';

export const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Alex Thompson',
    email: 'alex@acmecrm.com',
    avatar: '/static/images/avatar/7.jpg'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@acmecrm.com',
    avatar: '/static/images/avatar/2.jpg'
  },
  {
    id: '3',
    name: 'Michael Chen',
    email: 'michael@acmecrm.com',
    avatar: '/static/images/avatar/3.jpg'
  },
  {
    id: '4',
    name: 'Emily Rodriguez',
    email: 'emily@acmecrm.com',
    avatar: '/static/images/avatar/4.jpg'
  },
  {
    id: '5',
    name: 'David Wilson',
    email: 'david@acmecrm.com',
    avatar: '/static/images/avatar/5.jpg'
  },
  {
    id: '6',
    name: 'Lisa Anderson',
    email: 'lisa@acmecrm.com',
    avatar: '/static/images/avatar/6.jpg'
  }
];

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Review Q4 Sales Performance',
    description: 'Analyze sales metrics and prepare quarterly report for stakeholders.',
    assigneeId: '1',
    assignee: mockTeamMembers[0],
    dueDate: '2024-01-15',
    priority: 'high',
    status: 'in_progress',
    createdAt: '2024-01-05T10:00:00Z',
    updatedAt: '2024-01-08T14:30:00Z',
    createdBy: '2',
    statusHistory: [
      {
        id: 'sh1',
        taskId: '1',
        fromStatus: null,
        toStatus: 'not_started',
        changedBy: '2',
        changedAt: '2024-01-05T10:00:00Z'
      },
      {
        id: 'sh2',
        taskId: '1',
        fromStatus: 'not_started',
        toStatus: 'in_progress',
        changedBy: '1',
        changedAt: '2024-01-08T14:30:00Z'
      }
    ]
  },
  {
    id: '2',
    title: 'Update Customer Database',
    description: 'Clean up customer records and update contact information.',
    assigneeId: '3',
    assignee: mockTeamMembers[2],
    dueDate: '2024-01-20',
    priority: 'medium',
    status: 'not_started',
    createdAt: '2024-01-10T09:15:00Z',
    updatedAt: '2024-01-10T09:15:00Z',
    createdBy: '1',
    statusHistory: [
      {
        id: 'sh3',
        taskId: '2',
        fromStatus: null,
        toStatus: 'not_started',
        changedBy: '1',
        changedAt: '2024-01-10T09:15:00Z'
      }
    ]
  },
  {
    id: '3',
    title: 'Prepare Client Presentation',
    description: 'Create presentation slides for the ABC Corp proposal meeting.',
    assigneeId: '2',
    assignee: mockTeamMembers[1],
    dueDate: '2024-01-12',
    priority: 'high',
    status: 'overdue',
    createdAt: '2024-01-03T16:45:00Z',
    updatedAt: '2024-01-03T16:45:00Z',
    createdBy: '1',
    statusHistory: [
      {
        id: 'sh4',
        taskId: '3',
        fromStatus: null,
        toStatus: 'not_started',
        changedBy: '1',
        changedAt: '2024-01-03T16:45:00Z'
      }
    ]
  },
  {
    id: '4',
    title: 'Follow up with Warm Leads',
    description: 'Contact and qualify leads from last weeks marketing campaign.',
    assigneeId: '4',
    assignee: mockTeamMembers[3],
    dueDate: '2024-01-25',
    priority: 'medium',
    status: 'in_progress',
    createdAt: '2024-01-12T11:20:00Z',
    updatedAt: '2024-01-13T08:45:00Z',
    createdBy: '2',
    statusHistory: [
      {
        id: 'sh5',
        taskId: '4',
        fromStatus: null,
        toStatus: 'not_started',
        changedBy: '2',
        changedAt: '2024-01-12T11:20:00Z'
      },
      {
        id: 'sh6',
        taskId: '4',
        fromStatus: 'not_started',
        toStatus: 'in_progress',
        changedBy: '4',
        changedAt: '2024-01-13T08:45:00Z'
      }
    ]
  },
  {
    id: '5',
    title: 'Setup New CRM Integration',
    description: 'Configure integration with the new email marketing platform.',
    assigneeId: '5',
    assignee: mockTeamMembers[4],
    dueDate: '2024-02-01',
    priority: 'low',
    status: 'not_started',
    createdAt: '2024-01-14T13:30:00Z',
    updatedAt: '2024-01-14T13:30:00Z',
    createdBy: '1',
    statusHistory: [
      {
        id: 'sh7',
        taskId: '5',
        fromStatus: null,
        toStatus: 'not_started',
        changedBy: '1',
        changedAt: '2024-01-14T13:30:00Z'
      }
    ]
  },
  {
    id: '6',
    title: 'Conduct Team Training',
    description: 'Organize training session on new sales processes and tools.',
    assigneeId: '6',
    assignee: mockTeamMembers[5],
    dueDate: '2024-01-30',
    priority: 'medium',
    status: 'completed',
    createdAt: '2024-01-01T08:00:00Z',
    updatedAt: '2024-01-15T17:00:00Z',
    createdBy: '1',
    statusHistory: [
      {
        id: 'sh8',
        taskId: '6',
        fromStatus: null,
        toStatus: 'not_started',
        changedBy: '1',
        changedAt: '2024-01-01T08:00:00Z'
      },
      {
        id: 'sh9',
        taskId: '6',
        fromStatus: 'not_started',
        toStatus: 'in_progress',
        changedBy: '6',
        changedAt: '2024-01-10T09:00:00Z'
      },
      {
        id: 'sh10',
        taskId: '6',
        fromStatus: 'in_progress',
        toStatus: 'completed',
        changedBy: '6',
        changedAt: '2024-01-15T17:00:00Z'
      }
    ]
  }
];

export const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'task_overdue',
    taskId: '3',
    recipientId: '2',
    title: 'Task Overdue',
    message: 'Your task "Prepare Client Presentation" is overdue.',
    read: false,
    createdAt: '2024-01-13T09:00:00Z'
  },
  {
    id: '2',
    type: 'task_due_soon',
    taskId: '1',
    recipientId: '1',
    title: 'Task Due Soon',
    message: 'Your task "Review Q4 Sales Performance" is due in 24 hours.',
    read: false,
    createdAt: '2024-01-14T09:00:00Z'
  },
  {
    id: '3',
    type: 'task_assigned',
    taskId: '2',
    recipientId: '3',
    title: 'New Task Assigned',
    message: 'You have been assigned a new task: "Update Customer Database".',
    read: true,
    createdAt: '2024-01-10T09:15:00Z'
  }
];

export const getPriorityColor = (priority: TaskPriority): string => {
  switch (priority) {
    case 'high':
      return '#f44336'; // red
    case 'medium':
      return '#ff9800'; // orange
    case 'low':
      return '#4caf50'; // green
    default:
      return '#757575'; // gray
  }
};

export const getStatusColor = (status: TaskStatus): string => {
  switch (status) {
    case 'not_started':
      return '#757575'; // gray
    case 'in_progress':
      return '#2196f3'; // blue
    case 'completed':
      return '#4caf50'; // green
    case 'on_hold':
      return '#ff9800'; // orange
    default:
      return '#757575'; // gray
  }
};

export const isTaskOverdue = (task: Task): boolean => {
  if (!task.dueDate) return false;
  const today = new Date();
  const dueDate = new Date(task.dueDate);
  return dueDate < today && task.status !== 'completed';
};

export const isTaskDueSoon = (task: Task): boolean => {
  if (!task.dueDate) return false;
  const today = new Date();
  const dueDate = new Date(task.dueDate);
  const timeDiff = dueDate.getTime() - today.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
  return daysDiff <= 1 && daysDiff >= 0 && task.status !== 'completed';
};

export const calculateTaskStats = (tasks: Task[]): TaskStats => {
  const stats: TaskStats = {
    total: tasks.length,
    notStarted: 0,
    inProgress: 0,
    completed: 0,
    onHold: 0,
    overdue: 0,
    dueSoon: 0,
    byPriority: {
      high: 0,
      medium: 0,
      low: 0,
    },
    completionRate: 0,
  };

  tasks.forEach(task => {
    // Count by status
    switch (task.status) {
      case 'not_started':
        stats.notStarted++;
        break;
      case 'in_progress':
        stats.inProgress++;
        break;
      case 'completed':
        stats.completed++;
        break;
      case 'on_hold':
        stats.onHold++;
        break;
    }

    // Count by priority
    stats.byPriority[task.priority]++;

    // Count overdue and due soon
    if (isTaskOverdue(task)) {
      stats.overdue++;
    } else if (isTaskDueSoon(task)) {
      stats.dueSoon++;
    }
  });

  stats.completionRate = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;

  return stats;
};

export const formatTaskStatus = (status: TaskStatus): string => {
  switch (status) {
    case 'not_started':
      return 'Not Started';
    case 'in_progress':
      return 'In Progress';
    case 'completed':
      return 'Completed';
    case 'on_hold':
      return 'On Hold';
    default:
      return status;
  }
};

export const formatTaskPriority = (priority: TaskPriority): string => {
  return priority.charAt(0).toUpperCase() + priority.slice(1);
};
