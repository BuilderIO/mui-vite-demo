import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import LinearProgress from "@mui/material/LinearProgress";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import WarningIcon from "@mui/icons-material/Warning";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, Legend } from "recharts";
import dayjs from "dayjs";
import type { Task, TaskStats, TeamMember } from "../types/taskTypes";

interface TaskStatsProps {
  tasks: Task[];
  teamMembers: TeamMember[];
}

interface StatCardProps {
  title: string;
  value: number;
  total?: number;
  color: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    direction: "up" | "down";
  };
  showProgress?: boolean;
}

const COLORS = {
  high: "#f44336",
  medium: "#ff9800",
  low: "#4caf50",
  todo: "#9e9e9e",
  in_progress: "#2196f3",
  completed: "#4caf50",
  on_hold: "#ff9800",
};

function StatCard({
  title,
  value,
  total,
  color,
  icon,
  trend,
  showProgress = false,
}: StatCardProps) {
  const percentage = total ? (value / total) * 100 : 0;

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Avatar sx={{ bgcolor: color, width: 40, height: 40 }}>
                {icon}
              </Avatar>
              <Typography variant="body2" color="text.secondary">
                {title}
              </Typography>
            </Box>
            {trend && (
              <Tooltip title={`${trend.direction === "up" ? "+" : "-"}${trend.value}% from last week`}>
                <IconButton size="small">
                  {trend.direction === "up" ? (
                    <TrendingUpIcon sx={{ color: "success.main" }} />
                  ) : (
                    <TrendingDownIcon sx={{ color: "error.main" }} />
                  )}
                </IconButton>
              </Tooltip>
            )}
          </Box>

          <Box>
            <Typography variant="h4" component="div" fontWeight="bold">
              {value}
              {total && (
                <Typography component="span" variant="body1" color="text.secondary">
                  /{total}
                </Typography>
              )}
            </Typography>
            {showProgress && total && (
              <Box sx={{ mt: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={percentage}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: "grey.200",
                    "& .MuiLinearProgress-bar": {
                      borderRadius: 4,
                      backgroundColor: color,
                    },
                  }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                  {percentage.toFixed(1)}% completed
                </Typography>
              </Box>
            )}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function TaskStats({ tasks, teamMembers }: TaskStatsProps) {
  const stats = React.useMemo((): TaskStats => {
    const now = dayjs();
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === "completed").length;
    const inProgress = tasks.filter((t) => t.status === "in_progress").length;
    
    const overdue = tasks.filter((t) => 
      t.dueDate && dayjs(t.dueDate).isBefore(now, "day") && t.status !== "completed"
    ).length;
    
    const dueSoon = tasks.filter((t) => {
      if (!t.dueDate || t.status === "completed") return false;
      const diffInDays = dayjs(t.dueDate).diff(now, "day");
      return diffInDays >= 0 && diffInDays <= 3;
    }).length;

    const byPriority = {
      high: tasks.filter((t) => t.priority === "high").length,
      medium: tasks.filter((t) => t.priority === "medium").length,
      low: tasks.filter((t) => t.priority === "low").length,
    };

    const byStatus = {
      todo: tasks.filter((t) => t.status === "todo").length,
      in_progress: tasks.filter((t) => t.status === "in_progress").length,
      completed: tasks.filter((t) => t.status === "completed").length,
      on_hold: tasks.filter((t) => t.status === "on_hold").length,
    };

    return {
      total,
      completed,
      inProgress,
      overdue,
      dueSoon,
      byPriority,
      byStatus,
    };
  }, [tasks]);

  const priorityChartData = React.useMemo(() => [
    { name: "High", value: stats.byPriority.high, color: COLORS.high },
    { name: "Medium", value: stats.byPriority.medium, color: COLORS.medium },
    { name: "Low", value: stats.byPriority.low, color: COLORS.low },
  ], [stats]);

  const statusChartData = React.useMemo(() => [
    { name: "To Do", value: stats.byStatus.todo, color: COLORS.todo },
    { name: "In Progress", value: stats.byStatus.in_progress, color: COLORS.in_progress },
    { name: "Completed", value: stats.byStatus.completed, color: COLORS.completed },
    { name: "On Hold", value: stats.byStatus.on_hold, color: COLORS.on_hold },
  ], [stats]);

  const teamProductivity = React.useMemo(() => {
    const memberStats = teamMembers.map((member) => {
      const memberTasks = tasks.filter((t) => t.assignee?.id === member.id);
      const completed = memberTasks.filter((t) => t.status === "completed").length;
      const total = memberTasks.length;
      return {
        member,
        total,
        completed,
        percentage: total > 0 ? (completed / total) * 100 : 0,
      };
    }).filter((stat) => stat.total > 0)
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 5);

    return memberStats;
  }, [tasks, teamMembers]);

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Tasks"
            value={stats.total}
            color={COLORS.todo}
            icon={<AssignmentIcon />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Completed"
            value={stats.completed}
            total={stats.total}
            color={COLORS.completed}
            icon={<CheckCircleIcon />}
            showProgress
            trend={{ value: 12, direction: "up" }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="In Progress"
            value={stats.inProgress}
            color={COLORS.in_progress}
            icon={<PlayCircleIcon />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Overdue"
            value={stats.overdue}
            color={COLORS.high}
            icon={<WarningIcon />}
            trend={stats.overdue > 0 ? { value: 8, direction: "down" } : undefined}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Due Soon"
            value={stats.dueSoon}
            color={COLORS.medium}
            icon={<AccessTimeIcon />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="High Priority"
            value={stats.byPriority.high}
            color={COLORS.high}
            icon={<PriorityHighIcon />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="On Hold"
            value={stats.byStatus.on_hold}
            color={COLORS.on_hold}
            icon={<PauseCircleIcon />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Completion Rate
              </Typography>
              <Typography variant="h4" component="div" fontWeight="bold">
                {stats.total > 0 ? ((stats.completed / stats.total) * 100).toFixed(1) : 0}%
              </Typography>
              <LinearProgress
                variant="determinate"
                value={stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}
                sx={{
                  mt: 1,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: "grey.200",
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 4,
                    backgroundColor: COLORS.completed,
                  },
                }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Tasks by Priority
              </Typography>
              <Box sx={{ height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={priorityChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {priorityChartData.map((entry, index) => (
                        <Cell key={`priority-cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Tasks by Status
              </Typography>
              <Box sx={{ height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statusChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip />
                    <Bar dataKey="value" fill="#8884d8">
                      {statusChartData.map((entry, index) => (
                        <Cell key={`status-cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {teamProductivity.length > 0 && (
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Team Productivity
                </Typography>
                <Stack spacing={2}>
                  {teamProductivity.map((stat) => (
                    <Box
                      key={stat.member.id}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        p: 2,
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 1,
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar
                          src={stat.member.picture?.thumbnail}
                          sx={{ width: 40, height: 40 }}
                        >
                          {stat.member.name.first[0]}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {stat.member.name.first} {stat.member.name.last}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {stat.completed} of {stat.total} tasks completed
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Box sx={{ width: 100 }}>
                          <LinearProgress
                            variant="determinate"
                            value={stat.percentage}
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              backgroundColor: "grey.200",
                              "& .MuiLinearProgress-bar": {
                                borderRadius: 4,
                                backgroundColor: COLORS.completed,
                              },
                            }}
                          />
                        </Box>
                        <Typography variant="body2" fontWeight="bold" sx={{ minWidth: 45 }}>
                          {stat.percentage.toFixed(1)}%
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
