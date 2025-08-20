import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Checkbox from "@mui/material/Checkbox";
import LinearProgress from "@mui/material/LinearProgress";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import AssignmentTurnedInRoundedIcon from "@mui/icons-material/AssignmentTurnedInRounded";
import PriorityHighRoundedIcon from "@mui/icons-material/PriorityHighRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";

// Types
interface Task {
  id: string;
  title: string;
  description: string;
  assignee: {
    id: string;
    name: string;
    avatar: string;
  };
  priority: "high" | "medium" | "low";
  status: "todo" | "in_progress" | "completed" | "on_hold";
  dueDate: string;
  createdAt: string;
  reminderEnabled: boolean;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

// Mock data for team members
const teamMembers: TeamMember[] = [
  { id: "1", name: "John Doe", email: "john@example.com", avatar: "JD" },
  { id: "2", name: "Jane Smith", email: "jane@example.com", avatar: "JS" },
  { id: "3", name: "Mike Johnson", email: "mike@example.com", avatar: "MJ" },
  { id: "4", name: "Sarah Wilson", email: "sarah@example.com", avatar: "SW" },
  { id: "5", name: "David Brown", email: "david@example.com", avatar: "DB" },
];

// Sample tasks data
const initialTasks: Task[] = [
  {
    id: "1",
    title: "Review Q4 budget proposal",
    description: "Analyze the proposed budget for Q4 and provide feedback on resource allocation",
    assignee: teamMembers[0],
    priority: "high",
    status: "in_progress",
    dueDate: "2024-01-15",
    createdAt: "2024-01-01",
    reminderEnabled: true,
  },
  {
    id: "2",
    title: "Update client presentation",
    description: "Revise the presentation slides with latest project updates",
    assignee: teamMembers[1],
    priority: "medium",
    status: "todo",
    dueDate: "2024-01-20",
    createdAt: "2024-01-02",
    reminderEnabled: true,
  },
  {
    id: "3",
    title: "Complete API integration testing",
    description: "Test all API endpoints for the new payment integration feature",
    assignee: teamMembers[2],
    priority: "high",
    status: "on_hold",
    dueDate: "2024-01-18",
    createdAt: "2024-01-03",
    reminderEnabled: false,
  },
  {
    id: "4",
    title: "Documentation update",
    description: "Update user documentation with new feature descriptions",
    assignee: teamMembers[3],
    priority: "low",
    status: "completed",
    dueDate: "2024-01-10",
    createdAt: "2024-01-04",
    reminderEnabled: false,
  },
];

// Helper functions
const getPriorityColor = (priority: string): "error" | "warning" | "default" => {
  switch (priority) {
    case "high": return "error";
    case "medium": return "warning";
    default: return "default";
  }
};

const getStatusColor = (status: string): "primary" | "success" | "warning" | "default" => {
  switch (status) {
    case "todo": return "default";
    case "in_progress": return "primary";
    case "completed": return "success";
    case "on_hold": return "warning";
    default: return "default";
  }
};

const getStatusProgress = (status: string): number => {
  switch (status) {
    case "todo": return 0;
    case "in_progress": return 50;
    case "completed": return 100;
    case "on_hold": return 25;
    default: return 0;
  }
};

const formatDate = (dateString: string) => {
  return dayjs(dateString).format("MMM DD, YYYY");
};

const isOverdue = (dueDate: string, status: string) => {
  return status !== "completed" && dayjs(dueDate).isBefore(dayjs(), "day");
};

// Task form component
interface TaskFormProps {
  open: boolean;
  task?: Task | null;
  onClose: () => void;
  onSave: (task: Omit<Task, "id" | "createdAt">) => void;
}

function TaskForm({ open, task, onClose, onSave }: TaskFormProps) {
  const [formData, setFormData] = React.useState({
    title: "",
    description: "",
    assigneeId: "",
    priority: "medium" as Task["priority"],
    status: "todo" as Task["status"],
    dueDate: dayjs().add(1, "week"),
    reminderEnabled: true,
  });

  React.useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        assigneeId: task.assignee.id,
        priority: task.priority,
        status: task.status,
        dueDate: dayjs(task.dueDate),
        reminderEnabled: task.reminderEnabled,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        assigneeId: "",
        priority: "medium",
        status: "todo",
        dueDate: dayjs().add(1, "week"),
        reminderEnabled: true,
      });
    }
  }, [task, open]);

  const handleSubmit = () => {
    const assignee = teamMembers.find(member => member.id === formData.assigneeId);
    if (!assignee || !formData.title.trim()) return;

    onSave({
      title: formData.title.trim(),
      description: formData.description.trim(),
      assignee,
      priority: formData.priority,
      status: formData.status,
      dueDate: formData.dueDate.format("YYYY-MM-DD"),
      reminderEnabled: formData.reminderEnabled,
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{task ? "Edit Task" : "Create New Task"}</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <TextField
            label="Task Title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
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

          <FormControl fullWidth required>
            <InputLabel>Assignee</InputLabel>
            <Select
              value={formData.assigneeId}
              onChange={(e) => setFormData(prev => ({ ...prev, assigneeId: e.target.value }))}
              label="Assignee"
            >
              {teamMembers.map((member) => (
                <MenuItem key={member.id} value={member.id}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Avatar sx={{ width: 24, height: 24, fontSize: "0.75rem" }}>
                      {member.avatar}
                    </Avatar>
                    {member.name}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={formData.priority}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as Task["priority"] }))}
                  label="Priority"
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Task["status"] }))}
                  label="Status"
                >
                  <MenuItem value="todo">To Do</MenuItem>
                  <MenuItem value="in_progress">In Progress</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="on_hold">On Hold</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Due Date"
              value={formData.dueDate}
              onChange={(date) => setFormData(prev => ({ ...prev, dueDate: date || dayjs() }))}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </LocalizationProvider>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Checkbox
              checked={formData.reminderEnabled}
              onChange={(e) => setFormData(prev => ({ ...prev, reminderEnabled: e.target.checked }))}
            />
            <Typography>Enable reminders</Typography>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          disabled={!formData.title.trim() || !formData.assigneeId}
        >
          {task ? "Update" : "Create"} Task
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function Tasks() {
  const [tasks, setTasks] = React.useState<Task[]>(initialTasks);
  const [filteredTasks, setFilteredTasks] = React.useState<Task[]>(initialTasks);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [priorityFilter, setPriorityFilter] = React.useState<string>("all");
  const [assigneeFilter, setAssigneeFilter] = React.useState<string>("all");
  const [taskFormOpen, setTaskFormOpen] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState<Task | null>(null);

  // Filter tasks based on search and filters
  React.useEffect(() => {
    let filtered = tasks;

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.assignee.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    // Priority filter
    if (priorityFilter !== "all") {
      filtered = filtered.filter(task => task.priority === priorityFilter);
    }

    // Assignee filter
    if (assigneeFilter !== "all") {
      filtered = filtered.filter(task => task.assignee.id === assigneeFilter);
    }

    setFilteredTasks(filtered);
  }, [tasks, searchQuery, statusFilter, priorityFilter, assigneeFilter]);

  const handleCreateTask = (taskData: Omit<Task, "id" | "createdAt">) => {
    const newTask: Task = {
      ...taskData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: dayjs().format("YYYY-MM-DD"),
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const handleEditTask = (taskData: Omit<Task, "id" | "createdAt">) => {
    if (!editingTask) return;
    setTasks(prev => prev.map(task => 
      task.id === editingTask.id 
        ? { ...taskData, id: task.id, createdAt: task.createdAt }
        : task
    ));
    setEditingTask(null);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const handleToggleTaskStatus = (taskId: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const newStatus = task.status === "completed" ? "todo" : "completed";
        return { ...task, status: newStatus };
      }
      return task;
    }));
  };

  const openEditForm = (task: Task) => {
    setEditingTask(task);
    setTaskFormOpen(true);
  };

  const closeTaskForm = () => {
    setTaskFormOpen(false);
    setEditingTask(null);
  };

  // Calculate statistics
  const stats = React.useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.status === "completed").length;
    const inProgress = tasks.filter(task => task.status === "in_progress").length;
    const overdue = tasks.filter(task => isOverdue(task.dueDate, task.status)).length;
    
    return { total, completed, inProgress, overdue };
  }, [tasks]);

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      {/* Header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h4" component="h1" sx={{ mb: 1, fontWeight: 600 }}>
            Task Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Create, assign, and track tasks across your team
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddRoundedIcon />}
          onClick={() => setTaskFormOpen(true)}
          size="large"
        >
          Create Task
        </Button>
      </Stack>

      {/* Statistics Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1}>
                <AssignmentTurnedInRoundedIcon color="primary" />
                <Box>
                  <Typography variant="h4" component="div">
                    {stats.total}
                  </Typography>
                  <Typography color="text.secondary">Total Tasks</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1}>
                <AccessTimeRoundedIcon color="warning" />
                <Box>
                  <Typography variant="h4" component="div">
                    {stats.inProgress}
                  </Typography>
                  <Typography color="text.secondary">In Progress</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1}>
                <AssignmentTurnedInRoundedIcon color="success" />
                <Box>
                  <Typography variant="h4" component="div">
                    {stats.completed}
                  </Typography>
                  <Typography color="text.secondary">Completed</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1}>
                <PriorityHighRoundedIcon color="error" />
                <Box>
                  <Typography variant="h4" component="div">
                    {stats.overdue}
                  </Typography>
                  <Typography color="text.secondary">Overdue</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters and Search */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: <SearchRoundedIcon color="action" sx={{ mr: 1 }} />,
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={4} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="Status"
                >
                  <MenuItem value="all">All Statuses</MenuItem>
                  <MenuItem value="todo">To Do</MenuItem>
                  <MenuItem value="in_progress">In Progress</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="on_hold">On Hold</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={4} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Priority</InputLabel>
                <Select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  label="Priority"
                >
                  <MenuItem value="all">All Priorities</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={4} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Assignee</InputLabel>
                <Select
                  value={assigneeFilter}
                  onChange={(e) => setAssigneeFilter(e.target.value)}
                  label="Assignee"
                >
                  <MenuItem value="all">All Assignees</MenuItem>
                  {teamMembers.map((member) => (
                    <MenuItem key={member.id} value={member.id}>
                      {member.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FilterListRoundedIcon />}
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                  setPriorityFilter("all");
                  setAssigneeFilter("all");
                }}
              >
                Clear Filters
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tasks List */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          {filteredTasks.length === 0 ? (
            <Box sx={{ p: 4, textAlign: "center" }}>
              <Typography variant="h6" color="text.secondary">
                {tasks.length === 0 ? "No tasks yet" : "No tasks match your filters"}
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                {tasks.length === 0 
                  ? "Create your first task to get started"
                  : "Try adjusting your search or filter criteria"
                }
              </Typography>
            </Box>
          ) : (
            <List>
              {filteredTasks.map((task, index) => (
                <ListItem
                  key={task.id}
                  divider={index !== filteredTasks.length - 1}
                  secondaryAction={
                    <Stack direction="row" spacing={1}>
                      <IconButton
                        edge="end"
                        onClick={() => openEditForm(task)}
                        aria-label="edit task"
                      >
                        <EditRoundedIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        onClick={() => handleDeleteTask(task.id)}
                        aria-label="delete task"
                        color="error"
                      >
                        <DeleteRoundedIcon />
                      </IconButton>
                    </Stack>
                  }
                >
                  <ListItemIcon>
                    <Checkbox
                      checked={task.status === "completed"}
                      onChange={() => handleToggleTaskStatus(task.id)}
                      color="success"
                    />
                  </ListItemIcon>
                  
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: "primary.main" }}>
                      {task.assignee.avatar}
                    </Avatar>
                  </ListItemAvatar>
                  
                  <ListItemText
                    primary={
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            textDecoration: task.status === "completed" ? "line-through" : "none",
                            color: task.status === "completed" ? "text.secondary" : "text.primary",
                          }}
                        >
                          {task.title}
                        </Typography>
                        {task.reminderEnabled && (
                          <Chip
                            label="Reminder On"
                            size="small"
                            color="info"
                            variant="outlined"
                            sx={{ height: 20 }}
                          />
                        )}
                        {isOverdue(task.dueDate, task.status) && (
                          <Chip
                            label="Overdue"
                            size="small"
                            color="error"
                            sx={{ height: 20 }}
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <Stack spacing={1}>
                        <Typography variant="body2" color="text.secondary">
                          {task.description}
                        </Typography>
                        
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
                          <Chip
                            label={task.priority.toUpperCase()}
                            size="small"
                            color={getPriorityColor(task.priority)}
                            variant="outlined"
                            sx={{ height: 20 }}
                          />
                          
                          <Chip
                            label={task.status.replace("_", " ").toUpperCase()}
                            size="small"
                            color={getStatusColor(task.status)}
                            sx={{ height: 20 }}
                          />
                          
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <PersonRoundedIcon fontSize="small" color="action" />
                            <Typography variant="caption">
                              {task.assignee.name}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <AccessTimeRoundedIcon fontSize="small" color="action" />
                            <Typography variant="caption">
                              Due: {formatDate(task.dueDate)}
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Box sx={{ mt: 1 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                            <Typography variant="caption" color="text.secondary">
                              Progress
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {getStatusProgress(task.status)}%
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={getStatusProgress(task.status)}
                            sx={{ height: 4, borderRadius: 2 }}
                          />
                        </Box>
                      </Stack>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      {/* Task Form Dialog */}
      <TaskForm
        open={taskFormOpen}
        task={editingTask}
        onClose={closeTaskForm}
        onSave={editingTask ? handleEditTask : handleCreateTask}
      />
    </Box>
  );
}
