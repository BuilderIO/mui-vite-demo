import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
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
import Autocomplete from "@mui/material/Autocomplete";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import FlagRoundedIcon from "@mui/icons-material/FlagRounded";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import dayjs, { Dayjs } from "dayjs";

// Types
interface Task {
  id: string;
  title: string;
  description?: string;
  priority: "high" | "medium" | "low";
  status: "pending" | "in_progress" | "completed" | "on_hold";
  dueDate: string;
  assignedTo: TeamMember;
  createdAt: string;
  updatedAt: string;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

// Sample data
const sampleTeamMembers: TeamMember[] = [
  { id: "1", name: "John Doe", email: "john.doe@company.com", avatar: "/avatars/john.jpg" },
  { id: "2", name: "Sarah Smith", email: "sarah.smith@company.com", avatar: "/avatars/sarah.jpg" },
  { id: "3", name: "Mike Johnson", email: "mike.johnson@company.com", avatar: "/avatars/mike.jpg" },
  { id: "4", name: "Emma Wilson", email: "emma.wilson@company.com", avatar: "/avatars/emma.jpg" },
  { id: "5", name: "David Brown", email: "david.brown@company.com", avatar: "/avatars/david.jpg" },
];

const sampleTasks: Task[] = [
  {
    id: "1",
    title: "Follow up with TechSolutions Inc on cloud proposal",
    description: "Schedule a meeting to discuss the cloud migration proposal and address any concerns they might have.",
    priority: "high",
    status: "pending",
    dueDate: dayjs().format("YYYY-MM-DD"),
    assignedTo: sampleTeamMembers[0],
    createdAt: dayjs().subtract(2, "day").format("YYYY-MM-DD"),
    updatedAt: dayjs().subtract(1, "day").format("YYYY-MM-DD"),
  },
  {
    id: "2",
    title: "Prepare presentation for Global Media website project",
    description: "Create comprehensive presentation slides covering project timeline, deliverables, and budget.",
    priority: "medium",
    status: "in_progress",
    dueDate: dayjs().add(1, "day").format("YYYY-MM-DD"),
    assignedTo: sampleTeamMembers[1],
    createdAt: dayjs().subtract(3, "day").format("YYYY-MM-DD"),
    updatedAt: dayjs().format("YYYY-MM-DD"),
  },
  {
    id: "3",
    title: "Call HealthCare Pro about contract details",
    description: "Clarify contract terms and negotiate pricing for the new CRM implementation.",
    priority: "high",
    status: "pending",
    dueDate: dayjs().format("YYYY-MM-DD"),
    assignedTo: sampleTeamMembers[2],
    createdAt: dayjs().subtract(1, "day").format("YYYY-MM-DD"),
    updatedAt: dayjs().format("YYYY-MM-DD"),
  },
  {
    id: "4",
    title: "Update CRM implementation timeline for RetailGiant",
    description: "Revise project timeline based on recent requirement changes and resource availability.",
    priority: "medium",
    status: "completed",
    dueDate: dayjs().subtract(1, "day").format("YYYY-MM-DD"),
    assignedTo: sampleTeamMembers[3],
    createdAt: dayjs().subtract(5, "day").format("YYYY-MM-DD"),
    updatedAt: dayjs().subtract(1, "day").format("YYYY-MM-DD"),
  },
  {
    id: "5",
    title: "Send proposal documents to Acme Corp",
    description: "Finalize and send the complete proposal package including technical specifications and pricing.",
    priority: "low",
    status: "on_hold",
    dueDate: dayjs().add(7, "day").format("YYYY-MM-DD"),
    assignedTo: sampleTeamMembers[4],
    createdAt: dayjs().subtract(4, "day").format("YYYY-MM-DD"),
    updatedAt: dayjs().subtract(2, "day").format("YYYY-MM-DD"),
  },
];

// Helper functions
const getPriorityColor = (priority: string): "error" | "warning" | "default" => {
  switch (priority) {
    case "high":
      return "error";
    case "medium":
      return "warning";
    default:
      return "default";
  }
};

const getStatusColor = (status: string): "error" | "warning" | "success" | "default" => {
  switch (status) {
    case "completed":
      return "success";
    case "in_progress":
      return "warning";
    case "on_hold":
      return "error";
    default:
      return "default";
  }
};

const formatStatus = (status: string): string => {
  return status.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase());
};

const formatDate = (date: string): string => {
  const today = dayjs();
  const taskDate = dayjs(date);
  
  if (taskDate.isSame(today, 'day')) {
    return 'Today';
  } else if (taskDate.isSame(today.add(1, 'day'), 'day')) {
    return 'Tomorrow';
  } else if (taskDate.isSame(today.subtract(1, 'day'), 'day')) {
    return 'Yesterday';
  } else {
    return taskDate.format('MMM DD, YYYY');
  }
};

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
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

export default function Tasks() {
  const [tasks, setTasks] = React.useState<Task[]>(sampleTasks);
  const [teamMembers, setTeamMembers] = React.useState<TeamMember[]>(sampleTeamMembers);
  const [tabValue, setTabValue] = React.useState(0);
  const [filterPriority, setFilterPriority] = React.useState<string>("all");
  const [filterAssignee, setFilterAssignee] = React.useState<string>("all");
  const [sortBy, setSortBy] = React.useState<string>("dueDate");
  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null);

  // Form state
  const [formData, setFormData] = React.useState({
    title: "",
    description: "",
    priority: "medium" as Task["priority"],
    status: "pending" as Task["status"],
    dueDate: dayjs() as Dayjs,
    assignedTo: null as TeamMember | null,
  });

  // Load team members from API
  React.useEffect(() => {
    const loadTeamMembers = async () => {
      try {
        const response = await fetch("https://user-api.builder-io.workers.dev/api/users?perPage=20");
        const data = await response.json();
        
        if (data.data && Array.isArray(data.data)) {
          const apiTeamMembers: TeamMember[] = data.data.map((user: any) => ({
            id: user.login.uuid,
            name: `${user.name.first} ${user.name.last}`,
            email: user.email,
            avatar: user.picture?.thumbnail,
          }));
          setTeamMembers(apiTeamMembers);
        }
      } catch (error) {
        console.warn("Failed to load team members from API, using sample data");
      }
    };

    loadTeamMembers();
  }, []);

  // Filter and sort tasks
  const filteredTasks = React.useMemo(() => {
    let filtered = tasks;

    // Tab filtering
    if (tabValue === 1) {
      filtered = filtered.filter(task => task.status === "pending");
    } else if (tabValue === 2) {
      filtered = filtered.filter(task => task.status === "in_progress");
    } else if (tabValue === 3) {
      filtered = filtered.filter(task => task.status === "completed");
    } else if (tabValue === 4) {
      filtered = filtered.filter(task => task.status === "on_hold");
    }

    // Priority filtering
    if (filterPriority !== "all") {
      filtered = filtered.filter(task => task.priority === filterPriority);
    }

    // Assignee filtering
    if (filterAssignee !== "all") {
      filtered = filtered.filter(task => task.assignedTo.id === filterAssignee);
    }

    // Search filtering
    if (searchTerm) {
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "priority":
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case "dueDate":
          return dayjs(a.dueDate).diff(dayjs(b.dueDate));
        case "status":
          return a.status.localeCompare(b.status);
        case "assignee":
          return a.assignedTo.name.localeCompare(b.assignedTo.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [tasks, tabValue, filterPriority, filterAssignee, searchTerm, sortBy]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleTaskToggle = (taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? { ...task, status: task.status === "completed" ? "pending" : "completed", updatedAt: dayjs().format("YYYY-MM-DD") }
          : task
      )
    );
  };

  const handleCreateTask = () => {
    if (!formData.title.trim() || !formData.assignedTo) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      priority: formData.priority,
      status: formData.status,
      dueDate: formData.dueDate.format("YYYY-MM-DD"),
      assignedTo: formData.assignedTo,
      createdAt: dayjs().format("YYYY-MM-DD"),
      updatedAt: dayjs().format("YYYY-MM-DD"),
    };

    setTasks(prevTasks => [...prevTasks, newTask]);
    setCreateDialogOpen(false);
    resetForm();
  };

  const handleEditTask = () => {
    if (!selectedTask || !formData.title.trim() || !formData.assignedTo) return;

    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === selectedTask.id
          ? {
              ...task,
              title: formData.title,
              description: formData.description,
              priority: formData.priority,
              status: formData.status,
              dueDate: formData.dueDate.format("YYYY-MM-DD"),
              assignedTo: formData.assignedTo,
              updatedAt: dayjs().format("YYYY-MM-DD"),
            }
          : task
      )
    );

    setEditDialogOpen(false);
    setSelectedTask(null);
    resetForm();
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

  const openEditDialog = (task: Task) => {
    setSelectedTask(task);
    setFormData({
      title: task.title,
      description: task.description || "",
      priority: task.priority,
      status: task.status,
      dueDate: dayjs(task.dueDate),
      assignedTo: task.assignedTo,
    });
    setEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      priority: "medium",
      status: "pending",
      dueDate: dayjs(),
      assignedTo: null,
    });
  };

  const getTaskStats = () => {
    const total = tasks.length;
    const pending = tasks.filter(t => t.status === "pending").length;
    const inProgress = tasks.filter(t => t.status === "in_progress").length;
    const completed = tasks.filter(t => t.status === "completed").length;
    const onHold = tasks.filter(t => t.status === "on_hold").length;

    return { total, pending, inProgress, completed, onHold };
  };

  const stats = getTaskStats();

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
          <Typography variant="h4" component="h1">
            Task Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddRoundedIcon />}
            onClick={() => setCreateDialogOpen(true)}
          >
            Create Task
          </Button>
        </Stack>

        {/* Stats Cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6} sm={3} md={2.4}>
            <Card variant="outlined">
              <CardContent sx={{ p: 2, textAlign: "center" }}>
                <Typography variant="h4" component="div" color="primary">
                  {stats.total}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Tasks
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3} md={2.4}>
            <Card variant="outlined">
              <CardContent sx={{ p: 2, textAlign: "center" }}>
                <Typography variant="h4" component="div" color="warning.main">
                  {stats.pending}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pending
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3} md={2.4}>
            <Card variant="outlined">
              <CardContent sx={{ p: 2, textAlign: "center" }}>
                <Typography variant="h4" component="div" color="info.main">
                  {stats.inProgress}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  In Progress
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3} md={2.4}>
            <Card variant="outlined">
              <CardContent sx={{ p: 2, textAlign: "center" }}>
                <Typography variant="h4" component="div" color="success.main">
                  {stats.completed}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Completed
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={3} md={2.4}>
            <Card variant="outlined">
              <CardContent sx={{ p: 2, textAlign: "center" }}>
                <Typography variant="h4" component="div" color="error.main">
                  {stats.onHold}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  On Hold
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Filters and Search */}
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
              <TextField
                placeholder="Search tasks..."
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ flex: 1, minWidth: 200 }}
              />
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={filterPriority}
                  label="Priority"
                  onChange={(e) => setFilterPriority(e.target.value)}
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Assignee</InputLabel>
                <Select
                  value={filterAssignee}
                  label="Assignee"
                  onChange={(e) => setFilterAssignee(e.target.value)}
                >
                  <MenuItem value="all">All</MenuItem>
                  {teamMembers.map((member) => (
                    <MenuItem key={member.id} value={member.id}>
                      {member.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  label="Sort By"
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <MenuItem value="dueDate">Due Date</MenuItem>
                  <MenuItem value="priority">Priority</MenuItem>
                  <MenuItem value="status">Status</MenuItem>
                  <MenuItem value="assignee">Assignee</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </CardContent>
        </Card>

        {/* Tabs and Task List */}
        <Card variant="outlined">
          <CardContent sx={{ p: 0 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="task status tabs"
              sx={{ borderBottom: 1, borderColor: "divider", px: 2 }}
            >
              <Tab label={`All (${stats.total})`} />
              <Tab label={`Pending (${stats.pending})`} />
              <Tab label={`In Progress (${stats.inProgress})`} />
              <Tab label={`Completed (${stats.completed})`} />
              <Tab label={`On Hold (${stats.onHold})`} />
            </Tabs>

            <TabPanel value={tabValue} index={0}>
              <TaskList
                tasks={filteredTasks}
                onToggle={handleTaskToggle}
                onEdit={openEditDialog}
                onDelete={handleDeleteTask}
              />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <TaskList
                tasks={filteredTasks}
                onToggle={handleTaskToggle}
                onEdit={openEditDialog}
                onDelete={handleDeleteTask}
              />
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
              <TaskList
                tasks={filteredTasks}
                onToggle={handleTaskToggle}
                onEdit={openEditDialog}
                onDelete={handleDeleteTask}
              />
            </TabPanel>
            <TabPanel value={tabValue} index={3}>
              <TaskList
                tasks={filteredTasks}
                onToggle={handleTaskToggle}
                onEdit={openEditDialog}
                onDelete={handleDeleteTask}
              />
            </TabPanel>
            <TabPanel value={tabValue} index={4}>
              <TaskList
                tasks={filteredTasks}
                onToggle={handleTaskToggle}
                onEdit={openEditDialog}
                onDelete={handleDeleteTask}
              />
            </TabPanel>
          </CardContent>
        </Card>

        {/* Create Task Dialog */}
        <TaskFormDialog
          open={createDialogOpen}
          onClose={() => {
            setCreateDialogOpen(false);
            resetForm();
          }}
          onSubmit={handleCreateTask}
          title="Create New Task"
          formData={formData}
          setFormData={setFormData}
          teamMembers={teamMembers}
        />

        {/* Edit Task Dialog */}
        <TaskFormDialog
          open={editDialogOpen}
          onClose={() => {
            setEditDialogOpen(false);
            setSelectedTask(null);
            resetForm();
          }}
          onSubmit={handleEditTask}
          title="Edit Task"
          formData={formData}
          setFormData={setFormData}
          teamMembers={teamMembers}
        />
      </Box>
    </LocalizationProvider>
  );
}

// Task List Component
interface TaskListProps {
  tasks: Task[];
  onToggle: (taskId: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

function TaskList({ tasks, onToggle, onEdit, onDelete }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: "center", color: "text.secondary" }}>
        <Typography variant="h6">No tasks found</Typography>
        <Typography variant="body2">
          Try adjusting your filters or create a new task to get started.
        </Typography>
      </Box>
    );
  }

  return (
    <List>
      {tasks.map((task) => (
        <ListItem
          key={task.id}
          secondaryAction={
            <Stack direction="row" spacing={1}>
              <IconButton
                edge="end"
                aria-label="edit"
                onClick={() => onEdit(task)}
                size="small"
              >
                <EditRoundedIcon />
              </IconButton>
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => onDelete(task.id)}
                size="small"
                color="error"
              >
                <DeleteRoundedIcon />
              </IconButton>
            </Stack>
          }
          disablePadding
        >
          <ListItemButton onClick={() => onToggle(task.id)} dense>
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={task.status === "completed"}
                tabIndex={-1}
                disableRipple
              />
            </ListItemIcon>
            <ListItemAvatar>
              <Avatar
                src={task.assignedTo.avatar}
                sx={{ width: 32, height: 32 }}
              >
                {task.assignedTo.name.charAt(0)}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography
                  sx={{
                    textDecoration: task.status === "completed" ? "line-through" : "none",
                    color: task.status === "completed" ? "text.secondary" : "text.primary",
                    fontWeight: task.priority === "high" ? 600 : 400,
                  }}
                >
                  {task.title}
                </Typography>
              }
              secondary={
                <Stack spacing={1} sx={{ mt: 0.5 }}>
                  {task.description && (
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {task.description}
                    </Typography>
                  )}
                  <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                    <Chip
                      label={task.priority}
                      size="small"
                      color={getPriorityColor(task.priority)}
                      variant="outlined"
                      sx={{ height: 20 }}
                    />
                    <Chip
                      label={formatStatus(task.status)}
                      size="small"
                      color={getStatusColor(task.status)}
                      variant="filled"
                      sx={{ height: 20 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      <CalendarTodayRoundedIcon sx={{ fontSize: 12, mr: 0.5 }} />
                      {formatDate(task.dueDate)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      <PersonRoundedIcon sx={{ fontSize: 12, mr: 0.5 }} />
                      {task.assignedTo.name}
                    </Typography>
                  </Stack>
                </Stack>
              }
            />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
}

// Task Form Dialog Component
interface TaskFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title: string;
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  teamMembers: TeamMember[];
}

function TaskFormDialog({
  open,
  onClose,
  onSubmit,
  title,
  formData,
  setFormData,
  teamMembers,
}: TaskFormDialogProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="task-form-dialog-title"
    >
      <DialogTitle id="task-form-dialog-title">{title}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={3}>
            <TextField
              autoFocus
              required
              label="Task Title"
              fullWidth
              variant="outlined"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            />
            
            <TextField
              label="Description"
              multiline
              rows={3}
              fullWidth
              variant="outlined"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={formData.priority}
                    label="Priority"
                    onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                  >
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={formData.status}
                    label="Status"
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  >
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="in_progress">In Progress</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="on_hold">On Hold</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <DatePicker
              label="Due Date"
              value={formData.dueDate}
              onChange={(newValue) => setFormData(prev => ({ ...prev, dueDate: newValue }))}
              slotProps={{
                textField: {
                  fullWidth: true,
                  required: true,
                }
              }}
            />

            <Autocomplete
              options={teamMembers}
              getOptionLabel={(option) => `${option.name} (${option.email})`}
              value={formData.assignedTo}
              onChange={(event, newValue) => {
                setFormData(prev => ({ ...prev, assignedTo: newValue }));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Assign To"
                  required
                  variant="outlined"
                />
              )}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  <Avatar
                    src={option.avatar}
                    sx={{ width: 24, height: 24, mr: 1 }}
                  >
                    {option.name.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="body2">{option.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {option.email}
                    </Typography>
                  </Box>
                </Box>
              )}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {title.includes("Create") ? "Create" : "Update"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
