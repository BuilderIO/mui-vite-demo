import * as React from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  Chip,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  LinearProgress,
  Tooltip,
  Stack,
  Divider,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Schedule as ScheduleIcon,
  Flag as FlagIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { Task } from "../types/taskTypes";
import { isTaskOverdue, formatDueDate, getPriorityColor, getStatusColor } from "../utils/taskUtils";

interface TaskListItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStatusChange: (task: Task, newStatus: Task['status']) => void;
}

export default function TaskListItem({
  task,
  onEdit,
  onDelete,
  onStatusChange,
}: TaskListItemProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    onEdit(task);
    handleMenuClose();
  };

  const handleDelete = () => {
    onDelete(task);
    handleMenuClose();
  };

  const handleStatusClick = (newStatus: Task['status']) => {
    onStatusChange(task, newStatus);
  };

  const isOverdue = isTaskOverdue(task);
  const priorityColor = getPriorityColor(task.priority);
  const statusColor = getStatusColor(task.status);

  const getProgressValue = () => {
    switch (task.status) {
      case "Not Started": return 0;
      case "In Progress": return 50;
      case "On Hold": return 25;
      case "Completed": return 100;
      default: return 0;
    }
  };

  return (
    <Card
      variant="outlined"
      sx={{
        mb: 2,
        borderLeft: `4px solid ${priorityColor}`,
        backgroundColor: isOverdue ? "error.light" : "background.paper",
        "&:hover": {
          boxShadow: 2,
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
          <Box sx={{ flexGrow: 1, mr: 2 }}>
            <Typography variant="h6" component="h3" gutterBottom>
              {task.title}
            </Typography>
            {task.description && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {task.description}
              </Typography>
            )}
          </Box>
          <IconButton
            size="small"
            onClick={handleMenuOpen}
            sx={{ mt: -1 }}
          >
            <MoreVertIcon />
          </IconButton>
        </Box>

        <Box sx={{ mb: 2 }}>
          <LinearProgress
            variant="determinate"
            value={getProgressValue()}
            sx={{
              height: 6,
              borderRadius: 3,
              bgcolor: "grey.200",
              "& .MuiLinearProgress-bar": {
                bgcolor: statusColor,
                borderRadius: 3,
              },
            }}
          />
        </Box>

        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2, flexWrap: "wrap", gap: 1 }}>
          <Chip
            label={task.status}
            size="small"
            sx={{
              bgcolor: statusColor,
              color: "white",
              fontWeight: 500,
            }}
            onClick={() => {
              const statuses: Task['status'][] = ["Not Started", "In Progress", "On Hold", "Completed"];
              const currentIndex = statuses.indexOf(task.status);
              const nextStatus = statuses[(currentIndex + 1) % statuses.length];
              handleStatusClick(nextStatus);
            }}
          />

          <Chip
            icon={<FlagIcon sx={{ color: "white !important" }} />}
            label={task.priority}
            size="small"
            sx={{
              bgcolor: priorityColor,
              color: "white",
              fontWeight: 500,
            }}
          />

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <PersonIcon sx={{ fontSize: 16, color: "text.secondary" }} />
            <Avatar
              src={task.assignee.avatar}
              alt={task.assignee.name}
              sx={{ width: 24, height: 24 }}
            />
            <Typography variant="body2" color="text.secondary">
              {task.assignee.name}
            </Typography>
          </Box>

          {task.dueDate && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <ScheduleIcon sx={{ fontSize: 16, color: isOverdue ? "error.main" : "text.secondary" }} />
              <Typography
                variant="body2"
                color={isOverdue ? "error.main" : "text.secondary"}
                sx={{ fontWeight: isOverdue ? 600 : 400 }}
              >
                {formatDueDate(task.dueDate)}
              </Typography>
            </Box>
          )}
        </Stack>

        {task.tags && task.tags.length > 0 && (
          <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", mb: 1 }}>
            {task.tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                variant="outlined"
                sx={{ fontSize: "0.75rem", height: 20 }}
              />
            ))}
          </Box>
        )}

        <Divider sx={{ my: 1 }} />

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            {task.estimatedHours && (
              <Typography variant="caption" color="text.secondary">
                Est: {task.estimatedHours}h
              </Typography>
            )}
            {task.actualHours && (
              <Typography variant="caption" color="text.secondary">
                Actual: {task.actualHours}h
              </Typography>
            )}
          </Box>
          <Typography variant="caption" color="text.secondary">
            Created: {task.createdAt.toLocaleDateString()}
          </Typography>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={handleEdit}>
            <EditIcon sx={{ mr: 1, fontSize: 18 }} />
            Edit Task
          </MenuItem>
          <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
            <DeleteIcon sx={{ mr: 1, fontSize: 18 }} />
            Delete Task
          </MenuItem>
        </Menu>
      </CardContent>
    </Card>
  );
}
