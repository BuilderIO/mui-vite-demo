import * as React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { 
  getCustomerById, 
  getActivitiesByCustomerId, 
  getStatusColor, 
  formatDate 
} from "../data/customerData";
import CustomerActivityTimeline from "../components/CustomerActivityTimeline";

export default function CustomerDetail() {
  const { customerId } = useParams<{ customerId: string }>();
  const navigate = useNavigate();

  const customer = customerId ? getCustomerById(customerId) : undefined;
  const activities = customerId ? getActivitiesByCustomerId(customerId) : [];

  if (!customer) {
    return (
      <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
        <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
          Customer Not Found
        </Typography>
        <Typography variant="body1" color="text.secondary">
          The customer you're looking for doesn't exist or has been removed.
        </Typography>
        <Button 
          variant="outlined" 
          startIcon={<ArrowBackRoundedIcon />}
          sx={{ mt: 2 }}
          onClick={() => navigate('/customers')}
        >
          Back to Customers
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      {/* Header with navigation */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        sx={{ mb: 3 }}
      >
        <IconButton 
          onClick={() => navigate('/customers')}
          sx={{ mr: 1 }}
        >
          <ArrowBackRoundedIcon />
        </IconButton>
        <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
          Customer Details
        </Typography>
        <Button
          variant="outlined"
          startIcon={<EditRoundedIcon />}
        >
          Edit Customer
        </Button>
        <Button
          variant="contained"
          startIcon={<AddRoundedIcon />}
        >
          Add Activity
        </Button>
      </Stack>

      <Grid container spacing={3}>
        {/* Customer Information Card */}
        <Grid item xs={12} lg={4}>
          <Card variant="outlined" sx={{ height: 'fit-content' }}>
            <CardContent>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Avatar 
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    mx: 'auto', 
                    mb: 2,
                    fontSize: '2rem'
                  }}
                >
                  {customer.avatar || customer.name.split(' ').map(n => n[0]).join('')}
                </Avatar>
                <Typography variant="h5" component="h2" sx={{ mb: 1 }}>
                  {customer.name}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
                  {customer.company}
                </Typography>
                <Chip
                  label={customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                  color={getStatusColor(customer.status)}
                  variant="outlined"
                />
              </Box>

              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Email Address
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <EmailRoundedIcon fontSize="small" color="action" />
                    <Typography variant="body2">
                      {customer.email}
                    </Typography>
                  </Stack>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Phone Number
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <PhoneRoundedIcon fontSize="small" color="action" />
                    <Typography variant="body2">
                      {customer.phone}
                    </Typography>
                  </Stack>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Last Contact
                  </Typography>
                  <Typography variant="body2">
                    {formatDate(customer.lastContact)}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Total Activities
                  </Typography>
                  <Typography variant="body2">
                    {activities.length} recorded activities
                  </Typography>
                </Box>
              </Stack>

              {/* Quick Actions */}
              <Stack direction="row" spacing={1} sx={{ mt: 3 }}>
                <Button
                  variant="outlined"
                  startIcon={<EmailRoundedIcon />}
                  size="small"
                  fullWidth
                >
                  Email
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<PhoneRoundedIcon />}
                  size="small"
                  fullWidth
                >
                  Call
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Activity Timeline */}
        <Grid item xs={12} md={8}>
          <CustomerActivityTimeline activities={activities} />
        </Grid>
      </Grid>
    </Box>
  );
}
