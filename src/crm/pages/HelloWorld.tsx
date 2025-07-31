import * as React from "react";
import {
  Box,
  Typography,
  Paper,
  Container,
  Button,
  Stack,
  Chip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import WavingHandIcon from "@mui/icons-material/WavingHand";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";

const HelloWorldContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: "center",
  background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
  color: theme.palette.primary.contrastText,
  borderRadius: theme.spacing(2),
}));

const FeatureChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
}));

export default function HelloWorld() {
  const [clicked, setClicked] = React.useState(false);

  const handleButtonClick = () => {
    setClicked(true);
    setTimeout(() => setClicked(false), 2000);
  };

  return (
    <Container maxWidth="md">
      <Stack spacing={4}>
        <HelloWorldContainer elevation={3}>
          <Stack spacing={3} alignItems="center">
            <WavingHandIcon sx={{ fontSize: 60 }} />
            <Typography variant="h2" component="h1" fontWeight="bold">
              Hello World!
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              Welcome to the MUI Vite Demo Project
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<RocketLaunchIcon />}
              onClick={handleButtonClick}
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                color: "inherit",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.3)",
                },
              }}
            >
              {clicked ? "🎉 Clicked!" : "Get Started"}
            </Button>
          </Stack>
        </HelloWorldContainer>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Project Features
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            This project showcases various Material-UI components and patterns:
          </Typography>
          <Box sx={{ mt: 2 }}>
            <FeatureChip label="Material-UI v7" />
            <FeatureChip label="TypeScript" />
            <FeatureChip label="Vite" />
            <FeatureChip label="React Router" />
            <FeatureChip label="CRM Dashboard" />
            <FeatureChip label="Data Grid" />
            <FeatureChip label="Charts" />
            <FeatureChip label="Date Pickers" />
          </Box>
        </Paper>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            ENG-10004: Build a hello world page ✅
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This page implements the requirements from the Jira issue. It's a
            simple but elegant hello world page built with Material-UI
            components, integrated into the existing CRM dashboard structure.
          </Typography>
        </Paper>
      </Stack>
    </Container>
  );
}
