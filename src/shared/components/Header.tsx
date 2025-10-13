import * as React from "react";
import { alpha, styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Drawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ColorModeIconDropdown from "../../shared-theme/ColorModeIconDropdown";

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: "blur(24px)",
  border: "1px solid",
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: theme.vars
    ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
    : alpha(theme.palette.background.default, 0.4),
  boxShadow: (theme.vars || theme).shadows[1],
  padding: "8px 12px",
}));

interface NavigationItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface HeaderProps {
  title?: string;
  navigationItems?: NavigationItem[];
  showAuthButtons?: boolean;
  onSignIn?: () => void;
  onSignUp?: () => void;
}

export default function Header({
  title = "MUI Vite Demo",
  navigationItems = [
    { label: "Dashboard", href: "#dashboard" },
    { label: "Components", href: "#components" },
    { label: "Examples", href: "#examples" },
    { label: "About", href: "#about" },
  ],
  showAuthButtons = true,
  onSignIn,
  onSignUp,
}: HeaderProps) {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const handleItemClick = (item: NavigationItem) => {
    if (item.onClick) {
      item.onClick();
    } else if (item.href) {
      // Handle navigation
      window.location.hash = item.href;
    }
    setOpen(false);
  };

  return (
    <AppBar
      position="fixed"
      enableColorOnDark
      sx={{
        boxShadow: 0,
        bgcolor: "transparent",
        backgroundImage: "none",
        mt: "calc(var(--template-frame-height, 0px) + 28px)",
      }}
    >
      <Container maxWidth="lg">
        <StyledToolbar variant="dense" disableGutters>
          <Box
            sx={{ flexGrow: 1, display: "flex", alignItems: "center", px: 0 }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <AppLogo />
              <Typography
                variant="h6"
                component="div"
                sx={{
                  fontWeight: "bold",
                  color: "text.primary",
                  display: { xs: "none", sm: "block" },
                }}
              >
                {title}
              </Typography>
            </Box>
            <Box sx={{ display: { xs: "none", md: "flex" }, ml: 3 }}>
              {navigationItems.map((item) => (
                <Button
                  key={item.label}
                  variant="text"
                  color="info"
                  size="small"
                  onClick={() => handleItemClick(item)}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          </Box>
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 1,
              alignItems: "center",
            }}
          >
            {showAuthButtons && (
              <>
                <Button
                  color="primary"
                  variant="text"
                  size="small"
                  onClick={onSignIn}
                >
                  Sign in
                </Button>
                <Button
                  color="primary"
                  variant="contained"
                  size="small"
                  onClick={onSignUp}
                >
                  Sign up
                </Button>
              </>
            )}
            <ColorModeIconDropdown />
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" }, gap: 1 }}>
            <ColorModeIconDropdown size="medium" />
            <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="top"
              open={open}
              onClose={toggleDrawer(false)}
              PaperProps={{
                sx: {
                  top: "var(--template-frame-height, 0px)",
                },
              }}
            >
              <Box sx={{ p: 2, backgroundColor: "background.default" }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {title}
                  </Typography>
                  <IconButton onClick={toggleDrawer(false)}>
                    <CloseRoundedIcon />
                  </IconButton>
                </Box>
                {navigationItems.map((item) => (
                  <MenuItem key={item.label} onClick={() => handleItemClick(item)}>
                    {item.label}
                  </MenuItem>
                ))}
                {showAuthButtons && (
                  <>
                    <Divider sx={{ my: 3 }} />
                    <MenuItem>
                      <Button
                        color="primary"
                        variant="contained"
                        fullWidth
                        onClick={onSignUp}
                      >
                        Sign up
                      </Button>
                    </MenuItem>
                    <MenuItem>
                      <Button
                        color="primary"
                        variant="outlined"
                        fullWidth
                        onClick={onSignIn}
                      >
                        Sign in
                      </Button>
                    </MenuItem>
                  </>
                )}
              </Box>
            </Drawer>
          </Box>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
}

export function AppLogo() {
  return (
    <Box
      sx={{
        width: "2rem",
        height: "2rem",
        bgcolor: "primary.main",
        borderRadius: "8px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.15)",
        background: (theme) =>
          `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
      }}
    >
      <HomeRoundedIcon sx={{ color: "white", fontSize: "1.25rem" }} />
    </Box>
  );
}
