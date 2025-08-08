import * as React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
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
import BusinessIcon from "@mui/icons-material/Business";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CallIcon from "@mui/icons-material/Call";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import PersonIcon from "@mui/icons-material/Person";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { getCustomerById, getActivitiesByCustomerId } from "../data/mockCustomerData";
import { Activity, CallActivity, MeetingActivity, EmailActivity, Customer } from "../types/customerTypes";

const getStatusColor = (status: Customer['accountStatus']) => {
  switch (status) {
    case 'Active': return 'success';
    case 'Inactive': return 'default';
    case 'Prospect': return 'warning';
    case 'Closed': return 'error';
    default: return 'default';
  }
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

const getActivityIcon = (activity: Activity) => {
  switch (activity.type) {
    case 'call':
      return <CallIcon fontSize="small" />;
    case 'meeting':
      const meetingActivity = activity as MeetingActivity;
      return meetingActivity.meetingType === 'Virtual' ? 
        <VideoCallIcon fontSize="small" /> : 
        <MeetingRoomIcon fontSize="small" />;
    case 'email':
      return <EmailIcon fontSize="small" />;
    default:
      return <PersonIcon fontSize="small" />;
  }
};

const getActivityColor = (activity: Activity) => {
  switch (activity.type) {
    case 'call': return 'primary';
    case 'meeting': return 'success';
    case 'email': return 'info';
    default: return 'default';
  }
};

const ActivityDetailsContent = ({ activity }: { activity: Activity }) => {
  switch (activity.type) {
    case 'call':
      const callActivity = activity as CallActivity;
      return (
        <Stack spacing={1}>
          <Stack direction="row" spacing={2}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <AccessTimeIcon fontSize="small" color="action" />
              <Typography variant="body2">
                Duration: {callActivity.duration} minutes
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1}>
              <CheckCircleIcon fontSize="small" color="action" />
              <Typography variant="body2">
                Outcome: {callActivity.outcome}
              </Typography>
            </Stack>
          </Stack>
          {callActivity.notes && (
            <Typography variant="body2" color="text.secondary">
              Notes: {callActivity.notes}
            </Typography>
          )}
        </Stack>
      );

    case 'meeting':
      const meetingActivity = activity as MeetingActivity;
      return (
        <Stack spacing={1}>
          <Stack direction="row" spacing={2}>
            <Typography variant="body2">
              Type: {meetingActivity.meetingType}
            </Typography>
            {meetingActivity.location && (
              <Typography variant="body2">
                Location: {meetingActivity.location}
              </Typography>
            )}
          </Stack>
          <Typography variant="body2">
            Attendees: {meetingActivity.attendees.join(', ')}
          </Typography>
          {meetingActivity.notes && (
            <Typography variant="body2" color="text.secondary">
              Notes: {meetingActivity.notes}
            </Typography>
          )}
        </Stack>
      );

    case 'email':
      const emailActivity = activity as EmailActivity;
      return (
        <Stack spacing={1}>
          <Typography variant="body2">
            Subject: {emailActivity.subject}
          </Typography>
          <Stack direction="row" spacing={2}>
            <Typography variant="body2">
              From: {emailActivity.sender}
            </Typography>
            <Typography variant="body2">
              To: {emailActivity.recipient}
            </Typography>
          </Stack>
          <Chip 
            label={emailActivity.direction === 'sent' ? 'Sent' : 'Received'} 
            size="small" 
            color={emailActivity.direction === 'sent' ? 'primary' : 'secondary'}
          />
        </Stack>
      );

    default:
      return null;
  }
};

export default function CustomerDetail() {
  const { customerId } = useParams<{ customerId: string }>();
  const navigate = useNavigate();
  const [expandedActivity, setExpandedActivity] = React.useState<string>('');

  const customer = customerId ? getCustomerById(customerId) : null;
  const activities = customerId ? getActivitiesByCustomerId(customerId) : [];

  const handleExpandActivity = (activityId: string) => {
    setExpandedActivity(expandedActivity === activityId ? '' : activityId);
  };

  if (!customer) {
    return (
      <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
        <Typography variant="h5" color="error">
          Customer not found
        </Typography>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/customers')}
          sx={{ mt: 2 }}
        >
          Back to Customers
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      {/* Header */}
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <IconButton onClick={() => navigate('/customers')}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          Customer Details
        </Typography>
      </Stack>

      <Grid container spacing={3}>
        {/* Customer Information */}
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Stack spacing={3}>
                {/* Basic Info */}
                <Stack direction="row" alignItems="center" spacing={3}>
                  <Avatar 
                    sx={{ 
                      width: 80, 
                      height: 80, 
                      bgcolor: 'primary.main',
                      fontSize: '2rem'
                    }}
                  >
                    {customer.name.split(' ').map(n => n[0]).join('')}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h5" component="h2" gutterBottom>
                      {customer.name}
                    </Typography>
                    {customer.title && (
                      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                        {customer.title}
                      </Typography>
                    )}
                    <Chip
                      label={customer.accountStatus}
                      color={getStatusColor(customer.accountStatus)}
                      size="small"
                    />
                  </Box>
                </Stack>

                <Divider />

                {/* Contact Information */}
                <Stack spacing={2}>
                  <Typography variant="h6">Contact Information</Typography>
                  
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <BusinessIcon color="action" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Company
                      </Typography>
                      <Typography variant="body1">
                        {customer.company}
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" alignItems="center" spacing={2}>
                    <EmailIcon color="action" />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Email
                      </Typography>
                      <Typography variant="body1">
                        {customer.email}
                      </Typography>
                    </Box>
                    <IconButton 
                      size="small" 
                      onClick={() => window.open(`mailto:${customer.email}`, '_blank')}
                    >
                      <EmailIcon fontSize="small" />
                    </IconButton>
                  </Stack>

                  <Stack direction="row" alignItems="center" spacing={2}>
                    <PhoneIcon color="action" />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Phone
                      </Typography>
                      <Typography variant="body1">
                        {customer.phone}
                      </Typography>
                    </Box>
                    <IconButton 
                      size="small"
                      onClick={() => window.open(`tel:${customer.phone}`, '_blank')}
                    >
                      <PhoneIcon fontSize="small" />
                    </IconButton>
                  </Stack>

                  {customer.address && (
                    <Stack direction="row" alignItems="flex-start" spacing={2}>
                      <LocationOnIcon color="action" sx={{ mt: 0.5 }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Address
                        </Typography>
                        <Typography variant="body1">
                          {customer.address.street}<br />
                          {customer.address.city}, {customer.address.state} {customer.address.zipCode}<br />
                          {customer.address.country}
                        </Typography>
                      </Box>
                    </Stack>
                  )}
                </Stack>

                <Divider />

                {/* Account Information */}
                <Stack spacing={2}>
                  <Typography variant="h6">Account Information</Typography>
                  
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <AttachMoneyIcon color="action" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Account Value
                      </Typography>
                      <Typography variant="h6" color="primary">
                        {formatCurrency(customer.value || 0)}
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" alignItems="center" spacing={2}>
                    <CalendarTodayIcon color="action" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Customer Since
                      </Typography>
                      <Typography variant="body1">
                        {formatDate(customer.joinDate)}
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" alignItems="center" spacing={2}>
                    <CalendarTodayIcon color="action" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Last Contact
                      </Typography>
                      <Typography variant="body1">
                        {formatDate(customer.lastContactDate)}
                      </Typography>
                    </Box>
                  </Stack>

                  {customer.tags && customer.tags.length > 0 && (
                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Tags
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap">
                        {customer.tags.map((tag, index) => (
                          <Chip key={index} label={tag} size="small" variant="outlined" />
                        ))}
                      </Stack>
                    </Box>
                  )}
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Activity Timeline */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Activity Timeline
            </Typography>
            
            {activities.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" color="text.secondary">
                  No activities found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Start engaging with this customer to see their activity history
                </Typography>
              </Box>
            ) : (
              <Timeline>
                {activities.map((activity, index) => (
                  <TimelineItem key={activity.id}>
                    <TimelineOppositeContent
                      sx={{ m: 'auto 0', minWidth: '120px' }}
                      align="right"
                      variant="body2"
                      color="text.secondary"
                    >
                      {formatDateTime(activity.date)}
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                      <TimelineDot color={getActivityColor(activity)}>
                        {getActivityIcon(activity)}
                      </TimelineDot>
                      {index < activities.length - 1 && <TimelineConnector />}
                    </TimelineSeparator>
                    <TimelineContent sx={{ py: '12px', px: 2 }}>
                      <Accordion
                        expanded={expandedActivity === activity.id}
                        onChange={() => handleExpandActivity(activity.id)}
                        elevation={1}
                      >
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="h6" component="span">
                              {activity.title}
                            </Typography>
                            <Typography 
                              variant="body2" 
                              color="text.secondary" 
                              sx={{ display: 'block', mt: 0.5 }}
                            >
                              {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                              {activity.description && ` • ${activity.description}`}
                            </Typography>
                          </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                          <ActivityDetailsContent activity={activity} />
                        </AccordionDetails>
                      </Accordion>
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
