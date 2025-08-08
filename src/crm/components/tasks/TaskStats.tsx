import * as React from 'react';
import {
  Paper,
  Box,
  Typography,
  Grid,
  LinearProgress,
  Chip,
  Card,
  CardContent,
} from '@mui/material';
import {
  Assignment as TaskIcon,
  PlayArrow as InProgressIcon,
  CheckCircle as CompletedIcon,
  Pause as OnHoldIcon,
  Schedule as OverdueIcon,
  Today as TodayIcon,
  Tomorrow as TomorrowIcon,
} from '@mui/icons-material';
import { TaskStats as TaskStatsType } from '../../types/TaskTypes';

interface TaskStatsProps {
  stats: TaskStatsType;
}

const StatCard = ({ 
  title, 
  value, 
  icon, 
  color, 
  subtext 
}: { 
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  subtext?: string;
}) => (
  <Card sx={{ height: '100%' }}>
    <CardContent sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Box sx={{ color, fontSize: '2rem' }}>
          {icon}
        </Box>
        <Typography variant="h4" component="div" sx={{ fontWeight: 700, color }}>
          {value}
        </Typography>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
        {title}
      </Typography>
      {subtext && (
        <Typography variant="caption" color="text.secondary">
          {subtext}
        </Typography>
      )}
    </CardContent>
  </Card>
);

export default function TaskStats({ stats }: TaskStatsProps) {
  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        Task Overview
      </Typography>
      
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Tasks"
            value={stats.total}
            icon={<TaskIcon />}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="In Progress"
            value={stats.inProgress}
            icon={<InProgressIcon />}
            color="#2196f3"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Completed"
            value={stats.completed}
            icon={<CompletedIcon />}
            color="#4caf50"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Overdue"
            value={stats.overdue}
            icon={<OverdueIcon />}
            color="#f44336"
          />
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <StatCard
            title="Due Today"
            value={stats.dueToday}
            icon={<TodayIcon />}
            color="#ff9800"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard
            title="Due Tomorrow"
            value={stats.dueTomorrow}
            icon={<TomorrowIcon />}
            color="#9c27b0"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard
            title="On Hold"
            value={stats.onHold}
            icon={<OnHoldIcon />}
            color="#607d8b"
          />
        </Grid>
      </Grid>

      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Completion Rate
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
            {stats.completionRate.toFixed(1)}%
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={stats.completionRate}
          sx={{
            height: 12,
            borderRadius: 6,
            backgroundColor: 'grey.200',
            '& .MuiLinearProgress-bar': {
              borderRadius: 6,
              background: stats.completionRate >= 80 ? 
                'linear-gradient(90deg, #4caf50 0%, #8bc34a 100%)' :
                stats.completionRate >= 60 ?
                'linear-gradient(90deg, #ff9800 0%, #ffc107 100%)' :
                'linear-gradient(90deg, #f44336 0%, #ff5722 100%)',
            },
          }}
        />
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        <Chip
          label={`${stats.notStarted} Not Started`}
          size="small"
          sx={{ bgcolor: '#f5f5f5', color: '#757575' }}
        />
        <Chip
          label={`${stats.inProgress} In Progress`}
          size="small"
          sx={{ bgcolor: '#e3f2fd', color: '#2196f3' }}
        />
        <Chip
          label={`${stats.completed} Completed`}
          size="small"
          sx={{ bgcolor: '#e8f5e9', color: '#4caf50' }}
        />
        <Chip
          label={`${stats.onHold} On Hold`}
          size="small"
          sx={{ bgcolor: '#fff3e0', color: '#ff9800' }}
        />
        {stats.overdue > 0 && (
          <Chip
            label={`${stats.overdue} Overdue`}
            size="small"
            sx={{ bgcolor: '#ffebee', color: '#f44336', fontWeight: 600 }}
          />
        )}
      </Box>
    </Paper>
  );
}
