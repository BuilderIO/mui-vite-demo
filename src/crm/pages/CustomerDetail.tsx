import * as React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import TimelineDot from "@mui/lab/TimelineDot";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import VideoCallRoundedIcon from "@mui/icons-material/VideoCallRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import BusinessIcon from "@mui/icons-material/Business";
import PersonIcon from "@mui/icons-material/Person";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import GroupIcon from "@mui/icons-material/Group";
import {
  getCustomerById,
  getActivitiesByCustomerId,
  getStatusColor,
  type Customer,
  type Activity,
} from "../data/customerData";

export default function CustomerDetail() {
  const { customerId } = useParams<{ customerId: string }>();
  const navigate = useNavigate();

  const customer = customerId ? getCustomerById(customerId) : undefined;
  const activities = customerId ? getActivitiesByCustomerId(customerId) : [];

  if (!customer) {
    return (
      <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
        <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
          Customer Not Found
        </Typography>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/customers")}
          variant="outlined"
        >
          Back to Customers
        </Button>
      </Box>
    );
  }

  const handleBackClick = () => {
    navigate("/customers");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'call':
        return <PhoneRoundedIcon />;
      case 'meeting':
        return <VideoCallRoundedIcon />;
      case 'email':
        return <EmailRoundedIcon />;
      default:
        return <PersonIcon />;
    }
  };

  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'call':
        return 'primary';
      case 'meeting':
        return 'secondary';
      case 'email':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      {/* Header */}
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBackClick}
          variant="outlined"
        >
          Back to Customers
        </Button>
        <Typography variant="h4" component="h1">
          Customer Details
        </Typography>
      </Stack>

      <Grid container spacing={3}>
        {/* Customer Information */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, height: "fit-content" }}>
            <Stack spacing={3} alignItems="center">
              <Avatar
                sx={{
                  bgcolor: "primary.main",
                  width: 80,
                  height: 80,
                  fontSize: "2rem"
                }}
              >
                {customer.name.split(' ').map(n => n[0]).join('')}
              </Avatar>
              
              <Box textAlign="center">
                <Typography variant="h5" component="h2" gutterBottom>
                  {customer.name}
                </Typography>
                {customer.title && (
                  <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    {customer.title}
                  </Typography>
                )}
                <Chip
                  label={customer.status}
                  color={getStatusColor(customer.status) as any}
                  variant="outlined"
                />
              </Box>

              <Divider sx={{ width: "100%" }} />

              <Stack spacing={2} sx={{ width: "100%" }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <BusinessIcon sx={{ fontSize: 20, color: "text.secondary" }} />
                  <Typography variant="body2">
                    {customer.company}
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center">
                  <EmailIcon sx={{ fontSize: 20, color: "text.secondary" }} />
                  <Typography 
                    variant="body2"
                    component="a"
                    href={`mailto:${customer.email}`}
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
                  <PhoneIcon sx={{ fontSize: 20, color: "text.secondary" }} />
                  <Typography 
                    variant="body2"
                    component="a"
                    href={`tel:${customer.phone}`}
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

                {customer.address && (
                  <Stack direction="row" spacing={1} alignItems="flex-start">
                    <LocationOnIcon sx={{ fontSize: 20, color: "text.secondary", mt: 0.5 }} />
                    <Typography variant="body2">
                      {customer.address}
                    </Typography>
                  </Stack>
                )}

                <Stack direction="row" spacing={1} alignItems="center">
                  <AccessTimeIcon sx={{ fontSize: 20, color: "text.secondary" }} />
                  <Box>
                    <Typography variant="body2">
                      Last Contact
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(customer.lastContactDate)}
                    </Typography>
                  </Box>
                </Stack>
              </Stack>

              {customer.notes && (
                <>
                  <Divider sx={{ width: "100%" }} />
                  <Box sx={{ width: "100%" }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Notes
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {customer.notes}
                    </Typography>
                  </Box>
                </>
              )}
            </Stack>
          </Paper>
        </Grid>

        {/* Activity Timeline */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Activity Timeline
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Chronological history of all customer interactions
            </Typography>

            {activities.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  No activities recorded for this customer
                </Typography>
              </Box>
            ) : (
              <Timeline>
                {activities.map((activity: Activity) => (
                  <TimelineItem key={activity.id}>
                    <TimelineOppositeContent
                      sx={{ m: 'auto 0', minWidth: 120 }}
                      align="right"
                      variant="body2"
                      color="text.secondary"
                    >
                      {formatDate(activity.date)}
                      <br />
                      {formatTime(activity.date)}
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                      <TimelineDot color={getActivityColor(activity.type) as any}>
                        {getActivityIcon(activity.type)}
                      </TimelineDot>
                      <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent sx={{ py: '12px', px: 2 }}>
                      <Card variant="outlined" sx={{ mb: 2 }}>
                        <CardContent sx={{ pb: 2 }}>
                          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                            <Chip
                              label={activity.type.toUpperCase()}
                              size="small"
                              color={getActivityColor(activity.type) as any}
                              variant="outlined"
                            />
                            <Typography variant="subtitle1" component="h3">
                              {activity.title}
                            </Typography>
                          </Stack>
                          
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {activity.description}
                          </Typography>

                          {/* Activity-specific details */}
                          <Stack spacing={1}>
                            {activity.duration && (
                              <Stack direction="row" spacing={1} alignItems="center">
                                <AccessTimeIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                                <Typography variant="caption">
                                  Duration: {activity.duration} minutes
                                </Typography>
                              </Stack>
                            )}

                            {activity.outcome && (
                              <Typography variant="caption" sx={{ fontStyle: "italic" }}>
                                Outcome: {activity.outcome}
                              </Typography>
                            )}

                            {activity.attendees && activity.attendees.length > 0 && (
                              <Stack direction="row" spacing={1} alignItems="center">
                                <GroupIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                                <Typography variant="caption">
                                  Attendees: {activity.attendees.join(', ')}
                                </Typography>
                              </Stack>
                            )}

                            {activity.subject && (
                              <Typography variant="caption">
                                Subject: {activity.subject}
                              </Typography>
                            )}

                            {activity.meetingType && (
                              <Typography variant="caption">
                                Type: {activity.meetingType}
                              </Typography>
                            )}

                            {activity.sender && activity.recipient && (
                              <Typography variant="caption">
                                From: {activity.sender} → To: {activity.recipient}
                              </Typography>
                            )}
                          </Stack>
                        </CardContent>
                      </Card>
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </Timeline>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
