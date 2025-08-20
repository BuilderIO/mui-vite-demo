import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Autocomplete from "@mui/material/Autocomplete";
import Avatar from "@mui/material/Avatar";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { User, TaskFilters as TaskFiltersType } from "../types/tasks";
import { getInitials } from "../utils/taskUtils";

interface TaskFiltersProps {
  filters: TaskFiltersType;
  onFiltersChange: (filters: TaskFiltersType) => void;
  users: User[];
  onClearFilters: () => void;
}

const statusOptions = [
  { value: "", label: "All Statuses" },
  { value: "todo", label: "To Do" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "on_hold", label: "On Hold" },
];

const priorityOptions = [
  { value: "", label: "All Priorities" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

export default function TaskFilters({
  filters,
  onFiltersChange,
  users,
  onClearFilters,
}: TaskFiltersProps) {
  const [startDate, setStartDate] = React.useState<Dayjs | null>(
    filters.dueDateRange?.start ? dayjs(filters.dueDateRange.start) : null
  );
  const [endDate, setEndDate] = React.useState<Dayjs | null>(
    filters.dueDateRange?.end ? dayjs(filters.dueDateRange.end) : null
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({
      ...filters,
      search: event.target.value,
    });
  };

  const handleStatusChange = (event: any) => {
    onFiltersChange({
      ...filters,
      status: event.target.value || undefined,
    });
  };

  const handlePriorityChange = (event: any) => {
    onFiltersChange({
      ...filters,
      priority: event.target.value || undefined,
    });
  };

  const handleAssigneeChange = (event: any, newValue: User | null) => {
    onFiltersChange({
      ...filters,
      assignee: newValue?.login.uuid || undefined,
    });
  };

  const handleStartDateChange = (newValue: Dayjs | null) => {
    setStartDate(newValue);
    onFiltersChange({
      ...filters,
      dueDateRange: {
        ...filters.dueDateRange,
        start: newValue ? newValue.format("YYYY-MM-DD") : undefined,
      },
    });
  };

  const handleEndDateChange = (newValue: Dayjs | null) => {
    setEndDate(newValue);
    onFiltersChange({
      ...filters,
      dueDateRange: {
        ...filters.dueDateRange,
        end: newValue ? newValue.format("YYYY-MM-DD") : undefined,
      },
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.status) count++;
    if (filters.priority) count++;
    if (filters.assignee) count++;
    if (filters.dueDateRange?.start || filters.dueDateRange?.end) count++;
    return count;
  };

  const selectedAssignee = users.find(user => user.login.uuid === filters.assignee);
  const activeFiltersCount = getActiveFiltersCount();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card variant="outlined">
        <CardContent>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <FilterListIcon color="action" />
              <Typography variant="h6" component="h2">
                Filters
              </Typography>
              {activeFiltersCount > 0 && (
                <Chip
                  label={`${activeFiltersCount} active`}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              )}
            </Stack>
            {activeFiltersCount > 0 && (
              <Button
                size="small"
                startIcon={<ClearIcon />}
                onClick={onClearFilters}
                color="secondary"
              >
                Clear All
              </Button>
            )}
          </Stack>

          <Stack spacing={2}>
            {/* Search */}
            <TextField
              fullWidth
              placeholder="Search tasks, descriptions, or assignees..."
              value={filters.search || ""}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
              }}
              size="small"
            />

            {/* Row 1: Status and Priority */}
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status || ""}
                  label="Status"
                  onChange={handleStatusChange}
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={filters.priority || ""}
                  label="Priority"
                  onChange={handlePriorityChange}
                >
                  {priorityOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Autocomplete
                size="small"
                sx={{ minWidth: 200, flexGrow: 1 }}
                options={users}
                getOptionLabel={(option) => `${option.name.first} ${option.name.last}`}
                value={selectedAssignee || null}
                onChange={handleAssigneeChange}
                renderOption={(props, option) => (
                  <li {...props}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Avatar
                        src={option.picture?.thumbnail}
                        sx={{ width: 24, height: 24 }}
                      >
                        {getInitials(option.name.first, option.name.last)}
                      </Avatar>
                      <Typography variant="body2">
                        {option.name.first} {option.name.last}
                      </Typography>
                    </Stack>
                  </li>
                )}
                renderInput={(params) => (
                  <TextField {...params} label="Assignee" />
                )}
              />
            </Stack>

            {/* Row 2: Date Range */}
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <DatePicker
                label="Due Date From"
                value={startDate}
                onChange={handleStartDateChange}
                slotProps={{
                  textField: {
                    size: "small",
                    sx: { minWidth: 150 },
                  },
                }}
              />
              <DatePicker
                label="Due Date To"
                value={endDate}
                onChange={handleEndDateChange}
                slotProps={{
                  textField: {
                    size: "small",
                    sx: { minWidth: 150 },
                  },
                }}
              />
            </Stack>

            {/* Active Filters Display */}
            {activeFiltersCount > 0 && (
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: "block" }}>
                  Active Filters:
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {filters.search && (
                    <Chip
                      label={`Search: "${filters.search}"`}
                      size="small"
                      onDelete={() => onFiltersChange({ ...filters, search: undefined })}
                      color="primary"
                      variant="outlined"
                    />
                  )}
                  {filters.status && (
                    <Chip
                      label={`Status: ${statusOptions.find(s => s.value === filters.status)?.label}`}
                      size="small"
                      onDelete={() => onFiltersChange({ ...filters, status: undefined })}
                      color="primary"
                      variant="outlined"
                    />
                  )}
                  {filters.priority && (
                    <Chip
                      label={`Priority: ${priorityOptions.find(p => p.value === filters.priority)?.label}`}
                      size="small"
                      onDelete={() => onFiltersChange({ ...filters, priority: undefined })}
                      color="primary"
                      variant="outlined"
                    />
                  )}
                  {filters.assignee && selectedAssignee && (
                    <Chip
                      avatar={
                        <Avatar src={selectedAssignee.picture?.thumbnail} sx={{ width: 20, height: 20 }}>
                          {getInitials(selectedAssignee.name.first, selectedAssignee.name.last)}
                        </Avatar>
                      }
                      label={`Assignee: ${selectedAssignee.name.first} ${selectedAssignee.name.last}`}
                      size="small"
                      onDelete={() => onFiltersChange({ ...filters, assignee: undefined })}
                      color="primary"
                      variant="outlined"
                    />
                  )}
                  {(filters.dueDateRange?.start || filters.dueDateRange?.end) && (
                    <Chip
                      label={`Due Date: ${filters.dueDateRange?.start || "any"} - ${filters.dueDateRange?.end || "any"}`}
                      size="small"
                      onDelete={() => onFiltersChange({ ...filters, dueDateRange: undefined })}
                      color="primary"
                      variant="outlined"
                    />
                  )}
                </Stack>
              </Box>
            )}
          </Stack>
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
}
