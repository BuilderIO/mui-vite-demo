import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Menu from "@mui/material/Menu";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Tooltip from "@mui/material/Tooltip";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";

// Import custom components
import TaskBoard from "../components/TaskBoard";
import TaskAnalytics from "../components/TaskAnalytics";
import TaskReminderSystem from "../components/TaskReminderSystem";

// Icons
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import RadioButtonUncheckedRoundedIcon from "@mui/icons-material/RadioButtonUncheckedRounded";
import PauseCircleRoundedIcon from "@mui/icons-material/PauseCircleRounded";
import PlayCircleRoundedIcon from "@mui/icons-material/PlayCircleRounded";
import NotificationsActiveRoundedIcon from "@mui/icons-material/NotificationsActiveRounded";
import TableRowsRoundedIcon from "@mui/icons-material/TableRowsRounded";
import ViewKanbanRoundedIcon from "@mui/icons-material/ViewKanbanRounded";
import AnalyticsRoundedIcon from "@mui/icons-material/AnalyticsRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";

// Types
interface Task {
  id: number;
  title: string;
  description: string;
  assignee: {
    name: string;
    avatar: string;
    email: string;
  };
  priority: "high" | "medium" | "low";
  status: "todo" | "in_progress" | "completed" | "on_hold";
  dueDate: string;
  createdDate: string;
  completedDate?: string;
  reminderEnabled: boolean;
  category: string;
}

// Sample team members data
const teamMembers = [
  { name: "John Smith", email: "john.smith@company.com", avatar: "JS" },
  { name: "Sarah Wilson", email: "sarah.wilson@company.com", avatar: "SW" },
  { name: "Mike Johnson", email: "mike.johnson@company.com", avatar: "MJ" },
  { name: "Lisa Brown", email: "lisa.brown@company.com", avatar: "LB" },
  { name: "David Chen", email: "david.chen@company.com", avatar: "DC" },
];

// Sample tasks data
const initialTasks: Task[] = [
  {
    id: 1,
    title: "Follow up with TechSolutions Inc on cloud proposal",
    description: "Need to discuss timeline and pricing details for the cloud migration project",
    assignee: teamMembers[0],
    priority: "high",
    status: "todo",
    dueDate: "2024-01-15",
    createdDate: "2024-01-10",
    reminderEnabled: true,
    category: "Sales",
  },
  {
    id: 2,
    title: "Prepare presentation for Global Media website project",
    description: "Create comprehensive presentation covering design mockups, timeline, and budget",
    assignee: teamMembers[1],
    priority: "medium",
    status: "in_progress",
    dueDate: "2024-01-18",
    createdDate: "2024-01-08",
    reminderEnabled: true,
    category: "Marketing",
  },
  {
    id: 3,
    title: "Call HealthCare Pro about contract details",
    description: "Clarify contract terms and conditions for the CRM implementation",
    assignee: teamMembers[2],
    priority: "high",
    status: "todo",
    dueDate: "2024-01-16",
    createdDate: "2024-01-12",
    reminderEnabled: false,
    category: "Legal",
  },
  {
    id: 4,
    title: "Update CRM implementation timeline for RetailGiant",
    description: "Revise project timeline based on client feedback and resource availability",
    assignee: teamMembers[3],
    priority: "medium",
    status: "completed",
    dueDate: "2024-01-14",
    createdDate: "2024-01-05",
    completedDate: "2024-01-13",
    reminderEnabled: false,
    category: "Development",
  },
  {
    id: 5,
    title: "Send proposal documents to Acme Corp",
    description: "Compile and send all required proposal documents for the enterprise software package",
    assignee: teamMembers[4],
    priority: "low",
    status: "on_hold",
    dueDate: "2024-01-20",
    createdDate: "2024-01-09",
    reminderEnabled: true,
    category: "Sales",
  },
];

// Utility functions
const getPriorityColor = (priority: string): "error" | "warning" | "default" => {
  switch (priority) {
    case "high": return "error";
    case "medium": return "warning";
    default: return "default";
  }
};

const getStatusColor = (status: string): "default" | "primary" | "success" | "warning" => {
  switch (status) {
    case "todo": return "default";
    case "in_progress": return "primary";
    case "completed": return "success";
    case "on_hold": return "warning";
    default: return "default";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "todo": return <RadioButtonUncheckedRoundedIcon fontSize="small" />;
    case "in_progress": return <PlayCircleRoundedIcon fontSize="small" />;
    case "completed": return <CheckCircleRoundedIcon fontSize="small" />;
    case "on_hold": return <PauseCircleRoundedIcon fontSize="small" />;
    default: return <RadioButtonUncheckedRoundedIcon fontSize="small" />;
  }
};

const formatDate = (dateString: string) => {
  return dayjs(dateString).format("MMM DD, YYYY");
};

const isOverdue = (dueDate: string, status: string) => {
  return status !== "completed" && dayjs(dueDate).isBefore(dayjs(), "day");
};

const getTaskStats = (tasks: Task[]) => {
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === "completed").length;
  const inProgress = tasks.filter(t => t.status === "in_progress").length;
  const overdue = tasks.filter(t => isOverdue(t.dueDate, t.status)).length;
  
  return { total, completed, inProgress, overdue };
};

export default function Tasks() {
  const [tasks, setTasks] = React.useState<Task[]>(initialTasks);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [priorityFilter, setPriorityFilter] = React.useState("all");
  const [assigneeFilter, setAssigneeFilter] = React.useState("all");
  const [currentView, setCurrentView] = React.useState(0); // 0: Table, 1: Board, 2: Analytics, 3: Settings
  
  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null);
  
  // Menu state
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [menuTaskId, setMenuTaskId] = React.useState<number | null>(null);
  
  // New task form state
  const [newTask, setNewTask] = React.useState({
    title: "",
    description: "",
    assignee: "",
    priority: "medium" as "high" | "medium" | "low",
    status: "todo" as "todo" | "in_progress" | "completed" | "on_hold",
    dueDate: dayjs().add(1, "day"),
    reminderEnabled: true,
    category: "",
  });

  // Filter tasks based on search and filters
  const filteredTasks = React.useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           task.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || task.status === statusFilter;
      const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
      const matchesAssignee = assigneeFilter === "all" || task.assignee.email === assigneeFilter;
      
      return matchesSearch && matchesStatus && matchesPriority && matchesAssignee;
    });
  }, [tasks, searchTerm, statusFilter, priorityFilter, assigneeFilter]);

  const stats = getTaskStats(tasks);

  // Handlers
  const handleCreateTask = () => {
    const assignee = teamMembers.find(m => m.email === newTask.assignee) || teamMembers[0];
    const task: Task = {
      id: Math.max(...tasks.map(t => t.id)) + 1,
      title: newTask.title,
      description: newTask.description,
      assignee,
      priority: newTask.priority,
      status: newTask.status,
      dueDate: newTask.dueDate.format("YYYY-MM-DD"),
      createdDate: dayjs().format("YYYY-MM-DD"),
      reminderEnabled: newTask.reminderEnabled,
      category: newTask.category,
    };
    
    setTasks([...tasks, task]);
    setCreateDialogOpen(false);
    
    // Reset form
    setNewTask({
      title: "",
      description: "",
      assignee: "",
      priority: "medium",
      status: "todo",
      dueDate: dayjs().add(1, "day"),
      reminderEnabled: true,
      category: "",
    });
  };

  const handleEditTask = () => {
    if (!selectedTask) return;
    
    const updatedTasks = tasks.map(task =>
      task.id === selectedTask.id ? selectedTask : task
    );
    setTasks(updatedTasks);
    setEditDialogOpen(false);
    setSelectedTask(null);
  };

  const handleDeleteTask = () => {
    if (!selectedTask) return;
    
    setTasks(tasks.filter(task => task.id !== selectedTask.id));
    setDeleteDialogOpen(false);
    setSelectedTask(null);
  };

  const handleTaskStatusChange = (taskId: number, newStatus: Task["status"]) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        const updated = { ...task, status: newStatus };
        if (newStatus === "completed" && task.status !== "completed") {
          updated.completedDate = dayjs().format("YYYY-MM-DD");
        } else if (newStatus !== "completed") {
          delete updated.completedDate;
        }
        return updated;
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, taskId: number) => {
    setAnchorEl(event.currentTarget);
    setMenuTaskId(taskId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuTaskId(null);
  };

  const handleEditClick = () => {
    const task = tasks.find(t => t.id === menuTaskId);
    if (task) {
      setSelectedTask(task);
      setEditDialogOpen(true);
    }
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    const task = tasks.find(t => t.id === menuTaskId);
    if (task) {
      setSelectedTask(task);
      setDeleteDialogOpen(true);
    }
    handleMenuClose();
  };

  const handleViewChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentView(newValue);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
        {/* Header */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 3 }}
        >
          <Box>
            <Typography variant="h4" component="h1">
              Task Management
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Manage, track, and analyze your team's tasks efficiently
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddRoundedIcon />}
            onClick={() => setCreateDialogOpen(true)}
          >
            Create Task
          </Button>
        </Stack>

        {/* View Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs value={currentView} onChange={handleViewChange} aria-label="task management views">
            <Tab
              icon={<TableRowsRoundedIcon />}
              label="Table View"
              iconPosition="start"
              sx={{ minHeight: 48 }}
            />
            <Tab
              icon={<ViewKanbanRoundedIcon />}
              label="Board View"
              iconPosition="start"
              sx={{ minHeight: 48 }}
            />
            <Tab
              icon={<AnalyticsRoundedIcon />}
              label="Analytics"
              iconPosition="start"
              sx={{ minHeight: 48 }}
            />
            <Tab
              icon={<SettingsRoundedIcon />}
              label="Reminders"
              iconPosition="start"
              sx={{ minHeight: 48 }}
            />
          </Tabs>
        </Box>

        {/* Stats Cards - Show only in Table and Board views */}
        {(currentView === 0 || currentView === 1) && (
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6} sm={3}>
              <Card variant="outlined">
                <CardContent>
                  <Typography color="text.secondary" gutterBottom variant="body2">
                    Total Tasks
                  </Typography>
                  <Typography variant="h4">{stats.total}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Card variant="outlined">
                <CardContent>
                  <Typography color="text.secondary" gutterBottom variant="body2">
                    In Progress
                  </Typography>
                  <Typography variant="h4" color="primary">
                    {stats.inProgress}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Card variant="outlined">
                <CardContent>
                  <Typography color="text.secondary" gutterBottom variant="body2">
                    Completed
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    {stats.completed}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Card variant="outlined">
                <CardContent>
                  <Typography color="text.secondary" gutterBottom variant="body2">
                    Overdue
                  </Typography>
                  <Typography variant="h4" color="error.main">
                    {stats.overdue}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Filters and Search - Show only in Table and Board views */}
        {(currentView === 0 || currentView === 1) && (
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
                <Paper
                  component="form"
                  sx={{ display: "flex", alignItems: "center", width: { xs: "100%", sm: 300 } }}
                  variant="outlined"
                >
                  <SearchRoundedIcon sx={{ p: "10px", color: "text.secondary" }} />
                  <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Search tasks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </Paper>

                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={statusFilter}
                    label="Status"
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="todo">To Do</MenuItem>
                    <MenuItem value="in_progress">In Progress</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="on_hold">On Hold</MenuItem>
                  </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={priorityFilter}
                    label="Priority"
                    onChange={(e) => setPriorityFilter(e.target.value)}
                  >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="low">Low</MenuItem>
                  </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel>Assignee</InputLabel>
                  <Select
                    value={assigneeFilter}
                    label="Assignee"
                    onChange={(e) => setAssigneeFilter(e.target.value)}
                  >
                    <MenuItem value="all">All</MenuItem>
                    {teamMembers.map((member) => (
                      <MenuItem key={member.email} value={member.email}>
                        {member.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
            </CardContent>
          </Card>
        )}

        {/* Content based on current view */}
        {currentView === 0 && (
          /* Tasks Table */
          <Card variant="outlined">
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Task</TableCell>
                    <TableCell>Assignee</TableCell>
                    <TableCell>Priority</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Due Date</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell align="center">Reminder</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredTasks.map((task) => (
                    <TableRow key={task.id} hover>
                      <TableCell>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                            {task.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {task.description}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Avatar sx={{ width: 32, height: 32, fontSize: "0.875rem" }}>
                            {task.assignee.avatar}
                          </Avatar>
                          <Box>
                            <Typography variant="body2">{task.assignee.name}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {task.assignee.email}
                            </Typography>
                          </Box>
                        </Box>
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
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Checkbox
                            icon={getStatusIcon(task.status)}
                            checkedIcon={<CheckCircleRoundedIcon />}
                            checked={task.status === "completed"}
                            onChange={(e) =>
                              handleTaskStatusChange(task.id, e.target.checked ? "completed" : "todo")
                            }
                            size="small"
                          />
                          <Chip
                            label={task.status.replace("_", " ").toUpperCase()}
                            size="small"
                            color={getStatusColor(task.status)}
                            variant="outlined"
                          />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          color={isOverdue(task.dueDate, task.status) ? "error.main" : "text.primary"}
                          sx={{ fontWeight: isOverdue(task.dueDate, task.status) ? 500 : 400 }}
                        >
                          {formatDate(task.dueDate)}
                        </Typography>
                        {isOverdue(task.dueDate, task.status) && (
                          <Typography variant="caption" color="error.main">
                            Overdue
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip label={task.category} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell align="center">
                        {task.reminderEnabled && (
                          <Tooltip title="Reminders enabled">
                            <NotificationsActiveRoundedIcon
                              fontSize="small"
                              color="primary"
                            />
                          </Tooltip>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, task.id)}
                        >
                          <MoreVertRoundedIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        )}

        {currentView === 1 && (
          /* Task Board View */
          <TaskBoard
            tasks={filteredTasks}
            onTaskEdit={(task) => {
              setSelectedTask(task);
              setEditDialogOpen(true);
            }}
            onTaskDelete={(task) => {
              setSelectedTask(task);
              setDeleteDialogOpen(true);
            }}
            onTaskView={(task) => {
              setSelectedTask(task);
              setEditDialogOpen(true);
            }}
            onTaskMove={handleTaskStatusChange}
          />
        )}

        {currentView === 2 && (
          /* Analytics View */
          <TaskAnalytics />
        )}

        {currentView === 3 && (
          /* Reminder Settings View */
          <TaskReminderSystem />
        )}

        {/* Context Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleEditClick}>
            <EditRoundedIcon fontSize="small" sx={{ mr: 1 }} />
            <ListItemText>Edit Task</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleDeleteClick} sx={{ color: "error.main" }}>
            <DeleteRoundedIcon fontSize="small" sx={{ mr: 1 }} />
            <ListItemText>Delete Task</ListItemText>
          </MenuItem>
        </Menu>

        {/* Create Task Dialog */}
        <Dialog 
          open={createDialogOpen} 
          onClose={() => setCreateDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Create New Task</DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <TextField
                fullWidth
                label="Task Title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              />
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              />
              <TextField
                fullWidth
                label="Category"
                value={newTask.category}
                onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                placeholder="e.g., Sales, Marketing, Development"
              />
              <FormControl fullWidth>
                <InputLabel>Assignee</InputLabel>
                <Select
                  value={newTask.assignee}
                  label="Assignee"
                  onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                >
                  {teamMembers.map((member) => (
                    <MenuItem key={member.email} value={member.email}>
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
              <Stack direction="row" spacing={2}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={newTask.priority}
                    label="Priority"
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                  >
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={newTask.status}
                    label="Status"
                    onChange={(e) => setNewTask({ ...newTask, status: e.target.value as any })}
                  >
                    <MenuItem value="todo">To Do</MenuItem>
                    <MenuItem value="in_progress">In Progress</MenuItem>
                    <MenuItem value="on_hold">On Hold</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
              <DatePicker
                label="Due Date"
                value={newTask.dueDate}
                onChange={(date) => setNewTask({ ...newTask, dueDate: date || dayjs() })}
                slotProps={{ textField: { fullWidth: true } }}
              />
              <FormControl>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Checkbox
                    checked={newTask.reminderEnabled}
                    onChange={(e) => setNewTask({ ...newTask, reminderEnabled: e.target.checked })}
                  />
                  <Typography>Enable automated reminders</Typography>
                </Stack>
              </FormControl>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleCreateTask}
              variant="contained"
              disabled={!newTask.title || !newTask.assignee}
            >
              Create Task
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Task Dialog */}
        <Dialog 
          open={editDialogOpen} 
          onClose={() => setEditDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Edit Task</DialogTitle>
          <DialogContent>
            {selectedTask && (
              <Stack spacing={3} sx={{ mt: 1 }}>
                <TextField
                  fullWidth
                  label="Task Title"
                  value={selectedTask.title}
                  onChange={(e) => setSelectedTask({ ...selectedTask, title: e.target.value })}
                />
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  value={selectedTask.description}
                  onChange={(e) => setSelectedTask({ ...selectedTask, description: e.target.value })}
                />
                <TextField
                  fullWidth
                  label="Category"
                  value={selectedTask.category}
                  onChange={(e) => setSelectedTask({ ...selectedTask, category: e.target.value })}
                />
                <FormControl fullWidth>
                  <InputLabel>Assignee</InputLabel>
                  <Select
                    value={selectedTask.assignee.email}
                    label="Assignee"
                    onChange={(e) => {
                      const member = teamMembers.find(m => m.email === e.target.value);
                      if (member) {
                        setSelectedTask({ ...selectedTask, assignee: member });
                      }
                    }}
                  >
                    {teamMembers.map((member) => (
                      <MenuItem key={member.email} value={member.email}>
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
                <Stack direction="row" spacing={2}>
                  <FormControl fullWidth>
                    <InputLabel>Priority</InputLabel>
                    <Select
                      value={selectedTask.priority}
                      label="Priority"
                      onChange={(e) => setSelectedTask({ ...selectedTask, priority: e.target.value as any })}
                    >
                      <MenuItem value="low">Low</MenuItem>
                      <MenuItem value="medium">Medium</MenuItem>
                      <MenuItem value="high">High</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={selectedTask.status}
                      label="Status"
                      onChange={(e) => setSelectedTask({ ...selectedTask, status: e.target.value as any })}
                    >
                      <MenuItem value="todo">To Do</MenuItem>
                      <MenuItem value="in_progress">In Progress</MenuItem>
                      <MenuItem value="completed">Completed</MenuItem>
                      <MenuItem value="on_hold">On Hold</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
                <DatePicker
                  label="Due Date"
                  value={dayjs(selectedTask.dueDate)}
                  onChange={(date) => 
                    setSelectedTask({ 
                      ...selectedTask, 
                      dueDate: date?.format("YYYY-MM-DD") || selectedTask.dueDate 
                    })
                  }
                  slotProps={{ textField: { fullWidth: true } }}
                />
                <FormControl>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Checkbox
                      checked={selectedTask.reminderEnabled}
                      onChange={(e) => 
                        setSelectedTask({ ...selectedTask, reminderEnabled: e.target.checked })
                      }
                    />
                    <Typography>Enable automated reminders</Typography>
                  </Stack>
                </FormControl>
              </Stack>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleEditTask}
              variant="contained"
            >
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Delete Task</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete "{selectedTask?.title}"? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleDeleteTask} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
}
