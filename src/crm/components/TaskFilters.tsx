import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import Button from "@mui/material/Button";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Dayjs } from "dayjs";
import ClearIcon from "@mui/icons-material/Clear";
import type { Task } from "../pages/Tasks";

interface TaskFiltersProps {
  filters: {
    priority: string[];
    status: string[];
    assignedTo: string[];
    dueDateRange: {
      start: Dayjs | null;
      end: Dayjs | null;
    };
  };
  onFiltersChange: (filters: any) => void;
  availableTasks: Task[];
}

const priorityOptions = [
  { value: "high", label: "High Priority", color: "#d32f2f" },
  { value: "medium", label: "Medium Priority", color: "#ed6c02" },
  { value: "low", label: "Low Priority", color: "#2e7d32" },
];

const statusOptions = [
  { value: "pending", label: "Pending", color: "#757575" },
  { value: "in_progress", label: "In Progress", color: "#0288d1" },
  { value: "completed", label: "Completed", color: "#2e7d32" },
  { value: "on_hold", label: "On Hold", color: "#ed6c02" },
];

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function TaskFilters({
  filters,
  onFiltersChange,
  availableTasks,
}: TaskFiltersProps) {
  // Get unique assignees from available tasks
  const availableAssignees = React.useMemo(() => {
    const assignees = new Map();
    availableTasks.forEach(task => {
      if (task.assignedTo) {
        assignees.set(task.assignedTo.id, task.assignedTo);
      }
    });
    return Array.from(assignees.values());
  }, [availableTasks]);

  const handlePriorityChange = (event: any) => {
    const value = typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value;
    onFiltersChange({ ...filters, priority: value });
  };

  const handleStatusChange = (event: any) => {
    const value = typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value;
    onFiltersChange({ ...filters, status: value });
  };

  const handleAssignedToChange = (event: any) => {
    const value = typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value;
    onFiltersChange({ ...filters, assignedTo: value });
  };

  const handleDateRangeChange = (field: 'start' | 'end', value: Dayjs | null) => {
    onFiltersChange({
      ...filters,
      dueDateRange: {
        ...filters.dueDateRange,
        [field]: value,
      },
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      priority: [],
      status: [],
      assignedTo: [],
      dueDateRange: {
        start: null,
        end: null,
      },
    });
  };

  const hasActiveFilters = filters.priority.length > 0 || 
                          filters.status.length > 0 || 
                          filters.assignedTo.length > 0 || 
                          filters.dueDateRange.start || 
                          filters.dueDateRange.end;

  return (
    <Card>
      <CardContent>
        <Stack spacing={3}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6" component="h3">
              Filter Tasks
            </Typography>
            {hasActiveFilters && (
              <Button
                size="small"
                onClick={clearAllFilters}
                startIcon={<ClearIcon />}
              >
                Clear All
              </Button>
            )}
          </Box>

          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            {/* Priority Filter */}
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Priority</InputLabel>
              <Select
                multiple
                value={filters.priority}
                onChange={handlePriorityChange}
                input={<OutlinedInput label="Priority" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => {
                      const option = priorityOptions.find(opt => opt.value === value);
                      return (
                        <Chip
                          key={value}
                          label={option?.label || value}
                          size="small"
                          sx={{
                            backgroundColor: option?.color + '20',
                            color: option?.color,
                            borderColor: option?.color,
                          }}
                          variant="outlined"
                        />
                      );
                    })}
                  </Box>
                )}
                MenuProps={MenuProps}
              >
                {priorityOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          backgroundColor: option.color,
                        }}
                      />
                      {option.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Status Filter */}
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Status</InputLabel>
              <Select
                multiple
                value={filters.status}
                onChange={handleStatusChange}
                input={<OutlinedInput label="Status" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => {
                      const option = statusOptions.find(opt => opt.value === value);
                      return (
                        <Chip
                          key={value}
                          label={option?.label || value}
                          size="small"
                          sx={{
                            backgroundColor: option?.color + '20',
                            color: option?.color,
                            borderColor: option?.color,
                          }}
                          variant="outlined"
                        />
                      );
                    })}
                  </Box>
                )}
                MenuProps={MenuProps}
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          backgroundColor: option.color,
                        }}
                      />
                      {option.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Assigned To Filter */}
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Assigned To</InputLabel>
              <Select
                multiple
                value={filters.assignedTo}
                onChange={handleAssignedToChange}
                input={<OutlinedInput label="Assigned To" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => {
                      const assignee = availableAssignees.find(a => a.id === value);
                      return (
                        <Chip
                          key={value}
                          label={assignee?.name || 'Unknown'}
                          size="small"
                          variant="outlined"
                        />
                      );
                    })}
                  </Box>
                )}
                MenuProps={MenuProps}
              >
                {availableAssignees.map((assignee) => (
                  <MenuItem key={assignee.id} value={assignee.id}>
                    <Box>
                      <Typography variant="body2">{assignee.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {assignee.email}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          {/* Date Range Filter */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Due Date Range
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <DatePicker
                label="From Date"
                value={filters.dueDateRange.start}
                onChange={(value) => handleDateRangeChange('start', value)}
                slotProps={{
                  textField: {
                    size: "small",
                    sx: { minWidth: 160 }
                  },
                }}
              />
              <DatePicker
                label="To Date"
                value={filters.dueDateRange.end}
                onChange={(value) => handleDateRangeChange('end', value)}
                slotProps={{
                  textField: {
                    size: "small",
                    sx: { minWidth: 160 }
                  },
                }}
                minDate={filters.dueDateRange.start || undefined}
              />
            </Stack>
          </Box>

          {/* Active Filters Summary */}
          {hasActiveFilters && (
            <Box sx={{ pt: 1, borderTop: 1, borderColor: 'divider' }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                Active Filters:
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {filters.priority.map((priority) => {
                  const option = priorityOptions.find(opt => opt.value === priority);
                  return (
                    <Chip
                      key={`priority-${priority}`}
                      label={`Priority: ${option?.label || priority}`}
                      size="small"
                      onDelete={() => {
                        onFiltersChange({
                          ...filters,
                          priority: filters.priority.filter(p => p !== priority)
                        });
                      }}
                      sx={{
                        backgroundColor: option?.color + '20',
                        color: option?.color,
                        '& .MuiChip-deleteIcon': { color: option?.color },
                      }}
                    />
                  );
                })}
                {filters.status.map((status) => {
                  const option = statusOptions.find(opt => opt.value === status);
                  return (
                    <Chip
                      key={`status-${status}`}
                      label={`Status: ${option?.label || status}`}
                      size="small"
                      onDelete={() => {
                        onFiltersChange({
                          ...filters,
                          status: filters.status.filter(s => s !== status)
                        });
                      }}
                      sx={{
                        backgroundColor: option?.color + '20',
                        color: option?.color,
                        '& .MuiChip-deleteIcon': { color: option?.color },
                      }}
                    />
                  );
                })}
                {filters.assignedTo.map((assigneeId) => {
                  const assignee = availableAssignees.find(a => a.id === assigneeId);
                  return (
                    <Chip
                      key={`assignee-${assigneeId}`}
                      label={`Assigned: ${assignee?.name || 'Unknown'}`}
                      size="small"
                      onDelete={() => {
                        onFiltersChange({
                          ...filters,
                          assignedTo: filters.assignedTo.filter(a => a !== assigneeId)
                        });
                      }}
                    />
                  );
                })}
                {(filters.dueDateRange.start || filters.dueDateRange.end) && (
                  <Chip
                    label={`Due: ${filters.dueDateRange.start?.format('MMM DD') || '...'} - ${filters.dueDateRange.end?.format('MMM DD') || '...'}`}
                    size="small"
                    onDelete={() => {
                      onFiltersChange({
                        ...filters,
                        dueDateRange: { start: null, end: null }
                      });
                    }}
                  />
                )}
              </Stack>
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
