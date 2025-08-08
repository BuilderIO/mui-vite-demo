import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Box,
  Chip,
  Stack,
  Typography,
  Avatar,
  ListItemText,
  ListItemAvatar,
  SelectChangeEvent,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { Task, TaskFormData, TeamMember, Priority, TaskStatus, PRIORITY_OPTIONS, STATUS_OPTIONS } from "../types/taskTypes";
import { validateTaskForm } from "../utils/taskUtils";

interface TaskEditFormProps {
  open: boolean;
  task: Task | null;
  onClose: () => void;
  onSubmit: (task: Task) => void;
  teamMembers: TeamMember[];
}

export default function TaskEditForm({
  open,
  task,
  onClose,
  onSubmit,
  teamMembers,
}: TaskEditFormProps) {
  const [formData, setFormData] = React.useState<TaskFormData>({
    title: "",
    description: "",
    assigneeId: "",
    priority: "Medium",
    dueDate: null,
    tags: [],
    estimatedHours: undefined,
  });
  const [status, setStatus] = React.useState<TaskStatus>("Not Started");
  const [actualHours, setActualHours] = React.useState<number | undefined>();
  const [errors, setErrors] = React.useState<string[]>([]);
  const [tagInput, setTagInput] = React.useState("");

  React.useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        assigneeId: task.assigneeId,
        priority: task.priority,
        dueDate: task.dueDate,
        tags: task.tags || [],
        estimatedHours: task.estimatedHours,
      });
      setStatus(task.status);
      setActualHours(task.actualHours);
    }
  }, [task]);

  const handleClose = () => {
    setErrors([]);
    setTagInput("");
    onClose();
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!task) return;

    const validationErrors = validateTaskForm(formData);
    setErrors(validationErrors);
    
    if (validationErrors.length === 0) {
      const assignee = teamMembers.find(member => member.id === formData.assigneeId);
      if (!assignee) return;

      const updatedTask: Task = {
        ...task,
        title: formData.title,
        description: formData.description,
        assigneeId: formData.assigneeId,
        assignee: assignee,
        priority: formData.priority,
        status: status,
        dueDate: formData.dueDate,
        updatedAt: new Date(),
        tags: formData.tags,
        estimatedHours: formData.estimatedHours,
        actualHours: actualHours,
        completedAt: status === "Completed" && task.status !== "Completed" 
          ? new Date() 
          : status !== "Completed" 
          ? undefined 
          : task.completedAt,
      };

      onSubmit(updatedTask);
      handleClose();
    }
  };

  const handleInputChange = (field: keyof TaskFormData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
  ) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: field === 'estimatedHours' ? (value ? parseFloat(value) : undefined) : value,
    }));
  };

  const handleDateChange = (date: Dayjs | null) => {
    setFormData(prev => ({
      ...prev,
      dueDate: date ? date.toDate() : null,
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAddTag();
    }
  };

  const activeTeamMembers = teamMembers.filter(member => member.isActive);

  if (!task) return null;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
              {errors.length > 0 && (
                <Box
                  sx={{
                    bgcolor: "error.light",
                    color: "error.contrastText",
                    p: 2,
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="subtitle2" gutterBottom>
                    Please fix the following errors:
                  </Typography>
                  <ul style={{ margin: 0, paddingLeft: 20 }}>
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </Box>
              )}

              <TextField
                fullWidth
                label="Task Title"
                value={formData.title}
                onChange={handleInputChange("title")}
                required
                error={errors.some(error => error.includes("title"))}
              />

              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={handleInputChange("description")}
                multiline
                rows={3}
              />

              <FormControl fullWidth required>
                <InputLabel>Assignee</InputLabel>
                <Select
                  value={formData.assigneeId}
                  onChange={handleInputChange("assigneeId")}
                  label="Assignee"
                  error={errors.some(error => error.includes("Assignee"))}
                  renderValue={(value) => {
                    const member = activeTeamMembers.find(m => m.id === value);
                    return member ? (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Avatar
                          src={member.avatar}
                          alt={member.name}
                          sx={{ width: 24, height: 24 }}
                        />
                        {member.name}
                      </Box>
                    ) : "";
                  }}
                >
                  {activeTeamMembers.map((member) => (
                    <MenuItem key={member.id} value={member.id}>
                      <ListItemAvatar>
                        <Avatar
                          src={member.avatar}
                          alt={member.name}
                          sx={{ width: 32, height: 32 }}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={member.name}
                        secondary={`${member.role} • ${member.email}`}
                      />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box sx={{ display: "flex", gap: 2 }}>
                <FormControl sx={{ minWidth: 160 }} required>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={formData.priority}
                    onChange={handleInputChange("priority")}
                    label="Priority"
                  >
                    {PRIORITY_OPTIONS.map((priority) => (
                      <MenuItem key={priority} value={priority}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              borderRadius: "50%",
                              bgcolor: priority === "High" ? "error.main" : 
                                      priority === "Medium" ? "warning.main" : "success.main",
                            }}
                          />
                          {priority}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl sx={{ minWidth: 160 }} required>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as TaskStatus)}
                    label="Status"
                  >
                    {STATUS_OPTIONS.map((statusOption) => (
                      <MenuItem key={statusOption} value={statusOption}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              borderRadius: "50%",
                              bgcolor: statusOption === "Not Started" ? "grey.500" :
                                      statusOption === "In Progress" ? "info.main" :
                                      statusOption === "Completed" ? "success.main" : "warning.main",
                            }}
                          />
                          {statusOption}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <DatePicker
                label="Due Date"
                value={formData.dueDate ? dayjs(formData.dueDate) : null}
                onChange={handleDateChange}
                minDate={dayjs()}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    helperText: "Leave empty if no specific due date",
                  },
                }}
              />

              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  label="Estimated Hours"
                  type="number"
                  value={formData.estimatedHours || ""}
                  onChange={handleInputChange("estimatedHours")}
                  inputProps={{ min: 0, step: 0.5 }}
                  sx={{ maxWidth: 200 }}
                />
                <TextField
                  label="Actual Hours"
                  type="number"
                  value={actualHours || ""}
                  onChange={(e) => setActualHours(e.target.value ? parseFloat(e.target.value) : undefined)}
                  inputProps={{ min: 0, step: 0.5 }}
                  sx={{ maxWidth: 200 }}
                />
              </Box>

              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Tags
                </Typography>
                <Box sx={{ display: "flex", gap: 1, mb: 1, flexWrap: "wrap" }}>
                  {formData.tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      onDelete={() => handleRemoveTag(tag)}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <TextField
                    size="small"
                    placeholder="Add tag"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    sx={{ flexGrow: 1 }}
                  />
                  <Button
                    variant="outlined"
                    onClick={handleAddTag}
                    disabled={!tagInput.trim() || formData.tags.includes(tagInput.trim())}
                  >
                    Add
                  </Button>
                </Box>
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              Update Task
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </LocalizationProvider>
  );
}
