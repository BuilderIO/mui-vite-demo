import * as React from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Chip from "@mui/material/Chip";
import { mockCustomers, Customer } from "../data/customerData";

const getStatusColor = (status: Customer['status']) => {
  switch (status) {
    case 'active':
      return 'success';
    case 'inactive':
      return 'default';
    case 'prospect':
      return 'warning';
    case 'lead':
      return 'info';
    default:
      return 'default';
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export default function Customers() {
  const navigate = useNavigate();

  const handleCustomerClick = (customerId: string) => {
    navigate(`/customers/${customerId}`);
  };

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
        Customer Management
      </Typography>
      
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: { xs: 'calc(100vh - 200px)', md: 'none' } }}>
          <Table stickyHeader aria-label="customers table" size={{ xs: 'small', md: 'medium' }}>
            <TableHead>
              <TableRow>
                <TableCell>Customer Name</TableCell>
                <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Company</TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>Email</TableCell>
                <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>Phone</TableCell>
                <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Last Contact</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockCustomers.map((customer) => (
                <TableRow
                  key={customer.id}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                  onClick={() => handleCustomerClick(customer.id)}
                >
                  <TableCell component="th" scope="row">
                    <Typography variant="body2" fontWeight={500}>
                      {customer.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: { sm: 'none' } }}>
                      {customer.company}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>{customer.company}</TableCell>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{customer.email}</TableCell>
                  <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>{customer.phone}</TableCell>
                  <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>{formatDate(customer.lastContactDate)}</TableCell>
                  <TableCell>
                    <Chip
                      label={customer.status}
                      color={getStatusColor(customer.status)}
                      size="small"
                      sx={{ textTransform: 'capitalize' }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
