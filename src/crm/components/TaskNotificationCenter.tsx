import * as React from "react";
import {
  Badge,
  IconButton,
  Popover,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Box,
  Divider,
  Button,
  Chip,
  Stack,
} from "@mui/material";
import {
  Notifications as NotificationsIcon,
  Schedule as ScheduleIcon,
  Warning as WarningIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { Task } from "../types/taskTypes";
import { getTasksForReminder, getOverdueTasks, formatDueDate } from "../utils/taskUtils";

interface TaskNotification {
  id: string;
  type: 'reminder' | 'overdue' | 'assigned' | 'completed';
  task: Task;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface TaskNotificationCenterProps {
  tasks: Task[];
  currentUserId: string;
}

export default function TaskNotificationCenter({ tasks, currentUserId }: TaskNotificationCenterProps) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const [notifications, setNotifications] = React.useState<TaskNotification[]>([]);

  const open = Boolean(anchorEl);

  // Generate notifications based on tasks
  React.useEffect(() => {
    const newNotifications: TaskNotification[] = [];

    // Due date reminders (24 hours before due)
    const reminderTasks = getTasksForReminder(tasks, 24);
    reminderTasks.forEach(task => {
      if (task.assigneeId === currentUserId) {
        newNotifications.push({
          id: `reminder-${task.id}`,
          type: 'reminder',
          task,
          message: `Task "${task.title}" is due ${formatDueDate(task.dueDate)}`,
          timestamp: new Date(),
          read: false,
        });
      }
    });

    // Overdue tasks
    const overdueTasks = getOverdueTasks();
    overdueTasks.forEach(task => {
      if (task.assigneeId === currentUserId) {
        newNotifications.push({
          id: `overdue-${task.id}`,
          type: 'overdue',
          task,
          message: `Task "${task.title}" is ${formatDueDate(task.dueDate)}`,
          timestamp: new Date(),
          read: false,
        });
      }
    });

    // Recently assigned tasks (within last 24 hours)
    const recentlyAssigned = tasks.filter(task => 
      task.assigneeId === currentUserId &&
      task.createdAt > new Date(Date.now() - 24 * 60 * 60 * 1000)
    );
    recentlyAssigned.forEach(task => {
      newNotifications.push({
        id: `assigned-${task.id}`,
        type: 'assigned',
        task,
        message: `You have been assigned to task "${task.title}"`,
        timestamp: task.createdAt,
        read: false,
      });
    });

    // Recently completed tasks
    const recentlyCompleted = tasks.filter(task =>
      task.status === 'Completed' &&
      task.completedAt &&
      task.completedAt > new Date(Date.now() - 24 * 60 * 60 * 1000)
    );
    recentlyCompleted.forEach(task => {
      newNotifications.push({
        id: `completed-${task.id}`,
        type: 'completed',
        task,
        message: `Task "${task.title}" has been completed`,
        timestamp: task.completedAt!,
        read: false,
      });
    });

    // Sort by timestamp (newest first)
    newNotifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    setNotifications(newNotifications);
  }, [tasks, currentUserId]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const getNotificationIcon = (type: TaskNotification['type']) => {
    switch (type) {
      case 'reminder':
        return <ScheduleIcon sx={{ color: 'warning.main' }} />;
      case 'overdue':
        return <WarningIcon sx={{ color: 'error.main' }} />;
      case 'assigned':
        return <AssignmentIcon sx={{ color: 'info.main' }} />;
      case 'completed':
        return <CheckCircleIcon sx={{ color: 'success.main' }} />;
      default:
        return <NotificationsIcon />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <IconButton onClick={handleClick} color="inherit">
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
        slotProps={{
          paper: {
            sx: { width: 380, maxHeight: 500 }
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Notifications
            </Typography>
            {unreadCount > 0 && (
              <Button size="small" onClick={markAllAsRead}>
                Mark all as read
              </Button>
            )}
          </Box>

          {notifications.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <NotificationsIcon sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
              <Typography variant="body2" color="text.secondary">
                No notifications yet
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 0, maxHeight: 400, overflow: 'auto' }}>
              {notifications.map((notification, index) => (
                <React.Fragment key={notification.id}>
                  <ListItem
                    sx={{
                      px: 0,
                      py: 1,
                      bgcolor: notification.read ? 'transparent' : 'action.hover',
                      borderRadius: 1,
                      mb: 0.5,
                      cursor: 'pointer',
                    }}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'transparent' }}>
                        {getNotificationIcon(notification.type)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: notification.read ? 400 : 600,
                            mb: 0.5,
                          }}
                        >
                          {notification.message}
                        </Typography>
                      }
                      secondary={
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Chip
                            label={notification.task.priority}
                            size="small"
                            sx={{
                              bgcolor: notification.task.priority === "High" ? "error.main" :
                                      notification.task.priority === "Medium" ? "warning.main" : "success.main",
                              color: "white",
                              fontSize: "0.75rem",
                              height: 16,
                            }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {notification.timestamp.toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </Typography>
                        </Stack>
                      }
                    />
                  </ListItem>
                  {index < notifications.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </Box>
      </Popover>
    </>
  );
}
