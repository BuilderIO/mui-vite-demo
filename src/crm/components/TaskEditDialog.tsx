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

interface TaskEditDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => void;
  task: Task | null;
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

export default function TaskEditDialog({ open, onClose, onSubmit, task }: TaskEditDialogProps) {
  const { teamMembers, loading: membersLoading } = useTeamMembers();
  const [formData, setFormData] = React.useState({
    title: "",
    description: "",
    priority: "medium" as TaskPriority,
    status: "todo" as TaskStatus,
    assignee: null as TeamMember | null,
    tags: [] as string[],
  });
  const [dueDate, setDueDate] = React.useState<Dayjs | null>(null);
  const [errors, setErrors] = React.useState({
    title: false,
    description: false,
    dueDate: false,
  });
  const [loading, setLoading] = React.useState(false);

  // Initialize form data when task changes
  React.useEffect(() => {
    if (task && open) {
      setFormData({
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        assignee: task.assignee || null,
        tags: task.tags || [],
      });
      setDueDate(dayjs(task.dueDate));
      setErrors({
        title: false,
        description: false,
        dueDate: false,
      });
    }
  }, [task, open]);

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
    
    if (!validateForm() || !task) {
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
    } catch (error) {
      console.error("Error updating task:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;
    onClose();
  };

  if (!task) return null;

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
      <DialogTitle>Edit Task</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Stack spacing={3}>
          {/* Title */}
          <FormControl fullWidth>
            <FormLabel htmlFor="edit-task-title">Task Title *</FormLabel>
            <TextField
              id="edit-task-title"
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
            <FormLabel htmlFor="edit-task-description">Description *</FormLabel>
            <TextField
              id="edit-task-description"
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
              <FormLabel htmlFor="edit-task-priority">Priority</FormLabel>
              <Select
                id="edit-task-priority"
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
              <FormLabel htmlFor="edit-task-status">Status</FormLabel>
              <Select
                id="edit-task-status"
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
            <FormLabel htmlFor="edit-task-assignee">Assignee</FormLabel>
            <Autocomplete
              id="edit-task-assignee"
              options={teamMembers}
              getOptionLabel={(option) => option.name}
              value={formData.assignee}
              onChange={handleAssigneeChange}
              loading={membersLoading}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder={membersLoading ? "Loading team members..." : "Select team member"}
                  size="small"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {membersLoading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
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
            <FormLabel htmlFor="edit-task-due-date">Due Date *</FormLabel>
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
            <FormLabel htmlFor="edit-task-tags">Tags</FormLabel>
            <Autocomplete
              id="edit-task-tags"
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
          {loading ? "Updating..." : "Update Task"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
