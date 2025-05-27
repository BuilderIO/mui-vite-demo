import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  CircularProgress,
  Box,
} from "@mui/material";
import UserForm from "./UserForm";
import { User, CreateUserRequest } from "../hooks/useUsers";

interface UserDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (userData: CreateUserRequest) => Promise<void>;
  user?: User | null;
  loading?: boolean;
}

export default function UserDialog({
  open,
  onClose,
  onSubmit,
  user,
  loading = false,
}: UserDialogProps) {
  const [formError, setFormError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const isEditMode = !!user;

  const handleSubmit = async (userData: CreateUserRequest) => {
    setFormError(null);
    setIsSubmitting(true);

    try {
      await onSubmit(userData);
      onClose();
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "An error occurred",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormError(null);
      onClose();
    }
  };

  const handleFormSubmit = () => {
    // Trigger form submission by finding the form element and dispatching submit event
    const form = document.getElementById("user-form") as HTMLFormElement;
    if (form) {
      const submitEvent = new Event("submit", {
        bubbles: true,
        cancelable: true,
      });
      form.dispatchEvent(submitEvent);
    }
  };

  React.useEffect(() => {
    if (!open) {
      setFormError(null);
      setIsSubmitting(false);
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: "70vh" },
      }}
    >
      <DialogTitle>{isEditMode ? "Edit User" : "Add New User"}</DialogTitle>

      <DialogContent>
        {formError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {formError}
          </Alert>
        )}

        <UserForm
          user={user}
          onSubmit={handleSubmit}
          loading={isSubmitting || loading}
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} disabled={isSubmitting} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleFormSubmit}
          variant="contained"
          disabled={isSubmitting || loading}
          startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
        >
          {isSubmitting
            ? "Saving..."
            : isEditMode
              ? "Update User"
              : "Create User"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
