import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CakeIcon from "@mui/icons-material/Cake";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CallIcon from "@mui/icons-material/Call";
import MailIcon from "@mui/icons-material/Mail";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import PhoneInTalkIcon from "@mui/icons-material/PhoneInTalk";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import EventIcon from "@mui/icons-material/Event";

// Customer interface
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

// Activity types
interface Activity {
  id: string;
  type: "phone_call" | "email" | "meeting" | "video_call";
  title: string;
  description: string;
  date: string;
  duration?: string;
  status: "completed" | "scheduled" | "cancelled";
}

interface CustomerDetailProps {
  customer: Customer;
}

// Sample activities data - in a real app this would come from an API
const generateSampleActivities = (customerId: string): Activity[] => {
  const activities: Activity[] = [
    {
      id: "1",
      type: "phone_call",
      title: "Initial consultation call",
      description: "Discussed product requirements and pricing options. Customer showed strong interest in enterprise package.",
      date: "2024-01-15T10:30:00Z",
      duration: "45 minutes",
      status: "completed",
    },
    {
      id: "2",
      type: "email",
      title: "Proposal sent",
      description: "Sent detailed proposal with pricing breakdown and implementation timeline.",
      date: "2024-01-16T14:00:00Z",
      status: "completed",
    },
    {
      id: "3",
      type: "meeting",
      title: "Demo meeting",
      description: "Product demonstration scheduled with the customer's technical team.",
      date: "2024-01-20T09:00:00Z",
      duration: "1 hour",
      status: "scheduled",
    },
    {
      id: "4",
      type: "email",
      title: "Follow-up email",
      description: "Answered technical questions raised during the demo session.",
      date: "2024-01-14T16:30:00Z",
      status: "completed",
    },
    {
      id: "5",
      type: "video_call",
      title: "Contract negotiation",
      description: "Discussed contract terms and conditions. Reached agreement on most points.",
      date: "2024-01-12T11:00:00Z",
      duration: "30 minutes",
      status: "completed",
    },
    {
      id: "6",
      type: "phone_call",
      title: "Check-in call",
      description: "Regular monthly check-in to discuss service satisfaction and any issues.",
      date: "2024-01-10T15:00:00Z",
      duration: "20 minutes",
      status: "completed",
    },
  ];

  // Sort by date (newest first)
  return activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Activity type configurations
const activityConfig = {
  phone_call: {
    icon: PhoneInTalkIcon,
    color: "#1976d2",
    label: "Phone Call",
  },
  email: {
    icon: MailIcon,
    color: "#388e3c",
    label: "Email",
  },
  meeting: {
    icon: MeetingRoomIcon,
    color: "#f57c00",
    label: "Meeting",
  },
  video_call: {
    icon: VideoCallIcon,
    color: "#7b1fa2",
    label: "Video Call",
  },
};

// Format date and time
const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  const dateOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
  };
  
  return {
    date: date.toLocaleDateString("en-US", dateOptions),
    time: date.toLocaleTimeString("en-US", timeOptions),
  };
};

// Get status color
const getStatusColor = (status: string): "success" | "info" | "default" => {
  switch (status) {
    case "completed":
      return "success";
    case "scheduled":
      return "info";
    default:
      return "default";
  }
};

export default function CustomerDetail({ customer }: CustomerDetailProps) {
  const activities = generateSampleActivities(customer.id);
  
  const fullName = `${customer.name.first} ${customer.name.last}`;
  const address = `${customer.location.street.number} ${customer.location.street.name}, ${customer.location.city}, ${customer.location.state} ${customer.location.postcode}`;

  return (
    <Grid container spacing={3}>
      {/* Customer Information Card */}
      <Grid item xs={12} md={4}>
        <Card variant="outlined">
          <CardContent>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 3 }}>
              <Avatar
                src={customer.picture?.large}
                sx={{ width: 80, height: 80, mb: 2 }}
              >
                {customer.name.first.charAt(0)}
              </Avatar>
              <Typography variant="h5" component="h2" textAlign="center">
                {fullName}
              </Typography>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                @{customer.login.username}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Stack spacing={2}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <EmailIcon sx={{ color: "text.secondary" }} />
                <Box>
                  <Typography variant="body2" fontWeight={500}>
                    Email
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {customer.email}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <PhoneIcon sx={{ color: "text.secondary" }} />
                <Box>
                  <Typography variant="body2" fontWeight={500}>
                    Phone
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {customer.phone}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <LocationOnIcon sx={{ color: "text.secondary" }} />
                <Box>
                  <Typography variant="body2" fontWeight={500}>
                    Address
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {address}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {customer.location.country}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <CakeIcon sx={{ color: "text.secondary" }} />
                <Box>
                  <Typography variant="body2" fontWeight={500}>
                    Age
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {customer.dob.age} years old
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <CalendarTodayIcon sx={{ color: "text.secondary" }} />
                <Box>
                  <Typography variant="body2" fontWeight={500}>
                    Customer Since
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(customer.registered.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      {/* Activities Timeline */}
      <Grid item xs={12} md={8}>
        <Card variant="outlined" sx={{ height: "fit-content" }}>
          <CardContent>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 3 }}
            >
              <Typography variant="h6" component="h3">
                Activity Timeline
              </Typography>
              <Chip 
                label={`${activities.length} activities`} 
                size="small" 
                variant="outlined" 
              />
            </Stack>

            <List sx={{ width: "100%" }}>
              {activities.map((activity, index) => {
                const config = activityConfig[activity.type];
                const IconComponent = config.icon;
                const dateTime = formatDateTime(activity.date);

                return (
                  <React.Fragment key={activity.id}>
                    <ListItem alignItems="flex-start" sx={{ pl: 0, pr: 0 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: config.color, width: 40, height: 40 }}>
                          <IconComponent fontSize="small" />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Stack direction="row" justifyContent="space-between" alignItems="start">
                            <Box>
                              <Typography variant="body1" fontWeight={500}>
                                {activity.title}
                              </Typography>
                              <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                                <Chip 
                                  label={config.label} 
                                  size="small" 
                                  variant="outlined"
                                  sx={{ 
                                    fontSize: "0.75rem", 
                                    height: "20px",
                                    borderColor: config.color,
                                    color: config.color
                                  }}
                                />
                                <Chip 
                                  label={activity.status} 
                                  size="small" 
                                  color={getStatusColor(activity.status)}
                                  variant="outlined"
                                  sx={{ fontSize: "0.75rem", height: "20px" }}
                                />
                                {activity.duration && (
                                  <Chip 
                                    label={activity.duration} 
                                    size="small" 
                                    variant="outlined"
                                    sx={{ fontSize: "0.75rem", height: "20px" }}
                                  />
                                )}
                              </Stack>
                            </Box>
                            <Box sx={{ textAlign: "right", ml: 2 }}>
                              <Typography variant="body2" color="text.secondary">
                                {dateTime.date}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {dateTime.time}
                              </Typography>
                            </Box>
                          </Stack>
                        }
                        secondary={
                          <Typography 
                            variant="body2" 
                            color="text.secondary" 
                            sx={{ mt: 1 }}
                          >
                            {activity.description}
                          </Typography>
                        }
                      />
                    </ListItem>
                    {index < activities.length - 1 && (
                      <Divider variant="inset" component="li" sx={{ ml: 7 }} />
                    )}
                  </React.Fragment>
                );
              })}
            </List>

            {activities.length === 0 && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  py: 4,
                }}
              >
                <EventIcon sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
                <Typography variant="body1" color="text.secondary">
                  No activities found for this customer
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
