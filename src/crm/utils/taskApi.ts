import { Task, TaskFormData, TaskFilters, TeamMember } from '../types/taskTypes';

const TASKS_STORAGE_KEY = 'crm_tasks';
const USER_API_BASE = 'https://user-api.builder-io.workers.dev/api';

// Utility to generate unique IDs
const generateId = () => `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Convert user API response to TeamMember
const convertUserToTeamMember = (user: any): TeamMember => ({
  id: user.login.uuid,
  name: {
    first: user.name.first,
    last: user.name.last
  },
  email: user.email,
  avatar: user.picture?.thumbnail
});

// Sample data for development
const sampleTasks: Task[] = [
  {
    id: 'task_1',
    title: 'Follow up with TechSolutions Inc on cloud proposal',
    description: 'Need to discuss the cloud migration timeline and pricing details',
    priority: 'high',
    status: 'todo',
    assignee: {
      id: 'user_1',
      name: { first: 'John', last: 'Doe' },
      email: 'john.doe@company.com'
    },
    createdBy: {
      id: 'user_2',
      name: { first: 'Jane', last: 'Smith' },
      email: 'jane.smith@company.com'
    },
    dueDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    createdAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    updatedAt: new Date().toISOString(),
    tags: ['sales', 'cloud']
  },
  {
    id: 'task_2',
    title: 'Prepare presentation for Global Media website project',
    description: 'Create slides covering project scope, timeline, and team structure',
    priority: 'medium',
    status: 'in_progress',
    assignee: {
      id: 'user_3',
      name: { first: 'Mike', last: 'Johnson' },
      email: 'mike.johnson@company.com'
    },
    createdBy: {
      id: 'user_2',
      name: { first: 'Jane', last: 'Smith' },
      email: 'jane.smith@company.com'
    },
    dueDate: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ['presentation', 'website']
  },
  {
    id: 'task_3',
    title: 'Update CRM implementation timeline for RetailGiant',
    description: 'Revise project milestones based on recent requirements changes',
    priority: 'low',
    status: 'completed',
    assignee: {
      id: 'user_1',
      name: { first: 'John', last: 'Doe' },
      email: 'john.doe@company.com'
    },
    createdBy: {
      id: 'user_1',
      name: { first: 'John', last: 'Doe' },
      email: 'john.doe@company.com'
    },
    dueDate: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ['crm', 'timeline']
  }
];

// Initialize tasks in localStorage if not exists
const initializeTasks = () => {
  const storedTasks = localStorage.getItem(TASKS_STORAGE_KEY);
  if (!storedTasks) {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(sampleTasks));
    return sampleTasks;
  }
  return JSON.parse(storedTasks) as Task[];
};

// Get all tasks with optional filtering
export const getTasks = (filters?: TaskFilters): Promise<Task[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let tasks = initializeTasks();
      
      if (filters) {
        if (filters.status && filters.status.length > 0) {
          tasks = tasks.filter(task => filters.status!.includes(task.status));
        }
        if (filters.priority && filters.priority.length > 0) {
          tasks = tasks.filter(task => filters.priority!.includes(task.priority));
        }
        if (filters.assigneeId) {
          tasks = tasks.filter(task => task.assignee?.id === filters.assigneeId);
        }
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          tasks = tasks.filter(task => 
            task.title.toLowerCase().includes(searchLower) ||
            task.description?.toLowerCase().includes(searchLower)
          );
        }
        if (filters.dueDateFrom) {
          tasks = tasks.filter(task => 
            task.dueDate && task.dueDate >= filters.dueDateFrom!
          );
        }
        if (filters.dueDateTo) {
          tasks = tasks.filter(task => 
            task.dueDate && task.dueDate <= filters.dueDateTo!
          );
        }
      }
      
      // Sort by created date (newest first)
      tasks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      resolve(tasks);
    }, 100);
  });
};

// Get task by ID
export const getTaskById = (id: string): Promise<Task | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const tasks = initializeTasks();
      const task = tasks.find(t => t.id === id) || null;
      resolve(task);
    }, 50);
  });
};

// Create new task
export const createTask = (taskData: TaskFormData): Promise<Task> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const tasks = initializeTasks();
      const currentUser = {
        id: 'current_user',
        name: { first: 'Current', last: 'User' },
        email: 'current.user@company.com'
      };
      
      const newTask: Task = {
        id: generateId(),
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority,
        status: taskData.status,
        assignee: taskData.assigneeId ? 
          tasks.find(t => t.assignee?.id === taskData.assigneeId)?.assignee : undefined,
        createdBy: currentUser,
        dueDate: taskData.dueDate,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        reminderDate: taskData.reminderDate,
        tags: taskData.tags
      };
      
      tasks.unshift(newTask);
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
      resolve(newTask);
    }, 100);
  });
};

// Update task
export const updateTask = (id: string, updates: Partial<TaskFormData>): Promise<Task> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const tasks = initializeTasks();
      const taskIndex = tasks.findIndex(t => t.id === id);
      
      if (taskIndex === -1) {
        reject(new Error('Task not found'));
        return;
      }
      
      const updatedTask = {
        ...tasks[taskIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      
      tasks[taskIndex] = updatedTask;
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
      resolve(updatedTask);
    }, 100);
  });
};

// Delete task
export const deleteTask = (id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const tasks = initializeTasks();
      const taskIndex = tasks.findIndex(t => t.id === id);
      
      if (taskIndex === -1) {
        reject(new Error('Task not found'));
        return;
      }
      
      tasks.splice(taskIndex, 1);
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
      resolve();
    }, 100);
  });
};

// Fetch team members from user API
export const getTeamMembers = async (limit = 50): Promise<TeamMember[]> => {
  try {
    const response = await fetch(`${USER_API_BASE}/users?perPage=${limit}`);
    if (!response.ok) {
      throw new Error('Failed to fetch team members');
    }
    
    const data = await response.json();
    return data.data.map(convertUserToTeamMember);
  } catch (error) {
    console.error('Error fetching team members:', error);
    // Fallback to sample data
    return [
      {
        id: 'user_1',
        name: { first: 'John', last: 'Doe' },
        email: 'john.doe@company.com'
      },
      {
        id: 'user_2',
        name: { first: 'Jane', last: 'Smith' },
        email: 'jane.smith@company.com'
      },
      {
        id: 'user_3',
        name: { first: 'Mike', last: 'Johnson' },
        email: 'mike.johnson@company.com'
      }
    ];
  }
};

// Get task statistics
export const getTaskStats = (): Promise<{
  total: number;
  completed: number;
  inProgress: number;
  overdue: number;
}> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const tasks = initializeTasks();
      const now = new Date();
      
      const stats = {
        total: tasks.length,
        completed: tasks.filter(t => t.status === 'completed').length,
        inProgress: tasks.filter(t => t.status === 'in_progress').length,
        overdue: tasks.filter(t => 
          t.dueDate && 
          new Date(t.dueDate) < now && 
          t.status !== 'completed'
        ).length
      };
      
      resolve(stats);
    }, 50);
  });
};
