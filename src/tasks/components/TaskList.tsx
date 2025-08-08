import React, { useState, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
  Fab,
  Skeleton,
  Alert,
  Chip,
  Stack,
} from '@mui/material';
import {
  Add as AddIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
  Sort as SortIcon,
  SortByAlpha as SortByAlphaIcon,
} from '@mui/icons-material';
import { Task } from '../types/Task';
import { useTaskContext } from '../context/TaskContext';
import { sortTasks } from '../utils/taskUtils';
import TaskCard from './TaskCard';
import TaskCreateForm from './TaskCreateForm';
import TaskFilters from './TaskFilters';

type ViewMode = 'grid' | 'list';
type SortOption = 'title' | 'dueDate' | 'priority' | 'status' | 'createdAt' | 'assignee';

interface TaskListProps {
  showFilters?: boolean;
  showCreateButton?: boolean;
  maxHeight?: string | number;
}

export default function TaskList({ 
  showFilters = true, 
  showCreateButton = true,
  maxHeight 
}: TaskListProps) {
  const { loading, error, getFilteredTasks, stats } = useTaskContext();
  const [createTaskOpen, setCreateTaskOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('dueDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const filteredTasks = useMemo(() => {
    const filtered = getFilteredTasks();
    return sortTasks(filtered, sortBy, sortOrder);
  }, [getFilteredTasks, sortBy, sortOrder]);

  const handleViewModeChange = (_: React.MouseEvent<HTMLElement>, newViewMode: ViewMode | null) => {
    if (newViewMode !== null) {
      setViewMode(newViewMode);
    }
  };

  const handleSortChange = (newSortBy: SortOption) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (option: SortOption) => {
    if (sortBy !== option) return null;
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  const renderTaskSkeleton = () => (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Paper sx={{ p: 2 }}>
        <Skeleton variant="text" height={24} width="80%" />
        <Skeleton variant="text" height={16} width="60%" sx={{ mt: 1 }} />
        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
          <Skeleton variant="rectangular" width={60} height={24} />
          <Skeleton variant="rectangular" width={80} height={24} />
        </Box>
        <Skeleton variant="circular" width={32} height={32} sx={{ mt: 2 }} />
      </Paper>
    </Grid>
  );

  const renderEmptyState = () => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        textAlign: 'center',
      }}
    >
      <Typography variant="h6" color="text.secondary" gutterBottom>
        No tasks found
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {stats.total === 0 
          ? "Get started by creating your first task"
          : "Try adjusting your filters to see more tasks"
        }
      </Typography>
      {showCreateButton && stats.total === 0 && (
        <Fab
          color="primary"
          variant="extended"
          onClick={() => setCreateTaskOpen(true)}
          sx={{ mt: 2 }}
        >
          <AddIcon sx={{ mr: 1 }} />
          Create Your First Task
        </Fab>
      )}
    </Box>
  );

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      {showFilters && <TaskFilters />}

      {/* Controls */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Typography variant="h6" component="h2">
              Tasks ({filteredTasks.length})
            </Typography>

            {/* Task stats */}
            <Stack direction="row" spacing={1}>
              {stats.overdue > 0 && (
                <Chip
                  size="small"
                  label={`${stats.overdue} Overdue`}
                  color="error"
                  variant="outlined"
                />
              )}
              {stats.dueToday > 0 && (
                <Chip
                  size="small"
                  label={`${stats.dueToday} Due Today`}
                  color="warning"
                  variant="outlined"
                />
              )}
              {stats.inProgress > 0 && (
                <Chip
                  size="small"
                  label={`${stats.inProgress} In Progress`}
                  color="info"
                  variant="outlined"
                />
              )}
            </Stack>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Sort Options */}
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Sort by</InputLabel>
              <Select
                value={sortBy}
                label="Sort by"
                onChange={(e) => handleSortChange(e.target.value as SortOption)}
              >
                <MenuItem value="dueDate">
                  Due Date {getSortIcon('dueDate')}
                </MenuItem>
                <MenuItem value="priority">
                  Priority {getSortIcon('priority')}
                </MenuItem>
                <MenuItem value="status">
                  Status {getSortIcon('status')}
                </MenuItem>
                <MenuItem value="title">
                  Title {getSortIcon('title')}
                </MenuItem>
                <MenuItem value="createdAt">
                  Created {getSortIcon('createdAt')}
                </MenuItem>
                <MenuItem value="assignee">
                  Assignee {getSortIcon('assignee')}
                </MenuItem>
              </Select>
            </FormControl>

            {/* View Mode Toggle */}
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={handleViewModeChange}
              size="small"
            >
              <ToggleButton value="grid">
                <ViewModuleIcon />
              </ToggleButton>
              <ToggleButton value="list">
                <ViewListIcon />
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>
      </Paper>

      {/* Task List */}
      <Box sx={{ 
        ...(maxHeight && { 
          maxHeight, 
          overflowY: 'auto',
          pr: 1 
        })
      }}>
        {loading ? (
          <Grid container spacing={2}>
            {Array.from({ length: 6 }).map((_, index) => renderTaskSkeleton())}
          </Grid>
        ) : filteredTasks.length === 0 ? (
          renderEmptyState()
        ) : (
          <Grid container spacing={2}>
            {filteredTasks.map((task) => (
              <Grid 
                item 
                xs={12} 
                sm={viewMode === 'list' ? 12 : 6} 
                md={viewMode === 'list' ? 12 : 4} 
                lg={viewMode === 'list' ? 12 : 3} 
                key={task.id}
              >
                <TaskCard 
                  task={task} 
                  compact={viewMode === 'list'}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Create Task FAB */}
      {showCreateButton && !loading && (
        <Fab
          color="primary"
          onClick={() => setCreateTaskOpen(true)}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1000,
          }}
        >
          <AddIcon />
        </Fab>
      )}

      {/* Create Task Dialog */}
      <TaskCreateForm
        open={createTaskOpen}
        onClose={() => setCreateTaskOpen(false)}
      />
    </Box>
  );
}
