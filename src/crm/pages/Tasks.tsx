import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Avatar from "@mui/material/Avatar";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import DatePicker from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";

// Types
interface Task {
  id: number;
  title: string;
  description: string;
  assignee: string;
  assigneeAvatar: string;
  dueDate: string;
  priority: "high" | "medium" | "low";
  status: "in_progress" | "completed" | "on_hold";
  createdDate: string;
  reminderEnabled: boolean;
}

interface TaskFormData {
  title: string;
  description: string;
  assignee: string;
  dueDate: Dayjs | null;
  priority: "high" | "medium" | "low";
  status: "in_progress" | "completed" | "on_hold";
  reminderEnabled: boolean;
}

// Sample team members
const teamMembers = [
  { id: "john_doe", name: "John Doe", avatar: "JD" },
  { id: "jane_smith", name: "Jane Smith", avatar: "JS" },
  { id: "alex_chen", name: "Alex Chen", avatar: "AC" },
  { id: "sarah_johnson", name: "Sarah Johnson", avatar: "SJ" },
  { id: "mike_wilson", name: "Mike Wilson", avatar: "MW" },
];

// Sample tasks data
const initialTasks: Task[] = [
  {
    id: 1,
    title: "Complete Q4 sales analysis",
    description: "Analyze Q4 sales data and prepare comprehensive report for stakeholders",
    assignee: "John Doe",
    assigneeAvatar: "JD",
    dueDate: "2024-01-15",
    priority: "high",
    status: "in_progress",
    createdDate: "2024-01-08",
    reminderEnabled: true,
  },
  {
    id: 2,
    title: "Update customer database",
    description: "Clean and update customer contact information in CRM system",
    assignee: "Jane Smith",
    assigneeAvatar: "JS",
    dueDate: "2024-01-20",
    priority: "medium",
    status: "in_progress",
    createdDate: "2024-01-05",
    reminderEnabled: true,
  },
  {
    id: 3,
    title: "Design new marketing campaign",
    description: "Create design assets and copy for spring marketing campaign",
    assignee: "Alex Chen",
    assigneeAvatar: "AC",
    dueDate: "2024-01-25",
    priority: "high",
    status: "on_hold",
    createdDate: "2024-01-03",
    reminderEnabled: false,
  },
  {
    id: 4,
    title: "Client onboarding documentation",
    description: "Update and improve client onboarding process documentation",
    assignee: "Sarah Johnson",
    assigneeAvatar: "SJ",
    dueDate: "2024-01-12",
    priority: "low",
    status: "completed",
    createdDate: "2024-01-01",
    reminderEnabled: true,
  },
  {
    id: 5,
    title: "Security audit preparation",
    description: "Prepare documentation and systems for annual security audit",
    assignee: "Mike Wilson",
    assigneeAvatar: "MW",
    dueDate: "2024-01-30",
    priority: "high",
    status: "in_progress",
    createdDate: "2024-01-07",
    reminderEnabled: true,
  },
];

// Helper functions
const getPriorityColor = (priority: string): "error" | "warning" | "success" => {
  switch (priority) {
    case "high": return "error";
    case "medium": return "warning";
    case "low": return "success";
    default: return "warning";
  }
};

const getStatusColor = (status: string): "primary" | "success" | "warning" => {
  switch (status) {
    case "in_progress": return "primary";
    case "completed": return "success";
    case "on_hold": return "warning";
    default: return "primary";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed": return <CheckCircleIcon />;
    case "on_hold": return <PauseCircleIcon />;
    default: return <RadioButtonUncheckedIcon />;
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const isOverdue = (dueDate: string, status: string) => {
  if (status === "completed") return false;
  return new Date(dueDate) < new Date();
};

export default function Tasks() {
  const [tasks, setTasks] = React.useState<Task[]>(initialTasks);
  const [filteredTasks, setFilteredTasks] = React.useState<Task[]>(initialTasks);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [priorityFilter, setPriorityFilter] = React.useState("all");
  const [assigneeFilter, setAssigneeFilter] = React.useState("all");
  const [openDialog, setOpenDialog] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState<Task | null>(null);
  const [showFilters, setShowFilters] = React.useState(false);

  const [formData, setFormData] = React.useState<TaskFormData>({
    title: "",
    description: "",
    assignee: "",
    dueDate: null,
    priority: "medium",
    status: "in_progress",
    reminderEnabled: false,
  });

  // Filter and search logic
  React.useEffect(() => {
    let filtered = tasks.filter((task) => {
      const matchesSearch = 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.assignee.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || task.status === statusFilter;
      const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
      const matchesAssignee = assigneeFilter === "all" || task.assignee === assigneeFilter;
      
      return matchesSearch && matchesStatus && matchesPriority && matchesAssignee;
    });

    setFilteredTasks(filtered);
    setPage(0);
  }, [tasks, searchQuery, statusFilter, priorityFilter, assigneeFilter]);

  const handleCreateTask = () => {
    setEditingTask(null);
    setFormData({
      title: "",
      description: "",
      assignee: "",
      dueDate: null,
      priority: "medium",
      status: "in_progress",
      reminderEnabled: false,
    });
    setOpenDialog(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      assignee: task.assignee,
      dueDate: dayjs(task.dueDate),
      priority: task.priority,
      status: task.status,
      reminderEnabled: task.reminderEnabled,
    });
    setOpenDialog(true);
  };

  const handleSaveTask = () => {
    if (!formData.title || !formData.assignee || !formData.dueDate) {
      return;
    }

    const newTask: Task = {
      id: editingTask ? editingTask.id : Date.now(),
      title: formData.title,
      description: formData.description,
      assignee: formData.assignee,
      assigneeAvatar: teamMembers.find(m => m.name === formData.assignee)?.avatar || "?",
      dueDate: formData.dueDate.format("YYYY-MM-DD"),
      priority: formData.priority,
      status: formData.status,
      createdDate: editingTask ? editingTask.createdDate : new Date().toISOString().split("T")[0],
      reminderEnabled: formData.reminderEnabled,
    };

    if (editingTask) {
      setTasks(tasks.map(task => task.id === editingTask.id ? newTask : task));
    } else {
      setTasks([...tasks, newTask]);
    }

    setOpenDialog(false);
  };

  const handleDeleteTask = (taskId: number) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleStatusChange = (taskId: number, newStatus: Task["status"]) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Calculate stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === "completed").length;
  const inProgressTasks = tasks.filter(t => t.status === "in_progress").length;
  const overdueTasks = tasks.filter(t => isOverdue(t.dueDate, t.status)).length;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
        <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
          Task Management
        </Typography>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom variant="h6">
                  Total Tasks
                </Typography>
                <Typography variant="h4" component="div">
                  {totalTasks}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom variant="h6">
                  In Progress
                </Typography>
                <Typography variant="h4" component="div" color="primary">
                  {inProgressTasks}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom variant="h6">
                  Completed
                </Typography>
                <Typography variant="h4" component="div" color="success.main">
                  {completedTasks}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom variant="h6">
                  Overdue
                </Typography>
                <Typography variant="h4" component="div" color="error.main">
                  {overdueTasks}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Controls */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
              <TextField
                size="small"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />,
                }}
                sx={{ minWidth: 200 }}
              />
              
              <Button
                variant="outlined"
                startIcon={<FilterListIcon />}
                onClick={() => setShowFilters(!showFilters)}
              >
                Filters
              </Button>

              <Box sx={{ flexGrow: 1 }} />

              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreateTask}
              >
                Create Task
              </Button>
            </Stack>

            {/* Filters */}
            {showFilters && (
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 2 }}>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={statusFilter}
                    label="Status"
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <MenuItem value="all">All Status</MenuItem>
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
                    <MenuItem value="all">All Priority</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="low">Low</MenuItem>
                  </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 160 }}>
                  <InputLabel>Assignee</InputLabel>
                  <Select
                    value={assigneeFilter}
                    label="Assignee"
                    onChange={(e) => setAssigneeFilter(e.target.value)}
                  >
                    <MenuItem value="all">All Assignees</MenuItem>
                    {teamMembers.map((member) => (
                      <MenuItem key={member.id} value={member.name}>
                        {member.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
            )}
          </CardContent>
        </Card>

        {/* Tasks Table */}
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Task</TableCell>
                  <TableCell>Assignee</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Reminders</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTasks
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((task) => (
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
                            {task.assigneeAvatar}
                          </Avatar>
                          <Typography variant="body2">{task.assignee}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography 
                          variant="body2"
                          color={isOverdue(task.dueDate, task.status) ? "error" : "text.primary"}
                          sx={{ fontWeight: isOverdue(task.dueDate, task.status) ? 500 : 400 }}
                        >
                          {formatDate(task.dueDate)}
                        </Typography>
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
                          icon={getStatusIcon(task.status)}
                          label={task.status.replace("_", " ").toUpperCase()}
                          size="small"
                          color={getStatusColor(task.status)}
                          variant="filled"
                          onClick={() => {
                            const statuses: Task["status"][] = ["in_progress", "completed", "on_hold"];
                            const currentIndex = statuses.indexOf(task.status);
                            const nextStatus = statuses[(currentIndex + 1) % statuses.length];
                            handleStatusChange(task.id, nextStatus);
                          }}
                          sx={{ cursor: "pointer" }}
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton 
                          size="small" 
                          color={task.reminderEnabled ? "primary" : "default"}
                          title={task.reminderEnabled ? "Reminders enabled" : "Reminders disabled"}
                        >
                          <NotificationsIcon />
                        </IconButton>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton 
                          size="small" 
                          onClick={() => handleEditTask(task)}
                          title="Edit task"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => handleDeleteTask(task.id)}
                          title="Delete task"
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredTasks.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>

        {/* Create/Edit Task Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            {editingTask ? "Edit Task" : "Create New Task"}
          </DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <TextField
                autoFocus
                fullWidth
                label="Task Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
              
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />

              <FormControl fullWidth required>
                <InputLabel>Assignee</InputLabel>
                <Select
                  value={formData.assignee}
                  label="Assignee"
                  onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                >
                  {teamMembers.map((member) => (
                    <MenuItem key={member.id} value={member.name}>
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

              <DatePicker
                label="Due Date"
                value={formData.dueDate}
                onChange={(newValue) => setFormData({ ...formData, dueDate: newValue })}
                slotProps={{ textField: { fullWidth: true, required: true } }}
              />

              <Stack direction="row" spacing={2}>
                <FormControl sx={{ minWidth: 120 }}>
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

                <FormControl sx={{ minWidth: 120 }}>
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
              </Stack>

              <Stack direction="row" spacing={1} alignItems="center">
                <input
                  type="checkbox"
                  id="reminder"
                  checked={formData.reminderEnabled}
                  onChange={(e) => setFormData({ ...formData, reminderEnabled: e.target.checked })}
                />
                <label htmlFor="reminder">
                  <Typography variant="body2">
                    Enable email and in-app reminders for this task
                  </Typography>
                </label>
              </Stack>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveTask} variant="contained">
              {editingTask ? "Update Task" : "Create Task"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
}
