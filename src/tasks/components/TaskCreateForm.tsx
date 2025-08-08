import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
  Chip,
  Autocomplete,
  Typography,
  Alert,
  FormHelperText,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { Dayjs } from 'dayjs';
import { Task, TaskPriority, TaskStatus, TeamMember } from '../types/Task';
import { useTaskContext } from '../context/TaskContext';
import { validateTask } from '../utils/taskUtils';

interface TaskCreateFormProps {
  open: boolean;
  onClose: () => void;
  initialTask?: Partial<Task>;
  mode?: 'create' | 'edit';
}

const priorityOptions: TaskPriority[] = ['High', 'Medium', 'Low'];
const statusOptions: TaskStatus[] = ['Not Started', 'In Progress', 'Completed', 'On Hold'];

const commonTags = [
  'frontend', 'backend', 'design', 'testing', 'documentation',
  'bug', 'feature', 'urgent', 'research', 'review'
];

export default function TaskCreateForm({ open, onClose, initialTask, mode = 'create' }: TaskCreateFormProps) {
  const { createTask, updateTask, teamMembers } = useTaskContext();

  const [formData, setFormData] = useState({
    title: initialTask?.title || '',
    description: initialTask?.description || '',
    assignee: initialTask?.assignee || null,
    dueDate: initialTask?.dueDate ? dayjs(initialTask.dueDate) : null,
    priority: initialTask?.priority || 'Medium' as TaskPriority,
    status: initialTask?.status || 'Not Started' as TaskStatus,
    tags: initialTask?.tags || [],
    estimatedHours: initialTask?.estimatedHours || 0,
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Validate form
    const taskToValidate: Partial<Task> = {
      title: formData.title,
      description: formData.description,
      dueDate: formData.dueDate ? formData.dueDate.toDate() : undefined,
      estimatedHours: formData.estimatedHours,
    };

    const validation = validateTask(taskToValidate);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      setIsSubmitting(false);
      return;
    }

    try {
      const taskData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        assignee: formData.assignee,
        dueDate: formData.dueDate ? formData.dueDate.toDate() : undefined,
        priority: formData.priority,
        status: formData.status,
        tags: formData.tags,
        estimatedHours: formData.estimatedHours > 0 ? formData.estimatedHours : undefined,
      };

      if (mode === 'create') {
        createTask(taskData);
      } else if (initialTask) {
        const updatedTask: Task = {
          ...initialTask as Task,
          ...taskData,
        };
        updateTask(updatedTask);
      }

      // Reset form and close
      setFormData({
        title: '',
        description: '',
        assignee: null,
        dueDate: null,
        priority: 'Medium',
        status: 'Not Started',
        tags: [],
        estimatedHours: 0,
      });
      
      onClose();
    } catch (error) {
      setErrors(['Failed to save task. Please try again.']);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      assignee: null,
      dueDate: null,
      priority: 'Medium',
      status: 'Not Started',
      tags: [],
      estimatedHours: 0,
    });
    setErrors([]);
    onClose();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { minHeight: '600px' }
        }}
      >
        <DialogTitle>
          {mode === 'create' ? 'Create New Task' : 'Edit Task'}
        </DialogTitle>
        
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
            {errors.length > 0 && (
              <Alert severity="error">
                <Typography variant="body2">
                  Please fix the following errors:
                </Typography>
                <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </Alert>
            )}

            <TextField
              label="Task Title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              fullWidth
              required
              error={errors.some(e => e.includes('title'))}
              helperText="Provide a clear, concise title for the task"
            />

            <TextField
              label="Description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              fullWidth
              multiline
              rows={3}
              helperText="Describe what needs to be done, acceptance criteria, and any relevant context"
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl sx={{ flex: 1 }}>
                <InputLabel>Assignee</InputLabel>
                <Select
                  value={formData.assignee?.id || ''}
                  label="Assignee"
                  onChange={(e) => {
                    const assignee = teamMembers.find(m => m.id === e.target.value) || null;
                    handleInputChange('assignee', assignee);
                  }}
                >
                  <MenuItem value="">
                    <em>Unassigned</em>
                  </MenuItem>
                  {teamMembers.map((member) => (
                    <MenuItem key={member.id} value={member.id}>
                      {member.name} ({member.role})
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>Select team member to assign this task</FormHelperText>
              </FormControl>

              <FormControl sx={{ flex: 1 }}>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={formData.priority}
                  label="Priority"
                  onChange={(e) => handleInputChange('priority', e.target.value)}
                >
                  {priorityOptions.map((priority) => (
                    <MenuItem key={priority} value={priority}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            backgroundColor: 
                              priority === 'High' ? '#f44336' :
                              priority === 'Medium' ? '#ff9800' : '#4caf50'
                          }}
                        />
                        {priority}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>Set task priority level</FormHelperText>
              </FormControl>
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <DatePicker
                label="Due Date"
                value={formData.dueDate}
                onChange={(value) => handleInputChange('dueDate', value)}
                sx={{ flex: 1 }}
                minDate={dayjs()}
                slotProps={{
                  textField: {
                    helperText: 'Select when this task should be completed',
                    error: errors.some(e => e.includes('due date'))
                  }
                }}
              />

              <FormControl sx={{ flex: 1 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  label="Status"
                  onChange={(e) => handleInputChange('status', e.target.value)}
                >
                  {statusOptions.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>Current task status</FormHelperText>
              </FormControl>
            </Box>

            <TextField
              label="Estimated Hours"
              type="number"
              value={formData.estimatedHours}
              onChange={(e) => handleInputChange('estimatedHours', parseInt(e.target.value) || 0)}
              inputProps={{ min: 0, max: 1000 }}
              helperText="Estimate how many hours this task will take"
              error={errors.some(e => e.includes('hours'))}
            />

            <Autocomplete
              multiple
              freeSolo
              options={commonTags}
              value={formData.tags}
              onChange={(_, newValue) => handleInputChange('tags', newValue)}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    variant="outlined"
                    label={option}
                    size="small"
                    {...getTagProps({ index })}
                    key={option}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Tags"
                  placeholder="Add tags to categorize this task..."
                  helperText="Add relevant tags to help organize and filter tasks"
                />
              )}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={isSubmitting || !formData.title.trim()}
          >
            {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Task' : 'Update Task'}
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}
