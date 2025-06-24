import * as React from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Alert,
  Card,
  Avatar,
  IconButton,
  Chip,
  Tooltip,
} from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridRowParams,
  GridPaginationModel,
} from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import { useUsers, User } from "../hooks/useUsers";
import UserEditModal from "../components/UserEditModal";

export default function Customers() {
  const {
    users,
    loading,
    error,
    totalUsers,
    page,
    perPage,
    searchQuery,
    handlePageChange,
    handlePageSizeChange,
    handleSearch,
    updateUser,
  } = useUsers();

  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
  const [searchInput, setSearchInput] = React.useState(searchQuery);

  // Debounce search input
  React.useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(searchInput);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput, handleSearch]);

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditModalOpen(true);
  };

  const handleSaveUser = async (userId: string, updates: Partial<User>) => {
    await updateUser(userId, updates);
  };

  const handlePaginationModelChange = (model: GridPaginationModel) => {
    if (model.page !== page - 1) {
      handlePageChange(model.page + 1); // DataGrid uses 0-based indexing
    }
    if (model.pageSize !== perPage) {
      handlePageSizeChange(model.pageSize);
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
          sx={{ width: 32, height: 32 }}
        >
          {params.row.name.first.charAt(0)}
          {params.row.name.last.charAt(0)}
        </Avatar>
      ),
    },
    {
      field: "fullName",
      headerName: "Name",
      flex: 1.5,
      minWidth: 200,
      valueGetter: (value, row) => `${row.name.first} ${row.name.last}`,
      renderCell: (params) => (
        <Box>
          <Typography
            variant="body2"
            fontWeight="medium"
            sx={{ lineHeight: 1.2 }}
          >
            {params.row.name.title} {params.row.name.first}{" "}
            {params.row.name.last}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ lineHeight: 1 }}
          >
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
      renderCell: (params) => (
        <Box display="flex" alignItems="center" gap={1}>
          <EmailIcon fontSize="small" color="action" />
          <Typography variant="body2">{params.value}</Typography>
        </Box>
      ),
    },
    {
      field: "phone",
      headerName: "Phone",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => (
        <Box display="flex" alignItems="center" gap={1}>
          <PhoneIcon fontSize="small" color="action" />
          <Typography variant="body2">{params.value}</Typography>
        </Box>
      ),
    },
    {
      field: "location",
      headerName: "Location",
      flex: 1.5,
      minWidth: 200,
      valueGetter: (value, row) =>
        `${row.location.city}, ${row.location.country}`,
      renderCell: (params) => (
        <Box display="flex" alignItems="center" gap={1}>
          <LocationOnIcon fontSize="small" color="action" />
          <Box>
            <Typography variant="body2" sx={{ lineHeight: 1.2 }}>
              {params.row.location.city}, {params.row.location.state}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ lineHeight: 1 }}
            >
              {params.row.location.country}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: "age",
      headerName: "Age",
      width: 80,
      type: "number",
      valueGetter: (value, row) => row.dob.age,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          variant="outlined"
          color="primary"
        />
      ),
    },
    {
      field: "registered",
      headerName: "Member Since",
      flex: 1,
      minWidth: 120,
      valueGetter: (value, row) => {
        const date = new Date(row.registered.date);
        return date.toLocaleDateString();
      },
      renderCell: (params) => (
        <Typography variant="body2">
          {new Date(params.row.registered.date).toLocaleDateString()}
        </Typography>
      ),
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 80,
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem
          key="edit"
          icon={
            <Tooltip title="Edit User">
              <EditIcon />
            </Tooltip>
          }
          label="Edit"
          onClick={() => handleEditUser(params.row as User)}
        />,
      ],
    },
  ];

  // Transform users data for DataGrid (add id field)
  const rows = users.map((user) => ({
    ...user,
    id: user.login.uuid,
  }));

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
        Customers
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Card sx={{ mb: 3 }}>
        <Box sx={{ p: 3 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
          >
            <Typography variant="h6" component="h2">
              Customer Directory
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {totalUsers} total customers
            </Typography>
          </Box>

          <TextField
            fullWidth
            placeholder="Search customers by name, email, or city..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 3 }}
          />

          <DataGrid
            rows={rows}
            columns={columns}
            loading={loading}
            paginationMode="server"
            rowCount={totalUsers}
            paginationModel={{
              page: page - 1, // DataGrid uses 0-based indexing
              pageSize: perPage,
            }}
            onPaginationModelChange={handlePaginationModelChange}
            pageSizeOptions={[10, 20, 50, 100]}
            disableColumnFilter
            disableColumnSelector
            disableDensitySelector
            disableRowSelectionOnClick
            getRowClassName={(params) =>
              params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
            }
            sx={{
              minHeight: 600,
              "& .MuiDataGrid-row.even": {
                backgroundColor: "action.hover",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "1px solid",
                borderColor: "divider",
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "background.paper",
                borderBottom: "2px solid",
                borderColor: "divider",
              },
            }}
            slotProps={{
              loadingOverlay: {
                variant: "skeleton",
                noRowsVariant: "skeleton",
              },
              noRowsOverlay: {
                message: searchQuery
                  ? `No customers found matching "${searchQuery}"`
                  : "No customers found",
              },
            }}
          />
        </Box>
      </Card>

      <UserEditModal
        open={editModalOpen}
        user={selectedUser}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedUser(null);
        }}
        onSave={handleSaveUser}
      />
    </Box>
  );
}
