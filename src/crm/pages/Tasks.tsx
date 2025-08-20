import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import { DataGrid, GridColDef, GridActionsCellItem } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import FilterListIcon from "@mui/icons-material/FilterList";
import TaskCreateDialog from "../components/TaskCreateDialog";
import TaskEditDialog from "../components/TaskEditDialog";
import { formatDistanceToNow, parseISO, format } from "date-fns";

export type TaskStatus = "todo" | "in_progress" | "completed" | "on_hold";
export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  description: string;
  assignee?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
}

// Sample task data - in real app, this would come from an API
const initialTasks: Task[] = [
  {
    id: "1",
    title: "Follow up with TechSolutions Inc",
    description: "Discuss cloud proposal details and timeline",
    assignee: {
      id: "user1",
      name: "John Smith",
      email: "john.smith@company.com",
      avatar: "JS"
    },
    priority: "high",
    status: "in_progress",
    dueDate: "2024-01-25T14:00:00Z",
    createdAt: "2024-01-20T10:00:00Z",
    updatedAt: "2024-01-23T15:30:00Z",
    tags: ["client", "proposal"]
  },
  {
    id: "2",
    title: "Prepare presentation slides",
    description: "Create presentation for Global Media website project",
    assignee: {
      id: "user2",
      name: "Sarah Johnson",
      email: "sarah.johnson@company.com",
      avatar: "SJ"
    },
    priority: "medium",
    status: "todo",
    dueDate: "2024-01-26T10:00:00Z",
    createdAt: "2024-01-21T09:15:00Z",
    updatedAt: "2024-01-21T09:15:00Z",
    tags: ["presentation", "design"]
  },
  {
    id: "3",
    title: "Update CRM system",
    description: "Implement new features and fix reported bugs",
    assignee: {
      id: "user3",
      name: "Mike Davis",
      email: "mike.davis@company.com",
      avatar: "MD"
    },
    priority: "high",
    status: "on_hold",
    dueDate: "2024-01-30T16:00:00Z",
    createdAt: "2024-01-18T11:30:00Z",
    updatedAt: "2024-01-24T14:20:00Z",
    tags: ["development", "crm"]
  },
  {
    id: "4",
    title: "Contract review",
    description: "Review and update contract terms for RetailGiant partnership",
    assignee: {
      id: "user4",
      name: "Emily Chen",
      email: "emily.chen@company.com",
      avatar: "EC"
    },
    priority: "medium",
    status: "completed",
    dueDate: "2024-01-24T12:00:00Z",
    createdAt: "2024-01-19T13:45:00Z",
    updatedAt: "2024-01-24T11:55:00Z",
    tags: ["legal", "contract"]
  },
  {
    id: "5",
    title: "Database optimization",
    description: "Optimize database queries and improve performance",
    priority: "low",
    status: "todo",
    dueDate: "2024-02-05T17:00:00Z",
    createdAt: "2024-01-22T16:20:00Z",
    updatedAt: "2024-01-22T16:20:00Z",
    tags: ["database", "performance"]
  }
];

const getStatusColor = (status: TaskStatus): "default" | "primary" | "secondary" | "success" | "error" | "info" | "warning" => {
  switch (status) {
    case "completed":
      return "success";
    case "in_progress":
      return "primary";
    case "on_hold":
      return "warning";
    default:
      return "default";
  }
};

const getPriorityColor = (priority: TaskPriority): "default" | "primary" | "secondary" | "success" | "error" | "info" | "warning" => {
  switch (priority) {
    case "high":
      return "error";
    case "medium":
      return "warning";
    default:
      return "info";
  }
};

const getStatusLabel = (status: TaskStatus): string => {
  switch (status) {
    case "todo":
      return "To Do";
    case "in_progress":
      return "In Progress";
    case "completed":
      return "Completed";
    case "on_hold":
      return "On Hold";
    default:
      return status;
  }
};

export default function Tasks() {
  const [tasks, setTasks] = React.useState<Task[]>(initialTasks);
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null);
  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: 10,
    page: 0,
  });

  const handleCreateTask = (taskData: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTasks([newTask, ...tasks]);
    setCreateDialogOpen(false);
  };

  const handleEditTask = (taskData: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    if (!selectedTask) return;
    
    const updatedTask: Task = {
      ...selectedTask,
      ...taskData,
      updatedAt: new Date().toISOString(),
    };
    
    setTasks(tasks.map(task => task.id === selectedTask.id ? updatedTask : task));
    setEditDialogOpen(false);
    setSelectedTask(null);
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleEditClick = (task: Task) => {
    setSelectedTask(task);
    setEditDialogOpen(true);
  };

  const columns: GridColDef[] = [
    {
      field: "title",
      headerName: "Task",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2" fontWeight="medium">
            {params.value}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap>
            {params.row.description}
          </Typography>
        </Box>
      ),
    },
    {
      field: "assignee",
      headerName: "Assignee",
      width: 150,
      hideable: true,
      renderCell: (params) => {
        if (!params.value) {
          return (
            <Chip
              label="Unassigned"
              size="small"
              variant="outlined"
              color="default"
            />
          );
        }
        return (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar sx={{ width: 24, height: 24, fontSize: "0.75rem" }}>
              {params.value.avatar || params.value.name.charAt(0)}
            </Avatar>
            <Typography variant="body2" noWrap>
              {params.value.name}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "priority",
      headerName: "Priority",
      width: 100,
      hideable: true,
      renderCell: (params) => (
        <Chip
          label={params.value.charAt(0).toUpperCase() + params.value.slice(1)}
          size="small"
          color={getPriorityColor(params.value)}
          variant="outlined"
        />
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => (
        <Chip
          label={getStatusLabel(params.value)}
          size="small"
          color={getStatusColor(params.value)}
          variant="filled"
        />
      ),
    },
    {
      field: "dueDate",
      headerName: "Due Date",
      width: 130,
      hideable: true,
      renderCell: (params) => {
        const dueDate = parseISO(params.value);
        const now = new Date();
        const isOverdue = dueDate < now && params.row.status !== "completed";

        return (
          <Tooltip title={format(dueDate, "PPpp")}>
            <Typography
              variant="body2"
              color={isOverdue ? "error" : "text.primary"}
              fontWeight={isOverdue ? "medium" : "normal"}
            >
              {formatDistanceToNow(dueDate, { addSuffix: true })}
            </Typography>
          </Tooltip>
        );
      },
    },
    {
      field: "tags",
      headerName: "Tags",
      width: 150,
      hideable: true,
      renderCell: (params) => {
        if (!params.value || params.value.length === 0) return null;
        return (
          <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
            {params.value.slice(0, 2).map((tag: string) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                variant="outlined"
                sx={{ fontSize: "0.6rem", height: 20 }}
              />
            ))}
            {params.value.length > 2 && (
              <Chip
                label={`+${params.value.length - 2}`}
                size="small"
                variant="outlined"
                sx={{ fontSize: "0.6rem", height: 20 }}
              />
            )}
          </Box>
        );
      },
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      sortable: false,
      filterable: false,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit task"
          onClick={() => handleEditClick(params.row)}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete task"
          onClick={() => handleDeleteTask(params.id as string)}
          sx={{ color: "error.main" }}
        />,
      ],
    },
  ];

  const taskStats = React.useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.status === "completed").length;
    const inProgress = tasks.filter(task => task.status === "in_progress").length;
    const overdue = tasks.filter(task => {
      const dueDate = parseISO(task.dueDate);
      return dueDate < new Date() && task.status !== "completed";
    }).length;

    return { total, completed, inProgress, overdue };
  }, [tasks]);

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      {/* Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "flex-start" }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h4" component="h1" sx={{ mb: 1 }}>
            Tasks Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Track, manage, and organize your team's tasks and activities
          </Typography>
        </Box>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          sx={{ mt: { xs: 2, sm: 0 } }}
        >
          <Tooltip title="Filter tasks">
            <IconButton
              size="small"
              aria-label="Filter tasks"
              sx={{ alignSelf: { xs: "flex-start", sm: "center" } }}
            >
              <FilterListIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            size="small"
            aria-label="Refresh task list"
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateDialogOpen(true)}
            aria-label="Create new task"
          >
            New Task
          </Button>
        </Stack>
      </Stack>

      {/* Stats Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, 1fr)",
            sm: "repeat(4, 1fr)",
          },
          gap: 2,
          mb: 3,
        }}
      >
        <Card variant="outlined" sx={{ minWidth: 0 }}>
          <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
            <Typography variant="h6" component="div">
              {taskStats.total}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Tasks
            </Typography>
          </CardContent>
        </Card>
        <Card variant="outlined" sx={{ minWidth: 0 }}>
          <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
            <Typography variant="h6" component="div" color="primary">
              {taskStats.inProgress}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              In Progress
            </Typography>
          </CardContent>
        </Card>
        <Card variant="outlined" sx={{ minWidth: 0 }}>
          <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
            <Typography variant="h6" component="div" color="success.main">
              {taskStats.completed}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Completed
            </Typography>
          </CardContent>
        </Card>
        <Card variant="outlined" sx={{ minWidth: 0 }}>
          <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
            <Typography variant="h6" component="div" color="error.main">
              {taskStats.overdue}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Overdue
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Tasks Data Grid */}
      <Card variant="outlined">
        <DataGrid
          rows={tasks}
          columns={columns}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10, 25, 50]}
          checkboxSelection
          disableRowSelectionOnClick
          autoHeight
          getRowId={(row) => row.id}
          localeText={{
            noRowsLabel: "No tasks found",
            footerRowSelected: (count) =>
              count !== 1
                ? `${count.toLocaleString()} tasks selected`
                : `${count.toLocaleString()} task selected`,
          }}
          slotProps={{
            pagination: {
              labelDisplayedRows: ({ from, to, count }) =>
                `${from}–${to} of ${count !== -1 ? count : `more than ${to}`} tasks`,
            },
          }}
          sx={{
            border: "none",
            "& .MuiDataGrid-cell": {
              py: 1,
            },
            "& .MuiDataGrid-row": {
              minHeight: "60px !important",
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "action.hover",
            },
            // Responsive column hiding
            "& .MuiDataGrid-columnHeader[data-field='tags']": {
              display: { xs: "none", lg: "flex" },
            },
            "& .MuiDataGrid-cell[data-field='tags']": {
              display: { xs: "none", lg: "block" },
            },
            "& .MuiDataGrid-columnHeader[data-field='assignee']": {
              display: { xs: "none", md: "flex" },
            },
            "& .MuiDataGrid-cell[data-field='assignee']": {
              display: { xs: "none", md: "block" },
            },
          }}
        />
      </Card>

      {/* Dialogs */}
      <TaskCreateDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSubmit={handleCreateTask}
      />
      
      <TaskEditDialog
        open={editDialogOpen}
        onClose={() => {
          setEditDialogOpen(false);
          setSelectedTask(null);
        }}
        onSubmit={handleEditTask}
        task={selectedTask}
      />
    </Box>
  );
}
