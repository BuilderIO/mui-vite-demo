import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

// User interface matching the API structure
interface User {
  login: {
    uuid: string;
    username: string;
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
  };
  email: string;
  phone: string;
}

interface EditCustomerModalProps {
  open: boolean;
  onClose: () => void;
  customer: User | null;
  onSave: (updatedCustomer: Partial<User>) => Promise<void>;
}

export default function EditCustomerModal({ 
  open, 
  onClose, 
  customer, 
  onSave 
}: EditCustomerModalProps) {
  const [formData, setFormData] = React.useState<Partial<User>>({});
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Initialize form data when customer changes
  React.useEffect(() => {
    if (customer) {
      setFormData({
        name: {
          title: customer.name?.title || "",
          first: customer.name?.first || "",
          last: customer.name?.last || "",
        },
        email: customer.email || "",
        gender: customer.gender || "",
        location: {
          street: {
            number: customer.location?.street?.number || 0,
            name: customer.location?.street?.name || "",
          },
          city: customer.location?.city || "",
          state: customer.location?.state || "",
          country: customer.location?.country || "",
          postcode: customer.location?.postcode || "",
        },
        phone: customer.phone || "",
      });
    }
  }, [customer]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => {
      const newData = { ...prev };
      const fieldPath = field.split('.');
      
      if (fieldPath.length === 1) {
        newData[fieldPath[0] as keyof User] = value;
      } else if (fieldPath.length === 2) {
        const [parent, child] = fieldPath;
        if (!newData[parent as keyof User]) {
          newData[parent as keyof User] = {} as any;
        }
        (newData[parent as keyof User] as any)[child] = value;
      } else if (fieldPath.length === 3) {
        const [parent, middle, child] = fieldPath;
        if (!newData[parent as keyof User]) {
          newData[parent as keyof User] = {} as any;
        }
        if (!(newData[parent as keyof User] as any)[middle]) {
          (newData[parent as keyof User] as any)[middle] = {};
        }
        (newData[parent as keyof User] as any)[middle][child] = value;
      }
      
      return newData;
    });
  };

  const handleSave = async () => {
    if (!customer) return;
    
    try {
      setLoading(true);
      setError(null);
      await onSave(formData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update customer");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    onClose();
  };

  if (!customer) return null;

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: "70vh" }
      }}
    >
      <DialogTitle>
        Edit Customer Details
      </DialogTitle>
      
      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Grid container spacing={3}>
          {/* Personal Information */}
          <Grid item xs={12}>
            <Box sx={{ mb: 2 }}>
              <h3 style={{ margin: "16px 0 8px 0", fontSize: "1.1rem" }}>Personal Information</h3>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Title</InputLabel>
              <Select
                value={formData.name?.title || ""}
                onChange={(e) => handleInputChange("name.title", e.target.value)}
                label="Title"
              >
                <MenuItem value="Mr">Mr</MenuItem>
                <MenuItem value="Mrs">Mrs</MenuItem>
                <MenuItem value="Ms">Ms</MenuItem>
                <MenuItem value="Dr">Dr</MenuItem>
                <MenuItem value="Prof">Prof</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={4.5}>
            <TextField
              fullWidth
              size="small"
              label="First Name"
              value={formData.name?.first || ""}
              onChange={(e) => handleInputChange("name.first", e.target.value)}
              required
            />
          </Grid>
          
          <Grid item xs={12} sm={4.5}>
            <TextField
              fullWidth
              size="small"
              label="Last Name"
              value={formData.name?.last || ""}
              onChange={(e) => handleInputChange("name.last", e.target.value)}
              required
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              label="Email"
              type="email"
              value={formData.email || ""}
              onChange={(e) => handleInputChange("email", e.target.value)}
              required
            />
          </Grid>
          
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
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
          
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              size="small"
              label="Phone"
              value={formData.phone || ""}
              onChange={(e) => handleInputChange("phone", e.target.value)}
            />
          </Grid>

          {/* Address Information */}
          <Grid item xs={12}>
            <Box sx={{ mb: 2, mt: 2 }}>
              <h3 style={{ margin: "16px 0 8px 0", fontSize: "1.1rem" }}>Address Information</h3>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              size="small"
              label="Street Number"
              type="number"
              value={formData.location?.street?.number || ""}
              onChange={(e) => handleInputChange("location.street.number", parseInt(e.target.value) || 0)}
            />
          </Grid>
          
          <Grid item xs={12} sm={9}>
            <TextField
              fullWidth
              size="small"
              label="Street Name"
              value={formData.location?.street?.name || ""}
              onChange={(e) => handleInputChange("location.street.name", e.target.value)}
            />
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size="small"
              label="City"
              value={formData.location?.city || ""}
              onChange={(e) => handleInputChange("location.city", e.target.value)}
            />
          </Grid>
          
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              size="small"
              label="State"
              value={formData.location?.state || ""}
              onChange={(e) => handleInputChange("location.state", e.target.value)}
            />
          </Grid>
          
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              size="small"
              label="Country"
              value={formData.location?.country || ""}
              onChange={(e) => handleInputChange("location.country", e.target.value)}
            />
          </Grid>
          
          <Grid item xs={12} sm={2}>
            <TextField
              fullWidth
              size="small"
              label="Postal Code"
              value={formData.location?.postcode || ""}
              onChange={(e) => handleInputChange("location.postcode", e.target.value)}
            />
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained" 
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} /> : null}
        >
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
