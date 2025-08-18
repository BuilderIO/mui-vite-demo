import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid2';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import AddIcon from '@mui/icons-material/Add';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewListIcon from '@mui/icons-material/ViewList';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import TaskFilters from '../components/TaskFilters';
import TaskStats from '../components/TaskStats';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getTeamMembers,
  getTaskStats
} from '../utils/taskApi';
import type { 
  Task, 
  TaskFormData, 
  TaskFilters as TaskFiltersType, 
  TeamMember, 
  TaskStatus,
  TaskPriority 
} from '../types/taskTypes';

type ViewMode = 'grid' | 'list';

export default function Tasks() {
  // State management
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = React.useState<Task[]>([]);
  const [teamMembers, setTeamMembers] = React.useState<TeamMember[]>([]);
  const [filters, setFilters] = React.useState<TaskFiltersType>({});
  const [viewMode, setViewMode] = React.useState<ViewMode>('grid');
  
  // UI state
  const [loading, setLoading] = React.useState(true);
  const [formOpen, setFormOpen] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState<Task | null>(null);
  const [formLoading, setFormLoading] = React.useState(false);
  
  // Notifications
  const [notification, setNotification] = React.useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  // Statistics
  const [stats, setStats] = React.useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    overdue: 0,
    byPriority: { low: 0, medium: 0, high: 0 } as Record<TaskPriority, number>,
    byStatus: { todo: 0, in_progress: 0, completed: 0, on_hold: 0 } as Record<TaskStatus, number>
  });

  // Load initial data
  React.useEffect(() => {
    loadData();
  }, []);

  // Apply filters whenever tasks or filters change
  React.useEffect(() => {
    applyFilters();
  }, [tasks, filters]);

  // Update stats whenever tasks change
  React.useEffect(() => {
    updateStats();
  }, [tasks]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [tasksData, membersData] = await Promise.all([
        getTasks(),
        getTeamMembers()
      ]);
      
      setTasks(tasksData);
      setTeamMembers(membersData);
    } catch (error) {
      console.error('Error loading data:', error);
      showNotification('Failed to load tasks data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = async () => {
    try {
      const filtered = await getTasks(filters);
      setFilteredTasks(filtered);
    } catch (error) {
      console.error('Error applying filters:', error);
      showNotification('Failed to filter tasks', 'error');
    }
  };

  const updateStats = () => {
    const now = new Date();
    
    const newStats = {
      total: tasks.length,
      completed: tasks.filter(t => t.status === 'completed').length,
      inProgress: tasks.filter(t => t.status === 'in_progress').length,
      overdue: tasks.filter(t => 
        t.dueDate && 
        new Date(t.dueDate) < now && 
        t.status !== 'completed'
      ).length,
      byPriority: {
        low: tasks.filter(t => t.priority === 'low').length,
        medium: tasks.filter(t => t.priority === 'medium').length,
        high: tasks.filter(t => t.priority === 'high').length
      } as Record<TaskPriority, number>,
      byStatus: {
        todo: tasks.filter(t => t.status === 'todo').length,
        in_progress: tasks.filter(t => t.status === 'in_progress').length,
        completed: tasks.filter(t => t.status === 'completed').length,
        on_hold: tasks.filter(t => t.status === 'on_hold').length
      } as Record<TaskStatus, number>
    };
    
    setStats(newStats);
  };

  const showNotification = (
    message: string, 
    severity: 'success' | 'error' | 'warning' | 'info' = 'success'
  ) => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const handleCreateTask = () => {
    setEditingTask(null);
    setFormOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setFormOpen(true);
  };

  const handleFormSubmit = async (formData: TaskFormData) => {
    setFormLoading(true);
    try {
      if (editingTask) {
        // Update existing task
        const updatedTask = await updateTask(editingTask.id, formData);
        setTasks(prev => prev.map(t => t.id === editingTask.id ? updatedTask : t));
        showNotification('Task updated successfully');
      } else {
        // Create new task
        const newTask = await createTask(formData);
        setTasks(prev => [newTask, ...prev]);
        showNotification('Task created successfully');
      }
      
      setFormOpen(false);
      setEditingTask(null);
    } catch (error) {
      console.error('Error saving task:', error);
      showNotification('Failed to save task', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }
    
    try {
      await deleteTask(taskId);
      setTasks(prev => prev.filter(t => t.id !== taskId));
      showNotification('Task deleted successfully');
    } catch (error) {
      console.error('Error deleting task:', error);
      showNotification('Failed to delete task', 'error');
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    try {
      const updatedTask = await updateTask(taskId, { status: newStatus });
      setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));
      showNotification(`Task marked as ${newStatus.replace('_', ' ')}`);
    } catch (error) {
      console.error('Error updating task status:', error);
      showNotification('Failed to update task status', 'error');
    }
  };

  const handleViewModeChange = (
    event: React.MouseEvent<HTMLElement>,
    newViewMode: ViewMode
  ) => {
    if (newViewMode !== null) {
      setViewMode(newViewMode);
    }
  };

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '400px' 
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
        {/* Header */}
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          justifyContent="space-between" 
          alignItems={{ xs: 'flex-start', sm: 'center' }} 
          spacing={2} 
          sx={{ mb: 3 }}
        >
          <Typography variant="h4" component="h1">
            Task Management
          </Typography>
          
          <Stack direction="row" spacing={2} alignItems="center">
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={handleViewModeChange}
              size="small"
            >
              <ToggleButton value="grid" aria-label="grid view">
                <ViewModuleIcon />
              </ToggleButton>
              <ToggleButton value="list" aria-label="list view">
                <ViewListIcon />
              </ToggleButton>
            </ToggleButtonGroup>
            
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateTask}
            >
              New Task
            </Button>
          </Stack>
        </Stack>

        {/* Statistics */}
        <TaskStats stats={stats} />

        {/* Filters */}
        <TaskFilters
          filters={filters}
          teamMembers={teamMembers}
          onFiltersChange={setFilters}
          taskCounts={{
            total: tasks.length,
            filtered: filteredTasks.length
          }}
        />

        {/* Tasks Grid/List */}
        <Box sx={{ mt: 3 }}>
          {filteredTasks.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No tasks found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {tasks.length === 0 
                  ? "Get started by creating your first task"
                  : "Try adjusting your filters or search criteria"
                }
              </Typography>
              {tasks.length === 0 && (
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleCreateTask}
                >
                  Create First Task
                </Button>
              )}
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {filteredTasks.map((task) => (
                <Grid 
                  key={task.id} 
                  size={{ 
                    xs: 12, 
                    sm: viewMode === 'grid' ? 6 : 12, 
                    md: viewMode === 'grid' ? 4 : 12,
                    lg: viewMode === 'grid' ? 3 : 12
                  }}
                >
                  <TaskCard
                    task={task}
                    onEdit={handleEditTask}
                    onDelete={handleDeleteTask}
                    onStatusChange={handleStatusChange}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>

        {/* Task Form Dialog */}
        <TaskForm
          open={formOpen}
          task={editingTask}
          teamMembers={teamMembers}
          onClose={() => {
            setFormOpen(false);
            setEditingTask(null);
          }}
          onSubmit={handleFormSubmit}
          loading={formLoading}
        />

        {/* Notifications */}
        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert 
            onClose={handleCloseNotification} 
            severity={notification.severity}
            variant="filled"
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Box>
    </LocalizationProvider>
  );
}
