import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import {
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridRowParams,
} from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import CustomerEditModal from "../components/CustomerEditModal";

// Types for the Users API
interface UserLocation {
  street: {
    number: number;
    name: string;
  };
  city: string;
  state: string;
  country: string;
  postcode: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  timezone: {
    offset: string;
    description: string;
  };
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

interface UserDob {
  date: string;
  age: number;
}

interface UserRegistered {
  date: string;
  age: number;
}

interface UserPicture {
  large: string;
  medium: string;
  thumbnail: string;
}

export interface User {
  login: UserLogin;
  name: UserName;
  gender: string;
  location: UserLocation;
  email: string;
  dob: UserDob;
  registered: UserRegistered;
  phone: string;
  cell: string;
  picture: UserPicture;
  nat: string;
}

interface UsersApiResponse {
  page: number;
  perPage: number;
  total: number;
  span: string;
  effectivePage: number;
  data: User[];
}

const USERS_API_BASE = "https://user-api.builder-io.workers.dev/api";

export default function Customers() {
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [totalRows, setTotalRows] = React.useState(0);
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 20,
  });
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
  const [snackbar, setSnackbar] = React.useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchUsers = React.useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: (paginationModel.page + 1).toString(),
        perPage: paginationModel.pageSize.toString(),
        ...(searchTerm && { search: searchTerm }),
        sortBy: "name.first",
      });

      const response = await fetch(`${USERS_API_BASE}/users?${params}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.status}`);
      }

      const data: UsersApiResponse = await response.json();
      setUsers(data.data);
      setTotalRows(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch users");
      setUsers([]);
      setTotalRows(0);
    } finally {
      setLoading(false);
    }
  }, [paginationModel.page, paginationModel.pageSize, searchTerm]);

  React.useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditModalOpen(true);
  };

  const handleCreateUser = () => {
    setSelectedUser(null);
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
      const response = await fetch(
        `${USERS_API_BASE}/users/${user.login.uuid}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to delete user: ${response.status}`);
      }

      setSnackbar({
        open: true,
        message: "User deleted successfully",
        severity: "success",
      });

      fetchUsers();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err instanceof Error ? err.message : "Failed to delete user",
        severity: "error",
      });
    }
  };

  const handleModalSuccess = (message: string) => {
    setSnackbar({
      open: true,
      message,
      severity: "success",
    });
    fetchUsers();
  };

  const handleModalError = (message: string) => {
    setSnackbar({
      open: true,
      message,
      severity: "error",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatFullName = (name: UserName) => {
    return `${name.title} ${name.first} ${name.last}`;
  };

  const formatLocation = (location: UserLocation) => {
    return `${location.city}, ${location.country}`;
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
          src={params.row.picture?.thumbnail}
          alt={formatFullName(params.row.name)}
          sx={{ width: 32, height: 32 }}
        >
          {params.row.name.first.charAt(0).toUpperCase()}
        </Avatar>
      ),
    },
    {
      field: "name",
      headerName: "Full Name",
      flex: 1,
      minWidth: 200,
      valueGetter: (value, row) => formatFullName(row.name),
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {formatFullName(params.row.name)}
        </Typography>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      minWidth: 250,
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
      flex: 1,
      minWidth: 200,
      valueGetter: (value, row) => formatLocation(row.location),
      renderCell: (params) => (
        <Typography variant="body2">
          {formatLocation(params.row.location)}
        </Typography>
      ),
    },
    {
      field: "age",
      headerName: "Age",
      width: 80,
      valueGetter: (value, row) => row.dob.age,
    },
    {
      field: "gender",
      headerName: "Gender",
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          variant="outlined"
          color={params.value === "male" ? "primary" : "secondary"}
        />
      ),
    },
    {
      field: "registered",
      headerName: "Registered",
      width: 120,
      valueGetter: (value, row) => formatDate(row.registered.date),
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 120,
      getActions: (params: GridRowParams<User>) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          onClick={() => handleEditUser(params.row)}
          color="primary"
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => handleDeleteUser(params.row)}
          color="error"
        />,
      ],
    },
  ];

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        Customer Management
      </Typography>

      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems={{ xs: "stretch", sm: "center" }}
            justifyContent="space-between"
          >
            <TextField
              placeholder="Search customers by name, email, or city..."
              value={searchTerm}
              onChange={handleSearchChange}
              size="small"
              sx={{ minWidth: { xs: "100%", sm: "300px" } }}
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
                onClick={fetchUsers}
                disabled={loading}
              >
                Refresh
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreateUser}
              >
                Add Customer
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Card variant="outlined">
        <CardContent sx={{ p: 0 }}>
          {error ? (
            <Alert severity="error" sx={{ m: 2 }}>
              {error}
            </Alert>
          ) : (
            <DataGrid
              rows={users}
              columns={columns}
              getRowId={(row) => row.login.uuid}
              loading={loading}
              paginationMode="server"
              pagination
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              pageSizeOptions={[10, 20, 50, 100]}
              rowCount={totalRows}
              checkboxSelection
              disableRowSelectionOnClick
              getRowClassName={(params) =>
                params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
              }
              density="standard"
              sx={{
                minHeight: 600,
                border: 0,
                "& .even": {
                  backgroundColor: "action.hover",
                },
              }}
              slotProps={{
                toolbar: {
                  showQuickFilter: false,
                },
                pagination: {
                  showFirstButton: true,
                  showLastButton: true,
                },
                loadingOverlay: {
                  variant: "circular-progress",
                  noRowsVariant: "skeleton",
                },
              }}
              slots={{
                loadingOverlay: () => (
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    height="100%"
                  >
                    <CircularProgress />
                  </Box>
                ),
              }}
            />
          )}
        </CardContent>
      </Card>

      <CustomerEditModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        user={selectedUser}
        onSuccess={handleModalSuccess}
        onError={handleModalError}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
