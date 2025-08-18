import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import FilterListIcon from '@mui/icons-material/FilterList';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskFilters, TaskPriority, TaskStatus, TeamMember } from '../types/taskTypes';

interface TaskFiltersProps {
  filters: TaskFilters;
  teamMembers: TeamMember[];
  onFiltersChange: (filters: TaskFilters) => void;
  taskCounts?: {
    total: number;
    filtered: number;
  };
}

const priorityOptions: { value: TaskPriority; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' }
];

const statusOptions: { value: TaskStatus; label: string }[] = [
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'on_hold', label: 'On Hold' }
];

export default function TaskFilters({
  filters,
  teamMembers,
  onFiltersChange,
  taskCounts
}: TaskFiltersProps) {
  const [expanded, setExpanded] = React.useState(false);
  const [dueDateFrom, setDueDateFrom] = React.useState<Dayjs | null>(
    filters.dueDateFrom ? dayjs(filters.dueDateFrom) : null
  );
  const [dueDateTo, setDueDateTo] = React.useState<Dayjs | null>(
    filters.dueDateTo ? dayjs(filters.dueDateTo) : null
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({
      ...filters,
      search: event.target.value || undefined
    });
  };

  const handleStatusChange = (event: any) => {
    const value = event.target.value as TaskStatus[];
    onFiltersChange({
      ...filters,
      status: value.length > 0 ? value : undefined
    });
  };

  const handlePriorityChange = (event: any) => {
    const value = event.target.value as TaskPriority[];
    onFiltersChange({
      ...filters,
      priority: value.length > 0 ? value : undefined
    });
  };

  const handleAssigneeChange = (event: any) => {
    onFiltersChange({
      ...filters,
      assigneeId: event.target.value || undefined
    });
  };

  const handleDateFromChange = (value: Dayjs | null) => {
    setDueDateFrom(value);
    onFiltersChange({
      ...filters,
      dueDateFrom: value ? value.toISOString() : undefined
    });
  };

  const handleDateToChange = (value: Dayjs | null) => {
    setDueDateTo(value);
    onFiltersChange({
      ...filters,
      dueDateTo: value ? value.toISOString() : undefined
    });
  };

  const clearFilters = () => {
    setDueDateFrom(null);
    setDueDateTo(null);
    onFiltersChange({});
  };

  const hasActiveFilters = Boolean(
    filters.search ||
    filters.status?.length ||
    filters.priority?.length ||
    filters.assigneeId ||
    filters.dueDateFrom ||
    filters.dueDateTo
  );

  const activeFilterCount = [
    filters.search,
    filters.status?.length,
    filters.priority?.length,
    filters.assigneeId,
    filters.dueDateFrom,
    filters.dueDateTo
  ].filter(Boolean).length;

  return (
    <Card variant="outlined">
      <CardContent sx={{ pb: 2 }}>
        {/* Header with search and toggle */}
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <TextField
            placeholder="Search tasks..."
            value={filters.search || ''}
            onChange={handleSearchChange}
            size="small"
            sx={{ flex: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: filters.search && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => onFiltersChange({ ...filters, search: undefined })}
                  >
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            endIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            onClick={() => setExpanded(!expanded)}
            sx={{ whiteSpace: 'nowrap' }}
          >
            Filters
            {activeFilterCount > 0 && (
              <Chip
                label={activeFilterCount}
                size="small"
                color="primary"
                sx={{ ml: 1, height: 20 }}
              />
            )}
          </Button>
        </Stack>

        {/* Filter counts */}
        {taskCounts && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Showing {taskCounts.filtered} of {taskCounts.total} tasks
          </Typography>
        )}

        {/* Active filters chips */}
        {hasActiveFilters && (
          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2, gap: 0.5 }}>
            {filters.status?.map((status) => (
              <Chip
                key={status}
                label={`Status: ${statusOptions.find(s => s.value === status)?.label}`}
                size="small"
                onDelete={() => {
                  const newStatus = filters.status?.filter(s => s !== status);
                  onFiltersChange({
                    ...filters,
                    status: newStatus?.length ? newStatus : undefined
                  });
                }}
              />
            ))}
            {filters.priority?.map((priority) => (
              <Chip
                key={priority}
                label={`Priority: ${priorityOptions.find(p => p.value === priority)?.label}`}
                size="small"
                onDelete={() => {
                  const newPriority = filters.priority?.filter(p => p !== priority);
                  onFiltersChange({
                    ...filters,
                    priority: newPriority?.length ? newPriority : undefined
                  });
                }}
              />
            ))}
            {filters.assigneeId && (
              <Chip
                label={`Assignee: ${teamMembers.find(m => m.id === filters.assigneeId)?.name.first} ${teamMembers.find(m => m.id === filters.assigneeId)?.name.last}`}
                size="small"
                onDelete={() => onFiltersChange({ ...filters, assigneeId: undefined })}
              />
            )}
            {(filters.dueDateFrom || filters.dueDateTo) && (
              <Chip
                label="Date Range"
                size="small"
                onDelete={() => {
                  setDueDateFrom(null);
                  setDueDateTo(null);
                  onFiltersChange({
                    ...filters,
                    dueDateFrom: undefined,
                    dueDateTo: undefined
                  });
                }}
              />
            )}
            <Button
              variant="text"
              size="small"
              onClick={clearFilters}
              sx={{ ml: 1 }}
            >
              Clear All
            </Button>
          </Stack>
        )}

        {/* Expanded filters */}
        <Collapse in={expanded}>
          <Stack spacing={3}>
            {/* Status and Priority */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  multiple
                  value={filters.status || []}
                  onChange={handleStatusChange}
                  label="Status"
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip
                          key={value}
                          label={statusOptions.find(s => s.value === value)?.label}
                          size="small"
                        />
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

              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel>Priority</InputLabel>
                <Select
                  multiple
                  value={filters.priority || []}
                  onChange={handlePriorityChange}
                  label="Priority"
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip
                          key={value}
                          label={priorityOptions.find(p => p.value === value)?.label}
                          size="small"
                        />
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
            </Stack>

            {/* Assignee */}
            <FormControl size="small" sx={{ minWidth: 250 }}>
              <InputLabel>Assignee</InputLabel>
              <Select
                value={filters.assigneeId || ''}
                onChange={handleAssigneeChange}
                label="Assignee"
              >
                <MenuItem value="">
                  <em>All assignees</em>
                </MenuItem>
                {teamMembers.map((member) => (
                  <MenuItem key={member.id} value={member.id}>
                    {member.name.first} {member.name.last}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Date Range */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <DatePicker
                label="Due Date From"
                value={dueDateFrom}
                onChange={handleDateFromChange}
                slotProps={{
                  textField: {
                    size: 'small',
                    sx: { minWidth: 200 }
                  }
                }}
              />
              <DatePicker
                label="Due Date To"
                value={dueDateTo}
                onChange={handleDateToChange}
                slotProps={{
                  textField: {
                    size: 'small',
                    sx: { minWidth: 200 }
                  }
                }}
              />
            </Stack>
          </Stack>
        </Collapse>
      </CardContent>
    </Card>
  );
}
