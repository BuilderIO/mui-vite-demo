import * as React from 'react';
import {
  Paper,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Switch,
  FormControlLabel,
  Button,
  Divider,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { TaskFilters as TaskFiltersType, TaskPriority, TaskStatus, User } from '../../types/TaskTypes';

interface TaskFiltersProps {
  filters: TaskFiltersType;
  onFiltersChange: (filters: TaskFiltersType) => void;
  users: User[];
}

const priorityOptions: TaskPriority[] = ['High', 'Medium', 'Low'];
const statusOptions: TaskStatus[] = ['Not Started', 'In Progress', 'Completed', 'On Hold'];

export default function TaskFilters({ filters, onFiltersChange, users }: TaskFiltersProps) {
  const [expanded, setExpanded] = React.useState(false);

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

  const handleAssigneeChange = (assignees: string[]) => {
    onFiltersChange({
      ...filters,
      assignee: assignees.length > 0 ? assignees : undefined,
    });
  };

  const handleSearchChange = (query: string) => {
    onFiltersChange({
      ...filters,
      searchQuery: query || undefined,
    });
  };

  const handleOverdueChange = (overdue: boolean) => {
    onFiltersChange({
      ...filters,
      overdue: overdue || undefined,
    });
  };

  const handleDateRangeChange = (start: Dayjs | null, end: Dayjs | null) => {
    onFiltersChange({
      ...filters,
      dueDateRange: start || end ? {
        start: start?.toDate() || null,
        end: end?.toDate() || null,
      } : undefined,
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({});
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.status && filters.status.length > 0) count++;
    if (filters.priority && filters.priority.length > 0) count++;
    if (filters.assignee && filters.assignee.length > 0) count++;
    if (filters.searchQuery) count++;
    if (filters.overdue) count++;
    if (filters.dueDateRange) count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FilterIcon color="primary" />
            <Typography variant="h6">Filters</Typography>
            {activeFilterCount > 0 && (
              <Chip
                label={`${activeFilterCount} active`}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
          </Box>
          {activeFilterCount > 0 && (
            <Button
              startIcon={<ClearIcon />}
              onClick={clearAllFilters}
              size="small"
              color="inherit"
            >
              Clear All
            </Button>
          )}
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
          <TextField
            placeholder="Search tasks..."
            value={filters.searchQuery || ''}
            onChange={(e) => handleSearchChange(e.target.value)}
            size="small"
            sx={{ minWidth: 200, flex: 1 }}
          />

          <FormControlLabel
            control={
              <Switch
                checked={filters.overdue || false}
                onChange={(e) => handleOverdueChange(e.target.checked)}
                size="small"
              />
            }
            label="Show Overdue Only"
            sx={{ ml: 1 }}
          />
        </Box>

        <Accordion
          expanded={expanded}
          onChange={() => setExpanded(!expanded)}
          elevation={0}
          sx={{ border: 'none', '&:before': { display: 'none' } }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{ px: 0, minHeight: 0, '& .MuiAccordionSummary-content': { my: 1 } }}
          >
            <Typography variant="body2" color="primary">
              Advanced Filters
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ px: 0, pt: 0 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  multiple
                  value={filters.status || []}
                  onChange={(e) => handleStatusChange(e.target.value as TaskStatus[])}
                  label="Status"
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

              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Priority</InputLabel>
                <Select
                  multiple
                  value={filters.priority || []}
                  onChange={(e) => handlePriorityChange(e.target.value as TaskPriority[])}
                  label="Priority"
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
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

              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel>Assignee</InputLabel>
                <Select
                  multiple
                  value={filters.assignee || []}
                  onChange={(e) => handleAssigneeChange(e.target.value as string[])}
                  label="Assignee"
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((userId) => {
                        const user = users.find(u => u.id === userId);
                        return (
                          <Chip key={userId} label={user?.name || userId} size="small" />
                        );
                      })}
                    </Box>
                  )}
                >
                  {users.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <DatePicker
                label="Due Date From"
                value={filters.dueDateRange?.start ? dayjs(filters.dueDateRange.start) : null}
                onChange={(newValue) => 
                  handleDateRangeChange(
                    newValue,
                    filters.dueDateRange?.end ? dayjs(filters.dueDateRange.end) : null
                  )
                }
                slotProps={{
                  textField: { size: 'small', sx: { minWidth: 150 } },
                }}
              />
              <DatePicker
                label="Due Date To"
                value={filters.dueDateRange?.end ? dayjs(filters.dueDateRange.end) : null}
                onChange={(newValue) => 
                  handleDateRangeChange(
                    filters.dueDateRange?.start ? dayjs(filters.dueDateRange.start) : null,
                    newValue
                  )
                }
                slotProps={{
                  textField: { size: 'small', sx: { minWidth: 150 } },
                }}
              />
            </Box>
          </AccordionDetails>
        </Accordion>
      </Paper>
    </LocalizationProvider>
  );
}
