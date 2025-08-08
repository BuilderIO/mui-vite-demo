import * as React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Stack,
  Chip,
  Avatar,
  IconButton,
  Collapse,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Schedule as ScheduleIcon,
  Flag as FlagIcon,
} from "@mui/icons-material";
import { Task } from "../types/taskTypes";
import { isTaskOverdue, formatDueDate, getPriorityColor, getStatusColor } from "../utils/taskUtils";

interface TaskSummaryCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onStatusChange: (task: Task, newStatus: Task['status']) => void;
}

export default function TaskSummaryCard({
  task,
  onEdit,
  onStatusChange,
}: TaskSummaryCardProps) {
  const [expanded, setExpanded] = React.useState(false);

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

  const handleStatusClick = (newStatus: Task['status']) => {
    onStatusChange(task, newStatus);
  };

  return (
    <Card
      variant="outlined"
      sx={{
        borderLeft: `4px solid ${priorityColor}`,
        backgroundColor: isOverdue ? "error.light" : "background.paper",
        "&:hover": {
          boxShadow: 1,
        },
      }}
    >
      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
          <Typography variant="subtitle2" component="h3" sx={{ fontWeight: 600, flex: 1, pr: 1 }}>
            {task.title}
          </Typography>
          <IconButton
            size="small"
            onClick={() => setExpanded(!expanded)}
            sx={{ mt: -0.5 }}
          >
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>

        {/* Progress bar */}
        <LinearProgress
          variant="determinate"
          value={getProgressValue()}
          sx={{
            height: 4,
            borderRadius: 2,
            bgcolor: "grey.200",
            mb: 2,
            "& .MuiLinearProgress-bar": {
              bgcolor: statusColor,
              borderRadius: 2,
            },
          }}
        />

        {/* Status and Priority */}
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
          <Chip
            label={task.status}
            size="small"
            sx={{
              bgcolor: statusColor,
              color: "white",
              fontSize: "0.75rem",
              height: 20,
            }}
            onClick={() => {
              const statuses: Task['status'][] = ["Not Started", "In Progress", "On Hold", "Completed"];
              const currentIndex = statuses.indexOf(task.status);
              const nextStatus = statuses[(currentIndex + 1) % statuses.length];
              handleStatusClick(nextStatus);
            }}
          />
          <Chip
            icon={<FlagIcon sx={{ color: "white !important", fontSize: "12px !important" }} />}
            label={task.priority}
            size="small"
            sx={{
              bgcolor: priorityColor,
              color: "white",
              fontSize: "0.75rem",
              height: 20,
            }}
          />
        </Stack>

        {/* Assignee and Due Date */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Avatar
              src={task.assignee.avatar}
              alt={task.assignee.name}
              sx={{ width: 20, height: 20 }}
            />
            <Typography variant="caption" color="text.secondary">
              {task.assignee.name.split(' ')[0]}
            </Typography>
          </Box>

          {task.dueDate && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <ScheduleIcon sx={{ fontSize: 12, color: isOverdue ? "error.main" : "text.secondary" }} />
              <Typography
                variant="caption"
                color={isOverdue ? "error.main" : "text.secondary"}
                sx={{ fontSize: "0.7rem" }}
              >
                {task.dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Expanded Content */}
        <Collapse in={expanded}>
          <Box sx={{ mt: 2, pt: 1, borderTop: 1, borderColor: "divider" }}>
            {task.description && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: "0.8rem" }}>
                {task.description}
              </Typography>
            )}

            {task.tags && task.tags.length > 0 && (
              <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", mb: 1 }}>
                {task.tags.slice(0, 3).map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: "0.65rem", height: 16 }}
                  />
                ))}
                {task.tags.length > 3 && (
                  <Typography variant="caption" color="text.secondary">
                    +{task.tags.length - 3} more
                  </Typography>
                )}
              </Box>
            )}

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              {task.estimatedHours && (
                <Typography variant="caption" color="text.secondary">
                  Est: {task.estimatedHours}h
                </Typography>
              )}
              <Typography variant="caption" color="text.secondary" onClick={() => onEdit(task)} sx={{ cursor: "pointer", textDecoration: "underline" }}>
                Edit
              </Typography>
            </Box>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
}
