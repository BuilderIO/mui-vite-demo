import * as React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  LinearProgress,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  CalendarToday as CalendarIcon,
  Flag as FlagIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';
import { Task, TaskStatus } from '../../types/TaskTypes';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

interface TaskCardProps {
  task: Task;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const priorityColors = {
  High: { color: '#f44336', bg: '#ffebee' },
  Medium: { color: '#ff9800', bg: '#fff3e0' },
  Low: { color: '#4caf50', bg: '#e8f5e9' },
};

const statusColors = {
  'Not Started': { color: '#757575', bg: '#f5f5f5' },
  'In Progress': { color: '#2196f3', bg: '#e3f2fd' },
  'Completed': { color: '#4caf50', bg: '#e8f5e9' },
  'On Hold': { color: '#ff9800', bg: '#fff3e0' },
};

const statusProgress = {
  'Not Started': 0,
  'In Progress': 50,
  'Completed': 100,
  'On Hold': 25,
};

export default function TaskCard({ task, onStatusChange, onEdit, onDelete }: TaskCardProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleStatusChange = (status: TaskStatus) => {
    onStatusChange(task.id, status);
    handleMenuClose();
  };

  const isOverdue = task.dueDate && task.dueDate < new Date() && task.status !== 'Completed';
  const isDueToday = task.dueDate && dayjs(task.dueDate).isSame(dayjs(), 'day');
  const isDueTomorrow = task.dueDate && dayjs(task.dueDate).isSame(dayjs().add(1, 'day'), 'day');

  const getDueDateColor = () => {
    if (isOverdue) return '#f44336';
    if (isDueToday) return '#ff9800';
    if (isDueTomorrow) return '#2196f3';
    return 'text.secondary';
  };

  const getDueDateText = () => {
    if (!task.dueDate) return null;
    if (isOverdue) return `Overdue by ${dayjs().diff(dayjs(task.dueDate), 'day')} days`;
    if (isDueToday) return 'Due today';
    if (isDueTomorrow) return 'Due tomorrow';
    return `Due ${dayjs(task.dueDate).format('MMM D, YYYY')}`;
  };

  return (
    <Card
      sx={{
        mb: 2,
        border: isOverdue ? '2px solid #f44336' : '1px solid',
        borderColor: isOverdue ? '#f44336' : 'divider',
        borderLeft: `4px solid ${priorityColors[task.priority].color}`,
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 3,
        },
      }}
    >
      <CardContent sx={{ pb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ flex: 1, mr: 2 }}>
            <Typography variant="h6" component="h3" sx={{ mb: 1, lineHeight: 1.3 }}>
              {task.title}
            </Typography>
            {task.description && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {task.description}
              </Typography>
            )}
          </Box>
          <IconButton size="small" onClick={handleMenuClick}>
            <MoreVertIcon />
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          <Chip
            label={task.priority}
            size="small"
            icon={<FlagIcon sx={{ fontSize: '16px !important' }} />}
            sx={{
              bgcolor: priorityColors[task.priority].bg,
              color: priorityColors[task.priority].color,
              fontWeight: 600,
            }}
          />
          <Chip
            label={task.status}
            size="small"
            sx={{
              bgcolor: statusColors[task.status].bg,
              color: statusColors[task.status].color,
              fontWeight: 500,
            }}
          />
          {task.dueDate && (
            <Chip
              label={getDueDateText()}
              size="small"
              icon={isOverdue ? <TimeIcon sx={{ fontSize: '16px !important' }} /> : <CalendarIcon sx={{ fontSize: '16px !important' }} />}
              sx={{
                color: getDueDateColor(),
                fontWeight: isOverdue || isDueToday ? 600 : 400,
              }}
              variant={isOverdue ? 'filled' : 'outlined'}
            />
          )}
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
            Progress
          </Typography>
          <LinearProgress
            variant="determinate"
            value={statusProgress[task.status]}
            sx={{
              height: 6,
              borderRadius: 3,
              backgroundColor: 'grey.200',
              '& .MuiLinearProgress-bar': {
                backgroundColor: statusColors[task.status].color,
                borderRadius: 3,
              },
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar
              sx={{
                width: 28,
                height: 28,
                bgcolor: 'primary.main',
                fontSize: '0.75rem',
                fontWeight: 600,
              }}
            >
              {task.assigneeName.split(' ').map(n => n[0]).join('')}
            </Avatar>
            <Typography variant="body2" color="text.secondary">
              {task.assigneeName}
            </Typography>
          </Box>
          <Tooltip title={`Created ${dayjs(task.createdAt).fromNow()}`}>
            <Typography variant="caption" color="text.secondary">
              {dayjs(task.updatedAt).fromNow()}
            </Typography>
          </Tooltip>
        </Box>
      </CardContent>

      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={() => onEdit(task)}>Edit Task</MenuItem>
        <MenuItem divider>Change Status:</MenuItem>
        {['Not Started', 'In Progress', 'On Hold', 'Completed'].map((status) => (
          <MenuItem
            key={status}
            onClick={() => handleStatusChange(status as TaskStatus)}
            disabled={status === task.status}
            sx={{ pl: 3 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: statusColors[status as TaskStatus].color,
                }}
              />
              {status}
            </Box>
          </MenuItem>
        ))}
        <MenuItem divider />
        <MenuItem onClick={() => onDelete(task.id)} sx={{ color: 'error.main' }}>
          Delete Task
        </MenuItem>
      </Menu>
    </Card>
  );
}
