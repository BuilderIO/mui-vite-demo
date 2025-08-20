import * as React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Fab from "@mui/material/Fab";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import AddIcon from "@mui/icons-material/Add";
import TaskMetrics from "../components/TaskMetrics";
import TaskFilters from "../components/TaskFilters";
import TaskTable from "../components/TaskTable";
import TaskForm from "../components/TaskForm";
import { useUsers } from "../hooks/useUsers";
import { useTasks } from "../hooks/useTasks";
import { Task, TaskFormData, TaskFilters as TaskFiltersType } from "../types/tasks";
import { calculateTaskMetrics, filterTasks, sortTasks } from "../utils/taskUtils";

export default function Tasks() {
  const { users, loading: usersLoading, error: usersError } = useUsers();
  const { 
    tasks, 
    loading: tasksLoading, 
    error: tasksError,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    updateTaskStatus
  } = useTasks(users);

  const [filters, setFilters] = React.useState<TaskFiltersType>({});
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState<Task | null>(null);
  const [viewingTask, setViewingTask] = React.useState<Task | null>(null);
  const [deleteConfirmTask, setDeleteConfirmTask] = React.useState<Task | null>(null);
  const [notification, setNotification] = React.useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const showNotification = (message: string, severity: "success" | "error" | "info" | "warning" = "success") => {
    setNotification({ open: true, message, severity });
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const filteredTasks = React.useMemo(() => {
    return filterTasks(tasks, filters);
  }, [tasks, filters]);

  const sortedTasks = React.useMemo(() => {
    return sortTasks(filteredTasks, "updatedAt");
  }, [filteredTasks]);

  const metrics = React.useMemo(() => {
    return calculateTaskMetrics(filteredTasks);
  }, [filteredTasks]);

  const handleCreateTask = () => {
    setEditingTask(null);
    setIsFormOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleViewTask = (task: Task) => {
    setViewingTask(task);
  };

  const handleDeleteTask = (taskId: string | number) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setDeleteConfirmTask(task);
    }
  };

  const confirmDeleteTask = async () => {
    if (deleteConfirmTask) {
      try {
        await deleteTask(deleteConfirmTask.id);
        showNotification("Task deleted successfully");
      } catch (error) {
        showNotification("Failed to delete task", "error");
      }
      setDeleteConfirmTask(null);
    }
  };

  const handleFormSubmit = async (taskData: TaskFormData) => {
    try {
      const assignee = users.find(user => user.login.uuid === taskData.assigneeId);
      
      if (editingTask) {
        await updateTask(editingTask.id, taskData, assignee);
        showNotification("Task updated successfully");
      } else {
        await createTask(taskData, assignee);
        showNotification("Task created successfully");
      }
      
      setIsFormOpen(false);
      setEditingTask(null);
    } catch (error) {
      showNotification(
        editingTask ? "Failed to update task" : "Failed to create task",
        "error"
      );
    }
  };

  const handleToggleComplete = async (taskId: string | number) => {
    try {
      await toggleTaskComplete(taskId);
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        showNotification(
          task.completed ? "Task marked as incomplete" : "Task completed!",
          "success"
        );
      }
    } catch (error) {
      showNotification("Failed to update task", "error");
    }
  };

  const handleFiltersChange = (newFilters: TaskFiltersType) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  if (usersError) {
    return (
      <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
        <Alert severity="error">
          Failed to load users: {usersError}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
            Task Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Create, assign, and track tasks for your team
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateTask}
          size="large"
        >
          New Task
        </Button>
      </Stack>

      <Stack spacing={3}>
        {/* Task Metrics */}
        <TaskMetrics metrics={metrics} />

        {/* Task Filters */}
        <TaskFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          users={users}
          onClearFilters={handleClearFilters}
        />

        {/* Task Table */}
        <TaskTable
          tasks={sortedTasks}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
          onToggleComplete={handleToggleComplete}
          onViewTask={handleViewTask}
          loading={tasksLoading}
        />

        {/* Results Summary */}
        <Box sx={{ textAlign: "center", py: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Showing {filteredTasks.length} of {tasks.length} tasks
            {filters.search && ` matching "${filters.search}"`}
          </Typography>
        </Box>
      </Stack>

      {/* Floating Action Button for Mobile */}
      <Fab
        color="primary"
        aria-label="add task"
        onClick={handleCreateTask}
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          display: { xs: "flex", md: "none" },
        }}
      >
        <AddIcon />
      </Fab>

      {/* Task Form Dialog */}
      <TaskForm
        open={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleFormSubmit}
        task={editingTask || undefined}
        users={users}
        loading={tasksLoading}
      />

      {/* Task View Dialog */}
      <Dialog
        open={Boolean(viewingTask)}
        onClose={() => setViewingTask(null)}
        maxWidth="sm"
        fullWidth
      >
        {viewingTask && (
          <>
            <DialogTitle>{viewingTask.title}</DialogTitle>
            <DialogContent>
              <Stack spacing={2}>
                {viewingTask.description && (
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Description
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {viewingTask.description}
                    </Typography>
                  </Box>
                )}
                
                <Stack direction="row" spacing={2}>
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Priority
                    </Typography>
                    <Typography variant="body2" sx={{ textTransform: "capitalize" }}>
                      {viewingTask.priority}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Status
                    </Typography>
                    <Typography variant="body2" sx={{ textTransform: "capitalize" }}>
                      {viewingTask.status.replace("_", " ")}
                    </Typography>
                  </Box>
                </Stack>

                {viewingTask.assignee && (
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Assigned to
                    </Typography>
                    <Typography variant="body2">
                      {viewingTask.assignee.name.first} {viewingTask.assignee.name.last}
                    </Typography>
                  </Box>
                )}

                {viewingTask.dueDate && (
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Due Date
                    </Typography>
                    <Typography variant="body2">
                      {new Date(viewingTask.dueDate).toLocaleDateString()}
                    </Typography>
                  </Box>
                )}

                {viewingTask.tags && viewingTask.tags.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Tags
                    </Typography>
                    <Typography variant="body2">
                      {viewingTask.tags.join(", ")}
                    </Typography>
                  </Box>
                )}
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setViewingTask(null)}>Close</Button>
              <Button
                variant="contained"
                onClick={() => {
                  setViewingTask(null);
                  handleEditTask(viewingTask);
                }}
              >
                Edit Task
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={Boolean(deleteConfirmTask)}
        onClose={() => setDeleteConfirmTask(null)}
      >
        <DialogTitle>Delete Task</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{deleteConfirmTask?.title}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmTask(null)}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={confirmDeleteTask}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={hideNotification}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={hideNotification} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
