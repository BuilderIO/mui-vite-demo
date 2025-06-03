import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
  GridSortModel,
} from "@mui/x-data-grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import Alert from "@mui/material/Alert";
import { UsersApiService } from "../services/usersApi";
import { User } from "../types/User";
import EditUserModal from "./EditUserModal";

const getGenderColor = (
  gender: string,
): "default" | "primary" | "secondary" => {
  switch (gender.toLowerCase()) {
    case "male":
      return "primary";
    case "female":
      return "secondary";
    default:
      return "default";
  }
};

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString("en-US", options);
};

const [users, setUsers] = useState<User[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
  page: 0,
  pageSize: 25,
});
const [sortModel, setSortModel] = useState<GridSortModel>([
  { field: "firstName", sort: "asc" },
]);
const [searchQuery, setSearchQuery] = useState("");
const [totalUsers, setTotalUsers] = useState(0);
const [editModalOpen, setEditModalOpen] = useState(false);
const [selectedUserForEdit, setSelectedUserForEdit] = useState<User | null>(
  null,
);

const handleEditUser = (user: User) => {
  setSelectedUserForEdit(user);
  setEditModalOpen(true);
};

const handleCloseEditModal = () => {
  setEditModalOpen(false);
  setSelectedUserForEdit(null);
};

const handleUserUpdated = () => {
  fetchUsers(); // Refresh the data grid
};

const columns: GridColDef[] = [
  {
    field: "picture",
    headerName: "",
    width: 60,
    sortable: false,
    filterable: false,
    renderCell: (params) => (
      <Avatar
        src={params.row.picture?.thumbnail}
        alt={`${params.row.name?.first} ${params.row.name?.last}`}
        sx={{ width: 32, height: 32 }}
      >
        {params.row.name?.first?.charAt(0)}
      </Avatar>
    ),
  },
  {
    field: "firstName",
    headerName: "First Name",
    width: 140,
    valueGetter: (value, row) => row.name?.first || "",
  },
  {
    field: "lastName",
    headerName: "Last Name",
    width: 140,
    valueGetter: (value, row) => row.name?.last || "",
  },
  {
    field: "email",
    headerName: "Email",
    width: 220,
  },
  {
    field: "city",
    headerName: "City",
    width: 140,
    valueGetter: (value, row) => row.location?.city || "",
  },
  {
    field: "country",
    headerName: "Country",
    width: 120,
    valueGetter: (value, row) => row.location?.country || "",
  },
  {
    field: "age",
    headerName: "Age",
    width: 80,
    type: "number",
    valueGetter: (value, row) => row.dob?.age || 0,
  },
  {
    field: "gender",
    headerName: "Gender",
    width: 100,
    renderCell: (params) => (
      <Chip
        label={params.value}
        size="small"
        color={getGenderColor(params.value)}
        variant="outlined"
        sx={{ textTransform: "capitalize" }}
      />
    ),
  },
  {
    field: "phone",
    headerName: "Phone",
    width: 140,
  },
  {
    field: "actions",
    headerName: "Actions",
    width: 100,
    sortable: false,
    filterable: false,
    renderCell: (params) => (
      <IconButton
        size="small"
        onClick={() => handleEditUser(params.row)}
        sx={{ color: "primary.main" }}
      >
        <EditRoundedIcon fontSize="small" />
      </IconButton>
    ),
  },
];

interface CustomersDataGridProps {
  onUserSelect?: (user: User) => void;
}

export default function CustomersDataGrid({
  onUserSelect,
}: CustomersDataGridProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 25,
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([
    { field: "fullName", sort: "asc" },
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalUsers, setTotalUsers] = useState(0);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Starting user fetch...");

      // Start with basic call, then add parameters
      let response;

      // If it's the first load or no special parameters, try simple call first
      if (
        paginationModel.page === 0 &&
        !searchQuery &&
        sortModel.length === 0
      ) {
        console.log("Making simple API call...");
        response = await UsersApiService.getUsers();
      } else {
        // Build parameters carefully
        const params: any = {};

        if (paginationModel.page > 0 || paginationModel.pageSize !== 25) {
          params.page = paginationModel.page + 1;
          params.perPage = paginationModel.pageSize;
        }

        if (searchQuery && searchQuery.trim()) {
          params.search = searchQuery.trim();
        }

        if (sortModel.length > 0) {
          // Map the sort field to API expected format
          const sortFieldMapping: Record<string, string> = {
            firstName: "name.first",
            lastName: "name.last",
            email: "email",
            city: "location.city",
            country: "location.country",
            age: "dob.age",
            gender: "gender",
            phone: "phone",
          };

          params.sortBy = sortFieldMapping[sortModel[0].field] || "name.first";
        }

        console.log("Making API call with params:", params);
        response = await UsersApiService.getUsers(params);
      }

      console.log("API response received:", response);

      if (response && response.data && Array.isArray(response.data)) {
        setUsers(response.data);
        setTotalUsers(response.total || response.data.length);
        console.log(`Successfully loaded ${response.data.length} users`);
      } else {
        setUsers([]);
        setTotalUsers(0);
        setError("Invalid response format from API");
      }
    } catch (err) {
      console.error("Error in fetchUsers:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch users";
      setError(errorMessage);
      setUsers([]);
      setTotalUsers(0);
    } finally {
      setLoading(false);
    }
  }, [paginationModel, sortModel, searchQuery]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handlePaginationModelChange = (model: GridPaginationModel) => {
    setPaginationModel(model);
  };

  const handleSortModelChange = (model: GridSortModel) => {
    setSortModel(model);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    // Reset to first page when searching
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  };

  const handleRefresh = () => {
    fetchUsers();
  };

  const handleRowClick = (params: any) => {
    if (onUserSelect) {
      onUserSelect(params.row);
    }
  };

  const rowsWithId = users.map((user, index) => ({
    ...user,
    id: user.login?.uuid || `user-${index}`,
  }));

  return (
    <>
      <Card variant="outlined" sx={{ height: "100%" }}>
        <CardContent sx={{ pb: 0 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
            sx={{ mb: 2 }}
          >
            <Typography variant="h6" component="h3">
              Customer Directory
            </Typography>
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<RefreshRoundedIcon />}
                onClick={handleRefresh}
                disabled={loading}
              >
                Refresh
              </Button>
              <Button
                variant="contained"
                size="small"
                startIcon={<AddRoundedIcon />}
              >
                Add Customer
              </Button>
            </Stack>
          </Stack>

          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search customers by name, email, or city..."
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
        </CardContent>

        <Box sx={{ height: 600 }}>
          <DataGrid
            rows={rowsWithId}
            columns={columns}
            loading={loading}
            paginationModel={paginationModel}
            onPaginationModelChange={handlePaginationModelChange}
            paginationMode="server"
            sortingMode="server"
            sortModel={sortModel}
            onSortModelChange={handleSortModelChange}
            rowCount={totalUsers}
            pageSizeOptions={[10, 25, 50, 100]}
            checkboxSelection
            disableRowSelectionOnClick
            onRowClick={handleRowClick}
            density="compact"
            getRowClassName={(params) =>
              params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
            }
            sx={{
              "& .MuiDataGrid-row:hover": {
                cursor: "pointer",
              },
            }}
            slotProps={{
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
          />
        </Box>
      </Card>

      <EditUserModal
        open={editModalOpen}
        user={selectedUserForEdit}
        onClose={handleCloseEditModal}
        onUserUpdated={handleUserUpdated}
      />
    </>
  );
}
