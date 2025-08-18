import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Typography,
  Chip,
  IconButton,
  Box,
  CircularProgress,
  Alert,
  TablePagination,
  TextField,
  InputAdornment,
} from "@mui/material";
import {
  Visibility,
  Search,
  Phone,
  Email,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

interface Customer {
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
  phone: string;
  location: {
    city: string;
    state: string;
    country: string;
  };
  picture: {
    thumbnail: string;
  };
  registered: {
    date: string;
  };
  dob: {
    age: number;
  };
}

interface ApiResponse {
  data: Customer[];
  total: number;
  page: number;
  perPage: number;
}

const getStatusChip = (registrationDate: string) => {
  const regDate = new Date(registrationDate);
  const now = new Date();
  const daysDiff = Math.floor((now.getTime() - regDate.getTime()) / (1000 * 3600 * 24));
  
  if (daysDiff < 30) {
    return <Chip label="New" color="success" size="small" />;
  } else if (daysDiff < 365) {
    return <Chip label="Active" color="primary" size="small" />;
  } else {
    return <Chip label="Veteran" color="default" size="small" />;
  }
};

export default function CrmCustomersTable() {
  const navigate = useNavigate();
  const [customers, setCustomers] = React.useState<Customer[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [total, setTotal] = React.useState(0);
  const [searchTerm, setSearchTerm] = React.useState("");

  const fetchCustomers = React.useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: (page + 1).toString(),
        perPage: rowsPerPage.toString(),
        ...(searchTerm && { search: searchTerm }),
      });

      const response = await fetch(
        `https://user-api.builder-io.workers.dev/api/users?${params}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: ApiResponse = await response.json();
      setCustomers(data.data);
      setTotal(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch customers");
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchTerm]);

  React.useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleViewCustomer = (customerId: string) => {
    navigate(`/customers/${customerId}`);
  };

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Error loading customers: {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ mb: 2, display: "flex", gap: 2, alignItems: "center" }}>
        <TextField
          placeholder="Search customers..."
          value={searchTerm}
          onChange={handleSearch}
          variant="outlined"
          size="small"
          sx={{ minWidth: 300 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Customer</TableCell>
              <TableCell>Contact Info</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Registered</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : customers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    No customers found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              customers.map((customer) => (
                <TableRow
                  key={customer.login.uuid}
                  hover
                  sx={{ cursor: "pointer" }}
                  onClick={() => handleViewCustomer(customer.login.uuid)}
                >
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar
                        src={customer.picture.thumbnail}
                        alt={`${customer.name.first} ${customer.name.last}`}
                        sx={{ width: 40, height: 40 }}
                      />
                      <Box>
                        <Typography variant="subtitle2" component="div">
                          {customer.name.title} {customer.name.first} {customer.name.last}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          @{customer.login.username}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Email fontSize="small" color="action" />
                        <Typography variant="body2">{customer.email}</Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Phone fontSize="small" color="action" />
                        <Typography variant="body2">{customer.phone}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {customer.location.city}, {customer.location.state}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {customer.location.country}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{customer.dob.age} years</Typography>
                  </TableCell>
                  <TableCell>
                    {getStatusChip(customer.registered.date)}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(customer.registered.date).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewCustomer(customer.login.uuid);
                      }}
                      aria-label="View customer details"
                    >
                      <Visibility />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={total}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Box>
  );
}
