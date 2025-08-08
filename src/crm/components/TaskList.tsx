import * as React from "react";
import {
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  TableSortLabel,
  Tooltip,
  LinearProgress,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
} from "@mui/icons-material";
import { Task, useTaskContext } from "../contexts/TaskContext";
import {
  getPriorityColor,
  getStatusColor,
  getPriorityLabel,
  getStatusLabel,
  isTaskOverdue,
  isTaskDueSoon,
  formatDueDate,
  sortTasks,
} from "../utils/taskUtils";

interface TaskListProps {
  onEditTask: (task: Task) => void;
  searchQuery: string;
}

export default function TaskList({ onEditTask, searchQuery }: TaskListProps) {
  const { getFilteredTasks, updateTaskStatus, deleteTask } = useTaskContext();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null);
  const [sortBy, setSortBy] = React.useState<string>("updatedAt");
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("desc");

  const tasks = React.useMemo(() => {
    let filteredTasks = getFilteredTasks();
    
    // Apply search query
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      filteredTasks = filteredTasks.filter(
        (task) =>
          task.title.toLowerCase().includes(searchLower) ||
          task.description?.toLowerCase().includes(searchLower) ||
          task.assignee?.name.toLowerCase().includes(searchLower)
      );
    }

    return sortTasks(filteredTasks, sortBy, sortOrder);
  }, [getFilteredTasks, searchQuery, sortBy, sortOrder]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, task: Task) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedTask(task);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTask(null);
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const handleStatusChange = (taskId: string, newStatus: Task["status"]) => {
    updateTaskStatus(taskId, newStatus);
    handleMenuClose();
  };

  const handleEditTask = () => {
    if (selectedTask) {
      onEditTask(selectedTask);
      handleMenuClose();
    }
  };

  const handleDeleteTask = () => {
    if (selectedTask) {
      deleteTask(selectedTask.id);
      handleMenuClose();
    }
  };

  const getRowStyle = (task: Task) => {
    if (isTaskOverdue(task)) {
      return {
        backgroundColor: "rgba(211, 47, 47, 0.04)",
        borderLeft: "4px solid #d32f2f",
      };
    }
    if (isTaskDueSoon(task)) {
      return {
        backgroundColor: "rgba(255, 152, 0, 0.04)",
        borderLeft: "4px solid #ff9800",
      };
    }
    return {};
  };

  const StatusIcon = ({ status }: { status: Task["status"] }) => {
    switch (status) {
      case "completed":
        return <CheckCircleIcon color="success" fontSize="small" />;
      case "in_progress":
        return <PlayArrowIcon color="primary" fontSize="small" />;
      case "on_hold":
        return <PauseIcon color="warning" fontSize="small" />;
      default:
        return <ScheduleIcon color="disabled" fontSize="small" />;
    }
  };

  if (tasks.length === 0) {
    return (
      <Card variant="outlined">
        <CardContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              py: 8,
              textAlign: "center",
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No tasks found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchQuery
                ? "Try adjusting your search or filters"
                : "Create your first task to get started"}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="outlined">
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={sortBy === "title"}
                  direction={sortBy === "title" ? sortOrder : "asc"}
                  onClick={() => handleSort("title")}
                >
                  Task
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortBy === "assignee"}
                  direction={sortBy === "assignee" ? sortOrder : "asc"}
                  onClick={() => handleSort("assignee")}
                >
                  Assignee
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortBy === "priority"}
                  direction={sortBy === "priority" ? sortOrder : "asc"}
                  onClick={() => handleSort("priority")}
                >
                  Priority
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortBy === "status"}
                  direction={sortBy === "status" ? sortOrder : "asc"}
                  onClick={() => handleSort("status")}
                >
                  Status
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortBy === "dueDate"}
                  direction={sortBy === "dueDate" ? sortOrder : "asc"}
                  onClick={() => handleSort("dueDate")}
                >
                  Due Date
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task) => (
              <TableRow 
                key={task.id} 
                hover 
                sx={{
                  cursor: "pointer",
                  ...getRowStyle(task),
                }}
                onClick={() => onEditTask(task)}
              >
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <StatusIcon status={task.status} />
                    <Box>
                      <Typography variant="body2" fontWeight={500}>
                        {task.title}
                      </Typography>
                      {task.description && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            display: "-webkit-box",
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {task.description}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  {task.assignee ? (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Avatar sx={{ width: 24, height: 24, fontSize: "0.75rem" }}>
                        {task.assignee.avatar}
                      </Avatar>
                      <Typography variant="body2">{task.assignee.name}</Typography>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Unassigned
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Chip
                    label={getPriorityLabel(task.priority)}
                    size="small"
                    color={getPriorityColor(task.priority)}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={getStatusLabel(task.status)}
                    size="small"
                    color={getStatusColor(task.status)}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  {task.dueDate ? (
                    <Tooltip title={task.dueDate.toLocaleString()}>
                      <Typography
                        variant="body2"
                        color={
                          isTaskOverdue(task)
                            ? "error"
                            : isTaskDueSoon(task)
                            ? "warning.main"
                            : "text.primary"
                        }
                      >
                        {formatDueDate(task.dueDate)}
                      </Typography>
                    </Tooltip>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No due date
                    </Typography>
                  )}
                </TableCell>
                <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, task)}
                    aria-label="task actions"
                  >
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleEditTask}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Edit Task
        </MenuItem>
        {selectedTask?.status !== "not_started" && (
          <MenuItem onClick={() => selectedTask && handleStatusChange(selectedTask.id, "not_started")}>
            <ScheduleIcon fontSize="small" sx={{ mr: 1 }} />
            Mark Not Started
          </MenuItem>
        )}
        {selectedTask?.status !== "in_progress" && (
          <MenuItem onClick={() => selectedTask && handleStatusChange(selectedTask.id, "in_progress")}>
            <PlayArrowIcon fontSize="small" sx={{ mr: 1 }} />
            Mark In Progress
          </MenuItem>
        )}
        {selectedTask?.status !== "completed" && (
          <MenuItem onClick={() => selectedTask && handleStatusChange(selectedTask.id, "completed")}>
            <CheckCircleIcon fontSize="small" sx={{ mr: 1 }} />
            Mark Completed
          </MenuItem>
        )}
        {selectedTask?.status !== "on_hold" && (
          <MenuItem onClick={() => selectedTask && handleStatusChange(selectedTask.id, "on_hold")}>
            <PauseIcon fontSize="small" sx={{ mr: 1 }} />
            Mark On Hold
          </MenuItem>
        )}
        <MenuItem onClick={handleDeleteTask} sx={{ color: "error.main" }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete Task
        </MenuItem>
      </Menu>
    </Card>
  );
}
