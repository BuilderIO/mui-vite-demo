import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";

export default function Contacts() {
  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1">
          Contacts Page
        </Typography>
        <Chip label="Coming Soon" color="primary" variant="outlined" />
      </Stack>
      <Typography paragraph>
        This is the contacts management page where you can organize and manage
        your business contacts.
      </Typography>
    </Box>
  );
}
