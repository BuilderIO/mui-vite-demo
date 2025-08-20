import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import LinearProgress from "@mui/material/LinearProgress";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import { PieChart } from "@mui/x-charts/PieChart";
import AssignmentIcon from "@mui/icons-material/Assignment";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";

// Analytics data interface
interface TaskAnalytics {
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  inProgressTasks: number;
  completionRate: number;
  productivityTrend: number;
  priorityDistribution: { label: string; value: number; color: string }[];
  statusDistribution: { label: string; value: number; color: string }[];
  teamPerformance: { name: string; avatar: string; tasksCompleted: number; completionRate: number }[];
}

// Sample analytics data
const analyticsData: TaskAnalytics = {
  totalTasks: 45,
  completedTasks: 32,
  overdueTasks: 5,
  inProgressTasks: 8,
  completionRate: 71,
  productivityTrend: 12,
  priorityDistribution: [
    { label: "High", value: 15, color: "#f44336" },
    { label: "Medium", value: 20, color: "#ff9800" },
    { label: "Low", value: 10, color: "#4caf50" },
  ],
  statusDistribution: [
    { label: "Completed", value: 32, color: "#4caf50" },
    { label: "In Progress", value: 8, color: "#2196f3" },
    { label: "Pending", value: 0, color: "#9e9e9e" },
    { label: "On Hold", value: 5, color: "#ff9800" },
  ],
  teamPerformance: [
    { name: "Alex Thompson", avatar: "/static/images/avatar/1.jpg", tasksCompleted: 12, completionRate: 85 },
    { name: "Sarah Johnson", avatar: "/static/images/avatar/2.jpg", tasksCompleted: 8, completionRate: 92 },
    { name: "Mike Chen", avatar: "/static/images/avatar/3.jpg", tasksCompleted: 7, completionRate: 78 },
    { name: "Emily Davis", avatar: "/static/images/avatar/4.jpg", tasksCompleted: 5, completionRate: 65 },
  ],
};

const MetricCard: React.FC<{
  title: string;
  value: number | string;
  icon: React.ReactNode;
  trend?: number;
  color?: string;
}> = ({ title, value, icon, trend, color = "primary" }) => (
  <Card>
    <CardContent>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <Box>
          <Typography color="text.secondary" gutterBottom variant="body2">
            {title}
          </Typography>
          <Typography variant="h4" component="div">
            {value}
          </Typography>
          {trend !== undefined && (
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1 }}>
              <TrendingUpIcon 
                sx={{ 
                  fontSize: 16, 
                  color: trend >= 0 ? "success.main" : "error.main",
                  transform: trend < 0 ? "rotate(180deg)" : "none"
                }} 
              />
              <Typography 
                variant="caption" 
                color={trend >= 0 ? "success.main" : "error.main"}
              >
                {Math.abs(trend)}% from last month
              </Typography>
            </Stack>
          )}
        </Box>
        <Box
          sx={{
            p: 1,
            borderRadius: 1,
            bgcolor: `${color}.light`,
            color: `${color}.main`,
          }}
        >
          {icon}
        </Box>
      </Stack>
    </CardContent>
  </Card>
);

export default function CrmTasksAnalytics() {
  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h6" component="h2" sx={{ mb: 3 }}>
        Task Management Overview
      </Typography>
      
      <Grid container spacing={3}>
        {/* Key Metrics */}
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Tasks"
            value={analyticsData.totalTasks}
            icon={<AssignmentIcon />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Completed"
            value={analyticsData.completedTasks}
            icon={<AssignmentTurnedInIcon />}
            trend={analyticsData.productivityTrend}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="In Progress"
            value={analyticsData.inProgressTasks}
            icon={<AccessTimeIcon />}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Overdue"
            value={analyticsData.overdueTasks}
            icon={<AccessTimeIcon />}
            color="error"
          />
        </Grid>

        {/* Completion Rate Progress */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" component="h3" gutterBottom>
                Overall Completion Rate
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" color="text.secondary">
                    Progress
                  </Typography>
                  <Typography variant="h5" color="success.main">
                    {analyticsData.completionRate}%
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={analyticsData.completionRate}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    mt: 1,
                    "& .MuiLinearProgress-bar": {
                      borderRadius: 4,
                    },
                  }}
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                {analyticsData.completedTasks} of {analyticsData.totalTasks} tasks completed
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Priority Distribution Chart */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" component="h3" gutterBottom>
                Tasks by Priority
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <PieChart
                  series={[
                    {
                      data: analyticsData.priorityDistribution.map((item, index) => ({
                        id: index,
                        value: item.value,
                        label: item.label,
                        color: item.color,
                      })),
                    },
                  ]}
                  width={300}
                  height={200}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Team Performance */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h3" gutterBottom>
                Team Performance
              </Typography>
              <Stack spacing={2}>
                {analyticsData.teamPerformance.map((member, index) => (
                  <Box key={index}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ mb: 1 }}
                    >
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar src={member.avatar} sx={{ width: 32, height: 32 }}>
                          {member.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {member.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {member.tasksCompleted} tasks completed
                          </Typography>
                        </Box>
                      </Stack>
                      <Typography variant="body2" color="success.main" fontWeight="medium">
                        {member.completionRate}%
                      </Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={member.completionRate}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: "grey.200",
                        "& .MuiLinearProgress-bar": {
                          borderRadius: 3,
                        },
                      }}
                    />
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Status Overview */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" component="h3" gutterBottom>
                Task Status
              </Typography>
              <Stack spacing={2} sx={{ mt: 2 }}>
                {analyticsData.statusDistribution.map((status, index) => (
                  <Stack
                    key={index}
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                          bgcolor: status.color,
                        }}
                      />
                      <Typography variant="body2">{status.label}</Typography>
                    </Stack>
                    <Chip
                      label={status.value}
                      size="small"
                      variant="outlined"
                      sx={{
                        borderColor: status.color,
                        color: status.color,
                      }}
                    />
                  </Stack>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h3" gutterBottom>
                Team Activity
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  Active team members:
                </Typography>
                <AvatarGroup max={4}>
                  {analyticsData.teamPerformance.map((member, index) => (
                    <Avatar
                      key={index}
                      src={member.avatar}
                      sx={{ width: 32, height: 32 }}
                    >
                      {member.name.charAt(0)}
                    </Avatar>
                  ))}
                </AvatarGroup>
                <Typography variant="body2" color="text.secondary">
                  Working on {analyticsData.inProgressTasks} tasks
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
