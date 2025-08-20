import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import LinearProgress from "@mui/material/LinearProgress";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Task } from "../types/tasks";
import { getPriorityColor, getStatusColor, formatDateDetailed, isOverdue, getInitials } from "../utils/taskUtils";

interface TaskTableProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string | number) => void;
  onToggleComplete: (taskId: string | number) => void;
  onViewTask: (task: Task) => void;
  loading?: boolean;
}

interface HeadCell {
  id: keyof Task | "actions";
  label: string;
  numeric: boolean;
  sortable: boolean;
}

const headCells: HeadCell[] = [
  { id: "title", label: "Task", numeric: false, sortable: true },
  { id: "assignee", label: "Assignee", numeric: false, sortable: true },
  { id: "priority", label: "Priority", numeric: false, sortable: true },
  { id: "status", label: "Status", numeric: false, sortable: true },
  { id: "dueDate", label: "Due Date", numeric: false, sortable: true },
  { id: "actions", label: "Actions", numeric: false, sortable: false },
];

interface TaskTableHeadProps {
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: "asc" | "desc";
  orderBy: string;
  numSelected: number;
  rowCount: number;
  onRequestSort: (property: keyof Task) => void;
}

function TaskTableHead({
  onSelectAllClick,
  order,
  orderBy,
  numSelected,
  rowCount,
  onRequestSort,
}: TaskTableHeadProps) {
  const createSortHandler = (property: keyof Task) => () => {
    onRequestSort(property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.sortable ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id as keyof Task)}
              >
                {headCell.label}
              </TableSortLabel>
            ) : (
              headCell.label
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export default function TaskTable({
  tasks,
  onEditTask,
  onDeleteTask,
  onToggleComplete,
  onViewTask,
  loading = false,
}: TaskTableProps) {
  const [order, setOrder] = React.useState<"asc" | "desc">("desc");
  const [orderBy, setOrderBy] = React.useState<keyof Task>("updatedAt");
  const [selected, setSelected] = React.useState<(string | number)[]>([]);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null);

  const handleRequestSort = (property: keyof Task) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = tasks.map((task) => task.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (id: string | number) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: (string | number)[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, task: Task) => {
    setAnchorEl(event.currentTarget);
    setSelectedTask(task);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTask(null);
  };

  const handleMenuAction = (action: "edit" | "delete" | "view") => {
    if (selectedTask) {
      switch (action) {
        case "edit":
          onEditTask(selectedTask);
          break;
        case "delete":
          onDeleteTask(selectedTask.id);
          break;
        case "view":
          onViewTask(selectedTask);
          break;
      }
    }
    handleMenuClose();
  };

  const isSelected = (id: string | number) => selected.indexOf(id) !== -1;

  const sortedTasks = React.useMemo(() => {
    return [...tasks].sort((a, b) => {
      let aValue: any = a[orderBy];
      let bValue: any = b[orderBy];

      if (orderBy === "assignee") {
        aValue = a.assignee ? `${a.assignee.name.first} ${a.assignee.name.last}` : "";
        bValue = b.assignee ? `${b.assignee.name.first} ${b.assignee.name.last}` : "";
      }

      if (orderBy === "dueDate") {
        aValue = a.dueDate ? new Date(a.dueDate).getTime() : 0;
        bValue = b.dueDate ? new Date(b.dueDate).getTime() : 0;
      }

      if (orderBy === "priority") {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        aValue = priorityOrder[a.priority];
        bValue = priorityOrder[b.priority];
      }

      if (aValue < bValue) {
        return order === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return order === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [tasks, order, orderBy]);

  return (
    <Card variant="outlined">
      <CardContent sx={{ p: 0 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2, pb: 0 }}>
          <Typography variant="h6" component="h2">
            All Tasks
          </Typography>
          {selected.length > 0 && (
            <Typography variant="body2" color="primary">
              {selected.length} selected
            </Typography>
          )}
        </Stack>
        
        {loading && <LinearProgress />}
        
        <TableContainer>
          <Table>
            <TaskTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={tasks.length}
            />
            <TableBody>
              {sortedTasks.map((task) => {
                const isItemSelected = isSelected(task.id);
                const isTaskOverdue = task.dueDate && isOverdue(task.dueDate) && task.status !== "completed";

                return (
                  <TableRow
                    hover
                    key={task.id}
                    selected={isItemSelected}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        onChange={() => handleClick(task.id)}
                      />
                    </TableCell>
                    
                    <TableCell>
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{
                            textDecoration: task.completed ? "line-through" : "none",
                            color: task.completed ? "text.secondary" : "text.primary",
                            fontWeight: 500,
                          }}
                        >
                          {task.title}
                        </Typography>
                        {task.description && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: "block", mt: 0.5 }}
                          >
                            {task.description.length > 60
                              ? `${task.description.substring(0, 60)}...`
                              : task.description}
                          </Typography>
                        )}
                        {task.tags && task.tags.length > 0 && (
                          <Stack direction="row" spacing={0.5} sx={{ mt: 0.5 }}>
                            {task.tags.slice(0, 2).map((tag) => (
                              <Chip
                                key={tag}
                                label={tag}
                                size="small"
                                variant="outlined"
                                sx={{ height: 20, fontSize: "0.6rem" }}
                              />
                            ))}
                            {task.tags.length > 2 && (
                              <Chip
                                label={`+${task.tags.length - 2}`}
                                size="small"
                                variant="outlined"
                                sx={{ height: 20, fontSize: "0.6rem" }}
                              />
                            )}
                          </Stack>
                        )}
                      </Box>
                    </TableCell>
                    
                    <TableCell>
                      {task.assignee ? (
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Avatar
                            src={task.assignee.picture?.thumbnail}
                            sx={{ width: 32, height: 32 }}
                          >
                            {getInitials(task.assignee.name.first, task.assignee.name.last)}
                          </Avatar>
                          <Box>
                            <Typography variant="body2">
                              {task.assignee.name.first} {task.assignee.name.last}
                            </Typography>
                          </Box>
                        </Stack>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Unassigned
                        </Typography>
                      )}
                    </TableCell>
                    
                    <TableCell>
                      <Chip
                        label={task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        color={getPriorityColor(task.priority) as any}
                        size="small"
                      />
                    </TableCell>
                    
                    <TableCell>
                      <Chip
                        label={task.status.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
                        color={getStatusColor(task.status) as any}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    
                    <TableCell>
                      {task.dueDate ? (
                        <Typography
                          variant="body2"
                          color={isTaskOverdue ? "error" : "text.primary"}
                          sx={{ fontWeight: isTaskOverdue ? 600 : 400 }}
                        >
                          {formatDateDetailed(task.dueDate)}
                          {isTaskOverdue && (
                            <Chip
                              label="Overdue"
                              color="error"
                              size="small"
                              sx={{ ml: 1, height: 20 }}
                            />
                          )}
                        </Typography>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No due date
                        </Typography>
                      )}
                    </TableCell>
                    
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Tooltip title="Toggle complete">
                          <Checkbox
                            checked={task.completed}
                            onChange={() => onToggleComplete(task.id)}
                            size="small"
                          />
                        </Tooltip>
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuClick(e, task)}
                        >
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => handleMenuAction("view")}>
            <VisibilityIcon fontSize="small" sx={{ mr: 1 }} />
            View Details
          </MenuItem>
          <MenuItem onClick={() => handleMenuAction("edit")}>
            <EditIcon fontSize="small" sx={{ mr: 1 }} />
            Edit Task
          </MenuItem>
          <MenuItem onClick={() => handleMenuAction("delete")} sx={{ color: "error.main" }}>
            <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
            Delete Task
          </MenuItem>
        </Menu>
      </CardContent>
    </Card>
  );
}
