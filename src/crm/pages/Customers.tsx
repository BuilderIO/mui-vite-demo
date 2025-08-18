import * as React from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import TablePagination from "@mui/material/TablePagination";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

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
  gender: string;
  location: {
    city: string;
    state: string;
    country: string;
  };
  email: string;
  dob: {
    age: number;
  };
  registered: {
    date: string;
  };
  phone: string;
  picture: {
    thumbnail: string;
  };
}

interface UsersResponse {
  page: number;
  perPage: number;
  total: number;
  data: User[];
}

const getCustomerStatus = (registrationDate: string) => {
  const regDate = new Date(registrationDate);
  const now = new Date();
  const daysDiff = Math.floor((now.getTime() - regDate.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysDiff <= 30) return { label: "New", color: "success" as const };
  if (daysDiff <= 365) return { label: "Active", color: "primary" as const };
  return { label: "Established", color: "default" as const };
};

export default function Customers() {
  const navigate = useNavigate();
  const [customers, setCustomers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [totalCustomers, setTotalCustomers] = React.useState(0);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [searchInput, setSearchInput] = React.useState("");

  const fetchCustomers = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        page: (page + 1).toString(),
        perPage: rowsPerPage.toString(),
        sortBy: "name.first",
      });
      
      if (searchTerm) {
        params.append("search", searchTerm);
      }

      const response = await fetch(
        `https://user-api.builder-io.workers.dev/api/users?${params}`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch customers: ${response.statusText}`);
      }
      
      const data: UsersResponse = await response.json();
      setCustomers(data.data);
      setTotalCustomers(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch customers");
      setCustomers([]);
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

  const handleSearch = () => {
    setSearchTerm(searchInput);
    setPage(0);
  };

  const handleSearchKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleCustomerClick = (customerId: string) => {
    navigate(`/customers/${customerId}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (error) {
    return (
      <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={fetchCustomers}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1">
          Customers
        </Typography>
        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          onClick={() => navigate("/customers/new")}
        >
          Add Customer
        </Button>
      </Stack>

      <Card variant="outlined" sx={{ mb: 2 }}>
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              size="small"
              placeholder="Search customers by name, email, or city..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={handleSearchKeyPress}
              sx={{ flexGrow: 1 }}
            />
            <IconButton onClick={handleSearch} color="primary">
              <SearchIcon />
            </IconButton>
          </Stack>
        </CardContent>
      </Card>

      <Card variant="outlined">
        <TableContainer>
          <Table aria-label="customers table">
            <TableHead>
              <TableRow>
                <TableCell>Customer</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Age</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Registered</TableCell>
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
                customers.map((customer) => {
                  const status = getCustomerStatus(customer.registered.date);
                  return (
                    <TableRow
                      key={customer.login.uuid}
                      hover
                      sx={{ cursor: "pointer" }}
                      onClick={() => handleCustomerClick(customer.login.uuid)}
                    >
                      <TableCell>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar
                            src={customer.picture.thumbnail}
                            alt={`${customer.name.first} ${customer.name.last}`}
                            sx={{ width: 40, height: 40 }}
                          >
                            {customer.name.first[0]}{customer.name.last[0]}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={500}>
                              {customer.name.title} {customer.name.first} {customer.name.last}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              @{customer.login.username}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{customer.email}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {customer.location.city}, {customer.location.state}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {customer.location.country}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{customer.dob.age}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{customer.phone}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={status.label}
                          size="small"
                          color={status.color}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(customer.registered.date)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={totalCustomers}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Box>
  );
}
