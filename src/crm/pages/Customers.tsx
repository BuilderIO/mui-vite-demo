import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import {
  DataGrid,
  GridColDef,
  GridRowParams,
  GridToolbar,
} from "@mui/x-data-grid";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import PersonAddRoundedIcon from "@mui/icons-material/PersonAddRounded";

interface User {
  login: {
    uuid: string;
    username: string;
    password?: string;
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

interface ApiResponse {
  page: number;
  perPage: number;
  total: number;
  span: string;
  effectivePage: number;
  data: User[];
}

interface EditUserData {
  email: string;
  name: {
    first: string;
    last: string;
    title: string;
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
  };
  phone: string;
  cell: string;
}

const API_BASE_URL = "https://user-api.builder-io.workers.dev/api";

// Fallback data for when API is not available
const FALLBACK_USERS: User[] = [
  {
    login: {
      uuid: "fallback-1",
      username: "johndoe",
    },
    name: {
      title: "Mr",
      first: "John",
      last: "Doe",
    },
    gender: "male",
    location: {
      street: {
        number: 123,
        name: "Main St",
      },
      city: "New York",
      state: "NY",
      country: "USA",
      postcode: "10001",
    },
    email: "john.doe@example.com",
    dob: {
      date: "1990-01-01",
      age: 34,
    },
    registered: {
      date: "2020-01-01",
      age: 4,
    },
    phone: "555-0123",
    cell: "555-0124",
    picture: {
      large: "",
      medium: "",
      thumbnail: "",
    },
    nat: "US",
  },
  {
    login: {
      uuid: "fallback-2",
      username: "janesmith",
    },
    name: {
      title: "Ms",
      first: "Jane",
      last: "Smith",
    },
    gender: "female",
    location: {
      street: {
        number: 456,
        name: "Oak Ave",
      },
      city: "Los Angeles",
      state: "CA",
      country: "USA",
      postcode: "90210",
    },
    email: "jane.smith@example.com",
    dob: {
      date: "1985-05-15",
      age: 39,
    },
    registered: {
      date: "2019-03-10",
      age: 5,
    },
    phone: "555-0234",
    cell: "555-0235",
    picture: {
      large: "",
      medium: "",
      thumbnail: "",
    },
    nat: "US",
  },
];

export default function Customers() {
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(20);
  const [totalUsers, setTotalUsers] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);

  // Modal state
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
  const [editFormData, setEditFormData] = React.useState<EditUserData | null>(
    null,
  );
  const [editLoading, setEditLoading] = React.useState(false);

  // Snackbar state
  const [snackbar, setSnackbar] = React.useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchUsers = React.useCallback(
    async (searchQuery = "", pageNum = 1, pageSize = 20) => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({
          page: pageNum.toString(),
          perPage: pageSize.toString(),
          sortBy: "name.first",
        });

        if (searchQuery.trim()) {
          params.append("search", searchQuery.trim());
        }

        const response = await fetch(`${API_BASE_URL}/users?${params}`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          mode: "cors",
        });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch users: ${response.status} ${response.statusText}`,
          );
        }

        const data: ApiResponse = await response.json();

        // Ensure data is valid
        if (data && Array.isArray(data.data)) {
          setUsers(data.data);
          setTotalUsers(data.total || 0);
          setPage(data.page || 1);
          setPerPage(data.perPage || 20);
        } else {
          throw new Error("Invalid data format received from API");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch users";
        setError(errorMessage);
        console.error("Error fetching users:", err);

        // Set empty data on error to prevent undefined access
        setUsers([]);
        setTotalUsers(0);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const handleSearch = React.useCallback(
    React.useMemo(() => {
      const debounce = (func: Function, delay: number) => {
        let timeoutId: NodeJS.Timeout;
        return (...args: any[]) => {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => func.apply(null, args), delay);
        };
      };
      return debounce((term: string) => {
        fetchUsers(term, 1, perPage);
      }, 500);
    }, [fetchUsers, perPage]),
    [],
  );

  React.useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  React.useEffect(() => {
    handleSearch(searchTerm);
  }, [searchTerm, handleSearch]);

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditFormData({
      email: user.email,
      name: {
        first: user.name.first,
        last: user.name.last,
        title: user.name.title,
      },
      gender: user.gender,
      location: {
        street: {
          number: user.location.street.number,
          name: user.location.street.name,
        },
        city: user.location.city,
        state: user.location.state,
        country: user.location.country,
        postcode: user.location.postcode,
      },
      phone: user.phone,
      cell: user.cell,
    });
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedUser(null);
    setEditFormData(null);
    setEditLoading(false);
  };

  const handleSaveUser = async () => {
    if (!selectedUser || !editFormData) return;

    try {
      setEditLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/users/${selectedUser.login.uuid}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editFormData),
        },
      );

      if (!response.ok) {
        throw new Error(
          `Failed to update user: ${response.status} ${response.statusText}`,
        );
      }

      const result = await response.json();

      if (result.success) {
        setSnackbar({
          open: true,
          message: "User updated successfully!",
          severity: "success",
        });

        // Refresh the users list
        await fetchUsers(searchTerm, page, perPage);
        handleCloseEditModal();
      } else {
        throw new Error(result.message || "Failed to update user");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update user";
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
      console.error("Error updating user:", err);
    } finally {
      setEditLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getInitials = (user: User) => {
    return `${user.name.first.charAt(0)}${user.name.last.charAt(0)}`.toUpperCase();
  };

  const columns: GridColDef[] = [
    {
      field: "avatar",
      headerName: "",
      width: 60,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const user = params.row as User;
        if (!user) return null;
        return (
          <Avatar
            src={user.picture?.thumbnail}
            alt={`${user.name?.first || ""} ${user.name?.last || ""}`}
            sx={{ width: 32, height: 32 }}
          >
            {user.name ? getInitials(user) : "?"}
          </Avatar>
        );
      },
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      minWidth: 180,
      valueGetter: (params) => {
        const user = params.row as User;
        if (!user || !user.name) return "";
        return `${user.name.title || ""} ${user.name.first || ""} ${user.name.last || ""}`.trim();
      },
    },
    {
      field: "username",
      headerName: "Username",
      width: 140,
      valueGetter: (params) => {
        const user = params.row as User;
        if (!user || !user.login) return "";
        return `@${user.login.username || ""}`;
      },
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "city",
      headerName: "City",
      width: 130,
      valueGetter: (params) => {
        const user = params.row as User;
        if (!user || !user.location) return "";
        return user.location.city || "";
      },
    },
    {
      field: "country",
      headerName: "Country",
      width: 120,
      valueGetter: (params) => {
        const user = params.row as User;
        if (!user || !user.location) return "";
        return user.location.country || "";
      },
    },
    {
      field: "age",
      headerName: "Age",
      width: 80,
      valueGetter: (params) => {
        const user = params.row as User;
        if (!user || !user.dob) return "";
        return user.dob.age || "";
      },
    },
    {
      field: "gender",
      headerName: "Gender",
      width: 100,
      renderCell: (params) => {
        const user = params.row as User;
        if (!user || !user.gender) return "";
        return (
          <Chip
            label={user.gender}
            size="small"
            color={user.gender === "male" ? "primary" : "secondary"}
            variant="outlined"
          />
        );
      },
    },
    {
      field: "phone",
      headerName: "Phone",
      width: 140,
    },
    {
      field: "registered",
      headerName: "Registered",
      width: 120,
      valueGetter: (params) => {
        const user = params.row as User;
        if (!user || !user.registered || !user.registered.date) return "";
        return formatDate(user.registered.date);
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const user = params.row as User;
        if (!user) return null;
        return (
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleEditUser(user);
            }}
            color="primary"
            aria-label="Edit user"
          >
            <EditRoundedIcon fontSize="small" />
          </IconButton>
        );
      },
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
        <Typography variant="h4" component="h1">
          Customer Management
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            startIcon={<RefreshRoundedIcon />}
            onClick={() => fetchUsers(searchTerm, page, perPage)}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<PersonAddRoundedIcon />}
            onClick={() => {
              setSnackbar({
                open: true,
                message: "Add user functionality coming soon!",
                severity: "info",
              });
            }}
          >
            Add Customer
          </Button>
        </Stack>
      </Stack>

      {/* Search and Filters */}
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <TextField
            fullWidth
            placeholder="Search customers by name, email, city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />

          <Typography variant="body2" color="text.secondary">
            {loading
              ? "Loading..."
              : `Showing ${users.length} of ${totalUsers} customers`}
          </Typography>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Data Grid */}
      <Card variant="outlined">
        <Box sx={{ height: 600, width: "100%" }}>
          <DataGrid
            rows={users}
            columns={columns}
            loading={loading}
            getRowId={(row) => row.login.uuid}
            pagination
            paginationMode="server"
            rowCount={totalUsers}
            page={page - 1} // DataGrid uses 0-based pagination
            pageSize={perPage}
            onPageChange={(newPage) => {
              const pageNum = newPage + 1; // Convert to 1-based
              setPage(pageNum);
              fetchUsers(searchTerm, pageNum, perPage);
            }}
            onPageSizeChange={(newPageSize) => {
              setPerPage(newPageSize);
              fetchUsers(searchTerm, 1, newPageSize);
            }}
            pageSizeOptions={[10, 20, 50, 100]}
            checkboxSelection
            disableColumnResize
            density="comfortable"
            slots={{
              toolbar: GridToolbar,
            }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
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
            onRowClick={(params: GridRowParams) => {
              handleEditUser(params.row as User);
            }}
            sx={{
              "& .MuiDataGrid-row:hover": {
                cursor: "pointer",
              },
            }}
          />
        </Box>
      </Card>

      {/* Edit User Modal */}
      <Dialog
        open={editModalOpen}
        onClose={handleCloseEditModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" spacing={2}>
            {selectedUser && (
              <Avatar
                src={selectedUser.picture.thumbnail}
                alt={`${selectedUser.name.first} ${selectedUser.name.last}`}
              >
                {getInitials(selectedUser)}
              </Avatar>
            )}
            <Typography variant="h6">Edit Customer Information</Typography>
          </Stack>
        </DialogTitle>

        <DialogContent>
          {editFormData && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {/* Personal Information */}
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  fontWeight="medium"
                  gutterBottom
                >
                  Personal Information
                </Typography>
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Title"
                  value={editFormData.name.title}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      name: { ...editFormData.name, title: e.target.value },
                    })
                  }
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={editFormData.name.first}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      name: { ...editFormData.name, first: e.target.value },
                    })
                  }
                  required
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Last Name"
                  value={editFormData.name.last}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      name: { ...editFormData.name, last: e.target.value },
                    })
                  }
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={editFormData.email}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, email: e.target.value })
                  }
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Gender"
                  value={editFormData.gender}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, gender: e.target.value })
                  }
                />
              </Grid>

              {/* Contact Information */}
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  fontWeight="medium"
                  gutterBottom
                  sx={{ mt: 2 }}
                >
                  Contact Information
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={editFormData.phone}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, phone: e.target.value })
                  }
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Cell"
                  value={editFormData.cell}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, cell: e.target.value })
                  }
                />
              </Grid>

              {/* Address Information */}
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  fontWeight="medium"
                  gutterBottom
                  sx={{ mt: 2 }}
                >
                  Address Information
                </Typography>
              </Grid>

              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="Street Number"
                  type="number"
                  value={editFormData.location.street.number}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      location: {
                        ...editFormData.location,
                        street: {
                          ...editFormData.location.street,
                          number: parseInt(e.target.value) || 0,
                        },
                      },
                    })
                  }
                />
              </Grid>

              <Grid item xs={12} sm={9}>
                <TextField
                  fullWidth
                  label="Street Name"
                  value={editFormData.location.street.name}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      location: {
                        ...editFormData.location,
                        street: {
                          ...editFormData.location.street,
                          name: e.target.value,
                        },
                      },
                    })
                  }
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="City"
                  value={editFormData.location.city}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      location: {
                        ...editFormData.location,
                        city: e.target.value,
                      },
                    })
                  }
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="State"
                  value={editFormData.location.state}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      location: {
                        ...editFormData.location,
                        state: e.target.value,
                      },
                    })
                  }
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Country"
                  value={editFormData.location.country}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      location: {
                        ...editFormData.location,
                        country: e.target.value,
                      },
                    })
                  }
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Postal Code"
                  value={editFormData.location.postcode}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      location: {
                        ...editFormData.location,
                        postcode: e.target.value,
                      },
                    })
                  }
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseEditModal} disabled={editLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveUser}
            variant="contained"
            disabled={editLoading}
            startIcon={editLoading ? <CircularProgress size={16} /> : null}
          >
            {editLoading ? "Saving..." : "Save Changes"}
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
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
