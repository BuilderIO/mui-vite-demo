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
  Badge,
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
import { Task } from '../types/taskTypes';
import { useTaskContext } from '../context/TaskContext';
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
  
  // Use TaskContext
  const {
    tasks,
    notifications,
    filters,
    stats,
    filteredTasks,
    unreadNotificationCount,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    setFilters,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
  } = useTaskContext();

  // Local state
  const [createFormOpen, setCreateFormOpen] = React.useState(false);
  const [editTask, setEditTask] = React.useState<Task | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [taskToDelete, setTaskToDelete] = React.useState<string>('');
  const [activeTab, setActiveTab] = React.useState(0);

  // Handlers
  const handleCreateTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'statusHistory'>) => {
    createTask(taskData);
  };

  const handleEditTask = (task: Task) => {
    setEditTask(task);
    setCreateFormOpen(true);
  };

  const handleUpdateTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'statusHistory'>) => {
    if (!editTask) return;

    updateTask(editTask.id, {
      ...taskData,
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
    });
    
    setEditTask(null);
  };

  const handleDeleteTask = (taskId: string) => {
    setTaskToDelete(taskId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteTask = () => {
    deleteTask(taskToDelete);
    setDeleteDialogOpen(false);
    setTaskToDelete('');
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

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
              icon={
                <Badge badgeContent={unreadNotificationCount} color="error">
                  <NotificationsIcon />
                </Badge>
              }
              label={`Notifications`}
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
              onUpdateTaskStatus={updateTaskStatus}
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
            onMarkAsRead={markNotificationAsRead}
            onMarkAllAsRead={markAllNotificationsAsRead}
            onDeleteNotification={deleteNotification}
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
