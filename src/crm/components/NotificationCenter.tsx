import * as React from 'react';
import {
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Typography,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Button,
  Chip,
  Alert,
  Paper,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Assignment as TaskIcon,
  Schedule as ScheduleIcon,
  Warning as WarningIcon,
  CheckCircle as CompletedIcon,
  Clear as ClearIcon,
  MarkEmailRead as MarkReadIcon,
} from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';

import { Notification } from '../types/task';
import { mockNotifications, getCurrentUser } from '../data/mockTasks';

interface NotificationCenterProps {
  onNotificationClick?: (notification: Notification) => void;
}

export default function NotificationCenter({ onNotificationClick }: NotificationCenterProps) {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = React.useState<Notification[]>(mockNotifications);
  
  const currentUser = getCurrentUser();
  const userNotifications = notifications.filter(n => n.userId === currentUser.id);
  const unreadCount = userNotifications.filter(n => !n.read).length;

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    setNotifications(prev => 
      prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
    );
    
    // Call callback if provided
    if (onNotificationClick) {
      onNotificationClick(notification);
    }
    
    handleClose();
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => 
      prev.map(n => n.userId === currentUser.id ? { ...n, read: true } : n)
    );
  };

  const handleClearAll = () => {
    setNotifications(prev => 
      prev.filter(n => n.userId !== currentUser.id)
    );
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'task_assigned':
        return <TaskIcon />;
      case 'task_due_soon':
        return <ScheduleIcon />;
      case 'task_overdue':
        return <WarningIcon />;
      case 'task_completed':
        return <CompletedIcon />;
      default:
        return <NotificationsIcon />;
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'task_assigned':
        return theme.palette.info.main;
      case 'task_due_soon':
        return theme.palette.warning.main;
      case 'task_overdue':
        return theme.palette.error.main;
      case 'task_completed':
        return theme.palette.success.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const formatNotificationTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return `${diffMinutes}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleClick}
        sx={{
          position: 'relative',
          '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
          }
        }}
      >
        <Badge badgeContent={unreadCount} color="error" max={99}>
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 400,
            maxHeight: 600,
            mt: 1,
          },
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {/* Header */}
        <Box sx={{ p: 2, pb: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Notifications
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {unreadCount > 0 && (
                <Button
                  size="small"
                  startIcon={<MarkReadIcon />}
                  onClick={handleMarkAllRead}
                  sx={{ fontSize: '0.75rem' }}
                >
                  Mark all read
                </Button>
              )}
              {userNotifications.length > 0 && (
                <Button
                  size="small"
                  startIcon={<ClearIcon />}
                  onClick={handleClearAll}
                  color="error"
                  sx={{ fontSize: '0.75rem' }}
                >
                  Clear
                </Button>
              )}
            </Box>
          </Box>
          {unreadCount > 0 && (
            <Typography variant="body2" color="text.secondary">
              {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </Typography>
          )}
        </Box>

        <Divider />

        {/* Notifications List */}
        {userNotifications.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <NotificationsIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
            <Typography variant="body2" color="text.secondary">
              No notifications yet
            </Typography>
            <Typography variant="caption" color="text.secondary">
              You'll see task updates and reminders here
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0, maxHeight: 400, overflow: 'auto' }}>
            {userNotifications
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((notification) => (
                <ListItem
                  key={notification.id}
                  button
                  onClick={() => handleNotificationClick(notification)}
                  sx={{
                    py: 1.5,
                    backgroundColor: notification.read ? 'transparent' : alpha(theme.palette.primary.main, 0.05),
                    borderLeft: notification.read ? 'none' : `3px solid ${theme.palette.primary.main}`,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    },
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        bgcolor: alpha(getNotificationColor(notification.type), 0.1),
                        color: getNotificationColor(notification.type),
                        width: 40,
                        height: 40,
                      }}
                    >
                      {getNotificationIcon(notification.type)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: notification.read ? 400 : 600,
                            color: notification.read ? 'text.secondary' : 'text.primary',
                          }}
                        >
                          {notification.title}
                        </Typography>
                        {!notification.read && (
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              backgroundColor: theme.palette.primary.main,
                              ml: 1,
                              flexShrink: 0,
                            }}
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            mt: 0.5,
                          }}
                        >
                          {notification.message}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                          {formatNotificationTime(notification.createdAt)}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
          </List>
        )}

        {/* Footer */}
        {userNotifications.length > 0 && (
          <>
            <Divider />
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Button size="small" color="primary" onClick={handleClose}>
                View All Notifications
              </Button>
            </Box>
          </>
        )}
      </Menu>
    </>
  );
}

// Hook for adding new notifications
export const useNotifications = () => {
  const [notifications, setNotifications] = React.useState<Notification[]>(mockNotifications);

  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setNotifications(prev => [newNotification, ...prev]);
    return newNotification;
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  };

  const removeNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  return {
    notifications,
    addNotification,
    markAsRead,
    removeNotification,
  };
};
