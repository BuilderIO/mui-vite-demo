import * as React from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  ListItemButton,
  Avatar,
  Tabs,
  Tab,
  Grid,
  Tooltip,
  Alert,
  Snackbar,
  Autocomplete,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  AssignmentTurnedIn as CompletedIcon,
  PlayArrow as InProgressIcon,
  Pause as OnHoldIcon,
  Schedule as ScheduledIcon,
  MoreVert as MoreVertIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";

// Interfaces
interface User {
  login: {
    uuid: string;
    username: string;
  };
  name: {
    title: string;
    first: string;
    last: string;
  };
  email: string;
  picture: {
    thumbnail: string;
    medium: string;
    large: string;
  };
}

interface Task {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  status: "todo" | "in_progress" | "completed" | "on_hold";
  dueDate: string;
  assignedTo?: User;
  createdAt: string;
  updatedAt: string;
}

// Priority colors and labels
const priorityConfig = {
  high: { color: "error" as const, label: "High" },
  medium: { color: "warning" as const, label: "Medium" },
  low: { color: "success" as const, label: "Low" },
};

// Status configuration
const statusConfig = {
  todo: { color: "#6B7280", icon: ScheduledIcon, label: "To Do" },
  in_progress: { color: "#3B82F6", icon: InProgressIcon, label: "In Progress" },
  completed: { color: "#10B981", icon: CompletedIcon, label: "Completed" },
  on_hold: { color: "#F59E0B", icon: OnHoldIcon, label: "On Hold" },
};

// Custom hooks
const useUsers = () => {
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchUsers = React.useCallback(async (params: Record<string, any> = {}) => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams({
        perPage: "50",
        ...params,
      });
      const response = await fetch(`https://user-api.builder-io.workers.dev/api/users?${queryParams}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      
      const data = await response.json();
      setUsers(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, loading, error, refetch: fetchUsers };
};

const useTasks = () => {
  // For this demo, we'll use local storage and state
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    // Load tasks from localStorage
    setLoading(true);
    try {
      const storedTasks = localStorage.getItem("crm-tasks");
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      } else {
        // Initialize with sample data
        const sampleTasks: Task[] = [
          {
            id: "1",
            title: "Follow up with TechSolutions Inc on cloud proposal",
            description: "Call to discuss the proposal details and get feedback on the cloud infrastructure requirements.",
            priority: "high",
            status: "todo",
            dueDate: dayjs().add(1, "day").format("YYYY-MM-DD"),
            createdAt: dayjs().subtract(2, "day").toISOString(),
            updatedAt: dayjs().subtract(1, "day").toISOString(),
          },
          {
            id: "2",
            title: "Prepare presentation for Global Media website project",
            description: "Create slides for the client presentation including wireframes and timeline.",
            priority: "medium",
            status: "in_progress",
            dueDate: dayjs().add(3, "day").format("YYYY-MM-DD"),
            createdAt: dayjs().subtract(3, "day").toISOString(),
            updatedAt: dayjs().subtract(1, "hour").toISOString(),
          },
          {
            id: "3",
            title: "Update CRM implementation timeline",
            description: "Review and update the project timeline based on recent developments.",
            priority: "medium",
            status: "completed",
            dueDate: dayjs().subtract(1, "day").format("YYYY-MM-DD"),
            createdAt: dayjs().subtract(5, "day").toISOString(),
            updatedAt: dayjs().subtract(1, "day").toISOString(),
          },
        ];
        setTasks(sampleTasks);
        localStorage.setItem("crm-tasks", JSON.stringify(sampleTasks));
      }
    } catch (error) {
      console.error("Error loading tasks:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveTask = React.useCallback((task: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setTasks(prev => {
      const updated = [...prev, newTask];
      localStorage.setItem("crm-tasks", JSON.stringify(updated));
      return updated;
    });

    return newTask;
  }, []);

  const updateTask = React.useCallback((id: string, updates: Partial<Task>) => {
    setTasks(prev => {
      const updated = prev.map(task =>
        task.id === id
          ? { ...task, ...updates, updatedAt: new Date().toISOString() }
          : task
      );
      localStorage.setItem("crm-tasks", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const deleteTask = React.useCallback((id: string) => {
    setTasks(prev => {
      const updated = prev.filter(task => task.id !== id);
      localStorage.setItem("crm-tasks", JSON.stringify(updated));
      return updated;
    });
  }, []);

  return { tasks, loading, saveTask, updateTask, deleteTask };
};

// Task Form Dialog Component
const TaskFormDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => void;
  editTask?: Task | null;
  users: User[];
}> = ({ open, onClose, onSave, editTask, users }) => {
  const [formData, setFormData] = React.useState({
    title: "",
    description: "",
    priority: "medium" as Task["priority"],
    status: "todo" as Task["status"],
    dueDate: null as Dayjs | null,
    assignedTo: null as User | null,
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    if (editTask) {
      setFormData({
        title: editTask.title,
        description: editTask.description,
        priority: editTask.priority,
        status: editTask.status,
        dueDate: editTask.dueDate ? dayjs(editTask.dueDate) : null,
        assignedTo: editTask.assignedTo || null,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        priority: "medium",
        status: "todo",
        dueDate: dayjs().add(1, "week"),
        assignedTo: null,
      });
    }
    setErrors({});
  }, [editTask, open]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    
    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    onSave({
      title: formData.title.trim(),
      description: formData.description.trim(),
      priority: formData.priority,
      status: formData.status,
      dueDate: formData.dueDate!.format("YYYY-MM-DD"),
      assignedTo: formData.assignedTo || undefined,
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {editTask ? "Edit Task" : "Create New Task"}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <TextField
            label="Task Title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            error={!!errors.title}
            helperText={errors.title}
            fullWidth
            required
          />

          <TextField
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            multiline
            rows={3}
            fullWidth
          />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={formData.priority}
                  label="Priority"
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as Task["priority"] }))}
                >
                  {Object.entries(priorityConfig).map(([key, config]) => (
                    <MenuItem key={key} value={key}>
                      <Chip
                        label={config.label}
                        color={config.color}
                        size="small"
                        variant="outlined"
                      />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  label="Status"
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Task["status"] }))}
                >
                  {Object.entries(statusConfig).map(([key, config]) => (
                    <MenuItem key={key} value={key}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <config.icon sx={{ fontSize: 16, color: config.color }} />
                        {config.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Due Date"
                  value={formData.dueDate}
                  onChange={(newValue) => setFormData(prev => ({ ...prev, dueDate: newValue }))}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.dueDate,
                      helperText: errors.dueDate,
                      required: true,
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>

          <Autocomplete
            options={users}
            value={formData.assignedTo}
            onChange={(_, newValue) => setFormData(prev => ({ ...prev, assignedTo: newValue }))}
            getOptionLabel={(option) => `${option.name.first} ${option.name.last} (${option.email})`}
            renderOption={(props, option) => (
              <Box component="li" {...props}>
                <Avatar
                  src={option.picture.thumbnail}
                  sx={{ width: 24, height: 24, mr: 1 }}
                >
                  {option.name.first[0]}{option.name.last[0]}
                </Avatar>
                {option.name.first} {option.name.last}
                <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                  {option.email}
                </Typography>
              </Box>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Assign to Team Member"
                placeholder="Search team members..."
                InputProps={{
                  ...params.InputProps,
                  startAdornment: <PersonIcon sx={{ mr: 1, color: "text.secondary" }} />,
                }}
              />
            )}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          {editTask ? "Update Task" : "Create Task"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Task Card Component
const TaskCard: React.FC<{
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (status: Task["status"]) => void;
}> = ({ task, onEdit, onDelete, onStatusChange }) => {
  const StatusIcon = statusConfig[task.status].icon;
  const isOverdue = dayjs(task.dueDate).isBefore(dayjs(), "day") && task.status !== "completed";

  return (
    <Card
      variant="outlined"
      sx={{
        mb: 2,
        opacity: task.status === "completed" ? 0.8 : 1,
        border: isOverdue ? "1px solid" : undefined,
        borderColor: isOverdue ? "error.main" : undefined,
      }}
    >
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
          <Stack spacing={1} sx={{ flexGrow: 1 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography
                variant="h6"
                sx={{
                  textDecoration: task.status === "completed" ? "line-through" : "none",
                  color: task.status === "completed" ? "text.secondary" : "text.primary",
                }}
              >
                {task.title}
              </Typography>
              {isOverdue && (
                <Chip label="Overdue" color="error" size="small" />
              )}
            </Stack>

            {task.description && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  textDecoration: task.status === "completed" ? "line-through" : "none",
                }}
              >
                {task.description}
              </Typography>
            )}

            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
              <Chip
                label={priorityConfig[task.priority].label}
                color={priorityConfig[task.priority].color}
                size="small"
                variant="outlined"
              />
              
              <Chip
                icon={<StatusIcon sx={{ fontSize: 16 }} />}
                label={statusConfig[task.status].label}
                size="small"
                sx={{
                  backgroundColor: `${statusConfig[task.status].color}15`,
                  color: statusConfig[task.status].color,
                  border: `1px solid ${statusConfig[task.status].color}30`,
                }}
                clickable
                onClick={() => {
                  const statuses: Task["status"][] = ["todo", "in_progress", "completed", "on_hold"];
                  const currentIndex = statuses.indexOf(task.status);
                  const nextStatus = statuses[(currentIndex + 1) % statuses.length];
                  onStatusChange(nextStatus);
                }}
              />

              <Tooltip title={`Due: ${dayjs(task.dueDate).format("MMM DD, YYYY")}`}>
                <Chip
                  icon={<CalendarIcon sx={{ fontSize: 16 }} />}
                  label={dayjs(task.dueDate).format("MMM DD")}
                  size="small"
                  variant="outlined"
                />
              </Tooltip>

              {task.assignedTo && (
                <Tooltip title={`Assigned to: ${task.assignedTo.name.first} ${task.assignedTo.name.last}`}>
                  <Avatar
                    src={task.assignedTo.picture.thumbnail}
                    sx={{ width: 24, height: 24 }}
                  >
                    {task.assignedTo.name.first[0]}{task.assignedTo.name.last[0]}
                  </Avatar>
                </Tooltip>
              )}
            </Stack>
          </Stack>

          <Stack direction="row" spacing={1}>
            <IconButton size="small" onClick={onEdit}>
              <EditIcon />
            </IconButton>
            <IconButton size="small" onClick={onDelete} color="error">
              <DeleteIcon />
            </IconButton>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

// Main Tasks Component
export default function Tasks() {
  const { users, loading: usersLoading, error: usersError } = useUsers();
  const { tasks, loading: tasksLoading, saveTask, updateTask, deleteTask } = useTasks();
  
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState<Task | null>(null);
  const [filterStatus, setFilterStatus] = React.useState<Task["status"] | "all">("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [snackbar, setSnackbar] = React.useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false,
    message: "",
    severity: "success",
  });

  const filteredTasks = React.useMemo(() => {
    return tasks
      .filter(task => filterStatus === "all" || task.status === filterStatus)
      .filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.assignedTo && 
          `${task.assignedTo.name.first} ${task.assignedTo.name.last}`.toLowerCase().includes(searchQuery.toLowerCase()))
      )
      .sort((a, b) => {
        // Sort by status priority (todo > in_progress > on_hold > completed)
        const statusOrder = { todo: 0, in_progress: 1, on_hold: 2, completed: 3 };
        if (statusOrder[a.status] !== statusOrder[b.status]) {
          return statusOrder[a.status] - statusOrder[b.status];
        }
        
        // Then by due date
        return dayjs(a.dueDate).diff(dayjs(b.dueDate));
      });
  }, [tasks, filterStatus, searchQuery]);

  const taskCounts = React.useMemo(() => {
    return tasks.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {} as Record<Task["status"], number>);
  }, [tasks]);

  const handleCreateTask = (taskData: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    try {
      saveTask(taskData);
      setSnackbar({
        open: true,
        message: "Task created successfully!",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to create task. Please try again.",
        severity: "error",
      });
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setDialogOpen(true);
  };

  const handleUpdateTask = (taskData: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    if (!editingTask) return;
    
    try {
      updateTask(editingTask.id, taskData);
      setSnackbar({
        open: true,
        message: "Task updated successfully!",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to update task. Please try again.",
        severity: "error",
      });
    }
  };

  const handleDeleteTask = (taskId: string) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        deleteTask(taskId);
        setSnackbar({
          open: true,
          message: "Task deleted successfully!",
          severity: "success",
        });
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Failed to delete task. Please try again.",
          severity: "error",
        });
      }
    }
  };

  const handleStatusChange = (taskId: string, status: Task["status"]) => {
    updateTask(taskId, { status });
    setSnackbar({
      open: true,
      message: `Task marked as ${statusConfig[status].label.toLowerCase()}!`,
      severity: "success",
    });
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingTask(null);
  };

  if (tasksLoading || usersLoading) {
    return (
      <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
        <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
          Tasks
        </Typography>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1">
            Tasks Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setDialogOpen(true)}
          >
            Create Task
          </Button>
        </Stack>

        {/* Error Alert */}
        {usersError && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            Unable to load team members: {usersError}. You can still create tasks without assignment.
          </Alert>
        )}

        {/* Filters and Search */}
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
              <TextField
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />,
                }}
                size="small"
                sx={{ minWidth: 300 }}
              />

              <Tabs
                value={filterStatus}
                onChange={(_, newValue) => setFilterStatus(newValue)}
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab label={`All (${tasks.length})`} value="all" />
                {Object.entries(statusConfig).map(([status, config]) => (
                  <Tab
                    key={status}
                    label={`${config.label} (${taskCounts[status as Task["status"]] || 0})`}
                    value={status}
                    icon={<config.icon sx={{ fontSize: 16 }} />}
                    iconPosition="start"
                  />
                ))}
              </Tabs>
            </Stack>
          </CardContent>
        </Card>

        {/* Tasks List */}
        {filteredTasks.length === 0 ? (
          <Card variant="outlined">
            <CardContent sx={{ textAlign: "center", py: 6 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {searchQuery || filterStatus !== "all" 
                  ? "No tasks match your current filters"
                  : "No tasks yet"
                }
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {searchQuery || filterStatus !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "Create your first task to get started"
                }
              </Typography>
              {!searchQuery && filterStatus === "all" && (
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setDialogOpen(true)}
                >
                  Create Your First Task
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <Stack spacing={2}>
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={() => handleEditTask(task)}
                onDelete={() => handleDeleteTask(task.id)}
                onStatusChange={(status) => handleStatusChange(task.id, status)}
              />
            ))}
          </Stack>
        )}

        {/* Task Form Dialog */}
        <TaskFormDialog
          open={dialogOpen}
          onClose={closeDialog}
          onSave={editingTask ? handleUpdateTask : handleCreateTask}
          editTask={editingTask}
          users={users}
        />

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        >
          <Alert
            onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </LocalizationProvider>
  );
}
