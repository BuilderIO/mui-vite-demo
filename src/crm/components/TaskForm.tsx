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
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { Task, User, TaskFormData } from "../types/tasks";
import { getInitials } from "../utils/taskUtils";

interface TaskFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (taskData: TaskFormData) => void;
  task?: Task;
  users: User[];
  loading?: boolean;
}

const priorityOptions = [
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

const statusOptions = [
  { value: "todo", label: "To Do" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "on_hold", label: "On Hold" },
];

const predefinedTags = [
  "Frontend",
  "Backend",
  "Bug Fix",
  "Feature",
  "Documentation",
  "Testing",
  "Performance",
  "Security",
  "Review",
  "Urgent",
];

export default function TaskForm({
  open,
  onClose,
  onSubmit,
  task,
  users,
  loading = false,
}: TaskFormProps) {
  const [formData, setFormData] = React.useState<TaskFormData>({
    title: "",
    description: "",
    priority: "medium",
    status: "todo",
    dueDate: "",
    assigneeId: "",
    tags: [],
  });

  const [dueDate, setDueDate] = React.useState<Dayjs | null>(null);
  const [tags, setTags] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || "",
        priority: task.priority,
        status: task.status,
        dueDate: task.dueDate || "",
        assigneeId: task.assignee?.login.uuid || "",
        tags: task.tags || [],
      });
      setDueDate(task.dueDate ? dayjs(task.dueDate) : null);
      setTags(task.tags || []);
    } else {
      setFormData({
        title: "",
        description: "",
        priority: "medium",
        status: "todo",
        dueDate: "",
        assigneeId: "",
        tags: [],
      });
      setDueDate(null);
      setTags([]);
    }
  }, [task, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      dueDate: dueDate ? dueDate.format("YYYY-MM-DD") : "",
      tags,
    };
    onSubmit(submitData);
  };

  const handleChange = (field: keyof TaskFormData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSelectChange = (field: keyof TaskFormData) => (
    event: any
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleTagsChange = (event: any, newValue: string[]) => {
    setTags(newValue);
  };

  const isFormValid = formData.title.trim() !== "";

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {task ? "Edit Task" : "Create New Task"}
          </DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <TextField
                label="Task Title"
                value={formData.title}
                onChange={handleChange("title")}
                fullWidth
                required
                autoFocus
              />
              
              <TextField
                label="Description"
                value={formData.description}
                onChange={handleChange("description")}
                fullWidth
                multiline
                rows={3}
              />

              <Box sx={{ display: "flex", gap: 2 }}>
                <FormControl sx={{ minWidth: 120, flex: 1 }}>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={formData.priority}
                    label="Priority"
                    onChange={handleSelectChange("priority")}
                  >
                    {priorityOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl sx={{ minWidth: 120, flex: 1 }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={formData.status}
                    label="Status"
                    onChange={handleSelectChange("status")}
                  >
                    {statusOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <DatePicker
                label="Due Date"
                value={dueDate}
                onChange={setDueDate}
                slotProps={{
                  textField: {
                    fullWidth: true,
                  },
                }}
              />

              <FormControl fullWidth>
                <Autocomplete
                  options={users}
                  getOptionLabel={(option) => `${option.name.first} ${option.name.last}`}
                  value={users.find(user => user.login.uuid === formData.assigneeId) || null}
                  onChange={(event, newValue) => {
                    setFormData(prev => ({
                      ...prev,
                      assigneeId: newValue?.login.uuid || "",
                    }));
                  }}
                  renderOption={(props, option) => (
                    <li {...props}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar
                          src={option.picture?.thumbnail}
                          sx={{ width: 32, height: 32 }}
                        >
                          {getInitials(option.name.first, option.name.last)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2">
                            {option.name.first} {option.name.last}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {option.email}
                          </Typography>
                        </Box>
                      </Stack>
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField {...params} label="Assign to" />
                  )}
                />
              </FormControl>

              <Autocomplete
                multiple
                freeSolo
                options={predefinedTags}
                value={tags}
                onChange={handleTagsChange}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      variant="outlined"
                      label={option}
                      {...getTagProps({ index })}
                      key={index}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Tags"
                    placeholder="Add tags..."
                  />
                )}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={!isFormValid || loading}
            >
              {loading ? "Saving..." : task ? "Update Task" : "Create Task"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </LocalizationProvider>
  );
}
