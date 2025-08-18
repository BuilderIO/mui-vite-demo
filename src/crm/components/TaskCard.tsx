import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import FlagIcon from '@mui/icons-material/Flag';
import type { Task, TaskPriority, TaskStatus } from '../types/taskTypes';

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onStatusChange?: (taskId: string, status: TaskStatus) => void;
  onAssigneeChange?: (taskId: string, assigneeId: string) => void;
}

const getPriorityColor = (priority: TaskPriority): 'error' | 'warning' | 'default' => {
  switch (priority) {
    case 'high':
      return 'error';
    case 'medium':
      return 'warning';
    default:
      return 'default';
  }
};

const getStatusColor = (status: TaskStatus): 'default' | 'primary' | 'success' | 'warning' => {
  switch (status) {
    case 'todo':
      return 'default';
    case 'in_progress':
      return 'primary';
    case 'completed':
      return 'success';
    case 'on_hold':
      return 'warning';
    default:
      return 'default';
  }
};

const getStatusLabel = (status: TaskStatus): string => {
  switch (status) {
    case 'todo':
      return 'To Do';
    case 'in_progress':
      return 'In Progress';
    case 'completed':
      return 'Completed';
    case 'on_hold':
      return 'On Hold';
    default:
      return status;
  }
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Tomorrow';
  } else if (diffDays === -1) {
    return 'Yesterday';
  } else if (diffDays > 0) {
    return `In ${diffDays} days`;
  } else {
    return `${Math.abs(diffDays)} days ago`;
  }
};

const isOverdue = (dueDate: string, status: TaskStatus): boolean => {
  if (status === 'completed') return false;
  return new Date(dueDate) < new Date();
};

export default function TaskCard({
  task,
  onEdit,
  onDelete,
  onStatusChange,
  onAssigneeChange
}: TaskCardProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    onEdit?.(task);
    handleMenuClose();
  };

  const handleDelete = () => {
    onDelete?.(task.id);
    handleMenuClose();
  };

  const handleStatusChange = (newStatus: TaskStatus) => {
    onStatusChange?.(task.id, newStatus);
    handleMenuClose();
  };

  const overdue = task.dueDate && isOverdue(task.dueDate, task.status);

  return (
    <Card
      variant="outlined"
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: 2,
          transform: 'translateY(-2px)'
        },
        ...(overdue && {
          borderColor: 'error.main',
          borderWidth: 2
        })
      }}
    >
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        {/* Header with title and menu */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography
            variant="h6"
            component="h3"
            sx={{
              fontSize: '1rem',
              fontWeight: 600,
              lineHeight: 1.3,
              flex: 1,
              mr: 1,
              ...(task.status === 'completed' && {
                textDecoration: 'line-through',
                color: 'text.secondary'
              })
            }}
          >
            {task.title}
          </Typography>
          <IconButton
            size="small"
            onClick={handleMenuClick}
            aria-label="Task options"
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Description */}
        {task.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2, lineHeight: 1.4 }}
          >
            {task.description}
          </Typography>
        )}

        {/* Status and Priority chips */}
        <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 0.5 }}>
          <Chip
            label={getStatusLabel(task.status)}
            size="small"
            color={getStatusColor(task.status)}
            variant="outlined"
          />
          <Chip
            icon={<FlagIcon />}
            label={task.priority}
            size="small"
            color={getPriorityColor(task.priority)}
            variant="outlined"
          />
          {overdue && (
            <Chip
              label="Overdue"
              size="small"
              color="error"
              variant="filled"
            />
          )}
        </Stack>

        {/* Assignee */}
        {task.assignee && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <PersonIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
            <Avatar
              sx={{ width: 24, height: 24, mr: 1, fontSize: '0.75rem' }}
              src={task.assignee.avatar}
            >
              {task.assignee.name.first[0]}{task.assignee.name.last[0]}
            </Avatar>
            <Typography variant="body2" color="text.secondary">
              {task.assignee.name.first} {task.assignee.name.last}
            </Typography>
          </Box>
        )}

        {/* Due date */}
        {task.dueDate && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <CalendarTodayIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography
              variant="body2"
              color={overdue ? 'error.main' : 'text.secondary'}
              fontWeight={overdue ? 600 : 400}
            >
              {formatDate(task.dueDate)}
            </Typography>
          </Box>
        )}

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <Stack direction="row" spacing={0.5} sx={{ mt: 1, flexWrap: 'wrap', gap: 0.5 }}>
            {task.tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                variant="outlined"
                sx={{ 
                  height: 20,
                  '& .MuiChip-label': { px: 1, py: 0, fontSize: '0.75rem' }
                }}
              />
            ))}
          </Stack>
        )}
      </CardContent>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleEdit}>Edit Task</MenuItem>
        <MenuItem onClick={() => handleStatusChange('todo')}>
          Mark as To Do
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange('in_progress')}>
          Mark as In Progress
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange('completed')}>
          Mark as Completed
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange('on_hold')}>
          Mark as On Hold
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          Delete Task
        </MenuItem>
      </Menu>
    </Card>
  );
}
