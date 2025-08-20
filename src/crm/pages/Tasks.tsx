import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import RefreshIcon from "@mui/icons-material/Refresh";
import { DataGrid, GridColDef, GridActionsCellItem } from "@mui/x-data-grid";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import TaskCreateEditModal from "../components/TaskCreateEditModal";
import TaskFilters from "../components/TaskFilters";

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  status: "pending" | "in_progress" | "completed" | "on_hold";
  assignedTo: {
    id: string;
    name: string;
    email: string;
  } | null;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

interface TaskFilters {
  priority: string[];
  status: string[];
  assignedTo: string[];
  dueDateRange: {
    start: Dayjs | null;
    end: Dayjs | null;
  };
}

const priorityColors = {
  high: "error" as const,
  medium: "warning" as const,
  low: "success" as const,
};

const statusColors = {
  pending: "default" as const,
  in_progress: "info" as const,
  completed: "success" as const,
  on_hold: "warning" as const,
};

const statusLabels = {
  pending: "Pending",
  in_progress: "In Progress",
  completed: "Completed",
  on_hold: "On Hold",
};

// Sample data - in a real app, this would come from an API
const initialTasks: Task[] = [
  {
    id: "1",
    title: "Review Q4 sales report",
    description: "Analyze quarterly sales performance and identify growth opportunities",
    priority: "high",
    status: "pending",
    assignedTo: {
      id: "user1",
      name: "John Doe",
      email: "john.doe@example.com"
    },
    dueDate: dayjs().add(2, "days").toISOString(),
    createdAt: dayjs().subtract(1, "day").toISOString(),
    updatedAt: dayjs().subtract(1, "day").toISOString(),
  },
  {
    id: "2",
    title: "Update CRM system documentation",
    description: "Create comprehensive user guide for the new CRM features",
    priority: "medium",
    status: "in_progress",
    assignedTo: {
      id: "user2",
      name: "Jane Smith",
      email: "jane.smith@example.com"
    },
    dueDate: dayjs().add(5, "days").toISOString(),
    createdAt: dayjs().subtract(3, "days").toISOString(),
    updatedAt: dayjs().subtract(1, "hour").toISOString(),
  },
  {
    id: "3",
    title: "Prepare client presentation",
    description: "Create slides for upcoming client meeting about project timeline",
    priority: "high",
    status: "completed",
    assignedTo: {
      id: "user3",
      name: "Mike Johnson",
      email: "mike.johnson@example.com"
    },
    dueDate: dayjs().subtract(1, "day").toISOString(),
    createdAt: dayjs().subtract(5, "days").toISOString(),
    updatedAt: dayjs().subtract(1, "day").toISOString(),
  },
  {
    id: "4",
    title: "Conduct team training session",
    description: "Organize training for new project management tools",
    priority: "low",
    status: "on_hold",
    assignedTo: null,
    dueDate: dayjs().add(10, "days").toISOString(),
    createdAt: dayjs().subtract(2, "days").toISOString(),
    updatedAt: dayjs().subtract(2, "days").toISOString(),
  },
];

export default function Tasks() {
  const [tasks, setTasks] = React.useState<Task[]>(initialTasks);
  const [filteredTasks, setFilteredTasks] = React.useState<Task[]>(initialTasks);
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState<Task | null>(null);
  const [isFiltersOpen, setIsFiltersOpen] = React.useState(false);
  const [filters, setFilters] = React.useState<TaskFilters>({
    priority: [],
    status: [],
    assignedTo: [],
    dueDateRange: {
      start: null,
      end: null,
    },
  });
  const [loading, setLoading] = React.useState(false);

  // Apply filters whenever filters or tasks change
  React.useEffect(() => {
    let filtered = [...tasks];

    if (filters.priority.length > 0) {
      filtered = filtered.filter(task => filters.priority.includes(task.priority));
    }

    if (filters.status.length > 0) {
      filtered = filtered.filter(task => filters.status.includes(task.status));
    }

    if (filters.assignedTo.length > 0) {
      filtered = filtered.filter(task => 
        task.assignedTo ? filters.assignedTo.includes(task.assignedTo.id) : false
      );
    }

    if (filters.dueDateRange.start || filters.dueDateRange.end) {
      filtered = filtered.filter(task => {
        if (!task.dueDate) return false;
        const taskDate = dayjs(task.dueDate);
        if (filters.dueDateRange.start && taskDate.isBefore(filters.dueDateRange.start)) {
          return false;
        }
        if (filters.dueDateRange.end && taskDate.isAfter(filters.dueDateRange.end)) {
          return false;
        }
        return true;
      });
    }

    setFilteredTasks(filtered);
  }, [tasks, filters]);

  const handleCreateTask = (newTask: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const task: Task = {
      ...newTask,
      id: Date.now().toString(),
      createdAt: dayjs().toISOString(),
      updatedAt: dayjs().toISOString(),
    };
    setTasks(prev => [...prev, task]);
    setIsCreateModalOpen(false);
  };

  const handleEditTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(task => 
      task.id === updatedTask.id 
        ? { ...updatedTask, updatedAt: dayjs().toISOString() }
        : task
    ));
    setEditingTask(null);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const handleRefresh = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const clearFilters = () => {
    setFilters({
      priority: [],
      status: [],
      assignedTo: [],
      dueDateRange: {
        start: null,
        end: null,
      },
    });
  };

  const columns: GridColDef[] = [
    {
      field: "title",
      headerName: "Task Title",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Box sx={{ py: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {params.value}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
            {params.row.description}
          </Typography>
        </Box>
      ),
    },
    {
      field: "priority",
      headerName: "Priority",
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={priorityColors[params.value as keyof typeof priorityColors]}
          size="small"
          variant="outlined"
          sx={{ textTransform: "capitalize" }}
        />
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => (
        <Chip
          label={statusLabels[params.value as keyof typeof statusLabels]}
          color={statusColors[params.value as keyof typeof statusColors]}
          size="small"
          variant="filled"
        />
      ),
    },
    {
      field: "assignedTo",
      headerName: "Assigned To",
      width: 150,
      renderCell: (params) => (
        params.value ? (
          <Box>
            <Typography variant="body2">{params.value.name}</Typography>
            <Typography variant="caption" color="text.secondary">
              {params.value.email}
            </Typography>
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Unassigned
          </Typography>
        )
      ),
    },
    {
      field: "dueDate",
      headerName: "Due Date",
      width: 120,
      renderCell: (params) => (
        params.value ? (
          <Box>
            <Typography variant="body2">
              {dayjs(params.value).format("MMM DD, YYYY")}
            </Typography>
            <Typography 
              variant="caption" 
              color={dayjs(params.value).isBefore(dayjs()) ? "error" : "text.secondary"}
            >
              {dayjs(params.value).fromNow()}
            </Typography>
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No due date
          </Typography>
        )
      ),
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      getActions: (params) => [
        <GridActionsCellItem
          key="edit"
          icon={<EditIcon />}
          label="Edit"
          onClick={() => setEditingTask(params.row)}
        />,
        <GridActionsCellItem
          key="delete"
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => handleDeleteTask(params.id as string)}
        />,
      ],
    },
  ];

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
        <Stack spacing={3}>
          {/* Header Section */}
          <Box>
            <Typography variant="h4" component="h1" sx={{ mb: 1 }}>
              Task Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Create, assign, and track tasks across your team. Monitor progress and ensure timely completion.
            </Typography>
          </Box>

          {/* Action Bar */}
          <Card>
            <CardContent>
              <Stack 
                direction={{ xs: "column", sm: "row" }} 
                spacing={2} 
                justifyContent="space-between"
                alignItems={{ xs: "stretch", sm: "center" }}
              >
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setIsCreateModalOpen(true)}
                  >
                    Create Task
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<FilterListIcon />}
                    onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                  >
                    Filters
                  </Button>
                  <IconButton onClick={handleRefresh} disabled={loading}>
                    <RefreshIcon />
                  </IconButton>
                </Stack>

                <Stack direction="row" spacing={2} alignItems="center">
                  <Typography variant="body2" color="text.secondary">
                    {filteredTasks.length} of {tasks.length} tasks
                  </Typography>
                  {(filters.priority.length > 0 || filters.status.length > 0 || 
                    filters.assignedTo.length > 0 || filters.dueDateRange.start || 
                    filters.dueDateRange.end) && (
                    <Button size="small" onClick={clearFilters}>
                      Clear Filters
                    </Button>
                  )}
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          {/* Filters Panel */}
          {isFiltersOpen && (
            <TaskFilters 
              filters={filters}
              onFiltersChange={setFilters}
              availableTasks={tasks}
            />
          )}

          {/* Tasks Data Grid */}
          <Card>
            <CardContent sx={{ p: 0 }}>
              <DataGrid
                rows={filteredTasks}
                columns={columns}
                loading={loading}
                checkboxSelection
                disableRowSelectionOnClick
                getRowHeight={() => "auto"}
                initialState={{
                  pagination: { paginationModel: { pageSize: 25 } },
                  sorting: {
                    sortModel: [{ field: "dueDate", sort: "asc" }],
                  },
                }}
                pageSizeOptions={[10, 25, 50, 100]}
                sx={{
                  border: 0,
                  "& .MuiDataGrid-cell": {
                    py: 1,
                  },
                }}
                slotProps={{
                  filterPanel: {
                    filterFormProps: {
                      logicOperatorInputProps: {
                        variant: "outlined",
                        size: "small",
                      },
                      columnInputProps: {
                        variant: "outlined",
                        size: "small",
                        sx: { mt: "auto" },
                      },
                      operatorInputProps: {
                        variant: "outlined",
                        size: "small",
                        sx: { mt: "auto" },
                      },
                      valueInputProps: {
                        InputComponentProps: {
                          variant: "outlined",
                          size: "small",
                        },
                      },
                    },
                  },
                }}
              />
            </CardContent>
          </Card>
        </Stack>

        {/* Create/Edit Task Modal */}
        <TaskCreateEditModal
          open={isCreateModalOpen || editingTask !== null}
          onClose={() => {
            setIsCreateModalOpen(false);
            setEditingTask(null);
          }}
          onSave={editingTask ? handleEditTask : handleCreateTask}
          task={editingTask}
          isEdit={editingTask !== null}
        />
      </Box>
    </LocalizationProvider>
  );
}
