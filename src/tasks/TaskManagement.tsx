import React, { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Paper,
  Typography,
  Container,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  List as ListIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { TaskProvider } from './context/TaskContext';
import TaskDashboard from './components/TaskDashboard';
import TaskList from './components/TaskList';
import NotificationCenter from './components/NotificationCenter';

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
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `task-tab-${index}`,
    'aria-controls': `task-tabpanel-${index}`,
  };
}

function TaskManagementContent() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Task Management System
        </Typography>
        <NotificationCenter />
      </Box>

      <Paper sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="task management tabs"
            sx={{ px: 2 }}
          >
            <Tab
              icon={<DashboardIcon />}
              label="Dashboard"
              iconPosition="start"
              sx={{ textTransform: 'none', minHeight: 'auto', py: 2 }}
              {...a11yProps(0)}
            />
            <Tab
              icon={<ListIcon />}
              label="Task List"
              iconPosition="start"
              sx={{ textTransform: 'none', minHeight: 'auto', py: 2 }}
              {...a11yProps(1)}
            />
            <Tab
              icon={<AssessmentIcon />}
              label="Reports"
              iconPosition="start"
              sx={{ textTransform: 'none', minHeight: 'auto', py: 2 }}
              {...a11yProps(2)}
            />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Container maxWidth={false} sx={{ px: 3 }}>
            <TaskDashboard />
          </Container>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Container maxWidth={false} sx={{ px: 3 }}>
            <TaskList />
          </Container>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Container maxWidth={false} sx={{ px: 3 }}>
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <AssessmentIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h5" color="text.secondary" gutterBottom>
                Reports Coming Soon
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Advanced analytics and reporting features will be available in the next release.
              </Typography>
            </Box>
          </Container>
        </TabPanel>
      </Paper>
    </Box>
  );
}

export default function TaskManagement() {
  return (
    <TaskProvider>
      <TaskManagementContent />
    </TaskProvider>
  );
}
