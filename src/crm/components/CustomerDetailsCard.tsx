import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonIcon from "@mui/icons-material/Person";
import CakeIcon from "@mui/icons-material/Cake";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import type { Customer } from "../types/customer";

interface CustomerDetailsCardProps {
  open: boolean;
  customer: Customer | null;
  onClose: () => void;
  onEdit: (customer: Customer) => void;
}

interface DetailItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | React.ReactNode;
}

function DetailItem({ icon, label, value }: DetailItemProps) {
  return (
    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1, mb: 2 }}>
      <Box sx={{ color: "text.secondary", mt: 0.5 }}>{icon}</Box>
      <Box sx={{ flex: 1 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
          {label}
        </Typography>
        <Typography variant="body1">{value}</Typography>
      </Box>
    </Box>
  );
}

export default function CustomerDetailsCard({
  open,
  customer,
  onClose,
  onEdit,
}: CustomerDetailsCardProps) {
  if (!customer) {
    return null;
  }

  const fullName = `${customer.name.title} ${customer.name.first} ${customer.name.last}`;
  const address = `${customer.location.street.number} ${customer.location.street.name}, ${customer.location.city}, ${customer.location.state} ${customer.location.postcode}, ${customer.location.country}`;
  const registeredDate = new Date(
    customer.registered.date,
  ).toLocaleDateString();
  const birthDate = new Date(customer.dob.date).toLocaleDateString();

  const handleEdit = () => {
    onEdit(customer);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: "500px" },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6">Customer Details</Typography>
          <IconButton onClick={handleEdit} color="primary">
            <EditIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ pt: 1 }}>
          {/* Header with Avatar and Basic Info */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <Avatar
              src={customer.picture?.large}
              alt={fullName}
              sx={{ width: 80, height: 80, mr: 2 }}
            >
              {fullName.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h5" gutterBottom>
                {fullName}
              </Typography>
              <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                <Chip
                  label={
                    customer.gender.charAt(0).toUpperCase() +
                    customer.gender.slice(1)
                  }
                  color={customer.gender === "male" ? "primary" : "secondary"}
                  size="small"
                />
                <Chip
                  label={`${customer.dob.age} years old`}
                  variant="outlined"
                  size="small"
                />
                <Chip label={customer.nat} variant="outlined" size="small" />
              </Box>
              <Typography variant="body2" color="text.secondary">
                Customer since {registeredDate} ({customer.registered.age}{" "}
                years)
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            {/* Contact Information */}
            <Grid item xs={12} md={6}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ color: "primary.main" }}
              >
                Contact Information
              </Typography>

              <DetailItem
                icon={<EmailIcon fontSize="small" />}
                label="Email Address"
                value={customer.email}
              />

              {customer.phone && (
                <DetailItem
                  icon={<PhoneIcon fontSize="small" />}
                  label="Phone Number"
                  value={customer.phone}
                />
              )}

              {customer.cell && (
                <DetailItem
                  icon={<PhoneIcon fontSize="small" />}
                  label="Cell Phone"
                  value={customer.cell}
                />
              )}

              <DetailItem
                icon={<PersonIcon fontSize="small" />}
                label="Username"
                value={customer.login.username}
              />
            </Grid>

            {/* Personal Information */}
            <Grid item xs={12} md={6}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ color: "primary.main" }}
              >
                Personal Information
              </Typography>

              <DetailItem
                icon={<CakeIcon fontSize="small" />}
                label="Date of Birth"
                value={`${birthDate} (${customer.dob.age} years old)`}
              />

              <DetailItem
                icon={<AccessTimeIcon fontSize="small" />}
                label="Customer Since"
                value={`${registeredDate} (${customer.registered.age} years)`}
              />

              {customer.location.timezone && (
                <DetailItem
                  icon={<AccessTimeIcon fontSize="small" />}
                  label="Timezone"
                  value={`${customer.location.timezone.offset} - ${customer.location.timezone.description}`}
                />
              )}
            </Grid>

            {/* Address Information */}
            <Grid item xs={12}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ color: "primary.main" }}
              >
                Address Information
              </Typography>

              <DetailItem
                icon={<LocationOnIcon fontSize="small" />}
                label="Full Address"
                value={address}
              />

              {customer.location.coordinates && (
                <DetailItem
                  icon={<LocationOnIcon fontSize="small" />}
                  label="Coordinates"
                  value={`${customer.location.coordinates.latitude}, ${customer.location.coordinates.longitude}`}
                />
              )}
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>Close</Button>
        <Button variant="contained" onClick={handleEdit}>
          Edit Customer
        </Button>
      </DialogActions>
    </Dialog>
  );
}
