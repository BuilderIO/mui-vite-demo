import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

interface User {
  login: {
    uuid: string;
    username: string;
  };
  name: {
    title: string;
    first: string;
    last: string;
  };
  email: string;
  location: {
    city: string;
    country: string;
  };
  phone: string;
  picture: {
    thumbnail: string;
  };
  registered: {
    date: string;
  };
}

interface CustomersDataGridProps {
  onEditUser: (user: User) => void;
}

export default function CustomersDataGrid({
  onEditUser,
}: CustomersDataGridProps) {
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filteredUsers, setFilteredUsers] = React.useState<User[]>([]);

  React.useEffect(() => {
    fetchUsers();
  }, []);

  React.useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(users);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = users.filter(
        (user) =>
          user.name.first.toLowerCase().includes(query) ||
          user.name.last.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.location.city.toLowerCase().includes(query) ||
          user.location.country.toLowerCase().includes(query),
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        "https://user-api.builder-io.workers.dev/api/users?perPage=100",
      );
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      setUsers(data.data || []);
      setFilteredUsers(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const columns: GridColDef[] = [
    {
      field: "avatar",
      headerName: "",
      width: 60,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Avatar
          src={params.row.picture?.thumbnail}
          alt={`${params.row.name.first} ${params.row.name.last}`}
          sx={{ width: 32, height: 32 }}
        >
          {params.row.name.first[0]}
        </Avatar>
      ),
    },
    {
      field: "name",
      headerName: "Name",
      width: 200,
      valueGetter: (value, row) =>
        `${row.name.title} ${row.name.first} ${row.name.last}`,
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
      valueGetter: (value, row) => row.login.username,
    },
    {
      field: "location",
      headerName: "Location",
      width: 200,
      valueGetter: (value, row) =>
        `${row.location.city}, ${row.location.country}`,
    },
    {
      field: "phone",
      headerName: "Phone",
      width: 150,
    },
    {
      field: "registered",
      headerName: "Registered",
      width: 130,
      valueGetter: (value, row) => {
        const date = new Date(row.registered.date);
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => (
        <IconButton
          size="small"
          onClick={() => onEditUser(params.row)}
          aria-label="edit user"
        >
          <EditRoundedIcon fontSize="small" />
        </IconButton>
      ),
    },
  ];

  if (error) {
    return (
      <Card variant="outlined">
        <CardContent>
          <Alert severity="error">{error}</Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="outlined" sx={{ height: 700 }}>
      <CardContent sx={{ pb: 0 }}>
        <Stack spacing={2}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6" component="h3">
              Customer Directory
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {filteredUsers.length} customers
            </Typography>
          </Stack>
          <TextField
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </Stack>
      </CardContent>
      <Box sx={{ height: "calc(100% - 120px)", width: "100%", p: 2, pt: 1 }}>
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            <CircularProgress />
          </Box>
        ) : (
          <DataGrid
            rows={filteredUsers}
            columns={columns}
            getRowId={(row) => row.login.uuid}
            pageSizeOptions={[10, 25, 50, 100]}
            initialState={{
              pagination: { paginationModel: { pageSize: 25 } },
            }}
            disableRowSelectionOnClick
            density="comfortable"
            sx={{
              border: 0,
              "& .MuiDataGrid-cell:focus": {
                outline: "none",
              },
              "& .MuiDataGrid-cell:focus-within": {
                outline: "none",
              },
            }}
          />
        )}
      </Box>
    </Card>
  );
}
