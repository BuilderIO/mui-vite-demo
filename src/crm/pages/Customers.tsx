import * as React from "react";
import { useState, useCallback } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import CustomersDataGrid from "../components/CustomersDataGrid";
import CustomerDialog from "../components/CustomerDialog";
import CustomerDetailsCard from "../components/CustomerDetailsCard";
import { customersApi } from "../utils/customersApi";
import type { Customer } from "../types/customer";

export default function Customers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [customerDialogOpen, setCustomerDialogOpen] = useState(false);
  const [customerDetailsOpen, setCustomerDetailsOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnackbar = (
    message: string,
    severity: "success" | "error" | "info" = "success",
  ) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
    showSnackbar("Customer data refreshed", "info");
  };

  const handleAddCustomer = () => {
    setSelectedCustomer(null);
    setCustomerDialogOpen(true);
  };

  const handleEditCustomer = useCallback((customer: Customer) => {
    setSelectedCustomer(customer);
    setCustomerDialogOpen(true);
  }, []);

  const handleViewCustomer = useCallback((customer: Customer) => {
    setSelectedCustomer(customer);
    setCustomerDetailsOpen(true);
  }, []);

  const handleDeleteCustomer = useCallback((customer: Customer) => {
    setSelectedCustomer(customer);
    setDeleteDialogOpen(true);
  }, []);

  const handleCustomerDialogClose = () => {
    setCustomerDialogOpen(false);
    setSelectedCustomer(null);
  };

  const handleCustomerDetailsClo = () => {
    setCustomerDetailsOpen(false);
    setSelectedCustomer(null);
  };

  const handleCustomerSave = () => {
    setRefreshTrigger((prev) => prev + 1);
    showSnackbar(
      selectedCustomer
        ? "Customer updated successfully"
        : "Customer created successfully",
    );
  };

  const handleConfirmDelete = async () => {
    if (!selectedCustomer) return;

    try {
      await customersApi.deleteCustomer(selectedCustomer.login.uuid);
      setDeleteDialogOpen(false);
      setSelectedCustomer(null);
      setRefreshTrigger((prev) => prev + 1);
      showSnackbar("Customer deleted successfully");
    } catch (error) {
      showSnackbar(
        error instanceof Error ? error.message : "Failed to delete customer",
        "error",
      );
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setSelectedCustomer(null);
  };

  const handleEditFromDetails = (customer: Customer) => {
    setCustomerDetailsOpen(false);
    setSelectedCustomer(customer);
    setCustomerDialogOpen(true);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Customer Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your customer database with comprehensive tools for viewing,
          editing, and organizing customer information.
        </Typography>
      </Box>

      {/* Toolbar */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems="center"
        >
          <TextField
            placeholder="Search customers by name, email, or city..."
            value={searchQuery}
            onChange={handleSearchChange}
            size="small"
            sx={{ flexGrow: 1, minWidth: 300 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
            >
              Refresh
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddCustomer}
            >
              Add Customer
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* Data Grid */}
      <Paper sx={{ height: 600, width: "100%" }}>
        <CustomersDataGrid
          onEditCustomer={handleEditCustomer}
          onViewCustomer={handleViewCustomer}
          onDeleteCustomer={handleDeleteCustomer}
          searchQuery={searchQuery}
          refreshTrigger={refreshTrigger}
        />
      </Paper>

      {/* Customer Dialog (Create/Edit) */}
      <CustomerDialog
        open={customerDialogOpen}
        customer={selectedCustomer}
        onClose={handleCustomerDialogClose}
        onSave={handleCustomerSave}
      />

      {/* Customer Details Dialog */}
      <CustomerDetailsCard
        open={customerDetailsOpen}
        customer={selectedCustomer}
        onClose={handleCustomerDetailsClo}
        onEdit={handleEditFromDetails}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Confirm Customer Deletion
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete the customer{" "}
            <strong>
              {selectedCustomer?.name.first} {selectedCustomer?.name.last}
            </strong>
            ? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
