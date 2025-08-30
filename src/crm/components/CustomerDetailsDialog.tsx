import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import type { Customer, UpdateCustomerRequest } from "../types/customer";

interface CustomerDetailsDialogProps {
  open: boolean;
  customer: Customer | null;
  onClose: () => void;
  onSave: (id: string, data: UpdateCustomerRequest) => Promise<void>;
}

export default function CustomerDetailsDialog({
  open,
  customer,
  onClose,
  onSave,
}: CustomerDetailsDialogProps) {
  const [formData, setFormData] = React.useState<UpdateCustomerRequest>({});
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (customer) {
      setFormData({
        name: {
          title: customer.name.title || "",
          first: customer.name.first || "",
          last: customer.name.last || "",
        },
        email: customer.email || "",
        phone: customer.phone || "",
        cell: customer.cell || "",
        gender: customer.gender || "",
        location: {
          street: {
            number: customer.location.street?.number || 0,
            name: customer.location.street?.name || "",
          },
          city: customer.location.city || "",
          state: customer.location.state || "",
          country: customer.location.country || "",
          postcode: customer.location.postcode || "",
        },
      });
    }
  }, [customer]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => {
      const keys = field.split(".");
      const updated = { ...prev };
      let current: any = updated;

      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = value;
      return updated;
    });
  };

  const handleSave = async () => {
    if (!customer) return;

    try {
      setLoading(true);
      setError(null);
      await onSave(customer.login.uuid, formData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save customer");
    } finally {
      setLoading(false);
    }
  };

  if (!customer) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar
            src={customer.picture?.medium}
            alt={`${customer.name.first} ${customer.name.last}`}
            sx={{ width: 56, height: 56 }}
          >
            {customer.name.first[0]}
            {customer.name.last[0]}
          </Avatar>
          <Box>
            <Typography variant="h6">
              {customer.name.first} {customer.name.last}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Customer ID: {customer.login.uuid}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Title</InputLabel>
              <Select
                value={formData.name?.title || ""}
                onChange={(e) =>
                  handleInputChange("name.title", e.target.value)
                }
                label="Title"
              >
                <MenuItem value="Mr">Mr</MenuItem>
                <MenuItem value="Mrs">Mrs</MenuItem>
                <MenuItem value="Ms">Ms</MenuItem>
                <MenuItem value="Miss">Miss</MenuItem>
                <MenuItem value="Dr">Dr</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="First Name"
              value={formData.name?.first || ""}
              onChange={(e) => handleInputChange("name.first", e.target.value)}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Last Name"
              value={formData.name?.last || ""}
              onChange={(e) => handleInputChange("name.last", e.target.value)}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
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
                onChange={(e) => handleInputChange("gender", e.target.value)}
                label="Gender"
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

          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
              Address
            </Typography>
          </Grid>

          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Street Number"
              type="number"
              value={formData.location?.street?.number || ""}
              onChange={(e) =>
                handleInputChange(
                  "location.street.number",
                  parseInt(e.target.value),
                )
              }
            />
          </Grid>

          <Grid item xs={12} sm={9}>
            <TextField
              fullWidth
              label="Street Name"
              value={formData.location?.street?.name || ""}
              onChange={(e) =>
                handleInputChange("location.street.name", e.target.value)
              }
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="City"
              value={formData.location?.city || ""}
              onChange={(e) =>
                handleInputChange("location.city", e.target.value)
              }
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
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Registration Date
                </Typography>
                <Typography variant="body1">
                  {new Date(customer.registered.date).toLocaleDateString()}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Date of Birth
                </Typography>
                <Typography variant="body1">
                  {new Date(customer.dob.date).toLocaleDateString()} (Age:{" "}
                  {customer.dob.age})
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Nationality
                </Typography>
                <Typography variant="body1">{customer.nat}</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} /> : null}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
