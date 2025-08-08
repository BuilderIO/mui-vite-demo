import * as React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Alert,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { Task, User, TaskPriority, TaskStatus } from '../../types/TaskTypes';

interface TaskCreateDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'statusHistory'>) => void;
  users: User[];
}

const priorityColors = {
  High: '#f44336',
  Medium: '#ff9800',
  Low: '#4caf50',
};

export default function TaskCreateDialog({ open, onClose, onSubmit, users }: TaskCreateDialogProps) {
  const [formData, setFormData] = React.useState({
    title: '',
    description: '',
    assigneeId: '',
    assigneeName: '',
    dueDate: null as Dayjs | null,
    priority: 'Medium' as TaskPriority,
    status: 'Not Started' as TaskStatus,
  });
  const [errors, setErrors] = React.useState<{ [key: string]: string }>({});

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      assigneeId: '',
      assigneeName: '',
      dueDate: null,
      priority: 'Medium',
      status: 'Not Started',
    });
    setErrors({});
    onClose();
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    }

    if (!formData.assigneeId) {
      newErrors.assigneeId = 'Please select an assignee';
    }

    if (formData.dueDate && formData.dueDate.isBefore(dayjs(), 'day')) {
      newErrors.dueDate = 'Due date cannot be in the past';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const selectedUser = users.find(user => user.id === formData.assigneeId);
    
    onSubmit({
      title: formData.title.trim(),
      description: formData.description.trim(),
      assigneeId: formData.assigneeId,
      assigneeName: selectedUser?.name || '',
      dueDate: formData.dueDate ? formData.dueDate.toDate() : null,
      priority: formData.priority,
      status: formData.status,
    });

    handleClose();
  };

  const handleAssigneeChange = (assigneeId: string) => {
    const selectedUser = users.find(user => user.id === assigneeId);
    setFormData(prev => ({
      ...prev,
      assigneeId,
      assigneeName: selectedUser?.name || '',
    }));
    if (errors.assigneeId) {
      setErrors(prev => ({ ...prev, assigneeId: '' }));
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h5" component="div">
            Create New Task
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
            <TextField
              label="Task Title"
              value={formData.title}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, title: e.target.value }));
                if (errors.title) setErrors(prev => ({ ...prev, title: '' }));
              }}
              error={!!errors.title}
              helperText={errors.title}
              required
              fullWidth
            />

            <TextField
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              multiline
              rows={3}
              fullWidth
            />

            <FormControl fullWidth error={!!errors.assigneeId} required>
              <InputLabel>Assignee</InputLabel>
              <Select
                value={formData.assigneeId}
                onChange={(e) => handleAssigneeChange(e.target.value)}
                label="Assignee"
              >
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          bgcolor: 'primary.main',
                          color: 'primary.contrastText',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.875rem',
                          fontWeight: 600,
                        }}
                      >
                        {user.avatar}
                      </Box>
                      <Box>
                        <Typography variant="body2">{user.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {user.email}
                        </Typography>
                      </Box>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
              {errors.assigneeId && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                  {errors.assigneeId}
                </Typography>
              )}
            </FormControl>

            <DatePicker
              label="Due Date"
              value={formData.dueDate}
              onChange={(newValue) => {
                setFormData(prev => ({ ...prev, dueDate: newValue }));
                if (errors.dueDate) setErrors(prev => ({ ...prev, dueDate: '' }));
              }}
              minDate={dayjs()}
              slotProps={{
                textField: {
                  error: !!errors.dueDate,
                  helperText: errors.dueDate,
                  fullWidth: true,
                },
              }}
            />

            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as TaskPriority }))}
                label="Priority"
              >
                {Object.entries(priorityColors).map(([priority, color]) => (
                  <MenuItem key={priority} value={priority}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          bgcolor: color,
                        }}
                      />
                      {priority}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as TaskStatus }))}
                label="Status"
              >
                <MenuItem value="Not Started">Not Started</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="On Hold">On Hold</MenuItem>
              </Select>
            </FormControl>

            {Object.keys(errors).length > 0 && (
              <Alert severity="error">
                Please fix the errors above before submitting.
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained">
            Create Task
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}
