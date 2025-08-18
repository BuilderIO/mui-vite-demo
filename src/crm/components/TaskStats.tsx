import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import CrmStatCard from './CrmStatCard';
import type { TaskPriority, TaskStatus } from '../types/taskTypes';

interface TaskStatsProps {
  stats: {
    total: number;
    completed: number;
    inProgress: number;
    overdue: number;
    byPriority: Record<TaskPriority, number>;
    byStatus: Record<TaskStatus, number>;
  };
}

export default function TaskStats({ stats }: TaskStatsProps) {
  // Calculate completion rate
  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
  
  // Calculate trend (mock data for demonstration)
  const generateTrendData = (base: number) => {
    return Array.from({ length: 7 }, (_, i) => 
      Math.max(0, base + Math.floor(Math.random() * 10) - 5)
    );
  };

  return (
    <Box sx={{ width: '100%', mb: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <CrmStatCard
            title="Total Tasks"
            value={stats.total.toString()}
            interval="All time"
            trend="up"
            trendValue="+5%"
            data={generateTrendData(stats.total)}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <CrmStatCard
            title="Completed"
            value={stats.completed.toString()}
            interval={`${completionRate}% completion rate`}
            trend="up"
            trendValue="+12%"
            data={generateTrendData(stats.completed)}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <CrmStatCard
            title="In Progress"
            value={stats.inProgress.toString()}
            interval="Active tasks"
            trend="up"
            trendValue="+3%"
            data={generateTrendData(stats.inProgress)}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <CrmStatCard
            title="Overdue"
            value={stats.overdue.toString()}
            interval="Needs attention"
            trend={stats.overdue > 0 ? "down" : "up"}
            trendValue={stats.overdue > 0 ? "-8%" : "0%"}
            data={generateTrendData(stats.overdue)}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
