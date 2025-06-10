import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Box,
  Alert,
  Avatar,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { User, UserUpdateRequest } from "../types/user";

interface EditUserModalProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
  onSave: (userId: string, updates: UserUpdateRequest) => Promise<boolean>;
  loading: boolean;
}

export default function EditUserModal({
  open,
  onClose,
  user,
  onSave,
  loading,
}: EditUserModalProps) {
  const [formData, setFormData] = React.useState<UserUpdateRequest>({});
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  // Reset form when user changes or modal opens
  React.useEffect(() => {
    if (user && open) {
      setFormData({
        email: user.email,
        name: {
          title: user.name.title,
          first: user.name.first,
          last: user.name.last,
        },
        gender: user.gender,
        location: {
          city: user.location.city,
          state: user.location.state,
          country: user.location.country,
          postcode: user.location.postcode,
          street: {
            number: user.location.street.number,
            name: user.location.street.name,
          },
        },
        phone: user.phone,
        cell: user.cell,
      });
      setError(null);
      setSuccess(false);
    }
  }, [user, open]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => {
      const keys = field.split(".");
      const updated = { ...prev };

      if (keys.length === 1) {
        updated[keys[0] as keyof UserUpdateRequest] = value;
      } else if (keys.length === 2) {
        const [parent, child] = keys;
        updated[parent as keyof UserUpdateRequest] = {
          ...(updated[parent as keyof UserUpdateRequest] as any),
          [child]: value,
        };
      } else if (keys.length === 3) {
        const [parent, middle, child] = keys;
        updated[parent as keyof UserUpdateRequest] = {
          ...(updated[parent as keyof UserUpdateRequest] as any),
          [middle]: {
            ...((updated[parent as keyof UserUpdateRequest] as any)?.[middle] ||
              {}),
            [child]: value,
          },
        };
      }

      return updated;
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) return;

    setError(null);
    setSuccess(false);

    try {
      const success = await onSave(user.login.uuid, formData);
      if (success) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
        }, 1000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update user");
    }
  };

  const handleClose = () => {
    setError(null);
    setSuccess(false);
    onClose();
  };

  if (!user) return null;

  const fullName = `${user.name.first} ${user.name.last}`;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar
            src={user.picture.medium}
            alt={fullName}
            sx={{ width: 48, height: 48 }}
          />
          <Box>
            <Typography variant="h6">Edit Customer</Typography>
            <Typography variant="body2" color="text.secondary">
              {fullName} • {user.email}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Customer updated successfully!
            </Alert>
          )}

          <Grid container spacing={2}>
            {/* Personal Information */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 1 }}>
                Personal Information
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Title</InputLabel>
                <Select
                  value={formData.name?.title || ""}
                  label="Title"
                  onChange={(e) =>
                    handleInputChange("name.title", e.target.value)
                  }
                >
                  <MenuItem value="Mr">Mr</MenuItem>
                  <MenuItem value="Mrs">Mrs</MenuItem>
                  <MenuItem value="Ms">Ms</MenuItem>
                  <MenuItem value="Dr">Dr</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={4.5}>
              <TextField
                fullWidth
                label="First Name"
                size="small"
                value={formData.name?.first || ""}
                onChange={(e) =>
                  handleInputChange("name.first", e.target.value)
                }
                required
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4.5}>
              <TextField
                fullWidth
                label="Last Name"
                size="small"
                value={formData.name?.last || ""}
                onChange={(e) => handleInputChange("name.last", e.target.value)}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                size="small"
                value={formData.email || ""}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Gender</InputLabel>
                <Select
                  value={formData.gender || ""}
                  label="Gender"
                  onChange={(e) => handleInputChange("gender", e.target.value)}
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Contact Information */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 1 }}>
                Contact Information
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                size="small"
                value={formData.phone || ""}
                onChange={(e) => handleInputChange("phone", e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Cell Phone"
                size="small"
                value={formData.cell || ""}
                onChange={(e) => handleInputChange("cell", e.target.value)}
              />
            </Grid>

            {/* Address Information */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 1 }}>
                Address Information
              </Typography>
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Street Number"
                type="number"
                size="small"
                value={formData.location?.street?.number || ""}
                onChange={(e) =>
                  handleInputChange(
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
                size="small"
                value={formData.location?.street?.name || ""}
                onChange={(e) =>
                  handleInputChange("location.street.name", e.target.value)
                }
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="City"
                size="small"
                value={formData.location?.city || ""}
                onChange={(e) =>
                  handleInputChange("location.city", e.target.value)
                }
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="State/Province"
                size="small"
                value={formData.location?.state || ""}
                onChange={(e) =>
                  handleInputChange("location.state", e.target.value)
                }
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Country"
                size="small"
                value={formData.location?.country || ""}
                onChange={(e) =>
                  handleInputChange("location.country", e.target.value)
                }
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Postal Code"
                size="small"
                value={formData.location?.postcode || ""}
                onChange={(e) =>
                  handleInputChange("location.postcode", e.target.value)
                }
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || success}
            sx={{ minWidth: 80 }}
          >
            {loading ? "Saving..." : success ? "Saved!" : "Save"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
