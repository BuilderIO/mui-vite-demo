import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

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
  picture: {
    large: string;
    medium: string;
    thumbnail: string;
  };
}

interface CustomerEditModalHeaderProps {
  user: User;
  onClose: () => void;
}

export default function CustomerEditModalHeader({
  user,
  onClose,
}: CustomerEditModalHeaderProps) {
  return (
    <Box display="flex" alignItems="center" justifyContent="space-between">
      <Box display="flex" alignItems="center" gap={2}>
        <Avatar
          src={user.picture?.large}
          alt={`${user.name.first} ${user.name.last}`}
          sx={{ width: 48, height: 48 }}
        >
          {user.name.first.charAt(0).toUpperCase()}
        </Avatar>
        <Box>
          <Typography variant="h6">Edit Customer</Typography>
          <Typography variant="body2" color="text.secondary">
            {user.name.first} {user.name.last} (@{user.login.username})
          </Typography>
        </Box>
      </Box>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{ color: "grey.500" }}
      >
        <CloseIcon />
      </IconButton>
    </Box>
  );
}
