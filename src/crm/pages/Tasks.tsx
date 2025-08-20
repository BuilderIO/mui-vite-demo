import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FilterListIcon from "@mui/icons-material/FilterList";
import SortIcon from "@mui/icons-material/Sort";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

// Types
interface Task {
  id: string;
  title: string;
  description: string;
  assignee: TeamMember;
  priority: "high" | "medium" | "low";
  status: "todo" | "in_progress" | "completed" | "on_hold";
  dueDate: Dayjs;
  createdDate: Dayjs;
  tags: string[];
}

interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  email: string;
}

// Sample team members data
const teamMembers: TeamMember[] = [
  { id: "1", name: "John Smith", avatar: "JS", email: "john@example.com" },
  { id: "2", name: "Sarah Wilson", avatar: "SW", email: "sarah@example.com" },
  { id: "3", name: "Mike Johnson", avatar: "MJ", email: "mike@example.com" },
  { id: "4", name: "Emily Brown", avatar: "EB", email: "emily@example.com" },
  { id: "5", name: "David Lee", avatar: "DL", email: "david@example.com" },
];

// Sample tasks data
const initialTasks: Task[] = [
  {
    id: "1",
    title: "Update CRM database schema",
    description: "Modify the customer table to include new fields for enhanced tracking",
    assignee: teamMembers[0],
    priority: "high",
    status: "in_progress",
    dueDate: dayjs().add(2, "days"),
    createdDate: dayjs().subtract(3, "days"),
    tags: ["backend", "database"],
  },
  {
    id: "2",
    title: "Design new dashboard UI",
    description: "Create wireframes and mockups for the updated dashboard interface",
    assignee: teamMembers[1],
    priority: "medium",
    status: "todo",
    dueDate: dayjs().add(5, "days"),
    createdDate: dayjs().subtract(1, "day"),
    tags: ["design", "ui/ux"],
  },
  {
    id: "3",
    title: "Fix login authentication bug",
    description: "Resolve issue with OAuth integration causing login failures",
    assignee: teamMembers[2],
    priority: "high",
    status: "completed",
    dueDate: dayjs().subtract(1, "day"),
    createdDate: dayjs().subtract(5, "days"),
    tags: ["bug", "security"],
  },
  {
    id: "4",
    title: "Prepare quarterly report",
    description: "Compile sales and performance metrics for Q3 review",
    assignee: teamMembers[3],
    priority: "medium",
    status: "on_hold",
    dueDate: dayjs().add(7, "days"),
    createdDate: dayjs().subtract(2, "days"),
    tags: ["reporting", "analysis"],
  },
  {
    id: "5",
    title: "Optimize search functionality",
    description: "Improve search performance and add advanced filtering options",
    assignee: teamMembers[4],
    priority: "low",
    status: "todo",
    dueDate: dayjs().add(10, "days"),
    createdDate: dayjs().subtract(1, "day"),
    tags: ["performance", "feature"],
  },
];

// Helper functions
const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high": return "error";
    case "medium": return "warning";
    case "low": return "success";
    default: return "default";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed": return "success";
    case "in_progress": return "info";
    case "on_hold": return "warning";
    case "todo": return "default";
    default: return "default";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed": return <CheckCircleIcon />;
    case "in_progress": return <PlayArrowIcon />;
    case "on_hold": return <PauseCircleIcon />;
    case "todo": return <RadioButtonUncheckedIcon />;
    default: return <RadioButtonUncheckedIcon />;
  }
};

const formatStatus = (status: string) => {
  return status.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase());
};

export default function Tasks() {
  const [tasks, setTasks] = React.useState<Task[]>(initialTasks);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [filterMenuAnchor, setFilterMenuAnchor] = React.useState<null | HTMLElement>(null);
  const [sortMenuAnchor, setSortMenuAnchor] = React.useState<null | HTMLElement>(null);
  const [priorityFilter, setPriorityFilter] = React.useState<string>("all");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [sortBy, setSortBy] = React.useState<string>("dueDate");
  const [taskMenuAnchor, setTaskMenuAnchor] = React.useState<{[key: string]: HTMLElement | null}>({});

  // New task form state
  const [newTask, setNewTask] = React.useState({
    title: "",
    description: "",
    assigneeId: "",
    priority: "medium" as "high" | "medium" | "low",
    dueDate: dayjs().add(7, "days"),
  });

  // Filter and sort tasks
  const filteredAndSortedTasks = React.useMemo(() => {
    let filtered = tasks.filter(task => {
      if (priorityFilter !== "all" && task.priority !== priorityFilter) return false;
      if (statusFilter !== "all" && task.status !== statusFilter) return false;
      return true;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "dueDate":
          return a.dueDate.valueOf() - b.dueDate.valueOf();
        case "priority":
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case "status":
          return a.status.localeCompare(b.status);
        case "assignee":
          return a.assignee.name.localeCompare(b.assignee.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [tasks, priorityFilter, statusFilter, sortBy]);

  const handleCreateTask = () => {
    const assignee = teamMembers.find(member => member.id === newTask.assigneeId);
    if (!assignee || !newTask.title.trim()) return;

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      assignee,
      priority: newTask.priority,
      status: "todo",
      dueDate: newTask.dueDate,
      createdDate: dayjs(),
      tags: [],
    };

    setTasks(prev => [task, ...prev]);
    setNewTask({
      title: "",
      description: "",
      assigneeId: "",
      priority: "medium",
      dueDate: dayjs().add(7, "days"),
    });
    setOpenDialog(false);
  };

  const handleStatusChange = (taskId: string, newStatus: Task["status"]) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
    setTaskMenuAnchor(prev => ({ ...prev, [taskId]: null }));
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
    setTaskMenuAnchor(prev => ({ ...prev, [taskId]: null }));
  };

  const openTaskMenu = (event: React.MouseEvent<HTMLElement>, taskId: string) => {
    setTaskMenuAnchor(prev => ({ ...prev, [taskId]: event.currentTarget }));
  };

  const closeTaskMenu = (taskId: string) => {
    setTaskMenuAnchor(prev => ({ ...prev, [taskId]: null }));
  };

  const taskCounts = React.useMemo(() => {
    return {
      total: tasks.length,
      todo: tasks.filter(t => t.status === "todo").length,
      inProgress: tasks.filter(t => t.status === "in_progress").length,
      completed: tasks.filter(t => t.status === "completed").length,
      onHold: tasks.filter(t => t.status === "on_hold").length,
    };
  }, [tasks]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1">
            Task Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
          >
            New Task
          </Button>
        </Stack>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card>
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="h4" color="primary">{taskCounts.total}</Typography>
                <Typography variant="body2" color="text.secondary">Total Tasks</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card>
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="h4" color="info.main">{taskCounts.todo}</Typography>
                <Typography variant="body2" color="text.secondary">To Do</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card>
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="h4" color="warning.main">{taskCounts.inProgress}</Typography>
                <Typography variant="body2" color="text.secondary">In Progress</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card>
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="h4" color="success.main">{taskCounts.completed}</Typography>
                <Typography variant="body2" color="text.secondary">Completed</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card>
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="h4" color="error.main">{taskCounts.onHold}</Typography>
                <Typography variant="body2" color="text.secondary">On Hold</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Controls */}
        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          <Button
            startIcon={<FilterListIcon />}
            onClick={(e) => setFilterMenuAnchor(e.currentTarget)}
            variant="outlined"
          >
            Filter
          </Button>
          <Button
            startIcon={<SortIcon />}
            onClick={(e) => setSortMenuAnchor(e.currentTarget)}
            variant="outlined"
          >
            Sort
          </Button>
        </Stack>

        {/* Filter Menu */}
        <Menu
          anchorEl={filterMenuAnchor}
          open={Boolean(filterMenuAnchor)}
          onClose={() => setFilterMenuAnchor(null)}
        >
          <MenuItem disabled>Priority</MenuItem>
          <MenuItem onClick={() => { setPriorityFilter("all"); setFilterMenuAnchor(null); }}>All Priorities</MenuItem>
          <MenuItem onClick={() => { setPriorityFilter("high"); setFilterMenuAnchor(null); }}>High</MenuItem>
          <MenuItem onClick={() => { setPriorityFilter("medium"); setFilterMenuAnchor(null); }}>Medium</MenuItem>
          <MenuItem onClick={() => { setPriorityFilter("low"); setFilterMenuAnchor(null); }}>Low</MenuItem>
          <MenuItem disabled>Status</MenuItem>
          <MenuItem onClick={() => { setStatusFilter("all"); setFilterMenuAnchor(null); }}>All Statuses</MenuItem>
          <MenuItem onClick={() => { setStatusFilter("todo"); setFilterMenuAnchor(null); }}>To Do</MenuItem>
          <MenuItem onClick={() => { setStatusFilter("in_progress"); setFilterMenuAnchor(null); }}>In Progress</MenuItem>
          <MenuItem onClick={() => { setStatusFilter("completed"); setFilterMenuAnchor(null); }}>Completed</MenuItem>
          <MenuItem onClick={() => { setStatusFilter("on_hold"); setFilterMenuAnchor(null); }}>On Hold</MenuItem>
        </Menu>

        {/* Sort Menu */}
        <Menu
          anchorEl={sortMenuAnchor}
          open={Boolean(sortMenuAnchor)}
          onClose={() => setSortMenuAnchor(null)}
        >
          <MenuItem onClick={() => { setSortBy("dueDate"); setSortMenuAnchor(null); }}>Due Date</MenuItem>
          <MenuItem onClick={() => { setSortBy("priority"); setSortMenuAnchor(null); }}>Priority</MenuItem>
          <MenuItem onClick={() => { setSortBy("status"); setSortMenuAnchor(null); }}>Status</MenuItem>
          <MenuItem onClick={() => { setSortBy("assignee"); setSortMenuAnchor(null); }}>Assignee</MenuItem>
        </Menu>

        {/* Tasks Grid */}
        <Grid container spacing={3}>
          {filteredAndSortedTasks.map((task) => (
            <Grid item xs={12} md={6} lg={4} key={task.id}>
              <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                    <Typography variant="h6" component="h3" sx={{ flexGrow: 1, mr: 1 }}>
                      {task.title}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={(e) => openTaskMenu(e, task.id)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Stack>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {task.description}
                  </Typography>

                  <Stack spacing={2}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip
                        label={task.priority}
                        size="small"
                        color={getPriorityColor(task.priority) as any}
                        variant="outlined"
                      />
                      <Chip
                        icon={getStatusIcon(task.status)}
                        label={formatStatus(task.status)}
                        size="small"
                        color={getStatusColor(task.status) as any}
                        variant="filled"
                      />
                    </Stack>

                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Avatar sx={{ width: 32, height: 32, fontSize: "0.875rem" }}>
                          {task.assignee.avatar}
                        </Avatar>
                        <Typography variant="body2">{task.assignee.name}</Typography>
                      </Stack>
                      <Typography variant="caption" color="text.secondary">
                        Due: {task.dueDate.format("MMM DD")}
                      </Typography>
                    </Stack>

                    {task.tags.length > 0 && (
                      <Stack direction="row" spacing={1} flexWrap="wrap">
                        {task.tags.map((tag) => (
                          <Chip key={tag} label={tag} size="small" variant="outlined" />
                        ))}
                      </Stack>
                    )}
                  </Stack>
                </CardContent>

                {/* Task Menu */}
                <Menu
                  anchorEl={taskMenuAnchor[task.id]}
                  open={Boolean(taskMenuAnchor[task.id])}
                  onClose={() => closeTaskMenu(task.id)}
                >
                  <MenuItem onClick={() => handleStatusChange(task.id, "todo")}>
                    Mark as To Do
                  </MenuItem>
                  <MenuItem onClick={() => handleStatusChange(task.id, "in_progress")}>
                    Mark as In Progress
                  </MenuItem>
                  <MenuItem onClick={() => handleStatusChange(task.id, "completed")}>
                    Mark as Completed
                  </MenuItem>
                  <MenuItem onClick={() => handleStatusChange(task.id, "on_hold")}>
                    Mark as On Hold
                  </MenuItem>
                  <MenuItem 
                    onClick={() => handleDeleteTask(task.id)}
                    sx={{ color: "error.main" }}
                  >
                    Delete Task
                  </MenuItem>
                </Menu>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Create Task Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <TextField
                label="Task Title"
                fullWidth
                value={newTask.title}
                onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                required
              />
              
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={3}
                value={newTask.description}
                onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
              />
              
              <FormControl fullWidth>
                <InputLabel>Assignee</InputLabel>
                <Select
                  value={newTask.assigneeId}
                  label="Assignee"
                  onChange={(e) => setNewTask(prev => ({ ...prev, assigneeId: e.target.value }))}
                  required
                >
                  {teamMembers.map((member) => (
                    <MenuItem key={member.id} value={member.id}>
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
              
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={newTask.priority}
                  label="Priority"
                  onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value as any }))}
                >
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                </Select>
              </FormControl>
              
              <DatePicker
                label="Due Date"
                value={newTask.dueDate}
                onChange={(date) => setNewTask(prev => ({ ...prev, dueDate: date || dayjs() }))}
                minDate={dayjs()}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button 
              onClick={handleCreateTask} 
              variant="contained"
              disabled={!newTask.title.trim() || !newTask.assigneeId}
            >
              Create Task
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
}
