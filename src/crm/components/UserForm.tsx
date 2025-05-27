import * as React from "react";
import {
  Box,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import { User, CreateUserRequest } from "../hooks/useUsers";

interface UserFormProps {
  user?: User | null;
  onSubmit: (userData: CreateUserRequest) => void;
  loading?: boolean;
}

interface FormErrors {
  email?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  cell?: string;
}

export default function UserForm({
  user,
  onSubmit,
  loading = false,
}: UserFormProps) {
  const [formData, setFormData] = React.useState<CreateUserRequest>({
    email: user?.email || "",
    login: {
      username: user?.login.username || "",
      password: "",
    },
    name: {
      first: user?.name.first || "",
      last: user?.name.last || "",
      title: user?.name.title || "Mr",
    },
    gender: user?.gender || "male",
    location: {
      street: {
        number: user?.location.street?.number || 0,
        name: user?.location.street?.name || "",
      },
      city: user?.location.city || "",
      state: user?.location.state || "",
      country: user?.location.country || "",
      postcode: user?.location.postcode || "",
    },
    phone: user?.phone || "",
    cell: user?.cell || "",
  });

  const [errors, setErrors] = React.useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    // Username validation
    if (!formData.login.username) {
      newErrors.username = "Username is required";
    } else if (formData.login.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    // Name validation
    if (!formData.name.first) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.name.last) {
      newErrors.lastName = "Last name is required";
    }

    // Phone validation (optional but if provided, should be valid)
    const phoneRegex = /^[\d\-\+\(\)\s]+$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = "Invalid phone format";
    }

    if (formData.cell && !phoneRegex.test(formData.cell)) {
      newErrors.cell = "Invalid cell phone format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => {
      const keys = field.split(".");
      const newData = { ...prev };

      let current: any = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = value;
      return newData;
    });

    // Clear error for this field
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  React.useEffect(() => {
    if (user) {
      setFormData({
        email: user.email,
        login: {
          username: user.login.username,
          password: "",
        },
        name: {
          first: user.name.first,
          last: user.name.last,
          title: user.name.title,
        },
        gender: user.gender,
        location: {
          street: {
            number: user.location.street?.number || 0,
            name: user.location.street?.name || "",
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
  }, [user]);

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }} id="user-form">
      <Grid container spacing={2}>
        {/* Personal Information */}
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Title</InputLabel>
            <Select
              value={formData.name.title}
              label="Title"
              onChange={(e) => handleInputChange("name.title", e.target.value)}
              disabled={loading}
            >
              <MenuItem value="Mr">Mr</MenuItem>
              <MenuItem value="Mrs">Mrs</MenuItem>
              <MenuItem value="Ms">Ms</MenuItem>
              <MenuItem value="Dr">Dr</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Gender</InputLabel>
            <Select
              value={formData.gender}
              label="Gender"
              onChange={(e) => handleInputChange("gender", e.target.value)}
              disabled={loading}
            >
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="First Name"
            value={formData.name.first}
            onChange={(e) => handleInputChange("name.first", e.target.value)}
            error={!!errors.firstName}
            helperText={errors.firstName}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Last Name"
            value={formData.name.last}
            onChange={(e) => handleInputChange("name.last", e.target.value)}
            error={!!errors.lastName}
            helperText={errors.lastName}
            disabled={loading}
          />
        </Grid>

        {/* Contact Information */}
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Username"
            value={formData.login.username}
            onChange={(e) =>
              handleInputChange("login.username", e.target.value)
            }
            error={!!errors.username}
            helperText={errors.username}
            disabled={loading}
          />
        </Grid>

        {!user && (
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={formData.login.password}
              onChange={(e) =>
                handleInputChange("login.password", e.target.value)
              }
              helperText="Leave blank to auto-generate"
              disabled={loading}
            />
          </Grid>
        )}

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Phone"
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            error={!!errors.phone}
            helperText={errors.phone}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Cell Phone"
            value={formData.cell}
            onChange={(e) => handleInputChange("cell", e.target.value)}
            error={!!errors.cell}
            helperText={errors.cell}
            disabled={loading}
          />
        </Grid>

        {/* Address Information */}
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Street Number"
            type="number"
            value={formData.location?.street?.number || ""}
            onChange={(e) =>
              handleInputChange(
                "location.street.number",
                parseInt(e.target.value) || 0,
              )
            }
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} sm={8}>
          <TextField
            fullWidth
            label="Street Name"
            value={formData.location?.street?.name || ""}
            onChange={(e) =>
              handleInputChange("location.street.name", e.target.value)
            }
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="City"
            value={formData.location?.city || ""}
            onChange={(e) => handleInputChange("location.city", e.target.value)}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="State"
            value={formData.location?.state || ""}
            onChange={(e) =>
              handleInputChange("location.state", e.target.value)
            }
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Country"
            value={formData.location?.country || ""}
            onChange={(e) =>
              handleInputChange("location.country", e.target.value)
            }
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Postal Code"
            value={formData.location?.postcode || ""}
            onChange={(e) =>
              handleInputChange("location.postcode", e.target.value)
            }
            disabled={loading}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
