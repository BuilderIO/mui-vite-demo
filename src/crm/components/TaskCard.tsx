import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import LinearProgress from "@mui/material/LinearProgress";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import NotificationsIcon from "@mui/icons-material/Notifications";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import type { Task, TaskStatus, TaskPriority } from "../types/taskTypes";

dayjs.extend(relativeTime);

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onAssigneeChange?: (taskId: string, assigneeId: string) => void;
}

const getPriorityColor = (priority: TaskPriority): "error" | "warning" | "success" => {
  switch (priority) {
    case "high":
      return "error";
    case "medium":
      return "warning";
    case "low":
      return "success";
    default:
      return "success";
  }
};

const getStatusColor = (status: TaskStatus): "default" | "primary" | "success" | "warning" => {
  switch (status) {
    case "todo":
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

const isOverdue = (dueDate?: string): boolean => {
  if (!dueDate) return false;
  return dayjs(dueDate).isBefore(dayjs(), "day");
};

const isDueSoon = (dueDate?: string): boolean => {
  if (!dueDate) return false;
  const diffInDays = dayjs(dueDate).diff(dayjs(), "day");
  return diffInDays >= 0 && diffInDays <= 3;
};

export default function TaskCard({
  task,
  onEdit,
  onDelete,
  onStatusChange,
  onAssigneeChange,
}: TaskCardProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [statusMenuAnchor, setStatusMenuAnchor] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleStatusMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setStatusMenuAnchor(event.currentTarget);
  };

  const handleStatusMenuClose = () => {
    setStatusMenuAnchor(null);
  };

  const handleStatusChange = (newStatus: TaskStatus) => {
    onStatusChange(task.id, newStatus);
    handleStatusMenuClose();
  };

  const handleEdit = () => {
    onEdit(task);
    handleMenuClose();
  };

  const handleDelete = () => {
    onDelete(task.id);
    handleMenuClose();
  };

  const dueDateFormatted = task.dueDate
    ? dayjs(task.dueDate).format("MMM D, YYYY")
    : null;
  const dueDateRelative = task.dueDate ? dayjs(task.dueDate).fromNow() : null;

  const progress = task.status === "completed" ? 100 : 
                   task.status === "in_progress" ? 50 : 
                   task.status === "on_hold" ? 25 : 0;

  return (
    <Card
      variant="outlined"
      sx={{
        cursor: "pointer",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          boxShadow: 2,
          transform: "translateY(-2px)",
        },
        opacity: task.status === "completed" ? 0.8 : 1,
        borderLeft: isOverdue(task.dueDate) ? "4px solid #f44336" : 
                   isDueSoon(task.dueDate) ? "4px solid #ff9800" : "none",
      }}
    >
      <CardContent>
        <Stack spacing={2}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <Typography
              variant="h6"
              component="h3"
              sx={{
                fontWeight: 600,
                textDecoration: task.status === "completed" ? "line-through" : "none",
                color: task.status === "completed" ? "text.secondary" : "text.primary",
                flex: 1,
                mr: 1,
              }}
            >
              {task.title}
            </Typography>
            <IconButton
              size="small"
              onClick={handleMenuOpen}
              sx={{ ml: 1 }}
            >
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Box>

          {task.description && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {task.description}
            </Typography>
          )}

          <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
            <Chip
              label={getStatusLabel(task.status)}
              color={getStatusColor(task.status)}
              size="small"
              onClick={handleStatusMenuOpen}
              variant="outlined"
            />
            <Chip
              label={task.priority}
              color={getPriorityColor(task.priority)}
              size="small"
              variant="filled"
            />
          </Stack>

          {task.tags && task.tags.length > 0 && (
            <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5}>
              {task.tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: "0.75rem", height: 24 }}
                />
              ))}
            </Stack>
          )}

          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 2 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              {task.assignee && (
                <Tooltip title={`${task.assignee.name.first} ${task.assignee.name.last}`}>
                  <Avatar
                    src={task.assignee.picture?.thumbnail}
                    sx={{ width: 32, height: 32 }}
                  >
                    {task.assignee.name.first[0]}
                  </Avatar>
                </Tooltip>
              )}

              {task.dueDate && (
                <Tooltip title={dueDateFormatted}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <CalendarTodayIcon fontSize="small" color="action" />
                    <Typography
                      variant="caption"
                      color={isOverdue(task.dueDate) ? "error" : isDueSoon(task.dueDate) ? "warning.main" : "text.secondary"}
                      sx={{ fontWeight: 500 }}
                    >
                      {dueDateRelative}
                    </Typography>
                  </Box>
                </Tooltip>
              )}

              {task.estimatedHours && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <AccessTimeIcon fontSize="small" color="action" />
                  <Typography variant="caption" color="text.secondary">
                    {task.estimatedHours}h
                  </Typography>
                </Box>
              )}

              {task.reminderDate && dayjs(task.reminderDate).isAfter(dayjs()) && (
                <Tooltip title={`Reminder: ${dayjs(task.reminderDate).format("MMM D, YYYY HH:mm")}`}>
                  <NotificationsIcon fontSize="small" color="action" />
                </Tooltip>
              )}
            </Stack>
          </Box>

          {task.status !== "completed" && (
            <Box sx={{ mt: 1 }}>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: "grey.200",
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 3,
                  },
                }}
              />
            </Box>
          )}
        </Stack>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleEdit}>
            <EditIcon sx={{ mr: 1 }} fontSize="small" />
            Edit Task
          </MenuItem>
          <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
            <DeleteIcon sx={{ mr: 1 }} fontSize="small" />
            Delete Task
          </MenuItem>
        </Menu>

        <Menu
          anchorEl={statusMenuAnchor}
          open={Boolean(statusMenuAnchor)}
          onClose={handleStatusMenuClose}
        >
          <MenuItem onClick={() => handleStatusChange("todo")}>
            <Chip label="To Do" color="default" size="small" sx={{ mr: 1 }} />
            To Do
          </MenuItem>
          <MenuItem onClick={() => handleStatusChange("in_progress")}>
            <Chip label="In Progress" color="primary" size="small" sx={{ mr: 1 }} />
            In Progress
          </MenuItem>
          <MenuItem onClick={() => handleStatusChange("completed")}>
            <Chip label="Completed" color="success" size="small" sx={{ mr: 1 }} />
            Completed
          </MenuItem>
          <MenuItem onClick={() => handleStatusChange("on_hold")}>
            <Chip label="On Hold" color="warning" size="small" sx={{ mr: 1 }} />
            On Hold
          </MenuItem>
        </Menu>
      </CardContent>
    </Card>
  );
}
