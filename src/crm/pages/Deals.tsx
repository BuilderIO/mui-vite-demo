import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";

export default function Deals() {
  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1">
          Deals Page
        </Typography>
        <Chip label="Coming Soon" color="primary" size="small" />
      </Stack>
      <Typography paragraph>
        This is the deals management page where you can track and manage your
        sales pipeline.
      </Typography>
    </Box>
  );
}
