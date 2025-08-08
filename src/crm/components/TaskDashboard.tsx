import * as React from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Stack,
  Chip,
  Avatar,
  AvatarGroup,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  TrendingUp as TrendingUpIcon,
  Assignment as AssignmentIcon,
  Schedule as ScheduleIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon,
  Stop as StopIcon,
} from "@mui/icons-material";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Task, TaskStats, TeamMember, Priority } from "../types/taskTypes";
import { calculateTaskStats, getTasksByAssignee, getOverdueTasks, getUpcomingDeadlines, groupTasksByPriority } from "../utils/taskUtils";

interface TaskDashboardProps {
  tasks: Task[];
  teamMembers: TeamMember[];
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
}

function StatCard({ title, value, icon, color, subtitle }: StatCardProps) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box>
            <Typography variant="h4" component="div" sx={{ fontWeight: 600, color }}>
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box sx={{ color, opacity: 0.7 }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function TaskDashboard({ tasks, teamMembers }: TaskDashboardProps) {
  const stats = calculateTaskStats(tasks);
  const overdueTasks = getOverdueTasks();
  const upcomingTasks = getUpcomingDeadlines(tasks, 7);
  const priorityGroups = groupTasksByPriority(tasks);

  // Prepare data for charts
  const statusData = [
    { name: "Not Started", value: stats.notStarted, color: "#9e9e9e" },
    { name: "In Progress", value: stats.inProgress, color: "#2196f3" },
    { name: "Completed", value: stats.completed, color: "#4caf50" },
    { name: "On Hold", value: stats.onHold, color: "#ff9800" },
  ].filter(item => item.value > 0);

  const priorityData = [
    { name: "High", value: priorityGroups.High?.length || 0, color: "#f44336" },
    { name: "Medium", value: priorityGroups.Medium?.length || 0, color: "#ff9800" },
    { name: "Low", value: priorityGroups.Low?.length || 0, color: "#4caf50" },
  ].filter(item => item.value > 0);

  // Team workload data
  const workloadData = teamMembers
    .filter(member => member.isActive)
    .map(member => {
      const memberTasks = getTasksByAssignee(tasks, member.id);
      return {
        name: member.name.split(' ')[0], // First name only for chart
        total: memberTasks.length,
        completed: memberTasks.filter(t => t.status === "Completed").length,
        inProgress: memberTasks.filter(t => t.status === "In Progress").length,
        pending: memberTasks.filter(t => t.status === "Not Started").length,
      };
    })
    .sort((a, b) => b.total - a.total);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            bgcolor: "background.paper",
            p: 1,
            border: 1,
            borderColor: "divider",
            borderRadius: 1,
            boxShadow: 2,
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {label}
          </Typography>
          {payload.map((entry: any, index: number) => (
            <Typography key={index} variant="body2" sx={{ color: entry.color }}>
              {entry.dataKey}: {entry.value}
            </Typography>
          ))}
        </Box>
      );
    }
    return null;
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Task Dashboard
      </Typography>

      {/* Stats Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Tasks"
            value={stats.total}
            icon={<AssignmentIcon sx={{ fontSize: 40 }} />}
            color="primary.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Completed"
            value={stats.completed}
            icon={<CheckCircleIcon sx={{ fontSize: 40 }} />}
            color="success.main"
            subtitle={`${stats.completionRate.toFixed(1)}% completion rate`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="In Progress"
            value={stats.inProgress}
            icon={<PlayArrowIcon sx={{ fontSize: 40 }} />}
            color="info.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Overdue"
            value={stats.overdue}
            icon={<WarningIcon sx={{ fontSize: 40 }} />}
            color="error.main"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Task Status Distribution */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Task Status Distribution
              </Typography>
              <Box sx={{ height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Priority Distribution */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Priority Distribution
              </Typography>
              <Box sx={{ height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={priorityData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {priorityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Team Workload */}
        <Grid item xs={12}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Team Workload Distribution
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={workloadData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="completed" stackId="a" fill="#4caf50" name="Completed" />
                    <Bar dataKey="inProgress" stackId="a" fill="#2196f3" name="In Progress" />
                    <Bar dataKey="pending" stackId="a" fill="#9e9e9e" name="Not Started" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Overdue Tasks */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: "error.main" }}>
                Overdue Tasks ({overdueTasks.length})
              </Typography>
              {overdueTasks.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No overdue tasks! 🎉
                </Typography>
              ) : (
                <List dense>
                  {overdueTasks.slice(0, 5).map((task) => (
                    <ListItem key={task.id} sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar src={task.assignee.avatar} sx={{ width: 32, height: 32 }} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {task.title}
                          </Typography>
                        }
                        secondary={
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Chip
                              label={task.priority}
                              size="small"
                              sx={{
                                bgcolor: task.priority === "High" ? "error.main" : 
                                        task.priority === "Medium" ? "warning.main" : "success.main",
                                color: "white",
                                fontSize: "0.75rem",
                                height: 20,
                              }}
                            />
                            <Typography variant="caption" color="error.main">
                              Due: {task.dueDate?.toLocaleDateString()}
                            </Typography>
                          </Stack>
                        }
                      />
                    </ListItem>
                  ))}
                  {overdueTasks.length > 5 && (
                    <Typography variant="caption" color="text.secondary" sx={{ pl: 2 }}>
                      +{overdueTasks.length - 5} more overdue tasks
                    </Typography>
                  )}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Deadlines */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: "warning.main" }}>
                Upcoming Deadlines (Next 7 Days)
              </Typography>
              {upcomingTasks.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No upcoming deadlines in the next 7 days.
                </Typography>
              ) : (
                <List dense>
                  {upcomingTasks.slice(0, 5).map((task) => (
                    <ListItem key={task.id} sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar src={task.assignee.avatar} sx={{ width: 32, height: 32 }} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {task.title}
                          </Typography>
                        }
                        secondary={
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Chip
                              label={task.status}
                              size="small"
                              sx={{
                                bgcolor: task.status === "Not Started" ? "grey.500" :
                                        task.status === "In Progress" ? "info.main" :
                                        task.status === "Completed" ? "success.main" : "warning.main",
                                color: "white",
                                fontSize: "0.75rem",
                                height: 20,
                              }}
                            />
                            <Typography variant="caption" color="text.secondary">
                              Due: {task.dueDate?.toLocaleDateString()}
                            </Typography>
                          </Stack>
                        }
                      />
                    </ListItem>
                  ))}
                  {upcomingTasks.length > 5 && (
                    <Typography variant="caption" color="text.secondary" sx={{ pl: 2 }}>
                      +{upcomingTasks.length - 5} more upcoming tasks
                    </Typography>
                  )}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Performance Metrics */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={4}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Completion Rate
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box sx={{ width: "100%" }}>
                  <LinearProgress
                    variant="determinate"
                    value={stats.completionRate}
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                </Box>
                <Typography variant="h6" sx={{ minWidth: 60 }}>
                  {stats.completionRate.toFixed(1)}%
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {stats.completed} of {stats.total} tasks completed
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Average Completion Time
              </Typography>
              <Typography variant="h4" component="div" sx={{ color: "primary.main", fontWeight: 600 }}>
                {stats.averageCompletionTime}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                days per task
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Active Team Members
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <AvatarGroup max={4} sx={{ "& .MuiAvatar-root": { width: 32, height: 32 } }}>
                  {teamMembers.filter(m => m.isActive).map((member) => (
                    <Avatar
                      key={member.id}
                      src={member.avatar}
                      alt={member.name}
                      title={member.name}
                    />
                  ))}
                </AvatarGroup>
                <Typography variant="h6" sx={{ color: "primary.main" }}>
                  {teamMembers.filter(m => m.isActive).length}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                contributing to tasks
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
