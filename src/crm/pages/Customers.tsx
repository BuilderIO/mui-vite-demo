import * as React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Stack,
  Alert,
  Avatar,
  Chip,
  IconButton,
  Button,
  InputAdornment,
} from "@mui/material";
import {
  DataGridPro,
  GridColDef,
  GridActionsCellItem,
  GridPaginationModel,
} from "@mui/x-data-grid-pro";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useUsers, User } from "../hooks/useUsers";
import UserEditModal from "../components/UserEditModal";

export default function Customers() {
  const {
    users,
    loading,
    error,
    totalUsers,
    currentPage,
    perPage,
    searchQuery,
    searchUsers,
    updateUser,
    deleteUser,
    changePage,
    changePageSize,
  } = useUsers();

  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
  const [searchInput, setSearchInput] = React.useState(searchQuery);
  const [deleteConfirm, setDeleteConfirm] = React.useState<string | null>(null);

  // Debounce search input
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchUsers(searchInput);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchInput, searchUsers]);

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditModalOpen(true);
  };

  const handleDeleteUser = async (userId: string) => {
    if (deleteConfirm === userId) {
      try {
        await deleteUser(userId);
        setDeleteConfirm(null);
      } catch (error) {
        console.error("Failed to delete user:", error);
      }
    } else {
      setDeleteConfirm(userId);
      // Auto-cancel confirmation after 3 seconds
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const handleSaveUser = async (userId: string, userData: any) => {
    await updateUser(userId, userData);
  };

  const handlePaginationModelChange = (model: GridPaginationModel) => {
    if (model.pageSize !== perPage) {
      changePageSize(model.pageSize);
    }
    if (model.page + 1 !== currentPage) {
      changePage(model.page + 1);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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
          alt={`${params.row.name.first} ${params.row.name.last}`}
          sx={{ width: 32, height: 32 }}
        />
      ),
    },
    {
      field: "fullName",
      headerName: "Name",
      width: 200,
      valueGetter: (value, row) =>
        `${row.name.title} ${row.name.first} ${row.name.last}`,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
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
        <Typography variant="body2">{params.value}</Typography>
      ),
    },
    {
      field: "location",
      headerName: "Location",
      width: 200,
      valueGetter: (value, row) =>
        `${row.location.city}, ${row.location.country}`,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2">
            {params.row.location.city}, {params.row.location.state}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {params.row.location.country}
          </Typography>
        </Box>
      ),
    },
    {
      field: "age",
      headerName: "Age",
      width: 80,
      valueGetter: (value, row) => row.dob.age,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          variant="outlined"
          color={
            params.value < 30
              ? "primary"
              : params.value < 50
                ? "success"
                : "default"
          }
        />
      ),
    },
    {
      field: "phone",
      headerName: "Phone",
      width: 150,
      renderCell: (params) => (
        <Typography variant="body2">{params.value}</Typography>
      ),
    },
    {
      field: "registered",
      headerName: "Registered",
      width: 120,
      valueGetter: (value, row) => row.registered.date,
      renderCell: (params) => (
        <Typography variant="body2" color="text.secondary">
          {formatDate(params.value)}
        </Typography>
      ),
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 120,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          onClick={() => handleEditUser(params.row)}
          color="primary"
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label={
            deleteConfirm === params.row.login.uuid ? "Confirm?" : "Delete"
          }
          onClick={() => handleDeleteUser(params.row.login.uuid)}
          color={deleteConfirm === params.row.login.uuid ? "error" : "default"}
          sx={{
            color:
              deleteConfirm === params.row.login.uuid
                ? "error.main"
                : undefined,
          }}
        />,
      ],
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
          <Typography variant="h4" component="h1" sx={{ mb: 1 }}>
            Customer Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your customer database with search and edit capabilities
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          disabled
          sx={{ height: "fit-content" }}
        >
          Add Customer
        </Button>
      </Stack>

      {/* Search and Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              placeholder="Search customers by name, email, or location..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              sx={{ flexGrow: 1 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Data Grid */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <DataGridPro
            rows={users}
            columns={columns}
            loading={loading}
            pagination
            paginationMode="server"
            rowCount={totalUsers}
            paginationModel={{
              page: currentPage - 1,
              pageSize: perPage,
            }}
            onPaginationModelChange={handlePaginationModelChange}
            pageSizeOptions={[10, 25, 50, 100]}
            getRowId={(row) => row.login.uuid}
            disableRowSelectionOnClick
            autoHeight
            sx={{
              border: "none",
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "background.default",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "1px solid",
                borderColor: "divider",
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "action.hover",
              },
            }}
          />
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <UserEditModal
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onSave={handleSaveUser}
        loading={loading}
      />
    </Box>
  );
}
