import * as React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Grid,
  Card,
  CardContent,
  IconButton,
  Chip,
  Divider,
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  CircularProgress,
  Alert,
  Button,
  Stack,
} from "@mui/material";
import {
  ArrowBack,
  Phone,
  Email,
  LocationOn,
  CalendarToday,
  PhoneInTalk,
  VideoCall,
  Mail,
  Event,
  Person,
} from "@mui/icons-material";

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
  picture: {
    large: string;
    thumbnail: string;
  };
  registered: {
    date: string;
    age: number;
  };
  dob: {
    date: string;
    age: number;
  };
  nat: string;
}

interface Activity {
  id: string;
  type: "call" | "meeting" | "email" | "note";
  title: string;
  description: string;
  date: string;
  duration?: string;
  status: "completed" | "scheduled" | "cancelled";
}

const generateMockActivities = (customerId: string): Activity[] => [
  {
    id: `${customerId}-1`,
    type: "call",
    title: "Initial consultation call",
    description: "Discussed product requirements and pricing options. Customer showed strong interest in premium package.",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    duration: "45 minutes",
    status: "completed",
  },
  {
    id: `${customerId}-2`,
    type: "email",
    title: "Proposal sent",
    description: "Sent detailed proposal with custom pricing and implementation timeline.",
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: "completed",
  },
  {
    id: `${customerId}-3`,
    type: "meeting",
    title: "Demo session",
    description: "Product demonstration and Q&A session with the customer's technical team.",
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    duration: "60 minutes",
    status: "scheduled",
  },
  {
    id: `${customerId}-4`,
    type: "call",
    title: "Follow-up call",
    description: "Check in on proposal review and answer any additional questions.",
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    duration: "30 minutes",
    status: "scheduled",
  },
];

const getActivityIcon = (type: Activity["type"]) => {
  switch (type) {
    case "call":
      return <PhoneInTalk />;
    case "meeting":
      return <VideoCall />;
    case "email":
      return <Mail />;
    case "note":
      return <Event />;
    default:
      return <Event />;
  }
};

const getActivityColor = (status: Activity["status"]) => {
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

const getStatusChip = (registrationDate: string) => {
  const regDate = new Date(registrationDate);
  const now = new Date();
  const daysDiff = Math.floor((now.getTime() - regDate.getTime()) / (1000 * 3600 * 24));
  
  if (daysDiff < 30) {
    return <Chip label="New Customer" color="success" size="small" />;
  } else if (daysDiff < 365) {
    return <Chip label="Active Customer" color="primary" size="small" />;
  } else {
    return <Chip label="Veteran Customer" color="default" size="small" />;
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
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await fetch(
          `https://user-api.builder-io.workers.dev/api/users/${id}`
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: Customer = await response.json();
        setCustomer(data);
        setActivities(generateMockActivities(id));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch customer");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [id]);

  const handleBack = () => {
    navigate("/customers");
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !customer) {
    return (
      <Box sx={{ py: 4 }}>
        <Alert severity="error">
          {error || "Customer not found"}
        </Alert>
        <Button onClick={handleBack} sx={{ mt: 2 }}>
          Back to Customers
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <IconButton onClick={handleBack} sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" component="h1">
          Customer Details
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Customer Information */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 3 }}>
              <Avatar
                src={customer.picture.large}
                alt={`${customer.name.first} ${customer.name.last}`}
                sx={{ width: 120, height: 120, mb: 2 }}
              />
              <Typography variant="h5" component="h2" textAlign="center">
                {customer.name.title} {customer.name.first} {customer.name.last}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                @{customer.login.username}
              </Typography>
              {getStatusChip(customer.registered.date)}
            </Box>

            <Divider sx={{ my: 2 }} />

            <Stack spacing={2}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Email color="action" />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1">{customer.email}</Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Phone color="action" />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Phone
                  </Typography>
                  <Typography variant="body1">{customer.phone}</Typography>
                  {customer.cell && (
                    <Typography variant="body2" color="text.secondary">
                      Cell: {customer.cell}
                    </Typography>
                  )}
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <LocationOn color="action" />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Address
                  </Typography>
                  <Typography variant="body1">
                    {customer.location.street.number} {customer.location.street.name}
                  </Typography>
                  <Typography variant="body1">
                    {customer.location.city}, {customer.location.state} {customer.location.postcode}
                  </Typography>
                  <Typography variant="body1">{customer.location.country}</Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Person color="action" />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Age
                  </Typography>
                  <Typography variant="body1">{customer.dob.age} years old</Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CalendarToday color="action" />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Customer Since
                  </Typography>
                  <Typography variant="body1">
                    {new Date(customer.registered.date).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {customer.registered.age} years ago
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </Paper>
        </Grid>

        {/* Activities Timeline */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h3" sx={{ mb: 3 }}>
                Customer Activities
              </Typography>
              
              <Timeline sx={{ py: 0 }}>
                {activities.map((activity, index) => (
                  <TimelineItem key={activity.id}>
                    <TimelineSeparator>
                      <TimelineDot color={getActivityColor(activity.status)}>
                        {getActivityIcon(activity.type)}
                      </TimelineDot>
                      {index < activities.length - 1 && <TimelineConnector />}
                    </TimelineSeparator>
                    <TimelineContent sx={{ pb: 3 }}>
                      <Paper sx={{ p: 2, ml: 1 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                          <Typography variant="subtitle1" component="h4">
                            {activity.title}
                          </Typography>
                          <Chip
                            label={activity.status}
                            color={getActivityColor(activity.status)}
                            size="small"
                          />
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {new Date(activity.date).toLocaleDateString()} {new Date(activity.date).toLocaleTimeString()}
                          {activity.duration && ` • ${activity.duration}`}
                        </Typography>
                        
                        <Typography variant="body1">
                          {activity.description}
                        </Typography>
                      </Paper>
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </Timeline>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
