import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Paper from "@mui/material/Paper";
import Badge from "@mui/material/Badge";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";

// Icons
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import FlagRoundedIcon from "@mui/icons-material/FlagRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import NotificationsActiveRoundedIcon from "@mui/icons-material/NotificationsActiveRounded";
import AttachFileRoundedIcon from "@mui/icons-material/AttachFileRounded";
import CommentRoundedIcon from "@mui/icons-material/CommentRounded";

// Types
interface Task {
  id: number;
  title: string;
  description: string;
  assignee: {
    name: string;
    avatar: string;
    email: string;
  };
  priority: "high" | "medium" | "low";
  status: "todo" | "in_progress" | "completed" | "on_hold";
  dueDate: string;
  createdDate: string;
  completedDate?: string;
  reminderEnabled: boolean;
  category: string;
  attachments?: number;
  comments?: number;
}

interface Column {
  id: string;
  title: string;
  status: Task["status"];
  color: string;
  tasks: Task[];
}

// Sample tasks data with additional fields for board view
const sampleTasks: Task[] = [
  {
    id: 1,
    title: "Follow up with TechSolutions Inc on cloud proposal",
    description: "Need to discuss timeline and pricing details for the cloud migration project. This is a critical deal that could bring significant revenue.",
    assignee: { name: "John Smith", avatar: "JS", email: "john.smith@company.com" },
    priority: "high",
    status: "todo",
    dueDate: "2024-01-15",
    createdDate: "2024-01-10",
    reminderEnabled: true,
    category: "Sales",
    attachments: 3,
    comments: 2,
  },
  {
    id: 2,
    title: "Prepare presentation for Global Media website project",
    description: "Create comprehensive presentation covering design mockups, timeline, and budget estimates.",
    assignee: { name: "Sarah Wilson", avatar: "SW", email: "sarah.wilson@company.com" },
    priority: "medium",
    status: "in_progress",
    dueDate: "2024-01-18",
    createdDate: "2024-01-08",
    reminderEnabled: true,
    category: "Marketing",
    attachments: 5,
    comments: 8,
  },
  {
    id: 3,
    title: "Call HealthCare Pro about contract details",
    description: "Clarify contract terms and conditions for the CRM implementation project.",
    assignee: { name: "Mike Johnson", avatar: "MJ", email: "mike.johnson@company.com" },
    priority: "high",
    status: "todo",
    dueDate: "2024-01-16",
    createdDate: "2024-01-12",
    reminderEnabled: false,
    category: "Legal",
    comments: 1,
  },
  {
    id: 4,
    title: "Update CRM implementation timeline for RetailGiant",
    description: "Revise project timeline based on client feedback and resource availability.",
    assignee: { name: "Lisa Brown", avatar: "LB", email: "lisa.brown@company.com" },
    priority: "medium",
    status: "completed",
    dueDate: "2024-01-14",
    createdDate: "2024-01-05",
    completedDate: "2024-01-13",
    reminderEnabled: false,
    category: "Development",
    attachments: 2,
    comments: 5,
  },
  {
    id: 5,
    title: "Send proposal documents to Acme Corp",
    description: "Compile and send all required proposal documents for the enterprise software package.",
    assignee: { name: "David Chen", avatar: "DC", email: "david.chen@company.com" },
    priority: "low",
    status: "on_hold",
    dueDate: "2024-01-20",
    createdDate: "2024-01-09",
    reminderEnabled: true,
    category: "Sales",
    attachments: 7,
    comments: 3,
  },
  {
    id: 6,
    title: "Review and approve marketing materials",
    description: "Final review of promotional materials for Q1 campaign launch.",
    assignee: { name: "Sarah Wilson", avatar: "SW", email: "sarah.wilson@company.com" },
    priority: "medium",
    status: "in_progress",
    dueDate: "2024-01-17",
    createdDate: "2024-01-11",
    reminderEnabled: true,
    category: "Marketing",
    comments: 4,
  },
  {
    id: 7,
    title: "Database optimization and cleanup",
    description: "Optimize database queries and clean up unnecessary data to improve performance.",
    assignee: { name: "Mike Johnson", avatar: "MJ", email: "mike.johnson@company.com" },
    priority: "low",
    status: "todo",
    dueDate: "2024-01-25",
    createdDate: "2024-01-13",
    reminderEnabled: false,
    category: "Development",
    attachments: 1,
    comments: 2,
  },
  {
    id: 8,
    title: "Complete user testing for mobile app",
    description: "Conduct final round of user acceptance testing for the mobile application.",
    assignee: { name: "John Smith", avatar: "JS", email: "john.smith@company.com" },
    priority: "high",
    status: "in_progress",
    dueDate: "2024-01-19",
    createdDate: "2024-01-07",
    reminderEnabled: true,
    category: "Development",
    attachments: 4,
    comments: 12,
  },
];

const columns: Omit<Column, "tasks">[] = [
  { id: "todo", title: "To Do", status: "todo", color: "#e3f2fd" },
  { id: "in_progress", title: "In Progress", status: "in_progress", color: "#e8f5e8" },
  { id: "on_hold", title: "On Hold", status: "on_hold", color: "#fff3e0" },
  { id: "completed", title: "Completed", status: "completed", color: "#e8f5e8" },
];

// Utility functions
const getPriorityColor = (priority: string): "error" | "warning" | "default" => {
  switch (priority) {
    case "high": return "error";
    case "medium": return "warning";
    default: return "default";
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const today = new Date();
  const diffTime = date.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays === -1) return "Yesterday";
  if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
  
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const isOverdue = (dueDate: string, status: string) => {
  return status !== "completed" && new Date(dueDate) < new Date();
};

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onView: (task: Task) => void;
}

function TaskCard({ task, onEdit, onDelete, onView }: TaskCardProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    onEdit(task);
    handleMenuClose();
  };

  const handleDelete = () => {
    onDelete(task);
    handleMenuClose();
  };

  const handleView = () => {
    onView(task);
    handleMenuClose();
  };

  return (
    <Card
      sx={{
        mb: 2,
        cursor: "pointer",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          boxShadow: 3,
          transform: "translateY(-2px)",
        },
        border: isOverdue(task.dueDate, task.status) ? "2px solid" : "1px solid",
        borderColor: isOverdue(task.dueDate, task.status) ? "error.main" : "divider",
      }}
      onClick={() => onView(task)}
    >
      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
        {/* Header with priority and menu */}
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Chip
              icon={<FlagRoundedIcon />}
              label={task.priority.toUpperCase()}
              size="small"
              color={getPriorityColor(task.priority)}
              variant="outlined"
              sx={{ height: 20, "& .MuiChip-label": { px: 0.5, fontSize: "0.625rem" } }}
            />
            {task.reminderEnabled && (
              <Tooltip title="Reminders enabled">
                <NotificationsActiveRoundedIcon 
                  fontSize="small" 
                  color="primary"
                  sx={{ width: 16, height: 16 }}
                />
              </Tooltip>
            )}
          </Stack>
          <IconButton
            size="small"
            onClick={handleMenuClick}
            sx={{ p: 0.5 }}
          >
            <MoreVertRoundedIcon fontSize="small" />
          </IconButton>
        </Stack>

        {/* Task title */}
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 600,
            mb: 1,
            lineHeight: 1.3,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {task.title}
        </Typography>

        {/* Task description */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {task.description}
        </Typography>

        {/* Category and due date */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Chip
            label={task.category}
            size="small"
            variant="outlined"
            sx={{ height: 18, "& .MuiChip-label": { px: 0.5, fontSize: "0.625rem" } }}
          />
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <CalendarTodayRoundedIcon 
              fontSize="small" 
              color={isOverdue(task.dueDate, task.status) ? "error" : "action"}
              sx={{ width: 14, height: 14 }}
            />
            <Typography
              variant="caption"
              color={isOverdue(task.dueDate, task.status) ? "error.main" : "text.secondary"}
              sx={{ fontWeight: isOverdue(task.dueDate, task.status) ? 600 : 400 }}
            >
              {formatDate(task.dueDate)}
            </Typography>
          </Stack>
        </Stack>

        {/* Footer with assignee and metadata */}
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" alignItems="center" spacing={1}>
            <Avatar sx={{ width: 24, height: 24, fontSize: "0.75rem" }}>
              {task.assignee.avatar}
            </Avatar>
            <Typography variant="caption" color="text.secondary">
              {task.assignee.name}
            </Typography>
          </Stack>
          
          <Stack direction="row" alignItems="center" spacing={1}>
            {task.attachments && task.attachments > 0 && (
              <Badge badgeContent={task.attachments} color="primary" max={99}>
                <AttachFileRoundedIcon 
                  fontSize="small" 
                  color="action"
                  sx={{ width: 16, height: 16 }}
                />
              </Badge>
            )}
            {task.comments && task.comments > 0 && (
              <Badge badgeContent={task.comments} color="primary" max={99}>
                <CommentRoundedIcon 
                  fontSize="small" 
                  color="action"
                  sx={{ width: 16, height: 16 }}
                />
              </Badge>
            )}
          </Stack>
        </Stack>
      </CardContent>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        onClick={(e) => e.stopPropagation()}
      >
        <MenuItem onClick={handleView}>
          <ListItemIcon>
            <VisibilityRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <EditRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit Task</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
          <ListItemIcon>
            <DeleteRoundedIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete Task</ListItemText>
        </MenuItem>
      </Menu>
    </Card>
  );
}

interface TaskBoardProps {
  tasks?: Task[];
  onTaskEdit?: (task: Task) => void;
  onTaskDelete?: (task: Task) => void;
  onTaskView?: (task: Task) => void;
  onTaskMove?: (taskId: number, newStatus: Task["status"]) => void;
}

export default function TaskBoard({ 
  tasks = sampleTasks, 
  onTaskEdit = () => {}, 
  onTaskDelete = () => {}, 
  onTaskView = () => {},
  onTaskMove = () => {}
}: TaskBoardProps) {
  
  // Group tasks by status
  const tasksByStatus = React.useMemo(() => {
    const grouped = tasks.reduce((acc, task) => {
      if (!acc[task.status]) {
        acc[task.status] = [];
      }
      acc[task.status].push(task);
      return acc;
    }, {} as Record<Task["status"], Task[]>);

    return columns.map(column => ({
      ...column,
      tasks: grouped[column.status] || []
    }));
  }, [tasks]);

  // Handle drag and drop (simplified version - in real app would use react-beautiful-dnd)
  const handleDragStart = (e: React.DragEvent, task: Task) => {
    e.dataTransfer.setData("taskId", task.id.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, newStatus: Task["status"]) => {
    e.preventDefault();
    const taskId = parseInt(e.dataTransfer.getData("taskId"));
    onTaskMove(taskId, newStatus);
  };

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <Stack direction="row" spacing={2} sx={{ height: "100%", overflow: "auto", pb: 2 }}>
        {tasksByStatus.map((column) => (
          <Paper
            key={column.id}
            sx={{
              minWidth: 300,
              width: 300,
              backgroundColor: column.color,
              p: 2,
              borderRadius: 2,
              height: "fit-content",
              minHeight: 400,
            }}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.status)}
          >
            {/* Column Header */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                {column.title}
              </Typography>
              <Chip
                label={column.tasks.length}
                size="small"
                sx={{ 
                  backgroundColor: "background.paper",
                  fontWeight: 600,
                  minWidth: 32,
                }}
              />
            </Stack>

            {/* Tasks */}
            <Box sx={{ maxHeight: "calc(100vh - 200px)", overflow: "auto" }}>
              {column.tasks.length === 0 ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    py: 4,
                    color: "text.secondary",
                  }}
                >
                  <Typography variant="body2" textAlign="center">
                    No tasks in {column.title.toLowerCase()}
                  </Typography>
                </Box>
              ) : (
                column.tasks.map((task) => (
                  <Box
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task)}
                    sx={{ cursor: "grab", "&:active": { cursor: "grabbing" } }}
                  >
                    <TaskCard
                      task={task}
                      onEdit={onTaskEdit}
                      onDelete={onTaskDelete}
                      onView={onTaskView}
                    />
                  </Box>
                ))
              )}
            </Box>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
}
