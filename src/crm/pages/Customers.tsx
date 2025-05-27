import * as React from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  IconButton,
  Alert,
  Chip,
  Avatar,
  Tooltip,
  Stack,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridRowId,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridPaginationModel,
} from "@mui/x-data-grid";
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
} from "@mui/icons-material";
import { useUsers, User, CreateUserRequest } from "../hooks/useUsers";
import UserDialog from "../components/UserDialog";

function CustomToolbar({ onAddClick }: { onAddClick: () => void }) {
  return (
    <GridToolbarContainer>
      <Button
        color="primary"
        startIcon={<AddIcon />}
        onClick={onAddClick}
        sx={{ mr: 1 }}
      >
        Add User
      </Button>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

export default function Customers() {
  const {
    users,
    loading,
    error,
    total,
    page,
    perPage,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  } = useUsers();

  const [searchQuery, setSearchQuery] = React.useState("");
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);
  const [userToDelete, setUserToDelete] = React.useState<User | null>(null);
  const [paginationModel, setPaginationModel] =
    React.useState<GridPaginationModel>({
      page: page - 1, // DataGrid uses 0-based indexing
      pageSize: perPage,
    });

  // Debounced search
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchUsers(
        searchQuery,
        "name.first",
        paginationModel.page + 1,
        paginationModel.pageSize,
      );
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, paginationModel, fetchUsers]);

  const handleAddUser = () => {
    setSelectedUser(null);
    setDialogOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      try {
        await deleteUser(userToDelete.login.uuid);
        setDeleteConfirmOpen(false);
        setUserToDelete(null);
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const handleUserSubmit = async (userData: CreateUserRequest) => {
    if (selectedUser) {
      // Update existing user
      await updateUser(selectedUser.login.uuid, userData);
    } else {
      // Create new user
      await createUser(userData);
    }
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
          alt={`${params.row.name.first} ${params.row.name.last}`}
          sx={{ width: 40, height: 40 }}
        >
          <PersonIcon />
        </Avatar>
      ),
    },
    {
      field: "fullName",
      headerName: "Name",
      width: 200,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2" fontWeight="medium">
            {params.row.name.title} {params.row.name.first}{" "}
            {params.row.name.last}
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
      width: 250,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <EmailIcon fontSize="small" color="action" />
          <Typography variant="body2">{params.value}</Typography>
        </Box>
      ),
    },
    {
      field: "phone",
      headerName: "Phone",
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <PhoneIcon fontSize="small" color="action" />
          <Typography variant="body2">{params.value}</Typography>
        </Box>
      ),
    },
    {
      field: "location",
      headerName: "Location",
      width: 200,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <LocationIcon fontSize="small" color="action" />
          <Typography variant="body2">
            {params.row.location.city}, {params.row.location.country}
          </Typography>
        </Box>
      ),
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
          sx={{ textTransform: "capitalize" }}
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
          icon={
            <Tooltip title="Edit User">
              <EditIcon />
            </Tooltip>
          }
          label="Edit"
          onClick={() => handleEditUser(params.row)}
        />,
        <GridActionsCellItem
          icon={
            <Tooltip title="Delete User">
              <DeleteIcon />
            </Tooltip>
          }
          label="Delete"
          onClick={() => handleDeleteUser(params.row)}
        />,
      ],
    },
  ];

  const rows = users.map((user) => ({
    id: user.login.uuid,
    ...user,
  }));

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Stack spacing={3}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h4" component="h1">
            Customer Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddUser}
            sx={{ borderRadius: 2 }}
          >
            Add New User
          </Button>
        </Box>

        {/* Search and Stats */}
        <Card>
          <CardContent>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              alignItems="center"
            >
              <TextField
                placeholder="Search users by name, email, or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ minWidth: 300 }}
                size="small"
              />
              <Box sx={{ ml: "auto" }}>
                <Typography variant="body2" color="text.secondary">
                  Total Users: <strong>{total}</strong>
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" onClose={() => window.location.reload()}>
            {error}
          </Alert>
        )}

        {/* Data Grid */}
        <Card>
          <Box sx={{ height: 600, width: "100%" }}>
            <DataGrid
              rows={rows}
              columns={columns}
              loading={loading}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              pageSizeOptions={[5, 10, 25, 50]}
              paginationMode="server"
              rowCount={total}
              checkboxSelection
              disableRowSelectionOnClick
              slots={{
                toolbar: () => <CustomToolbar onAddClick={handleAddUser} />,
                loadingOverlay: () => (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                    }}
                  >
                    <CircularProgress />
                  </Box>
                ),
              }}
              sx={{
                border: 0,
                "& .MuiDataGrid-row:hover": {
                  backgroundColor: "action.hover",
                },
              }}
            />
          </Box>
        </Card>

        {/* User Dialog */}
        <UserDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onSubmit={handleUserSubmit}
          user={selectedUser}
          loading={loading}
        />

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteConfirmOpen}
          onClose={() => setDeleteConfirmOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete{" "}
              <strong>
                {userToDelete?.name.first} {userToDelete?.name.last}
              </strong>
              ? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteConfirmOpen(false)} color="inherit">
              Cancel
            </Button>
            <Button
              onClick={confirmDelete}
              color="error"
              variant="contained"
              disabled={loading}
              startIcon={
                loading ? <CircularProgress size={20} /> : <DeleteIcon />
              }
            >
              {loading ? "Deleting..." : "Delete"}
            </Button>
          </DialogActions>
        </Dialog>
      </Stack>
    </Box>
  );
}
