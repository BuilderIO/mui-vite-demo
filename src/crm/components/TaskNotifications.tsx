import * as React from "react";
import {
  Badge,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Divider,
  Button,
  Stack,
  Avatar,
} from "@mui/material";
import {
  Notifications as NotificationsIcon,
  Schedule as ScheduleIcon,
  Warning as WarningIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import { useTaskContext } from "../contexts/TaskContext";
import { formatDueDate } from "../utils/taskUtils";

export default function TaskNotifications() {
  const { notifications, markNotificationRead, tasks } = useTaskContext();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const unreadNotifications = notifications.filter(n => !n.read);
  const recentNotifications = notifications.slice(0, 10); // Show last 10

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (notificationId: string) => {
    markNotificationRead(notificationId);
  };

  const markAllAsRead = () => {
    unreadNotifications.forEach(notification => {
      markNotificationRead(notification.id);
    });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "due_soon":
        return <ScheduleIcon fontSize="small" color="warning" />;
      case "overdue":
        return <WarningIcon fontSize="small" color="error" />;
      case "assigned":
        return <AssignmentIcon fontSize="small" color="primary" />;
      default:
        return <NotificationsIcon fontSize="small" />;
    }
  };

  const getNotificationTime = (createdAt: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - createdAt.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return createdAt.toLocaleDateString();
  };

  const getTaskFromNotification = (taskId: string) => {
    return tasks.find(task => task.id === taskId);
  };

  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleOpen}
        aria-label={`${unreadNotifications.length} notifications`}
      >
        <Badge badgeContent={unreadNotifications.length} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        slotProps={{
          paper: {
            sx: {
              width: 360,
              maxHeight: 500,
            },
          },
        }}
      >
        {/* Header */}
        <Box sx={{ px: 2, py: 1, borderBottom: 1, borderColor: "divider" }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6" component="div">
              Notifications
            </Typography>
            {unreadNotifications.length > 0 && (
              <Button size="small" onClick={markAllAsRead}>
                Mark all read
              </Button>
            )}
          </Stack>
          {unreadNotifications.length > 0 && (
            <Typography variant="body2" color="text.secondary">
              {unreadNotifications.length} unread notification{unreadNotifications.length === 1 ? "" : "s"}
            </Typography>
          )}
        </Box>

        {/* Notifications List */}
        {recentNotifications.length === 0 ? (
          <Box sx={{ px: 3, py: 4, textAlign: "center" }}>
            <CheckCircleIcon sx={{ fontSize: 48, color: "success.main", mb: 1 }} />
            <Typography variant="body1" color="text.secondary">
              No notifications
            </Typography>
            <Typography variant="body2" color="text.secondary">
              You're all caught up!
            </Typography>
          </Box>
        ) : (
          recentNotifications.map((notification, index) => {
            const task = getTaskFromNotification(notification.taskId);
            const isUnread = !notification.read;

            return (
              <React.Fragment key={notification.id}>
                <MenuItem
                  onClick={() => handleNotificationClick(notification.id)}
                  sx={{
                    px: 2,
                    py: 1.5,
                    backgroundColor: isUnread ? "action.hover" : "transparent",
                    "&:hover": {
                      backgroundColor: isUnread ? "action.selected" : "action.hover",
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {getNotificationIcon(notification.type)}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: isUnread ? 600 : 400,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {notification.message}
                        </Typography>
                        {task && (
                          <Box sx={{ mt: 0.5 }}>
                            <Typography variant="caption" color="text.secondary">
                              Task: {task.title}
                            </Typography>
                            {task.assignee && (
                              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
                                <Avatar sx={{ width: 16, height: 16, fontSize: "0.625rem" }}>
                                  {task.assignee.avatar}
                                </Avatar>
                                <Typography variant="caption" color="text.secondary">
                                  {task.assignee.name}
                                </Typography>
                              </Box>
                            )}
                            {task.dueDate && (
                              <Typography variant="caption" color="text.secondary">
                                Due: {formatDueDate(task.dueDate)}
                              </Typography>
                            )}
                          </Box>
                        )}
                      </Box>
                    }
                    secondary={
                      <Typography variant="caption" color="text.secondary">
                        {getNotificationTime(notification.createdAt)}
                      </Typography>
                    }
                  />
                  {isUnread && (
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        backgroundColor: "primary.main",
                        ml: 1,
                      }}
                    />
                  )}
                </MenuItem>
                {index < recentNotifications.length - 1 && <Divider />}
              </React.Fragment>
            );
          })
        )}

        {/* Footer */}
        {recentNotifications.length > 0 && (
          <>
            <Divider />
            <Box sx={{ px: 2, py: 1, textAlign: "center" }}>
              <Button size="small" onClick={handleClose}>
                Close
              </Button>
            </Box>
          </>
        )}
      </Menu>
    </>
  );
}
