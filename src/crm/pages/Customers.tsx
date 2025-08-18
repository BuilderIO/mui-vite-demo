import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import CustomersDataGrid from "../components/CustomersDataGrid";

export default function Customers() {
  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
        Customers
      </Typography>
      <Typography variant="body1" sx={{ mb: 4, color: "text.secondary" }}>
        Manage your customer database and view detailed customer information.
      </Typography>
      
      <Paper sx={{ p: 2, mb: 4 }}>
        <CustomersDataGrid />
      </Paper>
    </Box>
  );
}
