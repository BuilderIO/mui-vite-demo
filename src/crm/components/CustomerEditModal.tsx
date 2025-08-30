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
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import CustomerEditModalHeader from "./CustomerEditModalHeader";

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

interface CustomerEditModalProps {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onSave: (user: User) => void;
}

export default function CustomerEditModal({
  open,
  user,
  onClose,
  onSave,
}: CustomerEditModalProps) {
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
  };

  const handleSave = async () => {
    if (!user || !formData) return;

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
          errorData.error || `HTTP error! status: ${response.status}`,
        );
      }

      const result = await response.json();

      if (result.success) {
        setSuccess(true);
        onSave(formData as User);

        // Auto close after 2 seconds
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        throw new Error(result.error || "Failed to update user");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    setSuccess(false);
    onClose();
  };

  if (!user || !formData) return null;

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
      <DialogTitle sx={{ m: 0, p: 2, pb: 1 }}>
        <CustomerEditModalHeader user={user} onClose={handleClose} />
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            User updated successfully! Closing modal...
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Personal Information */}
          <Grid size={12}>
            <Typography variant="h6" gutterBottom>
              Personal Information
            </Typography>
          </Grid>

          <Grid size={4}>
            <FormControl fullWidth>
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

          <Grid size={4}>
            <TextField
              fullWidth
              label="First Name"
              value={formData.name?.first || ""}
              onChange={(e) => handleInputChange("name.first", e.target.value)}
            />
          </Grid>

          <Grid size={4}>
            <TextField
              fullWidth
              label="Last Name"
              value={formData.name?.last || ""}
              onChange={(e) => handleInputChange("name.last", e.target.value)}
            />
          </Grid>

          <Grid size={6}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email || ""}
              onChange={(e) => handleInputChange("email", e.target.value)}
            />
          </Grid>

          <Grid size={6}>
            <FormControl fullWidth>
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

          {/* Contact Information */}
          <Grid size={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Contact Information
            </Typography>
          </Grid>

          <Grid size={6}>
            <TextField
              fullWidth
              label="Phone"
              value={formData.phone || ""}
              onChange={(e) => handleInputChange("phone", e.target.value)}
            />
          </Grid>

          <Grid size={6}>
            <TextField
              fullWidth
              label="Cell Phone"
              value={formData.cell || ""}
              onChange={(e) => handleInputChange("cell", e.target.value)}
            />
          </Grid>

          {/* Address Information */}
          <Grid size={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Address Information
            </Typography>
          </Grid>

          <Grid size={3}>
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
            />
          </Grid>

          <Grid size={9}>
            <TextField
              fullWidth
              label="Street Name"
              value={formData.location?.street?.name || ""}
              onChange={(e) =>
                handleInputChange("location.street.name", e.target.value)
              }
            />
          </Grid>

          <Grid size={6}>
            <TextField
              fullWidth
              label="City"
              value={formData.location?.city || ""}
              onChange={(e) =>
                handleInputChange("location.city", e.target.value)
              }
            />
          </Grid>

          <Grid size={6}>
            <TextField
              fullWidth
              label="State"
              value={formData.location?.state || ""}
              onChange={(e) =>
                handleInputChange("location.state", e.target.value)
              }
            />
          </Grid>

          <Grid size={6}>
            <TextField
              fullWidth
              label="Country"
              value={formData.location?.country || ""}
              onChange={(e) =>
                handleInputChange("location.country", e.target.value)
              }
            />
          </Grid>

          <Grid size={6}>
            <TextField
              fullWidth
              label="Postal Code"
              value={formData.location?.postcode || ""}
              onChange={(e) =>
                handleInputChange("location.postcode", e.target.value)
              }
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={handleClose} disabled={loading} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={loading || success}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
