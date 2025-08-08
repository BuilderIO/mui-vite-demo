import * as React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  LinearProgress,
  Chip,
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  PlayArrow as PlayArrowIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  AccessTime as TimeIcon,
  TrendingUp as TrendingUpIcon,
  Pause as PauseIcon,
  NotStarted as NotStartedIcon,
} from '@mui/icons-material';
import { TaskStats } from '../types/taskTypes';

interface TaskStatsCardsProps {
  stats: TaskStats;
}

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
  progress?: number;
  trend?: {
    value: string;
    direction: 'up' | 'down';
  };
}

function StatCard({ title, value, icon, color, subtitle, progress, trend }: StatCardProps) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Stack spacing={2}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box
              sx={{
                backgroundColor: `${color}15`,
                borderRadius: 2,
                p: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {React.cloneElement(icon as React.ReactElement, {
                sx: { color, fontSize: 24 }
              })}
            </Box>
            {trend && (
              <Chip
                icon={<TrendingUpIcon fontSize="small" />}
                label={trend.value}
                size="small"
                color={trend.direction === 'up' ? 'success' : 'error'}
                variant="outlined"
              />
            )}
          </Box>

          {/* Value */}
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

          {/* Progress */}
          {progress !== undefined && (
            <Box>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: 'grey.200',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: color,
                    borderRadius: 4,
                  },
                }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                {progress.toFixed(1)}% completion rate
              </Typography>
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function TaskStatsCards({ stats }: TaskStatsCardsProps) {
  const statCards = [
    {
      title: 'Total Tasks',
      value: stats.total,
      icon: <AssignmentIcon />,
      color: '#1976d2',
      subtitle: 'All tasks in the system',
    },
    {
      title: 'In Progress',
      value: stats.inProgress,
      icon: <PlayArrowIcon />,
      color: '#2196f3',
      subtitle: 'Currently active tasks',
      trend: {
        value: '+12%',
        direction: 'up' as const,
      },
    },
    {
      title: 'Completed',
      value: stats.completed,
      icon: <CheckCircleIcon />,
      color: '#4caf50',
      subtitle: 'Successfully finished',
      progress: stats.completionRate,
    },
    {
      title: 'Overdue',
      value: stats.overdue,
      icon: <WarningIcon />,
      color: '#f44336',
      subtitle: 'Require immediate attention',
      trend: stats.overdue > 0 ? {
        value: 'Action needed',
        direction: 'down' as const,
      } : undefined,
    },
    {
      title: 'Due Soon',
      value: stats.dueSoon,
      icon: <TimeIcon />,
      color: '#ff9800',
      subtitle: 'Due within 24 hours',
    },
    {
      title: 'On Hold',
      value: stats.onHold,
      icon: <PauseIcon />,
      color: '#9c27b0',
      subtitle: 'Temporarily paused',
    },
  ];

  return (
    <Grid container spacing={3}>
      {statCards.map((card, index) => (
        <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
          <StatCard {...card} />
        </Grid>
      ))}
    </Grid>
  );
}
