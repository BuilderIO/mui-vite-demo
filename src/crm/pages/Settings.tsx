import * as React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Divider,
  Avatar,
  Stack,
  Chip,
} from "@mui/material";
import { Person, Notifications, Security, Palette } from "@mui/icons-material";

export default function Settings() {
  const [emailNotifications, setEmailNotifications] = React.useState(true);
  const [pushNotifications, setPushNotifications] = React.useState(false);
  const [darkMode, setDarkMode] = React.useState(false);
  const [autoSave, setAutoSave] = React.useState(true);

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1200px" }, p: 2 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 600 }}>
        Settings
      </Typography>

      <Grid container spacing={3}>
        {/* Profile Settings */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                <Person color="primary" />
                <Typography variant="h6" fontWeight={600}>
                  Profile Settings
                </Typography>
              </Stack>

              <Stack spacing={3}>
                <Box display="flex" alignItems="center" spacing={2}>
                  <Avatar
                    sx={{ width: 64, height: 64, mr: 2 }}
                    src="/api/placeholder/64/64"
                  >
                    JD
                  </Avatar>
                  <Button variant="outlined" size="small">
                    Change Photo
                  </Button>
                </Box>

                <TextField
                  label="Full Name"
                  defaultValue="John Doe"
                  variant="outlined"
                  fullWidth
                />

                <TextField
                  label="Email"
                  defaultValue="john.doe@company.com"
                  variant="outlined"
                  fullWidth
                />

                <TextField
                  label="Phone"
                  defaultValue="+1 (555) 123-4567"
                  variant="outlined"
                  fullWidth
                />

                <TextField
                  label="Department"
                  defaultValue="Sales"
                  variant="outlined"
                  fullWidth
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Notification Settings */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                <Notifications color="primary" />
                <Typography variant="h6" fontWeight={600}>
                  Notifications
                </Typography>
              </Stack>

              <Stack spacing={2}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={emailNotifications}
                      onChange={(e) => setEmailNotifications(e.target.checked)}
                    />
                  }
                  label="Email notifications"
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={pushNotifications}
                      onChange={(e) => setPushNotifications(e.target.checked)}
                    />
                  }
                  label="Push notifications"
                />

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" color="text.secondary">
                  Notification Types
                </Typography>

                <Stack direction="row" spacing={1} flexWrap="wrap">
                  <Chip label="New Leads" variant="outlined" />
                  <Chip label="Deal Updates" variant="outlined" />
                  <Chip label="Task Reminders" variant="outlined" />
                  <Chip label="System Updates" variant="outlined" />
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Preferences */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                <Palette color="primary" />
                <Typography variant="h6" fontWeight={600}>
                  Preferences
                </Typography>
              </Stack>

              <Stack spacing={2}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={darkMode}
                      onChange={(e) => setDarkMode(e.target.checked)}
                    />
                  }
                  label="Dark mode"
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={autoSave}
                      onChange={(e) => setAutoSave(e.target.checked)}
                    />
                  }
                  label="Auto-save changes"
                />

                <TextField
                  select
                  label="Time Zone"
                  defaultValue="UTC-8"
                  variant="outlined"
                  fullWidth
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value="UTC-8">Pacific Time (UTC-8)</option>
                  <option value="UTC-5">Eastern Time (UTC-5)</option>
                  <option value="UTC+0">GMT (UTC+0)</option>
                  <option value="UTC+1">Central European Time (UTC+1)</option>
                </TextField>

                <TextField
                  select
                  label="Language"
                  defaultValue="en"
                  variant="outlined"
                  fullWidth
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </TextField>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Security Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                <Security color="primary" />
                <Typography variant="h6" fontWeight={600}>
                  Security
                </Typography>
              </Stack>

              <Stack spacing={2}>
                <Button variant="outlined" fullWidth>
                  Change Password
                </Button>

                <Button variant="outlined" fullWidth>
                  Enable Two-Factor Authentication
                </Button>

                <Button variant="outlined" fullWidth>
                  Manage API Keys
                </Button>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" color="text.secondary">
                  Recent Activity
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Last login: Today at 9:15 AM
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Password changed: 30 days ago
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Action Buttons */}
        <Grid item xs={12}>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button variant="outlined">
              Cancel
            </Button>
            <Button variant="contained">
              Save Changes
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
