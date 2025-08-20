import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete";
import Avatar from "@mui/material/Avatar";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import type { Task, TaskFormData, TaskPriority, TeamMember } from "../types/taskTypes";

interface TaskFormProps {
  task?: Task;
  onSubmit: (data: TaskFormData) => void;
  onCancel: () => void;
  teamMembers: TeamMember[];
  loading?: boolean;
}

const priorityOptions = [
  { value: "low" as TaskPriority, label: "Low", color: "#4caf50" },
  { value: "medium" as TaskPriority, label: "Medium", color: "#ff9800" },
  { value: "high" as TaskPriority, label: "High", color: "#f44336" },
];

const commonTags = [
  "Design",
  "Development",
  "Bug Fix",
  "Feature",
  "Research",
  "Meeting",
  "Documentation",
  "Testing",
  "Review",
  "Planning",
];

export default function TaskForm({
  task,
  onSubmit,
  onCancel,
  teamMembers,
  loading = false,
}: TaskFormProps) {
  const [formData, setFormData] = React.useState<TaskFormData>({
    title: task?.title || "",
    description: task?.description || "",
    priority: task?.priority || "medium",
    assigneeId: task?.assignee?.id || "",
    dueDate: task?.dueDate || "",
    tags: task?.tags || [],
    estimatedHours: task?.estimatedHours || undefined,
    reminderDate: task?.reminderDate || "",
  });

  const [dueDate, setDueDate] = React.useState<Dayjs | null>(
    task?.dueDate ? dayjs(task.dueDate) : null
  );
  const [reminderDate, setReminderDate] = React.useState<Dayjs | null>(
    task?.reminderDate ? dayjs(task.reminderDate) : null
  );

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit({
      ...formData,
      dueDate: dueDate?.toISOString() || "",
      reminderDate: reminderDate?.toISOString() || "",
    });
  };

  const handleInputChange = (field: keyof TaskFormData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { value: unknown } }
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleTagsChange = (_: any, newTags: string[]) => {
    setFormData((prev) => ({
      ...prev,
      tags: newTags,
    }));
  };

  const isFormValid = formData.title.trim().length > 0;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" component="h2" sx={{ mb: 3 }}>
            {task ? "Edit Task" : "Create New Task"}
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Stack spacing={3}>
              <TextField
                required
                fullWidth
                label="Task Title"
                value={formData.title}
                onChange={handleInputChange("title")}
                error={!formData.title.trim() && formData.title.length > 0}
                helperText={
                  !formData.title.trim() && formData.title.length > 0
                    ? "Title is required"
                    : ""
                }
              />

              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={formData.description}
                onChange={handleInputChange("description")}
                placeholder="Describe the task details..."
              />

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={formData.priority}
                    label="Priority"
                    onChange={handleInputChange("priority")}
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

                <FormControl fullWidth>
                  <InputLabel>Assignee</InputLabel>
                  <Select
                    value={formData.assigneeId}
                    label="Assignee"
                    onChange={handleInputChange("assigneeId")}
                  >
                    <MenuItem value="">
                      <em>Unassigned</em>
                    </MenuItem>
                    {teamMembers.map((member) => (
                      <MenuItem key={member.id} value={member.id}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Avatar
                            src={member.picture?.thumbnail}
                            sx={{ width: 24, height: 24 }}
                          >
                            {member.name.first[0]}
                          </Avatar>
                          {member.name.first} {member.name.last}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <DateTimePicker
                  label="Due Date"
                  value={dueDate}
                  onChange={setDueDate}
                  sx={{ flex: 1 }}
                />

                <TextField
                  type="number"
                  label="Estimated Hours"
                  value={formData.estimatedHours || ""}
                  onChange={handleInputChange("estimatedHours")}
                  sx={{ flex: 1 }}
                  inputProps={{ min: 0, step: 0.5 }}
                />
              </Stack>

              <DateTimePicker
                label="Reminder Date/Time"
                value={reminderDate}
                onChange={setReminderDate}
                helperText="Set a reminder for this task"
              />

              <Autocomplete
                multiple
                freeSolo
                options={commonTags}
                value={formData.tags || []}
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
                    helperText="Type and press Enter to add custom tags"
                  />
                )}
              />

              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  onClick={onCancel}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={!isFormValid || loading}
                >
                  {loading ? "Saving..." : task ? "Update Task" : "Create Task"}
                </Button>
              </Stack>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
}
