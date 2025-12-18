import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import MenuItem from "@mui/material/MenuItem";

interface User {
  login: {
    uuid: string;
    username: string;
  };
  name: {
    title: string;
    first: string;
    last: string;
  };
  email: string;
  location: {
    city: string;
    state?: string;
    country: string;
  };
  phone: string;
  picture: {
    thumbnail: string;
  };
  registered: {
    date: string;
  };
}

interface EditUserModalProps {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onUserUpdated: () => void;
}

export default function EditUserModal({
  open,
  user,
  onClose,
  onUserUpdated,
}: EditUserModalProps) {
  const [formData, setFormData] = React.useState({
    title: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    country: "",
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  React.useEffect(() => {
    if (user) {
      setFormData({
        title: user.name.title || "",
        firstName: user.name.first || "",
        lastName: user.name.last || "",
        email: user.email || "",
        phone: user.phone || "",
        city: user.location.city || "",
        state: user.location.state || "",
        country: user.location.country || "",
      });
      setError(null);
      setSuccess(false);
    }
  }, [user]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(
        `https://user-api.builder-io.workers.dev/api/users/${user.login.uuid}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: {
              title: formData.title,
              first: formData.firstName,
              last: formData.lastName,
            },
            email: formData.email,
            phone: formData.phone,
            location: {
              city: formData.city,
              state: formData.state,
              country: formData.country,
            },
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      setSuccess(true);
      setTimeout(() => {
        onUserUpdated();
        onClose();
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Customer</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
            <Avatar
              src={user.picture.thumbnail}
              sx={{ width: 64, height: 64 }}
            >
              {user.name.first[0]}
            </Avatar>
            <Box>
              <Box sx={{ fontWeight: 600, fontSize: "1.1rem" }}>
                {user.name.first} {user.name.last}
              </Box>
              <Box sx={{ color: "text.secondary", fontSize: "0.875rem" }}>
                @{user.login.username}
              </Box>
            </Box>
          </Stack>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              User updated successfully!
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={3}>
                <TextField
                  select
                  label="Title"
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  fullWidth
                  size="small"
                >
                  <MenuItem value="Mr">Mr</MenuItem>
                  <MenuItem value="Mrs">Mrs</MenuItem>
                  <MenuItem value="Ms">Ms</MenuItem>
                  <MenuItem value="Miss">Miss</MenuItem>
                  <MenuItem value="Dr">Dr</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={4.5}>
                <TextField
                  label="First Name"
                  value={formData.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  fullWidth
                  required
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={4.5}>
                <TextField
                  label="Last Name"
                  value={formData.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  fullWidth
                  required
                  size="small"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  fullWidth
                  required
                  size="small"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Phone"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  fullWidth
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="City"
                  value={formData.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  fullWidth
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="State"
                  value={formData.state}
                  onChange={(e) => handleChange("state", e.target.value)}
                  fullWidth
                  size="small"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Country"
                  value={formData.country}
                  onChange={(e) => handleChange("country", e.target.value)}
                  fullWidth
                  size="small"
                />
              </Grid>
            </Grid>
          </form>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} /> : null}
        >
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
