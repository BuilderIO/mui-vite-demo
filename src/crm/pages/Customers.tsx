import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import CustomersTable from "../components/CustomersTable";

// API Base URL
const API_BASE_URL = "https://user-api.builder-io.workers.dev/api";

// User interface based on the API documentation
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

interface ApiResponse {
  page: number;
  perPage: number;
  total: number;
  span: string;
  effectivePage: number;
  data: User[];
}

// Sort options
const sortOptions = [
  { value: "name.first", label: "First Name" },
  { value: "name.last", label: "Last Name" },
  { value: "location.city", label: "City" },
  { value: "location.country", label: "Country" },
  { value: "dob.age", label: "Age" },
  { value: "registered.date", label: "Registration Date" },
];

export default function Customers() {
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [total, setTotal] = React.useState(0);
  const [search, setSearch] = React.useState("");
  const [sortBy, setSortBy] = React.useState("name.first");
  const [searchInput, setSearchInput] = React.useState("");

  // Debounced search effect
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(0); // Reset to first page when searching
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch users from API
  const fetchUsers = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: String(page + 1), // API uses 1-based pagination
        perPage: String(rowsPerPage),
        sortBy,
        ...(search && { search }),
      });

      const response = await fetch(`${API_BASE_URL}/users?${params}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.status}`);
      }

      const data: ApiResponse = await response.json();
      setUsers(data.data);
      setTotal(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setUsers([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, search, sortBy]);

  // Fetch users on mount and when dependencies change
  React.useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Handle page change
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle refresh
  const handleRefresh = () => {
    fetchUsers();
  };

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
          Customers
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<RefreshRoundedIcon />}
            onClick={handleRefresh}
            sx={{ mr: 1 }}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button variant="contained" startIcon={<AddRoundedIcon />}>
            Add Customer
          </Button>
        </Box>
      </Stack>

      {/* Filters and Search */}
      <Card variant="outlined" sx={{ mb: 2 }}>
        <CardContent>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems="center"
          >
            <TextField
              size="small"
              placeholder="Search customers..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              InputProps={{
                startAdornment: (
                  <SearchRoundedIcon sx={{ mr: 1, color: "text.secondary" }} />
                ),
              }}
              sx={{ minWidth: 280 }}
            />
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel>Sort by</InputLabel>
              <Select
                value={sortBy}
                label="Sort by"
                onChange={(e) => setSortBy(e.target.value)}
              >
                {sortOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Customers Table */}
      <CustomersTable
        users={users}
        loading={loading}
        total={total}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
}
