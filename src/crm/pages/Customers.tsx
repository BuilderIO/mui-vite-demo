import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import { useUsers } from "../hooks/useUsers";
import { User } from "../types/user";
import CustomersTable from "../components/CustomersTable";
import EditUserModal from "../components/EditUserModal";

export default function Customers() {
  const {
    users,
    loading,
    error,
    total,
    page,
    perPage,
    setPage,
    setPerPage,
    fetchUsers,
    updateUser,
    deleteUser,
  } = useUsers();

  const [editingUser, setEditingUser] = React.useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [actionError, setActionError] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(
    null,
  );

  const handleSearch = (query: string) => {
    setPage(1); // Reset to first page when searching
    fetchUsers(query);
  };

  const handleSort = (field: string) => {
    fetchUsers(undefined, field, page, perPage);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchUsers(undefined, undefined, newPage, perPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPerPage(newPageSize);
    setPage(1); // Reset to first page when changing page size
    fetchUsers(undefined, undefined, 1, newPageSize);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
    setActionError(null);
    setSuccessMessage(null);
  };

  const handleSaveUser = async (userId: string, updates: any) => {
    setActionError(null);
    const success = await updateUser(userId, updates);
    if (success) {
      setSuccessMessage("Customer updated successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
      return true;
    }
    return false;
  };

  const handleDelete = async (userId: string) => {
    setActionError(null);
    const success = await deleteUser(userId);
    if (success) {
      setSuccessMessage("Customer deleted successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } else {
      setActionError("Failed to delete customer");
      setTimeout(() => setActionError(null), 3000);
    }
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setEditingUser(null);
  };

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Stack spacing={2}>
        <Box>
          <Typography variant="h4" component="h1" sx={{ mb: 1 }}>
            Customer Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your customer database, search for specific customers, and
            update their information.
          </Typography>
        </Box>

        {actionError && (
          <Alert severity="error" onClose={() => setActionError(null)}>
            {actionError}
          </Alert>
        )}

        {successMessage && (
          <Alert severity="success" onClose={() => setSuccessMessage(null)}>
            {successMessage}
          </Alert>
        )}

        <Box sx={{ height: "70vh", minHeight: 600 }}>
          <CustomersTable
            users={users}
            loading={loading}
            error={error}
            total={total}
            page={page}
            perPage={perPage}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            onSearch={handleSearch}
            onSort={handleSort}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </Box>

        <EditUserModal
          open={isEditModalOpen}
          onClose={handleCloseModal}
          user={editingUser}
          onSave={handleSaveUser}
          loading={loading}
        />
      </Stack>
    </Box>
  );
}
