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
  Autocomplete,
  Chip,
  Box,
  Typography,
  Alert,
  Grid,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Close as CloseIcon,
  Add as AddIcon,
  DateRange as DateIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';

import { Task, TaskPriority, TeamMember } from '../types/task';
import { mockTeamMembers, getCurrentUser } from '../data/mockTasks';
import { validateTaskData } from '../utils/taskUtils';

interface TaskCreateDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (taskData: Partial<Task>) => void;
  editingTask?: Task;
}

const priorityOptions: { value: TaskPriority; label: string; color: string }[] = [
  { value: 'High', label: 'High Priority', color: '#f44336' },
  { value: 'Medium', label: 'Medium Priority', color: '#ff9800' },
  { value: 'Low', label: 'Low Priority', color: '#4caf50' },
];

const commonTags = [
  'Frontend', 'Backend', 'Database', 'Testing', 'Documentation', 
  'Bug Fix', 'Feature', 'Optimization', 'Security', 'UI/UX'
];

export default function TaskCreateDialog({
  open,
  onClose,
  onSubmit,
  editingTask,
}: TaskCreateDialogProps) {
  const [formData, setFormData] = React.useState<Partial<Task>>({
    title: '',
    description: '',
    priority: 'Medium',
    assigneeId: '',
    dueDate: undefined,
    estimatedHours: undefined,
    tags: [],
  });
  const [errors, setErrors] = React.useState<string[]>([]);
  const [selectedAssignee, setSelectedAssignee] = React.useState<TeamMember | null>(null);
  const [selectedDueDate, setSelectedDueDate] = React.useState<Dayjs | null>(null);
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);

  const currentUser = getCurrentUser();
  const isEditing = !!editingTask;
  const dialogTitle = isEditing ? 'Edit Task' : 'Create New Task';

  // Initialize form when editing
  React.useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title,
        description: editingTask.description || '',
        priority: editingTask.priority,
        assigneeId: editingTask.assigneeId || '',
        dueDate: editingTask.dueDate,
        estimatedHours: editingTask.estimatedHours,
        tags: editingTask.tags || [],
      });
      setSelectedAssignee(editingTask.assignee || null);
      setSelectedDueDate(editingTask.dueDate ? dayjs(editingTask.dueDate) : null);
      setSelectedTags(editingTask.tags || []);
    } else {
      // Reset form for new task
      setFormData({
        title: '',
        description: '',
        priority: 'Medium',
        assigneeId: '',
        dueDate: undefined,
        estimatedHours: undefined,
        tags: [],
      });
      setSelectedAssignee(null);
      setSelectedDueDate(null);
      setSelectedTags([]);
    }
    setErrors([]);
  }, [editingTask, open]);

  const handleInputChange = (field: keyof Task) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handlePriorityChange = (event: any) => {
    setFormData(prev => ({
      ...prev,
      priority: event.target.value as TaskPriority,
    }));
  };

  const handleAssigneeChange = (event: any, newValue: TeamMember | null) => {
    setSelectedAssignee(newValue);
    setFormData(prev => ({
      ...prev,
      assigneeId: newValue?.id || '',
      assignee: newValue || undefined,
    }));
  };

  const handleDueDateChange = (newValue: Dayjs | null) => {
    setSelectedDueDate(newValue);
    setFormData(prev => ({
      ...prev,
      dueDate: newValue ? newValue.toDate() : undefined,
    }));
  };

  const handleTagsChange = (event: any, newValue: string[]) => {
    setSelectedTags(newValue);
    setFormData(prev => ({
      ...prev,
      tags: newValue,
    }));
  };

  const handleEstimatedHoursChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value);
    setFormData(prev => ({
      ...prev,
      estimatedHours: isNaN(value) ? undefined : value,
    }));
  };

  const handleSubmit = () => {
    // Validate form data
    const validationErrors = validateTaskData(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Submit the task
    onSubmit(formData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      priority: 'Medium',
      assigneeId: '',
      dueDate: undefined,
      estimatedHours: undefined,
      tags: [],
    });
    setSelectedAssignee(null);
    setSelectedDueDate(null);
    setSelectedTags([]);
    setErrors([]);
    onClose();
  };

  const today = dayjs();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
              {dialogTitle}
            </Typography>
            <IconButton onClick={handleClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          {errors.length > 0 && (
            <Alert severity="error" sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Please fix the following issues:
              </Typography>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </Alert>
          )}

          <Grid container spacing={3}>
            {/* Task Title */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Task Title"
                required
                value={formData.title}
                onChange={handleInputChange('title')}
                placeholder="Enter a clear, descriptive task title"
                error={errors.some(error => error.includes('title'))}
              />
            </Grid>

            {/* Task Description */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={formData.description}
                onChange={handleInputChange('description')}
                placeholder="Provide additional details about the task..."
              />
            </Grid>

            {/* Priority and Assignee */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={formData.priority || 'Medium'}
                  onChange={handlePriorityChange}
                  label="Priority"
                >
                  {priorityOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            backgroundColor: option.color,
                          }}
                        />
                        {option.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Autocomplete
                value={selectedAssignee}
                onChange={handleAssigneeChange}
                options={mockTeamMembers}
                getOptionLabel={(option) => option.name}
                renderOption={(props, option) => (
                  <Box component="li" {...props}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          backgroundColor: 'primary.main',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                        }}
                      >
                        {option.name.split(' ').map(n => n[0]).join('')}
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {option.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {option.role} • {option.email}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Assignee"
                    placeholder="Select team member"
                  />
                )}
              />
            </Grid>

            {/* Due Date and Estimated Hours */}
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Due Date"
                value={selectedDueDate}
                onChange={handleDueDateChange}
                minDate={today}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    placeholder: 'Select due date',
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Estimated Hours"
                type="number"
                value={formData.estimatedHours || ''}
                onChange={handleEstimatedHoursChange}
                placeholder="0"
                inputProps={{ min: 0, max: 1000, step: 0.5 }}
                helperText="Optional: Estimated time to complete"
              />
            </Grid>

            {/* Tags */}
            <Grid item xs={12}>
              <Autocomplete
                multiple
                freeSolo
                value={selectedTags}
                onChange={handleTagsChange}
                options={commonTags}
                renderTags={(tagValue, getTagProps) =>
                  tagValue.map((option, index) => (
                    <Chip
                      label={option}
                      {...getTagProps({ index })}
                      key={option}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Tags"
                    placeholder="Add tags to categorize the task"
                    helperText="Press Enter to add custom tags"
                  />
                )}
              />
            </Grid>

            {/* Task Info Summary */}
            {(selectedAssignee || selectedDueDate || formData.priority !== 'Medium') && (
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
                <Typography variant="subtitle2" gutterBottom color="text.secondary">
                  Task Summary:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {formData.priority !== 'Medium' && (
                    <Chip
                      label={`${formData.priority} Priority`}
                      size="small"
                      color={
                        formData.priority === 'High' ? 'error' :
                        formData.priority === 'Medium' ? 'warning' : 'success'
                      }
                    />
                  )}
                  {selectedAssignee && (
                    <Chip
                      label={`Assigned to ${selectedAssignee.name}`}
                      size="small"
                      color="info"
                    />
                  )}
                  {selectedDueDate && (
                    <Chip
                      label={`Due ${selectedDueDate.format('MMM DD, YYYY')}`}
                      size="small"
                      color="default"
                      icon={<DateIcon />}
                    />
                  )}
                  {formData.estimatedHours && (
                    <Chip
                      label={`${formData.estimatedHours}h estimated`}
                      size="small"
                      color="default"
                    />
                  )}
                </Box>
              </Grid>
            )}
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            startIcon={<AddIcon />}
            disabled={!formData.title?.trim()}
          >
            {isEditing ? 'Update Task' : 'Create Task'}
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}
