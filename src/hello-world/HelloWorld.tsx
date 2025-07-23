import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import CssBaseline from "@mui/material/CssBaseline";
import { styled } from "@mui/material/styles";
import AppTheme from "../shared-theme/AppTheme";
import ColorModeSelect from "../shared-theme/ColorModeSelect";

const HelloContainer = styled(Stack)(({ theme }) => ({
  height: "100vh",
  padding: theme.spacing(2),
  backgroundImage:
    "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
  ...theme.applyStyles("dark", {
    backgroundImage:
      "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
  }),
}));

const HelloCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(6),
  textAlign: "center",
  maxWidth: 600,
  margin: "auto",
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

export default function HelloWorld(props: { disableCustomTheme?: boolean }) {
  const [clickCount, setClickCount] = React.useState(0);

  const handleClick = () => {
    setClickCount(prev => prev + 1);
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <HelloContainer
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <ColorModeSelect
          sx={{ position: "fixed", top: "1rem", right: "1rem" }}
        />
        <HelloCard elevation={3}>
          <Stack spacing={4} alignItems="center">
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontSize: "clamp(2.5rem, 8vw, 4rem)",
                fontWeight: "bold",
                background: (theme) =>
                  theme.palette.mode === "light"
                    ? "linear-gradient(45deg, #1976d2, #42a5f5)"
                    : "linear-gradient(45deg, #90caf9, #64b5f6)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Hello World! 👋
            </Typography>
            
            <Typography
              variant="h5"
              color="text.secondary"
              sx={{ maxWidth: 400 }}
            >
              Welcome to your new MUI Vite demo page
            </Typography>
            
            <Typography variant="body1" color="text.secondary">
              This is a simple Hello World page built with Material-UI components.
              It follows the same patterns used throughout the project.
            </Typography>

            <Box sx={{ mt: 3 }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleClick}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: "1.1rem",
                  borderRadius: 2,
                }}
              >
                Click me! ({clickCount})
              </Button>
            </Box>

            <Typography variant="caption" color="text.secondary">
              You've clicked the button {clickCount} time{clickCount !== 1 ? 's' : ''}
            </Typography>
          </Stack>
        </HelloCard>
      </HelloContainer>
    </AppTheme>
  );
}
