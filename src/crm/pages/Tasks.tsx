import * as React from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  IconButton,
  Tabs,
  Tab,
  Alert,
  Fade,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Add as AddIcon,
  Dashboard as DashboardIcon,
  List as ListIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';

import { Task, TaskFilters, TaskSortOptions, TaskSummary } from '../types/task';
import { mockTasks, getCurrentUser } from '../data/mockTasks';
import { calculateTaskSummary } from '../utils/taskUtils';
import TaskDashboard from '../components/TaskDashboard';
import TaskList from '../components/TaskList';
import TaskFiltersPanel from '../components/TaskFiltersPanel';
import TaskCreateDialog from '../components/TaskCreateDialog';
import TaskSummaryCards from '../components/TaskSummaryCards';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`task-tabpanel-${index}`}
      aria-labelledby={`task-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `task-tab-${index}`,
    'aria-controls': `task-tabpanel-${index}`,
  };
}

export default function Tasks() {
  const theme = useTheme();
  const [tasks, setTasks] = React.useState<Task[]>(mockTasks);
  const [filteredTasks, setFilteredTasks] = React.useState<Task[]>(mockTasks);
  const [filters, setFilters] = React.useState<TaskFilters>({});
  const [sortOptions, setSortOptions] = React.useState<TaskSortOptions>({
    field: 'dueDate',
    direction: 'asc',
  });
  const [summary, setSummary] = React.useState<TaskSummary>(calculateTaskSummary(mockTasks));
  const [tabValue, setTabValue] = React.useState(0);
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);
  const [lastUpdated, setLastUpdated] = React.useState<Date>(new Date());
  const [showSuccessAlert, setShowSuccessAlert] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState('');

  const currentUser = getCurrentUser();

  // Apply filters and sorting
  React.useEffect(() => {
    let result = [...tasks];
    
    // Apply filters
    if (Object.keys(filters).length > 0) {
      result = result.filter(task => {
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
        
        // Search filter
        if (filters.search && filters.search.trim()) {
          const searchTerm = filters.search.toLowerCase().trim();
          const searchableText = [
            task.title,
            task.description || '',
            task.assignee?.name || '',
            task.createdBy.name,
            ...(task.tags || [])
          ].join(' ').toLowerCase();
          
          if (!searchableText.includes(searchTerm)) return false;
        }
        
        // Overdue filter
        if (filters.overdue !== undefined) {
          const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'Completed';
          if (filters.overdue !== !!isOverdue) return false;
        }
        
        return true;
      });
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortOptions.field) {
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'dueDate':
          aValue = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
          bValue = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
          break;
        case 'priority':
          const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
          aValue = priorityOrder[a.priority];
          bValue = priorityOrder[b.priority];
          break;
        case 'status':
          const statusOrder = { 'Not Started': 1, 'In Progress': 2, 'On Hold': 3, 'Completed': 4 };
          aValue = statusOrder[a.status];
          bValue = statusOrder[b.status];
          break;
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) {
        return sortOptions.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortOptions.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    
    setFilteredTasks(result);
    setSummary(calculateTaskSummary(result));
  }, [tasks, filters, sortOptions]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleFiltersChange = (newFilters: TaskFilters) => {
    setFilters(newFilters);
  };

  const handleSortChange = (newSortOptions: TaskSortOptions) => {
    setSortOptions(newSortOptions);
  };

  const handleCreateTask = (taskData: Partial<Task>) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: taskData.title!,
      description: taskData.description,
      assigneeId: taskData.assigneeId,
      assignee: taskData.assignee,
      createdBy: currentUser,
      createdById: currentUser.id,
      dueDate: taskData.dueDate,
      priority: taskData.priority || 'Medium',
      status: 'Not Started',
      createdAt: new Date(),
      updatedAt: new Date(),
      statusHistory: [{
        id: '1',
        status: 'Not Started',
        changedBy: currentUser.name,
        changedAt: new Date(),
      }],
      tags: taskData.tags,
      estimatedHours: taskData.estimatedHours,
    };

    setTasks(prev => [newTask, ...prev]);
    setLastUpdated(new Date());
    setSuccessMessage('Task created successfully!');
    setShowSuccessAlert(true);
    setTimeout(() => setShowSuccessAlert(false), 3000);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(task => task.id === updatedTask.id ? updatedTask : task));
    setLastUpdated(new Date());
    setSuccessMessage('Task updated successfully!');
    setShowSuccessAlert(true);
    setTimeout(() => setShowSuccessAlert(false), 3000);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
    setLastUpdated(new Date());
    setSuccessMessage('Task deleted successfully!');
    setShowSuccessAlert(true);
    setTimeout(() => setShowSuccessAlert(false), 3000);
  };

  const handleRefresh = () => {
    setLastUpdated(new Date());
    setSuccessMessage('Tasks refreshed!');
    setShowSuccessAlert(true);
    setTimeout(() => setShowSuccessAlert(false), 2000);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      {/* Success Alert */}
      <Fade in={showSuccessAlert}>
        <Alert 
          severity="success" 
          sx={{ mb: 2 }}
          onClose={() => setShowSuccessAlert(false)}
        >
          {successMessage}
        </Alert>
      </Fade>

      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3,
        flexWrap: 'wrap',
        gap: 2 
      }}>
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
            Task Management
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Create, assign, and track tasks with your team
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <IconButton onClick={handleRefresh} title="Refresh">
            <RefreshIcon />
          </IconButton>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateDialogOpen(true)}
            sx={{ 
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              minWidth: 'auto',
              px: { xs: 2, sm: 3 }
            }}
          >
            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
              Create New Task
            </Box>
            <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
              Create
            </Box>
          </Button>
        </Box>
      </Box>

      {/* Summary Cards */}
      <TaskSummaryCards summary={summary} />

      {/* Filters Panel */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <TaskFiltersPanel
            filters={filters}
            onFiltersChange={handleFiltersChange}
            sortOptions={sortOptions}
            onSortChange={handleSortChange}
          />
        </CardContent>
      </Card>

      {/* Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="task management tabs"
            sx={{ px: 2 }}
          >
            <Tab 
              icon={<DashboardIcon />} 
              label="Dashboard" 
              iconPosition="start" 
              {...a11yProps(0)} 
            />
            <Tab 
              icon={<ListIcon />} 
              label={`Task List (${filteredTasks.length})`} 
              iconPosition="start" 
              {...a11yProps(1)} 
            />
          </Tabs>
        </Box>

        <CardContent sx={{ p: 0 }}>
          <TabPanel value={tabValue} index={0}>
            <Box sx={{ p: 3 }}>
              <TaskDashboard 
                tasks={filteredTasks} 
                summary={summary}
                onTaskUpdate={handleUpdateTask}
              />
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <TaskList
              tasks={filteredTasks}
              onTaskUpdate={handleUpdateTask}
              onTaskDelete={handleDeleteTask}
              sortOptions={sortOptions}
              onSortChange={handleSortChange}
            />
          </TabPanel>
        </CardContent>
      </Card>

      {/* Meta Information */}
      <Box sx={{ 
        mt: 2, 
        py: 2, 
        px: 1, 
        textAlign: 'center',
        color: 'text.secondary',
        fontSize: '0.75rem'
      }}>
        Last updated: {lastUpdated.toLocaleTimeString()} • 
        Showing {filteredTasks.length} of {tasks.length} tasks
      </Box>

      {/* Create Task Dialog */}
      <TaskCreateDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSubmit={handleCreateTask}
      />
    </Box>
  );
}
