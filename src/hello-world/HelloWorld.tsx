import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import CssBaseline from "@mui/material/CssBaseline";
import { styled } from "@mui/material/styles";
import AppTheme from "../shared-theme/AppTheme";
import ColorModeSelect from "../shared-theme/ColorModeSelect";

const HelloWorldContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
  padding: theme.spacing(3),
  background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.light} 100%)`,
  ...theme.applyStyles("dark", {
    background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
  }),
}));

const WelcomeCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: "center",
  maxWidth: 600,
  width: "100%",
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[8],
  backgroundColor: theme.palette.background.paper,
  ...theme.applyStyles("dark", {
    backgroundColor: theme.palette.grey[900],
  }),
}));

export default function HelloWorld(props: { disableCustomTheme?: boolean }) {
  const [clickCount, setClickCount] = React.useState(0);

  const handleButtonClick = () => {
    setClickCount(prev => prev + 1);
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <ColorModeSelect
        sx={{ position: "fixed", top: "1rem", right: "1rem" }}
      />
      <HelloWorldContainer>
        <WelcomeCard elevation={3}>
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: "bold",
              background: "linear-gradient(45deg, #1976d2, #9c27b0)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: 3,
            }}
          >
            Hello World! 👋
          </Typography>
          
          <Typography
            variant="h5"
            component="h2"
            color="text.secondary"
            gutterBottom
            sx={{ marginBottom: 3 }}
          >
            Welcome to your MUI + Vite + TypeScript project
          </Typography>
          
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ marginBottom: 4, lineHeight: 1.7 }}
          >
            This is a simple Hello World page built with Material-UI components.
            You can customize this page to build amazing user interfaces with
            the power of React and Material Design.
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "center" }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleButtonClick}
              sx={{
                borderRadius: 2,
                padding: "12px 24px",
                fontSize: "1.1rem",
              }}
            >
              Click me! ({clickCount})
            </Button>
            
            {clickCount > 0 && (
              <Typography
                variant="body2"
                color="primary"
                sx={{
                  animation: "fadeIn 0.5s ease-in",
                  "@keyframes fadeIn": {
                    from: { opacity: 0, transform: "translateY(10px)" },
                    to: { opacity: 1, transform: "translateY(0)" },
                  },
                }}
              >
                Thanks for clicking! You've clicked {clickCount} time{clickCount !== 1 ? 's' : ''}.
              </Typography>
            )}
          </Box>
        </WelcomeCard>
      </HelloWorldContainer>
    </AppTheme>
  );
}
