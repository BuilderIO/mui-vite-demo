import * as React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Stack,
  Autocomplete,
  Avatar,
  Chip,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { Task, TaskPriority, TaskStatus, TeamMember } from '../types/taskTypes';
import { mockTeamMembers, getPriorityColor } from '../data/taskData';

interface TaskCreateFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'statusHistory'>) => void;
  editTask?: Task | null;
}

const priorityOptions: { value: TaskPriority; label: string; color: string }[] = [
  { value: 'high', label: 'High', color: '#f44336' },
  { value: 'medium', label: 'Medium', color: '#ff9800' },
  { value: 'low', label: 'Low', color: '#4caf50' },
];

const statusOptions: { value: TaskStatus; label: string }[] = [
  { value: 'not_started', label: 'Not Started' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'on_hold', label: 'On Hold' },
];

export default function TaskCreateForm({ open, onClose, onSubmit, editTask }: TaskCreateFormProps) {
  const [formData, setFormData] = React.useState({
    title: '',
    description: '',
    assigneeId: '',
    dueDate: null as Dayjs | null,
    priority: 'medium' as TaskPriority,
    status: 'not_started' as TaskStatus,
  });

  const [errors, setErrors] = React.useState({
    title: '',
    dueDate: '',
  });

  React.useEffect(() => {
    if (editTask) {
      setFormData({
        title: editTask.title,
        description: editTask.description || '',
        assigneeId: editTask.assigneeId || '',
        dueDate: editTask.dueDate ? dayjs(editTask.dueDate) : null,
        priority: editTask.priority,
        status: editTask.status,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        assigneeId: '',
        dueDate: null,
        priority: 'medium',
        status: 'not_started',
      });
    }
    setErrors({ title: '', dueDate: '' });
  }, [editTask, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors = { title: '', dueDate: '' };
    let hasErrors = false;

    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
      hasErrors = true;
    }

    if (formData.dueDate && formData.dueDate.isBefore(dayjs(), 'day')) {
      newErrors.dueDate = 'Due date cannot be in the past';
      hasErrors = true;
    }

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    const assignee = formData.assigneeId 
      ? mockTeamMembers.find(member => member.id === formData.assigneeId)
      : undefined;

    const taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'statusHistory'> = {
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      assigneeId: formData.assigneeId || undefined,
      assignee,
      dueDate: formData.dueDate ? formData.dueDate.format('YYYY-MM-DD') : undefined,
      priority: formData.priority,
      status: formData.status,
      createdBy: '1', // Current user ID (mock)
    };

    onSubmit(taskData);
    onClose();
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      assigneeId: '',
      dueDate: null,
      priority: 'medium',
      status: 'not_started',
    });
    setErrors({ title: '', dueDate: '' });
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        component: 'form',
        onSubmit: handleSubmit,
      }}
    >
      <DialogTitle>
        {editTask ? 'Edit Task' : 'Create New Task'}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <TextField
            label="Task Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            error={!!errors.title}
            helperText={errors.title}
            required
            fullWidth
            variant="outlined"
          />

          <TextField
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            multiline
            rows={3}
            fullWidth
            variant="outlined"
            placeholder="Optional task description..."
          />

          <Autocomplete
            options={mockTeamMembers}
            getOptionLabel={(option) => option.name}
            value={mockTeamMembers.find(member => member.id === formData.assigneeId) || null}
            onChange={(_, newValue) => {
              setFormData({ ...formData, assigneeId: newValue?.id || '' });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Assignee"
                placeholder="Select team member"
              />
            )}
            renderOption={(props, option) => (
              <Box component="li" {...props}>
                <Avatar
                  src={option.avatar}
                  sx={{ width: 32, height: 32, mr: 2 }}
                >
                  {option.name.split(' ').map(n => n[0]).join('')}
                </Avatar>
                <Box>
                  <Typography variant="body2">{option.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {option.email}
                  </Typography>
                </Box>
              </Box>
            )}
          />

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Due Date"
              value={formData.dueDate}
              onChange={(newValue) => setFormData({ ...formData, dueDate: newValue })}
              minDate={dayjs()}
              slotProps={{
                textField: {
                  error: !!errors.dueDate,
                  helperText: errors.dueDate,
                  fullWidth: true,
                },
              }}
            />
          </LocalizationProvider>

          <FormControl fullWidth>
            <InputLabel>Priority</InputLabel>
            <Select
              value={formData.priority}
              label="Priority"
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as TaskPriority })}
            >
              {priorityOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip
                      label={option.label}
                      size="small"
                      sx={{
                        backgroundColor: option.color,
                        color: 'white',
                        fontWeight: 500,
                      }}
                    />
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {editTask && (
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                label="Status"
                onChange={(e) => setFormData({ ...formData, status: e.target.value as TaskStatus })}
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button type="submit" variant="contained">
          {editTask ? 'Update Task' : 'Create Task'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
