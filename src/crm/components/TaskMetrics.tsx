import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import TodayIcon from "@mui/icons-material/Today";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import { TaskMetrics as TaskMetricsType } from "../types/tasks";

interface TaskMetricsProps {
  metrics: TaskMetricsType;
}

interface MetricCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: "primary" | "success" | "error" | "warning" | "info";
  trend?: {
    direction: "up" | "down";
    value: number;
  };
}

function MetricCard({ title, value, icon, color, trend }: MetricCardProps) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 48,
              height: 48,
              borderRadius: "50%",
              bgcolor: `${color}.main`,
              color: "white",
            }}
          >
            {icon}
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" component="div" sx={{ fontWeight: 600 }}>
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
            {trend && (
              <Chip
                size="small"
                icon={trend.direction === "up" ? <TrendingUpIcon /> : <TrendingDownIcon />}
                label={`${trend.value}%`}
                color={trend.direction === "up" ? "success" : "error"}
                sx={{ mt: 0.5 }}
              />
            )}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function TaskMetrics({ metrics }: TaskMetricsProps) {
  const completionRate = metrics.total > 0 ? Math.round((metrics.completed / metrics.total) * 100) : 0;

  return (
    <Box sx={{ width: "100%" }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={2}>
          <MetricCard
            title="Total Tasks"
            value={metrics.total}
            icon={<AssignmentIcon />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <MetricCard
            title="Completed"
            value={metrics.completed}
            icon={<CheckCircleIcon />}
            color="success"
            trend={{ direction: "up", value: completionRate }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <MetricCard
            title="In Progress"
            value={metrics.inProgress}
            icon={<HourglassTopIcon />}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <MetricCard
            title="Overdue"
            value={metrics.overdue}
            icon={<ErrorIcon />}
            color="error"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <MetricCard
            title="Due Today"
            value={metrics.dueToday}
            icon={<TodayIcon />}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <MetricCard
            title="On Hold"
            value={metrics.onHold}
            icon={<PauseCircleIcon />}
            color="warning"
          />
        </Grid>
      </Grid>
    </Box>
  );
}
