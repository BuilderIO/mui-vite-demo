import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Tooltip,
  LinearProgress,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Assignment as AssignmentIcon,
  Schedule as ScheduleIcon,
  Flag as FlagIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { Task, TaskStatus } from '../types/Task';
import { useTaskContext } from '../context/TaskContext';
import {
  getPriorityColor,
  getStatusColor,
  isTaskOverdue,
  isTaskDueToday,
  isTaskDueTomorrow,
  formatDueDate,
  getInitials,
} from '../utils/taskUtils';
import TaskCreateForm from './TaskCreateForm';

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  compact?: boolean;
}

export default function TaskCard({ task, onEdit, onDelete, compact = false }: TaskCardProps) {
  const { deleteTask, updateTaskStatus } = useTaskContext();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    setEditDialogOpen(true);
    handleMenuClose();
    if (onEdit) onEdit(task);
  };

  const handleDelete = () => {
    deleteTask(task.id);
    handleMenuClose();
    if (onDelete) onDelete(task.id);
  };

  const handleStatusChange = (newStatus: TaskStatus) => {
    updateTaskStatus(task.id, newStatus);
    handleMenuClose();
  };

  const isOverdue = isTaskOverdue(task);
  const isDueToday = isTaskDueToday(task);
  const isDueTomorrow = isTaskDueTomorrow(task);

  const getProgressPercentage = () => {
    if (!task.estimatedHours || !task.actualHours) return 0;
    return Math.min((task.actualHours / task.estimatedHours) * 100, 100);
  };

  const getDueDateChipColor = () => {
    if (isOverdue) return 'error';
    if (isDueToday) return 'warning';
    if (isDueTomorrow) return 'info';
    return 'default';
  };

  return (
    <>
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          borderLeft: `4px solid ${getPriorityColor(task.priority)}`,
          ...(isOverdue && {
            backgroundColor: 'rgba(244, 67, 54, 0.05)',
            borderColor: '#f44336',
          }),
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: 2,
            transform: 'translateY(-2px)',
          },
        }}
      >
        <CardContent sx={{ flexGrow: 1, pb: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
            <Typography
              variant={compact ? 'body2' : 'h6'}
              component="h3"
              sx={{
                fontWeight: 600,
                lineHeight: 1.2,
                textDecoration: task.status === 'Completed' ? 'line-through' : 'none',
                opacity: task.status === 'Completed' ? 0.7 : 1,
              }}
            >
              {task.title}
            </Typography>
            
            <IconButton
              size="small"
              onClick={handleMenuOpen}
              sx={{ ml: 1, flexShrink: 0 }}
            >
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Box>

          {!compact && task.description && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 2,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {task.description}
            </Typography>
          )}

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            <Chip
              size="small"
              label={task.priority}
              sx={{
                backgroundColor: getPriorityColor(task.priority),
                color: 'white',
                fontWeight: 500,
              }}
              icon={<FlagIcon sx={{ color: 'white !important' }} />}
            />
            
            <Chip
              size="small"
              label={task.status}
              variant="outlined"
              sx={{
                borderColor: getStatusColor(task.status),
                color: getStatusColor(task.status),
              }}
            />

            {task.dueDate && (
              <Chip
                size="small"
                label={formatDueDate(task.dueDate)}
                color={getDueDateChipColor()}
                variant={isOverdue ? 'filled' : 'outlined'}
                icon={<ScheduleIcon />}
              />
            )}
          </Box>

          {task.tags.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
              {task.tags.slice(0, compact ? 2 : 5).map((tag) => (
                <Chip
                  key={tag}
                  size="small"
                  label={tag}
                  variant="outlined"
                  sx={{ fontSize: '0.75rem', height: '20px' }}
                />
              ))}
              {task.tags.length > (compact ? 2 : 5) && (
                <Chip
                  size="small"
                  label={`+${task.tags.length - (compact ? 2 : 5)}`}
                  variant="outlined"
                  sx={{ fontSize: '0.75rem', height: '20px' }}
                />
              )}
            </Box>
          )}

          {task.estimatedHours && task.actualHours !== undefined && (
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="caption" color="text.secondary">
                  Progress
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {task.actualHours}h / {task.estimatedHours}h
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={getProgressPercentage()}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: 'grey.200',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: task.status === 'Completed' ? '#4caf50' : '#2196f3',
                  },
                }}
              />
            </Box>
          )}
        </CardContent>

        <CardActions sx={{ pt: 0, px: 2, pb: 2, justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {task.assignee ? (
              <Tooltip title={`Assigned to ${task.assignee.name}`}>
                <Avatar
                  src={task.assignee.avatar}
                  sx={{ width: 32, height: 32, fontSize: '0.875rem' }}
                >
                  {getInitials(task.assignee.name)}
                </Avatar>
              </Tooltip>
            ) : (
              <Tooltip title="Unassigned">
                <Avatar sx={{ width: 32, height: 32, backgroundColor: 'grey.300' }}>
                  <PersonIcon fontSize="small" sx={{ color: 'grey.600' }} />
                </Avatar>
              </Tooltip>
            )}
          </Box>

          <Typography variant="caption" color="text.secondary">
            Created {new Date(task.createdAt).toLocaleDateString()}
          </Typography>
        </CardActions>
      </Card>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { minWidth: 160 }
        }}
      >
        <MenuItem onClick={handleEdit}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Edit Task
        </MenuItem>
        
        {task.status !== 'In Progress' && (
          <MenuItem onClick={() => handleStatusChange('In Progress')}>
            <AssignmentIcon fontSize="small" sx={{ mr: 1 }} />
            Start Task
          </MenuItem>
        )}
        
        {task.status !== 'Completed' && (
          <MenuItem onClick={() => handleStatusChange('Completed')}>
            <AssignmentIcon fontSize="small" sx={{ mr: 1 }} />
            Mark Complete
          </MenuItem>
        )}
        
        {task.status !== 'On Hold' && (
          <MenuItem onClick={() => handleStatusChange('On Hold')}>
            <AssignmentIcon fontSize="small" sx={{ mr: 1 }} />
            Put On Hold
          </MenuItem>
        )}
        
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete Task
        </MenuItem>
      </Menu>

      <TaskCreateForm
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        initialTask={task}
        mode="edit"
      />
    </>
  );
}
