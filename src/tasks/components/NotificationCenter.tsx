import React, { useState } from 'react';
import {
  Badge,
  IconButton,
  Popover,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Box,
  Button,
  Divider,
  Avatar,
  Chip,
  Alert,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Assignment as AssignmentIcon,
  Schedule as ScheduleIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Comment as CommentIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { Notification } from '../types/Task';
import { useTaskContext } from '../context/TaskContext';

const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'task_assigned':
      return <AssignmentIcon color="primary" />;
    case 'task_due':
      return <ScheduleIcon color="warning" />;
    case 'task_overdue':
      return <WarningIcon color="error" />;
    case 'task_completed':
      return <CheckCircleIcon color="success" />;
    case 'task_commented':
      return <CommentIcon color="info" />;
    default:
      return <NotificationsIcon />;
  }
};

const getNotificationColor = (type: Notification['type']) => {
  switch (type) {
    case 'task_assigned':
      return 'primary';
    case 'task_due':
      return 'warning';
    case 'task_overdue':
      return 'error';
    case 'task_completed':
      return 'success';
    case 'task_commented':
      return 'info';
    default:
      return 'default';
  }
};

export default function NotificationCenter() {
  const { notifications, markNotificationAsRead } = useTaskContext();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const recentNotifications = notifications
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markNotificationAsRead(notification.id);
    }
    
    // Navigate to task if actionUrl is provided
    if (notification.actionUrl) {
      // In a real app, you would use router navigation here
      console.log('Navigate to:', notification.actionUrl);
    }
  };

  const markAllAsRead = () => {
    notifications
      .filter(n => !n.isRead)
      .forEach(n => markNotificationAsRead(n.id));
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - new Date(date).getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return new Date(date).toLocaleDateString();
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleClick}
        sx={{ position: 'relative' }}
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: { width: 400, maxHeight: 500 }
        }}
      >
        <Paper>
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">
                Notifications
              </Typography>
              {unreadCount > 0 && (
                <Button
                  size="small"
                  onClick={markAllAsRead}
                  sx={{ textTransform: 'none' }}
                >
                  Mark all as read
                </Button>
              )}
            </Box>
            {unreadCount > 0 && (
              <Typography variant="body2" color="text.secondary">
                {unreadCount} unread notifications
              </Typography>
            )}
          </Box>

          <List sx={{ p: 0, maxHeight: 400, overflowY: 'auto' }}>
            {recentNotifications.length === 0 ? (
              <ListItem>
                <ListItemText
                  primary={
                    <Typography color="text.secondary" align="center">
                      No notifications yet
                    </Typography>
                  }
                />
              </ListItem>
            ) : (
              recentNotifications.map((notification, index) => (
                <React.Fragment key={notification.id}>
                  <ListItem
                    button
                    onClick={() => handleNotificationClick(notification)}
                    sx={{
                      backgroundColor: notification.isRead ? 'transparent' : 'action.hover',
                      '&:hover': {
                        backgroundColor: 'action.selected',
                      },
                    }}
                  >
                    <ListItemIcon>
                      {getNotificationIcon(notification.type)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: notification.isRead ? 'normal' : 'bold',
                              flexGrow: 1,
                            }}
                          >
                            {notification.title}
                          </Typography>
                          {!notification.isRead && (
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                backgroundColor: 'primary.main',
                              }}
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box sx={{ mt: 0.5 }}>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}
                          >
                            {notification.message}
                          </Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                              {formatTimestamp(notification.createdAt)}
                            </Typography>
                            <Chip
                              size="small"
                              label={notification.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              color={getNotificationColor(notification.type) as any}
                              variant="outlined"
                              sx={{ fontSize: '0.7rem', height: '20px' }}
                            />
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < recentNotifications.length - 1 && <Divider />}
                </React.Fragment>
              ))
            )}
          </List>

          {recentNotifications.length > 0 && (
            <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', textAlign: 'center' }}>
              <Button
                size="small"
                onClick={handleClose}
                sx={{ textTransform: 'none' }}
              >
                View All Notifications
              </Button>
            </Box>
          )}
        </Paper>
      </Popover>
    </>
  );
}
