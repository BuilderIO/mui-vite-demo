import * as React from 'react';
import {
  Box,
  Typography,
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
  Avatar,
  Chip,
  Paper,
  Card,
  CardContent,
} from '@mui/material';
import {
  Assignment as TaskIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  CheckCircle as CompletedIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';

import { TaskStatusChange, TaskStatus } from '../types/task';

interface TaskStatusHistoryProps {
  statusHistory: TaskStatusChange[];
  compact?: boolean;
}

export default function TaskStatusHistory({ statusHistory, compact = false }: TaskStatusHistoryProps) {
  const theme = useTheme();

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case 'Not Started':
        return <TaskIcon />;
      case 'In Progress':
        return <PlayIcon />;
      case 'On Hold':
        return <PauseIcon />;
      case 'Completed':
        return <CompletedIcon />;
      default:
        return <TaskIcon />;
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'Not Started':
        return theme.palette.grey[500];
      case 'In Progress':
        return theme.palette.info.main;
      case 'On Hold':
        return theme.palette.warning.main;
      case 'Completed':
        return theme.palette.success.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (statusHistory.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body2" color="text.secondary">
          No status changes recorded yet
        </Typography>
      </Box>
    );
  }

  if (compact) {
    return (
      <Box>
        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
          Status History
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {statusHistory
            .sort((a, b) => new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime())
            .slice(0, 3)
            .map((change, index) => (
              <Paper
                key={change.id}
                sx={{
                  p: 2,
                  backgroundColor: alpha(getStatusColor(change.status), 0.05),
                  border: `1px solid ${alpha(getStatusColor(change.status), 0.2)}`,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Avatar
                    sx={{
                      width: 24,
                      height: 24,
                      backgroundColor: alpha(getStatusColor(change.status), 0.1),
                      color: getStatusColor(change.status),
                    }}
                  >
                    {getStatusIcon(change.status)}
                  </Avatar>
                  <Chip
                    label={change.status}
                    size="small"
                    sx={{
                      backgroundColor: alpha(getStatusColor(change.status), 0.1),
                      color: getStatusColor(change.status),
                      fontWeight: 600,
                    }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                    {formatDateTime(change.changedAt)}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Changed by {change.changedBy}
                </Typography>
                {change.notes && (
                  <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                    "{change.notes}"
                  </Typography>
                )}
              </Paper>
            ))}
          {statusHistory.length > 3 && (
            <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', mt: 1 }}>
              +{statusHistory.length - 3} more changes
            </Typography>
          )}
        </Box>
      </Box>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          Status History
        </Typography>
        <Timeline
          sx={{
            [`& .MuiTimelineItem-root:before`]: {
              flex: 0,
              padding: 0,
            },
          }}
        >
          {statusHistory
            .sort((a, b) => new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime())
            .map((change, index) => (
              <TimelineItem key={change.id}>
                <TimelineOppositeContent
                  sx={{ m: 'auto 0', flex: 0.3 }}
                  align="right"
                  variant="body2"
                  color="text.secondary"
                >
                  <Typography variant="caption" display="block">
                    {formatDateTime(change.changedAt)}
                  </Typography>
                  <Typography variant="caption" display="block" sx={{ fontWeight: 500 }}>
                    {change.changedBy}
                  </Typography>
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot
                    sx={{
                      backgroundColor: getStatusColor(change.status),
                      color: 'white',
                    }}
                  >
                    {getStatusIcon(change.status)}
                  </TimelineDot>
                  {index < statusHistory.length - 1 && (
                    <TimelineConnector
                      sx={{
                        backgroundColor: alpha(getStatusColor(change.status), 0.3),
                      }}
                    />
                  )}
                </TimelineSeparator>
                <TimelineContent sx={{ py: '12px', px: 2 }}>
                  <Typography variant="h6" component="span" sx={{ fontWeight: 600 }}>
                    {change.status}
                  </Typography>
                  {change.notes && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {change.notes}
                    </Typography>
                  )}
                </TimelineContent>
              </TimelineItem>
            ))}
        </Timeline>
      </CardContent>
    </Card>
  );
}
