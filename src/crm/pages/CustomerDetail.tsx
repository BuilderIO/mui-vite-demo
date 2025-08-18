import * as React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid2";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CustomerActivities from "../components/CustomerActivities";

interface UserData {
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
  cell: string;
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
  dob: {
    date: string;
    age: number;
  };
  registered: {
    date: string;
    age: number;
  };
  picture: {
    large: string;
    medium: string;
    thumbnail: string;
  };
  nat: string;
}

export default function CustomerDetail() {
  const { customerId } = useParams<{ customerId: string }>();
  const navigate = useNavigate();
  const [customer, setCustomer] = React.useState<UserData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchCustomer = async () => {
      if (!customerId) return;
      
      try {
        setLoading(true);
        const response = await fetch(
          `https://user-api.builder-io.workers.dev/api/users/${customerId}`
        );
        
        if (!response.ok) {
          throw new Error("Customer not found");
        }
        
        const data = await response.json();
        setCustomer(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [customerId]);

  const handleBack = () => {
    navigate("/customers");
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !customer) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          {error || "Customer not found"}
        </Alert>
        <Button onClick={handleBack} sx={{ mt: 2 }}>
          Back to Customers
        </Button>
      </Box>
    );
  }

  const customerStatus = Math.random() > 0.3 ? "Active" : "Inactive";
  const fullName = `${customer.name.first} ${customer.name.last}`;
  const fullAddress = `${customer.location.street.number} ${customer.location.street.name}, ${customer.location.city}, ${customer.location.state} ${customer.location.postcode}`;

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <IconButton onClick={handleBack} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          Customer Details
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Customer Information */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Avatar
                src={customer.picture.large}
                alt={fullName}
                sx={{ width: 80, height: 80, mr: 3 }}
              >
                {customer.name.first.charAt(0)}{customer.name.last.charAt(0)}
              </Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h5" component="h2" sx={{ mb: 1 }}>
                  {customer.name.title} {fullName}
                </Typography>
                <Chip 
                  label={customerStatus} 
                  color={customerStatus === "Active" ? "success" : "default"} 
                  size="small"
                  sx={{ mb: 1 }}
                />
                <Typography variant="body2" color="text.secondary">
                  Customer since {new Date(customer.registered.date).toLocaleDateString()}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <EmailIcon sx={{ mr: 2, color: "text.secondary" }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="body1">{customer.email}</Typography>
                  </Box>
                </Box>
              </Grid>
              
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <PhoneIcon sx={{ mr: 2, color: "text.secondary" }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Phone
                    </Typography>
                    <Typography variant="body1">{customer.phone}</Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                  <LocationOnIcon sx={{ mr: 2, color: "text.secondary", mt: 0.5 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Address
                    </Typography>
                    <Typography variant="body1">{fullAddress}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {customer.location.country}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Date of Birth
                  </Typography>
                  <Typography variant="body1">
                    {new Date(customer.dob.date).toLocaleDateString()} ({customer.dob.age} years old)
                  </Typography>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Cell Phone
                  </Typography>
                  <Typography variant="body1">{customer.cell}</Typography>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Username
                  </Typography>
                  <Typography variant="body1">{customer.login.username}</Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Quick Actions */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" component="h3" sx={{ mb: 2 }}>
              Quick Actions
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Button variant="outlined" startIcon={<EmailIcon />} fullWidth>
                Send Email
              </Button>
              <Button variant="outlined" startIcon={<PhoneIcon />} fullWidth>
                Call Customer
              </Button>
              <Button variant="outlined" fullWidth>
                Schedule Meeting
              </Button>
              <Button variant="outlined" fullWidth>
                Create Task
              </Button>
            </Box>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" component="h3" sx={{ mb: 2 }}>
              Customer Stats
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Total Orders
                </Typography>
                <Typography variant="h6">
                  {Math.floor(Math.random() * 50) + 1}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Total Value
                </Typography>
                <Typography variant="h6">
                  ${(Math.random() * 10000 + 1000).toFixed(2)}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Last Activity
                </Typography>
                <Typography variant="body1">
                  {Math.floor(Math.random() * 30) + 1} days ago
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Customer Activities */}
        <Grid size={{ xs: 12 }}>
          <CustomerActivities customerId={customerId!} customerName={fullName} />
        </Grid>
      </Grid>
    </Box>
  );
}
