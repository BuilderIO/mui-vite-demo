import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import OutlinedInput from '@mui/material/OutlinedInput';
import Autocomplete from '@mui/material/Autocomplete';
import Stack from '@mui/material/Stack';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs, { Dayjs } from 'dayjs';
import type { Task, TaskFormData, TaskPriority, TaskStatus, TeamMember } from '../types/taskTypes';

interface TaskFormProps {
  open: boolean;
  task?: Task | null;
  teamMembers: TeamMember[];
  onClose: () => void;
  onSubmit: (data: TaskFormData) => void;
  loading?: boolean;
}

const priorityOptions: { value: TaskPriority; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' }
];

const statusOptions: { value: TaskStatus; label: string }[] = [
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'on_hold', label: 'On Hold' }
];

const availableTags = [
  'sales', 'development', 'design', 'marketing', 'support', 'research',
  'meeting', 'deadline', 'urgent', 'follow-up', 'review', 'documentation'
];

export default function TaskForm({
  open,
  task,
  teamMembers,
  onClose,
  onSubmit,
  loading = false
}: TaskFormProps) {
  const [formData, setFormData] = React.useState<TaskFormData>({
    title: '',
    description: '',
    priority: 'medium',
    status: 'todo',
    assigneeId: '',
    dueDate: '',
    reminderDate: '',
    tags: []
  });

  const [dueDate, setDueDate] = React.useState<Dayjs | null>(null);
  const [reminderDate, setReminderDate] = React.useState<Dayjs | null>(null);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  // Reset form when dialog opens/closes or task changes
  React.useEffect(() => {
    if (open) {
      if (task) {
        // Edit mode - populate form with task data
        setFormData({
          title: task.title,
          description: task.description || '',
          priority: task.priority,
          status: task.status,
          assigneeId: task.assignee?.id || '',
          dueDate: task.dueDate || '',
          reminderDate: task.reminderDate || '',
          tags: task.tags || []
        });
        setDueDate(task.dueDate ? dayjs(task.dueDate) : null);
        setReminderDate(task.reminderDate ? dayjs(task.reminderDate) : null);
      } else {
        // Create mode - reset form
        setFormData({
          title: '',
          description: '',
          priority: 'medium',
          status: 'todo',
          assigneeId: '',
          dueDate: '',
          reminderDate: '',
          tags: []
        });
        setDueDate(null);
        setReminderDate(null);
      }
      setErrors({});
    }
  }, [open, task]);

  const handleInputChange = (field: keyof TaskFormData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const { [field]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleSelectChange = (field: keyof TaskFormData) => (
    event: any
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleDateChange = (field: 'dueDate' | 'reminderDate') => (value: Dayjs | null) => {
    if (field === 'dueDate') {
      setDueDate(value);
      setFormData(prev => ({
        ...prev,
        dueDate: value ? value.toISOString() : ''
      }));
    } else {
      setReminderDate(value);
      setFormData(prev => ({
        ...prev,
        reminderDate: value ? value.toISOString() : ''
      }));
    }
  };

  const handleTagsChange = (event: any, newValue: string[]) => {
    setFormData(prev => ({
      ...prev,
      tags: newValue
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (reminderDate && dueDate && reminderDate.isAfter(dueDate)) {
      newErrors.reminderDate = 'Reminder date must be before due date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSubmit(formData);
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        component: 'form',
        onSubmit: handleSubmit
      }}
    >
      <DialogTitle>
        {task ? 'Edit Task' : 'Create New Task'}
      </DialogTitle>
      
      <DialogContent dividers>
        <Stack spacing={3}>
          {/* Title */}
          <TextField
            fullWidth
            label="Task Title"
            value={formData.title}
            onChange={handleInputChange('title')}
            error={!!errors.title}
            helperText={errors.title}
            required
            autoFocus
          />

          {/* Description */}
          <TextField
            fullWidth
            label="Description"
            value={formData.description}
            onChange={handleInputChange('description')}
            multiline
            rows={3}
            placeholder="Describe the task in detail..."
          />

          {/* Priority and Status */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={formData.priority}
                label="Priority"
                onChange={handleSelectChange('priority')}
              >
                {priorityOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                label="Status"
                onChange={handleSelectChange('status')}
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          {/* Assignee */}
          <FormControl fullWidth>
            <InputLabel>Assignee</InputLabel>
            <Select
              value={formData.assigneeId}
              label="Assignee"
              onChange={handleSelectChange('assigneeId')}
            >
              <MenuItem value="">
                <em>Unassigned</em>
              </MenuItem>
              {teamMembers.map((member) => (
                <MenuItem key={member.id} value={member.id}>
                  {member.name.first} {member.name.last} ({member.email})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Due Date and Reminder */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <DatePicker
              label="Due Date"
              value={dueDate}
              onChange={handleDateChange('dueDate')}
              sx={{ flex: 1 }}
              slotProps={{
                textField: {
                  fullWidth: true
                }
              }}
            />

            <DateTimePicker
              label="Reminder Date & Time"
              value={reminderDate}
              onChange={handleDateChange('reminderDate')}
              sx={{ flex: 1 }}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!errors.reminderDate,
                  helperText: errors.reminderDate
                }
              }}
            />
          </Stack>

          {/* Tags */}
          <Autocomplete
            multiple
            options={availableTags}
            value={formData.tags || []}
            onChange={handleTagsChange}
            freeSolo
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  variant="outlined"
                  label={option}
                  {...getTagProps({ index })}
                  key={option}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Tags"
                placeholder="Add tags..."
                helperText="Select existing tags or type new ones"
              />
            )}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          variant="contained" 
          disabled={loading}
        >
          {loading ? 'Saving...' : (task ? 'Update Task' : 'Create Task')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
