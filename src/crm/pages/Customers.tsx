import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import {
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridToolbar,
} from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useCustomers } from "../hooks/useCustomers";
import CustomerDetailsDialog from "../components/CustomerDetailsDialog";
import CreateCustomerDialog from "../components/CreateCustomerDialog";
import type { Customer } from "../types/customer";

export default function Customers() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [sortBy, setSortBy] = React.useState("name.first");
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(20);
  const [selectedCustomer, setSelectedCustomer] =
    React.useState<Customer | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = React.useState(false);
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [customerToDelete, setCustomerToDelete] =
    React.useState<Customer | null>(null);
  const [snackbar, setSnackbar] = React.useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  const {
    customers,
    loading,
    error,
    total,
    refetch,
    createCustomer,
    updateCustomer,
    deleteCustomer,
  } = useCustomers({
    page,
    perPage: pageSize,
    search: searchTerm,
    sortBy,
  });

  const handleSearch = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
      setPage(1); // Reset to first page when searching
    },
    [],
  );

  const handleSortChange = (event: any) => {
    setSortBy(event.target.value);
    setPage(1);
  };

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setDetailsDialogOpen(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setDetailsDialogOpen(true);
  };

  const handleDeleteClick = (customer: Customer) => {
    setCustomerToDelete(customer);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!customerToDelete) return;

    try {
      await deleteCustomer(customerToDelete.login.uuid);
      setSnackbar({
        open: true,
        message: "Customer deleted successfully",
        severity: "success",
      });
      setDeleteDialogOpen(false);
      setCustomerToDelete(null);
    } catch (err) {
      setSnackbar({
        open: true,
        message:
          err instanceof Error ? err.message : "Failed to delete customer",
        severity: "error",
      });
    }
  };

  const handleCreateCustomer = async (data: any) => {
    try {
      await createCustomer(data);
      setSnackbar({
        open: true,
        message: "Customer created successfully",
        severity: "success",
      });
    } catch (err) {
      throw err; // Let the dialog handle the error
    }
  };

  const handleUpdateCustomer = async (id: string, data: any) => {
    try {
      await updateCustomer(id, data);
      setSnackbar({
        open: true,
        message: "Customer updated successfully",
        severity: "success",
      });
    } catch (err) {
      throw err; // Let the dialog handle the error
    }
  };

  const columns: GridColDef[] = [
    {
      field: "avatar",
      headerName: "",
      width: 60,
      sortable: false,
      align: "center",
      headerAlign: "center",
      cellClassName: "avatar-cell",
      renderCell: (params) => (
        <Avatar
          src={params.row.picture?.thumbnail}
          alt={`${params.row.name.first} ${params.row.name.last}`}
          sx={{ width: 32, height: 32, margin: "auto" }}
        >
          {params.row.name.first[0]}
          {params.row.name.last[0]}
        </Avatar>
      ),
    },
    {
      field: "fullName",
      headerName: "Name",
      width: 200,
      valueGetter: (value, row) =>
        `${row.name.title} ${row.name.first} ${row.name.last}`,
    },
    {
      field: "email",
      headerName: "Email",
      width: 250,
    },
    {
      field: "phone",
      headerName: "Phone",
      width: 150,
    },
    {
      field: "location",
      headerName: "Location",
      width: 200,
      valueGetter: (value, row) =>
        `${row.location.city}, ${row.location.country}`,
    },
    {
      field: "gender",
      headerName: "Gender",
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          color={
            params.value === "male"
              ? "primary"
              : params.value === "female"
                ? "secondary"
                : "default"
          }
        />
      ),
    },
    {
      field: "age",
      headerName: "Age",
      width: 80,
      valueGetter: (value, row) => row.dob.age,
    },
    {
      field: "registered",
      headerName: "Registered",
      width: 120,
      valueGetter: (value, row) =>
        new Date(row.registered.date).toLocaleDateString(),
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 120,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<VisibilityIcon />}
          label="View"
          onClick={() => handleViewCustomer(params.row)}
        />,
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          onClick={() => handleEditCustomer(params.row)}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => handleDeleteClick(params.row)}
        />,
      ],
    },
  ];

  const rows = customers.map((customer) => ({
    id: customer.login.uuid,
    ...customer,
  }));

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1">
          Customers
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
        >
          Add Customer
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 3 }}>
        <TextField
          placeholder="Search customers..."
          value={searchTerm}
          onChange={handleSearch}
          sx={{ flexGrow: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Sort by</InputLabel>
          <Select value={sortBy} onChange={handleSortChange} label="Sort by">
            <MenuItem value="name.first">First Name</MenuItem>
            <MenuItem value="name.last">Last Name</MenuItem>
            <MenuItem value="location.city">City</MenuItem>
            <MenuItem value="location.country">Country</MenuItem>
            <MenuItem value="dob.age">Age</MenuItem>
            <MenuItem value="registered.date">Registration Date</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      <Box sx={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          paginationMode="server"
          rowCount={total}
          page={page - 1}
          pageSize={pageSize}
          onPageChange={(newPage) => setPage(newPage + 1)}
          onPageSizeChange={(newPageSize) => {
            setPageSize(newPageSize);
            setPage(1);
          }}
          pageSizeOptions={[10, 20, 50, 100]}
          disableRowSelectionOnClick
          rowHeight={64}
          slots={{
            toolbar: GridToolbar,
          }}
          slotProps={{
            toolbar: {
              showQuickFilter: false,
            },
          }}
          sx={{
            "& .MuiDataGrid-cell": {
              display: "flex",
              alignItems: "center",
            },
            '& .MuiDataGrid-cell[data-field="avatar"]': {
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "8px",
            },
            "& .MuiDataGrid-row": {
              "&:hover": {
                backgroundColor: "action.hover",
              },
            },
          }}
        />
      </Box>

      {/* Customer Details Dialog */}
      <CustomerDetailsDialog
        open={detailsDialogOpen}
        customer={selectedCustomer}
        onClose={() => {
          setDetailsDialogOpen(false);
          setSelectedCustomer(null);
        }}
        onSave={handleUpdateCustomer}
      />

      {/* Create Customer Dialog */}
      <CreateCustomerDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onCreate={handleCreateCustomer}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Customer</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {customerToDelete?.name.first}{" "}
            {customerToDelete?.name.last}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success/Error Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
