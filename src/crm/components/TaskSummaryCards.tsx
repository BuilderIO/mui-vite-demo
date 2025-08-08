import * as React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
  useTheme,
  alpha,
  Chip,
} from '@mui/material';
import {
  Assignment as TaskIcon,
  CheckCircle as CompletedIcon,
  Schedule as InProgressIcon,
  Warning as OverdueIcon,
  TrendingUp as TrendingIcon,
} from '@mui/icons-material';

import { TaskSummary } from '../types/task';

interface TaskSummaryCardsProps {
  summary: TaskSummary;
}

interface SummaryCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
  progress?: number;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
}

function SummaryCard({ title, value, icon, color, subtitle, progress, trend }: SummaryCardProps) {
  const theme = useTheme();
  
  return (
    <Card 
      sx={{ 
        height: '100%',
        background: `linear-gradient(135deg, ${alpha(color, 0.1)}, ${alpha(color, 0.05)})`,
        border: `1px solid ${alpha(color, 0.2)}`,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows[4],
          border: `1px solid ${alpha(color, 0.3)}`,
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ 
            p: 1.5, 
            borderRadius: 2, 
            bgcolor: alpha(color, 0.15),
            color: color,
            mr: 2
          }}>
            {icon}
          </Box>
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography 
              variant="h3" 
              component="div" 
              sx={{ 
                fontWeight: 700,
                color: color,
                lineHeight: 1.2
              }}
            >
              {value}
            </Typography>
            {trend && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                <TrendingIcon 
                  sx={{ 
                    fontSize: 16, 
                    mr: 0.5,
                    color: trend.direction === 'up' ? 'success.main' : 'error.main',
                    transform: trend.direction === 'down' ? 'rotate(180deg)' : 'none'
                  }} 
                />
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: trend.direction === 'up' ? 'success.main' : 'error.main',
                    fontWeight: 600
                  }}
                >
                  {trend.value}%
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
        
        <Typography variant="body2" color="text.primary" sx={{ fontWeight: 600, mb: 1 }}>
          {title}
        </Typography>
        
        {subtitle && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {subtitle}
          </Typography>
        )}
        
        {progress !== undefined && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Progress
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {Math.round(progress)}%
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={progress} 
              sx={{
                height: 6,
                borderRadius: 3,
                bgcolor: alpha(color, 0.1),
                '& .MuiLinearProgress-bar': {
                  bgcolor: color,
                  borderRadius: 3,
                }
              }}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

export default function TaskSummaryCards({ summary }: TaskSummaryCardsProps) {
  const theme = useTheme();

  const cards = [
    {
      title: 'Total Tasks',
      value: summary.totalTasks,
      icon: <TaskIcon />,
      color: theme.palette.primary.main,
      subtitle: 'All tasks in the system',
      trend: { value: 8, direction: 'up' as const }
    },
    {
      title: 'Completed',
      value: summary.completedTasks,
      icon: <CompletedIcon />,
      color: theme.palette.success.main,
      subtitle: `${Math.round(summary.completionRate)}% completion rate`,
      progress: summary.completionRate,
    },
    {
      title: 'In Progress',
      value: summary.inProgressTasks,
      icon: <InProgressIcon />,
      color: theme.palette.info.main,
      subtitle: 'Currently being worked on',
      trend: { value: 12, direction: 'up' as const }
    },
    {
      title: 'Overdue',
      value: summary.overdueTasks,
      icon: <OverdueIcon />,
      color: theme.palette.error.main,
      subtitle: summary.overdueTasks > 0 ? 'Need immediate attention' : 'Great job!',
      trend: summary.overdueTasks > 0 ? { value: 5, direction: 'down' as const } : undefined
    }
  ];

  return (
    <Box sx={{ mb: 3 }}>
      <Grid container spacing={3}>
        {cards.map((card, index) => (
          <Grid item xs={12} sm={6} lg={3} key={index}>
            <SummaryCard {...card} />
          </Grid>
        ))}
      </Grid>
      
      {/* Priority Distribution */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            Priority Distribution
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
            <Chip
              label={`High: ${summary.tasksByPriority.High}`}
              color="error"
              variant="outlined"
              size="small"
            />
            <Chip
              label={`Medium: ${summary.tasksByPriority.Medium}`}
              color="warning"
              variant="outlined"
              size="small"
            />
            <Chip
              label={`Low: ${summary.tasksByPriority.Low}`}
              color="success"
              variant="outlined"
              size="small"
            />
          </Box>
          
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 3 }}>
            Status Distribution
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
            <Chip
              label={`Not Started: ${summary.tasksByStatus['Not Started']}`}
              color="default"
              variant="outlined"
              size="small"
            />
            <Chip
              label={`In Progress: ${summary.tasksByStatus['In Progress']}`}
              color="info"
              variant="outlined"
              size="small"
            />
            <Chip
              label={`On Hold: ${summary.tasksByStatus['On Hold']}`}
              color="warning"
              variant="outlined"
              size="small"
            />
            <Chip
              label={`Completed: ${summary.tasksByStatus.Completed}`}
              color="success"
              variant="outlined"
              size="small"
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
