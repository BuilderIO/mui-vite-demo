import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Alert,
  CircularProgress,
  Box,
  Avatar,
  Typography,
  Divider,
} from "@mui/material";
import { User } from "../hooks/useUsers";

interface UserEditModalProps {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onSave: (userId: string, updates: Partial<User>) => Promise<void>;
}

export default function UserEditModal({
  open,
  user,
  onClose,
  onSave,
}: UserEditModalProps) {
  const [formData, setFormData] = React.useState<Partial<User>>({});
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Initialize form data when user changes
  React.useEffect(() => {
    if (user) {
      setFormData({
        name: { ...user.name },
        email: user.email,
        phone: user.phone,
        location: { ...user.location },
        login: { ...user.login },
      });
    }
    setError(null);
  }, [user]);

  const handleInputChange = (
    field: string,
    value: string,
    nestedField?: string,
  ) => {
    setFormData((prev) => {
      if (nestedField) {
        return {
          ...prev,
          [field]: {
            ...((prev as any)[field] || {}),
            [nestedField]: value,
          },
        };
      } else {
        return {
          ...prev,
          [field]: value,
        };
      }
    });
  };

  const handleLocationChange = (
    field: string,
    value: string,
    nestedField?: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      location: {
        ...((prev.location as any) || {}),
        [field]: nestedField
          ? {
              ...((prev.location as any)?.[field] || {}),
              [nestedField]: value,
            }
          : value,
      },
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      await onSave(user.login.uuid, formData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar
            src={user.picture?.thumbnail}
            alt={`${user.name.first} ${user.name.last}`}
            sx={{ width: 48, height: 48 }}
          >
            {user.name.first.charAt(0)}
            {user.name.last.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="h6">
              Edit User: {user.name.first} {user.name.last}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user.email}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={3}>
            {/* Personal Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Personal Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Title"
                value={formData.name?.title || ""}
                onChange={(e) =>
                  handleInputChange("name", e.target.value, "title")
                }
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="First Name"
                required
                value={formData.name?.first || ""}
                onChange={(e) =>
                  handleInputChange("name", e.target.value, "first")
                }
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Last Name"
                required
                value={formData.name?.last || ""}
                onChange={(e) =>
                  handleInputChange("name", e.target.value, "last")
                }
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                required
                value={formData.email || ""}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                value={formData.phone || ""}
                onChange={(e) => handleInputChange("phone", e.target.value)}
              />
            </Grid>

            {/* Location Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Location
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Street Number"
                type="number"
                value={formData.location?.street?.number || ""}
                onChange={(e) =>
                  handleLocationChange("street", e.target.value, "number")
                }
              />
            </Grid>

            <Grid item xs={12} sm={9}>
              <TextField
                fullWidth
                label="Street Name"
                value={formData.location?.street?.name || ""}
                onChange={(e) =>
                  handleLocationChange("street", e.target.value, "name")
                }
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="City"
                value={formData.location?.city || ""}
                onChange={(e) => handleLocationChange("city", e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="State"
                value={formData.location?.state || ""}
                onChange={(e) => handleLocationChange("state", e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Postcode"
                value={formData.location?.postcode || ""}
                onChange={(e) =>
                  handleLocationChange("postcode", e.target.value)
                }
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Country"
                value={formData.location?.country || ""}
                onChange={(e) =>
                  handleLocationChange("country", e.target.value)
                }
              />
            </Grid>

            {/* Account Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Account Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Username"
                value={formData.login?.username || ""}
                onChange={(e) =>
                  handleInputChange("login", e.target.value, "username")
                }
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
