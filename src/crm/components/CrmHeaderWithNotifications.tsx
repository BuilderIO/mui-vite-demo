import * as React from "react";
import Stack from "@mui/material/Stack";
import NavbarBreadcrumbs from "./CrmNavbarBreadcrumbs";
import { ColorModeSelect } from "../../shared-theme/ColorModeSelect";
import TaskNotificationCenter from "./TaskNotificationCenter";
import { mockTasks } from "../data/mockTaskData";

export default function CrmHeaderWithNotifications() {
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
      <NavbarBreadcrumbs />
      <Stack direction="row" sx={{ gap: 1 }}>
        <TaskNotificationCenter 
          tasks={mockTasks} 
          currentUserId="1" // Current user ID (Alex Thompson)
        />
        <ColorModeSelect />
      </Stack>
    </Stack>
  );
}
