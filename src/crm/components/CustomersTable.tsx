import * as React from "react";
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
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import TablePagination from "@mui/material/TablePagination";
import CircularProgress from "@mui/material/CircularProgress";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";

// User interface
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
  users: User[];
  loading: boolean;
  total: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

// Format date
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString("en-US", options);
};

// Get initials for avatar
const getInitials = (firstName: string, lastName: string) => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

// Get gender color
const getGenderColor = (gender: string): "primary" | "secondary" => {
  return gender === "male" ? "primary" : "secondary";
};

export default function CustomersTable({
  users,
  loading,
  total,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}: CustomersTableProps) {
  return (
    <Card variant="outlined">
      <CardContent sx={{ pb: 0 }}>
        <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
          Customer List
        </Typography>
      </CardContent>

      <TableContainer>
        <Table aria-label="customers table">
          <TableHead>
            <TableRow>
              <TableCell>Customer</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Location</TableCell>
              <TableCell align="center">Gender</TableCell>
              <TableCell align="center">Age</TableCell>
              <TableCell>Registered</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  <CircularProgress size={32} />
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    No customers found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.login.uuid} hover>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar
                        src={user.picture.thumbnail}
                        sx={{ width: 40, height: 40 }}
                      >
                        {getInitials(user.name.first, user.name.last)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {user.name.title} {user.name.first} {user.name.last}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          @{user.login.username}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{user.email}</Typography>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">{user.phone}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Cell: {user.cell}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">
                        {user.location.city}, {user.location.state}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {user.location.country}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={user.gender}
                      size="small"
                      color={getGenderColor(user.gender)}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2">{user.dob.age}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(user.registered.date)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" aria-label="more options">
                      <MoreVertRoundedIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={total}
        page={page}
        onPageChange={onPageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onRowsPerPageChange}
        rowsPerPageOptions={[5, 10, 20, 50]}
        showFirstButton
        showLastButton
      />
    </Card>
  );
}
