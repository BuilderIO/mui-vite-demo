import * as React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  Button,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  IconButton,
  Badge,
} from '@mui/material';
import {
  Add as AddIcon,
  Assignment as AssignmentIcon,
  PlayArrow as PlayArrowIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  ArrowForward as ArrowForwardIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Task, TaskStatus } from '../types/taskTypes';
import { 
  getPriorityColor, 
  getStatusColor, 
  isTaskOverdue, 
  isTaskDueSoon,
  formatTaskStatus,
  formatTaskPriority
} from '../data/taskData';

interface CrmTasksWidgetProps {
  tasks: Task[];
  onCreateTask: () => void;
  maxTasks?: number;
}

function TaskItem({ task }: { task: Task }) {
  const navigate = useNavigate();
  const isOverdue = isTaskOverdue(task);
  const isDueSoon = isTaskDueSoon(task);

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon fontSize="small" color="success" />;
      case 'in_progress':
        return <PlayArrowIcon fontSize="small" color="primary" />;
      default:
        return <AssignmentIcon fontSize="small" color="action" />;
    }
  };

  const formatDueDate = (dueDate?: string) => {
    if (!dueDate) return null;
    
    const date = new Date(dueDate);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return `${Math.abs(diffDays)} days overdue`;
    } else if (diffDays === 0) {
      return 'Due today';
    } else if (diffDays === 1) {
      return 'Due tomorrow';
    } else {
      return `Due in ${diffDays} days`;
    }
  };

  return (
    <ListItem
      sx={{
        px: 0,
        py: 1,
        border: isOverdue ? '1px solid' : 'none',
        borderColor: 'error.main',
        borderRadius: 1,
        backgroundColor: isOverdue ? 'error.50' : 'transparent',
        mb: 1,
      }}
    >
      <ListItemAvatar>
        <Avatar
          sx={{
            bgcolor: isOverdue ? 'error.main' : 'primary.main',
            width: 32,
            height: 32,
          }}
        >
          {getStatusIcon(task.status)}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Typography 
              variant="body2" 
              sx={{ 
                fontWeight: 500,
                flex: 1,
                textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                color: task.status === 'completed' ? 'text.secondary' : 'text.primary',
              }}
              noWrap
            >
              {task.title}
            </Typography>
            <Chip
              label={formatTaskPriority(task.priority)}
              size="small"
              sx={{
                backgroundColor: getPriorityColor(task.priority),
                color: 'white',
                fontWeight: 500,
                fontSize: '0.65rem',
                height: 20,
              }}
            />
          </Box>
        }
        secondary={
          <Stack direction="row" spacing={1} alignItems="center">
            {task.assignee && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Avatar
                  src={task.assignee.avatar}
                  sx={{ width: 16, height: 16 }}
                >
                  {task.assignee.name.split(' ').map(n => n[0]).join('')}
                </Avatar>
                <Typography variant="caption" color="text.secondary">
                  {task.assignee.name.split(' ')[0]}
                </Typography>
              </Box>
            )}
            {task.dueDate && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
                {isOverdue ? (
                  <WarningIcon sx={{ fontSize: 12, color: 'error.main' }} />
                ) : (
                  <TimeIcon sx={{ fontSize: 12, color: 'text.secondary' }} />
                )}
                <Typography 
                  variant="caption" 
                  sx={{
                    color: isOverdue ? 'error.main' : isDueSoon ? 'warning.main' : 'text.secondary',
                    fontWeight: isOverdue || isDueSoon ? 600 : 400,
                  }}
                >
                  {formatDueDate(task.dueDate)}
                </Typography>
              </Box>
            )}
          </Stack>
        }
      />
    </ListItem>
  );
}

export default function CrmTasksWidget({ 
  tasks, 
  onCreateTask, 
  maxTasks = 5 
}: CrmTasksWidgetProps) {
  const navigate = useNavigate();

  // Filter and sort tasks for the widget
  const displayTasks = React.useMemo(() => {
    // Get incomplete tasks first
    const incompleteTasks = tasks.filter(task => task.status !== 'completed');
    
    // Sort by priority (high first), then by due date, then by overdue status
    const sortedTasks = incompleteTasks.sort((a, b) => {
      // First sort by overdue status
      const aOverdue = isTaskOverdue(a);
      const bOverdue = isTaskOverdue(b);
      if (aOverdue && !bOverdue) return -1;
      if (!aOverdue && bOverdue) return 1;
      
      // Then by due soon status
      const aDueSoon = isTaskDueSoon(a);
      const bDueSoon = isTaskDueSoon(b);
      if (aDueSoon && !bDueSoon) return -1;
      if (!aDueSoon && bDueSoon) return 1;
      
      // Then by priority
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      // Finally by due date
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      if (a.dueDate) return -1;
      if (b.dueDate) return 1;
      
      return 0;
    });

    return sortedTasks.slice(0, maxTasks);
  }, [tasks, maxTasks]);

  const taskCounts = React.useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const inProgress = tasks.filter(t => t.status === 'in_progress').length;
    const overdue = tasks.filter(isTaskOverdue).length;
    
    return { total, completed, inProgress, overdue };
  }, [tasks]);

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Stack spacing={2}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AssignmentIcon color="primary" />
              <Typography variant="h6">
                Tasks Overview
              </Typography>
            </Box>
            <IconButton
              size="small"
              onClick={() => navigate('/tasks')}
              color="primary"
            >
              <ArrowForwardIcon />
            </IconButton>
          </Box>

          {/* Quick Stats */}
          <Stack direction="row" spacing={1} justifyContent="space-between">
            <Chip
              label={`${taskCounts.total} Total`}
              size="small"
              variant="outlined"
              color="default"
            />
            <Chip
              label={`${taskCounts.inProgress} Active`}
              size="small"
              variant="outlined"
              color="primary"
            />
            <Chip
              label={`${taskCounts.completed} Done`}
              size="small"
              variant="outlined"
              color="success"
            />
            {taskCounts.overdue > 0 && (
              <Badge badgeContent={taskCounts.overdue} color="error">
                <Chip
                  label="Overdue"
                  size="small"
                  variant="outlined"
                  color="error"
                />
              </Badge>
            )}
          </Stack>

          <Divider />

          {/* Task List */}
          {displayTasks.length > 0 ? (
            <List sx={{ p: 0, maxHeight: 300, overflow: 'auto' }}>
              {displayTasks.map((task) => (
                <TaskItem key={task.id} task={task} />
              ))}
            </List>
          ) : (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: 4,
                color: 'text.secondary',
              }}
            >
              <AssignmentIcon sx={{ fontSize: 48, mb: 1 }} />
              <Typography variant="body2" textAlign="center">
                All tasks completed!
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Great job staying on top of your work.
              </Typography>
            </Box>
          )}

          {/* Action Buttons */}
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onCreateTask}
              size="small"
              fullWidth
            >
              New Task
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/tasks')}
              size="small"
              fullWidth
            >
              View All
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
