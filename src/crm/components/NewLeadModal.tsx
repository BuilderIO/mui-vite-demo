import * as React from "react";
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
  FormHelperText,
  Box,
  Typography,
  Divider,
} from "@mui/material";
import { useState } from "react";

interface NewLeadModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface LeadFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  title: string;
  source: string;
  status: string;
  notes: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postcode: string;
}

const initialFormData: LeadFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  company: "",
  title: "",
  source: "",
  status: "new",
  notes: "",
  street: "",
  city: "",
  state: "",
  country: "",
  postcode: "",
};

const leadSources = [
  "Website",
  "Referral",
  "Social Media",
  "Email Campaign",
  "Cold Call",
  "Trade Show",
  "Advertisement",
  "Other",
];

const leadStatuses = [
  "new",
  "contacted",
  "qualified",
  "proposal",
  "negotiation",
  "closed-won",
  "closed-lost",
];

export default function NewLeadModal({
  open,
  onClose,
  onSuccess,
}: NewLeadModalProps) {
  const [formData, setFormData] = useState<LeadFormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<LeadFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange =
    (field: keyof LeadFormData) =>
    (
      event:
        | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        | { target: { value: string } },
    ) => {
      const value = event.target.value;
      setFormData((prev) => ({ ...prev, [field]: value }));

      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      }
    };

  const validateForm = (): boolean => {
    const newErrors: Partial<LeadFormData> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.company.trim()) {
      newErrors.company = "Company is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Transform form data to match Users API format
      const userData = {
        email: formData.email,
        login: {
          username: formData.email.split("@")[0], // Use email prefix as username
          password: "temp_password_123", // This should be handled properly in a real app
        },
        name: {
          first: formData.firstName,
          last: formData.lastName,
          title: formData.title || "Mr", // Default title
        },
        location: {
          street: {
            number: 123, // Default number since street format is complex
            name: formData.street || "Main St",
          },
          city: formData.city || "Unknown",
          state: formData.state || "Unknown",
          country: formData.country || "USA",
          postcode: formData.postcode || "00000",
        },
        phone: formData.phone || "",
        // Additional fields for lead management (could be stored as metadata)
        company: formData.company,
        leadSource: formData.source,
        leadStatus: formData.status,
        notes: formData.notes,
      };

      const response = await fetch(
        "https://user-api.builder-io.workers.dev/api/users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      // Reset form
      setFormData(initialFormData);
      setErrors({});

      // Call success callback
      onSuccess?.();

      // Close modal
      onClose();

      console.log("Lead created successfully:", result);
    } catch (error) {
      console.error("Error creating lead:", error);
      // In a real app, you'd want to show a proper error message to the user
      alert("Error creating lead. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData(initialFormData);
      setErrors({});
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          component: "form",
          onSubmit: handleSubmit,
          sx: { backgroundImage: "none" },
        },
      }}
    >
      <DialogTitle>
        <Typography variant="h5" component="div">
          Add New Lead
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Create a new lead in your CRM system
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Grid container spacing={3}>
          {/* Personal Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Personal Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="First Name"
              value={formData.firstName}
              onChange={handleChange("firstName")}
              error={!!errors.firstName}
              helperText={errors.firstName}
              disabled={isSubmitting}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Last Name"
              value={formData.lastName}
              onChange={handleChange("lastName")}
              error={!!errors.lastName}
              helperText={errors.lastName}
              disabled={isSubmitting}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleChange("email")}
              error={!!errors.email}
              helperText={errors.email}
              disabled={isSubmitting}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone"
              value={formData.phone}
              onChange={handleChange("phone")}
              error={!!errors.phone}
              helperText={errors.phone}
              disabled={isSubmitting}
            />
          </Grid>

          {/* Company Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Company Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Company"
              value={formData.company}
              onChange={handleChange("company")}
              error={!!errors.company}
              helperText={errors.company}
              disabled={isSubmitting}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Job Title"
              value={formData.title}
              onChange={handleChange("title")}
              disabled={isSubmitting}
            />
          </Grid>

          {/* Lead Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Lead Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Lead Source</InputLabel>
              <Select
                value={formData.source}
                onChange={handleChange("source")}
                label="Lead Source"
                disabled={isSubmitting}
              >
                {leadSources.map((source) => (
                  <MenuItem key={source} value={source}>
                    {source}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                onChange={handleChange("status")}
                label="Status"
                disabled={isSubmitting}
              >
                {leadStatuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() +
                      status.slice(1).replace("-", " ")}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Address Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Address Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Street Address"
              value={formData.street}
              onChange={handleChange("street")}
              disabled={isSubmitting}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="City"
              value={formData.city}
              onChange={handleChange("city")}
              disabled={isSubmitting}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="State/Province"
              value={formData.state}
              onChange={handleChange("state")}
              disabled={isSubmitting}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Country"
              value={formData.country}
              onChange={handleChange("country")}
              disabled={isSubmitting}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Postal Code"
              value={formData.postcode}
              onChange={handleChange("postcode")}
              disabled={isSubmitting}
            />
          </Grid>

          {/* Notes */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Notes"
              multiline
              rows={4}
              value={formData.notes}
              onChange={handleChange("notes")}
              placeholder="Additional notes about this lead..."
              disabled={isSubmitting}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={handleClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Lead"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
