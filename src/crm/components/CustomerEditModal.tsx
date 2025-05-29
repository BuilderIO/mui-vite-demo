import * as React from "react";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Stack,
  Typography,
  Divider,
} from "@mui/material";
import { User, UserFormData } from "../types/user";

interface CustomerEditModalProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
  onSave: (
    userId: string,
    userData: Partial<UserFormData>,
  ) => Promise<{ success: boolean; error?: string }>;
  loading: boolean;
}

export default function CustomerEditModal({
  open,
  onClose,
  user,
  onSave,
  loading,
}: CustomerEditModalProps) {
  const [formData, setFormData] = useState<UserFormData>({
    email: "",
    name: {
      title: "",
      first: "",
      last: "",
    },
    gender: "",
    location: {
      street: {
        number: 0,
        name: "",
      },
      city: "",
      state: "",
      country: "",
      postcode: "",
    },
    phone: "",
    cell: "",
  });

  const [saveError, setSaveError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email,
        name: {
          title: user.name.title,
          first: user.name.first,
          last: user.name.last,
        },
        gender: user.gender,
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
    }
    setSaveError(null);
  }, [user]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => {
      const keys = field.split(".");
      if (keys.length === 1) {
        return { ...prev, [field]: value };
      }

      // Handle nested properties
      const newData = { ...prev };
      let current: any = newData;

      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;

      return newData;
    });
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    setSaveError(null);

    try {
      const result = await onSave(user.login.uuid, formData);
      if (result.success) {
        onClose();
      } else {
        setSaveError(result.error || "Failed to update user");
      }
    } catch (error) {
      setSaveError("An unexpected error occurred");
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setSaveError(null);
    onClose();
  };

  if (!user) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: "70vh" },
      }}
    >
      <DialogTitle>
        <Typography variant="h6" component="div">
          Edit Customer: {user.name.first} {user.name.last}
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3}>
          {saveError && (
            <Alert severity="error" onClose={() => setSaveError(null)}>
              {saveError}
            </Alert>
          )}

          {/* Personal Information */}
          <div>
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ fontWeight: 600 }}
            >
              Personal Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Title</InputLabel>
                  <Select
                    value={formData.name.title}
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
              <Grid item xs={12} sm={5}>
                <TextField
                  fullWidth
                  size="small"
                  label="First Name"
                  value={formData.name.first}
                  onChange={(e) =>
                    handleInputChange("name.first", e.target.value)
                  }
                  required
                />
              </Grid>
              <Grid item xs={12} sm={5}>
                <TextField
                  fullWidth
                  size="small"
                  label="Last Name"
                  value={formData.name.last}
                  onChange={(e) =>
                    handleInputChange("name.last", e.target.value)
                  }
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Gender</InputLabel>
                  <Select
                    value={formData.gender}
                    label="Gender"
                    onChange={(e) =>
                      handleInputChange("gender", e.target.value)
                    }
                  >
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </div>

          <Divider />

          {/* Contact Information */}
          <div>
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ fontWeight: 600 }}
            >
              Contact Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Cell Phone"
                  value={formData.cell}
                  onChange={(e) => handleInputChange("cell", e.target.value)}
                />
              </Grid>
            </Grid>
          </div>

          <Divider />

          {/* Address Information */}
          <div>
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ fontWeight: 600 }}
            >
              Address Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  size="small"
                  label="Street Number"
                  type="number"
                  value={formData.location.street.number}
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
                  size="small"
                  label="Street Name"
                  value={formData.location.street.name}
                  onChange={(e) =>
                    handleInputChange("location.street.name", e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="City"
                  value={formData.location.city}
                  onChange={(e) =>
                    handleInputChange("location.city", e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  size="small"
                  label="State"
                  value={formData.location.state}
                  onChange={(e) =>
                    handleInputChange("location.state", e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  size="small"
                  label="Postal Code"
                  value={formData.location.postcode}
                  onChange={(e) =>
                    handleInputChange("location.postcode", e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Country"
                  value={formData.location.country}
                  onChange={(e) =>
                    handleInputChange("location.country", e.target.value)
                  }
                />
              </Grid>
            </Grid>
          </div>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleClose} disabled={saving}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={saving || loading}
          startIcon={saving ? <CircularProgress size={16} /> : null}
        >
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
