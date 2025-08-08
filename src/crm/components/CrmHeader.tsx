import * as React from "react";
import { useLocation } from "react-router-dom";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import MenuButton from "../../dashboard/components/MenuButton";
import ColorModeIconDropdown from "../../shared-theme/ColorModeIconDropdown";
import CrmSearch from "./CrmSearch";
import CrmNavbarBreadcrumbs from "./CrmNavbarBreadcrumbs";
import Button from "@mui/material/Button";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import NotificationCenter from "./tasks/NotificationCenter";
import { useTaskData } from "../hooks/useTaskData";

export default function CrmHeader() {
  const location = useLocation();
  const isTasksPage = location.pathname.includes('/tasks');
  
  // Only load task data if we're on the tasks page
  const taskData = isTasksPage ? useTaskData() : null;

  const getPageTitle = () => {
    if (location.pathname.includes('/customers')) return 'Customers';
    if (location.pathname.includes('/deals')) return 'Deals';
    if (location.pathname.includes('/contacts')) return 'Contacts';
    if (location.pathname.includes('/tasks')) return 'Task Management';
    if (location.pathname.includes('/reports')) return 'Reports';
    if (location.pathname.includes('/settings')) return 'Settings';
    return 'CRM Dashboard';
  };

  return (
    <Stack
      direction="row"
      sx={{
        display: { xs: "none", md: "flex" },
        width: "100%",
        alignItems: { xs: "flex-start", md: "center" },
        justifyContent: "space-between",
        maxWidth: { sm: "100%", md: "1700px" },
        pt: 1.5,
      }}
      spacing={2}
    >
      <Stack direction="column" spacing={1}>
        <CrmNavbarBreadcrumbs />
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          {getPageTitle()}
        </Typography>
      </Stack>
      <Stack direction="row" sx={{ gap: 1 }}>
        <CrmSearch />
        <Button
          variant="outlined"
          size="small"
          startIcon={<CalendarTodayRoundedIcon />}
        >
          This Month
        </Button>
        {isTasksPage && taskData ? (
          <NotificationCenter
            notifications={taskData.notifications}
            onMarkAsRead={taskData.markNotificationAsRead}
          />
        ) : (
          <MenuButton showBadge aria-label="Open notifications">
            <NotificationsRoundedIcon />
          </MenuButton>
        )}
        <ColorModeIconDropdown />
      </Stack>
    </Stack>
  );
}
