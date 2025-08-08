import * as React from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Fab,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useTaskData } from '../hooks/useTaskData';
import TaskStats from '../components/tasks/TaskStats';
import TaskFilters from '../components/tasks/TaskFilters';
import TaskSortControls from '../components/tasks/TaskSortControls';
import TaskCard from '../components/tasks/TaskCard';
import TaskCreateDialog from '../components/tasks/TaskCreateDialog';
import TaskEditDialog from '../components/tasks/TaskEditDialog';
import NotificationCenter from '../components/tasks/NotificationCenter';
import { Task, TaskStatus } from '../types/TaskTypes';

export default function Tasks() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const {
    tasks,
    users,
    notifications,
    taskStats,
    filters,
    sortOptions,
    setFilters,
    setSortOptions,
    createTask,
    updateTask,
    deleteTask,
    markNotificationAsRead,
  } = useTaskData();

  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [taskToDelete, setTaskToDelete] = React.useState<string | null>(null);
  const [editingTask, setEditingTask] = React.useState<Task | null>(null);

  const handleCreateTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'statusHistory'>) => {
    createTask(taskData);
  };

  const handleStatusChange = (taskId: string, status: TaskStatus) => {
    updateTask(taskId, { status });
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setCreateDialogOpen(true);
  };

  const handleDeleteTask = (taskId: string) => {
    setTaskToDelete(taskId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (taskToDelete) {
      deleteTask(taskToDelete);
      setTaskToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  const handleRefresh = () => {
    // In a real app, this would refresh data from the server
    window.location.reload();
  };

  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1" sx={{ mb: 1, fontWeight: 600 }}>
            Task Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Create, assign, and track tasks with priority levels and due dates
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <NotificationCenter
            notifications={notifications}
            onMarkAsRead={markNotificationAsRead}
          />
          <Button
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            color="inherit"
            sx={{ display: { xs: 'none', sm: 'flex' } }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateDialogOpen(true)}
            sx={{ display: { xs: 'none', sm: 'flex' } }}
          >
            Create New Task
          </Button>
        </Box>
      </Box>

      {/* Floating Action Button for Mobile */}
      {isMobile && (
        <Fab
          color="primary"
          aria-label="add task"
          onClick={() => setCreateDialogOpen(true)}
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

      {/* Task Statistics */}
      <TaskStats stats={taskStats} />

      {/* Overdue Tasks Alert */}
      {taskStats.overdue > 0 && (
        <Alert 
          severity="warning" 
          sx={{ mb: 2 }}
          action={
            <Button 
              color="inherit" 
              size="small"
              onClick={() => setFilters({ ...filters, overdue: true })}
            >
              View Overdue
            </Button>
          }
        >
          You have {taskStats.overdue} overdue task{taskStats.overdue !== 1 ? 's' : ''} that need immediate attention.
        </Alert>
      )}

      {/* Filters and Sorting */}
      <TaskFilters
        filters={filters}
        onFiltersChange={setFilters}
        users={users}
      />

      <TaskSortControls
        sortOptions={sortOptions}
        onSortChange={setSortOptions}
      />

      {/* Task List */}
      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Tasks ({tasks.length})
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {tasks.length === 0 && 'No tasks match your current filters'}
          </Typography>
        </Box>

        {tasks.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              {Object.keys(filters).length === 0 ? 'No tasks yet' : 'No tasks match your filters'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {Object.keys(filters).length === 0 
                ? 'Create your first task to get started with project management.'
                : 'Try adjusting your filters to see more tasks.'}
            </Typography>
            {Object.keys(filters).length === 0 ? (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setCreateDialogOpen(true)}
              >
                Create Your First Task
              </Button>
            ) : (
              <Button
                variant="outlined"
                onClick={() => setFilters({})}
              >
                Clear All Filters
              </Button>
            )}
          </Box>
        ) : (
          <Grid container spacing={2}>
            {tasks.map((task) => (
              <Grid item xs={12} md={6} lg={4} key={task.id}>
                <TaskCard
                  task={task}
                  onStatusChange={handleStatusChange}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>

      {/* Create/Edit Task Dialog */}
      <TaskCreateDialog
        open={createDialogOpen}
        onClose={() => {
          setCreateDialogOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleCreateTask}
        users={users}
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
          <DialogContentText>
            Are you sure you want to delete this task? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
