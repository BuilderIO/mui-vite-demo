import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import CircularProgress from "@mui/material/CircularProgress";
import TablePagination from "@mui/material/TablePagination";
import { DataGrid, GridColDef, GridActionsCellItem } from "@mui/x-data-grid";

// Types for the user data
interface UserLocation {
  street: {
    number: number;
    name: string;
  };
  city: string;
  state: string;
  country: string;
  postcode: string;
}

interface UserName {
  title: string;
  first: string;
  last: string;
}

interface UserLogin {
  uuid: string;
  username: string;
  password: string;
}

interface User {
  login: UserLogin;
  name: UserName;
  gender: string;
  location: UserLocation;
  email: string;
  dob: {
    date: string;
    age: number;
  };
  registered: {
    date: string;
    age: number;
  };
  phone: string;
  cell: string;
  picture: {
    large: string;
    medium: string;
    thumbnail: string;
  };
  nat: string;
}

interface UsersResponse {
  page: number;
  perPage: number;
  total: number;
  span: string;
  effectivePage: number;
  data: User[];
}

const API_BASE_URL = "https://user-api.builder-io.workers.dev/api";

export default function Customers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
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
    country: "",
    postcode: "",
    phone: "",
    cell: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  // Fetch users from API
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: (page + 1).toString(),
        perPage: rowsPerPage.toString(),
        ...(searchTerm && { search: searchTerm }),
      });

      const response = await fetch(`${API_BASE_URL}/users?${queryParams}`);
      const data: UsersResponse = await response.json();

      setUsers(data.data);
      setTotal(data.total);
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
  }, [page, rowsPerPage, searchTerm]);

  // Initial load and search effect
  useEffect(() => {
    const delayDebounce = setTimeout(
      () => {
        fetchUsers();
      },
      searchTerm ? 500 : 0,
    );

    return () => clearTimeout(delayDebounce);
  }, [fetchUsers, searchTerm]);

  // Handle pagination
  const handlePageChange = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle form input changes
  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Reset form data
  const resetFormData = () => {
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
      country: "",
      postcode: "",
      phone: "",
      cell: "",
    });
  };

  // Open edit modal
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setFormData({
      email: user.email,
      username: user.login.username,
      password: "",
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
      phone: user.phone,
      cell: user.cell,
    });
    setEditModalOpen(true);
  };

  // Handle user update
  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    try {
      const updateData = {
        email: formData.email,
        login: {
          username: formData.username,
          ...(formData.password && { password: formData.password }),
        },
        name: {
          title: formData.title,
          first: formData.firstName,
          last: formData.lastName,
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
        phone: formData.phone,
        cell: formData.cell,
      };

      const response = await fetch(
        `${API_BASE_URL}/users/${selectedUser.login.uuid}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        },
      );

      if (response.ok) {
        setSnackbar({
          open: true,
          message: "User updated successfully",
          severity: "success",
        });
        setEditModalOpen(false);
        fetchUsers();
      } else {
        throw new Error("Failed to update user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      setSnackbar({
        open: true,
        message: "Failed to update user",
        severity: "error",
      });
    }
  };

  // Handle user creation
  const handleCreateUser = async () => {
    try {
      const createData = {
        email: formData.email,
        login: {
          username: formData.username,
          password: formData.password,
        },
        name: {
          title: formData.title,
          first: formData.firstName,
          last: formData.lastName,
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
        phone: formData.phone,
        cell: formData.cell,
      };

      const response = await fetch(`${API_BASE_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(createData),
      });

      if (response.ok) {
        setSnackbar({
          open: true,
          message: "User created successfully",
          severity: "success",
        });
        setAddModalOpen(false);
        resetFormData();
        fetchUsers();
      } else {
        throw new Error("Failed to create user");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      setSnackbar({
        open: true,
        message: "Failed to create user",
        severity: "error",
      });
    }
  };

  // Handle user deletion
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

      if (response.ok) {
        setSnackbar({
          open: true,
          message: "User deleted successfully",
          severity: "success",
        });
        fetchUsers();
      } else {
        throw new Error("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      setSnackbar({
        open: true,
        message: "Failed to delete user",
        severity: "error",
      });
    }
  };

  // Transform users data to include computed fields for DataGrid
  const transformedUsers = users.map((user) => ({
    ...user,
    fullName: user.name
      ? `${user.name.first || ""} ${user.name.last || ""}`
      : "",
    username: user.login?.username || "",
    locationDisplay: user.location
      ? `${user.location.city || ""}, ${user.location.country || ""}`
      : "",
    age: user.dob?.age || 0,
  }));

  // Data Grid columns configuration
  const columns: GridColDef[] = [
    {
      field: "avatar",
      headerName: "",
      width: 60,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const user = params.row;
        if (!user) return null;
        return (
          <Avatar
            src={user.picture?.thumbnail}
            alt={`${user.name?.first || ""} ${user.name?.last || ""}`}
            sx={{ width: 32, height: 32 }}
          >
            {user.name?.first?.[0] || ""}
            {user.name?.last?.[0] || ""}
          </Avatar>
        );
      },
    },
    {
      field: "fullName",
      headerName: "Name",
      width: 200,
    },
    {
      field: "email",
      headerName: "Email",
      width: 250,
    },
    {
      field: "username",
      headerName: "Username",
      width: 150,
    },
    {
      field: "locationDisplay",
      headerName: "Location",
      width: 200,
    },
    {
      field: "age",
      headerName: "Age",
      width: 80,
    },
    {
      field: "gender",
      headerName: "Gender",
      width: 100,
      renderCell: (params) => {
        if (!params.value) return null;
        return (
          <Chip
            label={params.value}
            size="small"
            color={params.value === "male" ? "primary" : "secondary"}
            variant="outlined"
          />
        );
      },
    },
    {
      field: "phone",
      headerName: "Phone",
      width: 150,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 120,
      getActions: (params) => {
        const user = params.row;
        if (!user) return [];
        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            onClick={() => handleEditUser(user)}
            color="primary"
            key="edit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={() => handleDeleteUser(user)}
            color="error"
            key="delete"
          />,
        ];
      },
    },
  ];

  // Form field component
  const FormField = ({
    label,
    value,
    onChange,
    required = false,
    type = "text",
    select = false,
    options = [],
  }: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    required?: boolean;
    type?: string;
    select?: boolean;
    options?: { value: string; label: string }[];
  }) => (
    <FormControl fullWidth required={required}>
      <FormLabel sx={{ mb: 1, fontWeight: 500 }}>{label}</FormLabel>
      {select ? (
        <Select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          size="small"
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      ) : (
        <TextField
          value={value}
          onChange={(e) => onChange(e.target.value)}
          type={type}
          size="small"
          fullWidth
        />
      )}
    </FormControl>
  );

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Typography variant="h4" component="h1">
          Customer Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            resetFormData();
            setAddModalOpen(true);
          }}
        >
          Add Customer
        </Button>
      </Stack>

      <Card>
        <CardContent>
          <Stack spacing={2}>
            <TextField
              placeholder="Search customers by name, email, or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon />
                  </InputAdornment>
                ),
              }}
              fullWidth
            />

            <Box sx={{ height: 600, width: "100%" }}>
              <DataGrid
                rows={transformedUsers}
                columns={columns}
                getRowId={(row) => row?.login?.uuid || Math.random().toString()}
                loading={loading}
                checkboxSelection
                disableRowSelectionOnClick
                density="compact"
                hideFooter
                sx={{
                  "& .MuiDataGrid-row:hover": {
                    backgroundColor: "action.hover",
                  },
                }}
              />
            </Box>

            <TablePagination
              component="div"
              count={total}
              page={page}
              onPageChange={handlePageChange}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleRowsPerPageChange}
              rowsPerPageOptions={[5, 10, 25, 50]}
            />
          </Stack>
        </CardContent>
      </Card>

      {/* Edit User Modal */}
      <Dialog
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Customer</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormField
                  label="Email"
                  value={formData.email}
                  onChange={(value) => handleFormChange("email", value)}
                  type="email"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormField
                  label="Username"
                  value={formData.username}
                  onChange={(value) => handleFormChange("username", value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormField
                  label="Title"
                  value={formData.title}
                  onChange={(value) => handleFormChange("title", value)}
                  select
                  options={[
                    { value: "Mr", label: "Mr" },
                    { value: "Mrs", label: "Mrs" },
                    { value: "Ms", label: "Ms" },
                    { value: "Dr", label: "Dr" },
                  ]}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormField
                  label="First Name"
                  value={formData.firstName}
                  onChange={(value) => handleFormChange("firstName", value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormField
                  label="Last Name"
                  value={formData.lastName}
                  onChange={(value) => handleFormChange("lastName", value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormField
                  label="Gender"
                  value={formData.gender}
                  onChange={(value) => handleFormChange("gender", value)}
                  select
                  options={[
                    { value: "male", label: "Male" },
                    { value: "female", label: "Female" },
                  ]}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormField
                  label="Password (leave empty to keep current)"
                  value={formData.password}
                  onChange={(value) => handleFormChange("password", value)}
                  type="password"
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <FormField
                  label="Street Number"
                  value={formData.streetNumber}
                  onChange={(value) => handleFormChange("streetNumber", value)}
                />
              </Grid>
              <Grid item xs={12} sm={9}>
                <FormField
                  label="Street Name"
                  value={formData.streetName}
                  onChange={(value) => handleFormChange("streetName", value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormField
                  label="City"
                  value={formData.city}
                  onChange={(value) => handleFormChange("city", value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormField
                  label="State"
                  value={formData.state}
                  onChange={(value) => handleFormChange("state", value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormField
                  label="Country"
                  value={formData.country}
                  onChange={(value) => handleFormChange("country", value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormField
                  label="Postcode"
                  value={formData.postcode}
                  onChange={(value) => handleFormChange("postcode", value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormField
                  label="Phone"
                  value={formData.phone}
                  onChange={(value) => handleFormChange("phone", value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormField
                  label="Cell"
                  value={formData.cell}
                  onChange={(value) => handleFormChange("cell", value)}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditModalOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdateUser}>
            Update Customer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add User Modal */}
      <Dialog
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Add New Customer</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormField
                  label="Email"
                  value={formData.email}
                  onChange={(value) => handleFormChange("email", value)}
                  type="email"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormField
                  label="Username"
                  value={formData.username}
                  onChange={(value) => handleFormChange("username", value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormField
                  label="Title"
                  value={formData.title}
                  onChange={(value) => handleFormChange("title", value)}
                  select
                  options={[
                    { value: "Mr", label: "Mr" },
                    { value: "Mrs", label: "Mrs" },
                    { value: "Ms", label: "Ms" },
                    { value: "Dr", label: "Dr" },
                  ]}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormField
                  label="First Name"
                  value={formData.firstName}
                  onChange={(value) => handleFormChange("firstName", value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormField
                  label="Last Name"
                  value={formData.lastName}
                  onChange={(value) => handleFormChange("lastName", value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormField
                  label="Gender"
                  value={formData.gender}
                  onChange={(value) => handleFormChange("gender", value)}
                  select
                  options={[
                    { value: "male", label: "Male" },
                    { value: "female", label: "Female" },
                  ]}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormField
                  label="Password"
                  value={formData.password}
                  onChange={(value) => handleFormChange("password", value)}
                  type="password"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <FormField
                  label="Street Number"
                  value={formData.streetNumber}
                  onChange={(value) => handleFormChange("streetNumber", value)}
                />
              </Grid>
              <Grid item xs={12} sm={9}>
                <FormField
                  label="Street Name"
                  value={formData.streetName}
                  onChange={(value) => handleFormChange("streetName", value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormField
                  label="City"
                  value={formData.city}
                  onChange={(value) => handleFormChange("city", value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormField
                  label="State"
                  value={formData.state}
                  onChange={(value) => handleFormChange("state", value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormField
                  label="Country"
                  value={formData.country}
                  onChange={(value) => handleFormChange("country", value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormField
                  label="Postcode"
                  value={formData.postcode}
                  onChange={(value) => handleFormChange("postcode", value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormField
                  label="Phone"
                  value={formData.phone}
                  onChange={(value) => handleFormChange("phone", value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormField
                  label="Cell"
                  value={formData.cell}
                  onChange={(value) => handleFormChange("cell", value)}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddModalOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateUser}>
            Create Customer
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
