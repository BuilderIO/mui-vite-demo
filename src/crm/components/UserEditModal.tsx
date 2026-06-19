import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Box,
  Alert,
  MenuItem,
  Avatar,
  Typography,
  Stack,
} from "@mui/material";
import { User, UpdateUserRequest } from "../hooks/useUsers";

interface UserEditModalProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
  onSave: (userId: string, userData: UpdateUserRequest) => Promise<void>;
  loading: boolean;
}

const titleOptions = ["Mr", "Mrs", "Ms", "Dr", "Prof"];

export default function UserEditModal({
  open,
  onClose,
  user,
  onSave,
  loading,
}: UserEditModalProps) {
  const [formData, setFormData] = React.useState<UpdateUserRequest>({});
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (user) {
      setFormData({
        name: {
          title: user.name.title,
          first: user.name.first,
          last: user.name.last,
        },
        email: user.email,
        location: {
          street: {
            number: user.location.street.number,
            name: user.location.street.name,
          },
          city: user.location.city,
          state: user.location.state,
          country: user.location.country,
          postcode: user.location.postcode,
        },
        phone: user.phone,
        cell: user.cell,
      });
      setError(null);
    }
  }, [user]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => {
      const newData = { ...prev };
      const fieldPath = field.split(".");

      let current: any = newData;
      for (let i = 0; i < fieldPath.length - 1; i++) {
        if (!current[fieldPath[i]]) {
          current[fieldPath[i]] = {};
        }
        current = current[fieldPath[i]];
      }
      current[fieldPath[fieldPath.length - 1]] = value;

      return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setError(null);
      await onSave(user.login.uuid, formData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update user");
    }
  };

  const handleClose = () => {
    setError(null);
    onClose();
  };

  if (!user) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              src={user.picture.medium}
              alt={`${user.name.first} ${user.name.last}`}
              sx={{ width: 48, height: 48 }}
            />
            <Box>
              <Typography variant="h6">
                Edit User: {user.name.first} {user.name.last}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                @{user.login.username}
              </Typography>
            </Box>
          </Stack>
        </DialogTitle>

        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={2} sx={{ mt: 1 }}>
            {/* Personal Information */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                Personal Information
              </Typography>
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                select
                fullWidth
                label="Title"
                value={formData.name?.title || ""}
                onChange={(e) => handleChange("name.title", e.target.value)}
              >
                {titleOptions.map((title) => (
                  <MenuItem key={title} value={title}>
                    {title}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={4.5}>
              <TextField
                fullWidth
                label="First Name"
                value={formData.name?.first || ""}
                onChange={(e) => handleChange("name.first", e.target.value)}
                required
              />
            </Grid>

            <Grid item xs={12} sm={4.5}>
              <TextField
                fullWidth
                label="Last Name"
                value={formData.name?.last || ""}
                onChange={(e) => handleChange("name.last", e.target.value)}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email || ""}
                onChange={(e) => handleChange("email", e.target.value)}
                required
              />
            </Grid>

            {/* Contact Information */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                Contact Information
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                value={formData.phone || ""}
                onChange={(e) => handleChange("phone", e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Cell Phone"
                value={formData.cell || ""}
                onChange={(e) => handleChange("cell", e.target.value)}
              />
            </Grid>

            {/* Address Information */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                Address Information
              </Typography>
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Street Number"
                type="number"
                value={formData.location?.street?.number || ""}
                onChange={(e) =>
                  handleChange(
                    "location.street.number",
                    parseInt(e.target.value) || 0,
                  )
                }
              />
            </Grid>

            <Grid item xs={12} sm={9}>
              <TextField
                fullWidth
                label="Street Name"
                value={formData.location?.street?.name || ""}
                onChange={(e) =>
                  handleChange("location.street.name", e.target.value)
                }
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="City"
                value={formData.location?.city || ""}
                onChange={(e) => handleChange("location.city", e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="State"
                value={formData.location?.state || ""}
                onChange={(e) => handleChange("location.state", e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Postal Code"
                value={formData.location?.postcode || ""}
                onChange={(e) =>
                  handleChange("location.postcode", e.target.value)
                }
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Country"
                value={formData.location?.country || ""}
                onChange={(e) =>
                  handleChange("location.country", e.target.value)
                }
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
