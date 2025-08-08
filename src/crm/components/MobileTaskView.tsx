import * as React from "react";
import {
  Box,
  Stack,
  Typography,
  Button,
  Chip,
  Grid,
  Fab,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Add as AddIcon,
  Filter as FilterIcon,
} from "@mui/icons-material";
import { Task, TaskFilters, TeamMember } from "../types/taskTypes";
import { calculateTaskStats } from "../utils/taskUtils";
import TaskSummaryCard from "./TaskSummaryCard";
import TaskFiltersComponent from "./TaskFilters";

interface MobileTaskViewProps {
  tasks: Task[];
  filters: TaskFilters;
  onFiltersChange: (filters: TaskFilters) => void;
  onEditTask: (task: Task) => void;
  onCreateTask: () => void;
  onStatusChange: (task: Task, newStatus: Task['status']) => void;
  teamMembers: TeamMember[];
}

export default function MobileTaskView({
  tasks,
  filters,
  onFiltersChange,
  onEditTask,
  onCreateTask,
  onStatusChange,
  teamMembers,
}: MobileTaskViewProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [showFilters, setShowFilters] = React.useState(false);

  const stats = calculateTaskStats(tasks);

  if (!isMobile) return null;

  return (
    <Box sx={{ p: 2, pb: 10 }}>
      {/* Quick Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6}>
          <Box
            sx={{
              p: 2,
              bgcolor: "primary.light",
              borderRadius: 2,
              textAlign: "center",
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 600, color: "primary.contrastText" }}>
              {stats.total}
            </Typography>
            <Typography variant="body2" sx={{ color: "primary.contrastText" }}>
              Total Tasks
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box
            sx={{
              p: 2,
              bgcolor: "success.light",
              borderRadius: 2,
              textAlign: "center",
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 600, color: "success.contrastText" }}>
              {stats.completed}
            </Typography>
            <Typography variant="body2" sx={{ color: "success.contrastText" }}>
              Completed
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box
            sx={{
              p: 2,
              bgcolor: "info.light",
              borderRadius: 2,
              textAlign: "center",
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 600, color: "info.contrastText" }}>
              {stats.inProgress}
            </Typography>
            <Typography variant="body2" sx={{ color: "info.contrastText" }}>
              In Progress
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box
            sx={{
              p: 2,
              bgcolor: stats.overdue > 0 ? "error.light" : "grey.200",
              borderRadius: 2,
              textAlign: "center",
            }}
          >
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 600, 
                color: stats.overdue > 0 ? "error.contrastText" : "text.primary" 
              }}
            >
              {stats.overdue}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: stats.overdue > 0 ? "error.contrastText" : "text.secondary" 
              }}
            >
              Overdue
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Filter Button */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h6">
          Tasks ({tasks.length})
        </Typography>
        <Button
          variant="outlined"
          size="small"
          startIcon={<FilterIcon />}
          onClick={() => setShowFilters(!showFilters)}
        >
          Filters
        </Button>
      </Box>

      {/* Filters */}
      {showFilters && (
        <Box sx={{ mb: 3 }}>
          <TaskFiltersComponent
            filters={filters}
            onFiltersChange={onFiltersChange}
            teamMembers={teamMembers}
            collapsed={false}
          />
        </Box>
      )}

      {/* Task List */}
      <Stack spacing={2}>
        {tasks.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: 6,
              bgcolor: "background.paper",
              borderRadius: 2,
              border: 1,
              borderColor: "divider",
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No tasks found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {tasks.length === 0 
                ? "Create your first task to get started"
                : "Try adjusting your filters"
              }
            </Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={onCreateTask}>
              Create Task
            </Button>
          </Box>
        ) : (
          tasks.map((task) => (
            <TaskSummaryCard
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onStatusChange={onStatusChange}
            />
          ))
        )}
      </Stack>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add task"
        onClick={onCreateTask}
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 1000,
        }}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
}
