import * as React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import EventIcon from "@mui/icons-material/Event";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CakeIcon from "@mui/icons-material/Cake";
import PersonIcon from "@mui/icons-material/Person";

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
  picture: {
    large: string;
    medium: string;
    thumbnail: string;
  };
  registered: {
    date: string;
    age: number;
  };
  gender: string;
  nat: string;
}

interface Activity {
  id: string;
  type: "phone" | "email" | "meeting";
  title: string;
  description: string;
  date: string;
  status: "completed" | "scheduled" | "cancelled";
}

// Mock activities data - in a real app this would come from an API
const generateMockActivities = (customerId: string): Activity[] => {
  const activities: Activity[] = [
    {
      id: "1",
      type: "phone",
      title: "Initial Sales Call",
      description: "Discussed product requirements and pricing options",
      date: "2024-01-15T10:30:00Z",
      status: "completed",
    },
    {
      id: "2",
      type: "email",
      title: "Product Information Sent",
      description: "Sent detailed product brochure and pricing information",
      date: "2024-01-16T14:20:00Z",
      status: "completed",
    },
    {
      id: "3",
      type: "meeting",
      title: "Product Demo Meeting",
      description: "Scheduled product demonstration and Q&A session",
      date: "2024-01-20T15:00:00Z",
      status: "scheduled",
    },
    {
      id: "4",
      type: "phone",
      title: "Follow-up Call",
      description: "Follow-up call to discuss demo feedback",
      date: "2024-01-22T11:00:00Z",
      status: "scheduled",
    },
  ];
  
  return activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

const getActivityIcon = (type: Activity["type"]) => {
  switch (type) {
    case "phone":
      return <PhoneIcon />;
    case "email":
      return <EmailIcon />;
    case "meeting":
      return <EventIcon />;
    default:
      return <EventIcon />;
  }
};

const getStatusColor = (status: Activity["status"]) => {
  switch (status) {
    case "completed":
      return "success";
    case "scheduled":
      return "primary";
    case "cancelled":
      return "error";
    default:
      return "default";
  }
};

export default function CustomerDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [customer, setCustomer] = React.useState<Customer | null>(null);
  const [activities, setActivities] = React.useState<Activity[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchCustomer = async () => {
      if (!id) {
        setError("Customer ID not provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`https://user-api.builder-io.workers.dev/api/users/${id}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch customer: ${response.statusText}`);
        }
        
        const customerData = await response.json();
        setCustomer(customerData);
        
        // Generate mock activities
        const mockActivities = generateMockActivities(id);
        setActivities(mockActivities);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch customer");
        console.error("Error fetching customer:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [id]);

  const handleBackClick = () => {
    navigate("/customers");
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 400,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !customer) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 400,
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography variant="h6" color="error">
          {error || "Customer not found"}
        </Typography>
        <Button onClick={handleBackClick} startIcon={<ArrowBackIcon />}>
          Back to Customers
        </Button>
      </Box>
    );
  }

  const fullName = `${customer.name.title} ${customer.name.first} ${customer.name.last}`;
  const fullAddress = `${customer.location.street.number} ${customer.location.street.name}, ${customer.location.city}, ${customer.location.state}, ${customer.location.country} ${customer.location.postcode}`;

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Button
        onClick={handleBackClick}
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 2 }}
      >
        Back to Customers
      </Button>

      <Grid container spacing={3}>
        {/* Customer Information */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Avatar
                src={customer.picture.large}
                alt={fullName}
                sx={{ width: 80, height: 80, mr: 2 }}
              >
                {customer.name.first[0]}{customer.name.last[0]}
              </Avatar>
              <Box>
                <Typography variant="h4" component="h1">
                  {fullName}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  @{customer.login.username}
                </Typography>
                <Chip
                  label={customer.dob.age > 30 ? "Active" : "Inactive"}
                  color={customer.dob.age > 30 ? "success" : "default"}
                  size="small"
                  sx={{ mt: 1 }}
                />
              </Box>
            </Box>

            <Divider sx={{ mb: 2 }} />

            <List>
              <ListItem disablePadding sx={{ mb: 1 }}>
                <ListItemIcon>
                  <EmailIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Email"
                  secondary={customer.email}
                />
              </ListItem>
              
              <ListItem disablePadding sx={{ mb: 1 }}>
                <ListItemIcon>
                  <PhoneIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Phone"
                  secondary={`${customer.phone} • ${customer.cell}`}
                />
              </ListItem>
              
              <ListItem disablePadding sx={{ mb: 1 }}>
                <ListItemIcon>
                  <LocationOnIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Address"
                  secondary={fullAddress}
                />
              </ListItem>
              
              <ListItem disablePadding sx={{ mb: 1 }}>
                <ListItemIcon>
                  <CakeIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Date of Birth"
                  secondary={`${new Date(customer.dob.date).toLocaleDateString()} (Age: ${customer.dob.age})`}
                />
              </ListItem>
              
              <ListItem disablePadding sx={{ mb: 1 }}>
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Registered"
                  secondary={`${new Date(customer.registered.date).toLocaleDateString()} (${customer.registered.age} years ago)`}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Customer Activities */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" component="h2" sx={{ mb: 3 }}>
              Recent Activities
            </Typography>
            
            {activities.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No activities found for this customer.
              </Typography>
            ) : (
              <List>
                {activities.map((activity, index) => (
                  <React.Fragment key={activity.id}>
                    <ListItem alignItems="flex-start" disablePadding>
                      <ListItemIcon sx={{ mt: 1 }}>
                        {getActivityIcon(activity.type)}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Typography variant="subtitle1">
                              {activity.title}
                            </Typography>
                            <Chip
                              label={activity.status}
                              color={getStatusColor(activity.status) as any}
                              size="small"
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                              {activity.description}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(activity.date).toLocaleDateString()} at {new Date(activity.date).toLocaleTimeString()}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < activities.length - 1 && <Divider sx={{ my: 2 }} />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
