import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import Stack from "@mui/material/Stack";
import CrmCustomersTable from "../components/CrmCustomersTable";
import CustomerDetail from "../components/CustomerDetail";

// Customer interface based on User API
interface Customer {
  id: string;
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
    street: {
      number: number;
      name: string;
    };
    city: string;
    state: string;
    country: string;
    postcode: string;
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

export default function Customers() {
  const navigate = useNavigate();
  const { customerId } = useParams();
  const [selectedCustomer, setSelectedCustomer] = React.useState<Customer | null>(null);

  const handleCustomerClick = (customer: Customer) => {
    setSelectedCustomer(customer);
    navigate(`/customers/${customer.id}`);
  };

  const handleBackToList = () => {
    setSelectedCustomer(null);
    navigate("/customers");
  };

  // If we have a customerId in URL, we're viewing a specific customer
  const isViewingDetail = Boolean(customerId);

  if (isViewingDetail && selectedCustomer) {
    return (
      <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 3 }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <IconButton onClick={handleBackToList} sx={{ mr: 1 }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" component="h1">
              Customer Details
            </Typography>
          </Stack>
        </Stack>
        <CustomerDetail customer={selectedCustomer} />
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3, display: { xs: "none", sm: "flex" } }}
      >
        <Typography variant="h4" component="h1">
          Customers
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddRoundedIcon />}
          onClick={() => {
            // Could open a modal to add new customer
            console.log("Add new customer clicked");
          }}
        >
          Add Customer
        </Button>
      </Stack>

      <Typography 
        variant="body1" 
        color="text.secondary" 
        sx={{ mb: 3 }}
      >
        Manage your customer relationships and track their activities. Click on any customer to view detailed information and activity history.
      </Typography>

      <CrmCustomersTable onCustomerClick={handleCustomerClick} />
    </Box>
  );
}
