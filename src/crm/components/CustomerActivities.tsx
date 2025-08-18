import * as React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ChatIcon from "@mui/icons-material/Chat";
import TaskIcon from "@mui/icons-material/Assignment";
import NotesIcon from "@mui/icons-material/Notes";

interface Activity {
  id: string;
  type: "phone" | "email" | "meeting" | "note" | "task";
  title: string;
  description: string;
  date: Date;
  status?: "completed" | "pending" | "cancelled";
  duration?: string;
  participants?: string[];
}

interface CustomerActivitiesProps {
  customerId: string;
  customerName: string;
}

const activityIcons = {
  phone: PhoneIcon,
  email: EmailIcon,
  meeting: CalendarTodayIcon,
  note: NotesIcon,
  task: TaskIcon,
};

const activityColors = {
  phone: "#2196f3",
  email: "#ff9800",
  meeting: "#4caf50",
  note: "#9c27b0",
  task: "#f44336",
};

const mockActivities: Activity[] = [
  {
    id: "1",
    type: "phone",
    title: "Outbound Sales Call",
    description: "Discussed new product features and pricing options. Customer showed interest in premium package.",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    status: "completed",
    duration: "25 minutes",
  },
  {
    id: "2",
    type: "email",
    title: "Product Demo Follow-up",
    description: "Sent detailed product documentation and pricing proposal following yesterday's demo session.",
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    status: "completed",
  },
  {
    id: "3",
    type: "meeting",
    title: "Product Demo Session",
    description: "Conducted comprehensive product demonstration covering key features and integration possibilities.",
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    status: "completed",
    duration: "1 hour",
    participants: ["John Smith", "Sarah Johnson"],
  },
  {
    id: "4",
    type: "task",
    title: "Prepare Custom Quote",
    description: "Create customized pricing proposal based on customer requirements discussed in last meeting.",
    date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    status: "pending",
  },
  {
    id: "5",
    type: "note",
    title: "Customer Feedback",
    description: "Customer provided positive feedback on current service level and expressed interest in expanding contract.",
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    status: "completed",
  },
  {
    id: "6",
    type: "email",
    title: "Contract Renewal Reminder",
    description: "Sent reminder about upcoming contract renewal with updated terms and pricing structure.",
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    status: "completed",
  },
  {
    id: "7",
    type: "phone",
    title: "Support Call - Technical Issue",
    description: "Assisted customer with API integration issue. Provided step-by-step troubleshooting guide.",
    date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    status: "completed",
    duration: "15 minutes",
  },
  {
    id: "8",
    type: "meeting",
    title: "Quarterly Business Review",
    description: "Reviewed quarterly performance metrics, discussed expansion opportunities, and gathered feedback.",
    date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    status: "completed",
    duration: "45 minutes",
    participants: ["Alex Thompson", "Jennifer Davis", "Michael Brown"],
  },
];

function ActivityItem({ activity }: { activity: Activity }) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const IconComponent = activityIcons[activity.type];
  const isUpcoming = activity.date > new Date();

  return (
    <>
      <ListItem alignItems="flex-start" sx={{ px: 0 }}>
        <ListItemIcon sx={{ mt: 1 }}>
          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: activityColors[activity.type],
            }}
          >
            <IconComponent sx={{ fontSize: 20 }} />
          </Avatar>
        </ListItemIcon>
        <ListItemText
          primary={
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 500, mr: 2 }}>
                {activity.title}
              </Typography>
              {activity.status && (
                <Chip 
                  label={activity.status}
                  size="small"
                  color={
                    activity.status === "completed" ? "success" :
                    activity.status === "pending" ? "warning" : "default"
                  }
                  variant="outlined"
                />
              )}
            </Box>
          }
          secondary={
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {activity.description}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
                <Typography variant="caption" color="text.secondary">
                  {isUpcoming ? "Scheduled for " : ""}{activity.date.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Typography>
                {activity.duration && (
                  <Typography variant="caption" color="text.secondary">
                    Duration: {activity.duration}
                  </Typography>
                )}
                {activity.participants && activity.participants.length > 0 && (
                  <Typography variant="caption" color="text.secondary">
                    Participants: {activity.participants.join(", ")}
                  </Typography>
                )}
              </Box>
            </Box>
          }
        />
        <IconButton onClick={handleMenuClick} size="small">
          <MoreVertIcon />
        </IconButton>
      </ListItem>
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>Edit</MenuItem>
        <MenuItem onClick={handleMenuClose}>Duplicate</MenuItem>
        <MenuItem onClick={handleMenuClose}>Delete</MenuItem>
      </Menu>
      
      <Divider variant="inset" component="li" />
    </>
  );
}

export default function CustomerActivities({ customerId, customerName }: CustomerActivitiesProps) {
  const [selectedTab, setSelectedTab] = React.useState(0);
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const filterActivities = (activities: Activity[]) => {
    switch (selectedTab) {
      case 1: // Calls
        return activities.filter(activity => activity.type === "phone");
      case 2: // Emails
        return activities.filter(activity => activity.type === "email");
      case 3: // Meetings
        return activities.filter(activity => activity.type === "meeting");
      default: // All
        return activities;
    }
  };

  const filteredActivities = filterActivities(mockActivities).sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  );

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h6" component="h3">
          Customer Activities
        </Typography>
        <Button variant="contained" size="small" startIcon={<ChatIcon />}>
          Add Activity
        </Button>
      </Box>

      <Tabs value={selectedTab} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="All Activities" />
        <Tab label="Phone Calls" />
        <Tab label="Emails" />
        <Tab label="Meetings" />
      </Tabs>

      {filteredActivities.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            No activities found for this filter.
          </Typography>
        </Box>
      ) : (
        <List sx={{ width: "100%" }}>
          {filteredActivities.map((activity, index) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
        </List>
      )}
    </Paper>
  );
}
