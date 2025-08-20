import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
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
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Checkbox from "@mui/material/Checkbox";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import NotificationsIcon from "@mui/icons-material/Notifications";
import FilterListIcon from "@mui/icons-material/FilterList";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CrmStatCard from "../components/CrmStatCard";

interface Task {
  id: number;
  title: string;
  description: string;
  assignee: TeamMember;
  priority: "high" | "medium" | "low";
  status: "todo" | "in-progress" | "completed" | "on-hold";
  dueDate: Dayjs;
  createdDate: Dayjs;
  reminderEnabled: boolean;
  reminderDate?: Dayjs;
  category?: string;
}

interface TeamMember {
  id: number;
  name: string;
  email: string;
  avatar: string;
}

// Sample team members data
const teamMembers: TeamMember[] = [
  { id: 1, name: "John Smith", email: "john@company.com", avatar: "JS" },
  { id: 2, name: "Sarah Davis", email: "sarah@company.com", avatar: "SD" },
  { id: 3, name: "Mike Johnson", email: "mike@company.com", avatar: "MJ" },
  { id: 4, name: "Lisa Chen", email: "lisa@company.com", avatar: "LC" },
  { id: 5, name: "David Wilson", email: "david@company.com", avatar: "DW" },
];

// Sample tasks data
const initialTasks: Task[] = [
  {
    id: 1,
    title: "Prepare Q4 Sales Report",
    description: "Compile and analyze sales data for the fourth quarter",
    assignee: teamMembers[0],
    priority: "high",
    status: "in-progress",
    dueDate: dayjs().add(2, "day"),
    createdDate: dayjs().subtract(1, "day"),
    reminderEnabled: true,
    reminderDate: dayjs().add(1, "day"),
    category: "Reports",
  },
  {
    id: 2,
    title: "Client onboarding call",
    description: "Introduction call with new enterprise client",
    assignee: teamMembers[1],
    priority: "high",
    status: "todo",
    dueDate: dayjs().add(1, "day"),
    createdDate: dayjs(),
    reminderEnabled: true,
    reminderDate: dayjs().add(2, "hour"),
    category: "Client Management",
  },
  {
    id: 3,
    title: "Update CRM documentation",
    description: "Document new features and user guidelines",
    assignee: teamMembers[2],
    priority: "medium",
    status: "on-hold",
    dueDate: dayjs().add(5, "day"),
    createdDate: dayjs().subtract(2, "day"),
    reminderEnabled: false,
    category: "Documentation",
  },
  {
    id: 4,
    title: "Product demo preparation",
    description: "Prepare slides and demo environment for client presentation",
    assignee: teamMembers[3],
    priority: "medium",
    status: "completed",
    dueDate: dayjs().subtract(1, "day"),
    createdDate: dayjs().subtract(5, "day"),
    reminderEnabled: false,
    category: "Sales",
  },
  {
    id: 5,
    title: "Team meeting coordination",
    description: "Schedule and organize monthly team meeting",
    assignee: teamMembers[4],
    priority: "low",
    status: "todo",
    dueDate: dayjs().add(7, "day"),
    createdDate: dayjs(),
    reminderEnabled: true,
    reminderDate: dayjs().add(5, "day"),
    category: "Administration",
  },
];

export default function Tasks() {
  const [tasks, setTasks] = React.useState<Task[]>(initialTasks);
  const [filteredTasks, setFilteredTasks] = React.useState<Task[]>(initialTasks);
  const [activeTab, setActiveTab] = React.useState(0);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState<Task | null>(null);
  const [filterStatus, setFilterStatus] = React.useState("all");
  const [filterPriority, setFilterPriority] = React.useState("all");
  const [filterAssignee, setFilterAssignee] = React.useState("all");

  // Form state
  const [formData, setFormData] = React.useState({
    title: "",
    description: "",
    assigneeId: "",
    priority: "medium" as Task["priority"],
    status: "todo" as Task["status"],
    dueDate: dayjs().add(1, "day"),
    reminderEnabled: false,
    reminderDate: dayjs().add(1, "day"),
    category: "",
  });

  // Filter tasks based on status and current tab
  React.useEffect(() => {
    let filtered = tasks;

    // Filter by tab
    switch (activeTab) {
      case 1:
        filtered = filtered.filter((task) => task.status === "todo");
        break;
      case 2:
        filtered = filtered.filter((task) => task.status === "in-progress");
        break;
      case 3:
        filtered = filtered.filter((task) => task.status === "completed");
        break;
      case 4:
        filtered = filtered.filter((task) => task.status === "on-hold");
        break;
    }

    // Additional filters
    if (filterStatus !== "all") {
      filtered = filtered.filter((task) => task.status === filterStatus);
    }
    if (filterPriority !== "all") {
      filtered = filtered.filter((task) => task.priority === filterPriority);
    }
    if (filterAssignee !== "all") {
      filtered = filtered.filter(
        (task) => task.assignee.id.toString() === filterAssignee,
      );
    }

    setFilteredTasks(filtered);
  }, [tasks, activeTab, filterStatus, filterPriority, filterAssignee]);

  const handleOpenDialog = (task?: Task) => {
    if (task) {
      setEditingTask(task);
      setFormData({
        title: task.title,
        description: task.description,
        assigneeId: task.assignee.id.toString(),
        priority: task.priority,
        status: task.status,
        dueDate: task.dueDate,
        reminderEnabled: task.reminderEnabled,
        reminderDate: task.reminderDate || dayjs().add(1, "day"),
        category: task.category || "",
      });
    } else {
      setEditingTask(null);
      setFormData({
        title: "",
        description: "",
        assigneeId: "",
        priority: "medium",
        status: "todo",
        dueDate: dayjs().add(1, "day"),
        reminderEnabled: false,
        reminderDate: dayjs().add(1, "day"),
        category: "",
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingTask(null);
  };

  const handleSubmit = () => {
    const assignee = teamMembers.find(
      (member) => member.id.toString() === formData.assigneeId,
    );
    if (!assignee) return;

    const taskData = {
      title: formData.title,
      description: formData.description,
      assignee,
      priority: formData.priority,
      status: formData.status,
      dueDate: formData.dueDate,
      reminderEnabled: formData.reminderEnabled,
      reminderDate: formData.reminderEnabled ? formData.reminderDate : undefined,
      category: formData.category,
    };

    if (editingTask) {
      setTasks(
        tasks.map((task) =>
          task.id === editingTask.id ? { ...task, ...taskData } : task,
        ),
      );
    } else {
      const newTask: Task = {
        id: Math.max(...tasks.map((t) => t.id)) + 1,
        createdDate: dayjs(),
        ...taskData,
      };
      setTasks([...tasks, newTask]);
    }

    handleCloseDialog();
  };

  const handleDeleteTask = (taskId: number) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const handleStatusChange = (taskId: number, newStatus: Task["status"]) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task,
      ),
    );
  };

  const getPriorityColor = (
    priority: string,
  ): "error" | "warning" | "default" => {
    switch (priority) {
      case "high":
        return "error";
      case "medium":
        return "warning";
      default:
        return "default";
    }
  };

  const getStatusColor = (
    status: string,
  ): "default" | "info" | "warning" | "success" | "error" => {
    switch (status) {
      case "todo":
        return "default";
      case "in-progress":
        return "info";
      case "completed":
        return "success";
      case "on-hold":
        return "warning";
      default:
        return "default";
    }
  };

  const formatDueDate = (date: Dayjs) => {
    const today = dayjs();
    const diffDays = date.diff(today, "day");

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays === -1) return "Yesterday";
    if (diffDays > 0) return `In ${diffDays} days`;
    return `${Math.abs(diffDays)} days ago`;
  };

  // Statistics
  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === "completed").length,
    inProgress: tasks.filter((t) => t.status === "in-progress").length,
    overdue: tasks.filter((t) => t.dueDate.isBefore(dayjs()) && t.status !== "completed").length,
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 4 }}
        >
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

        {/* Statistics Cards */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <CrmStatCard
              title="Total Tasks"
              value={stats.total.toString()}
              interval="All time"
              trend="up"
              trendValue="12%"
              data={[10, 12, 15, 18, 20, 22, stats.total]}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <CrmStatCard
              title="Completed"
              value={stats.completed.toString()}
              interval="This month"
              trend="up"
              trendValue="8%"
              data={[2, 4, 6, 8, 9, 10, stats.completed]}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <CrmStatCard
              title="In Progress"
              value={stats.inProgress.toString()}
              interval="Active"
              trend="down"
              trendValue="3%"
              data={[8, 7, 9, 6, 5, 4, stats.inProgress]}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <CrmStatCard
              title="Overdue"
              value={stats.overdue.toString()}
              interval="Needs attention"
              trend="down"
              trendValue="15%"
              data={[3, 4, 2, 5, 3, 1, stats.overdue]}
            />
          </Grid>
        </Grid>

        {/* Filters */}
        <Card variant="outlined" sx={{ mb: 3 }}>
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
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="todo">To Do</MenuItem>
                  <MenuItem value="in-progress">In Progress</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="on-hold">On Hold</MenuItem>
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={filterPriority}
                  label="Priority"
                  onChange={(e) => setFilterPriority(e.target.value)}
                >
                  <MenuItem value="all">All Priority</MenuItem>
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
                  {teamMembers.map((member) => (
                    <MenuItem key={member.id} value={member.id.toString()}>
                      {member.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </CardContent>
        </Card>

        {/* Task Tabs */}
        <Card variant="outlined">
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            sx={{ borderBottom: 1, borderColor: "divider" }}
          >
            <Tab label={`All (${tasks.length})`} />
            <Tab
              label={`To Do (${tasks.filter((t) => t.status === "todo").length})`}
            />
            <Tab
              label={`In Progress (${tasks.filter((t) => t.status === "in-progress").length})`}
            />
            <Tab
              label={`Completed (${tasks.filter((t) => t.status === "completed").length})`}
            />
            <Tab
              label={`On Hold (${tasks.filter((t) => t.status === "on-hold").length})`}
            />
          </Tabs>

          {/* Tasks Table */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox />
                  </TableCell>
                  <TableCell>Task</TableCell>
                  <TableCell>Assignee</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell align="center">Reminder</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTasks.map((task) => (
                  <TableRow key={task.id} hover>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={task.status === "completed"}
                        onChange={(e) =>
                          handleStatusChange(
                            task.id,
                            e.target.checked ? "completed" : "todo",
                          )
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography
                          variant="body2"
                          fontWeight="500"
                          sx={{
                            textDecoration:
                              task.status === "completed"
                                ? "line-through"
                                : "none",
                          }}
                        >
                          {task.title}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: "block", mt: 0.5 }}
                        >
                          {task.description}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Avatar sx={{ width: 28, height: 28, fontSize: "0.75rem" }}>
                          {task.assignee.avatar}
                        </Avatar>
                        <Typography variant="body2">
                          {task.assignee.name}
                        </Typography>
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
                      <FormControl size="small" fullWidth>
                        <Select
                          value={task.status}
                          onChange={(e) =>
                            handleStatusChange(
                              task.id,
                              e.target.value as Task["status"],
                            )
                          }
                        >
                          <MenuItem value="todo">To Do</MenuItem>
                          <MenuItem value="in-progress">In Progress</MenuItem>
                          <MenuItem value="completed">Completed</MenuItem>
                          <MenuItem value="on-hold">On Hold</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDueDate(task.dueDate)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {task.dueDate.format("MMM D, YYYY")}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {task.category && (
                        <Chip
                          label={task.category}
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {task.reminderEnabled && (
                        <NotificationsIcon
                          fontSize="small"
                          color="primary"
                          titleAccess={`Reminder set for ${task.reminderDate?.format("MMM D, YYYY h:mm A")}`}
                        />
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(task)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteTask(task.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        {/* Create/Edit Task Dialog */}
        <Dialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {editingTask ? "Edit Task" : "Create New Task"}
          </DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <TextField
                label="Task Title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                fullWidth
                required
              />
              <TextField
                label="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                fullWidth
                multiline
                rows={3}
              />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Assignee</InputLabel>
                    <Select
                      value={formData.assigneeId}
                      label="Assignee"
                      onChange={(e) =>
                        setFormData({ ...formData, assigneeId: e.target.value })
                      }
                    >
                      {teamMembers.map((member) => (
                        <MenuItem key={member.id} value={member.id.toString()}>
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
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Priority</InputLabel>
                    <Select
                      value={formData.priority}
                      label="Priority"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          priority: e.target.value as Task["priority"],
                        })
                      }
                    >
                      <MenuItem value="low">Low</MenuItem>
                      <MenuItem value="medium">Medium</MenuItem>
                      <MenuItem value="high">High</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={formData.status}
                      label="Status"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status: e.target.value as Task["status"],
                        })
                      }
                    >
                      <MenuItem value="todo">To Do</MenuItem>
                      <MenuItem value="in-progress">In Progress</MenuItem>
                      <MenuItem value="completed">Completed</MenuItem>
                      <MenuItem value="on-hold">On Hold</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Category"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    fullWidth
                  />
                </Grid>
              </Grid>
              <DatePicker
                label="Due Date"
                value={formData.dueDate}
                onChange={(newValue) =>
                  setFormData({ ...formData, dueDate: newValue || dayjs() })
                }
                slotProps={{ textField: { fullWidth: true } }}
              />
              <Stack spacing={2}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Checkbox
                    checked={formData.reminderEnabled}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        reminderEnabled: e.target.checked,
                      })
                    }
                  />
                  <Typography>Enable reminder</Typography>
                </Stack>
                {formData.reminderEnabled && (
                  <DatePicker
                    label="Reminder Date"
                    value={formData.reminderDate}
                    onChange={(newValue) =>
                      setFormData({
                        ...formData,
                        reminderDate: newValue || dayjs(),
                      })
                    }
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                )}
              </Stack>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={!formData.title || !formData.assigneeId}
            >
              {editingTask ? "Update" : "Create"} Task
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
}
