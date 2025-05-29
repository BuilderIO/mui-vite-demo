import * as React from "react";
import { useState, useCallback, useMemo } from "react";
import {
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridRowParams,
  GridPaginationModel,
  GridSortModel,
} from "@mui/x-data-grid";
import {
  Avatar,
  Chip,
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  TextField,
  InputAdornment,
  Card,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import { User } from "../types/user";

interface CustomerDataGridProps {
  users: User[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    perPage: number;
    total: number;
  };
  onPaginationChange: (page: number, perPage: number) => void;
  onSearch: (search: string) => void;
  onSort: (sortBy: string) => void;
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
}

export default function CustomerDataGrid({
  users,
  loading,
  error,
  pagination,
  onPaginationChange,
  onSearch,
  onSort,
  onEdit,
  onDelete,
}: CustomerDataGridProps) {
  const [searchValue, setSearchValue] = useState("");
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setSearchValue(value);
      onSearch(value);
    },
    [onSearch],
  );

  const handleClearSearch = useCallback(() => {
    setSearchValue("");
    onSearch("");
  }, [onSearch]);

  const handlePaginationModelChange = useCallback(
    (model: GridPaginationModel) => {
      onPaginationChange(model.page + 1, model.pageSize);
    },
    [onPaginationChange],
  );

  const handleSortModelChange = useCallback(
    (model: GridSortModel) => {
      setSortModel(model);
      if (model.length > 0) {
        const sort = model[0];
        const sortBy =
          sort.field === "fullName"
            ? "name.first"
            : sort.field === "email"
              ? "email"
              : sort.field === "city"
                ? "location.city"
                : sort.field === "country"
                  ? "location.country"
                  : sort.field === "age"
                    ? "dob.age"
                    : "name.first";
        onSort(sortBy);
      }
    },
    [onSort],
  );

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    user: User,
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const handleEdit = () => {
    if (selectedUser) {
      onEdit(selectedUser);
    }
    handleMenuClose();
  };

  const handleDelete = () => {
    if (selectedUser) {
      onDelete(selectedUser.login.uuid);
    }
    handleMenuClose();
  };

  const renderAvatar = (params: any) => {
    const user = params.row as User;
    const initials = `${user.name.first[0]}${user.name.last[0]}`.toUpperCase();

    return (
      <Avatar
        src={user.picture.thumbnail}
        alt={`${user.name.first} ${user.name.last}`}
        sx={{ width: 32, height: 32 }}
      >
        {initials}
      </Avatar>
    );
  };

  const renderFullName = (params: any) => {
    const user = params.row as User;
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        {renderAvatar(params)}
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {user.name.title} {user.name.first} {user.name.last}
        </Typography>
      </Box>
    );
  };

  const renderGender = (params: any) => {
    const gender = params.value as string;
    const color =
      gender === "male"
        ? "primary"
        : gender === "female"
          ? "secondary"
          : "default";
    return (
      <Chip
        label={gender.charAt(0).toUpperCase() + gender.slice(1)}
        size="small"
        variant="outlined"
        color={color as any}
      />
    );
  };

  const renderLocation = (params: any) => {
    const user = params.row as User;
    return (
      <Typography variant="body2">
        {user.location.city}, {user.location.country}
      </Typography>
    );
  };

  const renderActions = (params: any) => {
    const user = params.row as User;
    return (
      <IconButton
        size="small"
        onClick={(event) => handleMenuClick(event, user)}
        aria-label="user actions"
      >
        <MoreVertIcon fontSize="small" />
      </IconButton>
    );
  };

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "fullName",
        headerName: "Customer",
        flex: 1.3,
        minWidth: 180,
        renderCell: renderFullName,
        sortable: true,
      },
      {
        field: "email",
        headerName: "Email",
        flex: 1.2,
        minWidth: 180,
        sortable: true,
      },
      {
        field: "gender",
        headerName: "Gender",
        width: 90,
        renderCell: renderGender,
        sortable: false,
      },
      {
        field: "age",
        headerName: "Age",
        width: 70,
        align: "center",
        headerAlign: "center",
        valueGetter: (value, row) => row.dob.age,
        sortable: true,
      },
      {
        field: "location",
        headerName: "Location",
        flex: 1,
        minWidth: 140,
        renderCell: renderLocation,
        sortable: false,
      },
      {
        field: "phone",
        headerName: "Phone",
        width: 130,
        sortable: false,
      },
      {
        field: "registered",
        headerName: "Member Since",
        width: 110,
        valueGetter: (value, row) => {
          const date = new Date(row.registered.date);
          return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
          });
        },
        sortable: true,
      },
      {
        field: "actions",
        type: "actions",
        headerName: "Actions",
        width: 70,
        renderCell: renderActions,
      },
    ],
    [],
  );

  const rows = useMemo(
    () =>
      users.map((user) => ({
        id: user.login.uuid,
        ...user,
      })),
    [users],
  );

  if (error) {
    return (
      <Card variant="outlined" sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Card>
    );
  }

  return (
    <Card
      variant="outlined"
      sx={{ height: 550, display: "flex", flexDirection: "column" }}
    >
      {/* Search Header */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            size="small"
            placeholder="Search customers by name, email, or city..."
            value={searchValue}
            onChange={handleSearchChange}
            sx={{ minWidth: 300, maxWidth: 400, flexGrow: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: searchValue && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={handleClearSearch}>
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Typography variant="body2" color="text.secondary">
            {pagination.total} customers total
          </Typography>
        </Stack>
      </Box>

      {/* Data Grid */}
      <Box sx={{ flexGrow: 1, position: "relative" }}>
        {loading && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1,
            }}
          >
            <CircularProgress />
          </Box>
        )}

        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          sortModel={sortModel}
          onSortModelChange={handleSortModelChange}
          paginationMode="server"
          paginationModel={{
            page: pagination.page - 1,
            pageSize: pagination.perPage,
          }}
          onPaginationModelChange={handlePaginationModelChange}
          rowCount={pagination.total}
          pageSizeOptions={[10, 20, 50, 100]}
          density="compact"
          disableColumnResize
          disableRowSelectionOnClick
          getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
          }
          slotProps={{
            pagination: {
              showFirstButton: true,
              showLastButton: true,
            },
          }}
          sx={{
            border: "none",
            "& .MuiDataGrid-cell": {
              borderBottom: "1px solid",
              borderColor: "divider",
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "action.hover",
            },
          }}
        />
      </Box>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleEdit}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Edit Customer
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete Customer
        </MenuItem>
      </Menu>
    </Card>
  );
}
