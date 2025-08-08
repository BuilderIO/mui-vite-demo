import { Task, TeamMember, TaskPriority, TaskStatus, Notification } from '../types/task';

export const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Alex Thompson',
    email: 'alex@acmecrm.com',
    avatar: '/static/images/avatar/7.jpg',
    role: 'Team Lead'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@acmecrm.com',
    avatar: '/static/images/avatar/2.jpg',
    role: 'Senior Developer'
  },
  {
    id: '3',
    name: 'Mike Chen',
    email: 'mike@acmecrm.com',
    avatar: '/static/images/avatar/3.jpg',
    role: 'Designer'
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily@acmecrm.com',
    avatar: '/static/images/avatar/4.jpg',
    role: 'Product Manager'
  },
  {
    id: '5',
    name: 'David Wilson',
    email: 'david@acmecrm.com',
    avatar: '/static/images/avatar/5.jpg',
    role: 'QA Engineer'
  }
];

const currentUser = mockTeamMembers[0]; // Alex Thompson

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Implement user authentication system',
    description: 'Create a secure login and registration system with JWT tokens and password reset functionality.',
    assignee: mockTeamMembers[1],
    assigneeId: '2',
    createdBy: currentUser,
    createdById: '1',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    priority: 'High',
    status: 'In Progress',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    statusHistory: [
      {
        id: '1',
        status: 'Not Started',
        changedBy: 'Alex Thompson',
        changedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        id: '2',
        status: 'In Progress',
        changedBy: 'Sarah Johnson',
        changedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        notes: 'Started working on the authentication logic'
      }
    ],
    tags: ['Authentication', 'Security'],
    estimatedHours: 16,
    actualHours: 8
  },
  {
    id: '2',
    title: 'Design dashboard mockups',
    description: 'Create wireframes and high-fidelity mockups for the main dashboard interface.',
    assignee: mockTeamMembers[2],
    assigneeId: '3',
    createdBy: currentUser,
    createdById: '1',
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago (overdue)
    priority: 'Medium',
    status: 'In Progress',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    statusHistory: [
      {
        id: '3',
        status: 'Not Started',
        changedBy: 'Alex Thompson',
        changedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        id: '4',
        status: 'In Progress',
        changedBy: 'Mike Chen',
        changedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      }
    ],
    tags: ['Design', 'UI/UX'],
    estimatedHours: 12,
    actualHours: 10
  },
  {
    id: '3',
    title: 'Write API documentation',
    description: 'Document all REST API endpoints with examples and response schemas.',
    assignee: mockTeamMembers[1],
    assigneeId: '2',
    createdBy: mockTeamMembers[3],
    createdById: '4',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    priority: 'Low',
    status: 'Not Started',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    statusHistory: [
      {
        id: '5',
        status: 'Not Started',
        changedBy: 'Emily Davis',
        changedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      }
    ],
    tags: ['Documentation', 'API'],
    estimatedHours: 8
  },
  {
    id: '4',
    title: 'Set up CI/CD pipeline',
    description: 'Configure automated testing and deployment pipeline using GitHub Actions.',
    assignee: mockTeamMembers[1],
    assigneeId: '2',
    createdBy: currentUser,
    createdById: '1',
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    priority: 'High',
    status: 'Not Started',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    statusHistory: [
      {
        id: '6',
        status: 'Not Started',
        changedBy: 'Alex Thompson',
        changedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      }
    ],
    tags: ['DevOps', 'Automation'],
    estimatedHours: 20
  },
  {
    id: '5',
    title: 'Test user registration flow',
    description: 'Create comprehensive test cases for the user registration and email verification process.',
    assignee: mockTeamMembers[4],
    assigneeId: '5',
    createdBy: currentUser,
    createdById: '1',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    priority: 'Medium',
    status: 'Completed',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    statusHistory: [
      {
        id: '7',
        status: 'Not Started',
        changedBy: 'Alex Thompson',
        changedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      },
      {
        id: '8',
        status: 'In Progress',
        changedBy: 'David Wilson',
        changedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      },
      {
        id: '9',
        status: 'Completed',
        changedBy: 'David Wilson',
        changedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        notes: 'All test cases passed successfully'
      }
    ],
    tags: ['Testing', 'QA'],
    estimatedHours: 6,
    actualHours: 5
  },
  {
    id: '6',
    title: 'Optimize database queries',
    description: 'Analyze and optimize slow database queries for better performance.',
    assignee: mockTeamMembers[1],
    assigneeId: '2',
    createdBy: currentUser,
    createdById: '1',
    dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago (overdue)
    priority: 'High',
    status: 'On Hold',
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    statusHistory: [
      {
        id: '10',
        status: 'Not Started',
        changedBy: 'Alex Thompson',
        changedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      },
      {
        id: '11',
        status: 'In Progress',
        changedBy: 'Sarah Johnson',
        changedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      },
      {
        id: '12',
        status: 'On Hold',
        changedBy: 'Sarah Johnson',
        changedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        notes: 'Waiting for database migration to be completed first'
      }
    ],
    tags: ['Performance', 'Database'],
    estimatedHours: 10,
    actualHours: 4
  }
];

export const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'task_due_soon',
    title: 'Task Due Soon',
    message: 'The task "Implement user authentication system" is due in 1 day.',
    taskId: '1',
    userId: '2',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    read: false,
    actionUrl: '/tasks/1'
  },
  {
    id: '2',
    type: 'task_overdue',
    title: 'Task Overdue',
    message: 'The task "Design dashboard mockups" is overdue by 1 day.',
    taskId: '2',
    userId: '3',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    read: false,
    actionUrl: '/tasks/2'
  },
  {
    id: '3',
    type: 'task_assigned',
    title: 'New Task Assigned',
    message: 'You have been assigned a new task: "Set up CI/CD pipeline".',
    taskId: '4',
    userId: '2',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    read: true,
    actionUrl: '/tasks/4'
  },
  {
    id: '4',
    type: 'task_completed',
    title: 'Task Completed',
    message: 'The task "Test user registration flow" has been marked as completed.',
    taskId: '5',
    userId: '1',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    read: true,
    actionUrl: '/tasks/5'
  }
];

// Helper functions for working with mock data
export const getCurrentUser = () => currentUser;

export const getTaskById = (id: string): Task | undefined => {
  return mockTasks.find(task => task.id === id);
};

export const getTasksByAssignee = (assigneeId: string): Task[] => {
  return mockTasks.filter(task => task.assigneeId === assigneeId);
};

export const getOverdueTasks = (): Task[] => {
  const now = new Date();
  return mockTasks.filter(task => 
    task.dueDate && 
    task.dueDate < now && 
    task.status !== 'Completed'
  );
};

export const getTasksDueSoon = (daysAhead: number = 3): Task[] => {
  const now = new Date();
  const futureDate = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000);
  
  return mockTasks.filter(task => 
    task.dueDate && 
    task.dueDate >= now && 
    task.dueDate <= futureDate &&
    task.status !== 'Completed'
  );
};

export const getUnreadNotifications = (userId: string): Notification[] => {
  return mockNotifications.filter(notification => 
    notification.userId === userId && !notification.read
  );
};
