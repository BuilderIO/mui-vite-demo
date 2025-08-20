import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import SortIcon from "@mui/icons-material/Sort";
import ClearIcon from "@mui/icons-material/Clear";
import TaskCard from "./TaskCard";
import type { Task, TaskFilters, TaskSortOptions, TaskStatus, TaskPriority, TeamMember } from "../types/taskTypes";

interface TaskListProps {
  tasks: Task[];
  teamMembers: TeamMember[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  loading?: boolean;
}

const statusOptions = [
  { value: "todo", label: "To Do" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "on_hold", label: "On Hold" },
];

const priorityOptions = [
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

const sortFieldOptions = [
  { value: "dueDate", label: "Due Date" },
  { value: "priority", label: "Priority" },
  { value: "status", label: "Status" },
  { value: "createdAt", label: "Created Date" },
  { value: "title", label: "Title" },
];

export default function TaskList({
  tasks,
  teamMembers,
  onEdit,
  onDelete,
  onStatusChange,
  loading = false,
}: TaskListProps) {
  const [filters, setFilters] = React.useState<TaskFilters>({});
  const [sortOptions, setSortOptions] = React.useState<TaskSortOptions>({
    field: "dueDate",
    direction: "asc",
  });
  const [showFilters, setShowFilters] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleFilterChange = (key: keyof TaskFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSortChange = (field: TaskSortOptions["field"]) => {
    setSortOptions((prev) => ({
      field,
      direction: prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const clearFilters = () => {
    setFilters({});
    setSearchQuery("");
  };

  const getPriorityWeight = (priority: TaskPriority): number => {
    switch (priority) {
      case "high":
        return 3;
      case "medium":
        return 2;
      case "low":
        return 1;
      default:
        return 0;
    }
  };

  const getStatusWeight = (status: TaskStatus): number => {
    switch (status) {
      case "todo":
        return 1;
      case "in_progress":
        return 2;
      case "on_hold":
        return 3;
      case "completed":
        return 4;
      default:
        return 0;
    }
  };

  const filteredAndSortedTasks = React.useMemo(() => {
    let result = [...tasks];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          task.description?.toLowerCase().includes(query) ||
          task.tags?.some((tag) => tag.toLowerCase().includes(query)) ||
          `${task.assignee?.name.first} ${task.assignee?.name.last}`.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (filters.status && filters.status.length > 0) {
      result = result.filter((task) => filters.status!.includes(task.status));
    }

    // Apply priority filter
    if (filters.priority && filters.priority.length > 0) {
      result = result.filter((task) => filters.priority!.includes(task.priority));
    }

    // Apply assignee filter
    if (filters.assignee && filters.assignee.length > 0) {
      result = result.filter((task) => 
        task.assignee && filters.assignee!.includes(task.assignee.id)
      );
    }

    // Apply date range filter
    if (filters.dueDateRange?.start || filters.dueDateRange?.end) {
      result = result.filter((task) => {
        if (!task.dueDate) return false;
        const taskDate = new Date(task.dueDate);
        if (filters.dueDateRange?.start && taskDate < new Date(filters.dueDateRange.start)) {
          return false;
        }
        if (filters.dueDateRange?.end && taskDate > new Date(filters.dueDateRange.end)) {
          return false;
        }
        return true;
      });
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;

      switch (sortOptions.field) {
        case "dueDate":
          if (!a.dueDate && !b.dueDate) comparison = 0;
          else if (!a.dueDate) comparison = 1;
          else if (!b.dueDate) comparison = -1;
          else comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          break;
        case "priority":
          comparison = getPriorityWeight(b.priority) - getPriorityWeight(a.priority);
          break;
        case "status":
          comparison = getStatusWeight(a.status) - getStatusWeight(b.status);
          break;
        case "createdAt":
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
        default:
          comparison = 0;
      }

      return sortOptions.direction === "desc" ? -comparison : comparison;
    });

    return result;
  }, [tasks, filters, sortOptions, searchQuery]);

  const activeFiltersCount = React.useMemo(() => {
    let count = 0;
    if (filters.status?.length) count++;
    if (filters.priority?.length) count++;
    if (filters.assignee?.length) count++;
    if (filters.dueDateRange?.start || filters.dueDateRange?.end) count++;
    if (searchQuery.trim()) count++;
    return count;
  }, [filters, searchQuery]);

  return (
    <Box>
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Stack spacing={2}>
            <Stack direction="row" spacing={2} alignItems="center">
              <TextField
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  endAdornment: searchQuery && (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setSearchQuery("")}>
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ flex: 1 }}
              />
              <Button
                variant={showFilters ? "contained" : "outlined"}
                startIcon={<FilterListIcon />}
                onClick={() => setShowFilters(!showFilters)}
              >
                Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
              </Button>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Sort by</InputLabel>
                <Select
                  value={sortOptions.field}
                  label="Sort by"
                  onChange={(e) => handleSortChange(e.target.value as TaskSortOptions["field"])}
                >
                  {sortFieldOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <IconButton
                onClick={() => setSortOptions((prev) => ({ ...prev, direction: prev.direction === "asc" ? "desc" : "asc" }))}
                title={`Sort ${sortOptions.direction === "asc" ? "descending" : "ascending"}`}
              >
                <SortIcon sx={{ transform: sortOptions.direction === "desc" ? "rotate(180deg)" : "none" }} />
              </IconButton>
            </Stack>

            <Collapse in={showFilters}>
              <Stack spacing={2}>
                <Grid container spacing={2}>
                  <Grid xs={12} sm={6} md={3}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Status</InputLabel>
                      <Select
                        multiple
                        value={filters.status || []}
                        onChange={(e) => handleFilterChange("status", e.target.value)}
                        label="Status"
                        renderValue={(selected) => (
                          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                            {(selected as TaskStatus[]).map((value) => (
                              <Chip key={value} label={statusOptions.find(o => o.value === value)?.label} size="small" />
                            ))}
                          </Box>
                        )}
                      >
                        {statusOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid xs={12} sm={6} md={3}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Priority</InputLabel>
                      <Select
                        multiple
                        value={filters.priority || []}
                        onChange={(e) => handleFilterChange("priority", e.target.value)}
                        label="Priority"
                        renderValue={(selected) => (
                          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                            {(selected as TaskPriority[]).map((value) => (
                              <Chip key={value} label={priorityOptions.find(o => o.value === value)?.label} size="small" />
                            ))}
                          </Box>
                        )}
                      >
                        {priorityOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid xs={12} sm={6} md={3}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Assignee</InputLabel>
                      <Select
                        multiple
                        value={filters.assignee || []}
                        onChange={(e) => handleFilterChange("assignee", e.target.value)}
                        label="Assignee"
                        renderValue={(selected) => (
                          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                            {(selected as string[]).map((id) => {
                              const member = teamMembers.find(m => m.id === id);
                              return member ? (
                                <Chip key={id} label={`${member.name.first} ${member.name.last}`} size="small" />
                              ) : null;
                            })}
                          </Box>
                        )}
                      >
                        {teamMembers.map((member) => (
                          <MenuItem key={member.id} value={member.id}>
                            {member.name.first} {member.name.last}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid xs={12} sm={6} md={3}>
                    <Button
                      variant="outlined"
                      onClick={clearFilters}
                      disabled={activeFiltersCount === 0}
                      fullWidth
                    >
                      Clear Filters
                    </Button>
                  </Grid>
                </Grid>
              </Stack>
            </Collapse>
          </Stack>
        </CardContent>
      </Card>

      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Showing {filteredAndSortedTasks.length} of {tasks.length} tasks
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <Typography>Loading tasks...</Typography>
        </Box>
      ) : filteredAndSortedTasks.length === 0 ? (
        <Card variant="outlined">
          <CardContent sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No tasks found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {activeFiltersCount > 0
                ? "Try adjusting your filters to see more results."
                : "Create your first task to get started."}
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={2}>
          {filteredAndSortedTasks.map((task) => (
            <Grid key={task.id} xs={12} sm={6} lg={4}>
              <TaskCard
                task={task}
                onEdit={onEdit}
                onDelete={onDelete}
                onStatusChange={onStatusChange}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
