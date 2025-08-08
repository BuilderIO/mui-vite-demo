import * as React from "react";
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
  FormHelperText,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { Task, TaskPriority, TaskStatus, useTaskContext } from "../contexts/TaskContext";

interface TaskFormProps {
  open: boolean;
  onClose: () => void;
  task?: Task | null;
  mode: "create" | "edit";
}

interface FormData {
  title: string;
  description: string;
  assigneeId: string;
  dueDate: dayjs.Dayjs | null;
  priority: TaskPriority;
  status: TaskStatus;
}

const initialFormData: FormData = {
  title: "",
  description: "",
  assigneeId: "",
  dueDate: null,
  priority: "medium",
  status: "not_started",
};

export default function TaskForm({ open, onClose, task, mode }: TaskFormProps) {
  const { teamMembers, createTask, updateTask } = useTaskContext();
  const [formData, setFormData] = React.useState<FormData>(initialFormData);
  const [errors, setErrors] = React.useState<Partial<FormData>>({});

  React.useEffect(() => {
    if (task && mode === "edit") {
      setFormData({
        title: task.title,
        description: task.description || "",
        assigneeId: task.assigneeId || "",
        dueDate: task.dueDate ? dayjs(task.dueDate) : null,
        priority: task.priority,
        status: task.status,
      });
    } else {
      setFormData(initialFormData);
    }
    setErrors({});
  }, [task, mode, open]);

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (formData.dueDate && formData.dueDate.isBefore(dayjs(), "day")) {
      newErrors.dueDate = "Due date cannot be in the past";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const taskData = {
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      assigneeId: formData.assigneeId || undefined,
      dueDate: formData.dueDate ? formData.dueDate.toDate() : undefined,
      priority: formData.priority,
      status: formData.status,
    };

    if (mode === "create") {
      createTask(taskData);
    } else if (task) {
      updateTask(task.id, taskData);
    }

    onClose();
  };

  const handleChange = (field: keyof FormData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any
  ) => {
    const value = event.target ? event.target.value : event;
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleDateChange = (newValue: dayjs.Dayjs | null) => {
    setFormData((prev) => ({ ...prev, dueDate: newValue }));
    if (errors.dueDate) {
      setErrors((prev) => ({ ...prev, dueDate: undefined }));
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {mode === "create" ? "Create New Task" : "Edit Task"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 1 }}>
            <TextField
              label="Task Title"
              value={formData.title}
              onChange={handleChange("title")}
              error={!!errors.title}
              helperText={errors.title}
              required
              fullWidth
            />

            <TextField
              label="Description"
              value={formData.description}
              onChange={handleChange("description")}
              multiline
              rows={3}
              fullWidth
            />

            <FormControl fullWidth>
              <InputLabel>Assignee</InputLabel>
              <Select
                value={formData.assigneeId}
                onChange={handleChange("assigneeId")}
                label="Assignee"
              >
                <MenuItem value="">
                  <em>Unassigned</em>
                </MenuItem>
                {teamMembers.map((member) => (
                  <MenuItem key={member.id} value={member.id}>
                    {member.name} ({member.email})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <DatePicker
              label="Due Date"
              value={formData.dueDate}
              onChange={handleDateChange}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!errors.dueDate,
                  helperText: errors.dueDate,
                },
              }}
              minDate={dayjs()}
            />

            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={formData.priority}
                onChange={handleChange("priority")}
                label="Priority"
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                onChange={handleChange("status")}
                label="Status"
              >
                <MenuItem value="not_started">Not Started</MenuItem>
                <MenuItem value="in_progress">In Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="on_hold">On Hold</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {mode === "create" ? "Create Task" : "Update Task"}
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}
