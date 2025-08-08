import * as React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  Chip,
} from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import { TaskStats } from '../types/taskTypes';
import { getPriorityColor, formatTaskPriority } from '../data/taskData';

interface TaskPriorityChartProps {
  stats: TaskStats;
}

export default function TaskPriorityChart({ stats }: TaskPriorityChartProps) {
  const chartData = [
    {
      id: 'high',
      label: 'High Priority',
      value: stats.byPriority.high,
      color: getPriorityColor('high'),
    },
    {
      id: 'medium',
      label: 'Medium Priority',
      value: stats.byPriority.medium,
      color: getPriorityColor('medium'),
    },
    {
      id: 'low',
      label: 'Low Priority',
      value: stats.byPriority.low,
      color: getPriorityColor('low'),
    },
  ].filter(item => item.value > 0);

  const totalTasks = stats.byPriority.high + stats.byPriority.medium + stats.byPriority.low;

  if (totalTasks === 0) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Tasks by Priority
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
              No tasks available
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
          Tasks by Priority
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          {/* Pie Chart */}
          <Box sx={{ flex: 1, minHeight: 300 }}>
            <PieChart
              series={[
                {
                  data: chartData,
                  highlightScope: { faded: 'global', highlighted: 'item' },
                  faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                  innerRadius: 40,
                  outerRadius: 120,
                  paddingAngle: 2,
                  cornerRadius: 5,
                },
              ]}
              height={300}
              slotProps={{
                legend: { hidden: true },
              }}
            />
          </Box>

          {/* Legend */}
          <Stack spacing={2} sx={{ minWidth: 150 }}>
            {chartData.map((item) => {
              const percentage = ((item.value / totalTasks) * 100).toFixed(1);
              return (
                <Box key={item.id} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 16,
                      height: 16,
                      backgroundColor: item.color,
                      borderRadius: '50%',
                      flexShrink: 0,
                    }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {formatTaskPriority(item.id as any)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {item.value} tasks ({percentage}%)
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Stack>
        </Box>

        {/* Summary Chips */}
        <Stack direction="row" spacing={1} sx={{ mt: 2 }} flexWrap="wrap">
          <Chip
            label={`${stats.byPriority.high} High`}
            size="small"
            sx={{
              backgroundColor: getPriorityColor('high'),
              color: 'white',
              fontWeight: 500,
            }}
          />
          <Chip
            label={`${stats.byPriority.medium} Medium`}
            size="small"
            sx={{
              backgroundColor: getPriorityColor('medium'),
              color: 'white',
              fontWeight: 500,
            }}
          />
          <Chip
            label={`${stats.byPriority.low} Low`}
            size="small"
            sx={{
              backgroundColor: getPriorityColor('low'),
              color: 'white',
              fontWeight: 500,
            }}
          />
        </Stack>
      </CardContent>
    </Card>
  );
}
