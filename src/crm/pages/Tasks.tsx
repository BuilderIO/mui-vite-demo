import * as React from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  Tabs,
  Tab,
  Fab,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Add as AddIcon,
  Dashboard as DashboardIcon,
  List as ListIcon,
} from "@mui/icons-material";
import { Task } from "../contexts/TaskContext";
import TaskDashboard from "../components/TaskDashboard";
import TaskList from "../components/TaskList";
import TaskFilters from "../components/TaskFilters";
import TaskForm from "../components/TaskForm";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index, ...other }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`task-tabpanel-${index}`}
      aria-labelledby={`task-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

function TasksContent() {
  const [tabValue, setTabValue] = React.useState(0);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [formOpen, setFormOpen] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState<Task | null>(null);
  const [formMode, setFormMode] = React.useState<"create" | "edit">("create");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCreateTask = () => {
    setEditingTask(null);
    setFormMode("create");
    setFormOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setFormMode("edit");
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingTask(null);
  };

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      {/* Header */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Task Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Create, assign, and track tasks with your team
          </Typography>
        </Box>
        {!isMobile && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateTask}
            size="large"
          >
            Create New Task
          </Button>
        )}
      </Stack>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="task management tabs">
          <Tab
            icon={<DashboardIcon />}
            iconPosition="start"
            label="Dashboard"
            id="task-tab-0"
            aria-controls="task-tabpanel-0"
          />
          <Tab
            icon={<ListIcon />}
            iconPosition="start"
            label="Task List"
            id="task-tab-1"
            aria-controls="task-tabpanel-1"
          />
        </Tabs>
      </Box>

      {/* Tab Panels */}
      <TabPanel value={tabValue} index={0}>
        <TaskDashboard />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Stack spacing={3}>
          <TaskFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
          <TaskList
            onEditTask={handleEditTask}
            searchQuery={searchQuery}
          />
        </Stack>
      </TabPanel>

      {/* Floating Action Button for Mobile */}
      {isMobile && (
        <Fab
          color="primary"
          aria-label="create task"
          onClick={handleCreateTask}
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
            zIndex: 1000,
          }}
        >
          <AddIcon />
        </Fab>
      )}

      {/* Task Form Dialog */}
      <TaskForm
        open={formOpen}
        onClose={handleCloseForm}
        task={editingTask}
        mode={formMode}
      />
    </Box>
  );
}

export default function Tasks() {
  return <TasksContent />;
}
