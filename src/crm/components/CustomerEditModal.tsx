import * as React from "react";
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
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { User } from "../pages/Customers";

interface CustomerEditModalProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

interface FormData {
  email: string;
  username: string;
  password: string;
  title: string;
  firstName: string;
  lastName: string;
  gender: string;
  streetNumber: string;
  streetName: string;
  city: string;
  state: string;
  country: string;
  postcode: string;
  phone: string;
  cell: string;
}

const USERS_API_BASE = "https://user-api.builder-io.workers.dev/api";

const titleOptions = ["Mr", "Mrs", "Ms", "Miss", "Dr", "Prof"];
const genderOptions = ["male", "female"];

export default function CustomerEditModal({
  open,
  onClose,
  user,
  onSuccess,
  onError,
}: CustomerEditModalProps) {
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState<FormData>({
    email: "",
    username: "",
    password: "",
    title: "Mr",
    firstName: "",
    lastName: "",
    gender: "male",
    streetNumber: "",
    streetName: "",
    city: "",
    state: "",
    country: "",
    postcode: "",
    phone: "",
    cell: "",
  });

  const [errors, setErrors] = React.useState<Partial<FormData>>({});

  const isEdit = Boolean(user);

  React.useEffect(() => {
    if (user) {
      setFormData({
        email: user.email || "",
        username: user.login.username || "",
        password: "", // Never populate password for security
        title: user.name.title || "Mr",
        firstName: user.name.first || "",
        lastName: user.name.last || "",
        gender: user.gender || "male",
        streetNumber: user.location?.street?.number?.toString() || "",
        streetName: user.location?.street?.name || "",
        city: user.location?.city || "",
        state: user.location?.state || "",
        country: user.location?.country || "",
        postcode: user.location?.postcode || "",
        phone: user.phone || "",
        cell: user.cell || "",
      });
    } else {
      setFormData({
        email: "",
        username: "",
        password: "",
        title: "Mr",
        firstName: "",
        lastName: "",
        gender: "male",
        streetNumber: "",
        streetName: "",
        city: "",
        state: "",
        country: "",
        postcode: "",
        phone: "",
        cell: "",
      });
    }
    setErrors({});
  }, [user, open]);

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.username) {
      newErrors.username = "Username is required";
    }

    if (!isEdit && !formData.password) {
      newErrors.password = "Password is required for new users";
    }

    if (!formData.firstName) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName) {
      newErrors.lastName = "Last name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange =
    (field: keyof FormData) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({
          ...prev,
          [field]: undefined,
        }));
      }
    };

  const handleSelectChange =
    (field: keyof FormData) => (event: { target: { value: string } }) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const payload: any = {
        email: formData.email,
        login: {
          username: formData.username,
          ...(formData.password && { password: formData.password }),
        },
        name: {
          title: formData.title,
          first: formData.firstName,
          last: formData.lastName,
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

      const url = isEdit
        ? `${USERS_API_BASE}/users/${user!.login.uuid}`
        : `${USERS_API_BASE}/users`;

      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `Failed to ${isEdit ? "update" : "create"} user`,
        );
      }

      const successMessage = isEdit
        ? "Customer updated successfully"
        : "Customer created successfully";

      onSuccess(successMessage);
      onClose();
    } catch (err) {
      onError(
        err instanceof Error
          ? err.message
          : `Failed to ${isEdit ? "update" : "create"} customer`,
      );
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
        sx: { minHeight: "80vh" },
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            {isEdit ? "Edit Customer" : "Add New Customer"}
          </Typography>
          <IconButton onClick={handleClose} disabled={loading}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Account Information */}
          <Grid item xs={12}>
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ fontWeight: 600 }}
            >
              Account Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email Address"
              value={formData.email}
              onChange={handleInputChange("email")}
              error={Boolean(errors.email)}
              helperText={errors.email}
              disabled={loading}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Username"
              value={formData.username}
              onChange={handleInputChange("username")}
              error={Boolean(errors.username)}
              helperText={errors.username}
              disabled={loading}
              required
            />
          </Grid>

          {!isEdit && (
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="password"
                label="Password"
                value={formData.password}
                onChange={handleInputChange("password")}
                error={Boolean(errors.password)}
                helperText={errors.password}
                disabled={loading}
                required
              />
            </Grid>
          )}

          {/* Personal Information */}
          <Grid item xs={12}>
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ fontWeight: 600, mt: 2 }}
            >
              Personal Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel>Title</InputLabel>
              <Select
                value={formData.title}
                onChange={handleSelectChange("title")}
                label="Title"
                disabled={loading}
              >
                {titleOptions.map((title) => (
                  <MenuItem key={title} value={title}>
                    {title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4.5}>
            <TextField
              fullWidth
              label="First Name"
              value={formData.firstName}
              onChange={handleInputChange("firstName")}
              error={Boolean(errors.firstName)}
              helperText={errors.firstName}
              disabled={loading}
              required
            />
          </Grid>

          <Grid item xs={12} sm={4.5}>
            <TextField
              fullWidth
              label="Last Name"
              value={formData.lastName}
              onChange={handleInputChange("lastName")}
              error={Boolean(errors.lastName)}
              helperText={errors.lastName}
              disabled={loading}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Gender</InputLabel>
              <Select
                value={formData.gender}
                onChange={handleSelectChange("gender")}
                label="Gender"
                disabled={loading}
              >
                {genderOptions.map((gender) => (
                  <MenuItem key={gender} value={gender}>
                    {gender.charAt(0).toUpperCase() + gender.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Address Information */}
          <Grid item xs={12}>
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ fontWeight: 600, mt: 2 }}
            >
              Address Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Street Number"
              value={formData.streetNumber}
              onChange={handleInputChange("streetNumber")}
              disabled={loading}
              type="number"
            />
          </Grid>

          <Grid item xs={12} sm={9}>
            <TextField
              fullWidth
              label="Street Name"
              value={formData.streetName}
              onChange={handleInputChange("streetName")}
              disabled={loading}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="City"
              value={formData.city}
              onChange={handleInputChange("city")}
              disabled={loading}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="State/Province"
              value={formData.state}
              onChange={handleInputChange("state")}
              disabled={loading}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Country"
              value={formData.country}
              onChange={handleInputChange("country")}
              disabled={loading}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Postal Code"
              value={formData.postcode}
              onChange={handleInputChange("postcode")}
              disabled={loading}
            />
          </Grid>

          {/* Contact Information */}
          <Grid item xs={12}>
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ fontWeight: 600, mt: 2 }}
            >
              Contact Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone Number"
              value={formData.phone}
              onChange={handleInputChange("phone")}
              disabled={loading}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Cell Number"
              value={formData.cell}
              onChange={handleInputChange("cell")}
              disabled={loading}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={handleClose} disabled={loading} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={18} /> : null}
        >
          {loading
            ? isEdit
              ? "Updating..."
              : "Creating..."
            : isEdit
              ? "Update Customer"
              : "Create Customer"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
