import * as React from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  Card,
  CardContent,
  Chip,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import { DataGrid, GridColDef, GridRowParams } from "@mui/x-data-grid";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Person as PersonIcon,
} from "@mui/icons-material";

// Types for User data based on the API
interface User {
  login: {
    uuid: string;
    username: string;
    password: string;
  };
  name: {
    title: string;
    first: string;
    last: string;
  };
  gender: string;
  location: {
    street: {
      number: number;
      name: string;
    };
    city: string;
    state: string;
    country: string;
    postcode: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
    timezone?: {
      offset: string;
      description: string;
    };
  };
  email: string;
  dob?: {
    date: string;
    age: number;
  };
  registered?: {
    date: string;
    age: number;
  };
  phone?: string;
  cell?: string;
  picture?: {
    large: string;
    medium: string;
    thumbnail: string;
  };
  nat?: string;
}

interface ApiResponse {
  page: number;
  perPage: number;
  total: number;
  span: string;
  effectivePage: number;
  data: User[];
}

interface UserFormData {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  title: string;
  gender: string;
  streetNumber: string;
  streetName: string;
  city: string;
  state: string;
  country: string;
  postcode: string;
  phone: string;
  cell: string;
}

const API_BASE_URL = "https://user-api.builder-io.workers.dev/api";

export default function Customers() {
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [totalUsers, setTotalUsers] = React.useState(0);
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 20,
  });
  const [searchQuery, setSearchQuery] = React.useState("");
  const [openDialog, setOpenDialog] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState<User | null>(null);
  const [snackbar, setSnackbar] = React.useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  }>({
    open: false,
    message: "",
    severity: "info",
  });

  const [formData, setFormData] = React.useState<UserFormData>({
    email: "",
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    title: "Mr",
    gender: "male",
    streetNumber: "",
    streetName: "",
    city: "",
    state: "",
    country: "USA",
    postcode: "",
    phone: "",
    cell: "",
  });

  // Fetch users from API
  const fetchUsers = React.useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: (paginationModel.page + 1).toString(),
        perPage: paginationModel.pageSize.toString(),
        ...(searchQuery && { search: searchQuery }),
      });

      const response = await fetch(`${API_BASE_URL}/users?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data: ApiResponse = await response.json();
      setUsers(data.data);
      setTotalUsers(data.total);
    } catch (error) {
      console.error("Error fetching users:", error);
      setSnackbar({
        open: true,
        message: "Failed to fetch users",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [paginationModel.page, paginationModel.pageSize, searchQuery]);

  React.useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Handle search with debounce
  const searchTimeoutRef = React.useRef<NodeJS.Timeout>();
  const handleSearch = (query: string) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setSearchQuery(query);
      setPaginationModel((prev) => ({ ...prev, page: 0 }));
    }, 500);
  };

  // Handle dialog operations
  const handleOpenDialog = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        email: user.email,
        username: user.login.username,
        password: "", // Don't pre-fill password for security
        firstName: user.name.first,
        lastName: user.name.last,
        title: user.name.title,
        gender: user.gender,
        streetNumber: user.location.street.number.toString(),
        streetName: user.location.street.name,
        city: user.location.city,
        state: user.location.state,
        country: user.location.country,
        postcode: user.location.postcode,
        phone: user.phone || "",
        cell: user.cell || "",
      });
    } else {
      setEditingUser(null);
      setFormData({
        email: "",
        username: "",
        password: "",
        firstName: "",
        lastName: "",
        title: "Mr",
        gender: "male",
        streetNumber: "",
        streetName: "",
        city: "",
        state: "",
        country: "USA",
        postcode: "",
        phone: "",
        cell: "",
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingUser(null);
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      const payload = {
        email: formData.email,
        login: {
          username: formData.username,
          ...(formData.password && { password: formData.password }),
        },
        name: {
          first: formData.firstName,
          last: formData.lastName,
          title: formData.title,
        },
        gender: formData.gender,
        location: {
          street: {
            number: parseInt(formData.streetNumber) || 0,
            name: formData.streetName,
          },
          city: formData.city,
          state: formData.state,
          country: formData.country,
          postcode: formData.postcode,
        },
        ...(formData.phone && { phone: formData.phone }),
        ...(formData.cell && { cell: formData.cell }),
      };

      const url = editingUser
        ? `${API_BASE_URL}/users/${editingUser.login.uuid}`
        : `${API_BASE_URL}/users`;

      const method = editingUser ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${editingUser ? "update" : "create"} user`);
      }

      setSnackbar({
        open: true,
        message: `User ${editingUser ? "updated" : "created"} successfully`,
        severity: "success",
      });

      handleCloseDialog();
      fetchUsers();
    } catch (error) {
      console.error("Error saving user:", error);
      setSnackbar({
        open: true,
        message: `Failed to ${editingUser ? "update" : "create"} user`,
        severity: "error",
      });
    }
  };

  // Handle delete user
  const handleDeleteUser = async (user: User) => {
    if (
      !window.confirm(
        `Are you sure you want to delete ${user.name.first} ${user.name.last}?`,
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users/${user.login.uuid}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      setSnackbar({
        open: true,
        message: "User deleted successfully",
        severity: "success",
      });

      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      setSnackbar({
        open: true,
        message: "Failed to delete user",
        severity: "error",
      });
    }
  };

  // DataGrid columns
  const columns: GridColDef[] = [
    {
      field: "avatar",
      headerName: "",
      width: 60,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const user = params.row as User;
        return (
          <Avatar src={user.picture?.thumbnail} sx={{ width: 32, height: 32 }}>
            {user.name.first.charAt(0)}
          </Avatar>
        );
      },
    },
    {
      field: "fullName",
      headerName: "Name",
      flex: 1.5,
      minWidth: 180,
      valueGetter: (value, row: User) =>
        `${row.name.title} ${row.name.first} ${row.name.last}`,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {params.value}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            @{params.row.login.username}
          </Typography>
        </Box>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1.5,
      minWidth: 200,
    },
    {
      field: "location",
      headerName: "Location",
      flex: 1.2,
      minWidth: 150,
      valueGetter: (value, row: User) =>
        `${row.location.city}, ${row.location.state}`,
    },
    {
      field: "gender",
      headerName: "Gender",
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          color={params.value === "male" ? "primary" : "secondary"}
          variant="outlined"
        />
      ),
    },
    {
      field: "age",
      headerName: "Age",
      width: 80,
      valueGetter: (value, row: User) => row.dob?.age || "N/A",
    },
    {
      field: "phone",
      headerName: "Phone",
      flex: 1,
      minWidth: 120,
      valueGetter: (value, row: User) => row.phone || row.cell || "N/A",
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box>
          <Tooltip title="Edit user">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleOpenDialog(params.row as User);
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete user">
            <IconButton
              size="small"
              color="error"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteUser(params.row as User);
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      {/* Header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h4" component="h1" sx={{ mb: 0.5 }}>
            Customers
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your customer database and user accounts
          </Typography>
        </Box>
        <Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchUsers}
            sx={{ mr: 1 }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add Customer
          </Button>
        </Box>
      </Stack>

      {/* Stats Cards */}
      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar sx={{ bgcolor: "primary.main" }}>
                <PersonIcon />
              </Avatar>
              <Box>
                <Typography variant="h6">{totalUsers}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Customers
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Stack>

      {/* Search Bar */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <TextField
            fullWidth
            placeholder="Search customers by name, email, or city..."
            variant="outlined"
            size="small"
            onChange={(e) => handleSearch(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Data Grid */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <DataGrid
            rows={users}
            columns={columns}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            rowCount={totalUsers}
            paginationMode="server"
            loading={loading}
            pageSizeOptions={[10, 20, 50]}
            disableRowSelectionOnClick
            getRowId={(row) => row.login.uuid}
            sx={{
              border: 0,
              "& .MuiDataGrid-cell": {
                borderColor: "divider",
              },
              "& .MuiDataGrid-columnHeaders": {
                bgcolor: "background.default",
                borderColor: "divider",
              },
            }}
          />
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingUser ? "Edit Customer" : "Add New Customer"}
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={3} sx={{ mt: 1 }}>
            {/* Personal Information */}
            <Typography variant="h6" color="primary">
              Personal Information
            </Typography>
            <Stack direction="row" spacing={2}>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Title</InputLabel>
                <Select
                  value={formData.title}
                  label="Title"
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                >
                  <MenuItem value="Mr">Mr</MenuItem>
                  <MenuItem value="Mrs">Mrs</MenuItem>
                  <MenuItem value="Ms">Ms</MenuItem>
                  <MenuItem value="Dr">Dr</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="First Name"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                required
                size="small"
                sx={{ flex: 1 }}
              />
              <TextField
                label="Last Name"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                required
                size="small"
                sx={{ flex: 1 }}
              />
            </Stack>

            <Stack direction="row" spacing={2}>
              <FormControl size="small" sx={{ flex: 1 }}>
                <InputLabel>Gender</InputLabel>
                <Select
                  value={formData.gender}
                  label="Gender"
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                </Select>
              </FormControl>
            </Stack>

            {/* Account Information */}
            <Typography variant="h6" color="primary">
              Account Information
            </Typography>
            <Stack direction="row" spacing={2}>
              <TextField
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                size="small"
                sx={{ flex: 1 }}
              />
              <TextField
                label="Username"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                required
                size="small"
                sx={{ flex: 1 }}
              />
            </Stack>

            {!editingUser && (
              <TextField
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required={!editingUser}
                size="small"
                helperText="Password is required for new users"
              />
            )}

            {/* Address Information */}
            <Typography variant="h6" color="primary">
              Address Information
            </Typography>
            <Stack direction="row" spacing={2}>
              <TextField
                label="Street Number"
                value={formData.streetNumber}
                onChange={(e) =>
                  setFormData({ ...formData, streetNumber: e.target.value })
                }
                size="small"
                sx={{ width: 150 }}
              />
              <TextField
                label="Street Name"
                value={formData.streetName}
                onChange={(e) =>
                  setFormData({ ...formData, streetName: e.target.value })
                }
                size="small"
                sx={{ flex: 1 }}
              />
            </Stack>

            <Stack direction="row" spacing={2}>
              <TextField
                label="City"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                size="small"
                sx={{ flex: 1 }}
              />
              <TextField
                label="State"
                value={formData.state}
                onChange={(e) =>
                  setFormData({ ...formData, state: e.target.value })
                }
                size="small"
                sx={{ flex: 1 }}
              />
            </Stack>

            <Stack direction="row" spacing={2}>
              <TextField
                label="Country"
                value={formData.country}
                onChange={(e) =>
                  setFormData({ ...formData, country: e.target.value })
                }
                size="small"
                sx={{ flex: 1 }}
              />
              <TextField
                label="Postal Code"
                value={formData.postcode}
                onChange={(e) =>
                  setFormData({ ...formData, postcode: e.target.value })
                }
                size="small"
                sx={{ flex: 1 }}
              />
            </Stack>

            {/* Contact Information */}
            <Typography variant="h6" color="primary">
              Contact Information
            </Typography>
            <Stack direction="row" spacing={2}>
              <TextField
                label="Phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                size="small"
                sx={{ flex: 1 }}
              />
              <TextField
                label="Cell"
                value={formData.cell}
                onChange={(e) =>
                  setFormData({ ...formData, cell: e.target.value })
                }
                size="small"
                sx={{ flex: 1 }}
              />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={
              !formData.email ||
              !formData.username ||
              !formData.firstName ||
              !formData.lastName ||
              (!editingUser && !formData.password)
            }
          >
            {editingUser ? "Update" : "Create"} Customer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
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
