import * as React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
  Stack,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Chip,
  Divider,
} from "@mui/material";
import {
  Assignment as AssignmentIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
} from "@mui/icons-material";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { useTaskContext } from "../contexts/TaskContext";
import { 
  getTaskCompletionPercentage, 
  getWorkloadDistribution,
  isTaskOverdue,
  isTaskDueSoon,
  formatDueDate,
  getPriorityColor,
} from "../utils/taskUtils";

const COLORS = {
  not_started: "#9e9e9e",
  in_progress: "#2196f3",
  completed: "#4caf50",
  on_hold: "#ff9800",
  overdue: "#f44336",
};

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color?: "primary" | "success" | "warning" | "error" | "info";
  subtitle?: string;
  progress?: number;
}

function StatCard({ title, value, icon, color = "primary", subtitle, progress }: StatCardProps) {
  return (
    <Card variant="outlined" sx={{ height: "100%" }}>
      <CardContent>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar sx={{ bgcolor: `${color}.main`, color: `${color}.contrastText` }}>
            {icon}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" component="div" fontWeight="bold">
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
            {progress !== undefined && (
              <Box sx={{ mt: 1 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={progress} 
                  color={color}
                  sx={{ height: 6, borderRadius: 3 }}
                />
              </Box>
            )}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function TaskDashboard() {
  const { tasks, stats, teamMembers } = useTaskContext();

  const completionPercentage = getTaskCompletionPercentage(tasks);
  const workloadDistribution = getWorkloadDistribution(tasks, teamMembers);

  // Prepare data for charts
  const statusData = [
    { name: "Not Started", value: stats.notStarted, color: COLORS.not_started },
    { name: "In Progress", value: stats.inProgress, color: COLORS.in_progress },
    { name: "Completed", value: stats.completed, color: COLORS.completed },
    { name: "On Hold", value: stats.onHold, color: COLORS.on_hold },
  ].filter(item => item.value > 0);

  const workloadData = workloadDistribution.map(({ member, taskCount, completedCount, overdueCount }) => ({
    name: member.name,
    total: taskCount,
    completed: completedCount,
    pending: taskCount - completedCount,
    overdue: overdueCount,
  }));

  // Get upcoming tasks (next 5 due soon or overdue)
  const upcomingTasks = React.useMemo(() => {
    return tasks
      .filter(task => task.dueDate && task.status !== "completed")
      .sort((a, b) => {
        if (!a.dueDate || !b.dueDate) return 0;
        return a.dueDate.getTime() - b.dueDate.getTime();
      })
      .slice(0, 5);
  }, [tasks]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Box sx={{ 
          bgcolor: 'background.paper', 
          p: 1, 
          border: 1, 
          borderColor: 'divider',
          borderRadius: 1,
          boxShadow: 2
        }}>
          <Typography variant="body2" fontWeight="bold">{label}</Typography>
          {payload.map((entry: any, index: number) => (
            <Typography 
              key={index} 
              variant="caption" 
              sx={{ color: entry.color }}
            >
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
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Tasks"
            value={stats.total}
            icon={<AssignmentIcon />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="In Progress"
            value={stats.inProgress}
            icon={<TrendingUpIcon />}
            color="info"
            subtitle={`${Math.round((stats.inProgress / Math.max(stats.total, 1)) * 100)}% of total`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Completed"
            value={stats.completed}
            icon={<CheckCircleIcon />}
            color="success"
            progress={completionPercentage}
            subtitle={`${completionPercentage}% completion rate`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Overdue"
            value={stats.overdue}
            icon={<WarningIcon />}
            color="error"
            subtitle={stats.overdue > 0 ? "Needs attention" : "All on track"}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Task Status Distribution */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ height: 400 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Task Status Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value, percent }) => 
                      `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Team Workload */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ height: 400 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Team Workload Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={workloadData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="completed" stackId="a" fill="#4caf50" name="Completed" />
                  <Bar dataKey="pending" stackId="a" fill="#2196f3" name="Pending" />
                  <Bar dataKey="overdue" stackId="a" fill="#f44336" name="Overdue" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Tasks */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ height: 400 }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <ScheduleIcon color="primary" />
                <Typography variant="h6">
                  Upcoming Deadlines
                </Typography>
              </Stack>
              
              {upcomingTasks.length === 0 ? (
                <Box sx={{ 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  height: 200,
                  flexDirection: "column",
                  gap: 1
                }}>
                  <CheckCircleIcon sx={{ fontSize: 48, color: "success.main" }} />
                  <Typography variant="body1" color="text.secondary">
                    No upcoming deadlines
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    All tasks are on track!
                  </Typography>
                </Box>
              ) : (
                <List sx={{ maxHeight: 300, overflow: "auto" }}>
                  {upcomingTasks.map((task, index) => (
                    <React.Fragment key={task.id}>
                      <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                        <ListItemAvatar>
                          <Avatar sx={{ width: 32, height: 32 }}>
                            {task.assignee?.avatar || "?"}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                              <Typography variant="body2" fontWeight={500}>
                                {task.title}
                              </Typography>
                              <Chip
                                label={task.priority}
                                size="small"
                                color={getPriorityColor(task.priority)}
                                variant="outlined"
                              />
                            </Box>
                          }
                          secondary={
                            <Stack spacing={0.5}>
                              <Typography
                                variant="caption"
                                color={
                                  isTaskOverdue(task)
                                    ? "error"
                                    : isTaskDueSoon(task)
                                    ? "warning.main"
                                    : "text.secondary"
                                }
                              >
                                {task.dueDate && formatDueDate(task.dueDate)}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Assigned to: {task.assignee?.name || "Unassigned"}
                              </Typography>
                            </Stack>
                          }
                        />
                      </ListItem>
                      {index < upcomingTasks.length - 1 && <Divider variant="inset" component="li" />}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Team Performance */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ height: 400 }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <PeopleIcon color="primary" />
                <Typography variant="h6">
                  Team Performance
                </Typography>
              </Stack>
              
              <List sx={{ maxHeight: 300, overflow: "auto" }}>
                {workloadDistribution.map((item, index) => (
                  <React.Fragment key={item.member.id}>
                    <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ width: 32, height: 32 }}>
                          {item.member.avatar}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="body2" fontWeight={500}>
                            {item.member.name}
                          </Typography>
                        }
                        secondary={
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              {item.taskCount} total tasks • {item.completedCount} completed
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={item.taskCount > 0 ? (item.completedCount / item.taskCount) * 100 : 0}
                              sx={{ mt: 0.5, height: 4, borderRadius: 2 }}
                              color={item.overdueCount > 0 ? "error" : "primary"}
                            />
                            {item.overdueCount > 0 && (
                              <Typography variant="caption" color="error.main">
                                {item.overdueCount} overdue task{item.overdueCount === 1 ? "" : "s"}
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < workloadDistribution.length - 1 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
