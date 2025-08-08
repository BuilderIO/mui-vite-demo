import * as React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Badge,
  Chip,
  Button,
  Tooltip,
  Divider,
  Alert,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  MarkEmailRead as MarkEmailReadIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  AccessTime as TimeIcon,
  NotificationsOff as NotificationsOffIcon,
} from '@mui/icons-material';
import { Notification } from '../types/taskTypes';
import { mockNotifications } from '../data/taskData';

interface TaskNotificationsProps {
  notifications?: Notification[];
  onMarkAsRead?: (notificationId: string) => void;
  onMarkAllAsRead?: () => void;
  onDeleteNotification?: (notificationId: string) => void;
}

function getNotificationIcon(type: Notification['type']) {
  switch (type) {
    case 'task_assigned':
      return <AssignmentIcon color="primary" />;
    case 'task_due_soon':
      return <TimeIcon color="warning" />;
    case 'task_overdue':
      return <WarningIcon color="error" />;
    case 'task_completed':
      return <CheckCircleIcon color="success" />;
    default:
      return <NotificationsIcon />;
  }
}

function getNotificationColor(type: Notification['type']) {
  switch (type) {
    case 'task_assigned':
      return 'primary';
    case 'task_due_soon':
      return 'warning';
    case 'task_overdue':
      return 'error';
    case 'task_completed':
      return 'success';
    default:
      return 'default';
  }
}

function formatNotificationType(type: Notification['type']) {
  switch (type) {
    case 'task_assigned':
      return 'Task Assigned';
    case 'task_due_soon':
      return 'Due Soon';
    case 'task_overdue':
      return 'Overdue';
    case 'task_completed':
      return 'Completed';
    default:
      return 'Notification';
  }
}

function formatTimeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
}

export default function TaskNotifications({
  notifications = mockNotifications,
  onMarkAsRead = () => {},
  onMarkAllAsRead = () => {},
  onDeleteNotification = () => {},
}: TaskNotificationsProps) {
  const unreadCount = notifications.filter(n => !n.read).length;
  const hasNotifications = notifications.length > 0;

  if (!hasNotifications) {
    return (
      <Card>
        <CardContent>
          <Stack spacing={2} alignItems="center" sx={{ py: 4 }}>
            <NotificationsOffIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
            <Typography variant="h6" color="text.secondary">
              No Notifications
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              You're all caught up! New notifications will appear here.
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Badge badgeContent={unreadCount} color="error">
                <NotificationsIcon />
              </Badge>
              <Typography variant="h6">
                Notifications
              </Typography>
              {unreadCount > 0 && (
                <Chip
                  label={`${unreadCount} unread`}
                  size="small"
                  color="error"
                  variant="outlined"
                />
              )}
            </Box>
            {unreadCount > 0 && (
              <Button
                size="small"
                startIcon={<MarkEmailReadIcon />}
                onClick={onMarkAllAsRead}
                variant="outlined"
              >
                Mark All Read
              </Button>
            )}
          </Box>

          {/* Notifications List */}
          <List sx={{ p: 0 }}>
            {notifications.map((notification, index) => (
              <React.Fragment key={notification.id}>
                <ListItem
                  sx={{
                    px: 0,
                    backgroundColor: notification.read ? 'transparent' : 'action.hover',
                    borderRadius: 1,
                    mb: 1,
                  }}
                  secondaryAction={
                    <Stack direction="row" spacing={0.5}>
                      {!notification.read && (
                        <Tooltip title="Mark as read">
                          <IconButton
                            size="small"
                            onClick={() => onMarkAsRead(notification.id)}
                          >
                            <MarkEmailReadIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Delete notification">
                        <IconButton
                          size="small"
                          onClick={() => onDeleteNotification(notification.id)}
                          color="error"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  }
                >
                  <ListItemAvatar>
                    <Avatar sx={{ 
                      bgcolor: `${getNotificationColor(notification.type)}.light`,
                      color: `${getNotificationColor(notification.type)}.main`
                    }}>
                      {getNotificationIcon(notification.type)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography 
                          variant="subtitle2" 
                          sx={{ 
                            fontWeight: notification.read ? 400 : 600,
                            flex: 1 
                          }}
                        >
                          {notification.title}
                        </Typography>
                        <Chip
                          label={formatNotificationType(notification.type)}
                          size="small"
                          color={getNotificationColor(notification.type) as any}
                          variant="outlined"
                        />
                        {!notification.read && (
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              backgroundColor: 'error.main',
                            }}
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <Stack spacing={0.5}>
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ fontWeight: notification.read ? 400 : 500 }}
                        >
                          {notification.message}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatTimeAgo(notification.createdAt)}
                        </Typography>
                      </Stack>
                    }
                  />
                </ListItem>
                {index < notifications.length - 1 && (
                  <Divider variant="inset" component="li" />
                )}
              </React.Fragment>
            ))}
          </List>

          {/* Critical Notifications Alert */}
          {notifications.some(n => n.type === 'task_overdue' && !n.read) && (
            <Alert severity="error" sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Critical Action Required
              </Typography>
              <Typography variant="body2">
                You have overdue tasks that need immediate attention. 
                Please review and update these tasks to keep your projects on track.
              </Typography>
            </Alert>
          )}

          {/* Due Soon Alert */}
          {notifications.some(n => n.type === 'task_due_soon' && !n.read) && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Tasks Due Soon
              </Typography>
              <Typography variant="body2">
                You have tasks due within the next 24 hours. 
                Review your upcoming deadlines to ensure timely completion.
              </Typography>
            </Alert>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
