import * as React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  Divider,
} from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart,
} from 'recharts';
import {
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

import { Task, TaskSummary } from '../types/task';
import { 
  isTaskOverdue, 
  isTaskDueSoon, 
  formatDueDate, 
  getPriorityColorHex,
  getTaskCompletionPercentage 
} from '../utils/taskUtils';
import { mockTeamMembers } from '../data/mockTasks';

interface TaskDashboardProps {
  tasks: Task[];
  summary: TaskSummary;
  onTaskUpdate: (task: Task) => void;
}

const PRIORITY_COLORS = {
  High: '#f44336',
  Medium: '#ff9800',
  Low: '#4caf50',
};

const STATUS_COLORS = {
  'Not Started': '#9e9e9e',
  'In Progress': '#2196f3',
  'On Hold': '#ff9800',
  'Completed': '#4caf50',
};

export default function TaskDashboard({ tasks, summary, onTaskUpdate }: TaskDashboardProps) {
  const theme = useTheme();

  // Get overdue and due soon tasks
  const overdueTasks = tasks.filter(task => isTaskOverdue(task));
  const dueSoonTasks = tasks.filter(task => isTaskDueSoon(task));
  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // Prepare chart data
  const priorityData = Object.entries(summary.tasksByPriority).map(([priority, count]) => ({
    name: priority,
    value: count,
    color: PRIORITY_COLORS[priority as keyof typeof PRIORITY_COLORS],
  }));

  const statusData = Object.entries(summary.tasksByStatus).map(([status, count]) => ({
    name: status,
    value: count,
    color: STATUS_COLORS[status as keyof typeof STATUS_COLORS],
  }));

  // Team workload data
  const teamWorkload = mockTeamMembers.map(member => {
    const memberTasks = tasks.filter(task => task.assigneeId === member.id);
    const completedTasks = memberTasks.filter(task => task.status === 'Completed').length;
    const inProgressTasks = memberTasks.filter(task => task.status === 'In Progress').length;
    const totalTasks = memberTasks.length;
    
    return {
      name: member.name.split(' ')[0], // First name only for chart
      total: totalTasks,
      completed: completedTasks,
      inProgress: inProgressTasks,
      completionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
    };
  });

  // Weekly progress data (mock data for demonstration)
  const weeklyData = [
    { week: 'Week 1', completed: 8, created: 12 },
    { week: 'Week 2', completed: 15, created: 10 },
    { week: 'Week 3', completed: 12, created: 8 },
    { week: 'Week 4', completed: 18, created: 14 },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Paper sx={{ p: 1, border: 1, borderColor: 'divider' }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {label}
          </Typography>
          {payload.map((entry: any, index: number) => (
            <Typography
              key={index}
              variant="body2"
              sx={{ color: entry.color }}
            >
              {entry.name}: {entry.value}
            </Typography>
          ))}
        </Paper>
      );
    }
    return null;
  };

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Priority Distribution Chart */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Tasks by Priority
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={priorityData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {priorityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Status Distribution Chart */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Tasks by Status
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statusData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" fill="#8884d8">
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Team Workload */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Team Workload Distribution
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={teamWorkload}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="completed" fill="#4caf50" name="Completed" />
                    <Bar dataKey="inProgress" fill="#2196f3" name="In Progress" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Weekly Progress Trend */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Weekly Progress Trend
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="completed"
                      stackId="1"
                      stroke="#4caf50"
                      fill="#4caf50"
                      fillOpacity={0.6}
                      name="Tasks Completed"
                    />
                    <Area
                      type="monotone"
                      dataKey="created"
                      stackId="2"
                      stroke="#2196f3"
                      fill="#2196f3"
                      fillOpacity={0.6}
                      name="Tasks Created"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Team Performance Table */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Team Performance
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Member</TableCell>
                      <TableCell align="center">Tasks</TableCell>
                      <TableCell align="center">Rate</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {teamWorkload
                      .sort((a, b) => b.completionRate - a.completionRate)
                      .map((member) => (
                        <TableRow key={member.name}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Avatar sx={{ width: 24, height: 24, fontSize: '0.7rem' }}>
                                {member.name[0]}
                              </Avatar>
                              <Typography variant="body2">{member.name}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2">
                              {member.completed}/{member.total}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Box sx={{ minWidth: 60 }}>
                              <LinearProgress
                                variant="determinate"
                                value={member.completionRate}
                                sx={{ height: 6, borderRadius: 3 }}
                              />
                              <Typography variant="caption" color="text.secondary">
                                {Math.round(member.completionRate)}%
                              </Typography>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Overdue Tasks Alert */}
        {overdueTasks.length > 0 && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <WarningIcon sx={{ color: 'error.main', mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'error.main' }}>
                    Overdue Tasks ({overdueTasks.length})
                  </Typography>
                </Box>
                <List dense>
                  {overdueTasks.slice(0, 3).map((task) => (
                    <ListItem key={task.id} sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'error.main' }}>
                          <WarningIcon fontSize="small" />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={task.title}
                        secondary={`Due ${formatDueDate(task.dueDate!)}`}
                        primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                        secondaryTypographyProps={{ variant: 'caption', color: 'error.main' }}
                      />
                      <Chip
                        label={task.priority}
                        size="small"
                        color={task.priority === 'High' ? 'error' : 'warning'}
                      />
                    </ListItem>
                  ))}
                  {overdueTasks.length > 3 && (
                    <ListItem sx={{ px: 0 }}>
                      <ListItemText
                        primary={`+${overdueTasks.length - 3} more overdue tasks`}
                        primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                      />
                    </ListItem>
                  )}
                </List>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Due Soon Tasks */}
        {dueSoonTasks.length > 0 && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ScheduleIcon sx={{ color: 'warning.main', mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'warning.main' }}>
                    Due Soon ({dueSoonTasks.length})
                  </Typography>
                </Box>
                <List dense>
                  {dueSoonTasks.slice(0, 3).map((task) => (
                    <ListItem key={task.id} sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'warning.main' }}>
                          <ScheduleIcon fontSize="small" />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={task.title}
                        secondary={`Due ${formatDueDate(task.dueDate!)}`}
                        primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                        secondaryTypographyProps={{ variant: 'caption', color: 'warning.main' }}
                      />
                      <Chip
                        label={task.priority}
                        size="small"
                        color={task.priority === 'High' ? 'error' : task.priority === 'Medium' ? 'warning' : 'success'}
                      />
                    </ListItem>
                  ))}
                  {dueSoonTasks.length > 3 && (
                    <ListItem sx={{ px: 0 }}>
                      <ListItemText
                        primary={`+${dueSoonTasks.length - 3} more tasks due soon`}
                        primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                      />
                    </ListItem>
                  )}
                </List>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Recent Tasks */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Recent Tasks
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Task</TableCell>
                      <TableCell>Assignee</TableCell>
                      <TableCell>Priority</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Due Date</TableCell>
                      <TableCell>Progress</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentTasks.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {task.title}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ width: 24, height: 24, fontSize: '0.7rem' }}>
                              {task.assignee?.name.split(' ').map(n => n[0]).join('') || '?'}
                            </Avatar>
                            <Typography variant="body2">
                              {task.assignee?.name || 'Unassigned'}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={task.priority}
                            size="small"
                            color={task.priority === 'High' ? 'error' : task.priority === 'Medium' ? 'warning' : 'success'}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={task.status}
                            size="small"
                            color={
                              task.status === 'Completed' ? 'success' :
                              task.status === 'In Progress' ? 'info' :
                              task.status === 'On Hold' ? 'warning' : 'default'
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            color={isTaskOverdue(task) ? 'error.main' : 'text.secondary'}
                          >
                            {task.dueDate ? formatDueDate(task.dueDate) : 'No due date'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ minWidth: 80 }}>
                            <LinearProgress
                              variant="determinate"
                              value={getTaskCompletionPercentage(task)}
                              sx={{ height: 6, borderRadius: 3 }}
                            />
                            <Typography variant="caption" color="text.secondary">
                              {Math.round(getTaskCompletionPercentage(task))}%
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
