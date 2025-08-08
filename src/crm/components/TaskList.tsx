import * as React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  Avatar,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  LinearProgress,
  Alert,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AccessTime as TimeIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon,
  NotStarted as NotStartedIcon,
} from '@mui/icons-material';
import { Task, TaskPriority, TaskStatus } from '../types/taskTypes';
import { 
  getPriorityColor, 
  getStatusColor, 
  isTaskOverdue, 
  isTaskDueSoon,
  formatTaskStatus,
  formatTaskPriority
} from '../data/taskData';

interface TaskListProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onUpdateTaskStatus: (taskId: string, status: TaskStatus) => void;
}

interface TaskItemProps {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
  onUpdateStatus: (status: TaskStatus) => void;
}

function TaskItem({ task, onEdit, onDelete, onUpdateStatus }: TaskItemProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case 'not_started':
        return <NotStartedIcon fontSize="small" />;
      case 'in_progress':
        return <PlayArrowIcon fontSize="small" />;
      case 'completed':
        return <CheckCircleIcon fontSize="small" />;
      case 'on_hold':
        return <PauseIcon fontSize="small" />;
      default:
        return <NotStartedIcon fontSize="small" />;
    }
  };

  const formatDueDate = (dueDate?: string) => {
    if (!dueDate) return null;
    
    const date = new Date(dueDate);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return {
        text: `${Math.abs(diffDays)} days overdue`,
        color: 'error.main',
        icon: <WarningIcon fontSize="small" />
      };
    } else if (diffDays === 0) {
      return {
        text: 'Due today',
        color: 'warning.main',
        icon: <TimeIcon fontSize="small" />
      };
    } else if (diffDays === 1) {
      return {
        text: 'Due tomorrow',
        color: 'warning.main',
        icon: <TimeIcon fontSize="small" />
      };
    } else {
      return {
        text: `Due in ${diffDays} days`,
        color: 'text.secondary',
        icon: <TimeIcon fontSize="small" />
      };
    }
  };

  const dueDateInfo = formatDueDate(task.dueDate);
  const isOverdue = isTaskOverdue(task);
  const isDueSoon = isTaskDueSoon(task);

  return (
    <Card 
      sx={{ 
        mb: 2,
        border: isOverdue ? '2px solid' : '1px solid',
        borderColor: isOverdue ? 'error.main' : 'divider',
        backgroundColor: isOverdue ? 'error.50' : 'background.paper',
      }}
    >
      <CardContent>
        <Stack spacing={2}>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" component="h3" sx={{ mb: 0.5 }}>
                {task.title}
              </Typography>
              {task.description && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {task.description}
                </Typography>
              )}
            </Box>
            <IconButton onClick={handleMenuClick} size="small">
              <MoreVertIcon />
            </IconButton>
          </Box>

          {/* Task Details */}
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
            {/* Priority Chip */}
            <Chip
              label={formatTaskPriority(task.priority)}
              size="small"
              sx={{
                backgroundColor: getPriorityColor(task.priority),
                color: 'white',
                fontWeight: 500,
              }}
            />

            {/* Status Chip */}
            <Chip
              icon={getStatusIcon(task.status)}
              label={formatTaskStatus(task.status)}
              size="small"
              variant="outlined"
              sx={{
                borderColor: getStatusColor(task.status),
                color: getStatusColor(task.status),
              }}
            />

            {/* Due Date */}
            {dueDateInfo && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {dueDateInfo.icon}
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: dueDateInfo.color,
                    fontWeight: isOverdue || isDueSoon ? 600 : 400
                  }}
                >
                  {dueDateInfo.text}
                </Typography>
              </Box>
            )}
          </Stack>

          {/* Assignee */}
          {task.assignee && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar
                src={task.assignee.avatar}
                sx={{ width: 24, height: 24 }}
              >
                {task.assignee.name.split(' ').map(n => n[0]).join('')}
              </Avatar>
              <Typography variant="body2" color="text.secondary">
                Assigned to {task.assignee.name}
              </Typography>
            </Box>
          )}

          {/* Overdue Alert */}
          {isOverdue && (
            <Alert severity="error" sx={{ py: 0.5 }}>
              This task is overdue and requires immediate attention!
            </Alert>
          )}

          {/* Due Soon Alert */}
          {isDueSoon && !isOverdue && (
            <Alert severity="warning" sx={{ py: 0.5 }}>
              This task is due soon!
            </Alert>
          )}
        </Stack>
      </CardContent>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={() => { onEdit(); handleMenuClose(); }}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit Task</ListItemText>
        </MenuItem>
        
        {task.status !== 'not_started' && (
          <MenuItem onClick={() => { onUpdateStatus('not_started'); handleMenuClose(); }}>
            <ListItemIcon>
              <NotStartedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Mark as Not Started</ListItemText>
          </MenuItem>
        )}
        
        {task.status !== 'in_progress' && (
          <MenuItem onClick={() => { onUpdateStatus('in_progress'); handleMenuClose(); }}>
            <ListItemIcon>
              <PlayArrowIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Mark as In Progress</ListItemText>
          </MenuItem>
        )}
        
        {task.status !== 'completed' && (
          <MenuItem onClick={() => { onUpdateStatus('completed'); handleMenuClose(); }}>
            <ListItemIcon>
              <CheckCircleIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Mark as Completed</ListItemText>
          </MenuItem>
        )}
        
        {task.status !== 'on_hold' && (
          <MenuItem onClick={() => { onUpdateStatus('on_hold'); handleMenuClose(); }}>
            <ListItemIcon>
              <PauseIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Mark as On Hold</ListItemText>
          </MenuItem>
        )}
        
        <MenuItem onClick={() => { onDelete(); handleMenuClose(); }} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete Task</ListItemText>
        </MenuItem>
      </Menu>
    </Card>
  );
}

export default function TaskList({ tasks, onEditTask, onDeleteTask, onUpdateTaskStatus }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <Box 
        sx={{ 
          textAlign: 'center', 
          py: 8,
          color: 'text.secondary'
        }}
      >
        <Typography variant="h6" gutterBottom>
          No tasks found
        </Typography>
        <Typography variant="body2">
          Create your first task to get started with task management.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onEdit={() => onEditTask(task)}
          onDelete={() => onDeleteTask(task.id)}
          onUpdateStatus={(status) => onUpdateTaskStatus(task.id, status)}
        />
      ))}
    </Box>
  );
}
