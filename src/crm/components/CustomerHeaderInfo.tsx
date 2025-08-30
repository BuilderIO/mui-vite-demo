import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import type { Customer } from "../types/customer";

interface CustomerHeaderInfoProps {
  customer: Customer;
}

export default function CustomerHeaderInfo({
  customer,
}: CustomerHeaderInfoProps) {
  const fullName = `${customer.name.title} ${customer.name.first} ${customer.name.last}`;
  const registeredDate = new Date(
    customer.registered.date,
  ).toLocaleDateString();

  return (
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
              customer.gender.charAt(0).toUpperCase() + customer.gender.slice(1)
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
          Customer since {registeredDate} ({customer.registered.age} years)
        </Typography>
      </Box>
    </Box>
  );
}
