import * as React from "react";
import { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import { customersApi } from "../utils/customersApi";
import type {
  Customer,
  CreateCustomerRequest,
  UpdateCustomerRequest,
} from "../types/customer";

interface CustomerDialogProps {
  open: boolean;
  customer?: Customer | null;
  onClose: () => void;
  onSave: () => void;
}

interface FormData {
  firstName: string;
  lastName: string;
  title: string;
  email: string;
  username: string;
  password: string;
  gender: string;
  phone: string;
  cell: string;
  streetNumber: string;
  streetName: string;
  city: string;
  state: string;
  country: string;
  postcode: string;
}

const initialFormData: FormData = {
  firstName: "",
  lastName: "",
  title: "Mr",
  email: "",
  username: "",
  password: "",
  gender: "male",
  phone: "",
  cell: "",
  streetNumber: "",
  streetName: "",
  city: "",
  state: "",
  country: "",
  postcode: "",
};

export default function CustomerDialog({
  open,
  customer,
  onClose,
  onSave,
}: CustomerDialogProps) {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!customer;

  useEffect(() => {
    if (customer) {
      setFormData({
        firstName: customer.name.first,
        lastName: customer.name.last,
        title: customer.name.title,
        email: customer.email,
        username: customer.login.username,
        password: "", // Don't populate password for editing
        gender: customer.gender,
        phone: customer.phone || "",
        cell: customer.cell || "",
        streetNumber: customer.location.street.number.toString(),
        streetName: customer.location.street.name,
        city: customer.location.city,
        state: customer.location.state,
        country: customer.location.country,
        postcode: customer.location.postcode,
      });
    } else {
      setFormData(initialFormData);
    }
    setError(null);
  }, [customer, open]);

  const handleInputChange =
    (field: keyof FormData) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const handleSelectChange = (field: keyof FormData) => (event: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.firstName.trim()) {
      setError("First name is required");
      return false;
    }
    if (!formData.lastName.trim()) {
      setError("Last name is required");
      return false;
    }
    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!formData.username.trim()) {
      setError("Username is required");
      return false;
    }
    if (!isEditing && !formData.password.trim()) {
      setError("Password is required for new customers");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (isEditing && customer) {
        const updateData: UpdateCustomerRequest = {
          name: {
            first: formData.firstName,
            last: formData.lastName,
            title: formData.title,
          },
          location: {
            street: {
              number: parseInt(formData.streetNumber) || 0,
              name: formData.streetName,
            },
            city: formData.city,
            state: formData.state,
            country: formData.country,
            postcode: formData.postcode,
          },
          email: formData.email,
          phone: formData.phone,
          cell: formData.cell,
        };

        await customersApi.updateCustomer(customer.login.uuid, updateData);
      } else {
        const createData: CreateCustomerRequest = {
          email: formData.email,
          login: {
            username: formData.username,
            password: formData.password,
          },
          name: {
            first: formData.firstName,
            last: formData.lastName,
            title: formData.title,
          },
          gender: formData.gender,
          location: {
            street: {
              number: parseInt(formData.streetNumber) || 0,
              name: formData.streetName,
            },
            city: formData.city,
            state: formData.state,
            country: formData.country,
            postcode: formData.postcode,
          },
          phone: formData.phone,
          cell: formData.cell,
        };

        await customersApi.createCustomer(createData);
      }

      onSave();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: "600px" },
      }}
    >
      <DialogTitle>
        {isEditing ? "Edit Customer" : "Add New Customer"}
      </DialogTitle>

      <DialogContent>
        <Box sx={{ pt: 1 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={2}>
            {/* Personal Information */}
            <Grid item xs={12}>
              <Box sx={{ fontWeight: "bold", mb: 1, color: "text.secondary" }}>
                Personal Information
              </Box>
            </Grid>

            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel>Title</InputLabel>
                <Select
                  value={formData.title}
                  label="Title"
                  onChange={handleSelectChange("title")}
                  disabled={loading}
                >
                  <MenuItem value="Mr">Mr</MenuItem>
                  <MenuItem value="Mrs">Mrs</MenuItem>
                  <MenuItem value="Ms">Ms</MenuItem>
                  <MenuItem value="Miss">Miss</MenuItem>
                  <MenuItem value="Dr">Dr</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4.5}>
              <TextField
                label="First Name"
                fullWidth
                required
                value={formData.firstName}
                onChange={handleInputChange("firstName")}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12} sm={4.5}>
              <TextField
                label="Last Name"
                fullWidth
                required
                value={formData.lastName}
                onChange={handleInputChange("lastName")}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                required
                value={formData.email}
                onChange={handleInputChange("email")}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Gender</InputLabel>
                <Select
                  value={formData.gender}
                  label="Gender"
                  onChange={handleSelectChange("gender")}
                  disabled={loading}
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Account Information */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Box sx={{ fontWeight: "bold", mb: 1, color: "text.secondary" }}>
                Account Information
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Username"
                fullWidth
                required
                value={formData.username}
                onChange={handleInputChange("username")}
                disabled={loading || isEditing}
                helperText={isEditing ? "Username cannot be changed" : ""}
              />
            </Grid>

            {!isEditing && (
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Password"
                  type="password"
                  fullWidth
                  required
                  value={formData.password}
                  onChange={handleInputChange("password")}
                  disabled={loading}
                />
              </Grid>
            )}

            {/* Contact Information */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Box sx={{ fontWeight: "bold", mb: 1, color: "text.secondary" }}>
                Contact Information
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Phone"
                fullWidth
                value={formData.phone}
                onChange={handleInputChange("phone")}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Cell Phone"
                fullWidth
                value={formData.cell}
                onChange={handleInputChange("cell")}
                disabled={loading}
              />
            </Grid>

            {/* Address Information */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Box sx={{ fontWeight: "bold", mb: 1, color: "text.secondary" }}>
                Address Information
              </Box>
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                label="Street Number"
                fullWidth
                value={formData.streetNumber}
                onChange={handleInputChange("streetNumber")}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12} sm={9}>
              <TextField
                label="Street Name"
                fullWidth
                value={formData.streetName}
                onChange={handleInputChange("streetName")}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="City"
                fullWidth
                value={formData.city}
                onChange={handleInputChange("city")}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                label="State"
                fullWidth
                value={formData.state}
                onChange={handleInputChange("state")}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                label="Postcode"
                fullWidth
                value={formData.postcode}
                onChange={handleInputChange("postcode")}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Country"
                fullWidth
                value={formData.country}
                onChange={handleInputChange("country")}
                disabled={loading}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 1 }}>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? "Saving..." : isEditing ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
