import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import Paper from "@mui/material/Paper";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import Chip from "@mui/material/Chip";
import { Activity } from "../data/customerData";

interface ActivityTimelineProps {
  activities: Activity[];
}

const getActivityIcon = (type: Activity['type']) => {
  switch (type) {
    case 'call':
      return <PhoneIcon fontSize="small" />;
    case 'email':
      return <EmailIcon fontSize="small" />;
    case 'meeting':
      return <MeetingRoomIcon fontSize="small" />;
    default:
      return null;
  }
};

const getActivityColor = (type: Activity['type']) => {
  switch (type) {
    case 'call':
      return 'primary';
    case 'email':
      return 'secondary';
    case 'meeting':
      return 'success';
    default:
      return 'grey';
  }
};

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return {
    date: date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }),
    time: date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  };
};

const ActivityItem: React.FC<{ activity: Activity; isLast: boolean }> = ({ activity, isLast }) => {
  const [expanded, setExpanded] = React.useState(false);
  const { date, time } = formatDateTime(activity.date);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const renderActivityDetails = () => {
    switch (activity.type) {
      case 'call':
        return (
          <Box sx={{ mt: 2 }}>
            {activity.details.duration && (
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Duration:</strong> {activity.details.duration} minutes
              </Typography>
            )}
            {activity.details.outcome && (
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Outcome:</strong> {activity.details.outcome}
              </Typography>
            )}
            {activity.details.notes && (
              <Typography variant="body2">
                <strong>Notes:</strong> {activity.details.notes}
              </Typography>
            )}
          </Box>
        );
      
      case 'meeting':
        return (
          <Box sx={{ mt: 2 }}>
            {activity.details.meetingType && (
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Type:</strong> {activity.details.meetingType}
              </Typography>
            )}
            {activity.details.attendees && (
              <Box sx={{ mb: 1 }}>
                <Typography variant="body2" component="span">
                  <strong>Attendees:</strong>
                </Typography>
                <Box sx={{ mt: 0.5 }}>
                  {activity.details.attendees.map((attendee, index) => (
                    <Chip
                      key={index}
                      label={attendee}
                      size="small"
                      variant="outlined"
                      sx={{ mr: 0.5, mb: 0.5 }}
                    />
                  ))}
                </Box>
              </Box>
            )}
            {activity.details.notes && (
              <Typography variant="body2">
                <strong>Notes:</strong> {activity.details.notes}
              </Typography>
            )}
          </Box>
        );
      
      case 'email':
        return (
          <Box sx={{ mt: 2 }}>
            {activity.details.subject && (
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Subject:</strong> {activity.details.subject}
              </Typography>
            )}
            {activity.details.sender && (
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>From:</strong> {activity.details.sender}
              </Typography>
            )}
            {activity.details.recipient && (
              <Typography variant="body2">
                <strong>To:</strong> {activity.details.recipient}
              </Typography>
            )}
          </Box>
        );
      
      default:
        return null;
    }
  };

  return (
    <TimelineItem>
      <TimelineSeparator>
        <TimelineDot color={getActivityColor(activity.type)}>
          {getActivityIcon(activity.type)}
        </TimelineDot>
        {!isLast && <TimelineConnector />}
      </TimelineSeparator>
      <TimelineContent>
        <Paper
          elevation={1}
          sx={{
            p: 2,
            backgroundColor: 'background.paper',
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          }}
          onClick={handleExpandClick}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Chip
                  label={activity.type}
                  color={getActivityColor(activity.type)}
                  size="small"
                  sx={{ textTransform: 'capitalize', mr: 1 }}
                />
                <Typography variant="body2" color="text.secondary">
                  {date} at {time}
                </Typography>
              </Box>
              <Typography variant="subtitle1" fontWeight={500}>
                {activity.title}
              </Typography>
            </Box>
            <IconButton size="small">
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>
          
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            {renderActivityDetails()}
          </Collapse>
        </Paper>
      </TimelineContent>
    </TimelineItem>
  );
};

export default function ActivityTimeline({ activities }: ActivityTimelineProps) {
  // Sort activities by date (most recent first)
  const sortedActivities = [...activities].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (sortedActivities.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body1" color="text.secondary">
          No activities found for this customer.
        </Typography>
      </Box>
    );
  }

  return (
    <Timeline
      sx={{
        [`& .MuiTimelineItem-root:before`]: {
          flex: 0,
          padding: 0,
        },
      }}
    >
      {sortedActivities.map((activity, index) => (
        <ActivityItem
          key={activity.id}
          activity={activity}
          isLast={index === sortedActivities.length - 1}
        />
      ))}
    </Timeline>
  );
}
