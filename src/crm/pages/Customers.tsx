import * as React from "react";
import { useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import Copyright from "../../dashboard/internals/components/Copyright";
import CustomerStatsCards from "../components/CustomerStatsCards";
import CustomersDataGrid from "../components/CustomersDataGrid";
import CustomerDemographicsChart from "../components/CustomerDemographicsChart";
import ApiTest from "../components/ApiTest";
import { User } from "../types/User";

export default function Customers() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    console.log("Selected user:", user);
  };

  const handleExportData = () => {
    // TODO: Implement CSV/Excel export functionality
    console.log("Exporting customer data...");
  };

  const handleAddCustomer = () => {
    // TODO: Implement add customer modal/dialog
    console.log("Adding new customer...");
  };

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      {/* Header with action buttons */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3, display: { xs: "none", sm: "flex" } }}
      >
        <Typography variant="h5" component="h2">
          Customer Management
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<DownloadRoundedIcon />}
            sx={{ mr: 1 }}
            onClick={handleExportData}
          >
            Export Data
          </Button>
          <Button
            variant="contained"
            startIcon={<AddRoundedIcon />}
            onClick={handleAddCustomer}
          >
            Add Customer
          </Button>
        </Box>
      </Stack>

      {/* Mobile header */}
      <Box sx={{ display: { xs: "block", sm: "none" }, mb: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Customer Management
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<DownloadRoundedIcon />}
            onClick={handleExportData}
          >
            Export
          </Button>
          <Button
            variant="contained"
            size="small"
            startIcon={<AddRoundedIcon />}
            onClick={handleAddCustomer}
          >
            Add Customer
          </Button>
        </Stack>
      </Box>

      {/* API Test - Temporary for debugging */}
      <Box sx={{ mb: 3 }}>
        <ApiTest />
      </Box>

      {/* Customer Statistics Cards */}
      <CustomerStatsCards />

      {/* Main content grid */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {/* Customer Data Grid */}
        <Grid item xs={12} lg={8}>
          <CustomersDataGrid onUserSelect={handleUserSelect} />
        </Grid>

        {/* Demographics Charts */}
        <Grid item xs={12} lg={4}>
          <CustomerDemographicsChart />
        </Grid>
      </Grid>

      {/* Selected user info - can be expanded into a detail panel */}
      {selectedUser && (
        <Box
          sx={{
            mt: 2,
            p: 2,
            border: 1,
            borderColor: "divider",
            borderRadius: 1,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Selected Customer
          </Typography>
          <Typography variant="body2">
            {selectedUser.name.first} {selectedUser.name.last} -{" "}
            {selectedUser.email}
          </Typography>
        </Box>
      )}

      <Copyright sx={{ mt: 3, mb: 4 }} />
    </Box>
  );
}
