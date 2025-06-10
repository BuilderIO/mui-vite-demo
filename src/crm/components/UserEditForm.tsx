import * as React from "react";
import {
  TextField,
  Grid,
  Box,
  Alert,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { User, UserUpdateRequest } from "../types/user";

interface UserEditFormProps {
  user: User;
  formData: UserUpdateRequest;
  onInputChange: (field: string, value: any) => void;
  error: string | null;
  success: boolean;
}

export default function UserEditForm({
  user,
  formData,
  onInputChange,
  error,
  success,
}: UserEditFormProps) {
  return (
    <>
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
              onChange={(e) => onInputChange("name.title", e.target.value)}
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
            onChange={(e) => onInputChange("name.first", e.target.value)}
            required
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4.5}>
          <TextField
            fullWidth
            label="Last Name"
            size="small"
            value={formData.name?.last || ""}
            onChange={(e) => onInputChange("name.last", e.target.value)}
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
            onChange={(e) => onInputChange("email", e.target.value)}
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth size="small">
            <InputLabel>Gender</InputLabel>
            <Select
              value={formData.gender || ""}
              label="Gender"
              onChange={(e) => onInputChange("gender", e.target.value)}
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
            onChange={(e) => onInputChange("phone", e.target.value)}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Cell Phone"
            size="small"
            value={formData.cell || ""}
            onChange={(e) => onInputChange("cell", e.target.value)}
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
              onInputChange(
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
              onInputChange("location.street.name", e.target.value)
            }
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="City"
            size="small"
            value={formData.location?.city || ""}
            onChange={(e) => onInputChange("location.city", e.target.value)}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="State/Province"
            size="small"
            value={formData.location?.state || ""}
            onChange={(e) => onInputChange("location.state", e.target.value)}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Country"
            size="small"
            value={formData.location?.country || ""}
            onChange={(e) => onInputChange("location.country", e.target.value)}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Postal Code"
            size="small"
            value={formData.location?.postcode || ""}
            onChange={(e) => onInputChange("location.postcode", e.target.value)}
          />
        </Grid>
      </Grid>
    </>
  );
}
