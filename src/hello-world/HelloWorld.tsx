import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import { styled } from "@mui/material/styles";
import AppTheme from "../shared-theme/AppTheme";
import ColorModeSelect from "../shared-theme/ColorModeSelect";
import WavingHandIcon from "@mui/icons-material/WavingHand";
import CelebrationIcon from "@mui/icons-material/Celebration";

const HelloWorldContainer = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(3),
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `linear-gradient(135deg, 
      ${theme.palette.primary.light}15 0%, 
      ${theme.palette.secondary.light}15 50%, 
      ${theme.palette.primary.light}15 100%)`,
    zIndex: -1,
    ...theme.applyStyles("dark", {
      background: `linear-gradient(135deg, 
        ${theme.palette.primary.dark}25 0%, 
        ${theme.palette.secondary.dark}25 50%, 
        ${theme.palette.primary.dark}25 100%)`,
    }),
  },
}));

const WelcomeCard = styled(Card)(({ theme }) => ({
  maxWidth: 600,
  width: "100%",
  padding: theme.spacing(2),
  textAlign: "center",
  boxShadow: theme.shadows[8],
  borderRadius: theme.spacing(2),
  background: theme.palette.background.paper,
  ...theme.applyStyles("dark", {
    background: theme.palette.background.paper,
  }),
}));

const AnimatedIcon = styled(WavingHandIcon)(({ theme }) => ({
  fontSize: "4rem",
  color: theme.palette.primary.main,
  animation: "wave 2s ease-in-out infinite",
  "@keyframes wave": {
    "0%, 100%": {
      transform: "rotate(0deg)",
    },
    "25%": {
      transform: "rotate(-20deg)",
    },
    "75%": {
      transform: "rotate(20deg)",
    },
  },
}));

export default function HelloWorld(props: { disableCustomTheme?: boolean }) {
  const [celebrated, setCelebrated] = React.useState(false);

  const handleCelebrate = () => {
    setCelebrated(true);
    setTimeout(() => setCelebrated(false), 3000);
  };

  return (
    <AppTheme {...props}>
      <HelloWorldContainer>
        <ColorModeSelect
          sx={{ position: "fixed", top: "1rem", right: "1rem" }}
        />
        
        <WelcomeCard>
          <CardContent>
            <Stack spacing={3} alignItems="center">
              <AnimatedIcon />
              
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  fontWeight: 700,
                  background: (theme) =>
                    `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontSize: { xs: "2.5rem", md: "3.5rem" },
                }}
              >
                Hello World!
              </Typography>
              
              <Typography
                variant="h5"
                color="text.secondary"
                sx={{ maxWidth: 400 }}
              >
                Welcome to your new Material-UI page built with Vite and TypeScript
              </Typography>
              
              <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center">
                <Chip label="React" color="primary" variant="outlined" />
                <Chip label="Material-UI" color="secondary" variant="outlined" />
                <Chip label="TypeScript" color="primary" variant="outlined" />
                <Chip label="Vite" color="secondary" variant="outlined" />
              </Stack>
              
              <Button
                variant="contained"
                size="large"
                startIcon={celebrated ? <CelebrationIcon /> : <WavingHandIcon />}
                onClick={handleCelebrate}
                sx={{
                  mt: 2,
                  borderRadius: 3,
                  textTransform: "none",
                  fontSize: "1.1rem",
                  px: 4,
                  py: 1.5,
                }}
              >
                {celebrated ? "🎉 Celebrating!" : "Say Hello!"}
              </Button>
              
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                This page demonstrates Material-UI components with custom theming
              </Typography>
            </Stack>
          </CardContent>
        </WelcomeCard>
      </HelloWorldContainer>
    </AppTheme>
  );
}
