import * as React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
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
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { customersData, Customer, CustomerActivity } from "../data/customersData";

const getStatusColor = (status: Customer['status']) => {
  switch (status) {
    case 'active':
      return 'success';
    case 'prospect':
      return 'primary';
    case 'inactive':
      return 'default';
    case 'closed':
      return 'error';
    default:
      return 'default';
  }
};

const getActivityIcon = (type: CustomerActivity['type']) => {
  switch (type) {
    case 'call':
      return <PhoneIcon />;
    case 'email':
      return <EmailIcon />;
    case 'meeting':
      return <MeetingRoomIcon />;
    default:
      return <EmailIcon />;
  }
};

const getActivityColor = (type: CustomerActivity['type']) => {
  switch (type) {
    case 'call':
      return 'primary';
    case 'email':
      return 'secondary';
    case 'meeting':
      return 'success';
    default:
      return 'default';
  }
};

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const ActivityDetails: React.FC<{ activity: CustomerActivity }> = ({ activity }) => {
  return (
    <Box sx={{ mt: 1 }}>
      <Typography variant="body2" sx={{ mb: 1 }}>
        {activity.description}
      </Typography>
      
      {activity.type === 'call' && (
        <Box sx={{ mt: 1 }}>
          {activity.duration && (
            <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
              Duration: {activity.duration} minutes
            </Typography>
          )}
          {activity.outcome && (
            <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
              Outcome: {activity.outcome}
            </Typography>
          )}
        </Box>
      )}
      
      {activity.type === 'meeting' && (
        <Box sx={{ mt: 1 }}>
          {activity.meetingType && (
            <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
              Type: {activity.meetingType === 'in-person' ? 'In-Person' : 'Virtual'}
            </Typography>
          )}
          {activity.attendees && (
            <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
              Attendees: {activity.attendees.join(', ')}
            </Typography>
          )}
        </Box>
      )}
      
      {activity.type === 'email' && (
        <Box sx={{ mt: 1 }}>
          {activity.subject && (
            <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
              Subject: {activity.subject}
            </Typography>
          )}
          <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
            Direction: {activity.direction === 'sent' ? 'Sent' : 'Received'}
          </Typography>
          {activity.sender && activity.recipient && (
            <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
              {activity.direction === 'sent' ? `To: ${activity.recipient}` : `From: ${activity.sender}`}
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default function CustomerDetail() {
  const { customerId } = useParams<{ customerId: string }>();
  const navigate = useNavigate();
  
  const customer = customersData.find(c => c.id === customerId);

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

  // Sort activities by date (most recent first)
  const sortedActivities = [...customer.activities].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/customers')}
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
        {/* Customer Basic Information */}
        <Grid item xs={12} lg={4}>
          <Paper
            sx={{
              p: { xs: 2, sm: 3 },
              height: 'fit-content',
              mb: { xs: 2, lg: 0 }
            }}
          >
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
              {customer.name}
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Chip
                label={customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                color={getStatusColor(customer.status)}
                variant="filled"
                sx={{ mb: 2 }}
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                Company
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {customer.company}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                Email
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {customer.email}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                Phone
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {customer.phone}
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                Last Contact
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {formatDate(customer.lastContact)}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Activity Timeline */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
              Activity Timeline
            </Typography>
            
            {sortedActivities.length === 0 ? (
              <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', py: 4 }}>
                No activities recorded for this customer.
              </Typography>
            ) : (
              <Timeline sx={{ px: { xs: 0, sm: 2 } }}>
                {sortedActivities.map((activity, index) => (
                  <TimelineItem key={activity.id}>
                    <TimelineOppositeContent
                      sx={{
                        flex: { xs: 0, sm: 0.3 },
                        display: { xs: 'none', sm: 'block' }
                      }}
                    >
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {formatDateTime(activity.date)}
                      </Typography>
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                      <TimelineDot color={getActivityColor(activity.type)}>
                        {getActivityIcon(activity.type)}
                      </TimelineDot>
                      {index < sortedActivities.length - 1 && <TimelineConnector />}
                    </TimelineSeparator>
                    <TimelineContent sx={{ flex: 1 }}>
                      <Accordion elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls={`activity-${activity.id}-content`}
                          id={`activity-${activity.id}-header`}
                        >
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                              {activity.title}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
                              {activity.type}
                            </Typography>
                          </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                          <ActivityDetails activity={activity} />
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
