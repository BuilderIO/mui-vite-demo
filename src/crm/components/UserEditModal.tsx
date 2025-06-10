import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
import { User, UpdateUserRequest, UsersApiService } from "../services/usersApi";

interface UserEditModalProps {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onUserUpdated: () => void;
}

export default function UserEditModal({
  open,
  user,
  onClose,
  onUserUpdated,
}: UserEditModalProps) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [formData, setFormData] = React.useState<UpdateUserRequest>({});

  React.useEffect(() => {
    if (user) {
      setFormData({
        name: {
          title: user.name.title,
          first: user.name.first,
          last: user.name.last,
        },
        email: user.email,
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
        gender: user.gender,
      });
    }
    setError(null);
  }, [user, open]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => {
      const keys = field.split(".");
      const result = { ...prev };
      let current: any = result;

      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = value;
      return result;
    });
  };

  const getNestedValue = (obj: any, path: string): string => {
    return path.split(".").reduce((current, key) => current?.[key] || "", obj);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      await UsersApiService.updateUser(user.login.uuid, formData);
      onUserUpdated();
      onClose();
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
      <DialogTitle>Edit User</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Title</InputLabel>
              <Select
                value={getNestedValue(formData, "name.title")}
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
                <MenuItem value="Prof">Prof</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              required
              fullWidth
              label="First Name"
              value={getNestedValue(formData, "name.first")}
              onChange={(e) => handleInputChange("name.first", e.target.value)}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              required
              fullWidth
              label="Last Name"
              value={getNestedValue(formData, "name.last")}
              onChange={(e) => handleInputChange("name.last", e.target.value)}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Email"
              type="email"
              value={formData.email || ""}
              onChange={(e) => handleInputChange("email", e.target.value)}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
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

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone"
              value={formData.phone || ""}
              onChange={(e) => handleInputChange("phone", e.target.value)}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Cell Phone"
              value={formData.cell || ""}
              onChange={(e) => handleInputChange("cell", e.target.value)}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Street Number"
              type="number"
              value={getNestedValue(formData, "location.street.number")}
              onChange={(e) =>
                handleInputChange("location.street.number", e.target.value)
              }
            />
          </Grid>

          <Grid item xs={12} sm={8}>
            <TextField
              fullWidth
              label="Street Name"
              value={getNestedValue(formData, "location.street.name")}
              onChange={(e) =>
                handleInputChange("location.street.name", e.target.value)
              }
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="City"
              value={getNestedValue(formData, "location.city")}
              onChange={(e) =>
                handleInputChange("location.city", e.target.value)
              }
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="State"
              value={getNestedValue(formData, "location.state")}
              onChange={(e) =>
                handleInputChange("location.state", e.target.value)
              }
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Postcode"
              value={getNestedValue(formData, "location.postcode")}
              onChange={(e) =>
                handleInputChange("location.postcode", e.target.value)
              }
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Country"
              value={getNestedValue(formData, "location.country")}
              onChange={(e) =>
                handleInputChange("location.country", e.target.value)
              }
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ pb: 3, px: 3 }}>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant="contained" type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update User"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
