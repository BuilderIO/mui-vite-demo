import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import WavingHandIcon from "@mui/icons-material/WavingHand";

export default function HelloWorld() {
  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Stack spacing={3} sx={{ alignItems: "center", textAlign: "center" }}>
        <Typography variant="h3" component="h1" gutterBottom>
          <WavingHandIcon sx={{ fontSize: "inherit", mr: 1, color: "primary.main" }} />
          Hello World!
        </Typography>
        
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: "600px" }}>
          Welcome to the MUI Vite Demo project. This is a simple Hello World page
          built with Material-UI components and integrated into the CRM dashboard.
        </Typography>

        <Card sx={{ maxWidth: "500px", mt: 3 }}>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              Project Info
            </Typography>
            <Stack spacing={2} sx={{ mt: 2 }}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Framework
                </Typography>
                <Chip label="React + TypeScript" color="primary" size="small" />
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  UI Library
                </Typography>
                <Chip label="Material-UI v7" color="secondary" size="small" />
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Build Tool
                </Typography>
                <Chip label="Vite" color="success" size="small" />
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Routing
                </Typography>
                <Chip label="React Router v7" color="info" size="small" />
              </Box>
            </Stack>
          </CardContent>
        </Card>

        <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
          This page demonstrates a basic Material-UI layout integrated into the existing
          CRM dashboard navigation structure.
        </Typography>
      </Stack>
    </Box>
  );
}
