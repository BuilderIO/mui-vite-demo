import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import AddIcon from "@mui/icons-material/Add";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import ListIcon from "@mui/icons-material/List";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import TaskStats from "../components/TaskStats";
import usersService from "../services/usersService";
import type { Task, TaskFormData, TaskStatus, TeamMember } from "../types/taskTypes";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`task-tabpanel-${index}`}
      aria-labelledby={`task-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

// Mock data for initial development - in a real app, this would come from an API
const generateMockTasks = (teamMembers: TeamMember[]): Task[] => {
  const mockTasks: Task[] = [
    {
      id: "1",
      title: "Implement user authentication system",
      description: "Create a secure authentication system with JWT tokens and password hashing. Include login, logout, and password reset functionality.",
      priority: "high",
      status: "in_progress",
      assignee: teamMembers[0],
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      createdBy: teamMembers[0],
      tags: ["Security", "Backend", "Authentication"],
      estimatedHours: 16,
      reminderDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "2",
      title: "Design landing page mockups",
      description: "Create high-fidelity mockups for the new landing page including mobile and desktop versions.",
      priority: "medium",
      status: "todo",
      assignee: teamMembers[1],
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      createdBy: teamMembers[1],
      tags: ["Design", "UI/UX", "Landing Page"],
      estimatedHours: 8,
    },
    {
      id: "3",
      title: "Fix critical database performance issues",
      description: "Investigate and resolve slow query performance affecting the user dashboard. Add proper indexing and optimize queries.",
      priority: "high",
      status: "completed",
      assignee: teamMembers[2],
      dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      createdBy: teamMembers[2],
      tags: ["Database", "Performance", "Bug Fix"],
      estimatedHours: 12,
      actualHours: 14,
    },
    {
      id: "4",
      title: "Write API documentation",
      description: "Document all API endpoints with examples, request/response schemas, and authentication requirements.",
      priority: "low",
      status: "on_hold",
      assignee: teamMembers[3],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      createdBy: teamMembers[3],
      tags: ["Documentation", "API"],
      estimatedHours: 6,
    },
    {
      id: "5",
      title: "Set up CI/CD pipeline",
      description: "Configure automated testing and deployment pipeline using GitHub Actions. Include staging and production environments.",
      priority: "medium",
      status: "in_progress",
      assignee: teamMembers[4],
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now()).toISOString(),
      createdBy: teamMembers[4],
      tags: ["DevOps", "CI/CD", "Automation"],
      estimatedHours: 10,
    },
    {
      id: "6",
      title: "Conduct user research interviews",
      description: "Interview 10 existing users to gather feedback on the current product and identify pain points.",
      priority: "medium",
      status: "todo",
      dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // Overdue
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      createdBy: teamMembers[0],
      tags: ["Research", "User Experience"],
      estimatedHours: 20,
    },
  ];

  return mockTasks;
};

export default function Tasks() {
  const [currentTab, setCurrentTab] = React.useState(0);
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [teamMembers, setTeamMembers] = React.useState<TeamMember[]>([]);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState<Task | undefined>();
  const [loading, setLoading] = React.useState(true);
  const [formLoading, setFormLoading] = React.useState(false);
  const [snackbar, setSnackbar] = React.useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "warning" | "info";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  // Fetch team members from API
  React.useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        setLoading(true);
        const members = await usersService.getAllTeamMembers();
        setTeamMembers(members.slice(0, 10)); // Limit to 10 members for demo
        
        // Generate mock tasks with real team members
        const mockTasks = generateMockTasks(members.slice(0, 5));
        setTasks(mockTasks);
      } catch (error) {
        console.error("Failed to fetch team members:", error);
        showSnackbar("Failed to load team members", "error");
        
        // Fallback mock data if API fails
        const fallbackMembers: TeamMember[] = [
          { id: "1", name: { first: "John", last: "Doe" }, email: "john@example.com" },
          { id: "2", name: { first: "Jane", last: "Smith" }, email: "jane@example.com" },
          { id: "3", name: { first: "Mike", last: "Johnson" }, email: "mike@example.com" },
          { id: "4", name: { first: "Sarah", last: "Wilson" }, email: "sarah@example.com" },
          { id: "5", name: { first: "David", last: "Brown" }, email: "david@example.com" },
        ];
        setTeamMembers(fallbackMembers);
        setTasks(generateMockTasks(fallbackMembers));
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  const showSnackbar = (message: string, severity: "success" | "error" | "warning" | "info") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleCreateTask = () => {
    setEditingTask(undefined);
    setIsFormOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTask(undefined);
  };

  const generateTaskId = (): string => {
    return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleSubmitTask = async (formData: TaskFormData) => {
    try {
      setFormLoading(true);

      const assignee = formData.assigneeId 
        ? teamMembers.find(member => member.id === formData.assigneeId)
        : undefined;

      const currentUser = teamMembers[0] || {
        id: "current_user",
        name: { first: "Current", last: "User" },
        email: "current@example.com",
      };

      if (editingTask) {
        // Update existing task
        const updatedTask: Task = {
          ...editingTask,
          title: formData.title,
          description: formData.description,
          priority: formData.priority,
          assignee,
          dueDate: formData.dueDate,
          tags: formData.tags,
          estimatedHours: formData.estimatedHours,
          reminderDate: formData.reminderDate,
          updatedAt: new Date().toISOString(),
        };

        setTasks(prev => prev.map(task => 
          task.id === editingTask.id ? updatedTask : task
        ));

        showSnackbar("Task updated successfully", "success");
      } else {
        // Create new task
        const newTask: Task = {
          id: generateTaskId(),
          title: formData.title,
          description: formData.description,
          priority: formData.priority,
          status: "todo",
          assignee,
          dueDate: formData.dueDate,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: currentUser,
          tags: formData.tags,
          estimatedHours: formData.estimatedHours,
          reminderDate: formData.reminderDate,
        };

        setTasks(prev => [newTask, ...prev]);
        showSnackbar("Task created successfully", "success");
      }

      handleCloseForm();
    } catch (error) {
      console.error("Failed to save task:", error);
      showSnackbar("Failed to save task", "error");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      setTasks(prev => prev.filter(task => task.id !== taskId));
      showSnackbar("Task deleted successfully", "success");
    } catch (error) {
      console.error("Failed to delete task:", error);
      showSnackbar("Failed to delete task", "error");
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    try {
      setTasks(prev => prev.map(task => 
        task.id === taskId 
          ? { ...task, status: newStatus, updatedAt: new Date().toISOString() }
          : task
      ));
      showSnackbar(`Task status updated to ${newStatus.replace('_', ' ')}`, "success");
    } catch (error) {
      console.error("Failed to update task status:", error);
      showSnackbar("Failed to update task status", "error");
    }
  };

  if (loading) {
    return (
      <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" }, p: 3 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
          Loading Tasks...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1">
          Task Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateTask}
          size="large"
        >
          Create Task
        </Button>
      </Stack>

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs value={currentTab} onChange={handleTabChange} aria-label="task management tabs">
          <Tab
            label="Tasks"
            icon={<ListIcon />}
            iconPosition="start"
            id="task-tab-0"
            aria-controls="task-tabpanel-0"
          />
          <Tab
            label="Analytics"
            icon={<AnalyticsIcon />}
            iconPosition="start"
            id="task-tab-1"
            aria-controls="task-tabpanel-1"
          />
        </Tabs>
      </Box>

      <TabPanel value={currentTab} index={0}>
        <TaskList
          tasks={tasks}
          teamMembers={teamMembers}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          onStatusChange={handleStatusChange}
        />
      </TabPanel>

      <TabPanel value={currentTab} index={1}>
        <TaskStats tasks={tasks} teamMembers={teamMembers} />
      </TabPanel>

      <Dialog
        open={isFormOpen}
        onClose={handleCloseForm}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { minHeight: "600px" }
        }}
      >
        <DialogTitle>
          {editingTask ? "Edit Task" : "Create New Task"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TaskForm
              task={editingTask}
              onSubmit={handleSubmitTask}
              onCancel={handleCloseForm}
              teamMembers={teamMembers}
              loading={formLoading}
            />
          </Box>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
