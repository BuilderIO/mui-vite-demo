import * as React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import EventIcon from "@mui/icons-material/Event";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CakeIcon from "@mui/icons-material/Cake";
import PersonIcon from "@mui/icons-material/Person";

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
  };
  phone: string;
  cell: string;
  picture: {
    large: string;
    medium: string;
    thumbnail: string;
  };
}

interface Activity {
  id: string;
  type: "call" | "email" | "meeting";
  title: string;
  description: string;
  date: string;
  duration?: string;
  outcome?: string;
}

const mockActivities: Activity[] = [
  {
    id: "1",
    type: "call",
    title: "Follow-up Call",
    description: "Discussed project requirements and timeline. Customer showed interest in our premium package.",
    date: "2024-01-15T10:30:00Z",
    duration: "25 min",
    outcome: "Positive"
  },
  {
    id: "2",
    type: "email",
    title: "Proposal Sent",
    description: "Sent detailed proposal including pricing and project scope.",
    date: "2024-01-12T14:15:00Z",
    outcome: "Delivered"
  },
  {
    id: "3",
    type: "meeting",
    title: "Initial Consultation",
    description: "First meeting to understand customer needs and present our services.",
    date: "2024-01-10T16:00:00Z",
    duration: "1 hour",
    outcome: "Scheduled follow-up"
  },
  {
    id: "4",
    type: "call",
    title: "Cold Call",
    description: "Initial contact to introduce our company and services.",
    date: "2024-01-08T09:45:00Z",
    duration: "10 min",
    outcome: "Meeting scheduled"
  },
  {
    id: "5",
    type: "email",
    title: "Welcome Email",
    description: "Sent welcome email with company information and contact details.",
    date: "2024-01-08T09:50:00Z",
    outcome: "Delivered"
  }
];

const getActivityIcon = (type: string) => {
  switch (type) {
    case "call":
      return <PhoneIcon />;
    case "email":
      return <EmailIcon />;
    case "meeting":
      return <EventIcon />;
    default:
      return <PersonIcon />;
  }
};

const getActivityColor = (type: string) => {
  switch (type) {
    case "call":
      return "primary";
    case "email":
      return "secondary";
    case "meeting":
      return "success";
    default:
      return "default";
  }
};

export default function CustomerDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [customer, setCustomer] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchCustomer = async () => {
      if (!id) {
        setError("Customer ID is required");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://user-api.builder-io.workers.dev/api/users/${id}`
        );

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Customer not found");
          }
          throw new Error(`Failed to fetch customer: ${response.statusText}`);
        }

        const data: User = await response.json();
        setCustomer(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch customer");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "400px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={() => navigate("/customers")}>
          Back to Customers
        </Button>
      </Box>
    );
  }

  if (!customer) {
    return (
      <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Customer not found
        </Alert>
        <Button variant="contained" onClick={() => navigate("/customers")}>
          Back to Customers
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <IconButton onClick={() => navigate("/customers")}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
          Customer Details
        </Typography>
        <Button variant="outlined" startIcon={<EditIcon />}>
          Edit Customer
        </Button>
      </Stack>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card variant="outlined">
            <CardContent>
              <Stack spacing={3} alignItems="center">
                <Avatar
                  src={customer.picture.large}
                  alt={`${customer.name.first} ${customer.name.last}`}
                  sx={{ width: 120, height: 120 }}
                >
                  {customer.name.first[0]}{customer.name.last[0]}
                </Avatar>
                
                <Box textAlign="center">
                  <Typography variant="h5" component="h2">
                    {customer.name.title} {customer.name.first} {customer.name.last}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    @{customer.login.username}
                  </Typography>
                </Box>

                <Stack spacing={2} sx={{ width: "100%" }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <EmailIcon color="action" />
                    <Box>
                      <Typography variant="body2" fontWeight={500}>
                        Email
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {customer.email}
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" spacing={2} alignItems="center">
                    <PhoneIcon color="action" />
                    <Box>
                      <Typography variant="body2" fontWeight={500}>
                        Phone
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {customer.phone}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Cell: {customer.cell}
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" spacing={2} alignItems="center">
                    <LocationOnIcon color="action" />
                    <Box>
                      <Typography variant="body2" fontWeight={500}>
                        Address
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {customer.location.street.number} {customer.location.street.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {customer.location.city}, {customer.location.state} {customer.location.postcode}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {customer.location.country}
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" spacing={2} alignItems="center">
                    <CakeIcon color="action" />
                    <Box>
                      <Typography variant="body2" fontWeight={500}>
                        Age
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {customer.dob.age} years old
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Born: {formatDate(customer.dob.date)}
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" spacing={2} alignItems="center">
                    <PersonIcon color="action" />
                    <Box>
                      <Typography variant="body2" fontWeight={500}>
                        Customer Since
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(customer.registered.date)}
                      </Typography>
                    </Box>
                  </Stack>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" component="h3" sx={{ mb: 3 }}>
                Customer Activities
              </Typography>
              
              <Timeline>
                {mockActivities.map((activity, index) => (
                  <TimelineItem key={activity.id}>
                    <TimelineSeparator>
                      <TimelineDot color={getActivityColor(activity.type) as any}>
                        {getActivityIcon(activity.type)}
                      </TimelineDot>
                      {index < mockActivities.length - 1 && <TimelineConnector />}
                    </TimelineSeparator>
                    <TimelineContent>
                      <Card variant="outlined" sx={{ mb: 2 }}>
                        <CardContent sx={{ pb: 2 }}>
                          <Stack direction="row" justifyContent="space-between" alignItems="start" sx={{ mb: 1 }}>
                            <Typography variant="subtitle2" component="h4">
                              {activity.title}
                            </Typography>
                            <Chip
                              label={activity.type}
                              size="small"
                              color={getActivityColor(activity.type) as any}
                              variant="outlined"
                            />
                          </Stack>
                          
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {activity.description}
                          </Typography>
                          
                          <Stack direction="row" spacing={2} alignItems="center">
                            <Typography variant="caption" color="text.secondary">
                              {formatDateTime(activity.date)}
                            </Typography>
                            {activity.duration && (
                              <Chip label={activity.duration} size="small" variant="outlined" />
                            )}
                            {activity.outcome && (
                              <Chip
                                label={activity.outcome}
                                size="small"
                                color={activity.outcome.toLowerCase().includes("positive") || activity.outcome.toLowerCase().includes("delivered") ? "success" : "default"}
                                variant="outlined"
                              />
                            )}
                          </Stack>
                        </CardContent>
                      </Card>
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </Timeline>

              <Box sx={{ mt: 3, textAlign: "center" }}>
                <Button variant="outlined" onClick={() => {}}>
                  Load More Activities
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
