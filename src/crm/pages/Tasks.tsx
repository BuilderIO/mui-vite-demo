import * as React from "react";
import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Fab,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Add as AddIcon,
  Dashboard as DashboardIcon,
  List as ListIcon,
  SortByAlpha as SortIcon,
} from "@mui/icons-material";
import { Task, TaskFilters, TaskSortConfig, TaskStatus } from "../types/taskTypes";
import { mockTasks, mockTeamMembers } from "../data/mockTaskData";
import { filterTasks, sortTasks, validateTaskForm } from "../utils/taskUtils";
import TaskCreateForm from "../components/TaskCreateForm";
import TaskEditForm from "../components/TaskEditForm";
import TaskFiltersComponent from "../components/TaskFilters";
import TaskListItem from "../components/TaskListItem";
import TaskDashboard from "../components/TaskDashboard";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`task-tabpanel-${index}`}
      aria-labelledby={`task-tab-${index}`}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function Tasks() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // State management
  const [tasks, setTasks] = React.useState<Task[]>(mockTasks);
  const [currentTab, setCurrentTab] = React.useState(0);
  const [showCreateForm, setShowCreateForm] = React.useState(false);
  const [showEditForm, setShowEditForm] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState<Task | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [taskToDelete, setTaskToDelete] = React.useState<Task | null>(null);
  const [snackbar, setSnackbar] = React.useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Filtering and sorting
  const [filters, setFilters] = React.useState<TaskFilters>({
    status: [],
    priority: [],
    assigneeId: [],
    dueDateRange: { start: null, end: null },
    overdue: undefined,
    search: "",
  });
  const [sortConfig, setSortConfig] = React.useState<TaskSortConfig>({
    field: "createdAt",
    direction: "desc",
  });

  // Pagination
  const [currentPage, setCurrentPage] = React.useState(1);
  const tasksPerPage = 10;

  // Process tasks
  const filteredTasks = React.useMemo(
    () => filterTasks(tasks, filters),
    [tasks, filters]
  );

  const sortedTasks = React.useMemo(
    () => sortTasks(filteredTasks, sortConfig),
    [filteredTasks, sortConfig]
  );

  const paginatedTasks = React.useMemo(() => {
    const startIndex = (currentPage - 1) * tasksPerPage;
    return sortedTasks.slice(startIndex, startIndex + tasksPerPage);
  }, [sortedTasks, currentPage]);

  const totalPages = Math.ceil(sortedTasks.length / tasksPerPage);

  // Event handlers
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleCreateTask = (newTask: Task) => {
    setTasks(prev => [newTask, ...prev]);
    showSnackbar('Task created successfully!', 'success');
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowEditForm(true);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
    showSnackbar('Task updated successfully!', 'success');
  };

  const handleDeleteTask = (task: Task) => {
    setTaskToDelete(task);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteTask = () => {
    if (taskToDelete) {
      setTasks(prev => prev.filter(task => task.id !== taskToDelete.id));
      showSnackbar('Task deleted successfully!', 'success');
    }
    setDeleteDialogOpen(false);
    setTaskToDelete(null);
  };

  const handleStatusChange = (task: Task, newStatus: TaskStatus) => {
    const updatedTask: Task = {
      ...task,
      status: newStatus,
      updatedAt: new Date(),
      completedAt: newStatus === "Completed" && task.status !== "Completed" 
        ? new Date() 
        : newStatus !== "Completed" 
        ? undefined 
        : task.completedAt,
    };
    handleUpdateTask(updatedTask);
  };

  const handleSortChange = (field: keyof Task) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'warning' | 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" component="h1">
          Task Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setShowCreateForm(true)}
          size={isMobile ? "small" : "medium"}
        >
          Create New Task
        </Button>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
        <Tabs value={currentTab} onChange={handleTabChange}>
          <Tab
            icon={<DashboardIcon />}
            label="Dashboard"
            iconPosition="start"
          />
          <Tab
            icon={<ListIcon />}
            label={`Tasks (${sortedTasks.length})`}
            iconPosition="start"
          />
        </Tabs>
      </Box>

      {/* Dashboard Tab */}
      <TabPanel value={currentTab} index={0}>
        <TaskDashboard tasks={tasks} teamMembers={mockTeamMembers} />
      </TabPanel>

      {/* Tasks List Tab */}
      <TabPanel value={currentTab} index={1}>
        {/* Filters */}
        <TaskFiltersComponent
          filters={filters}
          onFiltersChange={setFilters}
          teamMembers={mockTeamMembers}
          collapsed={false}
        />

        {/* Controls */}
        <Box sx={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          mb: 2,
          flexDirection: { xs: "column", sm: "row" },
          gap: 2
        }}>
          <Typography variant="body1" color="text.secondary">
            Showing {paginatedTasks.length} of {sortedTasks.length} tasks
            {filteredTasks.length !== tasks.length && ` (filtered from ${tasks.length} total)`}
          </Typography>

          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Sort by</InputLabel>
              <Select
                value={sortConfig.field}
                onChange={(e) => handleSortChange(e.target.value as keyof Task)}
                label="Sort by"
              >
                <MenuItem value="title">Title</MenuItem>
                <MenuItem value="priority">Priority</MenuItem>
                <MenuItem value="status">Status</MenuItem>
                <MenuItem value="dueDate">Due Date</MenuItem>
                <MenuItem value="createdAt">Created Date</MenuItem>
                <MenuItem value="updatedAt">Updated Date</MenuItem>
                <MenuItem value="assignee">Assignee</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="outlined"
              size="small"
              onClick={() => setSortConfig(prev => ({
                ...prev,
                direction: prev.direction === 'asc' ? 'desc' : 'asc'
              }))}
              startIcon={<SortIcon />}
            >
              {sortConfig.direction === 'asc' ? 'A-Z' : 'Z-A'}
            </Button>
          </Box>
        </Box>

        {/* Task List */}
        {paginatedTasks.length === 0 ? (
          <Alert severity="info" sx={{ mt: 2 }}>
            {sortedTasks.length === 0 
              ? "No tasks match your current filters. Try adjusting your search criteria."
              : "No tasks to display on this page."
            }
          </Alert>
        ) : (
          <Stack spacing={2}>
            {paginatedTasks.map((task) => (
              <TaskListItem
                key={task.id}
                task={task}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
                onStatusChange={handleStatusChange}
              />
            ))}
          </Stack>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(event, page) => setCurrentPage(page)}
              color="primary"
              size={isMobile ? "small" : "medium"}
            />
          </Box>
        )}
      </TabPanel>

      {/* Floating Action Button for Mobile */}
      {isMobile && (
        <Fab
          color="primary"
          aria-label="add task"
          onClick={() => setShowCreateForm(true)}
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
          }}
        >
          <AddIcon />
        </Fab>
      )}

      {/* Forms and Dialogs */}
      <TaskCreateForm
        open={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        onSubmit={handleCreateTask}
        teamMembers={mockTeamMembers}
      />

      <TaskEditForm
        open={showEditForm}
        task={editingTask}
        onClose={() => {
          setShowEditForm(false);
          setEditingTask(null);
        }}
        onSubmit={handleUpdateTask}
        teamMembers={mockTeamMembers}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Task</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{taskToDelete?.title}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDeleteTask} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
