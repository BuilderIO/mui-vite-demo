import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

export default function Settings() {
  const [profile, setProfile] = React.useState({
    firstName: "Jane",
    lastName: "Doe",
    email: "jane.doe@example.com",
    phone: "+1 (555) 012-3456",
  });

  const [preferences, setPreferences] = React.useState({
    defaultChart: "bar" as "bar" | "line",
    weeklySummary: true,
  });

  const [notifications, setNotifications] = React.useState({
    emailUpdates: true,
    smsAlerts: false,
    productNews: true,
  });

  const [passwords, setPasswords] = React.useState({
    current: "",
    next: "",
    confirm: "",
  });

  const handleProfileChange = (key: keyof typeof profile) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setProfile({ ...profile, [key]: e.target.value });

  const handlePrefChange = (
    key: keyof typeof preferences,
  ) => (e: any) => {
    const value = key === "defaultChart" ? e.target.value : e.target.checked;
    setPreferences({ ...preferences, [key]: value });
  };

  const handleNotifToggle = (key: keyof typeof notifications) =>
    (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) =>
      setNotifications({ ...notifications, [key]: checked });

  const handlePasswordChange = (key: keyof typeof passwords) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setPasswords({ ...passwords, [key]: e.target.value });

  const canSavePassword =
    passwords.current.length > 0 &&
    passwords.next.length >= 8 &&
    passwords.next === passwords.confirm;

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        Settings
      </Typography>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Profile
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  label="First name"
                  value={profile.firstName}
                  onChange={handleProfileChange("firstName")}
                />
                <TextField
                  fullWidth
                  label="Last name"
                  value={profile.lastName}
                  onChange={handleProfileChange("lastName")}
                />
              </Stack>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  fullWidth
                  type="email"
                  label="Email"
                  value={profile.email}
                  onChange={handleProfileChange("email")}
                />
                <TextField
                  fullWidth
                  label="Phone"
                  value={profile.phone}
                  onChange={handleProfileChange("phone")}
                />
              </Stack>
              <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                <Button variant="contained">Save profile</Button>
                <Button variant="outlined" color="inherit">Reset</Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Preferences
              </Typography>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    Default chart type
                  </Typography>
                  <Select
                    size="small"
                    value={preferences.defaultChart}
                    onChange={handlePrefChange("defaultChart")}
                    sx={{ width: 220 }}
                  >
                    <MenuItem value="bar">Bar</MenuItem>
                    <MenuItem value="line">Line</MenuItem>
                  </Select>
                </Box>
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.weeklySummary}
                      onChange={handlePrefChange("weeklySummary")}
                    />
                  }
                  label="Send me a weekly performance summary"
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Notifications
              </Typography>
              <Stack divider={<Divider flexItem />} spacing={1}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={notifications.emailUpdates}
                      onChange={handleNotifToggle("emailUpdates")}
                    />
                  }
                  label="Email updates"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={notifications.smsAlerts}
                      onChange={handleNotifToggle("smsAlerts")}
                    />
                  }
                  label="SMS alerts"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={notifications.productNews}
                      onChange={handleNotifToggle("productNews")}
                    />
                  }
                  label="Product news"
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Security
              </Typography>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  type="password"
                  label="Current password"
                  value={passwords.current}
                  onChange={handlePasswordChange("current")}
                />
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <TextField
                    fullWidth
                    type="password"
                    label="New password"
                    helperText="Use 8 or more characters"
                    value={passwords.next}
                    onChange={handlePasswordChange("next")}
                  />
                  <TextField
                    fullWidth
                    type="password"
                    label="Confirm new password"
                    value={passwords.confirm}
                    onChange={handlePasswordChange("confirm")}
                  />
                </Stack>
                <Stack direction="row" spacing={1}>
                  <Button variant="contained" disabled={!canSavePassword}>
                    Update password
                  </Button>
                  <Button variant="outlined" color="inherit">Clear</Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
