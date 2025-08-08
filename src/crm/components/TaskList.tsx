import * as React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  LinearProgress,
  Grid,
  Alert,
  Tooltip,
  Badge,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Flag as FlagIcon,
  AccessTime as TimeIcon,
  CheckCircle as CheckCircleIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';

import { Task, TaskSortOptions, TaskStatus } from '../types/task';
import { 
  getPriorityColor, 
  getStatusColor, 
  isTaskOverdue, 
  formatDueDate, 
  getTaskCompletionPercentage 
} from '../utils/taskUtils';
import TaskCreateDialog from './TaskCreateDialog';

interface TaskListProps {
  tasks: Task[];
  onTaskUpdate: (task: Task) => void;
  onTaskDelete: (taskId: string) => void;
  sortOptions: TaskSortOptions;
  onSortChange: (sortOptions: TaskSortOptions) => void;
}

interface TaskCardProps {
  task: Task;
  onTaskUpdate: (task: Task) => void;
  onTaskDelete: (taskId: string) => void;
}

function TaskCard({ task, onTaskUpdate, onTaskDelete }: TaskCardProps) {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [statusChangeAnchor, setStatusChangeAnchor] = React.useState<null | HTMLElement>(null);

  const isOverdue = isTaskOverdue(task);
  const completionPercentage = getTaskCompletionPercentage(task);
  const priorityColor = getPriorityColor(task.priority);
  const statusColor = getStatusColor(task.status);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleStatusClick = (event: React.MouseEvent<HTMLElement>) => {
    setStatusChangeAnchor(event.currentTarget);
  };

  const handleStatusChange = (newStatus: TaskStatus) => {
    const updatedTask: Task = {
      ...task,
      status: newStatus,
      updatedAt: new Date(),
      statusHistory: [
        ...task.statusHistory,
        {
          id: Date.now().toString(),
          status: newStatus,
          changedBy: 'Current User',
          changedAt: new Date(),
        }
      ]
    };
    onTaskUpdate(updatedTask);
    setStatusChangeAnchor(null);
  };

  const handleEdit = () => {
    setEditDialogOpen(true);
    handleMenuClose();
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleEditSubmit = (taskData: Partial<Task>) => {
    const updatedTask: Task = {
      ...task,
      ...taskData,
      updatedAt: new Date(),
    };
    onTaskUpdate(updatedTask);
    setEditDialogOpen(false);
  };

  const confirmDelete = () => {
    onTaskDelete(task.id);
    setDeleteDialogOpen(false);
  };

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case 'Not Started':
        return <AssignmentIcon fontSize="small" />;
      case 'In Progress':
        return <PlayIcon fontSize="small" />;
      case 'On Hold':
        return <PauseIcon fontSize="small" />;
      case 'Completed':
        return <CheckCircleIcon fontSize="small" />;
      default:
        return <AssignmentIcon fontSize="small" />;
    }
  };

  return (
    <>
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderLeft: `4px solid ${theme.palette[priorityColor].main}`,
          transition: 'all 0.3s ease',
          position: 'relative',
          ...(isOverdue && {
            bgcolor: alpha(theme.palette.error.main, 0.05),
            border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
          }),
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: theme.shadows[4],
          },
        }}
      >
        {isOverdue && (
          <Alert
            severity="error"
            sx={{
              borderRadius: 0,
              '& .MuiAlert-message': { fontSize: '0.75rem' },
            }}
          >
            Task is overdue!
          </Alert>
        )}

        <CardContent sx={{ flexGrow: 1, pb: 1 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Typography
              variant="h6"
              component="h3"
              sx={{
                fontWeight: 600,
                fontSize: '1rem',
                lineHeight: 1.3,
                flexGrow: 1,
                mr: 1,
              }}
            >
              {task.title}
            </Typography>
            <IconButton size="small" onClick={handleMenuClick}>
              <MoreVertIcon />
            </IconButton>
          </Box>

          {/* Description */}
          {task.description && (
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

          {/* Priority and Status */}
          <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
            <Chip
              label={task.priority}
              color={priorityColor}
              size="small"
              icon={<FlagIcon />}
            />
            <Chip
              label={task.status}
              color={statusColor}
              size="small"
              icon={getStatusIcon(task.status)}
              onClick={handleStatusClick}
              sx={{ cursor: 'pointer' }}
            />
          </Box>

          {/* Progress Bar */}
          {task.status !== 'Not Started' && (
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Progress
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {Math.round(completionPercentage)}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={completionPercentage}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  bgcolor: alpha(theme.palette[priorityColor].main, 0.1),
                  '& .MuiLinearProgress-bar': {
                    bgcolor: theme.palette[priorityColor].main,
                    borderRadius: 3,
                  },
                }}
              />
            </Box>
          )}

          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                {task.tags.slice(0, 3).map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: '0.7rem', height: 20 }}
                  />
                ))}
                {task.tags.length > 3 && (
                  <Chip
                    label={`+${task.tags.length - 3}`}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: '0.7rem', height: 20 }}
                  />
                )}
              </Box>
            </Box>
          )}

          <Divider sx={{ my: 2 }} />

          {/* Footer */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {/* Assignee */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {task.assignee ? (
                <Tooltip title={`${task.assignee.name} (${task.assignee.role})`}>
                  <Avatar sx={{ width: 28, height: 28, fontSize: '0.75rem' }}>
                    {task.assignee.name.split(' ').map(n => n[0]).join('')}
                  </Avatar>
                </Tooltip>
              ) : (
                <Tooltip title="Unassigned">
                  <Avatar sx={{ width: 28, height: 28, bgcolor: 'grey.400' }}>
                    <PersonIcon fontSize="small" />
                  </Avatar>
                </Tooltip>
              )}
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  {task.assignee?.name || 'Unassigned'}
                </Typography>
                {task.estimatedHours && (
                  <Typography variant="caption" color="text.secondary" display="block">
                    <TimeIcon sx={{ fontSize: 10, mr: 0.5 }} />
                    {task.estimatedHours}h
                  </Typography>
                )}
              </Box>
            </Box>

            {/* Due Date */}
            {task.dueDate && (
              <Box sx={{ textAlign: 'right' }}>
                <Typography
                  variant="caption"
                  color={isOverdue ? 'error.main' : 'text.secondary'}
                  sx={{ display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'flex-end' }}
                >
                  <ScheduleIcon sx={{ fontSize: 12 }} />
                  {formatDueDate(task.dueDate)}
                </Typography>
              </Box>
            )}
          </Box>
        </CardContent>

        {/* Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleEdit}>
            <EditIcon sx={{ mr: 1, fontSize: 16 }} />
            Edit Task
          </MenuItem>
          <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
            <DeleteIcon sx={{ mr: 1, fontSize: 16 }} />
            Delete Task
          </MenuItem>
        </Menu>

        {/* Status Change Menu */}
        <Menu
          anchorEl={statusChangeAnchor}
          open={Boolean(statusChangeAnchor)}
          onClose={() => setStatusChangeAnchor(null)}
        >
          {(['Not Started', 'In Progress', 'On Hold', 'Completed'] as TaskStatus[]).map((status) => (
            <MenuItem
              key={status}
              onClick={() => handleStatusChange(status)}
              disabled={status === task.status}
              sx={{
                color: status === task.status ? 'text.disabled' : 'inherit',
              }}
            >
              {getStatusIcon(status)}
              <Typography sx={{ ml: 1 }}>{status}</Typography>
            </MenuItem>
          ))}
        </Menu>
      </Card>

      {/* Edit Dialog */}
      <TaskCreateDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onSubmit={handleEditSubmit}
        editingTask={task}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Task</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the task "{task.title}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default function TaskList({
  tasks,
  onTaskUpdate,
  onTaskDelete,
  sortOptions,
  onSortChange,
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 8,
          textAlign: 'center',
        }}
      >
        <AssignmentIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No tasks found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Adjust your filters or create a new task to get started.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Results Summary */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Showing {tasks.length} task{tasks.length !== 1 ? 's' : ''}
        </Typography>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Sort by</InputLabel>
          <Select
            value={sortOptions.field}
            label="Sort by"
            onChange={(e) => onSortChange({ ...sortOptions, field: e.target.value as any })}
          >
            <MenuItem value="dueDate">Due Date</MenuItem>
            <MenuItem value="priority">Priority</MenuItem>
            <MenuItem value="status">Status</MenuItem>
            <MenuItem value="createdAt">Created Date</MenuItem>
            <MenuItem value="title">Title</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Task Grid */}
      <Grid container spacing={3}>
        {tasks.map((task) => (
          <Grid item xs={12} sm={6} lg={4} key={task.id}>
            <TaskCard
              task={task}
              onTaskUpdate={onTaskUpdate}
              onTaskDelete={onTaskDelete}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
