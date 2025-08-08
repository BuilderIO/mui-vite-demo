import React, { useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Avatar,
  AvatarGroup,
  Chip,
  Stack,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Pause as PauseIcon,
  PlayArrow as PlayArrowIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Task, TeamMember } from '../types/Task';
import { useTaskContext } from '../context/TaskContext';
import { isTaskOverdue, isTaskDueToday, isTaskDueTomorrow, getInitials, getPriorityColor } from '../utils/taskUtils';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  subtitle?: string;
  progress?: number;
}

function StatCard({ title, value, icon, color, subtitle, progress }: StatCardProps) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography variant="h4" component="div" color={`${color}.main`} fontWeight="bold">
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
          <Avatar sx={{ bgcolor: `${color}.light`, color: `${color}.main` }}>
            {icon}
          </Avatar>
        </Box>
        {progress !== undefined && (
          <Box>
            <LinearProgress
              variant="determinate"
              value={progress}
              color={color}
              sx={{ height: 8, borderRadius: 4 }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
              {progress.toFixed(1)}% complete
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

export default function TaskDashboard() {
  const { tasks, stats, teamMembers } = useTaskContext();

  const dashboardData = useMemo(() => {
    // Status distribution for pie chart
    const statusData = [
      { name: 'Not Started', value: stats.notStarted, color: '#9e9e9e' },
      { name: 'In Progress', value: stats.inProgress, color: '#2196f3' },
      { name: 'Completed', value: stats.completed, color: '#4caf50' },
      { name: 'On Hold', value: stats.onHold, color: '#ff9800' },
    ].filter(item => item.value > 0);

    // Priority distribution
    const priorityData = [
      { name: 'High', value: tasks.filter(t => t.priority === 'High').length, color: '#f44336' },
      { name: 'Medium', value: tasks.filter(t => t.priority === 'Medium').length, color: '#ff9800' },
      { name: 'Low', value: tasks.filter(t => t.priority === 'Low').length, color: '#4caf50' },
    ].filter(item => item.value > 0);

    // Team workload
    const teamWorkload = teamMembers.map(member => {
      const memberTasks = tasks.filter(task => task.assignee?.id === member.id);
      return {
        name: member.name.split(' ')[0], // First name only
        total: memberTasks.length,
        completed: memberTasks.filter(t => t.status === 'Completed').length,
        inProgress: memberTasks.filter(t => t.status === 'In Progress').length,
        notStarted: memberTasks.filter(t => t.status === 'Not Started').length,
        onHold: memberTasks.filter(t => t.status === 'On Hold').length,
      };
    }).filter(member => member.total > 0);

    // Upcoming deadlines
    const upcomingTasks = tasks
      .filter(task => task.dueDate && task.status !== 'Completed')
      .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
      .slice(0, 5);

    // Overdue tasks
    const overdueTasks = tasks
      .filter(task => isTaskOverdue(task))
      .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime());

    // Team members with most tasks
    const busyTeamMembers = teamMembers
      .map(member => ({
        ...member,
        activeTasks: tasks.filter(task => 
          task.assignee?.id === member.id && 
          ['Not Started', 'In Progress', 'On Hold'].includes(task.status)
        ).length,
      }))
      .filter(member => member.activeTasks > 0)
      .sort((a, b) => b.activeTasks - a.activeTasks)
      .slice(0, 5);

    return {
      statusData,
      priorityData,
      teamWorkload,
      upcomingTasks,
      overdueTasks,
      busyTeamMembers,
    };
  }, [tasks, stats, teamMembers]);

  const completionRate = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;

  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
        Task Management Dashboard
      </Typography>

      {/* Overview Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Tasks"
            value={stats.total}
            icon={<AssignmentIcon />}
            color="primary"
            subtitle={`${stats.completed} completed`}
            progress={completionRate}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="In Progress"
            value={stats.inProgress}
            icon={<PlayArrowIcon />}
            color="info"
            subtitle="Active tasks"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Due Today"
            value={stats.dueToday}
            icon={<ScheduleIcon />}
            color="warning"
            subtitle={stats.dueTomorrow > 0 ? `${stats.dueTomorrow} due tomorrow` : ''}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Overdue"
            value={stats.overdue}
            icon={<WarningIcon />}
            color="error"
            subtitle="Need attention"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Status Distribution Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '400px' }}>
            <Typography variant="h6" gutterBottom>
              Task Status Distribution
            </Typography>
            {dashboardData.statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="90%">
                <PieChart>
                  <Pie
                    data={dashboardData.statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {dashboardData.statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '90%' }}>
                <Typography color="text.secondary">No tasks to display</Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Priority Distribution Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '400px' }}>
            <Typography variant="h6" gutterBottom>
              Priority Distribution
            </Typography>
            {dashboardData.priorityData.length > 0 ? (
              <ResponsiveContainer width="100%" height="90%">
                <BarChart data={dashboardData.priorityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8">
                    {dashboardData.priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '90%' }}>
                <Typography color="text.secondary">No tasks to display</Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Team Workload */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: '400px' }}>
            <Typography variant="h6" gutterBottom>
              Team Workload
            </Typography>
            {dashboardData.teamWorkload.length > 0 ? (
              <ResponsiveContainer width="100%" height="90%">
                <BarChart data={dashboardData.teamWorkload}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="completed" stackId="a" fill="#4caf50" name="Completed" />
                  <Bar dataKey="inProgress" stackId="a" fill="#2196f3" name="In Progress" />
                  <Bar dataKey="notStarted" stackId="a" fill="#9e9e9e" name="Not Started" />
                  <Bar dataKey="onHold" stackId="a" fill="#ff9800" name="On Hold" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '90%' }}>
                <Typography color="text.secondary">No assigned tasks to display</Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Busy Team Members */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '400px' }}>
            <Typography variant="h6" gutterBottom>
              Team Workload Overview
            </Typography>
            <List sx={{ maxHeight: '320px', overflowY: 'auto' }}>
              {dashboardData.busyTeamMembers.map((member, index) => (
                <ListItem key={member.id} divider={index < dashboardData.busyTeamMembers.length - 1}>
                  <ListItemAvatar>
                    <Avatar src={member.avatar}>
                      {getInitials(member.name)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={member.name}
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {member.activeTasks} active tasks
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {member.role}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
              {dashboardData.busyTeamMembers.length === 0 && (
                <ListItem>
                  <ListItemText
                    primary={
                      <Typography color="text.secondary" align="center">
                        No active assignments
                      </Typography>
                    }
                  />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>

        {/* Upcoming Deadlines */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Upcoming Deadlines
            </Typography>
            <List sx={{ maxHeight: '300px', overflowY: 'auto' }}>
              {dashboardData.upcomingTasks.map((task, index) => {
                const isOverdue = isTaskOverdue(task);
                const isDueToday = isTaskDueToday(task);
                
                return (
                  <ListItem key={task.id} divider={index < dashboardData.upcomingTasks.length - 1}>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body1" sx={{ flexGrow: 1 }}>
                            {task.title}
                          </Typography>
                          <Chip
                            size="small"
                            label={task.priority}
                            sx={{
                              backgroundColor: getPriorityColor(task.priority),
                              color: 'white',
                              fontSize: '0.75rem',
                            }}
                          />
                        </Box>
                      }
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                          <Typography
                            variant="body2"
                            color={isOverdue ? 'error.main' : isDueToday ? 'warning.main' : 'text.secondary'}
                          >
                            Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                          </Typography>
                          {task.assignee && (
                            <Avatar
                              src={task.assignee.avatar}
                              sx={{ width: 20, height: 20, fontSize: '0.75rem' }}
                            >
                              {getInitials(task.assignee.name)}
                            </Avatar>
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                );
              })}
              {dashboardData.upcomingTasks.length === 0 && (
                <ListItem>
                  <ListItemText
                    primary={
                      <Typography color="text.secondary" align="center">
                        No upcoming deadlines
                      </Typography>
                    }
                  />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>

        {/* Overdue Tasks */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: 'error.main' }}>
              Overdue Tasks ({dashboardData.overdueTasks.length})
            </Typography>
            <List sx={{ maxHeight: '300px', overflowY: 'auto' }}>
              {dashboardData.overdueTasks.map((task, index) => (
                <ListItem key={task.id} divider={index < dashboardData.overdueTasks.length - 1}>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body1" sx={{ flexGrow: 1 }}>
                          {task.title}
                        </Typography>
                        <Chip
                          size="small"
                          label={task.priority}
                          sx={{
                            backgroundColor: getPriorityColor(task.priority),
                            color: 'white',
                            fontSize: '0.75rem',
                          }}
                        />
                      </Box>
                    }
                    secondary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                        <Typography variant="body2" color="error.main">
                          Overdue: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                        </Typography>
                        {task.assignee && (
                          <Avatar
                            src={task.assignee.avatar}
                            sx={{ width: 20, height: 20, fontSize: '0.75rem' }}
                          >
                            {getInitials(task.assignee.name)}
                          </Avatar>
                        )}
                      </Box>
                    }
                  />
                </ListItem>
              ))}
              {dashboardData.overdueTasks.length === 0 && (
                <ListItem>
                  <ListItemText
                    primary={
                      <Typography color="text.secondary" align="center">
                        <CheckCircleIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                        No overdue tasks!
                      </Typography>
                    }
                  />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
