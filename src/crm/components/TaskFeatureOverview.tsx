import * as React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Stack,
  Divider,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Assignment as AssignmentIcon,
  Schedule as ScheduleIcon,
  FilterList as FilterListIcon,
  Notifications as NotificationsIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Timeline as TimelineIcon,
} from "@mui/icons-material";

const features = [
  {
    title: "Task Creation & Management",
    icon: <AssignmentIcon color="primary" />,
    description: "Create, edit, and delete tasks with comprehensive details",
    items: [
      "Task title and description",
      "Assignee selection from team members",
      "Due date picker with validation",
      "Priority levels (High, Medium, Low)",
      "Status tracking (Not Started, In Progress, Completed, On Hold)",
    ],
  },
  {
    title: "Advanced Filtering & Search",
    icon: <FilterListIcon color="primary" />,
    description: "Powerful filtering and search capabilities",
    items: [
      "Search by title, description, or assignee",
      "Filter by status, priority, and assignee",
      "Show overdue tasks only",
      "Clear individual or all filters",
      "Real-time filter updates",
    ],
  },
  {
    title: "Priority & Status Management",
    icon: <ScheduleIcon color="primary" />,
    description: "Visual priority indicators and status tracking",
    items: [
      "Color-coded priority levels (Red=High, Orange=Medium, Green=Low)",
      "Status badges with distinct colors",
      "Overdue task highlighting with red border",
      "Due soon indicators with orange highlighting",
      "Quick status change from context menu",
    ],
  },
  {
    title: "Notification System",
    icon: <NotificationsIcon color="primary" />,
    description: "In-app notifications for task updates",
    items: [
      "Task assignment notifications",
      "Due soon reminders (24 hours before)",
      "Overdue task alerts",
      "Unread notification badges",
      "Mark notifications as read",
    ],
  },
  {
    title: "Dashboard & Analytics",
    icon: <DashboardIcon color="primary" />,
    description: "Comprehensive task analytics and visualizations",
    items: [
      "Task completion statistics",
      "Status distribution pie chart",
      "Team workload distribution bar chart",
      "Upcoming deadlines list",
      "Team performance metrics",
    ],
  },
  {
    title: "Team Collaboration",
    icon: <PeopleIcon color="primary" />,
    description: "Team-focused features for collaboration",
    items: [
      "Assign tasks to team members",
      "View workload distribution across team",
      "Track individual team member performance",
      "Team member avatars and profiles",
      "Unassigned task management",
    ],
  },
  {
    title: "Status History & Tracking",
    icon: <TimelineIcon color="primary" />,
    description: "Complete audit trail of task changes",
    items: [
      "Status change history with timestamps",
      "User attribution for status changes",
      "Created and updated timestamps",
      "Task lifecycle tracking",
      "Historical data for reporting",
    ],
  },
];

export default function TaskFeatureOverview() {
  return (
    <Box sx={{ width: "100%" }}>
      <Card variant="outlined" sx={{ mb: 4, bgcolor: "primary.50" }}>
        <CardContent>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
            <CheckCircleIcon sx={{ fontSize: 40, color: "success.main" }} />
            <Box>
              <Typography variant="h4" component="h1" color="primary.main">
                Task Management System
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Complete implementation of ENG-10071 requirements
              </Typography>
            </Box>
          </Stack>
          
          <Typography variant="body1" paragraph>
            A comprehensive task management system built with Material-UI and React, featuring
            all the requirements specified in the JIRA issue. This implementation includes
            task creation, assignment, priority management, due date tracking, automated
            notifications, and detailed analytics.
          </Typography>

          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
            <Chip label="��� Task Creation" color="success" variant="outlined" />
            <Chip label="✓ Team Assignment" color="success" variant="outlined" />
            <Chip label="✓ Priority Management" color="success" variant="outlined" />
            <Chip label="✓ Due Date Tracking" color="success" variant="outlined" />
            <Chip label="✓ Automated Notifications" color="success" variant="outlined" />
            <Chip label="✓ Status Tracking" color="success" variant="outlined" />
            <Chip label="✓ Advanced Filtering" color="success" variant="outlined" />
            <Chip label="✓ Dashboard Analytics" color="success" variant="outlined" />
            <Chip label="✓ Responsive Design" color="success" variant="outlined" />
            <Chip label="✓ Accessibility Ready" color="success" variant="outlined" />
          </Stack>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {features.map((feature, index) => (
          <Grid item xs={12} md={6} lg={4} key={index}>
            <Card 
              variant="outlined" 
              sx={{ 
                height: "100%",
                '&:hover': {
                  boxShadow: 2,
                  borderColor: 'primary.main',
                }
              }}
            >
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                  {feature.icon}
                  <Typography variant="h6" component="h3">
                    {feature.title}
                  </Typography>
                </Stack>
                
                <Typography variant="body2" color="text.secondary" paragraph>
                  {feature.description}
                </Typography>
                
                <Divider sx={{ my: 2 }} />
                
                <List dense>
                  {feature.items.map((item, itemIndex) => (
                    <ListItem key={itemIndex} sx={{ px: 0, py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircleIcon sx={{ fontSize: 16, color: "success.main" }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={
                          <Typography variant="body2">
                            {item}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card variant="outlined" sx={{ mt: 4, bgcolor: "info.50" }}>
        <CardContent>
          <Typography variant="h6" gutterBottom color="info.main">
            🎯 Implementation Highlights
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                <strong>User Experience:</strong>
              </Typography>
              <Typography variant="body2" paragraph>
                • Intuitive tabbed interface (Dashboard + Task List)<br/>
                • Real-time search and filtering<br/>
                • Mobile-responsive design with FAB for task creation<br/>
                • Contextual actions via right-click menus<br/>
                • Visual indicators for task urgency
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                <strong>Technical Features:</strong>
              </Typography>
              <Typography variant="body2" paragraph>
                • TypeScript for type safety<br/>
                • React Context for state management<br/>
                • Material-UI components and theming<br/>
                • Recharts for data visualization<br/>
                • Date validation and formatting utilities
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}
