import * as React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PhoneIcon from "@mui/icons-material/Phone";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";
import BusinessIcon from "@mui/icons-material/Business";
import PhoneInTalkIcon from "@mui/icons-material/PhoneInTalk";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import { getCustomerById, getCustomerActivities, Activity } from "../data/customersData";

const getActivityIcon = (type: Activity['type']) => {
  switch (type) {
    case 'call':
      return <PhoneIcon />;
    case 'meeting':
      return <MeetingRoomIcon />;
    case 'email':
      return <EmailIcon />;
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

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Active':
      return 'success';
    case 'Prospect':
      return 'info';
    case 'Inactive':
      return 'warning';
    case 'Lost':
      return 'error';
    default:
      return 'default';
  }
};

export default function CustomerDetail() {
  const { customerId } = useParams<{ customerId: string }>();
  const navigate = useNavigate();
  const [expandedActivity, setExpandedActivity] = React.useState<string | false>(false);

  const customer = customerId ? getCustomerById(customerId) : undefined;
  const activities = customerId ? getCustomerActivities(customerId) : [];

  const handleActivityExpand = (activityId: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedActivity(isExpanded ? activityId : false);
  };

  if (!customer) {
    return (
      <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/customers')}
          sx={{ mb: 2 }}
        >
          Back to Customers
        </Button>
        <Typography variant="h4" component="h1">
          Customer Not Found
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          The requested customer could not be found.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/customers')}
        sx={{ mb: 3 }}
      >
        Back to Customers
      </Button>

      {/* Customer Information Card */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Typography variant="h4" component="h1" gutterBottom>
              {customer.name}
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {customer.company}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmailOutlinedIcon color="action" />
                <Typography variant="body1">{customer.email}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PhoneInTalkIcon color="action" />
                <Typography variant="body1">{customer.phone}</Typography>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: { xs: 'flex-start', md: 'flex-end' } }}>
              <Chip
                label={customer.accountStatus}
                color={getStatusColor(customer.accountStatus)}
                size="medium"
                variant="filled"
              />
              <Typography variant="body2" color="text.secondary">
                Last Contact: {new Date(customer.lastContactDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Activity Timeline */}
      <Typography variant="h5" component="h2" gutterBottom>
        Activity Timeline
      </Typography>
      
      {activities.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            No activities found for this customer.
          </Typography>
        </Paper>
      ) : (
        <Timeline position={{ xs: "right", md: "alternate" }}>
          {activities.map((activity, index) => (
            <TimelineItem key={activity.id}>
              <TimelineOppositeContent
                sx={{ m: 'auto 0' }}
                align={index % 2 === 0 ? "right" : "left"}
                variant="body2"
                color="text.secondary"
              >
                {formatTime(activity.date)}
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot color={getActivityColor(activity.type)}>
                  {getActivityIcon(activity.type)}
                </TimelineDot>
                {index < activities.length - 1 && <TimelineConnector />}
              </TimelineSeparator>
              <TimelineContent sx={{ py: '12px', px: 2 }}>
                <Accordion 
                  expanded={expandedActivity === activity.id} 
                  onChange={handleActivityExpand(activity.id)}
                  sx={{ boxShadow: 1 }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`${activity.id}-content`}
                    id={`${activity.id}-header`}
                  >
                    <Box>
                      <Typography variant="h6" component="span">
                        {activity.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ display: 'block' }}>
                        {formatDateTime(activity.date)} • {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box sx={{ pt: 1 }}>
                      {activity.type === 'call' && (
                        <>
                          {activity.details.duration && (
                            <Typography variant="body2" gutterBottom>
                              <strong>Duration:</strong> {activity.details.duration}
                            </Typography>
                          )}
                          {activity.details.outcome && (
                            <Typography variant="body2" gutterBottom>
                              <strong>Outcome:</strong> {activity.details.outcome}
                            </Typography>
                          )}
                          {activity.details.notes && (
                            <Typography variant="body2" gutterBottom>
                              <strong>Notes:</strong> {activity.details.notes}
                            </Typography>
                          )}
                        </>
                      )}
                      
                      {activity.type === 'meeting' && (
                        <>
                          {activity.details.meetingType && (
                            <Typography variant="body2" gutterBottom>
                              <strong>Type:</strong> {activity.details.meetingType}
                            </Typography>
                          )}
                          {activity.details.attendees && (
                            <Typography variant="body2" gutterBottom>
                              <strong>Attendees:</strong> {activity.details.attendees.join(', ')}
                            </Typography>
                          )}
                          {activity.details.notes && (
                            <Typography variant="body2" gutterBottom>
                              <strong>Notes:</strong> {activity.details.notes}
                            </Typography>
                          )}
                        </>
                      )}
                      
                      {activity.type === 'email' && (
                        <>
                          {activity.details.subject && (
                            <Typography variant="body2" gutterBottom>
                              <strong>Subject:</strong> {activity.details.subject}
                            </Typography>
                          )}
                          {activity.details.sender && (
                            <Typography variant="body2" gutterBottom>
                              <strong>From:</strong> {activity.details.sender}
                            </Typography>
                          )}
                          {activity.details.recipient && (
                            <Typography variant="body2" gutterBottom>
                              <strong>To:</strong> {activity.details.recipient}
                            </Typography>
                          )}
                        </>
                      )}
                    </Box>
                  </AccordionDetails>
                </Accordion>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      )}
    </Box>
  );
}
