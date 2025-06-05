import * as React from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  Stack,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRowParams,
  GridToolbar,
} from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonIcon from "@mui/icons-material/Person";
import {
  usersApi,
  User,
  CreateUserRequest,
  UpdateUserRequest,
} from "../services/usersApi";
import CustomerModal from "../components/CustomerModal";

interface ActionMenuProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

function ActionMenu({ user, onEdit, onDelete }: ActionMenuProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    onEdit(user);
    handleClose();
  };

  const handleDelete = () => {
    onDelete(user);
    handleClose();
  };

  return (
    <>
      <IconButton
        aria-label="more"
        aria-controls={open ? "action-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        size="small"
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="action-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "action-button",
        }}
      >
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}

export default function Customers() {
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(25);
  const [totalRows, setTotalRows] = React.useState(0);

  // Modal states
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
  const [modalLoading, setModalLoading] = React.useState(false);

  // Delete confirmation states
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [userToDelete, setUserToDelete] = React.useState<User | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  // Snackbar states
  const [snackbar, setSnackbar] = React.useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnackbar = (
    message: string,
    severity: "success" | "error" = "success",
  ) => {
    setSnackbar({ open: true, message, severity });
  };

  const closeSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const fetchUsers = React.useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await usersApi.getUsers({
        page: page + 1, // API uses 1-based pagination
        perPage: pageSize,
        search: searchQuery,
        sortBy: "name.first",
      });

      setUsers(response.data);
      setTotalRows(response.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, searchQuery]);

  React.useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Debounced search
  const debouncedSearch = React.useMemo(() => {
    const timer = setTimeout(() => {
      setPage(0); // Reset to first page when searching
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    setDeleting(true);
    try {
      await usersApi.deleteUser(userToDelete.login.uuid);
      showSnackbar("User deleted successfully");
      fetchUsers();
    } catch (err) {
      showSnackbar(
        err instanceof Error ? err.message : "Failed to delete user",
        "error",
      );
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const handleSaveUser = async (
    userData: CreateUserRequest | UpdateUserRequest,
  ) => {
    setModalLoading(true);
    try {
      if (selectedUser) {
        // Update existing user
        await usersApi.updateUser(
          selectedUser.login.uuid,
          userData as UpdateUserRequest,
        );
        showSnackbar("User updated successfully");
      } else {
        // Create new user
        await usersApi.createUser(userData as CreateUserRequest);
        showSnackbar("User created successfully");
      }
      fetchUsers();
    } catch (err) {
      throw err; // Let the modal handle the error
    } finally {
      setModalLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getInitials = (first: string, last: string) => {
    return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
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
        return (
          <Avatar sx={{ width: 32, height: 32, fontSize: "0.875rem" }}>
            {user.picture?.thumbnail ? (
              <img
                src={user.picture.thumbnail}
                alt={`${user.name.first} ${user.name.last}`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              getInitials(user.name.first, user.name.last)
            )}
          </Avatar>
        );
      },
    },
    {
      field: "name",
      headerName: "Name",
      width: 200,
      valueGetter: (value, row: User) =>
        `${row.name.title} ${row.name.first} ${row.name.last}`,
    },
    {
      field: "email",
      headerName: "Email",
      width: 250,
      valueGetter: (value, row: User) => row.email,
    },
    {
      field: "username",
      headerName: "Username",
      width: 150,
      valueGetter: (value, row: User) => row.login.username,
    },
    {
      field: "location",
      headerName: "Location",
      width: 200,
      valueGetter: (value, row: User) =>
        `${row.location.city}, ${row.location.country}`,
    },
    {
      field: "phone",
      headerName: "Phone",
      width: 150,
      valueGetter: (value, row: User) => row.phone,
    },
    {
      field: "gender",
      headerName: "Gender",
      width: 100,
      renderCell: (params) => {
        const user = params.row as User;
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
      field: "age",
      headerName: "Age",
      width: 80,
      valueGetter: (value, row: User) => row.dob.age,
    },
    {
      field: "registered",
      headerName: "Registered",
      width: 120,
      valueGetter: (value, row: User) => formatDate(row.registered.date),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 80,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const user = params.row as User;
        return (
          <ActionMenu
            user={user}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
          />
        );
      },
    },
  ];

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
        Customer Management
      </Typography>

      <Card variant="outlined" sx={{ height: "100%" }}>
        <CardContent>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
            sx={{ mb: 3 }}
          >
            <Typography variant="h6">Customers</Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <TextField
                size="small"
                placeholder="Search customers..."
                value={searchQuery}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />
                  ),
                }}
                sx={{ minWidth: 200 }}
              />
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddUser}
              >
                Add Customer
              </Button>
            </Stack>
          </Stack>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ height: 600 }}>
            <DataGrid
              rows={users}
              columns={columns}
              pagination
              paginationMode="server"
              page={page}
              pageSize={pageSize}
              rowCount={totalRows}
              onPageChange={(newPage) => setPage(newPage)}
              onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
              pageSizeOptions={[10, 25, 50, 100]}
              loading={loading}
              getRowId={(row) => row.login.uuid}
              density="comfortable"
              disableRowSelectionOnClick
              slots={{
                toolbar: GridToolbar,
              }}
              slotProps={{
                toolbar: {
                  showQuickFilter: false,
                },
              }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Add/Edit Customer Modal */}
      <CustomerModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveUser}
        user={selectedUser}
        loading={modalLoading}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete {userToDelete?.name.first}{" "}
          {userToDelete?.name.last}? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            color="error"
            variant="contained"
            disabled={deleting}
            startIcon={
              deleting ? <CircularProgress size={20} /> : <DeleteIcon />
            }
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success/Error Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={closeSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
