import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  Typography,
  Box,
  Avatar,
  Chip,
} from "@mui/material";
import {
  PlayArrow as PlayArrowIcon,
  CheckCircle as CheckCircleIcon,
  Pause as PauseIcon,
  Stop as StopIcon,
} from "@mui/icons-material";
import { Task, TaskStatusHistory as TaskStatusHistoryType, TaskStatus } from "../types/taskTypes";
import { mockTaskStatusHistory, mockTeamMembers } from "../data/mockTaskData";

interface TaskStatusHistoryProps {
  open: boolean;
  task: Task | null;
  onClose: () => void;
}

const getStatusIcon = (status: TaskStatus) => {
  switch (status) {
    case "Not Started":
      return <StopIcon />;
    case "In Progress":
      return <PlayArrowIcon />;
    case "On Hold":
      return <PauseIcon />;
    case "Completed":
      return <CheckCircleIcon />;
    default:
      return <StopIcon />;
  }
};

const getStatusColor = (status: TaskStatus) => {
  switch (status) {
    case "Not Started":
      return "grey";
    case "In Progress":
      return "primary";
    case "On Hold":
      return "warning";
    case "Completed":
      return "success";
    default:
      return "grey";
  }
};

export default function TaskStatusHistory({ open, task, onClose }: TaskStatusHistoryProps) {
  if (!task) return null;

  // Get status history for this task
  const statusHistory = mockTaskStatusHistory
    .filter(history => history.taskId === task.id)
    .sort((a, b) => b.changedAt.getTime() - a.changedAt.getTime());

  // Add creation event to history
  const fullHistory = [
    {
      id: `creation-${task.id}`,
      taskId: task.id,
      fromStatus: null,
      toStatus: "Not Started" as TaskStatus,
      changedBy: task.createdBy,
      changedAt: task.createdAt,
      notes: "Task created",
    },
    ...statusHistory,
  ].sort((a, b) => a.changedAt.getTime() - b.changedAt.getTime());

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Task Status History: {task.title}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {fullHistory.length === 1 ? (
            <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 4 }}>
              No status changes yet. This task was just created.
            </Typography>
          ) : (
            <Timeline>
              {fullHistory.map((historyItem, index) => {
                const user = mockTeamMembers.find(member => member.id === historyItem.changedBy);
                const isLast = index === fullHistory.length - 1;
                
                return (
                  <TimelineItem key={historyItem.id}>
                    <TimelineSeparator>
                      <TimelineDot color={getStatusColor(historyItem.toStatus)}>
                        {getStatusIcon(historyItem.toStatus)}
                      </TimelineDot>
                      {!isLast && <TimelineConnector />}
                    </TimelineSeparator>
                    <TimelineContent sx={{ py: "12px", px: 2 }}>
                      <Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                          <Chip
                            label={historyItem.toStatus}
                            size="small"
                            color={getStatusColor(historyItem.toStatus)}
                            variant="outlined"
                          />
                          {historyItem.fromStatus && (
                            <>
                              <Typography variant="body2" color="text.secondary">
                                from
                              </Typography>
                              <Chip
                                label={historyItem.fromStatus}
                                size="small"
                                variant="outlined"
                                sx={{ opacity: 0.7 }}
                              />
                            </>
                          )}
                        </Box>
                        
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                          <Avatar
                            src={user?.avatar}
                            alt={user?.name}
                            sx={{ width: 24, height: 24 }}
                          />
                          <Typography variant="body2">
                            {user?.name || "Unknown User"}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {historyItem.changedAt.toLocaleString()}
                          </Typography>
                        </Box>

                        {historyItem.notes && (
                          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
                            "{historyItem.notes}"
                          </Typography>
                        )}
                      </Box>
                    </TimelineContent>
                  </TimelineItem>
                );
              })}
            </Timeline>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
