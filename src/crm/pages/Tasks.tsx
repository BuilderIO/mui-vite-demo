import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Grid from "@mui/material/Grid2";
import { DataGrid, GridColDef, GridRowsProp, GridActionsCellItem } from "@mui/x-data-grid";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import dayjs, { Dayjs } from "dayjs";
import { useUsers, getUserFullName, getUserInitials, formatUserForDisplay } from "../components/TaskUserAPI";
import { CircularProgress } from "@mui/material";

// Task interface
interface Task {
  id: number;
  title: string;
  description: string;
  status: "pending" | "in_progress" | "completed" | "on_hold";
  priority: "low" | "medium" | "high";
  assignee: string;
  assigneeAvatar: string;
  assigneeId?: string;
  dueDate: string;
  createdDate: string;
  completedDate?: string;
}

// Sample task data
const initialTasks: Task[] = [
  {
    id: 1,
    title: "Implement user authentication system",
    description: "Create login/logout functionality with JWT tokens",
    status: "in_progress",
    priority: "high",
    assignee: "John Smith",
    assigneeAvatar: "JS",
    dueDate: "2024-02-15",
    createdDate: "2024-01-20",
  },
  {
    id: 2,
    title: "Design dashboard wireframes",
    description: "Create initial wireframes for admin dashboard",
    status: "completed",
    priority: "medium",
    assignee: "Sarah Wilson",
    assigneeAvatar: "SW",
    dueDate: "2024-01-30",
    createdDate: "2024-01-10",
    completedDate: "2024-01-28",
  },
  {
    id: 3,
    title: "Database schema optimization",
    description: "Review and optimize database queries for better performance",
    status: "pending",
    priority: "high",
    assignee: "Mike Johnson",
    assigneeAvatar: "MJ",
    dueDate: "2024-02-20",
    createdDate: "2024-01-25",
  },
  {
    id: 4,
    title: "API documentation update",
    description: "Update API documentation with new endpoints",
    status: "on_hold",
    priority: "low",
    assignee: "Emily Brown",
    assigneeAvatar: "EB",
    dueDate: "2024-03-01",
    createdDate: "2024-01-15",
  },
  {
    id: 5,
    title: "Mobile app responsiveness",
    description: "Ensure mobile app works properly on all devices",
    status: "in_progress",
    priority: "medium",
    assignee: "David Lee",
    assigneeAvatar: "DL",
    dueDate: "2024-02-25",
    createdDate: "2024-02-01",
  },
];

// Get color for priority
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

// Get color for status
const getStatusColor = (status: string): "default" | "primary" | "success" | "warning" => {
  switch (status) {
    case "pending":
      return "default";
    case "in_progress":
      return "primary";
    case "completed":
      return "success";
    case "on_hold":
      return "warning";
    default:
      return "default";
  }
};

// Format date
const formatDate = (dateString: string) => {
  return dayjs(dateString).format("MMM DD, YYYY");
};

// Days until due
const getDaysUntilDue = (dueDate: string) => {
  const today = dayjs();
  const due = dayjs(dueDate);
  const diff = due.diff(today, "day");
  
  if (diff < 0) return `${Math.abs(diff)} days overdue`;
  if (diff === 0) return "Due today";
  if (diff === 1) return "Due tomorrow";
  return `${diff} days left`;
};

export default function Tasks() {
  const [tasks, setTasks] = React.useState<Task[]>(initialTasks);
  const [open, setOpen] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState<Task | null>(null);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [priorityFilter, setPriorityFilter] = React.useState<string>("all");

  // Fetch users from API
  const { users, loading: usersLoading, error: usersError } = useUsers();

  // Form state
  const [formData, setFormData] = React.useState({
    title: "",
    description: "",
    status: "pending" as Task["status"],
    priority: "medium" as Task["priority"],
    assignee: "",
    assigneeAvatar: "",
    assigneeId: "",
    dueDate: dayjs().add(7, "day"),
  });

  // Format users for display in dropdown
  const teamMembers = React.useMemo(() => {
    if (usersLoading || !users.length) {
      // Fallback to static members while loading
      return [
        { id: "1", name: "John Smith", initials: "JS", email: "john@example.com" },
        { id: "2", name: "Sarah Wilson", initials: "SW", email: "sarah@example.com" },
        { id: "3", name: "Mike Johnson", initials: "MJ", email: "mike@example.com" },
        { id: "4", name: "Emily Brown", initials: "EB", email: "emily@example.com" },
        { id: "5", name: "David Lee", initials: "DL", email: "david@example.com" },
      ];
    }
    return users.map(formatUserForDisplay);
  }, [users, usersLoading]);

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      status: "pending",
      priority: "medium",
      assignee: "",
      assigneeAvatar: "",
      dueDate: dayjs().add(7, "day"),
    });
    setEditingTask(null);
  };

  // Handle create new task
  const handleCreate = () => {
    setOpen(true);
    resetForm();
  };

  // Handle edit task
  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      assignee: task.assignee,
      assigneeAvatar: task.assigneeAvatar,
      dueDate: dayjs(task.dueDate),
    });
    setOpen(true);
  };

  // Handle delete task
  const handleDelete = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // Handle save task
  const handleSave = () => {
    const taskData = {
      title: formData.title,
      description: formData.description,
      status: formData.status,
      priority: formData.priority,
      assignee: formData.assignee,
      assigneeAvatar: formData.assigneeAvatar,
      dueDate: formData.dueDate.format("YYYY-MM-DD"),
      createdDate: editingTask?.createdDate || dayjs().format("YYYY-MM-DD"),
      ...(formData.status === "completed" && !editingTask?.completedDate ? 
         { completedDate: dayjs().format("YYYY-MM-DD") } : {}),
      ...(editingTask?.completedDate && formData.status !== "completed" ? 
         { completedDate: undefined } : { completedDate: editingTask?.completedDate }),
    };

    if (editingTask) {
      setTasks(tasks.map(task => 
        task.id === editingTask.id ? { ...task, ...taskData } : task
      ));
    } else {
      const newTask: Task = {
        id: Math.max(...tasks.map(t => t.id)) + 1,
        ...taskData,
      };
      setTasks([...tasks, newTask]);
    }

    setOpen(false);
    resetForm();
  };

  // Handle assignee selection
  const handleAssigneeChange = (assigneeName: string) => {
    const member = teamMembers.find(m => m.name === assigneeName);
    setFormData({
      ...formData,
      assignee: assigneeName,
      assigneeAvatar: member?.avatar || "",
    });
  };

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.assignee.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // DataGrid columns
  const columns: GridColDef[] = [
    {
      field: "title",
      headerName: "Task Title",
      flex: 2,
      minWidth: 200,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2" fontWeight={500}>
            {params.value}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {params.row.description}
          </Typography>
        </Box>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value.replace("_", " ")}
          size="small"
          color={getStatusColor(params.value)}
          variant="outlined"
          sx={{ textTransform: "capitalize" }}
        />
      ),
    },
    {
      field: "priority",
      headerName: "Priority",
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          color={getPriorityColor(params.value)}
          variant="outlined"
          sx={{ textTransform: "capitalize" }}
        />
      ),
    },
    {
      field: "assignee",
      headerName: "Assignee",
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Avatar sx={{ width: 24, height: 24, fontSize: "0.75rem" }}>
            {params.row.assigneeAvatar}
          </Avatar>
          <Typography variant="body2">{params.value}</Typography>
        </Box>
      ),
    },
    {
      field: "dueDate",
      headerName: "Due Date",
      width: 150,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2">{formatDate(params.value)}</Typography>
          <Typography 
            variant="caption" 
            color={dayjs(params.value).isBefore(dayjs(), "day") ? "error" : "text.secondary"}
          >
            {getDaysUntilDue(params.value)}
          </Typography>
        </Box>
      ),
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          onClick={() => handleEdit(params.row)}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => handleDelete(params.id as number)}
        />,
      ],
    },
  ];

  // Task statistics
  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === "pending").length,
    inProgress: tasks.filter(t => t.status === "in_progress").length,
    completed: tasks.filter(t => t.status === "completed").length,
    onHold: tasks.filter(t => t.status === "on_hold").length,
    overdue: tasks.filter(t => dayjs(t.dueDate).isBefore(dayjs(), "day") && t.status !== "completed").length,
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="h4" component="h1">
            Task Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreate}
          >
            Create Task
          </Button>
        </Stack>

        {/* Statistics Cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <Card>
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="h4" color="primary">{stats.total}</Typography>
                <Typography variant="body2" color="text.secondary">Total Tasks</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <Card>
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="h4" color="text.secondary">{stats.pending}</Typography>
                <Typography variant="body2" color="text.secondary">Pending</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <Card>
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="h4" color="primary">{stats.inProgress}</Typography>
                <Typography variant="body2" color="text.secondary">In Progress</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <Card>
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="h4" color="success.main">{stats.completed}</Typography>
                <Typography variant="body2" color="text.secondary">Completed</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <Card>
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="h4" color="warning.main">{stats.onHold}</Typography>
                <Typography variant="body2" color="text.secondary">On Hold</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <Card>
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="h4" color="error.main">{stats.overdue}</Typography>
                <Typography variant="body2" color="text.secondary">Overdue</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Filters and Search */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
              <TextField
                placeholder="Search tasks..."
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />,
                }}
                sx={{ minWidth: 250 }}
              />
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
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
              <Typography variant="body2" color="text.secondary">
                Showing {filteredTasks.length} of {tasks.length} tasks
              </Typography>
            </Stack>
          </CardContent>
        </Card>

        {/* Tasks Data Grid */}
        <Card>
          <CardContent sx={{ p: 0 }}>
            <DataGrid
              rows={filteredTasks}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 10 },
                },
              }}
              pageSizeOptions={[5, 10, 25]}
              checkboxSelection
              disableRowSelectionOnClick
              autoHeight
              sx={{
                border: 0,
                "& .MuiDataGrid-cell": {
                  borderBottom: "1px solid",
                  borderColor: "divider",
                },
                "& .MuiDataGrid-columnHeaders": {
                  borderBottom: "2px solid",
                  borderColor: "divider",
                  backgroundColor: "background.paper",
                },
              }}
            />
          </CardContent>
        </Card>

        {/* Create/Edit Task Dialog */}
        <Dialog 
          open={open} 
          onClose={() => setOpen(false)} 
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
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={formData.status}
                      label="Status"
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as Task["status"] })}
                    >
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="in_progress">In Progress</MenuItem>
                      <MenuItem value="completed">Completed</MenuItem>
                      <MenuItem value="on_hold">On Hold</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
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
              </Grid>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel>Assignee</InputLabel>
                    <Select
                      value={formData.assignee}
                      label="Assignee"
                      onChange={(e) => handleAssigneeChange(e.target.value)}
                    >
                      {teamMembers.map((member) => (
                        <MenuItem key={member.name} value={member.name}>
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
                <Grid size={{ xs: 12, sm: 6 }}>
                  <DatePicker
                    label="Due Date"
                    value={formData.dueDate}
                    onChange={(newValue) => setFormData({ ...formData, dueDate: newValue || dayjs() })}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Grid>
              </Grid>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleSave} 
              variant="contained"
              disabled={!formData.title || !formData.assignee}
            >
              {editingTask ? "Update" : "Create"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
}
