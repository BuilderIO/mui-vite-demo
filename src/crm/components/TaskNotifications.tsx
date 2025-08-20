import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Badge from "@mui/material/Badge";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Tooltip from "@mui/material/Tooltip";
import Stack from "@mui/material/Stack";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ScheduleIcon from "@mui/icons-material/Schedule";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import AssignmentLateIcon from "@mui/icons-material/AssignmentLate";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import CloseIcon from "@mui/icons-material/Close";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

// Task interface (matching the main Tasks component)
interface Task {
  id: number;
  title: string;
  description: string;
  status: "pending" | "in_progress" | "completed" | "on_hold";
  priority: "low" | "medium" | "high";
  assignee: string;
  assigneeAvatar: string;
  assigneeId?: string;
  dueDate: string;
  createdDate: string;
  completedDate?: string;
}

// Notification types
interface TaskNotification {
  id: string;
  type: "due_today" | "overdue" | "high_priority" | "assignment" | "completion";
  task: Task;
  message: string;
  timestamp: string;
  read: boolean;
}

interface TaskNotificationsProps {
  tasks: Task[];
  currentUserId?: string;
  onMarkAsRead?: (notificationId: string) => void;
  onNotificationClick?: (task: Task) => void;
}

// Generate notifications based on tasks
const generateNotifications = (tasks: Task[], currentUserId?: string): TaskNotification[] => {
  const notifications: TaskNotification[] = [];
  const now = dayjs();

  tasks.forEach((task) => {
    const dueDate = dayjs(task.dueDate);
    const isAssignedToCurrentUser = currentUserId && task.assigneeId === currentUserId;
    const taskId = task.id.toString();

    // Due today notifications
    if (dueDate.isSame(now, "day") && task.status !== "completed") {
      notifications.push({
        id: `due-today-${taskId}`,
        type: "due_today",
        task,
        message: `Task "${task.title}" is due today`,
        timestamp: now.toISOString(),
        read: false,
      });
    }

    // Overdue notifications
    if (dueDate.isBefore(now, "day") && task.status !== "completed") {
      const daysOverdue = now.diff(dueDate, "day");
      notifications.push({
        id: `overdue-${taskId}`,
        type: "overdue",
        task,
        message: `Task "${task.title}" is ${daysOverdue} day${daysOverdue > 1 ? "s" : ""} overdue`,
        timestamp: now.toISOString(),
        read: false,
      });
    }

    // High priority notifications (for tasks assigned to current user)
    if (task.priority === "high" && isAssignedToCurrentUser && task.status !== "completed") {
      notifications.push({
        id: `high-priority-${taskId}`,
        type: "high_priority",
        task,
        message: `High priority task "${task.title}" requires attention`,
        timestamp: now.toISOString(),
        read: false,
      });
    }

    // Assignment notifications (for newly assigned tasks)
    if (isAssignedToCurrentUser && task.status === "pending") {
      notifications.push({
        id: `assignment-${taskId}`,
        type: "assignment",
        task,
        message: `New task "${task.title}" has been assigned to you`,
        timestamp: now.toISOString(),
        read: false,
      });
    }

    // Completion notifications (for recently completed tasks)
    if (task.status === "completed" && task.completedDate) {
      const completedDate = dayjs(task.completedDate);
      if (completedDate.isAfter(now.subtract(1, "day"))) {
        notifications.push({
          id: `completion-${taskId}`,
          type: "completion",
          task,
          message: `Task "${task.title}" has been completed`,
          timestamp: completedDate.toISOString(),
          read: false,
        });
      }
    }
  });

  // Sort by timestamp (newest first)
  return notifications.sort((a, b) => dayjs(b.timestamp).diff(dayjs(a.timestamp)));
};

// Get notification icon
const getNotificationIcon = (type: TaskNotification["type"]) => {
  switch (type) {
    case "due_today":
      return <ScheduleIcon color="warning" />;
    case "overdue":
      return <AssignmentLateIcon color="error" />;
    case "high_priority":
      return <PriorityHighIcon color="error" />;
    case "assignment":
      return <NotificationsIcon color="primary" />;
    case "completion":
      return <TaskAltIcon color="success" />;
    default:
      return <NotificationsIcon />;
  }
};

// Get notification color
const getNotificationColor = (type: TaskNotification["type"]): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
  switch (type) {
    case "due_today":
      return "warning";
    case "overdue":
      return "error";
    case "high_priority":
      return "error";
    case "assignment":
      return "primary";
    case "completion":
      return "success";
    default:
      return "default";
  }
};

export default function TaskNotifications({ 
  tasks, 
  currentUserId = "1", // Default user ID for demo
  onMarkAsRead,
  onNotificationClick 
}: TaskNotificationsProps) {
  const [notifications, setNotifications] = React.useState<TaskNotification[]>([]);
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");

  // Generate notifications when tasks change
  React.useEffect(() => {
    const newNotifications = generateNotifications(tasks, currentUserId);
    setNotifications(newNotifications);
  }, [tasks, currentUserId]);

  // Show snackbar for urgent notifications
  React.useEffect(() => {
    const urgentNotifications = notifications.filter(
      n => (n.type === "overdue" || n.type === "due_today") && !n.read
    );

    if (urgentNotifications.length > 0) {
      setSnackbarMessage(
        `You have ${urgentNotifications.length} urgent task${urgentNotifications.length > 1 ? "s" : ""} requiring attention`
      );
      setSnackbarOpen(true);
    }
  }, [notifications]);

  const unreadCount = notifications.filter(n => !n.read).length;
  const criticalCount = notifications.filter(n => 
    (n.type === "overdue" || n.type === "due_today") && !n.read
  ).length;

  const handleNotificationClick = (notification: TaskNotification) => {
    // Mark as read
    if (onMarkAsRead) {
      onMarkAsRead(notification.id);
    }
    setNotifications(prev => 
      prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
    );

    // Handle task click
    if (onNotificationClick) {
      onNotificationClick(notification.task);
    }
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <>
      {/* Notification Bell */}
      <Tooltip title={`${unreadCount} unread notifications`}>
        <IconButton
          color="inherit"
          onClick={() => setShowNotifications(!showNotifications)}
        >
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Tooltip>

      {/* Notifications Panel */}
      {showNotifications && (
        <Card 
          sx={{ 
            position: "absolute", 
            top: 60, 
            right: 16, 
            width: 360, 
            maxHeight: 480, 
            zIndex: 1300,
            boxShadow: 3 
          }}
        >
          <CardContent sx={{ p: 0 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}
            >
              <Typography variant="h6">
                Notifications
                {criticalCount > 0 && (
                  <Chip
                    label={`${criticalCount} urgent`}
                    size="small"
                    color="error"
                    sx={{ ml: 1 }}
                  />
                )}
              </Typography>
              <Box>
                {unreadCount > 0 && (
                  <Button size="small" onClick={handleMarkAllAsRead}>
                    Mark all read
                  </Button>
                )}
                <IconButton size="small" onClick={() => setShowNotifications(false)}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </Stack>

            {notifications.length === 0 ? (
              <Box sx={{ p: 3, textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  No notifications
                </Typography>
              </Box>
            ) : (
              <List sx={{ maxHeight: 360, overflow: "auto", p: 0 }}>
                {notifications.map((notification) => (
                  <ListItem
                    key={notification.id}
                    button
                    onClick={() => handleNotificationClick(notification)}
                    sx={{
                      borderLeft: 4,
                      borderColor: notification.read ? "transparent" : `${getNotificationColor(notification.type)}.main`,
                      backgroundColor: notification.read ? "inherit" : "action.hover",
                      "&:hover": {
                        backgroundColor: "action.selected",
                      },
                    }}
                  >
                    <ListItemIcon>
                      {getNotificationIcon(notification.type)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography 
                          variant="body2" 
                          fontWeight={notification.read ? 400 : 600}
                        >
                          {notification.message}
                        </Typography>
                      }
                      secondary={
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                          <Chip
                            label={notification.task.priority}
                            size="small"
                            color={notification.task.priority === "high" ? "error" : 
                                   notification.task.priority === "medium" ? "warning" : "default"}
                            variant="outlined"
                          />
                          <Typography variant="caption" color="text.secondary">
                            {dayjs(notification.timestamp).fromNow()}
                          </Typography>
                        </Stack>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </CardContent>
        </Card>
      )}

      {/* Urgent Notifications Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="warning"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

// Task Reminders Component
export function TaskReminders({ tasks }: { tasks: Task[] }) {
  const upcomingTasks = React.useMemo(() => {
    const now = dayjs();
    return tasks
      .filter(task => {
        const dueDate = dayjs(task.dueDate);
        return task.status !== "completed" && 
               dueDate.isAfter(now) && 
               dueDate.diff(now, "day") <= 3; // Next 3 days
      })
      .sort((a, b) => dayjs(a.dueDate).diff(dayjs(b.dueDate)));
  }, [tasks]);

  if (upcomingTasks.length === 0) {
    return null;
  }

  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Upcoming Due Dates
        </Typography>
        <List dense>
          {upcomingTasks.map((task) => (
            <ListItem key={task.id} disablePadding>
              <ListItemIcon>
                <ScheduleIcon color="warning" />
              </ListItemIcon>
              <ListItemText
                primary={task.title}
                secondary={`Due ${dayjs(task.dueDate).format("MMM DD")} • ${task.assignee}`}
              />
              <Chip
                label={task.priority}
                size="small"
                color={task.priority === "high" ? "error" : 
                       task.priority === "medium" ? "warning" : "default"}
                variant="outlined"
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
