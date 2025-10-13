import * as React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CrmDashboard from "./crm/CrmDashboard";
import { Header } from "./shared/components";
import AppTheme from "./shared-theme/AppTheme";

function NotFound() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <Typography variant="h3" component="h1" gutterBottom>
        404: Page Not Found
      </Typography>
      <Typography variant="body1">
        The page you're looking for doesn't exist or has been moved.
      </Typography>
    </Box>
  );
}

export default function App() {
  const handleSignIn = () => {
    console.log("Sign in clicked");
  };

  const handleSignUp = () => {
    console.log("Sign up clicked");
  };

  const navigationItems = [
    { label: "Dashboard", href: "#dashboard" },
    { label: "CRM", href: "#crm" },
    { label: "Analytics", href: "#analytics" },
    { label: "Settings", href: "#settings" },
  ];

  return (
    <AppTheme>
      <BrowserRouter>
        <CssBaseline enableColorScheme />
        <Header
          title="MUI Vite Demo"
          navigationItems={navigationItems}
          showAuthButtons={true}
          onSignIn={handleSignIn}
          onSignUp={handleSignUp}
        />
        <Box sx={{ pt: "calc(var(--template-frame-height, 0px) + 120px)" }}>
          <Routes>
            <Route path="/*" element={<CrmDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Box>
      </BrowserRouter>
    </AppTheme>
  );
}
