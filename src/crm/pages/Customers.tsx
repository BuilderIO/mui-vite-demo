import * as React from "react";
import { useState, useCallback } from "react";
import {
  Box,
  Typography,
  Stack,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import CustomerDataGrid from "../components/CustomerDataGrid";
import CustomerEditModal from "../components/CustomerEditModal";
import { useCustomers } from "../hooks/useCustomers";
import { User } from "../types/user";

export default function Customers() {
  const {
    users,
    loading,
    error,
    pagination,
    fetchUsers,
    updateUser,
    deleteUser,
  } = useCustomers();

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name.first");

  const handlePaginationChange = useCallback(
    (page: number, perPage: number) => {
      fetchUsers(page, perPage, searchTerm, sortBy);
    },
    [fetchUsers, searchTerm, sortBy],
  );

  const handleSearch = useCallback(
    (search: string) => {
      setSearchTerm(search);
      fetchUsers(1, pagination.perPage, search, sortBy);
    },
    [fetchUsers, pagination.perPage, sortBy],
  );

  const handleSort = useCallback(
    (newSortBy: string) => {
      setSortBy(newSortBy);
      fetchUsers(pagination.page, pagination.perPage, searchTerm, newSortBy);
    },
    [fetchUsers, pagination.page, pagination.perPage, searchTerm],
  );

  const handleEdit = useCallback((user: User) => {
    setSelectedUser(user);
    setEditModalOpen(true);
  }, []);

  const handleEditClose = useCallback(() => {
    setEditModalOpen(false);
    setSelectedUser(null);
  }, []);

  const handleEditSave = useCallback(
    async (userId: string, userData: any) => {
      try {
        const result = await updateUser(userId, userData);
        if (result.success) {
          setSnackbar({
            open: true,
            message: "Customer updated successfully!",
            severity: "success",
          });
          return { success: true };
        } else {
          return { success: false, error: result.error };
        }
      } catch (error) {
        return {
          success: false,
          error:
            error instanceof Error
              ? error.message
              : "Failed to update customer",
        };
      }
    },
    [updateUser],
  );

  const handleDeleteClick = useCallback((userId: string) => {
    setUserToDelete(userId);
    setDeleteDialogOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!userToDelete) return;

    try {
      const result = await deleteUser(userToDelete);
      if (result.success) {
        setSnackbar({
          open: true,
          message: "Customer deleted successfully!",
          severity: "success",
        });
      } else {
        setSnackbar({
          open: true,
          message: result.error || "Failed to delete customer",
          severity: "error",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to delete customer",
        severity: "error",
      });
    } finally {
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  }, [deleteUser, userToDelete]);

  const handleDeleteCancel = useCallback(() => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  }, []);

  const handleSnackbarClose = useCallback(() => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      {/* Header */}
      <Stack spacing={2} sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          Customer Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your customer database with search, edit, and delete
          capabilities.
        </Typography>
      </Stack>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Data Grid */}
      <CustomerDataGrid
        users={users}
        loading={loading}
        error={error}
        pagination={pagination}
        onPaginationChange={handlePaginationChange}
        onSearch={handleSearch}
        onSort={handleSort}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />

      {/* Edit Modal */}
      <CustomerEditModal
        open={editModalOpen}
        onClose={handleEditClose}
        user={selectedUser}
        onSave={handleEditSave}
        loading={loading}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this customer? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={loading}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success/Error Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
