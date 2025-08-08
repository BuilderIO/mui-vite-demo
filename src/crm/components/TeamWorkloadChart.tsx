import * as React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  Avatar,
  LinearProgress,
  Chip,
} from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { Task, TeamMember } from '../types/taskTypes';
import { mockTeamMembers, formatTaskStatus } from '../data/taskData';

interface TeamWorkloadChartProps {
  tasks: Task[];
}

interface TeamMemberWorkload {
  member: TeamMember;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  overdueTasks: number;
  completionRate: number;
}

export default function TeamWorkloadChart({ tasks }: TeamWorkloadChartProps) {
  const workloadData = React.useMemo(() => {
    const workloads: TeamMemberWorkload[] = mockTeamMembers.map(member => {
      const memberTasks = tasks.filter(task => task.assigneeId === member.id);
      const completedTasks = memberTasks.filter(task => task.status === 'completed').length;
      const inProgressTasks = memberTasks.filter(task => task.status === 'in_progress').length;
      const overdueTasks = memberTasks.filter(task => {
        if (!task.dueDate || task.status === 'completed') return false;
        return new Date(task.dueDate) < new Date();
      }).length;

      return {
        member,
        totalTasks: memberTasks.length,
        completedTasks,
        inProgressTasks,
        overdueTasks,
        completionRate: memberTasks.length > 0 ? (completedTasks / memberTasks.length) * 100 : 0,
      };
    });

    // Sort by total tasks (descending)
    return workloads.sort((a, b) => b.totalTasks - a.totalTasks);
  }, [tasks]);

  const chartData = workloadData.filter(w => w.totalTasks > 0);

  if (chartData.length === 0) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Team Workload Distribution
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: 300,
              color: 'text.secondary',
            }}
          >
            <Typography variant="body2">
              No tasks assigned to team members
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Team Workload Distribution
        </Typography>

        {/* Bar Chart */}
        <Box sx={{ height: 300, mb: 3 }}>
          <BarChart
            dataset={chartData.map(w => ({
              member: w.member.name.split(' ')[0], // First name only for chart
              completed: w.completedTasks,
              inProgress: w.inProgressTasks,
              overdue: w.overdueTasks,
            }))}
            xAxis={[{ 
              scaleType: 'band', 
              dataKey: 'member',
            }]}
            series={[
              {
                dataKey: 'completed',
                label: 'Completed',
                color: '#4caf50',
                stack: 'tasks',
              },
              {
                dataKey: 'inProgress',
                label: 'In Progress',
                color: '#2196f3',
                stack: 'tasks',
              },
              {
                dataKey: 'overdue',
                label: 'Overdue',
                color: '#f44336',
                stack: 'tasks',
              },
            ]}
            height={250}
            margin={{
              left: 40,
              right: 20,
              top: 20,
              bottom: 40,
            }}
          />
        </Box>

        {/* Detailed Workload List */}
        <Stack spacing={2}>
          <Typography variant="subtitle2">Team Member Details</Typography>
          {chartData.map((workload, index) => (
            <Box
              key={workload.member.id}
              sx={{
                p: 2,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                backgroundColor: 'background.paper',
              }}
            >
              <Stack spacing={2}>
                {/* Member Info */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar
                    src={workload.member.avatar}
                    sx={{ width: 40, height: 40 }}
                  >
                    {workload.member.name.split(' ').map(n => n[0]).join('')}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2">
                      {workload.member.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {workload.totalTasks} total tasks
                    </Typography>
                  </Box>
                  <Chip
                    label={`${workload.completionRate.toFixed(1)}% complete`}
                    size="small"
                    color={workload.completionRate >= 80 ? 'success' : 
                           workload.completionRate >= 50 ? 'warning' : 'error'}
                    variant="outlined"
                  />
                </Box>

                {/* Progress Bar */}
                <Box>
                  <LinearProgress
                    variant="determinate"
                    value={workload.completionRate}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: 'grey.200',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 4,
                      },
                    }}
                  />
                </Box>

                {/* Task Breakdown */}
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  <Chip
                    label={`${workload.completedTasks} Completed`}
                    size="small"
                    sx={{
                      backgroundColor: '#4caf50',
                      color: 'white',
                    }}
                  />
                  <Chip
                    label={`${workload.inProgressTasks} In Progress`}
                    size="small"
                    sx={{
                      backgroundColor: '#2196f3',
                      color: 'white',
                    }}
                  />
                  {workload.overdueTasks > 0 && (
                    <Chip
                      label={`${workload.overdueTasks} Overdue`}
                      size="small"
                      sx={{
                        backgroundColor: '#f44336',
                        color: 'white',
                      }}
                    />
                  )}
                </Stack>
              </Stack>
            </Box>
          ))}

          {/* Unassigned Members */}
          {workloadData.filter(w => w.totalTasks === 0).length > 0 && (
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Team Members Without Tasks
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {workloadData
                  .filter(w => w.totalTasks === 0)
                  .map(workload => (
                    <Chip
                      key={workload.member.id}
                      avatar={
                        <Avatar 
                          src={workload.member.avatar}
                          sx={{ width: 24, height: 24 }}
                        >
                          {workload.member.name.split(' ').map(n => n[0]).join('')}
                        </Avatar>
                      }
                      label={workload.member.name}
                      variant="outlined"
                      size="small"
                    />
                  ))}
              </Stack>
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
