import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import ConstructionIcon from "@mui/icons-material/Construction";

export default function Deals() {
  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
        Deals Page
      </Typography>
      <Paper
        variant="outlined"
        sx={{
          p: 6,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          backgroundColor: (theme) =>
            theme.palette.mode === "light" ? "grey.50" : "grey.900",
          borderStyle: "dashed",
          borderRadius: 2,
        }}
      >
        <ConstructionIcon sx={{ fontSize: 60, color: "primary.main" }} />
        <Typography variant="h5" fontWeight="bold">
          Coming Soon
        </Typography>
        <Typography color="text.secondary" align="center" sx={{ maxWidth: 400 }}>
          This is the deals management page where you can track and manage your
          sales pipeline. We're currently building some powerful features for you.
        </Typography>
      </Paper>
    </Box>
  );
}
