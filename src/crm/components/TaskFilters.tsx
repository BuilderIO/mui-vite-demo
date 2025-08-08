import * as React from 'react';
import {
  Box,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Autocomplete,
  Avatar,
  Button,
  Divider,
  OutlinedInput,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { TaskFilters, TaskPriority, TaskStatus, TeamMember } from '../types/taskTypes';
import { mockTeamMembers, formatTaskStatus, formatTaskPriority } from '../data/taskData';

interface TaskFiltersProps {
  filters: TaskFilters;
  onFiltersChange: (filters: TaskFilters) => void;
  totalTasks: number;
  filteredCount: number;
}

const priorityOptions: TaskPriority[] = ['high', 'medium', 'low'];
const statusOptions: TaskStatus[] = ['not_started', 'in_progress', 'completed', 'on_hold'];

export default function TaskFilters({ 
  filters, 
  onFiltersChange, 
  totalTasks, 
  filteredCount 
}: TaskFiltersProps) {
  const [dueDateFrom, setDueDateFrom] = React.useState<Dayjs | null>(
    filters.dueDateFrom ? dayjs(filters.dueDateFrom) : null
  );
  const [dueDateTo, setDueDateTo] = React.useState<Dayjs | null>(
    filters.dueDateTo ? dayjs(filters.dueDateTo) : null
  );

  const hasActiveFilters = React.useMemo(() => {
    return (
      (filters.status && filters.status.length > 0) ||
      (filters.priority && filters.priority.length > 0) ||
      (filters.assigneeId && filters.assigneeId.length > 0) ||
      filters.dueDateFrom ||
      filters.dueDateTo ||
      (filters.search && filters.search.trim().length > 0)
    );
  }, [filters]);

  const handleSearchChange = (value: string) => {
    onFiltersChange({
      ...filters,
      search: value || undefined,
    });
  };

  const handleStatusChange = (statuses: TaskStatus[]) => {
    onFiltersChange({
      ...filters,
      status: statuses.length > 0 ? statuses : undefined,
    });
  };

  const handlePriorityChange = (priorities: TaskPriority[]) => {
    onFiltersChange({
      ...filters,
      priority: priorities.length > 0 ? priorities : undefined,
    });
  };

  const handleAssigneeChange = (assigneeIds: string[]) => {
    onFiltersChange({
      ...filters,
      assigneeId: assigneeIds.length > 0 ? assigneeIds : undefined,
    });
  };

  const handleDateFromChange = (date: Dayjs | null) => {
    setDueDateFrom(date);
    onFiltersChange({
      ...filters,
      dueDateFrom: date ? date.format('YYYY-MM-DD') : undefined,
    });
  };

  const handleDateToChange = (date: Dayjs | null) => {
    setDueDateTo(date);
    onFiltersChange({
      ...filters,
      dueDateTo: date ? date.format('YYYY-MM-DD') : undefined,
    });
  };

  const handleClearFilters = () => {
    setDueDateFrom(null);
    setDueDateTo(null);
    onFiltersChange({});
  };

  const selectedAssignees = mockTeamMembers.filter(member => 
    filters.assigneeId?.includes(member.id)
  );

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Stack spacing={3}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FilterListIcon color="action" />
            <Typography variant="h6">
              Filters
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ({filteredCount} of {totalTasks} tasks)
            </Typography>
          </Box>
          {hasActiveFilters && (
            <Button
              size="small"
              startIcon={<ClearIcon />}
              onClick={handleClearFilters}
              color="inherit"
            >
              Clear All
            </Button>
          )}
        </Box>

        {/* Search */}
        <TextField
          fullWidth
          placeholder="Search tasks by title or description..."
          value={filters.search || ''}
          onChange={(e) => handleSearchChange(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
          }}
          variant="outlined"
          size="small"
        />

        {/* Quick Status Filters */}
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Status
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {statusOptions.map((status) => (
              <Chip
                key={status}
                label={formatTaskStatus(status)}
                onClick={() => {
                  const currentStatuses = filters.status || [];
                  const newStatuses = currentStatuses.includes(status)
                    ? currentStatuses.filter(s => s !== status)
                    : [...currentStatuses, status];
                  handleStatusChange(newStatuses);
                }}
                variant={filters.status?.includes(status) ? 'filled' : 'outlined'}
                color={filters.status?.includes(status) ? 'primary' : 'default'}
                size="small"
              />
            ))}
          </Stack>
        </Box>

        {/* Advanced Filters */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle2">Advanced Filters</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={3}>
              {/* Priority Filter */}
              <FormControl fullWidth size="small">
                <InputLabel>Priority</InputLabel>
                <Select
                  multiple
                  value={filters.priority || []}
                  onChange={(e) => handlePriorityChange(e.target.value as TaskPriority[])}
                  input={<OutlinedInput label="Priority" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={formatTaskPriority(value)} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {priorityOptions.map((priority) => (
                    <MenuItem key={priority} value={priority}>
                      {formatTaskPriority(priority)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Assignee Filter */}
              <Autocomplete
                multiple
                options={mockTeamMembers}
                getOptionLabel={(option) => option.name}
                value={selectedAssignees}
                onChange={(_, newValue) => {
                  handleAssigneeChange(newValue.map(member => member.id));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Assignees"
                    placeholder="Select team members"
                    size="small"
                  />
                )}
                renderOption={(props, option) => (
                  <Box component="li" {...props}>
                    <Avatar
                      src={option.avatar}
                      sx={{ width: 24, height: 24, mr: 1 }}
                    >
                      {option.name.split(' ').map(n => n[0]).join('')}
                    </Avatar>
                    {option.name}
                  </Box>
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      key={option.id}
                      avatar={
                        <Avatar src={option.avatar} sx={{ width: 20, height: 20 }}>
                          {option.name.split(' ').map(n => n[0]).join('')}
                        </Avatar>
                      }
                      label={option.name}
                      size="small"
                    />
                  ))
                }
              />

              {/* Due Date Range */}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Stack direction="row" spacing={2}>
                  <DatePicker
                    label="Due Date From"
                    value={dueDateFrom}
                    onChange={handleDateFromChange}
                    slotProps={{
                      textField: {
                        size: 'small',
                        fullWidth: true,
                      },
                    }}
                  />
                  <DatePicker
                    label="Due Date To"
                    value={dueDateTo}
                    onChange={handleDateToChange}
                    minDate={dueDateFrom || undefined}
                    slotProps={{
                      textField: {
                        size: 'small',
                        fullWidth: true,
                      },
                    }}
                  />
                </Stack>
              </LocalizationProvider>
            </Stack>
          </AccordionDetails>
        </Accordion>

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <Box>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="subtitle2" gutterBottom>
              Active Filters:
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {filters.search && (
                <Chip
                  label={`Search: "${filters.search}"`}
                  onDelete={() => handleSearchChange('')}
                  size="small"
                  variant="outlined"
                />
              )}
              {filters.status?.map((status) => (
                <Chip
                  key={`status-${status}`}
                  label={`Status: ${formatTaskStatus(status)}`}
                  onDelete={() => {
                    const newStatuses = filters.status!.filter(s => s !== status);
                    handleStatusChange(newStatuses);
                  }}
                  size="small"
                  variant="outlined"
                />
              ))}
              {filters.priority?.map((priority) => (
                <Chip
                  key={`priority-${priority}`}
                  label={`Priority: ${formatTaskPriority(priority)}`}
                  onDelete={() => {
                    const newPriorities = filters.priority!.filter(p => p !== priority);
                    handlePriorityChange(newPriorities);
                  }}
                  size="small"
                  variant="outlined"
                />
              ))}
              {selectedAssignees.map((assignee) => (
                <Chip
                  key={`assignee-${assignee.id}`}
                  avatar={
                    <Avatar src={assignee.avatar} sx={{ width: 20, height: 20 }}>
                      {assignee.name.split(' ').map(n => n[0]).join('')}
                    </Avatar>
                  }
                  label={assignee.name}
                  onDelete={() => {
                    const newAssignees = filters.assigneeId!.filter(id => id !== assignee.id);
                    handleAssigneeChange(newAssignees);
                  }}
                  size="small"
                  variant="outlined"
                />
              ))}
              {filters.dueDateFrom && (
                <Chip
                  label={`From: ${dayjs(filters.dueDateFrom).format('MMM DD, YYYY')}`}
                  onDelete={() => handleDateFromChange(null)}
                  size="small"
                  variant="outlined"
                />
              )}
              {filters.dueDateTo && (
                <Chip
                  label={`To: ${dayjs(filters.dueDateTo).format('MMM DD, YYYY')}`}
                  onDelete={() => handleDateToChange(null)}
                  size="small"
                  variant="outlined"
                />
              )}
            </Stack>
          </Box>
        )}
      </Stack>
    </Paper>
  );
}
