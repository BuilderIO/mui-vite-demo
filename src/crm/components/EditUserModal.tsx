import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Avatar,
  Typography,
} from "@mui/material";
import { User, UserUpdateRequest } from "../types/user";
import UserEditForm from "./UserEditForm";

interface EditUserModalProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
  onSave: (userId: string, updates: UserUpdateRequest) => Promise<boolean>;
  loading: boolean;
}

export default function EditUserModal({
  open,
  onClose,
  user,
  onSave,
  loading,
}: EditUserModalProps) {
  const [formData, setFormData] = React.useState<UserUpdateRequest>({});
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  // Reset form when user changes or modal opens
  React.useEffect(() => {
    if (user && open) {
      setFormData({
        email: user.email,
        name: {
          title: user.name.title,
          first: user.name.first,
          last: user.name.last,
        },
        gender: user.gender,
        location: {
          city: user.location.city,
          state: user.location.state,
          country: user.location.country,
          postcode: user.location.postcode,
          street: {
            number: user.location.street.number,
            name: user.location.street.name,
          },
        },
        phone: user.phone,
        cell: user.cell,
      });
      setError(null);
      setSuccess(false);
    }
  }, [user, open]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => {
      const keys = field.split(".");
      const updated = { ...prev };

      if (keys.length === 1) {
        updated[keys[0] as keyof UserUpdateRequest] = value;
      } else if (keys.length === 2) {
        const [parent, child] = keys;
        updated[parent as keyof UserUpdateRequest] = {
          ...(updated[parent as keyof UserUpdateRequest] as any),
          [child]: value,
        };
      } else if (keys.length === 3) {
        const [parent, middle, child] = keys;
        updated[parent as keyof UserUpdateRequest] = {
          ...(updated[parent as keyof UserUpdateRequest] as any),
          [middle]: {
            ...((updated[parent as keyof UserUpdateRequest] as any)?.[middle] ||
              {}),
            [child]: value,
          },
        };
      }

      return updated;
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) return;

    setError(null);
    setSuccess(false);

    try {
      const success = await onSave(user.login.uuid, formData);
      if (success) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
        }, 1000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update user");
    }
  };

  const handleClose = () => {
    setError(null);
    setSuccess(false);
    onClose();
  };

  if (!user) return null;

  const fullName = `${user.name.first} ${user.name.last}`;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar
            src={user.picture.medium}
            alt={fullName}
            sx={{ width: 48, height: 48 }}
          />
          <Box>
            <Typography variant="h6">Edit Customer</Typography>
            <Typography variant="body2" color="text.secondary">
              {fullName} • {user.email}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <UserEditForm
            user={user}
            formData={formData}
            onInputChange={handleInputChange}
            error={error}
            success={success}
          />
        </DialogContent>

        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || success}
            sx={{ minWidth: 80 }}
          >
            {loading ? "Saving..." : success ? "Saved!" : "Save"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
