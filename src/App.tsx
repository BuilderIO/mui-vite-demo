import * as React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CrmDashboard from "./crm/CrmDashboard";
// change just for testing diff

function NotFound() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "radial-gradient(circle at 30% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)",
          pointerEvents: "none",
        },
      }}
    >
      <Box
        sx={{
          textAlign: "center",
          zIndex: 1,
          animation: "fadeInUp 0.6s ease-out",
          "@keyframes fadeInUp": {
            from: {
              opacity: 0,
              transform: "translateY(30px)",
            },
            to: {
              opacity: 1,
              transform: "translateY(0)",
            },
          },
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: "6rem", md: "10rem" },
            fontWeight: 800,
            color: "white",
            textShadow: "0 10px 30px rgba(0,0,0,0.3)",
            mb: 2,
            lineHeight: 1,
          }}
        >
          404
        </Typography>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            color: "white",
            mb: 2,
            fontWeight: 600,
            textShadow: "0 2px 10px rgba(0,0,0,0.2)",
          }}
        >
          Page Not Found
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "rgba(255,255,255,0.9)",
            mb: 4,
            maxWidth: "500px",
            fontSize: "1.1rem",
          }}
        >
          The page you're looking for doesn't exist or has been moved.
        </Typography>
        <Box
          component="a"
          href="/"
          sx={{
            display: "inline-block",
            px: 4,
            py: 1.5,
            backgroundColor: "white",
            color: "#667eea",
            borderRadius: "50px",
            textDecoration: "none",
            fontWeight: 600,
            fontSize: "1rem",
            transition: "all 0.3s ease",
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
            },
          }}
        >
          Go Back Home
        </Box>
      </Box>
    </Box>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <CssBaseline enableColorScheme />
      <Routes>
        <Route path="/*" element={<CrmDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
