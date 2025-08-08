import * as React from 'react';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Button,
  Grid,
  Typography,
  IconButton,
  Collapse,
  Paper,
  OutlinedInput,
  SelectChangeEvent,
  Autocomplete,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  Sort as SortIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';

import { TaskFilters, TaskSortOptions, TaskPriority, TaskStatus } from '../types/task';
import { mockTeamMembers } from '../data/mockTasks';

interface TaskFiltersPanelProps {
  filters: TaskFilters;
  onFiltersChange: (filters: TaskFilters) => void;
  sortOptions: TaskSortOptions;
  onSortChange: (sortOptions: TaskSortOptions) => void;
}

const priorityOptions: TaskPriority[] = ['High', 'Medium', 'Low'];
const statusOptions: TaskStatus[] = ['Not Started', 'In Progress', 'On Hold', 'Completed'];
const sortFieldOptions = [
  { value: 'dueDate', label: 'Due Date' },
  { value: 'createdAt', label: 'Created Date' },
  { value: 'priority', label: 'Priority' },
  { value: 'status', label: 'Status' },
  { value: 'title', label: 'Title' },
] as const;

export default function TaskFiltersPanel({
  filters,
  onFiltersChange,
  sortOptions,
  onSortChange,
}: TaskFiltersPanelProps) {
  const [expanded, setExpanded] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState(filters.search || '');

  // Debounce search input
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      onFiltersChange({ ...filters, search: searchValue });
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchValue]);

  const handleStatusChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value as string[];
    onFiltersChange({
      ...filters,
      status: value.length > 0 ? value as TaskStatus[] : undefined,
    });
  };

  const handlePriorityChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value as string[];
    onFiltersChange({
      ...filters,
      priority: value.length > 0 ? value as TaskPriority[] : undefined,
    });
  };

  const handleAssigneeChange = (event: any, newValue: any[]) => {
    onFiltersChange({
      ...filters,
      assigneeId: newValue.length > 0 ? newValue.map((assignee: any) => assignee.id) : undefined,
    });
  };

  const handleOverdueToggle = () => {
    onFiltersChange({
      ...filters,
      overdue: filters.overdue === undefined ? true : filters.overdue ? false : undefined,
    });
  };

  const handleClearFilters = () => {
    setSearchValue('');
    onFiltersChange({});
  };

  const handleSortFieldChange = (event: SelectChangeEvent) => {
    onSortChange({
      ...sortOptions,
      field: event.target.value as TaskSortOptions['field'],
    });
  };

  const handleSortDirectionToggle = () => {
    onSortChange({
      ...sortOptions,
      direction: sortOptions.direction === 'asc' ? 'desc' : 'asc',
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.status?.length) count++;
    if (filters.priority?.length) count++;
    if (filters.assigneeId?.length) count++;
    if (filters.overdue !== undefined) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();
  const selectedAssignees = mockTeamMembers.filter(member => 
    filters.assigneeId?.includes(member.id)
  );

  return (
    <Box>
      {/* Search and Quick Actions */}
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            placeholder="Search tasks by title, description, assignee..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              endAdornment: searchValue && (
                <IconButton size="small" onClick={() => setSearchValue('')}>
                  <ClearIcon />
                </IconButton>
              ),
            }}
            size="small"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              startIcon={<FilterIcon />}
              onClick={() => setExpanded(!expanded)}
              sx={{ minWidth: 'auto' }}
              endIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            >
              Filters
              {activeFiltersCount > 0 && (
                <Chip
                  label={activeFiltersCount}
                  size="small"
                  color="primary"
                  sx={{ ml: 1, height: 20, minWidth: 20 }}
                />
              )}
            </Button>
            {activeFiltersCount > 0 && (
              <Button
                variant="text"
                startIcon={<ClearIcon />}
                onClick={handleClearFilters}
                size="small"
                color="error"
              >
                Clear
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>

      {/* Advanced Filters */}
      <Collapse in={expanded}>
        <Paper 
          elevation={1} 
          sx={{ 
            mt: 2, 
            p: 3, 
            bgcolor: 'grey.50',
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
            Advanced Filters & Sorting
          </Typography>
          
          <Grid container spacing={3}>
            {/* Status Filter */}
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  multiple
                  value={filters.status || []}
                  onChange={handleStatusChange}
                  input={<OutlinedInput label="Status" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
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
            </Grid>

            {/* Priority Filter */}
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Priority</InputLabel>
                <Select
                  multiple
                  value={filters.priority || []}
                  onChange={handlePriorityChange}
                  input={<OutlinedInput label="Priority" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip 
                          key={value} 
                          label={value} 
                          size="small"
                          color={
                            value === 'High' ? 'error' : 
                            value === 'Medium' ? 'warning' : 'success'
                          }
                        />
                      ))}
                    </Box>
                  )}
                >
                  {priorityOptions.map((priority) => (
                    <MenuItem key={priority} value={priority}>
                      {priority}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Assignee Filter */}
            <Grid item xs={12} sm={6} md={3}>
              <Autocomplete
                multiple
                size="small"
                options={mockTeamMembers}
                getOptionLabel={(option) => option.name}
                value={selectedAssignees}
                onChange={handleAssigneeChange}
                renderInput={(params) => (
                  <TextField {...params} label="Assignee" />
                )}
                renderTags={(tagValue, getTagProps) =>
                  tagValue.map((option, index) => (
                    <Chip
                      label={option.name}
                      {...getTagProps({ index })}
                      size="small"
                      key={option.id}
                    />
                  ))
                }
              />
            </Grid>

            {/* Sort Options */}
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Sort by</InputLabel>
                  <Select
                    value={sortOptions.field}
                    onChange={handleSortFieldChange}
                    label="Sort by"
                  >
                    {sortFieldOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <IconButton
                  onClick={handleSortDirectionToggle}
                  size="small"
                  sx={{ 
                    border: 1, 
                    borderColor: 'divider',
                    transform: sortOptions.direction === 'desc' ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.2s ease'
                  }}
                  title={`Sort ${sortOptions.direction === 'asc' ? 'Ascending' : 'Descending'}`}
                >
                  <SortIcon />
                </IconButton>
              </Box>
            </Grid>

            {/* Quick Filters */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                  Quick filters:
                </Typography>
                <Chip
                  label="Overdue"
                  onClick={handleOverdueToggle}
                  color={filters.overdue === true ? 'error' : 'default'}
                  variant={filters.overdue === true ? 'filled' : 'outlined'}
                  size="small"
                />
                <Chip
                  label="My Tasks"
                  onClick={() => handleAssigneeChange(null, [mockTeamMembers[0]])}
                  color={filters.assigneeId?.includes('1') ? 'primary' : 'default'}
                  variant={filters.assigneeId?.includes('1') ? 'filled' : 'outlined'}
                  size="small"
                />
                <Chip
                  label="High Priority"
                  onClick={() => onFiltersChange({ ...filters, priority: ['High'] })}
                  color={filters.priority?.includes('High') ? 'error' : 'default'}
                  variant={filters.priority?.includes('High') ? 'filled' : 'outlined'}
                  size="small"
                />
                <Chip
                  label="In Progress"
                  onClick={() => onFiltersChange({ ...filters, status: ['In Progress'] })}
                  color={filters.status?.includes('In Progress') ? 'info' : 'default'}
                  variant={filters.status?.includes('In Progress') ? 'filled' : 'outlined'}
                  size="small"
                />
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Collapse>
    </Box>
  );
}
