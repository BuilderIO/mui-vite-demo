import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import MeetingRoomRoundedIcon from "@mui/icons-material/MeetingRoomRounded";
import { Activity, formatDateTime } from "../data/customerData";

interface CustomerActivityTimelineProps {
  activities: Activity[];
}

const getActivityIcon = (type: Activity['type']) => {
  switch (type) {
    case 'email':
      return <EmailRoundedIcon fontSize="small" />;
    case 'call':
      return <PhoneRoundedIcon fontSize="small" />;
    case 'meeting':
      return <MeetingRoomRoundedIcon fontSize="small" />;
    default:
      return <EmailRoundedIcon fontSize="small" />;
  }
};

const getActivityColor = (type: Activity['type']): 'primary' | 'success' | 'warning' => {
  switch (type) {
    case 'email':
      return 'primary';
    case 'call':
      return 'success';
    case 'meeting':
      return 'warning';
    default:
      return 'primary';
  }
};

const ActivityMetadata: React.FC<{ activity: Activity }> = ({ activity }) => {
  if (!activity.metadata) return null;

  const { type, metadata } = activity;

  return (
    <Box sx={{ mt: 2 }}>
      {type === 'call' && (
        <Stack spacing={1}>
          {metadata.duration && (
            <Typography variant="body2" color="text.secondary">
              <strong>Duration:</strong> {metadata.duration} minutes
            </Typography>
          )}
          {metadata.outcome && (
            <Typography variant="body2" color="text.secondary">
              <strong>Outcome:</strong> {metadata.outcome}
            </Typography>
          )}
        </Stack>
      )}

      {type === 'meeting' && (
        <Stack spacing={1}>
          {metadata.meetingType && (
            <Typography variant="body2" color="text.secondary">
              <strong>Type:</strong> {metadata.meetingType === 'in-person' ? 'In-person' : 'Virtual'}
            </Typography>
          )}
          {metadata.attendees && (
            <Typography variant="body2" color="text.secondary">
              <strong>Attendees:</strong> {metadata.attendees.join(', ')}
            </Typography>
          )}
        </Stack>
      )}

      {type === 'email' && (
        <Stack spacing={1}>
          {metadata.subject && (
            <Typography variant="body2" color="text.secondary">
              <strong>Subject:</strong> {metadata.subject}
            </Typography>
          )}
          {metadata.direction && (
            <Chip
              label={metadata.direction === 'sent' ? 'Sent' : 'Received'}
              size="small"
              color={metadata.direction === 'sent' ? 'primary' : 'secondary'}
              variant="outlined"
            />
          )}
          {metadata.sender && (
            <Typography variant="body2" color="text.secondary">
              <strong>From:</strong> {metadata.sender}
            </Typography>
          )}
          {metadata.recipient && (
            <Typography variant="body2" color="text.secondary">
              <strong>To:</strong> {metadata.recipient}
            </Typography>
          )}
        </Stack>
      )}
    </Box>
  );
};

export default function CustomerActivityTimeline({ activities }: CustomerActivityTimelineProps) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" component="h3" sx={{ mb: 3 }}>
          Activity Timeline
        </Typography>

        {activities.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
            No activities recorded for this customer yet.
          </Typography>
        ) : (
          <Stack spacing={2}>
            {activities.map((activity) => (
              <Accordion 
                key={activity.id}
                elevation={0}
                sx={{ 
                  border: '1px solid',
                  borderColor: 'divider',
                  '&:before': { display: 'none' }
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{ 
                    '& .MuiAccordionSummary-content': { 
                      alignItems: 'center' 
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                    <Box
                      sx={{
                        bgcolor: `${getActivityColor(activity.type)}.main`,
                        borderRadius: '50%',
                        p: 0.75,
                        display: 'flex',
                        color: 'white',
                        minWidth: 'auto'
                      }}
                    >
                      {getActivityIcon(activity.type)}
                    </Box>
                    
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Typography variant="subtitle2" component="span" sx={{ fontWeight: 600 }}>
                        {activity.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ display: 'block' }}>
                        {formatDateTime(activity.date, activity.time)}
                      </Typography>
                    </Box>

                    <Chip
                      label={activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                      size="small"
                      color={getActivityColor(activity.type)}
                      variant="outlined"
                    />
                  </Box>
                </AccordionSummary>
                
                <AccordionDetails>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {activity.description}
                  </Typography>
                  <ActivityMetadata activity={activity} />
                </AccordionDetails>
              </Accordion>
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}
