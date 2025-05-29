import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid2";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

interface User {
  login: {
    uuid: string;
    username: string;
    password: string;
  };
  name: {
    title: string;
    first: string;
    last: string;
  };
  gender: string;
  location: {
    street: {
      number: number;
      name: string;
    };
    city: string;
    state: string;
    country: string;
    postcode: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
    timezone: {
      offset: string;
      description: string;
    };
  };
  email: string;
  dob: {
    date: string;
    age: number;
  };
  registered: {
    date: string;
    age: number;
  };
  phone: string;
  cell: string;
  picture: {
    large: string;
    medium: string;
    thumbnail: string;
  };
  nat: string;
}

interface CrmCustomerEditModalProps {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onUserUpdated: () => void;
}

export default function CrmCustomerEditModal({
  open,
  user,
  onClose,
  onUserUpdated,
}: CrmCustomerEditModalProps) {
  const [formData, setFormData] = React.useState<Partial<User>>({});
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  React.useEffect(() => {
    if (user) {
      setFormData(user);
      setError(null);
      setSuccess(false);
    }
  }, [user]);

  const handleInputChange = (path: string, value: string | number) => {
    setFormData((prev) => {
      const newData = { ...prev };
      const pathArray = path.split(".");
      let current: any = newData;

      for (let i = 0; i < pathArray.length - 1; i++) {
        if (!current[pathArray[i]]) {
          current[pathArray[i]] = {};
        }
        current = current[pathArray[i]];
      }

      current[pathArray[pathArray.length - 1]] = value;
      return newData;
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://user-api.builder-io.workers.dev/api/users/${user.login.uuid}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `Failed to update user: ${response.statusText}`,
        );
      }

      setSuccess(true);
      setTimeout(() => {
        onUserUpdated();
      }, 1000);
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
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        component: "form",
        onSubmit: handleSubmit,
      }}
    >
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar src={user.picture.medium} sx={{ width: 48, height: 48 }}>
              {user.name.first[0]}
            </Avatar>
            <Box>
              <Typography variant="h6">Edit Customer</Typography>
              <Typography variant="body2" color="text.secondary">
                {user.name.first} {user.name.last} (@{user.login.username})
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={handleClose} disabled={loading}>
            <CloseRoundedIcon />
          </IconButton>
        </Box>
      </DialogTitle>

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
          <Grid size={12}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              Personal Information
            </Typography>
          </Grid>

          <Grid size={6}>
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
                <MenuItem value="Miss">Miss</MenuItem>
                <MenuItem value="Dr">Dr</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid size={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Gender</InputLabel>
              <Select
                value={formData.gender || ""}
                label="Gender"
                onChange={(e) => handleInputChange("gender", e.target.value)}
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid size={6}>
            <TextField
              label="First Name"
              value={formData.name?.first || ""}
              onChange={(e) => handleInputChange("name.first", e.target.value)}
              size="small"
              fullWidth
              required
            />
          </Grid>

          <Grid size={6}>
            <TextField
              label="Last Name"
              value={formData.name?.last || ""}
              onChange={(e) => handleInputChange("name.last", e.target.value)}
              size="small"
              fullWidth
              required
            />
          </Grid>

          <Grid size={12}>
            <TextField
              label="Email"
              type="email"
              value={formData.email || ""}
              onChange={(e) => handleInputChange("email", e.target.value)}
              size="small"
              fullWidth
              required
            />
          </Grid>

          {/* Contact Information */}
          <Grid size={12}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, mb: 1, mt: 2 }}
            >
              Contact Information
            </Typography>
          </Grid>

          <Grid size={6}>
            <TextField
              label="Phone"
              value={formData.phone || ""}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              size="small"
              fullWidth
            />
          </Grid>

          <Grid size={6}>
            <TextField
              label="Cell Phone"
              value={formData.cell || ""}
              onChange={(e) => handleInputChange("cell", e.target.value)}
              size="small"
              fullWidth
            />
          </Grid>

          {/* Location Information */}
          <Grid size={12}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, mb: 1, mt: 2 }}
            >
              Location Information
            </Typography>
          </Grid>

          <Grid size={4}>
            <TextField
              label="Street Number"
              type="number"
              value={formData.location?.street?.number || ""}
              onChange={(e) =>
                handleInputChange(
                  "location.street.number",
                  parseInt(e.target.value) || 0,
                )
              }
              size="small"
              fullWidth
            />
          </Grid>

          <Grid size={8}>
            <TextField
              label="Street Name"
              value={formData.location?.street?.name || ""}
              onChange={(e) =>
                handleInputChange("location.street.name", e.target.value)
              }
              size="small"
              fullWidth
            />
          </Grid>

          <Grid size={6}>
            <TextField
              label="City"
              value={formData.location?.city || ""}
              onChange={(e) =>
                handleInputChange("location.city", e.target.value)
              }
              size="small"
              fullWidth
            />
          </Grid>

          <Grid size={6}>
            <TextField
              label="State"
              value={formData.location?.state || ""}
              onChange={(e) =>
                handleInputChange("location.state", e.target.value)
              }
              size="small"
              fullWidth
            />
          </Grid>

          <Grid size={6}>
            <TextField
              label="Country"
              value={formData.location?.country || ""}
              onChange={(e) =>
                handleInputChange("location.country", e.target.value)
              }
              size="small"
              fullWidth
            />
          </Grid>

          <Grid size={6}>
            <TextField
              label="Postal Code"
              value={formData.location?.postcode || ""}
              onChange={(e) =>
                handleInputChange("location.postcode", e.target.value)
              }
              size="small"
              fullWidth
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={loading || success}
          startIcon={loading ? <CircularProgress size={16} /> : null}
        >
          {loading ? "Updating..." : "Update Customer"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
