import * as React from "react";
import { styled } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import MuiToolbar from "@mui/material/Toolbar";
import { tabsClasses } from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import CrmSideMenuMobile from "./CrmSideMenuMobile";
import MenuButton from "../../dashboard/components/MenuButton";
import ColorModeIconDropdown from "../../shared-theme/ColorModeIconDropdown";
import TaskNotifications from "./TaskNotifications";

const Toolbar = styled(MuiToolbar)({
  width: "100%",
  padding: "12px",
  display: "flex",
  flexDirection: "column",
  alignItems: "start",
  justifyContent: "center",
  gap: "12px",
  flexShrink: 0,
  [`& ${tabsClasses.flexContainer}`]: {
    gap: "8px",
    p: "8px",
    pb: 0,
  },
});

export default function CrmAppNavbar() {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  // Sample tasks for notifications - in real app, this would come from context or props
  const sampleTasks = [
    {
      id: 1,
      title: "Complete project review",
      description: "Review and finalize the Q4 project deliverables",
      status: "in_progress" as const,
      priority: "high" as const,
      assignee: "Current User",
      assigneeAvatar: "CU",
      assigneeId: "1",
      dueDate: new Date().toISOString().split('T')[0], // Due today
      createdDate: "2024-01-20",
    },
    {
      id: 2,
      title: "Update documentation",
      description: "Update API documentation with recent changes",
      status: "pending" as const,
      priority: "medium" as const,
      assignee: "Current User",
      assigneeAvatar: "CU",
      assigneeId: "1",
      dueDate: new Date(Date.now() - 86400000).toISOString().split('T')[0], // Overdue
      createdDate: "2024-01-15",
    },
  ];

  return (
    <AppBar
      position="fixed"
      sx={{
        display: { xs: "auto", md: "none" },
        boxShadow: 0,
        bgcolor: "background.paper",
        backgroundImage: "none",
        borderBottom: "1px solid",
        borderColor: "divider",
        top: "var(--template-frame-height, 0px)",
      }}
    >
      <Toolbar variant="regular">
        <Stack
          direction="row"
          sx={{
            alignItems: "center",
            flexGrow: 1,
            width: "100%",
            gap: 1,
          }}
        >
          <Stack
            direction="row"
            spacing={1}
            sx={{ justifyContent: "center", mr: "auto" }}
          >
            <CrmLogo />
            <Typography
              variant="h5"
              component="h1"
              sx={{ color: "text.primary" }}
            >
              Acme CRM
            </Typography>
          </Stack>
          <Box sx={{ position: "relative" }}>
            <TaskNotifications
              tasks={sampleTasks}
              currentUserId="1"
            />
          </Box>
          <ColorModeIconDropdown />
          <MenuButton aria-label="menu" onClick={toggleDrawer(true)}>
            <MenuRoundedIcon />
          </MenuButton>
          <CrmSideMenuMobile open={open} toggleDrawer={toggleDrawer} />
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

export function CrmLogo() {
  return (
    <Box
      sx={{
        width: "1.75rem",
        height: "1.75rem",
        bgcolor: "primary.main",
        borderRadius: "8px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
      }}
    >
      <BusinessRoundedIcon sx={{ color: "white", fontSize: "1.25rem" }} />
    </Box>
  );
}
