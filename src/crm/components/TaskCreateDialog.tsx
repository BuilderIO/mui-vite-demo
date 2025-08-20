import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import Stack from "@mui/material/Stack";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import Autocomplete from "@mui/material/Autocomplete";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { Task, TaskPriority, TaskStatus } from "../pages/Tasks";
import { useTeamMembers, TeamMember } from "../hooks/useTeamMembers";

interface TaskCreateDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => void;
}

const priorityOptions: { value: TaskPriority; label: string; color: string }[] = [
  { value: "low", label: "Low", color: "#2196f3" },
  { value: "medium", label: "Medium", color: "#ff9800" },
  { value: "high", label: "High", color: "#f44336" }
];

const statusOptions: { value: TaskStatus; label: string }[] = [
  { value: "todo", label: "To Do" },
  { value: "in_progress", label: "In Progress" },
  { value: "on_hold", label: "On Hold" },
  { value: "completed", label: "Completed" }
];

const commonTags = [
  "urgent", "client", "internal", "meeting", "review", "development", 
  "design", "bug", "feature", "documentation", "testing", "deployment"
];

export default function TaskCreateDialog({ open, onClose, onSubmit }: TaskCreateDialogProps) {
  const [formData, setFormData] = React.useState({
    title: "",
    description: "",
    priority: "medium" as TaskPriority,
    status: "todo" as TaskStatus,
    assignee: null as TeamMember | null,
    tags: [] as string[],
  });
  const [dueDate, setDueDate] = React.useState<Dayjs | null>(dayjs().add(1, "day"));
  const [errors, setErrors] = React.useState({
    title: false,
    description: false,
    dueDate: false,
  });
  const [loading, setLoading] = React.useState(false);

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { value: unknown } }) => {
    const value = event.target.value as string;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: false }));
    }
  };

  const handleAssigneeChange = (event: React.SyntheticEvent, newValue: TeamMember | null) => {
    setFormData(prev => ({ ...prev, assignee: newValue }));
  };

  const handleTagsChange = (event: React.SyntheticEvent, newValue: string[]) => {
    setFormData(prev => ({ ...prev, tags: newValue }));
  };

  const validateForm = () => {
    const newErrors = {
      title: !formData.title.trim(),
      description: !formData.description.trim(),
      dueDate: !dueDate || !dueDate.isValid(),
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const taskData: Omit<Task, "id" | "createdAt" | "updatedAt"> = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        priority: formData.priority,
        status: formData.status,
        assignee: formData.assignee || undefined,
        dueDate: dueDate!.toISOString(),
        tags: formData.tags.length > 0 ? formData.tags : undefined,
      };

      onSubmit(taskData);
      handleClose();
    } catch (error) {
      console.error("Error creating task:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;
    
    // Reset form
    setFormData({
      title: "",
      description: "",
      priority: "medium",
      status: "todo",
      assignee: null,
      tags: [],
    });
    setDueDate(dayjs().add(1, "day"));
    setErrors({
      title: false,
      description: false,
      dueDate: false,
    });
    
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          component: "form",
          onSubmit: handleSubmit,
        },
      }}
    >
      <DialogTitle>Create New Task</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Stack spacing={3}>
          {/* Title */}
          <FormControl fullWidth>
            <FormLabel htmlFor="task-title">Task Title *</FormLabel>
            <TextField
              id="task-title"
              name="title"
              value={formData.title}
              onChange={handleInputChange("title")}
              error={errors.title}
              helperText={errors.title ? "Title is required" : ""}
              placeholder="Enter task title"
              size="small"
              fullWidth
            />
          </FormControl>

          {/* Description */}
          <FormControl fullWidth>
            <FormLabel htmlFor="task-description">Description *</FormLabel>
            <TextField
              id="task-description"
              name="description"
              value={formData.description}
              onChange={handleInputChange("description")}
              error={errors.description}
              helperText={errors.description ? "Description is required" : ""}
              placeholder="Enter task description"
              multiline
              rows={3}
              size="small"
              fullWidth
            />
          </FormControl>

          {/* Priority and Status Row */}
          <Stack direction="row" spacing={2}>
            <FormControl sx={{ minWidth: 120 }}>
              <FormLabel htmlFor="task-priority">Priority</FormLabel>
              <Select
                id="task-priority"
                name="priority"
                value={formData.priority}
                onChange={handleInputChange("priority")}
                size="small"
              >
                {priorityOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                          backgroundColor: option.color,
                        }}
                      />
                      {option.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 120 }}>
              <FormLabel htmlFor="task-status">Status</FormLabel>
              <Select
                id="task-status"
                name="status"
                value={formData.status}
                onChange={handleInputChange("status")}
                size="small"
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
            <FormLabel htmlFor="task-assignee">Assignee</FormLabel>
            <Autocomplete
              id="task-assignee"
              options={teamMembers}
              getOptionLabel={(option) => option.name}
              value={formData.assignee}
              onChange={handleAssigneeChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Select team member"
                  size="small"
                />
              )}
              renderOption={(props, option) => (
                <Box component="li" {...props} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar sx={{ width: 24, height: 24, fontSize: "0.75rem" }}>
                    {option.avatar || option.name.charAt(0)}
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
          </FormControl>

          {/* Due Date */}
          <FormControl fullWidth>
            <FormLabel htmlFor="task-due-date">Due Date *</FormLabel>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                value={dueDate}
                onChange={(newValue) => {
                  setDueDate(newValue);
                  if (errors.dueDate && newValue && newValue.isValid()) {
                    setErrors(prev => ({ ...prev, dueDate: false }));
                  }
                }}
                slotProps={{
                  textField: {
                    size: "small",
                    error: errors.dueDate,
                    helperText: errors.dueDate ? "Valid due date is required" : "",
                  },
                }}
              />
            </LocalizationProvider>
          </FormControl>

          {/* Tags */}
          <FormControl fullWidth>
            <FormLabel htmlFor="task-tags">Tags</FormLabel>
            <Autocomplete
              id="task-tags"
              multiple
              options={commonTags}
              value={formData.tags}
              onChange={handleTagsChange}
              freeSolo
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    variant="outlined"
                    label={option}
                    size="small"
                    {...getTagProps({ index })}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Add tags"
                  size="small"
                />
              )}
            />
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Task"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
