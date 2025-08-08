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
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { sampleCustomers, getStatusColor, type Customer } from "../data/customerData";

export default function Customers() {
  const navigate = useNavigate();

  const handleCustomerClick = (customerId: string) => {
    navigate(`/customers/${customerId}`);
  };

  const handleEmailClick = (email: string, event: React.MouseEvent) => {
    event.stopPropagation();
    window.open(`mailto:${email}`);
  };

  const handlePhoneClick = (phone: string, event: React.MouseEvent) => {
    event.stopPropagation();
    window.open(`tel:${phone}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
        Customer Management
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 3, color: "text.secondary" }}>
        Manage your customer relationships and track engagement history
      </Typography>

      <Paper elevation={2} sx={{ mb: 4, overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: { xs: 400, md: 600 } }}>
          <Table stickyHeader aria-label="customer table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, minWidth: 200 }}>Customer</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 150, display: { xs: 'none', sm: 'table-cell' } }}>Company</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 250, display: { xs: 'none', md: 'table-cell' } }}>Contact Information</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 120, display: { xs: 'none', sm: 'table-cell' } }}>Last Contact</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 100 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 80 }} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sampleCustomers.map((customer: Customer) => (
                <TableRow
                  key={customer.id}
                  hover
                  onClick={() => handleCustomerClick(customer.id)}
                  sx={{ 
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "action.hover"
                    }
                  }}
                >
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar
                        sx={{ 
                          bgcolor: "primary.main",
                          width: 40,
                          height: 40
                        }}
                      >
                        {customer.name.split(' ').map(n => n[0]).join('')}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {customer.name}
                        </Typography>
                        {customer.title && (
                          <Typography variant="caption" color="text.secondary">
                            {customer.title}
                          </Typography>
                        )}
                      </Box>
                    </Stack>
                  </TableCell>
                  
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {customer.company}
                    </Typography>
                  </TableCell>
                  
                  <TableCell>
                    <Stack spacing={1}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <EmailIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                        <Typography 
                          variant="body2" 
                          component="a"
                          href={`mailto:${customer.email}`}
                          onClick={(e) => handleEmailClick(customer.email, e)}
                          sx={{ 
                            textDecoration: "none",
                            color: "primary.main",
                            "&:hover": {
                              textDecoration: "underline"
                            }
                          }}
                        >
                          {customer.email}
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <PhoneIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                        <Typography 
                          variant="body2"
                          component="a"
                          href={`tel:${customer.phone}`}
                          onClick={(e) => handlePhoneClick(customer.phone, e)}
                          sx={{ 
                            textDecoration: "none",
                            color: "primary.main",
                            "&:hover": {
                              textDecoration: "underline"
                            }
                          }}
                        >
                          {customer.phone}
                        </Typography>
                      </Stack>
                    </Stack>
                  </TableCell>
                  
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(customer.lastContactDate)}
                    </Typography>
                  </TableCell>
                  
                  <TableCell>
                    <Chip
                      label={customer.status}
                      color={getStatusColor(customer.status) as any}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  
                  <TableCell align="center">
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCustomerClick(customer.id);
                        }}
                        sx={{ color: "primary.main" }}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Box sx={{ mt: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Showing {sampleCustomers.length} customers
        </Typography>
      </Box>
    </Box>
  );
}
