import * as React from "react";
import {
  DataGrid,
  GridColDef,
  GridRowsProp,
  GridActionsCellItem,
  GridRowParams,
} from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";
import Alert from "@mui/material/Alert";

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
    coordinates: {
      latitude: number;
      longitude: number;
    };
    timezone: {
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

interface CustomersTableProps {
  onEditUser: (user: User) => void;
}

export default function CustomersTable({ onEditUser }: CustomersTableProps) {
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 20,
  });
  const [totalUsers, setTotalUsers] = React.useState(0);

  const fetchUsers = React.useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: (paginationModel.page + 1).toString(),
        perPage: paginationModel.pageSize.toString(),
        ...(searchQuery && { search: searchQuery }),
        sortBy: "name.first",
      });

      const response = await fetch(
        `https://user-api.builder-io.workers.dev/api/users?${params}`,
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setUsers(data.data || []);
      setTotalUsers(data.total || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch users");
      setUsers([]);
      setTotalUsers(0);
    } finally {
      setLoading(false);
    }
  }, [paginationModel, searchQuery]);

  React.useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

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
          {params.row.name.first.charAt(0).toUpperCase()}
        </Avatar>
      ),
    },
    {
      field: "fullName",
      headerName: "Name",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2" fontWeight="medium">
            {`${params.row.name.title} ${params.row.name.first} ${params.row.name.last}`}
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
      flex: 1,
      minWidth: 200,
    },
    {
      field: "location",
      headerName: "Location",
      flex: 1,
      minWidth: 180,
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
      field: "gender",
      headerName: "Gender",
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          color={getGenderColor(params.value)}
          variant="outlined"
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
      field: "phone",
      headerName: "Phone",
      width: 140,
    },
    {
      field: "registered",
      headerName: "Registered",
      width: 120,
      renderCell: (params) => formatDate(params.row.registered.date),
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 80,
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem
          key="edit"
          icon={<EditIcon />}
          label="Edit"
          onClick={() => onEditUser(params.row)}
          showInMenu={false}
        />,
      ],
    },
  ];

  const rows: GridRowsProp = users.map((user) => ({
    id: user.login.uuid,
    ...user,
  }));

  return (
    <Box sx={{ width: "100%", height: "600px" }}>
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search customers by name, email, or city..."
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: 400 }}
        />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[10, 20, 50, 100]}
        rowCount={totalUsers}
        paginationMode="server"
        disableRowSelectionOnClick
        density="compact"
        slots={{
          loadingOverlay: LinearProgress,
        }}
        slotProps={{
          pagination: {
            showFirstButton: true,
            showLastButton: true,
          },
        }}
        sx={{
          "& .MuiDataGrid-cell": {
            borderBottom: "1px solid",
            borderBottomColor: "divider",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "background.paper",
            borderBottom: "2px solid",
            borderBottomColor: "divider",
          },
          "& .MuiDataGrid-row:hover": {
            backgroundColor: "action.hover",
          },
        }}
      />
    </Box>
  );
}
