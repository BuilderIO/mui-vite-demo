import * as React from "react";
import { styled } from "@mui/material/styles";
import { useNavigate, useLocation } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import MuiDrawer, { drawerClasses } from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import CrmSelectCompany from "./CrmSelectCompany";
import CrmMenuContent from "./CrmMenuContent";
import CrmOptionsMenu from "./CrmOptionsMenu";

export const drawerWidth = 240;
export const collapsedDrawerWidth = 64;

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "isCollapsed",
})<{ isCollapsed?: boolean }>(({ theme, isCollapsed }) => ({
  width: isCollapsed ? collapsedDrawerWidth : drawerWidth,
  flexShrink: 0,
  boxSizing: "border-box",
  mt: 10,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.standard,
  }),
  [`& .${drawerClasses.paper}`]: {
    width: isCollapsed ? collapsedDrawerWidth : drawerWidth,
    boxSizing: "border-box",
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.standard,
    }),
  },
}));

interface CrmSideMenuProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function CrmSideMenu({
  isCollapsed = false,
  onToggleCollapse,
}: CrmSideMenuProps) {
  return (
    <Drawer
      variant="permanent"
      isCollapsed={isCollapsed}
      sx={{
        display: { xs: "none", md: "block" },
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: "background.paper",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: isCollapsed ? "center" : "space-between",
          mt: "calc(var(--template-frame-height, 0px) + 4px)",
          p: 1.5,
          minHeight: 56, // Ensure consistent height
        }}
      >
        {!isCollapsed && (
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <CrmSelectCompany isCollapsed={isCollapsed} />
          </Box>
        )}
        <IconButton
          onClick={onToggleCollapse}
          size="small"
          sx={{
            ml: isCollapsed ? 0 : 1,
            bgcolor: "action.hover",
            "&:hover": {
              bgcolor: "action.selected",
            },
          }}
        >
          {isCollapsed ? <MenuIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Box>
      <Divider />
      <Box
        sx={{
          overflow: "auto",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <CrmMenuContent isCollapsed={isCollapsed} />
      </Box>
      <Stack
        direction="row"
        sx={{
          p: isCollapsed ? 1 : 2,
          gap: 1,
          alignItems: "center",
          borderTop: "1px solid",
          borderColor: "divider",
          justifyContent: isCollapsed ? "center" : "flex-start",
        }}
      >
        <Avatar
          sizes="small"
          alt="Alex Thompson"
          src="/static/images/avatar/7.jpg"
          sx={{ width: 36, height: 36, bgcolor: "primary.main" }}
        >
          AT
        </Avatar>
        {!isCollapsed && (
          <>
            <Box sx={{ mr: "auto" }}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 500, lineHeight: "16px" }}
              >
                Alex Thompson
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                alex@acmecrm.com
              </Typography>
            </Box>
            <CrmOptionsMenu />
          </>
        )}
      </Stack>
    </Drawer>
  );
}
