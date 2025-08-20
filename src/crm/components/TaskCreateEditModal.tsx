import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Autocomplete from "@mui/material/Autocomplete";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import type { Task } from "../pages/Tasks";

interface User {
  id: string;
  name: string;
  email: string;
}

interface TaskCreateEditModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (task: Task | Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  task?: Task | null;
  isEdit?: boolean;
}

interface TaskFormData {
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  status: "pending" | "in_progress" | "completed" | "on_hold";
  assignedTo: User | null;
  dueDate: Dayjs | null;
}

interface FormErrors {
  title?: string;
  description?: string;
  dueDate?: string;
}

const priorityOptions = [
  { value: "high", label: "High Priority" },
  { value: "medium", label: "Medium Priority" },
  { value: "low", label: "Low Priority" },
];

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "on_hold", label: "On Hold" },
];

// Sample users - in a real app, this would come from the Users API
const availableUsers: User[] = [
  { id: "user1", name: "John Doe", email: "john.doe@example.com" },
  { id: "user2", name: "Jane Smith", email: "jane.smith@example.com" },
  { id: "user3", name: "Mike Johnson", email: "mike.johnson@example.com" },
  { id: "user4", name: "Sarah Wilson", email: "sarah.wilson@example.com" },
  { id: "user5", name: "David Brown", email: "david.brown@example.com" },
];

export default function TaskCreateEditModal({
  open,
  onClose,
  onSave,
  task,
  isEdit = false,
}: TaskCreateEditModalProps) {
  const [formData, setFormData] = React.useState<TaskFormData>({
    title: "",
    description: "",
    priority: "medium",
    status: "pending",
    assignedTo: null,
    dueDate: null,
  });
  
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [users, setUsers] = React.useState<User[]>(availableUsers);
  const [loadingUsers, setLoadingUsers] = React.useState(false);

  // Load users from API
  React.useEffect(() => {
    const loadUsers = async () => {
      setLoadingUsers(true);
      try {
        const response = await fetch("https://user-api.builder-io.workers.dev/api/users?perPage=50");
        if (response.ok) {
          const data = await response.json();
          const apiUsers = data.data.map((user: any) => ({
            id: user.login.uuid,
            name: `${user.name.first} ${user.name.last}`,
            email: user.email,
          }));
          setUsers(apiUsers);
        }
      } catch (error) {
        console.error("Failed to load users:", error);
        // Keep using the default sample users
      } finally {
        setLoadingUsers(false);
      }
    };

    if (open) {
      loadUsers();
    }
  }, [open]);

  // Initialize form data when modal opens or task changes
  React.useEffect(() => {
    if (open) {
      if (isEdit && task) {
        setFormData({
          title: task.title,
          description: task.description,
          priority: task.priority,
          status: task.status,
          assignedTo: task.assignedTo,
          dueDate: task.dueDate ? dayjs(task.dueDate) : null,
        });
      } else {
        setFormData({
          title: "",
          description: "",
          priority: "medium",
          status: "pending",
          assignedTo: null,
          dueDate: null,
        });
      }
      setErrors({});
    }
  }, [open, task, isEdit]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Task title is required";
    } else if (formData.title.length < 3) {
      newErrors.title = "Task title must be at least 3 characters";
    } else if (formData.title.length > 100) {
      newErrors.title = "Task title must not exceed 100 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Task description is required";
    } else if (formData.description.length < 10) {
      newErrors.description = "Task description must be at least 10 characters";
    } else if (formData.description.length > 500) {
      newErrors.description = "Task description must not exceed 500 characters";
    }

    if (formData.dueDate && formData.dueDate.isBefore(dayjs(), "day")) {
      newErrors.dueDate = "Due date cannot be in the past";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const taskData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        priority: formData.priority,
        status: formData.status,
        assignedTo: formData.assignedTo,
        dueDate: formData.dueDate ? formData.dueDate.toISOString() : null,
      };

      if (isEdit && task) {
        onSave({
          ...task,
          ...taskData,
        });
      } else {
        onSave(taskData);
      }
    } catch (error) {
      console.error("Failed to save task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle>
        <Typography variant="h5">
          {isEdit ? "Edit Task" : "Create New Task"}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {isEdit ? "Update task details and assignments" : "Fill in the details to create a new task"}
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3} sx={{ pt: 1 }}>
          {/* Title Field */}
          <TextField
            label="Task Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            error={!!errors.title}
            helperText={errors.title || `${formData.title.length}/100 characters`}
            fullWidth
            required
            inputProps={{ maxLength: 100 }}
          />

          {/* Description Field */}
          <TextField
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            error={!!errors.description}
            helperText={errors.description || `${formData.description.length}/500 characters`}
            fullWidth
            required
            multiline
            rows={3}
            inputProps={{ maxLength: 500 }}
          />

          {/* Priority and Status Row */}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={formData.priority}
                label="Priority"
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
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
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          {/* Assigned User */}
          <Autocomplete
            options={users}
            getOptionLabel={(option) => `${option.name} (${option.email})`}
            value={formData.assignedTo}
            onChange={(_, newValue) => setFormData({ ...formData, assignedTo: newValue })}
            loading={loadingUsers}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Assign To"
                placeholder="Select a team member"
                helperText="Leave empty to create an unassigned task"
              />
            )}
            renderOption={(props, option) => (
              <Box component="li" {...props}>
                <Box>
                  <Typography variant="body2">{option.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {option.email}
                  </Typography>
                </Box>
              </Box>
            )}
          />

          {/* Due Date */}
          <DatePicker
            label="Due Date"
            value={formData.dueDate}
            onChange={(newValue) => setFormData({ ...formData, dueDate: newValue })}
            slotProps={{
              textField: {
                error: !!errors.dueDate,
                helperText: errors.dueDate || "Optional: Set a deadline for this task",
                fullWidth: true,
              },
            }}
            minDate={dayjs()}
          />

          {/* Form Validation Summary */}
          {Object.keys(errors).length > 0 && (
            <Alert severity="error" sx={{ mt: 2 }}>
              Please fix the errors above before submitting.
            </Alert>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button 
          onClick={handleClose} 
          disabled={isSubmitting}
          color="inherit"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : isEdit ? "Update Task" : "Create Task"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
