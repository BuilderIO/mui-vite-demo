import * as React from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  Grid,
  Tab,
  Tabs,
  Paper,
  useTheme,
  useMediaQuery,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  Add as AddIcon,
  Dashboard as DashboardIcon,
  List as ListIcon,
  Notifications as NotificationsIcon,
  People as PeopleIcon,
} from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Task, TaskFilters, TaskStatus, Notification } from '../types/taskTypes';
import { 
  mockTasks, 
  mockNotifications, 
  calculateTaskStats,
  isTaskOverdue,
  isTaskDueSoon
} from '../data/taskData';
import TaskCreateForm from '../components/TaskCreateForm';
import TaskList from '../components/TaskList';
import TaskFilters from '../components/TaskFilters';
import TaskStatsCards from '../components/TaskStatsCards';
import TaskPriorityChart from '../components/TaskPriorityChart';
import TeamWorkloadChart from '../components/TeamWorkloadChart';
import TaskNotifications from '../components/TaskNotifications';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index, ...other }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`task-tabpanel-${index}`}
      aria-labelledby={`task-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function Tasks() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // State management
  const [tasks, setTasks] = React.useState<Task[]>(mockTasks);
  const [notifications, setNotifications] = React.useState<Notification[]>(mockNotifications);
  const [filters, setFilters] = React.useState<TaskFilters>({});
  const [createFormOpen, setCreateFormOpen] = React.useState(false);
  const [editTask, setEditTask] = React.useState<Task | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [taskToDelete, setTaskToDelete] = React.useState<string>('');
  const [activeTab, setActiveTab] = React.useState(0);

  // Filter tasks based on current filters
  const filteredTasks = React.useMemo(() => {
    return tasks.filter(task => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(searchLower);
        const matchesDescription = task.description?.toLowerCase().includes(searchLower);
        if (!matchesTitle && !matchesDescription) return false;
      }

      // Status filter
      if (filters.status && filters.status.length > 0) {
        if (!filters.status.includes(task.status)) return false;
      }

      // Priority filter
      if (filters.priority && filters.priority.length > 0) {
        if (!filters.priority.includes(task.priority)) return false;
      }

      // Assignee filter
      if (filters.assigneeId && filters.assigneeId.length > 0) {
        if (!task.assigneeId || !filters.assigneeId.includes(task.assigneeId)) return false;
      }

      // Due date filter
      if (filters.dueDateFrom || filters.dueDateTo) {
        if (!task.dueDate) return false;
        const taskDate = new Date(task.dueDate);
        
        if (filters.dueDateFrom) {
          const fromDate = new Date(filters.dueDateFrom);
          if (taskDate < fromDate) return false;
        }
        
        if (filters.dueDateTo) {
          const toDate = new Date(filters.dueDateTo);
          if (taskDate > toDate) return false;
        }
      }

      return true;
    });
  }, [tasks, filters]);

  // Calculate statistics
  const stats = React.useMemo(() => calculateTaskStats(tasks), [tasks]);

  // Update task status due to overdue/due soon conditions
  React.useEffect(() => {
    const updatedTasks = tasks.map(task => {
      let newStatus = task.status;
      
      // Auto-mark overdue tasks (except completed ones)
      if (isTaskOverdue(task) && task.status !== 'completed') {
        newStatus = 'overdue' as any; // This would need to be added to TaskStatus enum
      }
      
      return task.status !== newStatus ? { ...task, status: newStatus } : task;
    });
    
    const hasChanges = updatedTasks.some((task, index) => task.status !== tasks[index].status);
    if (hasChanges) {
      setTasks(updatedTasks);
    }
  }, [tasks]);

  // Handlers
  const handleCreateTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'statusHistory'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      statusHistory: [
        {
          id: `sh-${Date.now()}`,
          taskId: Date.now().toString(),
          fromStatus: null,
          toStatus: taskData.status,
          changedBy: '1', // Current user
          changedAt: new Date().toISOString(),
        },
      ],
    };

    setTasks(prev => [newTask, ...prev]);

    // Create notification if task is assigned to someone
    if (taskData.assigneeId && taskData.assigneeId !== '1') {
      const newNotification: Notification = {
        id: `notif-${Date.now()}`,
        type: 'task_assigned',
        taskId: newTask.id,
        recipientId: taskData.assigneeId,
        title: 'New Task Assigned',
        message: `You have been assigned a new task: "${taskData.title}".`,
        read: false,
        createdAt: new Date().toISOString(),
      };
      setNotifications(prev => [newNotification, ...prev]);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditTask(task);
    setCreateFormOpen(true);
  };

  const handleUpdateTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'statusHistory'>) => {
    if (!editTask) return;

    const updatedTask: Task = {
      ...editTask,
      ...taskData,
      updatedAt: new Date().toISOString(),
      statusHistory: [
        ...editTask.statusHistory,
        {
          id: `sh-${Date.now()}`,
          taskId: editTask.id,
          fromStatus: editTask.status,
          toStatus: taskData.status,
          changedBy: '1', // Current user
          changedAt: new Date().toISOString(),
        },
      ],
    };

    setTasks(prev => prev.map(task => task.id === editTask.id ? updatedTask : task));
    setEditTask(null);
  };

  const handleDeleteTask = (taskId: string) => {
    setTaskToDelete(taskId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteTask = () => {
    setTasks(prev => prev.filter(task => task.id !== taskToDelete));
    setNotifications(prev => prev.filter(notif => notif.taskId !== taskToDelete));
    setDeleteDialogOpen(false);
    setTaskToDelete('');
  };

  const handleUpdateTaskStatus = (taskId: string, status: TaskStatus) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const updatedTask = {
          ...task,
          status,
          updatedAt: new Date().toISOString(),
          statusHistory: [
            ...task.statusHistory,
            {
              id: `sh-${Date.now()}`,
              taskId: task.id,
              fromStatus: task.status,
              toStatus: status,
              changedBy: '1', // Current user
              changedAt: new Date().toISOString(),
            },
          ],
        };

        // Create notification for task completion
        if (status === 'completed' && task.assigneeId) {
          const newNotification: Notification = {
            id: `notif-${Date.now()}`,
            type: 'task_completed',
            taskId: task.id,
            recipientId: task.assigneeId,
            title: 'Task Completed',
            message: `Task "${task.title}" has been completed.`,
            read: false,
            createdAt: new Date().toISOString(),
          };
          setNotifications(prev => [newNotification, ...prev]);
        }

        return updatedTask;
      }
      return task;
    }));
  };

  const handleMarkNotificationAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === notificationId ? { ...notif, read: true } : notif
    ));
  };

  const handleMarkAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const handleDeleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const unreadNotificationCount = notifications.filter(n => !n.read).length;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
        {/* Header */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'stretch', sm: 'center' }}
          spacing={2}
          sx={{ mb: 3 }}
        >
          <Typography variant="h4" component="h1">
            Task Management
          </Typography>
          {!isMobile && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setCreateFormOpen(true)}
              size="large"
            >
              Create New Task
            </Button>
          )}
        </Stack>

        {/* Tabs */}
        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant={isMobile ? 'fullWidth' : 'standard'}
            scrollButtons="auto"
            allowScrollButtonsMobile
          >
            <Tab
              icon={<DashboardIcon />}
              label="Dashboard"
              iconPosition="start"
            />
            <Tab
              icon={<ListIcon />}
              label="Task List"
              iconPosition="start"
            />
            <Tab
              icon={<PeopleIcon />}
              label="Team Workload"
              iconPosition="start"
            />
            <Tab
              icon={<NotificationsIcon />}
              label={`Notifications ${unreadNotificationCount > 0 ? `(${unreadNotificationCount})` : ''}`}
              iconPosition="start"
            />
          </Tabs>
        </Paper>

        {/* Tab Panels */}
        <TabPanel value={activeTab} index={0}>
          {/* Dashboard */}
          <Stack spacing={3}>
            <TaskStatsCards stats={stats} />
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TaskPriorityChart stats={stats} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TeamWorkloadChart tasks={tasks} />
              </Grid>
            </Grid>
          </Stack>
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          {/* Task List */}
          <Stack spacing={3}>
            <TaskFilters
              filters={filters}
              onFiltersChange={setFilters}
              totalTasks={tasks.length}
              filteredCount={filteredTasks.length}
            />
            <TaskList
              tasks={filteredTasks}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              onUpdateTaskStatus={handleUpdateTaskStatus}
            />
          </Stack>
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          {/* Team Workload */}
          <TeamWorkloadChart tasks={tasks} />
        </TabPanel>

        <TabPanel value={activeTab} index={3}>
          {/* Notifications */}
          <TaskNotifications
            notifications={notifications}
            onMarkAsRead={handleMarkNotificationAsRead}
            onMarkAllAsRead={handleMarkAllNotificationsAsRead}
            onDeleteNotification={handleDeleteNotification}
          />
        </TabPanel>

        {/* Mobile FAB */}
        {isMobile && (
          <Fab
            color="primary"
            aria-label="add task"
            onClick={() => setCreateFormOpen(true)}
            sx={{
              position: 'fixed',
              bottom: 16,
              right: 16,
              zIndex: 1000,
            }}
          >
            <AddIcon />
          </Fab>
        )}

        {/* Task Create/Edit Form */}
        <TaskCreateForm
          open={createFormOpen}
          onClose={() => {
            setCreateFormOpen(false);
            setEditTask(null);
          }}
          onSubmit={editTask ? handleUpdateTask : handleCreateTask}
          editTask={editTask}
        />

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Delete Task</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this task? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button onClick={confirmDeleteTask} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
}
