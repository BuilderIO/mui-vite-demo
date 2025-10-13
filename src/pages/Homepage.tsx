import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import PaletteRoundedIcon from "@mui/icons-material/PaletteRounded";
import CodeRoundedIcon from "@mui/icons-material/CodeRounded";
import SpeedRoundedIcon from "@mui/icons-material/SpeedRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";

import AppTheme from "../shared-theme/AppTheme";

const StyledBox = styled("div")(({ theme }) => ({
  alignSelf: "center",
  width: "100%",
  height: 400,
  marginTop: theme.spacing(8),
  borderRadius: (theme.vars || theme).shape.borderRadius,
  outline: "6px solid",
  outlineColor: "hsla(220, 25%, 80%, 0.2)",
  border: "1px solid",
  borderColor: (theme.vars || theme).palette.grey[200],
  boxShadow: "0 0 12px 8px hsla(220, 25%, 80%, 0.2)",
  backgroundImage: `url(${process.env.TEMPLATE_IMAGE_URL || "https://mui.com"}/static/screenshots/material-ui/getting-started/templates/dashboard.jpg)`,
  backgroundSize: "cover",
  [theme.breakpoints.up("sm")]: {
    marginTop: theme.spacing(10),
    height: 700,
  },
  ...theme.applyStyles("dark", {
    boxShadow: "0 0 24px 12px hsla(210, 100%, 25%, 0.2)",
    backgroundImage: `url(${process.env.TEMPLATE_IMAGE_URL || "https://mui.com"}/static/screenshots/material-ui/getting-started/templates/dashboard-dark.jpg)`,
    outlineColor: "hsla(220, 20%, 42%, 0.1)",
    borderColor: (theme.vars || theme).palette.grey[700],
  }),
}));

const features = [
  {
    icon: <DashboardRoundedIcon />,
    title: "Dashboard Components",
    description: "Comprehensive dashboard with charts, data grids, and analytics components built with MUI X.",
  },
  {
    icon: <BusinessRoundedIcon />,
    title: "CRM System",
    description: "Complete customer relationship management system with contacts, deals, and reporting.",
  },
  {
    icon: <PaletteRoundedIcon />,
    title: "Material Design",
    description: "Beautiful, responsive UI components following Material Design principles with dark/light themes.",
  },
  {
    icon: <CodeRoundedIcon />,
    title: "TypeScript Ready",
    description: "Full TypeScript support with type safety and excellent developer experience.",
  },
  {
    icon: <SpeedRoundedIcon />,
    title: "Performance Optimized",
    description: "Built with Vite for lightning-fast development and optimized production builds.",
  },
  {
    icon: <SecurityRoundedIcon />,
    title: "Best Practices",
    description: "Following React and MUI best practices with accessibility and responsive design.",
  },
];

function Hero() {
  return (
    <Box
      sx={(theme) => ({
        width: "100%",
        backgroundRepeat: "no-repeat",
        backgroundImage:
          "radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 90%), transparent)",
        ...theme.applyStyles("dark", {
          backgroundImage:
            "radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 16%), transparent)",
        }),
      })}
    >
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pt: { xs: 14, sm: 20 },
          pb: { xs: 8, sm: 12 },
        }}
      >
        <Stack
          spacing={2}
          useFlexGap
          sx={{ alignItems: "center", width: { xs: "100%", sm: "70%" } }}
        >
          <Typography
            variant="h1"
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: "center",
              fontSize: "clamp(3rem, 10vw, 3.5rem)",
            }}
          >
            MUI&nbsp;Vite&nbsp;
            <Typography
              component="span"
              variant="h1"
              sx={(theme) => ({
                fontSize: "inherit",
                color: "primary.main",
                ...theme.applyStyles("dark", {
                  color: "primary.light",
                }),
              })}
            >
              Demo
            </Typography>
          </Typography>
          <Typography
            sx={{
              textAlign: "center",
              color: "text.secondary",
              width: { sm: "100%", md: "80%" },
            }}
          >
            A modern React application showcasing Material-UI components, dashboard layouts, 
            CRM functionality, and responsive design patterns. Built with TypeScript and Vite 
            for optimal development experience.
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{ pt: 2 }}
          >
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => window.location.hash = "#features"}
            >
              Explore Features
            </Button>
            <Button
              variant="outlined"
              color="primary"
              size="large"
              onClick={() => window.location.hash = "#/crm"}
            >
              View CRM Demo
            </Button>
          </Stack>
        </Stack>
        <StyledBox />
      </Container>
    </Box>
  );
}

function Features() {
  return (
    <Container id="features" sx={{ py: { xs: 8, sm: 16 } }}>
      <Box sx={{ width: { sm: "100%", md: "60%" }, mb: { xs: 4, sm: 8 } }}>
        <Typography
          component="h2"
          variant="h4"
          gutterBottom
          sx={{ color: "text.primary" }}
        >
          Project Features
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: "text.secondary" }}
        >
          This demo project showcases various Material-UI components and patterns, 
          including dashboard layouts, data visualization, forms, and responsive design.
        </Typography>
      </Box>
      <Grid container spacing={3}>
        {features.map((feature, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card
              variant="outlined"
              sx={{
                p: 3,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 2,
                "&:hover": {
                  boxShadow: (theme) => theme.shadows[4],
                },
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: "8px",
                  bgcolor: "primary.main",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                }}
              >
                {feature.icon}
              </Box>
              <Typography variant="h6" component="h3" fontWeight="medium">
                {feature.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
                {feature.description}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

function SimpleFooter() {
  return (
    <Box
      sx={(theme) => ({
        py: { xs: 8, sm: 10 },
        color: "white",
        bgcolor: "grey.900",
        ...theme.applyStyles("dark", {
          bgcolor: "grey.800",
        }),
      })}
    >
      <Container>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Typography variant="body2" sx={{ color: "grey.400" }}>
            © 2024 MUI Vite Demo. Built with Material-UI and Vite.
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button
              variant="text"
              size="small"
              sx={{ color: "grey.400" }}
              onClick={() => window.location.hash = "#/crm"}
            >
              CRM Demo
            </Button>
            <Button
              variant="text"
              size="small"
              sx={{ color: "grey.400" }}
              onClick={() => window.location.hash = "#/dashboard"}
            >
              Dashboard
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}

export default function Homepage() {
  return (
    <>
      <Hero />
      <Features />
      <SimpleFooter />
    </>
  );
}
