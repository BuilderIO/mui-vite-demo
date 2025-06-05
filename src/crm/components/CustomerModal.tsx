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
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  User,
  CreateUserRequest,
  UpdateUserRequest,
} from "../services/usersApi";

interface CustomerModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (userData: CreateUserRequest | UpdateUserRequest) => Promise<void>;
  user?: User | null;
  loading?: boolean;
}

const initialFormData = {
  email: "",
  username: "",
  password: "",
  firstName: "",
  lastName: "",
  title: "Mr",
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

export default function CustomerModal({
  open,
  onClose,
  onSave,
  user,
  loading = false,
}: CustomerModalProps) {
  const [formData, setFormData] = React.useState(initialFormData);
  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const isEditMode = Boolean(user);

  React.useEffect(() => {
    if (user) {
      setFormData({
        email: user.email || "",
        username: user.login.username || "",
        password: "",
        firstName: user.name.first || "",
        lastName: user.name.last || "",
        title: user.name.title || "Mr",
        gender: user.gender || "male",
        phone: user.phone || "",
        cell: user.cell || "",
        streetNumber: user.location?.street?.number?.toString() || "",
        streetName: user.location?.street?.name || "",
        city: user.location?.city || "",
        state: user.location?.state || "",
        country: user.location?.country || "",
        postcode: user.location?.postcode || "",
      });
    } else {
      setFormData(initialFormData);
    }
    setError(null);
  }, [user, open]);

  const handleInputChange =
    (field: string) =>
    (
      event:
        | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        | { target: { value: unknown } },
    ) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.value as string,
      }));
      setError(null);
    };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (isEditMode) {
        const updateData: UpdateUserRequest = {
          email: formData.email,
          name: {
            first: formData.firstName,
            last: formData.lastName,
            title: formData.title,
          },
          gender: formData.gender,
          phone: formData.phone,
          cell: formData.cell,
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
        };
        await onSave(updateData);
      } else {
        const createData: CreateUserRequest = {
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
        };
        await onSave(createData);
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {isEditMode ? "Edit Customer" : "Add New Customer"}
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Box
                sx={{ fontWeight: "medium", mb: 1, color: "text.secondary" }}
              >
                Basic Information
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleInputChange("email")}
                disabled={isSubmitting}
              />
            </Grid>
            {!isEditMode && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Username"
                    value={formData.username}
                    onChange={handleInputChange("username")}
                    disabled={isSubmitting}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange("password")}
                    disabled={isSubmitting}
                    helperText="Leave empty for auto-generated password"
                  />
                </Grid>
              </>
            )}

            {/* Name Information */}
            <Grid item xs={12} sm={2}>
              <FormControl fullWidth>
                <InputLabel>Title</InputLabel>
                <Select
                  value={formData.title}
                  label="Title"
                  onChange={handleInputChange("title")}
                  disabled={isSubmitting}
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
                required
                fullWidth
                label="First Name"
                value={formData.firstName}
                onChange={handleInputChange("firstName")}
                disabled={isSubmitting}
              />
            </Grid>
            <Grid item xs={12} sm={5}>
              <TextField
                required
                fullWidth
                label="Last Name"
                value={formData.lastName}
                onChange={handleInputChange("lastName")}
                disabled={isSubmitting}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Gender</InputLabel>
                <Select
                  value={formData.gender}
                  label="Gender"
                  onChange={handleInputChange("gender")}
                  disabled={isSubmitting}
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Contact Information */}
            <Grid item xs={12}>
              <Box
                sx={{
                  fontWeight: "medium",
                  mt: 2,
                  mb: 1,
                  color: "text.secondary",
                }}
              >
                Contact Information
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                value={formData.phone}
                onChange={handleInputChange("phone")}
                disabled={isSubmitting}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Cell Phone"
                value={formData.cell}
                onChange={handleInputChange("cell")}
                disabled={isSubmitting}
              />
            </Grid>

            {/* Address Information */}
            <Grid item xs={12}>
              <Box
                sx={{
                  fontWeight: "medium",
                  mt: 2,
                  mb: 1,
                  color: "text.secondary",
                }}
              >
                Address Information
              </Box>
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Street Number"
                type="number"
                value={formData.streetNumber}
                onChange={handleInputChange("streetNumber")}
                disabled={isSubmitting}
              />
            </Grid>
            <Grid item xs={12} sm={9}>
              <TextField
                fullWidth
                label="Street Name"
                value={formData.streetName}
                onChange={handleInputChange("streetName")}
                disabled={isSubmitting}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="City"
                value={formData.city}
                onChange={handleInputChange("city")}
                disabled={isSubmitting}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="State"
                value={formData.state}
                onChange={handleInputChange("state")}
                disabled={isSubmitting}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Post Code"
                value={formData.postcode}
                onChange={handleInputChange("postcode")}
                disabled={isSubmitting}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Country"
                value={formData.country}
                onChange={handleInputChange("country")}
                disabled={isSubmitting}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
          >
            {isSubmitting ? "Saving..." : isEditMode ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
