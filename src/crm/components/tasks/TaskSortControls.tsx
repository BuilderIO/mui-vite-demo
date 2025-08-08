import * as React from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Paper,
  Typography,
} from '@mui/material';
import {
  SwapVert as SortIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
} from '@mui/icons-material';
import { TaskSortOptions } from '../../types/TaskTypes';

interface TaskSortControlsProps {
  sortOptions: TaskSortOptions;
  onSortChange: (sortOptions: TaskSortOptions) => void;
}

const sortFields = [
  { value: 'createdAt', label: 'Created Date' },
  { value: 'dueDate', label: 'Due Date' },
  { value: 'priority', label: 'Priority' },
  { value: 'title', label: 'Title' },
  { value: 'status', label: 'Status' },
];

export default function TaskSortControls({ sortOptions, onSortChange }: TaskSortControlsProps) {
  const handleFieldChange = (field: TaskSortOptions['field']) => {
    onSortChange({
      ...sortOptions,
      field,
    });
  };

  const handleDirectionToggle = () => {
    onSortChange({
      ...sortOptions,
      direction: sortOptions.direction === 'asc' ? 'desc' : 'asc',
    });
  };

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <SortIcon color="primary" />
        <Typography variant="h6" sx={{ mr: 2 }}>
          Sort
        </Typography>
        
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Sort by</InputLabel>
          <Select
            value={sortOptions.field}
            onChange={(e) => handleFieldChange(e.target.value as TaskSortOptions['field'])}
            label="Sort by"
          >
            {sortFields.map((field) => (
              <MenuItem key={field.value} value={field.value}>
                {field.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Tooltip title={`Sort ${sortOptions.direction === 'asc' ? 'descending' : 'ascending'}`}>
          <IconButton onClick={handleDirectionToggle} color="primary">
            {sortOptions.direction === 'asc' ? <ArrowUpIcon /> : <ArrowDownIcon />}
          </IconButton>
        </Tooltip>

        <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
          Sorted by {sortFields.find(f => f.value === sortOptions.field)?.label} 
          ({sortOptions.direction === 'asc' ? 'ascending' : 'descending'})
        </Typography>
      </Box>
    </Paper>
  );
}
