import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CustomersDataGrid from "../components/CustomersDataGrid";
import EditUserModal from "../components/EditUserModal";

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
  email: string;
  location: {
    city: string;
    state?: string;
    country: string;
  };
  phone: string;
  picture: {
    thumbnail: string;
  };
  registered: {
    date: string;
  };
}

export default function Customers() {
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [refreshKey, setRefreshKey] = React.useState(0);

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedUser(null);
  };

  const handleUserUpdated = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
        Customers
      </Typography>
      <Typography paragraph sx={{ mb: 3, color: "text.secondary" }}>
        Manage and view your customer database
      </Typography>
      <CustomersDataGrid key={refreshKey} onEditUser={handleEditUser} />
      <EditUserModal
        open={modalOpen}
        user={selectedUser}
        onClose={handleCloseModal}
        onUserUpdated={handleUserUpdated}
      />
    </Box>
  );
}
