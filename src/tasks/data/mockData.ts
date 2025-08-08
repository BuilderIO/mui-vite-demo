import { Task, TeamMember, TaskStatus, TaskPriority, Notification } from '../types/Task';

export const mockTeamMembers: TeamMember[] = [
  {
    id: 'user_1',
    name: 'Alex Thompson',
    email: 'alex@acmecrm.com',
    avatar: '/static/images/avatar/1.jpg',
    role: 'Project Manager'
  },
  {
    id: 'user_2',
    name: 'Sarah Chen',
    email: 'sarah@acmecrm.com',
    avatar: '/static/images/avatar/2.jpg',
    role: 'Frontend Developer'
  },
  {
    id: 'user_3',
    name: 'Michael Rodriguez',
    email: 'michael@acmecrm.com',
    avatar: '/static/images/avatar/3.jpg',
    role: 'Backend Developer'
  },
  {
    id: 'user_4',
    name: 'Emily Johnson',
    email: 'emily@acmecrm.com',
    avatar: '/static/images/avatar/4.jpg',
    role: 'UI/UX Designer'
  },
  {
    id: 'user_5',
    name: 'David Kim',
    email: 'david@acmecrm.com',
    avatar: '/static/images/avatar/5.jpg',
    role: 'QA Engineer'
  },
  {
    id: 'user_6',
    name: 'Lisa Wang',
    email: 'lisa@acmecrm.com',
    avatar: '/static/images/avatar/6.jpg',
    role: 'DevOps Engineer'
  }
];

const currentUser = mockTeamMembers[0]; // Alex Thompson

export const mockTasks: Task[] = [
  {
    id: 'task_1',
    title: 'Implement user authentication system',
    description: 'Design and implement a secure user authentication system with login, registration, and password reset functionality.',
    assignee: mockTeamMembers[1], // Sarah Chen
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    priority: 'High',
    status: 'In Progress',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    createdBy: currentUser,
    tags: ['frontend', 'security', 'authentication'],
    comments: [
      {
        id: 'comment_1',
        content: 'Started working on the login form design',
        author: mockTeamMembers[1],
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      }
    ],
    statusHistory: [
      {
        id: 'status_1',
        status: 'Not Started',
        changedBy: currentUser,
        changedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'status_2',
        status: 'In Progress',
        changedBy: mockTeamMembers[1],
        changedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        comment: 'Started development'
      }
    ],
    estimatedHours: 40,
    actualHours: 15
  },
  {
    id: 'task_2',
    title: 'Setup CI/CD pipeline',
    description: 'Configure automated testing and deployment pipeline using GitHub Actions.',
    assignee: mockTeamMembers[5], // Lisa Wang
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    priority: 'Medium',
    status: 'Not Started',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    createdBy: currentUser,
    tags: ['devops', 'ci-cd', 'automation'],
    comments: [],
    statusHistory: [
      {
        id: 'status_3',
        status: 'Not Started',
        changedBy: currentUser,
        changedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      }
    ],
    estimatedHours: 20
  },
  {
    id: 'task_3',
    title: 'Design mobile responsive layout',
    description: 'Create responsive design mockups for all main application screens to ensure optimal mobile experience.',
    assignee: mockTeamMembers[3], // Emily Johnson
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day overdue
    priority: 'High',
    status: 'In Progress',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    createdBy: currentUser,
    tags: ['design', 'mobile', 'responsive'],
    comments: [
      {
        id: 'comment_2',
        content: 'Initial wireframes completed, working on detailed mockups',
        author: mockTeamMembers[3],
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      }
    ],
    statusHistory: [
      {
        id: 'status_4',
        status: 'Not Started',
        changedBy: currentUser,
        changedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'status_5',
        status: 'In Progress',
        changedBy: mockTeamMembers[3],
        changedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000)
      }
    ],
    estimatedHours: 30,
    actualHours: 25
  },
  {
    id: 'task_4',
    title: 'API documentation update',
    description: 'Update API documentation to reflect recent changes in the user management endpoints.',
    assignee: mockTeamMembers[2], // Michael Rodriguez
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
    priority: 'Low',
    status: 'Completed',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    createdBy: currentUser,
    tags: ['documentation', 'api', 'backend'],
    comments: [
      {
        id: 'comment_3',
        content: 'Documentation updated and reviewed',
        author: mockTeamMembers[2],
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      }
    ],
    statusHistory: [
      {
        id: 'status_6',
        status: 'Not Started',
        changedBy: currentUser,
        changedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'status_7',
        status: 'In Progress',
        changedBy: mockTeamMembers[2],
        changedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'status_8',
        status: 'Completed',
        changedBy: mockTeamMembers[2],
        changedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        comment: 'All endpoints documented and examples added'
      }
    ],
    estimatedHours: 8,
    actualHours: 6
  },
  {
    id: 'task_5',
    title: 'Performance testing suite',
    description: 'Develop comprehensive performance testing suite to ensure application scalability.',
    assignee: mockTeamMembers[4], // David Kim
    dueDate: new Date(), // Due today
    priority: 'Medium',
    status: 'On Hold',
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    createdBy: currentUser,
    tags: ['testing', 'performance', 'qa'],
    comments: [
      {
        id: 'comment_4',
        content: 'Waiting for staging environment setup before proceeding',
        author: mockTeamMembers[4],
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      }
    ],
    statusHistory: [
      {
        id: 'status_9',
        status: 'Not Started',
        changedBy: currentUser,
        changedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'status_10',
        status: 'In Progress',
        changedBy: mockTeamMembers[4],
        changedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'status_11',
        status: 'On Hold',
        changedBy: mockTeamMembers[4],
        changedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        comment: 'Blocked by infrastructure dependencies'
      }
    ],
    estimatedHours: 35,
    actualHours: 8
  },
  {
    id: 'task_6',
    title: 'Database migration script',
    description: 'Create migration script for the new user preferences table structure.',
    assignee: mockTeamMembers[2], // Michael Rodriguez
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
    priority: 'High',
    status: 'Not Started',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    createdBy: currentUser,
    tags: ['database', 'migration', 'backend'],
    comments: [],
    statusHistory: [
      {
        id: 'status_12',
        status: 'Not Started',
        changedBy: currentUser,
        changedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      }
    ],
    estimatedHours: 12
  }
];

export const mockNotifications: Notification[] = [
  {
    id: 'notif_1',
    type: 'task_due',
    title: 'Task Due Today',
    message: 'Performance testing suite is due today',
    taskId: 'task_5',
    recipientId: 'user_4',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    isRead: false,
    actionUrl: '/tasks'
  },
  {
    id: 'notif_2',
    type: 'task_overdue',
    title: 'Task Overdue',
    message: 'Design mobile responsive layout is 1 day overdue',
    taskId: 'task_3',
    recipientId: 'user_3',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    isRead: false,
    actionUrl: '/tasks'
  },
  {
    id: 'notif_3',
    type: 'task_assigned',
    title: 'New Task Assigned',
    message: 'You have been assigned: Database migration script',
    taskId: 'task_6',
    recipientId: 'user_2',
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    isRead: true,
    actionUrl: '/tasks'
  }
];

export const getCurrentUser = (): TeamMember => currentUser;
