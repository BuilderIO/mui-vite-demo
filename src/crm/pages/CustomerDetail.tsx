import * as React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid2";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import EventIcon from "@mui/icons-material/Event";
import PersonIcon from "@mui/icons-material/Person";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BusinessIcon from "@mui/icons-material/Business";
import { alpha, useTheme } from "@mui/material/styles";

interface CustomerActivity {
  id: string;
  type: "phone" | "email" | "meeting";
  title: string;
  description: string;
  date: string;
  status?: "completed" | "scheduled" | "cancelled";
}

interface CustomerData {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  company: string;
  status: "Active" | "Inactive";
  value: number;
  joinDate: string;
  lastContact: string;
}

// Sample customer data - this will be replaced with API data
const sampleCustomer: CustomerData = {
  id: "1",
  name: "John Anderson",
  email: "john.anderson@company.com",
  phone: "(555) 123-4567",
  city: "New York",
  country: "USA",
  company: "Anderson Enterprises",
  status: "Active",
  value: 45000,
  joinDate: "2023-06-15",
  lastContact: "2024-01-15",
};

// Sample activities data
const sampleActivities: CustomerActivity[] = [
  {
    id: "1",
    type: "phone",
    title: "Follow-up Call",
    description: "Discussed Q1 requirements and budget allocation",
    date: "2024-01-15",
    status: "completed",
  },
  {
    id: "2",
    type: "email",
    title: "Proposal Sent",
    description: "Sent detailed proposal for new service package",
    date: "2024-01-12",
    status: "completed",
  },
  {
    id: "3",
    type: "meeting",
    title: "Strategy Meeting",
    description: "Quarterly review and planning session",
    date: "2024-01-20",
    status: "scheduled",
  },
  {
    id: "4",
    type: "phone",
    title: "Initial Consultation",
    description: "Discovery call to understand customer needs",
    date: "2024-01-08",
    status: "completed",
  },
  {
    id: "5",
    type: "email",
    title: "Contract Updates",
    description: "Shared revised contract terms",
    date: "2024-01-05",
    status: "completed",
  },
];

function getActivityIcon(type: string) {
  switch (type) {
    case "phone":
      return <PhoneIcon />;
    case "email":
      return <EmailIcon />;
    case "meeting":
      return <EventIcon />;
    default:
      return <BusinessIcon />;
  }
}

function getActivityColor(type: string) {
  switch (type) {
    case "phone":
      return "primary";
    case "email":
      return "secondary";
    case "meeting":
      return "warning";
    default:
      return "default";
  }
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function CustomerDetail() {
  const { customerId } = useParams<{ customerId: string }>();
  const navigate = useNavigate();
  const theme = useTheme();

  const [customer, setCustomer] = React.useState<CustomerData | null>(null);
  const [activities] = React.useState<CustomerActivity[]>(sampleActivities);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchCustomer = async () => {
      if (!customerId) return;

      try {
        setLoading(true);
        const response = await fetch(`https://user-api.builder-io.workers.dev/api/users/${customerId}`);

        if (!response.ok) {
          throw new Error('Customer not found');
        }

        const apiUser = await response.json();

        // Transform API user to customer format
        const transformedCustomer: CustomerData = {
          id: apiUser.login.uuid,
          name: `${apiUser.name.first} ${apiUser.name.last}`,
          email: apiUser.email,
          phone: apiUser.phone || apiUser.cell,
          city: apiUser.location.city,
          country: apiUser.location.country,
          company: `${apiUser.name.last} Corp`, // Demo company name
          status: "Active",
          value: Math.floor(Math.random() * 100000) + 10000,
          joinDate: apiUser.registered.date,
          lastContact: new Date().toISOString().split('T')[0],
        };

        setCustomer(transformedCustomer);
      } catch (err) {
        console.error('Error fetching customer:', err);
        setError('Failed to load customer details');
        // Fallback to sample data
        setCustomer(sampleCustomer);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [customerId]);

  const handleBackClick = () => {
    navigate("/customers");
  };

  const customerInitials = customer.name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .substring(0, 2);

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
        <Button
          onClick={handleBackClick}
          startIcon={<ArrowBackIcon />}
          variant="outlined"
          size="small"
        >
          Back to Customers
        </Button>
        <Typography variant="h4" component="h1">
          Customer Details
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Customer Information Card */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    fontSize: "1.5rem",
                    bgcolor: "primary.main",
                    mr: 2,
                  }}
                >
                  {customerInitials}
                </Avatar>
                <Box>
                  <Typography variant="h6" component="h2">
                    {customer.name}
                  </Typography>
                  <Chip
                    label={customer.status}
                    color={customer.status === "Active" ? "success" : "default"}
                    size="small"
                  />
                </Box>
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <EmailIcon fontSize="small" color="action" />
                  <Typography variant="body2">{customer.email}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <PhoneIcon fontSize="small" color="action" />
                  <Typography variant="body2">{customer.phone}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <LocationOnIcon fontSize="small" color="action" />
                  <Typography variant="body2">
                    {customer.city}, {customer.country}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <BusinessIcon fontSize="small" color="action" />
                  <Typography variant="body2">{customer.company}</Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Customer Value
                  </Typography>
                  <Typography variant="h6" color="primary">
                    {formatCurrency(customer.value)}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Join Date
                  </Typography>
                  <Typography variant="body2">
                    {formatDate(customer.joinDate)}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Last Contact
                  </Typography>
                  <Typography variant="body2">
                    {formatDate(customer.lastContact)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Activities Timeline */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h3" sx={{ mb: 3 }}>
                Customer Activities
              </Typography>
              <List>
                {activities.map((activity, index) => (
                  <React.Fragment key={activity.id}>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            bgcolor: alpha(theme.palette[getActivityColor(activity.type) as keyof typeof theme.palette].main as string, 0.1),
                            color: theme.palette[getActivityColor(activity.type) as keyof typeof theme.palette].main,
                          }}
                        >
                          {getActivityIcon(activity.type)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              mb: 1,
                            }}
                          >
                            <Typography variant="subtitle1" component="span">
                              {activity.title}
                            </Typography>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              {activity.status && (
                                <Chip
                                  label={activity.status}
                                  size="small"
                                  color={
                                    activity.status === "completed"
                                      ? "success"
                                      : activity.status === "scheduled"
                                      ? "primary"
                                      : "default"
                                  }
                                />
                              )}
                              <Typography variant="caption" color="text.secondary">
                                {formatDate(activity.date)}
                              </Typography>
                            </Box>
                          </Box>
                        }
                        secondary={
                          <Typography variant="body2" color="text.secondary">
                            {activity.description}
                          </Typography>
                        }
                      />
                    </ListItem>
                    {index < activities.length - 1 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
