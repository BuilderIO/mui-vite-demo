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
import { customersData, Customer } from "../data/customersData";

const getStatusColor = (status: Customer['status']) => {
  switch (status) {
    case 'active':
      return 'success';
    case 'prospect':
      return 'primary';
    case 'inactive':
      return 'default';
    case 'closed':
      return 'error';
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

  const handleRowClick = (customerId: string) => {
    navigate(`/customers/${customerId}`);
  };

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        Customer Management
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
        View and manage your customer relationships. Click on any customer to see detailed activity history.
      </Typography>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="customer table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Customer Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Company Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Contact Information</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Last Contact</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Account Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customersData.map((customer) => (
                <TableRow
                  key={customer.id}
                  onClick={() => handleRowClick(customer.id)}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                    '&:last-child td, &:last-child th': { border: 0 },
                  }}
                >
                  <TableCell component="th" scope="row">
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {customer.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {customer.company}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" sx={{ mb: 0.5 }}>
                        {customer.email}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {customer.phone}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(customer.lastContact)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                      color={getStatusColor(customer.status)}
                      size="small"
                      variant="filled"
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
