import * as React from "react";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Fab from "@mui/material/Fab";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Chip from "@mui/material/Chip";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import FilterListIcon from "@mui/icons-material/FilterList";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";

// Task interface
interface Task {
  id: number;
  title: string;
  description: string;
  assignedTo: string;
  assigneeAvatar: string;
  priority: "high" | "medium" | "low";
  status: "in_progress" | "completed" | "on_hold";
  dueDate: string;
  createdDate: string;
  reminderEnabled: boolean;
  category: string;
}

// Team members data (simulated)
const teamMembers = [
  { id: "1", name: "John Doe", avatar: "JD", email: "john.doe@company.com" },
  { id: "2", name: "Sarah Smith", avatar: "SS", email: "sarah.smith@company.com" },
  { id: "3", name: "Mike Johnson", avatar: "MJ", email: "mike.johnson@company.com" },
  { id: "4", name: "Emily Chen", avatar: "EC", email: "emily.chen@company.com" },
  { id: "5", name: "David Wilson", avatar: "DW", email: "david.wilson@company.com" },
];

// Initial task data (simulated)
const initialTasks: Task[] = [
  {
    id: 1,
    title: "Complete Q4 Financial Review",
    description: "Analyze quarterly financial data and prepare executive summary",
    assignedTo: "John Doe",
    assigneeAvatar: "JD",
    priority: "high",
    status: "in_progress",
    dueDate: "2024-02-15",
    createdDate: "2024-01-10",
    reminderEnabled: true,
    category: "Finance"
  },
  {
    id: 2,
    title: "Update Marketing Campaign Assets",
    description: "Create new promotional materials for spring campaign",
    assignedTo: "Sarah Smith",
    assigneeAvatar: "SS",
    priority: "medium",
    status: "in_progress",
    dueDate: "2024-02-20",
    createdDate: "2024-01-12",
    reminderEnabled: true,
    category: "Marketing"
  },
  {
    id: 3,
    title: "Customer Satisfaction Survey Analysis",
    description: "Compile and analyze customer feedback data from last quarter",
    assignedTo: "Mike Johnson",
    assigneeAvatar: "MJ",
    priority: "low",
    status: "completed",
    dueDate: "2024-01-30",
    createdDate: "2024-01-05",
    reminderEnabled: false,
    category: "Research"
  },
  {
    id: 4,
    title: "Security Protocol Review",
    description: "Audit current security measures and recommend improvements",
    assignedTo: "Emily Chen",
    assigneeAvatar: "EC",
    priority: "high",
    status: "on_hold",
    dueDate: "2024-02-25",
    createdDate: "2024-01-08",
    reminderEnabled: true,
    category: "IT"
  },
  {
    id: 5,
    title: "Employee Training Module Development",
    description: "Design interactive training modules for new employee onboarding",
    assignedTo: "David Wilson",
    assigneeAvatar: "DW",
    priority: "medium",
    status: "in_progress",
    dueDate: "2024-03-01",
    createdDate: "2024-01-15",
    reminderEnabled: true,
    category: "HR"
  }
];

// Helper functions for formatting and colors
const getPriorityColor = (priority: string): "default" | "primary" | "warning" | "error" => {
  switch (priority) {
    case "high": return "error";
    case "medium": return "warning";
    case "low": return "primary";
    default: return "default";
  }
};

const getStatusColor = (status: string): "default" | "primary" | "success" | "warning" => {
  switch (status) {
    case "completed": return "success";
    case "in_progress": return "primary";
    case "on_hold": return "warning";
    default: return "default";
  }
};

const formatDate = (dateString: string) => {
  return dayjs(dateString).format("MMM DD, YYYY");
};

const isOverdue = (dueDate: string, status: string) => {
  return status !== "completed" && dayjs(dueDate).isBefore(dayjs(), "day");
};

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>(initialTasks);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [priorityFilter, setPriorityFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assignedTo: "",
    priority: "medium" as Task["priority"],
    status: "in_progress" as Task["status"],
    dueDate: dayjs().add(7, "day"),
    reminderEnabled: true,
    category: ""
  });

  // Filter and search logic
  useEffect(() => {
    let filtered = [...tasks];
    
    // Filter by tab (status)
    if (activeTab === 1) filtered = filtered.filter(task => task.status === "in_progress");
    if (activeTab === 2) filtered = filtered.filter(task => task.status === "completed");
    if (activeTab === 3) filtered = filtered.filter(task => task.status === "on_hold");
    if (activeTab === 4) filtered = filtered.filter(task => isOverdue(task.dueDate, task.status));
    
    // Filter by priority
    if (priorityFilter.length > 0) {
      filtered = filtered.filter(task => priorityFilter.includes(task.priority));
    }
    
    // Filter by status
    if (statusFilter.length > 0) {
      filtered = filtered.filter(task => statusFilter.includes(task.status));
    }
    
    setFilteredTasks(filtered);
  }, [tasks, activeTab, priorityFilter, statusFilter]);

  const handleCreateTask = () => {
    const assignedMember = teamMembers.find(member => member.name === formData.assignedTo);
    const newTask: Task = {
      id: Math.max(...tasks.map(t => t.id)) + 1,
      title: formData.title,
      description: formData.description,
      assignedTo: formData.assignedTo,
      assigneeAvatar: assignedMember?.avatar || "??",
      priority: formData.priority,
      status: formData.status,
      dueDate: formData.dueDate.format("YYYY-MM-DD"),
      createdDate: dayjs().format("YYYY-MM-DD"),
      reminderEnabled: formData.reminderEnabled,
      category: formData.category
    };
    
    setTasks([...tasks, newTask]);
    handleCloseDialog();
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      assignedTo: task.assignedTo,
      priority: task.priority,
      status: task.status,
      dueDate: dayjs(task.dueDate),
      reminderEnabled: task.reminderEnabled,
      category: task.category
    });
    setOpenDialog(true);
  };

  const handleUpdateTask = () => {
    if (!editingTask) return;
    
    const assignedMember = teamMembers.find(member => member.name === formData.assignedTo);
    const updatedTask: Task = {
      ...editingTask,
      title: formData.title,
      description: formData.description,
      assignedTo: formData.assignedTo,
      assigneeAvatar: assignedMember?.avatar || "??",
      priority: formData.priority,
      status: formData.status,
      dueDate: formData.dueDate.format("YYYY-MM-DD"),
      reminderEnabled: formData.reminderEnabled,
      category: formData.category
    };
    
    setTasks(tasks.map(task => task.id === editingTask.id ? updatedTask : task));
    handleCloseDialog();
  };

  const handleDeleteTask = (taskId: number) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleOpenDialog = () => {
    setEditingTask(null);
    setFormData({
      title: "",
      description: "",
      assignedTo: "",
      priority: "medium",
      status: "in_progress",
      dueDate: dayjs().add(7, "day"),
      reminderEnabled: true,
      category: ""
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingTask(null);
  };

  const togglePriorityFilter = (priority: string) => {
    setPriorityFilter(prev => 
      prev.includes(priority) 
        ? prev.filter(p => p !== priority)
        : [...prev, priority]
    );
  };

  const toggleStatusFilter = (status: string) => {
    setStatusFilter(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  // Statistics calculations
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === "completed").length;
  const inProgressTasks = tasks.filter(task => task.status === "in_progress").length;
  const overdueTasks = tasks.filter(task => isOverdue(task.dueDate, task.status)).length;
  const highPriorityTasks = tasks.filter(task => task.priority === "high" && task.status !== "completed").length;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
        <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
          Task Management
        </Typography>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography color="text.secondary" gutterBottom variant="body2">
                      Total Tasks
                    </Typography>
                    <Typography variant="h4" component="div">
                      {totalTasks}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: "primary.main" }}>
                    <AccessTimeIcon />
                  </Avatar>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography color="text.secondary" gutterBottom variant="body2">
                      In Progress
                    </Typography>
                    <Typography variant="h4" component="div">
                      {inProgressTasks}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: "info.main" }}>
                    <AccessTimeIcon />
                  </Avatar>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography color="text.secondary" gutterBottom variant="body2">
                      Completed
                    </Typography>
                    <Typography variant="h4" component="div">
                      {completedTasks}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: "success.main" }}>
                    <AccessTimeIcon />
                  </Avatar>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography color="text.secondary" gutterBottom variant="body2">
                      Overdue
                    </Typography>
                    <Typography variant="h4" component="div">
                      {overdueTasks}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: "error.main" }}>
                    <AccessTimeIcon />
                  </Avatar>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography color="text.secondary" gutterBottom variant="body2">
                      High Priority
                    </Typography>
                    <Typography variant="h4" component="div">
                      {highPriorityTasks}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: "warning.main" }}>
                    <PriorityHighIcon />
                  </Avatar>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Filters and Controls */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems="center">
              <Stack direction="row" spacing={1} alignItems="center">
                <FilterListIcon />
                <Typography variant="subtitle2">Priority:</Typography>
                <ToggleButtonGroup size="small" value={priorityFilter} onChange={(_, newFilter) => setPriorityFilter(newFilter)}>
                  <ToggleButton value="high" color="error">High</ToggleButton>
                  <ToggleButton value="medium" color="warning">Medium</ToggleButton>
                  <ToggleButton value="low" color="primary">Low</ToggleButton>
                </ToggleButtonGroup>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="subtitle2">Status:</Typography>
                <ToggleButtonGroup size="small" value={statusFilter} onChange={(_, newFilter) => setStatusFilter(newFilter)}>
                  <ToggleButton value="in_progress" color="primary">In Progress</ToggleButton>
                  <ToggleButton value="completed" color="success">Completed</ToggleButton>
                  <ToggleButton value="on_hold" color="warning">On Hold</ToggleButton>
                </ToggleButtonGroup>
              </Stack>
              <Box sx={{ flexGrow: 1 }} />
              <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenDialog}>
                Create Task
              </Button>
            </Stack>
          </CardContent>
        </Card>

        {/* Task Tabs */}
        <Card>
          <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)} sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tab label={`All Tasks (${tasks.length})`} />
            <Tab label={`In Progress (${inProgressTasks})`} />
            <Tab label={`Completed (${completedTasks})`} />
            <Tab label={`On Hold (${tasks.filter(t => t.status === "on_hold").length})`} />
            <Tab label={`Overdue (${overdueTasks})`} />
          </Tabs>

          {/* Task Table */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Task</TableCell>
                  <TableCell>Assigned To</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Reminders</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTasks.map((task) => (
                  <TableRow key={task.id} hover sx={{ 
                    backgroundColor: isOverdue(task.dueDate, task.status) ? "error.50" : "inherit" 
                  }}>
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {task.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {task.description}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Avatar sx={{ width: 32, height: 32, fontSize: "0.875rem" }}>
                          {task.assigneeAvatar}
                        </Avatar>
                        <Typography variant="body2">{task.assignedTo}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={task.priority.toUpperCase()}
                        size="small"
                        color={getPriorityColor(task.priority)}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={task.status.replace("_", " ").toUpperCase()}
                        size="small"
                        color={getStatusColor(task.status)}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color={isOverdue(task.dueDate, task.status) ? "error.main" : "inherit"}>
                        {formatDate(task.dueDate)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{task.category}</Typography>
                    </TableCell>
                    <TableCell>
                      {task.reminderEnabled ? (
                        <NotificationsActiveIcon color="primary" fontSize="small" />
                      ) : (
                        <NotificationsIcon color="disabled" fontSize="small" />
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1}>
                        <IconButton size="small" onClick={() => handleEditTask(task)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleDeleteTask(task.id)} color="error">
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredTasks.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <Typography color="text.secondary" sx={{ py: 4 }}>
                        No tasks found matching the current filters
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        {/* Floating Action Button */}
        <Fab
          color="primary"
          aria-label="add task"
          sx={{ position: "fixed", bottom: 16, right: 16 }}
          onClick={handleOpenDialog}
        >
          <AddIcon />
        </Fab>

        {/* Create/Edit Task Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>
            {editingTask ? "Edit Task" : "Create New Task"}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Task Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Assign To</InputLabel>
                  <Select
                    value={formData.assignedTo}
                    label="Assign To"
                    onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                  >
                    {teamMembers.map((member) => (
                      <MenuItem key={member.id} value={member.name}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Avatar sx={{ width: 24, height: 24, fontSize: "0.75rem" }}>
                            {member.avatar}
                          </Avatar>
                          <Typography>{member.name}</Typography>
                        </Stack>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={formData.priority}
                    label="Priority"
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as Task["priority"] })}
                  >
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={formData.status}
                    label="Status"
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as Task["status"] })}
                  >
                    <MenuItem value="in_progress">In Progress</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="on_hold">On Hold</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <DatePicker
                  label="Due Date"
                  value={formData.dueDate}
                  onChange={(newValue) => newValue && setFormData({ ...formData, dueDate: newValue })}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button
              variant="contained"
              onClick={editingTask ? handleUpdateTask : handleCreateTask}
              disabled={!formData.title || !formData.assignedTo}
            >
              {editingTask ? "Update Task" : "Create Task"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
}
