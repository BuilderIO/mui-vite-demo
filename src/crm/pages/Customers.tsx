import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/Refresh";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import {
  DataGrid,
  GridColDef,
  GridRowsProp,
  GridToolbar,
} from "@mui/x-data-grid";
import { User, UsersApiService } from "../services/usersApi";
import UserEditModal from "../components/UserEditModal";

export default function Customers() {
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [totalUsers, setTotalUsers] = React.useState(0);
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(25);
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
  const [snackbar, setSnackbar] = React.useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  const fetchUsers = React.useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await UsersApiService.getUsers({
        page: page + 1, // API uses 1-based pagination
        perPage: pageSize,
        search: searchQuery || undefined,
      });

      setUsers(response.data);
      setTotalUsers(response.total);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch users";
      setError(errorMessage);
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, searchQuery]);

  React.useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearch = React.useMemo(() => {
    const timeoutId = React.useRef<NodeJS.Timeout>();

    return (value: string) => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }

      timeoutId.current = setTimeout(() => {
        setSearchQuery(value);
        setPage(0); // Reset to first page when searching
      }, 500);
    };
  }, []);

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditModalOpen(true);
  };

  const handleDeleteUser = async (user: User) => {
    if (
      !window.confirm(
        `Are you sure you want to delete ${user.name.first} ${user.name.last}?`,
      )
    ) {
      return;
    }

    try {
      await UsersApiService.deleteUser(user.login.uuid);
      setSnackbar({
        open: true,
        message: "User deleted successfully",
        severity: "success",
      });
      fetchUsers(); // Refresh the list
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete user";
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    }
  };

  const handleUserUpdated = () => {
    setSnackbar({
      open: true,
      message: "User updated successfully",
      severity: "success",
    });
    fetchUsers(); // Refresh the list
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const formatFullName = (user: User): string => {
    return `${user.name.title} ${user.name.first} ${user.name.last}`;
  };

  const formatAddress = (user: User): string => {
    const { location } = user;
    return `${location.street.number} ${location.street.name}, ${location.city}, ${location.state} ${location.postcode}`;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString();
  };

  const columns: GridColDef[] = [
    {
      field: "avatar",
      headerName: "",
      width: 60,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Avatar
          src={params.row.picture.thumbnail}
          alt={formatFullName(params.row)}
          sx={{ width: 32, height: 32 }}
        >
          {params.row.name.first[0]}
          {params.row.name.last[0]}
        </Avatar>
      ),
    },
    {
      field: "fullName",
      headerName: "Name",
      flex: 1,
      minWidth: 200,
      valueGetter: (value, row) => formatFullName(row),
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "phone",
      headerName: "Phone",
      flex: 0.8,
      minWidth: 150,
    },
    {
      field: "location",
      headerName: "Location",
      flex: 1.5,
      minWidth: 250,
      valueGetter: (value, row) =>
        `${row.location.city}, ${row.location.country}`,
    },
    {
      field: "address",
      headerName: "Address",
      flex: 2,
      minWidth: 300,
      valueGetter: (value, row) => formatAddress(row),
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
      valueGetter: (value, row) => formatDate(row.registered.date),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 0.5 }}>
          <IconButton
            size="small"
            onClick={() => handleEditUser(params.row)}
            color="primary"
            title="Edit user"
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleDeleteUser(params.row)}
            color="error"
            title="Delete user"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  const rows: GridRowsProp = users.map((user) => ({
    id: user.login.uuid,
    ...user,
  }));

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1">
          Customers
        </Typography>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={() => fetchUsers()}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      <Card variant="outlined" sx={{ mb: 2 }}>
        <CardContent>
          <TextField
            fullWidth
            placeholder="Search customers by name, email, or city..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            onChange={(e) => handleSearch(e.target.value)}
            sx={{ mb: 2 }}
          />

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ height: 600, width: "100%" }}>
            <DataGrid
              rows={rows}
              columns={columns}
              loading={loading}
              paginationMode="server"
              rowCount={totalUsers}
              page={page}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
              pageSizeOptions={[10, 25, 50, 100]}
              checkboxSelection
              disableRowSelectionOnClick
              density="comfortable"
              slots={{ toolbar: GridToolbar }}
              slotProps={{
                toolbar: {
                  showQuickFilter: false,
                  printOptions: { disableToolbarButton: true },
                  csvOptions: { disableToolbarButton: true },
                },
                filterPanel: {
                  filterFormProps: {
                    logicOperatorInputProps: {
                      variant: "outlined",
                      size: "small",
                    },
                    columnInputProps: {
                      variant: "outlined",
                      size: "small",
                      sx: { mt: "auto" },
                    },
                    operatorInputProps: {
                      variant: "outlined",
                      size: "small",
                      sx: { mt: "auto" },
                    },
                    valueInputProps: {
                      InputComponentProps: {
                        variant: "outlined",
                        size: "small",
                      },
                    },
                  },
                },
              }}
              sx={{
                "& .MuiDataGrid-row:hover": {
                  backgroundColor: "action.hover",
                },
              }}
            />
          </Box>
        </CardContent>
      </Card>

      <UserEditModal
        open={editModalOpen}
        user={selectedUser}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedUser(null);
        }}
        onUserUpdated={handleUserUpdated}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
