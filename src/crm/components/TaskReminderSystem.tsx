import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Alert from "@mui/material/Alert";
import Switch from "@mui/material/Switch";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";

// Icons
import NotificationsActiveRoundedIcon from "@mui/icons-material/NotificationsActiveRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";
import TodayRoundedIcon from "@mui/icons-material/TodayRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

interface ReminderRule {
  id: number;
  name: string;
  type: "email" | "in_app" | "both";
  trigger: "due_date" | "overdue" | "status_change" | "custom";
  timing: number; // hours before/after
  enabled: boolean;
  conditions: {
    priority?: string[];
    status?: string[];
    categories?: string[];
  };
  recipients: string[];
  template: string;
}

interface UpcomingReminder {
  id: number;
  taskId: number;
  taskTitle: string;
  assigneeName: string;
  assigneeEmail: string;
  type: "email" | "in_app";
  scheduledTime: string;
  status: "pending" | "sent" | "failed";
  message: string;
}

// Sample reminder rules
const defaultReminderRules: ReminderRule[] = [
  {
    id: 1,
    name: "High Priority Task Due Today",
    type: "both",
    trigger: "due_date",
    timing: 0, // On due date
    enabled: true,
    conditions: {
      priority: ["high"],
      status: ["todo", "in_progress"]
    },
    recipients: ["assignee", "manager"],
    template: "high_priority_due_today"
  },
  {
    id: 2,
    name: "Task Overdue Notification",
    type: "email",
    trigger: "overdue",
    timing: 24, // 24 hours after due date
    enabled: true,
    conditions: {
      status: ["todo", "in_progress"]
    },
    recipients: ["assignee", "manager"],
    template: "task_overdue"
  },
  {
    id: 3,
    name: "Task Due Tomorrow Reminder",
    type: "in_app",
    trigger: "due_date",
    timing: -24, // 24 hours before due date
    enabled: true,
    conditions: {
      priority: ["high", "medium"]
    },
    recipients: ["assignee"],
    template: "task_due_tomorrow"
  }
];

// Sample upcoming reminders
const upcomingReminders: UpcomingReminder[] = [
  {
    id: 1,
    taskId: 1,
    taskTitle: "Follow up with TechSolutions Inc on cloud proposal",
    assigneeName: "John Smith",
    assigneeEmail: "john.smith@company.com",
    type: "email",
    scheduledTime: "2024-01-15T14:00:00",
    status: "pending",
    message: "High priority task is due today. Please complete or update the status."
  },
  {
    id: 2,
    taskId: 3,
    taskTitle: "Call HealthCare Pro about contract details",
    assigneeName: "Mike Johnson",
    assigneeEmail: "mike.johnson@company.com",
    type: "in_app",
    scheduledTime: "2024-01-16T09:00:00",
    status: "pending",
    message: "Task due tomorrow. Please review and prepare for completion."
  },
  {
    id: 3,
    taskId: 2,
    taskTitle: "Prepare presentation for Global Media website project",
    assigneeName: "Sarah Wilson",
    assigneeEmail: "sarah.wilson@company.com",
    type: "both",
    scheduledTime: "2024-01-17T16:00:00",
    status: "sent",
    message: "Medium priority task reminder sent successfully."
  }
];

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
};

const getReminderTypeIcon = (type: string) => {
  switch (type) {
    case "email":
      return <EmailRoundedIcon />;
    case "in_app":
      return <NotificationsRoundedIcon />;
    case "both":
      return <NotificationsActiveRoundedIcon />;
    default:
      return <NotificationsRoundedIcon />;
  }
};

const getStatusColor = (status: string): "default" | "success" | "error" => {
  switch (status) {
    case "sent":
      return "success";
    case "failed":
      return "error";
    default:
      return "default";
  }
};

export default function TaskReminderSystem() {
  const [reminderRules, setReminderRules] = React.useState<ReminderRule[]>(defaultReminderRules);
  const [upcomingRemindersData, setUpcomingRemindersData] = React.useState<UpcomingReminder[]>(upcomingReminders);
  const [globalRemindersEnabled, setGlobalRemindersEnabled] = React.useState(true);

  const handleToggleRule = (ruleId: number) => {
    setReminderRules(rules =>
      rules.map(rule =>
        rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
      )
    );
  };

  const handleDeleteRule = (ruleId: number) => {
    setReminderRules(rules => rules.filter(rule => rule.id !== ruleId));
  };

  const handleTestReminder = async (reminderId: number) => {
    // Simulate sending a test reminder
    const reminder = upcomingRemindersData.find(r => r.id === reminderId);
    if (reminder) {
      // Update status to sent
      setUpcomingRemindersData(reminders =>
        reminders.map(r =>
          r.id === reminderId ? { ...r, status: "sent" as const } : r
        )
      );
      
      // In a real application, this would trigger the actual notification system
      console.log(`Test reminder sent for task: ${reminder.taskTitle}`);
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* Global Settings */}
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h6" component="h3">
              Reminder System Settings
            </Typography>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="body2">
                Global Reminders
              </Typography>
              <Switch
                checked={globalRemindersEnabled}
                onChange={(e) => setGlobalRemindersEnabled(e.target.checked)}
              />
            </Stack>
          </Stack>
          
          {!globalRemindersEnabled && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              Reminder system is currently disabled. No automatic notifications will be sent.
            </Alert>
          )}

          <Stack direction="row" spacing={2}>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Default Email Template</InputLabel>
              <Select defaultValue="standard" label="Default Email Template">
                <MenuItem value="standard">Standard Business</MenuItem>
                <MenuItem value="casual">Casual</MenuItem>
                <MenuItem value="urgent">Urgent</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Timezone</InputLabel>
              <Select defaultValue="UTC-5" label="Timezone">
                <MenuItem value="UTC-5">Eastern Time (UTC-5)</MenuItem>
                <MenuItem value="UTC-8">Pacific Time (UTC-8)</MenuItem>
                <MenuItem value="UTC+0">UTC</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              size="small"
              label="Default Sender Email"
              defaultValue="noreply@company.com"
              sx={{ minWidth: 200 }}
            />
          </Stack>
        </CardContent>
      </Card>

      {/* Reminder Rules */}
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h6" component="h3">
              Reminder Rules
            </Typography>
            <Button
              variant="outlined"
              startIcon={<SettingsRoundedIcon />}
              size="small"
            >
              Add Rule
            </Button>
          </Stack>

          <List>
            {reminderRules.map((rule, index) => (
              <React.Fragment key={rule.id}>
                <ListItem>
                  <ListItemIcon>
                    {getReminderTypeIcon(rule.type)}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="subtitle2">{rule.name}</Typography>
                        <Chip
                          label={rule.trigger.replace("_", " ").toUpperCase()}
                          size="small"
                          variant="outlined"
                        />
                        {rule.conditions.priority && (
                          <Chip
                            label={`Priority: ${rule.conditions.priority.join(", ")}`}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        )}
                      </Stack>
                    }
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          {rule.type === "both" ? "Email & In-App" : 
                           rule.type === "email" ? "Email Only" : "In-App Only"} • 
                          {rule.timing > 0 ? ` ${rule.timing}h after` : 
                           rule.timing < 0 ? ` ${Math.abs(rule.timing)}h before` : " On trigger"} • 
                          Recipients: {rule.recipients.join(", ")}
                        </Typography>
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Switch
                        edge="end"
                        checked={rule.enabled && globalRemindersEnabled}
                        onChange={() => handleToggleRule(rule.id)}
                        disabled={!globalRemindersEnabled}
                      />
                      <IconButton
                        edge="end"
                        size="small"
                        onClick={() => handleDeleteRule(rule.id)}
                        color="error"
                      >
                        <DeleteRoundedIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </ListItemSecondaryAction>
                </ListItem>
                {index < reminderRules.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* Upcoming Reminders */}
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" component="h3" sx={{ mb: 2 }}>
            Upcoming Reminders
          </Typography>

          <List>
            {upcomingRemindersData.map((reminder, index) => (
              <React.Fragment key={reminder.id}>
                <ListItem>
                  <ListItemIcon>
                    <Avatar sx={{ width: 32, height: 32 }}>
                      {reminder.assigneeName.split(' ').map(n => n[0]).join('')}
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="subtitle2" noWrap>
                          {reminder.taskTitle}
                        </Typography>
                        <Chip
                          icon={getReminderTypeIcon(reminder.type)}
                          label={reminder.type.replace("_", " ").toUpperCase()}
                          size="small"
                          variant="outlined"
                        />
                        <Chip
                          label={reminder.status.toUpperCase()}
                          size="small"
                          color={getStatusColor(reminder.status)}
                          variant="outlined"
                        />
                      </Stack>
                    }
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {reminder.message}
                        </Typography>
                        <Stack direction="row" alignItems="center" spacing={2} sx={{ mt: 0.5 }}>
                          <Typography variant="caption" color="text.secondary">
                            <ScheduleRoundedIcon fontSize="inherit" sx={{ mr: 0.5 }} />
                            {formatDateTime(reminder.scheduledTime)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            To: {reminder.assigneeName} ({reminder.assigneeEmail})
                          </Typography>
                        </Stack>
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    {reminder.status === "pending" && (
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleTestReminder(reminder.id)}
                      >
                        Test Send
                      </Button>
                    )}
                  </ListItemSecondaryAction>
                </ListItem>
                {index < upcomingRemindersData.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>

          {upcomingRemindersData.length === 0 && (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <TodayRoundedIcon sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
              <Typography variant="body2" color="text.secondary">
                No upcoming reminders scheduled
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
