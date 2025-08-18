import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import LinearProgress from "@mui/material/LinearProgress";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

// Icons
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import TrendingDownRoundedIcon from "@mui/icons-material/TrendingDownRounded";
import AssignmentTurnedInRoundedIcon from "@mui/icons-material/AssignmentTurnedInRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import SpeedRoundedIcon from "@mui/icons-material/SpeedRounded";

// Sample analytics data
const completionTrendData = [
  { week: "Week 1", completed: 12, created: 15, overdue: 2 },
  { week: "Week 2", completed: 18, created: 20, overdue: 1 },
  { week: "Week 3", completed: 15, created: 18, overdue: 3 },
  { week: "Week 4", completed: 22, created: 25, overdue: 2 },
  { week: "Week 5", completed: 19, created: 22, overdue: 4 },
  { week: "Week 6", completed: 25, created: 28, overdue: 1 },
];

const priorityDistributionData = [
  { name: "High", value: 35, color: "#f44336" },
  { name: "Medium", value: 45, color: "#ff9800" },
  { name: "Low", value: 20, color: "#4caf50" },
];

const categoryPerformanceData = [
  { category: "Sales", completed: 28, total: 35, completionRate: 80 },
  { category: "Marketing", completed: 22, total: 25, completionRate: 88 },
  { category: "Development", completed: 15, total: 20, completionRate: 75 },
  { category: "Legal", completed: 8, total: 10, completionRate: 80 },
  { category: "Support", completed: 12, total: 18, completionRate: 67 },
];

const teamPerformanceData = [
  {
    name: "John Smith",
    avatar: "JS",
    email: "john.smith@company.com",
    completed: 15,
    assigned: 18,
    overdue: 1,
    avgCompletionDays: 2.3,
    completionRate: 83,
  },
  {
    name: "Sarah Wilson",
    avatar: "SW",
    email: "sarah.wilson@company.com",
    completed: 22,
    assigned: 25,
    overdue: 0,
    avgCompletionDays: 1.8,
    completionRate: 88,
  },
  {
    name: "Mike Johnson",
    avatar: "MJ",
    email: "mike.johnson@company.com",
    completed: 18,
    assigned: 22,
    overdue: 2,
    avgCompletionDays: 3.1,
    completionRate: 82,
  },
  {
    name: "Lisa Brown",
    avatar: "LB",
    email: "lisa.brown@company.com",
    completed: 12,
    assigned: 15,
    overdue: 1,
    avgCompletionDays: 2.7,
    completionRate: 80,
  },
  {
    name: "David Chen",
    avatar: "DC",
    email: "david.chen@company.com",
    completed: 20,
    assigned: 23,
    overdue: 0,
    avgCompletionDays: 2.1,
    completionRate: 87,
  },
];

const upcomingDeadlinesData = [
  { taskTitle: "Follow up with TechSolutions Inc", assignee: "John Smith", daysLeft: 0, priority: "high" },
  { taskTitle: "Prepare presentation for Global Media", assignee: "Sarah Wilson", daysLeft: 1, priority: "medium" },
  { taskTitle: "Call HealthCare Pro about contract", assignee: "Mike Johnson", daysLeft: 2, priority: "high" },
  { taskTitle: "Update CRM implementation timeline", assignee: "Lisa Brown", daysLeft: 3, priority: "medium" },
  { taskTitle: "Send proposal documents to Acme", assignee: "David Chen", daysLeft: 5, priority: "low" },
];

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  change?: number;
  subtitle?: string;
  icon: React.ReactNode;
  color?: "primary" | "success" | "error" | "warning";
}

function AnalyticsCard({ title, value, change, subtitle, icon, color = "primary" }: AnalyticsCardProps) {
  const hasPositiveChange = change !== undefined && change > 0;
  const hasNegativeChange = change !== undefined && change < 0;

  return (
    <Card variant="outlined" sx={{ height: "100%" }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography color="text.secondary" gutterBottom variant="body2">
              {title}
            </Typography>
            <Typography variant="h4" component="div" color={`${color}.main`}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
            {change !== undefined && (
              <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 1 }}>
                {hasPositiveChange ? (
                  <TrendingUpRoundedIcon fontSize="small" color="success" />
                ) : hasNegativeChange ? (
                  <TrendingDownRoundedIcon fontSize="small" color="error" />
                ) : null}
                <Typography
                  variant="body2"
                  color={hasPositiveChange ? "success.main" : hasNegativeChange ? "error.main" : "text.secondary"}
                >
                  {change > 0 ? "+" : ""}{change}% from last period
                </Typography>
              </Stack>
            )}
          </Box>
          <Box sx={{ color: `${color}.main` }}>
            {icon}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function TaskAnalytics() {
  const [timePeriod, setTimePeriod] = React.useState("last_30_days");

  // Calculate key metrics
  const totalTasks = teamPerformanceData.reduce((sum, member) => sum + member.assigned, 0);
  const completedTasks = teamPerformanceData.reduce((sum, member) => sum + member.completed, 0);
  const overdueTasks = teamPerformanceData.reduce((sum, member) => sum + member.overdue, 0);
  const avgCompletionRate = Math.round(teamPerformanceData.reduce((sum, member) => sum + member.completionRate, 0) / teamPerformanceData.length);

  return (
    <Box sx={{ width: "100%" }}>
      {/* Time Period Selector */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h5" component="h2">
          Task Analytics & Insights
        </Typography>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Time Period</InputLabel>
          <Select
            value={timePeriod}
            label="Time Period"
            onChange={(e) => setTimePeriod(e.target.value)}
          >
            <MenuItem value="last_7_days">Last 7 Days</MenuItem>
            <MenuItem value="last_30_days">Last 30 Days</MenuItem>
            <MenuItem value="last_3_months">Last 3 Months</MenuItem>
            <MenuItem value="last_6_months">Last 6 Months</MenuItem>
            <MenuItem value="last_year">Last Year</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {/* Key Metrics Cards */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <AnalyticsCard
            title="Total Tasks"
            value={totalTasks}
            change={8}
            icon={<AssignmentTurnedInRoundedIcon sx={{ fontSize: 40 }} />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <AnalyticsCard
            title="Completion Rate"
            value={`${avgCompletionRate}%`}
            change={5}
            icon={<SpeedRoundedIcon sx={{ fontSize: 40 }} />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <AnalyticsCard
            title="Completed Tasks"
            value={completedTasks}
            change={12}
            icon={<AssignmentTurnedInRoundedIcon sx={{ fontSize: 40 }} />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <AnalyticsCard
            title="Overdue Tasks"
            value={overdueTasks}
            change={-15}
            icon={<WarningRoundedIcon sx={{ fontSize: 40 }} />}
            color="error"
          />
        </Grid>
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Completion Trend Chart */}
        <Grid item xs={12} lg={8}>
          <Card variant="outlined" sx={{ height: 400 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Task Completion Trend
              </Typography>
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={completionTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="completed" stroke="#4caf50" strokeWidth={3} />
                  <Line type="monotone" dataKey="created" stroke="#2196f3" strokeWidth={2} />
                  <Line type="monotone" dataKey="overdue" stroke="#f44336" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Priority Distribution */}
        <Grid item xs={12} lg={4}>
          <Card variant="outlined" sx={{ height: 400 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Priority Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={priorityDistributionData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {priorityDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <Stack spacing={1} sx={{ mt: 2 }}>
                {priorityDistributionData.map((item) => (
                  <Stack key={item.name} direction="row" alignItems="center" spacing={1}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: 1,
                        backgroundColor: item.color,
                      }}
                    />
                    <Typography variant="body2">
                      {item.name}: {item.value}%
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Category Performance */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} lg={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CategoryRoundedIcon />
                Category Performance
              </Typography>
              <Stack spacing={2}>
                {categoryPerformanceData.map((category) => (
                  <Box key={category.category}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                      <Typography variant="body2" fontWeight={500}>
                        {category.category}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {category.completed}/{category.total} ({category.completionRate}%)
                      </Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={category.completionRate}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: "grey.200",
                        "& .MuiLinearProgress-bar": {
                          borderRadius: 4,
                          backgroundColor: category.completionRate >= 80 ? "success.main" : 
                                        category.completionRate >= 60 ? "warning.main" : "error.main",
                        },
                      }}
                    />
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Deadlines */}
        <Grid item xs={12} lg={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <AccessTimeRoundedIcon />
                Upcoming Deadlines
              </Typography>
              <List>
                {upcomingDeadlinesData.map((item, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemIcon>
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: item.daysLeft === 0 ? "error.main" : 
                                        item.daysLeft <= 2 ? "warning.main" : "primary.main",
                          color: "white",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                        }}
                      >
                        {item.daysLeft === 0 ? "NOW" : `${item.daysLeft}d`}
                      </Box>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2" noWrap>
                          {item.taskTitle}
                        </Typography>
                      }
                      secondary={
                        <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.5 }}>
                          <Typography variant="caption" color="text.secondary">
                            {item.assignee}
                          </Typography>
                          <Chip
                            label={item.priority.toUpperCase()}
                            size="small"
                            color={item.priority === "high" ? "error" : 
                                  item.priority === "medium" ? "warning" : "default"}
                            variant="outlined"
                            sx={{ height: 16, "& .MuiChip-label": { px: 0.5, fontSize: "0.625rem" } }}
                          />
                        </Stack>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Team Performance */}
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <PeopleRoundedIcon />
            Team Performance
          </Typography>
          <Grid container spacing={2}>
            {teamPerformanceData.map((member) => (
              <Grid item xs={12} sm={6} md={4} key={member.email}>
                <Card variant="outlined" sx={{ height: "100%" }}>
                  <CardContent>
                    <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                      <Avatar sx={{ width: 48, height: 48 }}>
                        {member.avatar}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {member.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {member.email}
                        </Typography>
                      </Box>
                    </Stack>
                    
                    <Stack spacing={2}>
                      <Box>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                          <Typography variant="body2">Completion Rate</Typography>
                          <Typography variant="body2" fontWeight={500}>
                            {member.completionRate}%
                          </Typography>
                        </Stack>
                        <LinearProgress
                          variant="determinate"
                          value={member.completionRate}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: "grey.200",
                            "& .MuiLinearProgress-bar": {
                              borderRadius: 3,
                              backgroundColor: member.completionRate >= 85 ? "success.main" : 
                                            member.completionRate >= 70 ? "warning.main" : "error.main",
                            },
                          }}
                        />
                      </Box>
                      
                      <Stack direction="row" justifyContent="space-between">
                        <Box textAlign="center">
                          <Typography variant="h6" color="success.main">
                            {member.completed}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Completed
                          </Typography>
                        </Box>
                        <Box textAlign="center">
                          <Typography variant="h6" color="primary.main">
                            {member.assigned - member.completed}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Pending
                          </Typography>
                        </Box>
                        <Box textAlign="center">
                          <Typography variant="h6" color="error.main">
                            {member.overdue}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Overdue
                          </Typography>
                        </Box>
                      </Stack>
                      
                      <Box textAlign="center">
                        <Typography variant="body2" color="text.secondary">
                          Avg. Completion: {member.avgCompletionDays} days
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}
