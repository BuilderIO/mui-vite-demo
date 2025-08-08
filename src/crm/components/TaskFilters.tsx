import * as React from "react";
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  InputAdornment,
  Stack,
  Paper,
  Typography,
  Switch,
  FormControlLabel,
} from "@mui/material";
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  FilterList as FilterListIcon,
} from "@mui/icons-material";
import { useTaskContext } from "../contexts/TaskContext";
import { getPriorityLabel, getStatusLabel } from "../utils/taskUtils";

interface TaskFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function TaskFilters({ searchQuery, onSearchChange }: TaskFiltersProps) {
  const { filters, setFilters, clearFilters, teamMembers } = useTaskContext();

  const handleFilterChange = (field: keyof typeof filters) => (
    event: React.ChangeEvent<HTMLInputElement> | any
  ) => {
    const value = event.target ? event.target.value : event;
    setFilters({
      ...filters,
      [field]: value === "" ? undefined : value,
    });
  };

  const handleOverdueToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...filters,
      overdue: event.target.checked ? true : undefined,
    });
  };

  const clearSearchAndFilters = () => {
    onSearchChange("");
    clearFilters();
  };

  const hasActiveFilters = React.useMemo(() => {
    return (
      searchQuery ||
      filters.status ||
      filters.priority ||
      filters.assigneeId ||
      filters.overdue
    );
  }, [searchQuery, filters]);

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.status) count++;
    if (filters.priority) count++;
    if (filters.assigneeId) count++;
    if (filters.overdue) count++;
    return count;
  };

  return (
    <Paper 
      variant="outlined" 
      sx={{ 
        p: 2, 
        mb: 3,
        backgroundColor: "background.default",
      }}
    >
      <Stack spacing={2}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <FilterListIcon color="primary" />
          <Typography variant="h6" component="h3">
            Filters & Search
          </Typography>
          {hasActiveFilters && (
            <Chip
              label={`${getActiveFilterCount()} active`}
              size="small"
              color="primary"
              variant="outlined"
            />
          )}
        </Box>

        {/* Search */}
        <TextField
          placeholder="Search tasks by title, description, or assignee..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => onSearchChange("")}
                  aria-label="clear search"
                >
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          size="small"
          fullWidth
        />

        {/* Filter Controls */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status || ""}
              onChange={handleFilterChange("status")}
              label="Status"
            >
              <MenuItem value="">
                <em>All Statuses</em>
              </MenuItem>
              <MenuItem value="not_started">{getStatusLabel("not_started")}</MenuItem>
              <MenuItem value="in_progress">{getStatusLabel("in_progress")}</MenuItem>
              <MenuItem value="completed">{getStatusLabel("completed")}</MenuItem>
              <MenuItem value="on_hold">{getStatusLabel("on_hold")}</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Priority</InputLabel>
            <Select
              value={filters.priority || ""}
              onChange={handleFilterChange("priority")}
              label="Priority"
            >
              <MenuItem value="">
                <em>All Priorities</em>
              </MenuItem>
              <MenuItem value="high">{getPriorityLabel("high")}</MenuItem>
              <MenuItem value="medium">{getPriorityLabel("medium")}</MenuItem>
              <MenuItem value="low">{getPriorityLabel("low")}</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Assignee</InputLabel>
            <Select
              value={filters.assigneeId || ""}
              onChange={handleFilterChange("assigneeId")}
              label="Assignee"
            >
              <MenuItem value="">
                <em>All Assignees</em>
              </MenuItem>
              <MenuItem value="unassigned">Unassigned</MenuItem>
              {teamMembers.map((member) => (
                <MenuItem key={member.id} value={member.id}>
                  {member.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControlLabel
            control={
              <Switch
                checked={filters.overdue || false}
                onChange={handleOverdueToggle}
                size="small"
              />
            }
            label="Show only overdue"
          />
        </Stack>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
            <Typography variant="body2" color="text.secondary">
              Active filters:
            </Typography>
            
            {searchQuery && (
              <Chip
                label={`Search: "${searchQuery}"`}
                size="small"
                onDelete={() => onSearchChange("")}
                variant="outlined"
              />
            )}
            
            {filters.status && (
              <Chip
                label={`Status: ${getStatusLabel(filters.status)}`}
                size="small"
                onDelete={() => setFilters({ ...filters, status: undefined })}
                variant="outlined"
              />
            )}
            
            {filters.priority && (
              <Chip
                label={`Priority: ${getPriorityLabel(filters.priority)}`}
                size="small"
                onDelete={() => setFilters({ ...filters, priority: undefined })}
                variant="outlined"
              />
            )}
            
            {filters.assigneeId && (
              <Chip
                label={`Assignee: ${
                  filters.assigneeId === "unassigned" 
                    ? "Unassigned" 
                    : teamMembers.find(m => m.id === filters.assigneeId)?.name || "Unknown"
                }`}
                size="small"
                onDelete={() => setFilters({ ...filters, assigneeId: undefined })}
                variant="outlined"
              />
            )}
            
            {filters.overdue && (
              <Chip
                label="Overdue only"
                size="small"
                onDelete={() => setFilters({ ...filters, overdue: undefined })}
                variant="outlined"
                color="error"
              />
            )}
            
            <IconButton
              size="small"
              onClick={clearSearchAndFilters}
              aria-label="clear all filters"
              sx={{ ml: 1 }}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          </Box>
        )}
      </Stack>
    </Paper>
  );
}
