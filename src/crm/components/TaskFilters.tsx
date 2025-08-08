import * as React from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Chip,
  Stack,
  Typography,
  Autocomplete,
  Avatar,
  ListItemText,
  ListItemAvatar,
  Paper,
  IconButton,
  Collapse,
  OutlinedInput,
  SelectChangeEvent,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  FilterList as FilterListIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { TaskFilters, TeamMember, Priority, TaskStatus, PRIORITY_OPTIONS, STATUS_OPTIONS } from "../types/taskTypes";

interface TaskFiltersProps {
  filters: TaskFilters;
  onFiltersChange: (filters: TaskFilters) => void;
  teamMembers: TeamMember[];
  collapsed?: boolean;
}

export default function TaskFiltersComponent({
  filters,
  onFiltersChange,
  teamMembers,
  collapsed = false,
}: TaskFiltersProps) {
  const [isExpanded, setIsExpanded] = React.useState(!collapsed);

  const handleFilterChange = (field: keyof TaskFilters) => (value: any) => {
    onFiltersChange({
      ...filters,
      [field]: value,
    });
  };

  const handleStatusChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    handleFilterChange('status')(typeof value === 'string' ? value.split(',') : value);
  };

  const handlePriorityChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    handleFilterChange('priority')(typeof value === 'string' ? value.split(',') : value);
  };

  const handleAssigneeChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    handleFilterChange('assigneeId')(typeof value === 'string' ? value.split(',') : value);
  };

  const handleDueDateRangeChange = (field: 'start' | 'end') => (date: Dayjs | null) => {
    const currentRange = filters.dueDateRange || { start: null, end: null };
    handleFilterChange('dueDateRange')({
      ...currentRange,
      [field]: date ? date.toDate() : null,
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      status: [],
      priority: [],
      assigneeId: [],
      dueDateRange: { start: null, end: null },
      overdue: undefined,
      search: "",
    });
  };

  const hasActiveFilters = Boolean(
    filters.search ||
    filters.status?.length ||
    filters.priority?.length ||
    filters.assigneeId?.length ||
    filters.dueDateRange?.start ||
    filters.dueDateRange?.end ||
    filters.overdue !== undefined
  );

  const activeTeamMembers = teamMembers.filter(member => member.isActive);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <FilterListIcon color="primary" />
            <Typography variant="h6">Filters</Typography>
            {hasActiveFilters && (
              <Chip
                label={`${Object.values(filters).filter(v => v && (Array.isArray(v) ? v.length > 0 : true)).length} active`}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            {hasActiveFilters && (
              <Button
                size="small"
                startIcon={<ClearIcon />}
                onClick={clearFilters}
                variant="outlined"
              >
                Clear All
              </Button>
            )}
            <IconButton
              onClick={() => setIsExpanded(!isExpanded)}
              size="small"
            >
              {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>
        </Box>

        <Collapse in={isExpanded}>
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Search tasks..."
              value={filters.search || ""}
              onChange={(e) => handleFilterChange('search')(e.target.value)}
              placeholder="Search by title, description, assignee, or tags"
              size="small"
            />

            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  multiple
                  value={filters.status || []}
                  onChange={handleStatusChange}
                  input={<OutlinedInput label="Status" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip
                          key={value}
                          label={value}
                          size="small"
                          sx={{
                            bgcolor: value === "Not Started" ? "grey.200" :
                                    value === "In Progress" ? "info.light" :
                                    value === "Completed" ? "success.light" : "warning.light",
                          }}
                        />
                      ))}
                    </Box>
                  )}
                >
                  {STATUS_OPTIONS.map((status) => (
                    <MenuItem key={status} value={status}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            bgcolor: status === "Not Started" ? "grey.500" :
                                    status === "In Progress" ? "info.main" :
                                    status === "Completed" ? "success.main" : "warning.main",
                          }}
                        />
                        {status}
                      </Box>
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
                      {selected.map((value) => (
                        <Chip
                          key={value}
                          label={value}
                          size="small"
                          sx={{
                            bgcolor: value === "High" ? "error.light" :
                                    value === "Medium" ? "warning.light" : "success.light",
                          }}
                        />
                      ))}
                    </Box>
                  )}
                >
                  {PRIORITY_OPTIONS.map((priority) => (
                    <MenuItem key={priority} value={priority}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            bgcolor: priority === "High" ? "error.main" : 
                                    priority === "Medium" ? "warning.main" : "success.main",
                          }}
                        />
                        {priority}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 250 }}>
                <InputLabel>Assignee</InputLabel>
                <Select
                  multiple
                  value={filters.assigneeId || []}
                  onChange={handleAssigneeChange}
                  input={<OutlinedInput label="Assignee" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((id) => {
                        const member = activeTeamMembers.find(m => m.id === id);
                        return member ? (
                          <Chip
                            key={id}
                            avatar={<Avatar src={member.avatar} sx={{ width: 20, height: 20 }} />}
                            label={member.name}
                            size="small"
                          />
                        ) : null;
                      })}
                    </Box>
                  )}
                >
                  {activeTeamMembers.map((member) => (
                    <MenuItem key={member.id} value={member.id}>
                      <ListItemAvatar>
                        <Avatar
                          src={member.avatar}
                          alt={member.name}
                          sx={{ width: 32, height: 32 }}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={member.name}
                        secondary={member.role}
                      />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
              <Typography variant="subtitle2" sx={{ minWidth: "fit-content" }}>
                Due Date Range:
              </Typography>
              <DatePicker
                label="From"
                value={filters.dueDateRange?.start ? dayjs(filters.dueDateRange.start) : null}
                onChange={handleDueDateRangeChange('start')}
                slotProps={{ textField: { size: "small", sx: { maxWidth: 200 } } }}
              />
              <DatePicker
                label="To"
                value={filters.dueDateRange?.end ? dayjs(filters.dueDateRange.end) : null}
                onChange={handleDueDateRangeChange('end')}
                slotProps={{ textField: { size: "small", sx: { maxWidth: 200 } } }}
              />
            </Box>

            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Button
                variant={filters.overdue === true ? "contained" : "outlined"}
                onClick={() => handleFilterChange('overdue')(filters.overdue === true ? undefined : true)}
                size="small"
                color="error"
              >
                Overdue Only
              </Button>
              <Button
                variant={filters.overdue === false ? "contained" : "outlined"}
                onClick={() => handleFilterChange('overdue')(filters.overdue === false ? undefined : false)}
                size="small"
                color="success"
              >
                On Time Only
              </Button>
            </Box>
          </Stack>
        </Collapse>
      </Paper>
    </LocalizationProvider>
  );
}
