import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Badge from "@mui/material/Badge";
import Tooltip from "@mui/material/Tooltip";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import AddIcon from "@mui/icons-material/Add";
import FilterListIcon from "@mui/icons-material/FilterList";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import NotificationsIcon from "@mui/icons-material/Notifications";

// Types
interface Task {
  id: string;
  title: string;
  description: string;
  assignee: TeamMember;
  priority: "high" | "medium" | "low";
  status: "pending" | "in_progress" | "completed" | "on_hold";
  dueDate: Dayjs;
  createdDate: Dayjs;
  reminderEnabled: boolean;
  reminderDate?: Dayjs;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

// Sample data
const teamMembers: TeamMember[] = [
  { id: "1", name: "Alex Thompson", email: "alex@acmecrm.com", avatar: "/static/images/avatar/1.jpg" },
  { id: "2", name: "Sarah Johnson", email: "sarah@acmecrm.com", avatar: "/static/images/avatar/2.jpg" },
  { id: "3", name: "Mike Chen", email: "mike@acmecrm.com", avatar: "/static/images/avatar/3.jpg" },
  { id: "4", name: "Emily Davis", email: "emily@acmecrm.com", avatar: "/static/images/avatar/4.jpg" },
  { id: "5", name: "John Williams", email: "john@acmecrm.com", avatar: "/static/images/avatar/5.jpg" },
];

const initialTasks: Task[] = [
  {
    id: "1",
    title: "Follow up with TechSolutions Inc on cloud proposal",
    description: "Contact the client to discuss the cloud migration proposal and gather feedback.",
    assignee: teamMembers[0],
    priority: "high",
    status: "in_progress",
    dueDate: dayjs().add(1, "day"),
    createdDate: dayjs().subtract(2, "days"),
    reminderEnabled: true,
    reminderDate: dayjs().add(1, "day").subtract(2, "hours"),
  },
  {
    id: "2",
    title: "Prepare presentation for Global Media website project",
    description: "Create a comprehensive presentation covering the website redesign project timeline and deliverables.",
    assignee: teamMembers[1],
    priority: "medium",
    status: "pending",
    dueDate: dayjs().add(3, "days"),
    createdDate: dayjs().subtract(1, "day"),
    reminderEnabled: true,
    reminderDate: dayjs().add(2, "days"),
  },
  {
    id: "3",
    title: "Call HealthCare Pro about contract details",
    description: "Discuss contract terms and negotiate pricing for the new healthcare management system.",
    assignee: teamMembers[2],
    priority: "high",
    status: "pending",
    dueDate: dayjs(),
    createdDate: dayjs().subtract(3, "days"),
    reminderEnabled: false,
  },
  {
    id: "4",
    title: "Update CRM implementation timeline",
    description: "Revise the project timeline based on client feedback and resource availability.",
    assignee: teamMembers[0],
    priority: "medium",
    status: "completed",
    dueDate: dayjs().subtract(1, "day"),
    createdDate: dayjs().subtract(5, "days"),
    reminderEnabled: false,
  },
  {
    id: "5",
    title: "Review security audit report",
    description: "Analyze the security audit findings and prepare action items for the development team.",
    assignee: teamMembers[3],
    priority: "high",
    status: "on_hold",
    dueDate: dayjs().add(7, "days"),
    createdDate: dayjs().subtract(4, "days"),
    reminderEnabled: true,
    reminderDate: dayjs().add(5, "days"),
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

const getStatusColor = (status: string): "success" | "info" | "warning" | "default" => {
  switch (status) {
    case "completed": return "success";
    case "in_progress": return "info";
    case "on_hold": return "warning";
    default: return "default";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed": return <AssignmentTurnedInIcon />;
    case "in_progress": return <PlayArrowIcon />;
    case "on_hold": return <PauseIcon />;
    default: return <AccessTimeIcon />;
  }
};

const formatStatus = (status: string): string => {
  return status.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase());
};

export default function Tasks() {
  const [tasks, setTasks] = React.useState<Task[]>(initialTasks);
  const [filteredTasks, setFilteredTasks] = React.useState<Task[]>(initialTasks);
  const [currentTab, setCurrentTab] = React.useState(0);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState<Task | null>(null);
  const [filterStatus, setFilterStatus] = React.useState<string>("all");
  const [filterPriority, setFilterPriority] = React.useState<string>("all");
  const [filterAssignee, setFilterAssignee] = React.useState<string>("all");
  const [snackbar, setSnackbar] = React.useState({ open: false, message: "", severity: "success" as "success" | "error" });

  // Form state
  const [formData, setFormData] = React.useState({
    title: "",
    description: "",
    assigneeId: "",
    priority: "medium" as const,
    status: "pending" as const,
    dueDate: dayjs().add(1, "day"),
    reminderEnabled: false,
    reminderDate: dayjs().add(1, "day").subtract(1, "hour"),
  });

  // Filter tasks based on current filters
  React.useEffect(() => {
    let filtered = tasks;

    // Tab filtering
    if (currentTab === 1) filtered = filtered.filter(task => task.status === "pending");
    else if (currentTab === 2) filtered = filtered.filter(task => task.status === "in_progress");
    else if (currentTab === 3) filtered = filtered.filter(task => task.status === "completed");
    else if (currentTab === 4) filtered = filtered.filter(task => task.status === "on_hold");
    else if (currentTab === 5) filtered = filtered.filter(task => dayjs(task.dueDate).isBefore(dayjs(), "day") && task.status !== "completed");

    // Additional filters
    if (filterStatus !== "all") filtered = filtered.filter(task => task.status === filterStatus);
    if (filterPriority !== "all") filtered = filtered.filter(task => task.priority === filterPriority);
    if (filterAssignee !== "all") filtered = filtered.filter(task => task.assignee.id === filterAssignee);

    setFilteredTasks(filtered);
  }, [tasks, currentTab, filterStatus, filterPriority, filterAssignee]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleOpenDialog = (task?: Task) => {
    if (task) {
      setEditingTask(task);
      setFormData({
        title: task.title,
        description: task.description,
        assigneeId: task.assignee.id,
        priority: task.priority,
        status: task.status,
        dueDate: task.dueDate,
        reminderEnabled: task.reminderEnabled,
        reminderDate: task.reminderDate || dayjs().add(1, "day").subtract(1, "hour"),
      });
    } else {
      setEditingTask(null);
      setFormData({
        title: "",
        description: "",
        assigneeId: "",
        priority: "medium",
        status: "pending",
        dueDate: dayjs().add(1, "day"),
        reminderEnabled: false,
        reminderDate: dayjs().add(1, "day").subtract(1, "hour"),
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingTask(null);
  };

  const handleSaveTask = () => {
    const assignee = teamMembers.find(member => member.id === formData.assigneeId);
    if (!assignee) {
      setSnackbar({ open: true, message: "Please select an assignee", severity: "error" });
      return;
    }

    const taskData: Task = {
      id: editingTask?.id || Date.now().toString(),
      title: formData.title,
      description: formData.description,
      assignee,
      priority: formData.priority,
      status: formData.status,
      dueDate: formData.dueDate,
      createdDate: editingTask?.createdDate || dayjs(),
      reminderEnabled: formData.reminderEnabled,
      reminderDate: formData.reminderEnabled ? formData.reminderDate : undefined,
    };

    if (editingTask) {
      setTasks(tasks.map(task => task.id === editingTask.id ? taskData : task));
      setSnackbar({ open: true, message: "Task updated successfully", severity: "success" });
    } else {
      setTasks([...tasks, taskData]);
      setSnackbar({ open: true, message: "Task created successfully", severity: "success" });
    }

    handleCloseDialog();
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    setSnackbar({ open: true, message: "Task deleted successfully", severity: "success" });
  };

  const handleToggleTaskStatus = (taskId: string) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const newStatus = task.status === "completed" ? "pending" : 
                         task.status === "pending" ? "in_progress" :
                         task.status === "in_progress" ? "completed" : "pending";
        return { ...task, status: newStatus };
      }
      return task;
    }));
  };

  const getTabCounts = () => {
    return {
      all: tasks.length,
      pending: tasks.filter(t => t.status === "pending").length,
      in_progress: tasks.filter(t => t.status === "in_progress").length,
      completed: tasks.filter(t => t.status === "completed").length,
      on_hold: tasks.filter(t => t.status === "on_hold").length,
      overdue: tasks.filter(t => dayjs(t.dueDate).isBefore(dayjs(), "day") && t.status !== "completed").length,
    };
  };

  const tabCounts = getTabCounts();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="h4" component="h1">
            Task Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            New Task
          </Button>
        </Stack>

        {/* Filters */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center">
              <FilterListIcon color="action" />
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filterStatus}
                  label="Status"
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <MenuItem value="all">All Statuses</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="in_progress">In Progress</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="on_hold">On Hold</MenuItem>
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={filterPriority}
                  label="Priority"
                  onChange={(e) => setFilterPriority(e.target.value)}
                >
                  <MenuItem value="all">All Priorities</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Assignee</InputLabel>
                <Select
                  value={filterAssignee}
                  label="Assignee"
                  onChange={(e) => setFilterAssignee(e.target.value)}
                >
                  <MenuItem value="all">All Assignees</MenuItem>
                  {teamMembers.map(member => (
                    <MenuItem key={member.id} value={member.id}>{member.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              {(filterStatus !== "all" || filterPriority !== "all" || filterAssignee !== "all") && (
                <Button
                  size="small"
                  onClick={() => {
                    setFilterStatus("all");
                    setFilterPriority("all");
                    setFilterAssignee("all");
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </Stack>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs value={currentTab} onChange={handleTabChange}>
            <Tab label={<Badge badgeContent={tabCounts.all} color="primary">All Tasks</Badge>} />
            <Tab label={<Badge badgeContent={tabCounts.pending} color="default">Pending</Badge>} />
            <Tab label={<Badge badgeContent={tabCounts.in_progress} color="info">In Progress</Badge>} />
            <Tab label={<Badge badgeContent={tabCounts.completed} color="success">Completed</Badge>} />
            <Tab label={<Badge badgeContent={tabCounts.on_hold} color="warning">On Hold</Badge>} />
            <Tab label={<Badge badgeContent={tabCounts.overdue} color="error">Overdue</Badge>} />
          </Tabs>
        </Box>

        {/* Tasks List */}
        <Grid container spacing={3}>
          {filteredTasks.length === 0 ? (
            <Grid item xs={12}>
              <Card>
                <CardContent sx={{ textAlign: "center", py: 4 }}>
                  <Typography variant="h6" color="text.secondary">
                    No tasks found
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {currentTab === 0 && filterStatus === "all" && filterPriority === "all" && filterAssignee === "all"
                      ? "Create your first task to get started"
                      : "Try adjusting your filters or create a new task"}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ) : (
            filteredTasks.map((task) => (
              <Grid item xs={12} lg={6} key={task.id}>
                <Card sx={{ height: "100%" }}>
                  <CardContent>
                    <Stack spacing={2}>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ flexGrow: 1 }}>
                          <Checkbox
                            checked={task.status === "completed"}
                            onChange={() => handleToggleTaskStatus(task.id)}
                            color="success"
                          />
                          <Typography
                            variant="h6"
                            component="h3"
                            sx={{
                              textDecoration: task.status === "completed" ? "line-through" : "none",
                              color: task.status === "completed" ? "text.secondary" : "text.primary",
                            }}
                          >
                            {task.title}
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1}>
                          <IconButton size="small" onClick={() => handleOpenDialog(task)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton size="small" onClick={() => handleDeleteTask(task.id)} color="error">
                            <DeleteIcon />
                          </IconButton>
                        </Stack>
                      </Stack>

                      <Typography variant="body2" color="text.secondary">
                        {task.description}
                      </Typography>

                      <Stack direction="row" spacing={1} flexWrap="wrap">
                        <Chip
                          label={task.priority.toUpperCase()}
                          size="small"
                          color={getPriorityColor(task.priority)}
                          variant="outlined"
                        />
                        <Chip
                          icon={getStatusIcon(task.status)}
                          label={formatStatus(task.status)}
                          size="small"
                          color={getStatusColor(task.status)}
                          variant="filled"
                        />
                        {task.reminderEnabled && (
                          <Tooltip title="Reminder enabled">
                            <Chip
                              icon={<NotificationsIcon />}
                              label="Reminder"
                              size="small"
                              variant="outlined"
                            />
                          </Tooltip>
                        )}
                      </Stack>

                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Avatar
                            src={task.assignee.avatar}
                            sx={{ width: 24, height: 24 }}
                          >
                            {task.assignee.name.charAt(0)}
                          </Avatar>
                          <Typography variant="caption" color="text.secondary">
                            {task.assignee.name}
                          </Typography>
                        </Stack>
                        <Typography variant="caption" color="text.secondary">
                          Due: {task.dueDate.format("MMM D, YYYY")}
                        </Typography>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>

        {/* Create/Edit Task Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            {editingTask ? "Edit Task" : "Create New Task"}
          </DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <TextField
                label="Task Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                fullWidth
                required
              />
              <TextField
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                fullWidth
                multiline
                rows={3}
              />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Assignee</InputLabel>
                    <Select
                      value={formData.assigneeId}
                      label="Assignee"
                      onChange={(e) => setFormData({ ...formData, assigneeId: e.target.value })}
                    >
                      {teamMembers.map(member => (
                        <MenuItem key={member.id} value={member.id}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Avatar src={member.avatar} sx={{ width: 24, height: 24 }}>
                              {member.name.charAt(0)}
                            </Avatar>
                            <span>{member.name}</span>
                          </Stack>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>Priority</InputLabel>
                    <Select
                      value={formData.priority}
                      label="Priority"
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                    >
                      <MenuItem value="low">Low</MenuItem>
                      <MenuItem value="medium">Medium</MenuItem>
                      <MenuItem value="high">High</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={formData.status}
                      label="Status"
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    >
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="in_progress">In Progress</MenuItem>
                      <MenuItem value="completed">Completed</MenuItem>
                      <MenuItem value="on_hold">On Hold</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <DatePicker
                    label="Due Date"
                    value={formData.dueDate}
                    onChange={(newValue) => setFormData({ ...formData, dueDate: newValue || dayjs() })}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Grid>
              </Grid>
              <Box>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Checkbox
                    checked={formData.reminderEnabled}
                    onChange={(e) => setFormData({ ...formData, reminderEnabled: e.target.checked })}
                  />
                  <Typography>Enable reminder</Typography>
                </Stack>
                {formData.reminderEnabled && (
                  <DatePicker
                    label="Reminder Date & Time"
                    value={formData.reminderDate}
                    onChange={(newValue) => setFormData({ ...formData, reminderDate: newValue || dayjs() })}
                    slotProps={{ textField: { fullWidth: true, sx: { mt: 2 } } }}
                  />
                )}
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button
              onClick={handleSaveTask}
              variant="contained"
              disabled={!formData.title || !formData.assigneeId}
            >
              {editingTask ? "Update" : "Create"} Task
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </LocalizationProvider>
  );
}
