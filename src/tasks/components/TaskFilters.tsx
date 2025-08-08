import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  TextField,
  Autocomplete,
  Button,
  Collapse,
  IconButton,
  Divider,
  Stack,
  OutlinedInput,
  SelectChangeEvent,
} from '@mui/material';
import {
  FilterList as FilterListIcon,
  Clear as ClearIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { TaskFilters, TaskStatus, TaskPriority } from '../types/Task';
import { useTaskContext } from '../context/TaskContext';

const statusOptions: TaskStatus[] = ['Not Started', 'In Progress', 'Completed', 'On Hold'];
const priorityOptions: TaskPriority[] = ['High', 'Medium', 'Low'];

interface TaskFiltersComponentProps {
  onFiltersChange?: (filters: TaskFilters) => void;
}

export default function TaskFiltersComponent({ onFiltersChange }: TaskFiltersComponentProps) {
  const { filters, updateFilters, teamMembers, tasks } = useTaskContext();
  const [expanded, setExpanded] = useState(false);
  
  // Get all unique tags from tasks
  const allTags = Array.from(new Set(tasks.flatMap(task => task.tags))).sort();

  // Local state for date range
  const [dateRange, setDateRange] = useState<{
    from: Dayjs | null;
    to: Dayjs | null;
  }>({
    from: filters.dueDate?.from ? dayjs(filters.dueDate.from) : null,
    to: filters.dueDate?.to ? dayjs(filters.dueDate.to) : null,
  });

  const handleFilterChange = (filterType: keyof TaskFilters, value: any) => {
    const newFilters = {
      ...filters,
      [filterType]: value,
    };

    updateFilters(newFilters);
    if (onFiltersChange) {
      onFiltersChange(newFilters);
    }
  };

  const handleStatusChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value as string[];
    handleFilterChange('status', value.length > 0 ? value as TaskStatus[] : undefined);
  };

  const handlePriorityChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value as string[];
    handleFilterChange('priority', value.length > 0 ? value as TaskPriority[] : undefined);
  };

  const handleAssigneeChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value as string[];
    handleFilterChange('assignee', value.length > 0 ? value : undefined);
  };

  const handleTagsChange = (_: any, newValue: string[]) => {
    handleFilterChange('tags', newValue.length > 0 ? newValue : undefined);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    handleFilterChange('searchQuery', value.trim() ? value.trim() : undefined);
  };

  const handleDateRangeChange = (field: 'from' | 'to', value: Dayjs | null) => {
    const newDateRange = { ...dateRange, [field]: value };
    setDateRange(newDateRange);

    const dueDate = {
      from: newDateRange.from?.toDate(),
      to: newDateRange.to?.toDate(),
    };

    // Only update if we have at least one date
    if (dueDate.from || dueDate.to) {
      handleFilterChange('dueDate', dueDate);
    } else {
      handleFilterChange('dueDate', undefined);
    }
  };

  const clearAllFilters = () => {
    setDateRange({ from: null, to: null });
    updateFilters({});
    if (onFiltersChange) {
      onFiltersChange({});
    }
  };

  const hasActiveFilters = () => {
    return (
      filters.status?.length ||
      filters.priority?.length ||
      filters.assignee?.length ||
      filters.tags?.length ||
      filters.searchQuery ||
      filters.dueDate?.from ||
      filters.dueDate?.to
    );
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.status?.length) count++;
    if (filters.priority?.length) count++;
    if (filters.assignee?.length) count++;
    if (filters.tags?.length) count++;
    if (filters.searchQuery) count++;
    if (filters.dueDate?.from || filters.dueDate?.to) count++;
    return count;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FilterListIcon color="primary" />
            <Typography variant="h6" component="h2">
              Filters
            </Typography>
            {hasActiveFilters() && (
              <Chip
                size="small"
                label={`${getActiveFilterCount()} active`}
                color="primary"
                variant="outlined"
              />
            )}
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {hasActiveFilters() && (
              <Button
                size="small"
                onClick={clearAllFilters}
                startIcon={<ClearIcon />}
                color="secondary"
              >
                Clear All
              </Button>
            )}
            <IconButton
              size="small"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>
        </Box>

        {/* Search - Always visible */}
        <TextField
          fullWidth
          placeholder="Search tasks by title, description, or tags..."
          value={filters.searchQuery || ''}
          onChange={handleSearchChange}
          size="small"
          sx={{ mb: expanded ? 2 : 0 }}
        />

        <Collapse in={expanded}>
          <Divider sx={{ my: 2 }} />
          
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  multiple
                  value={filters.status || []}
                  onChange={handleStatusChange}
                  input={<OutlinedInput label="Status" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {(selected as string[]).map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {statusOptions.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Priority</InputLabel>
                <Select
                  multiple
                  value={filters.priority || []}
                  onChange={handlePriorityChange}
                  input={<OutlinedInput label="Priority" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {(selected as string[]).map((value) => (
                        <Chip
                          key={value}
                          label={value}
                          size="small"
                          sx={{
                            backgroundColor: 
                              value === 'High' ? '#f44336' :
                              value === 'Medium' ? '#ff9800' : '#4caf50',
                            color: 'white',
                          }}
                        />
                      ))}
                    </Box>
                  )}
                >
                  {priorityOptions.map((priority) => (
                    <MenuItem key={priority} value={priority}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            backgroundColor: 
                              priority === 'High' ? '#f44336' :
                              priority === 'Medium' ? '#ff9800' : '#4caf50'
                          }}
                        />
                        {priority}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Assignee</InputLabel>
                <Select
                  multiple
                  value={filters.assignee || []}
                  onChange={handleAssigneeChange}
                  input={<OutlinedInput label="Assignee" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {(selected as string[]).map((value) => {
                        const member = teamMembers.find(m => m.id === value);
                        return (
                          <Chip key={value} label={member?.name || value} size="small" />
                        );
                      })}
                    </Box>
                  )}
                >
                  {teamMembers.map((member) => (
                    <MenuItem key={member.id} value={member.id}>
                      {member.name} ({member.role})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <DatePicker
                label="Due Date From"
                value={dateRange.from}
                onChange={(value) => handleDateRangeChange('from', value)}
                sx={{ minWidth: 200 }}
                slotProps={{
                  textField: { size: 'small' }
                }}
              />

              <DatePicker
                label="Due Date To"
                value={dateRange.to}
                onChange={(value) => handleDateRangeChange('to', value)}
                sx={{ minWidth: 200 }}
                slotProps={{
                  textField: { size: 'small' }
                }}
              />
            </Box>

            <Autocomplete
              multiple
              options={allTags}
              value={filters.tags || []}
              onChange={handleTagsChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Tags"
                  placeholder="Select tags to filter..."
                  size="small"
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    variant="outlined"
                    label={option}
                    size="small"
                    {...getTagProps({ index })}
                    key={option}
                  />
                ))
              }
              sx={{ minWidth: 300 }}
            />
          </Stack>
        </Collapse>
      </Paper>
    </LocalizationProvider>
  );
}
