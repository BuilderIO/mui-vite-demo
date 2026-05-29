import React, { useState } from 'react';
import {
  Alert,
  AlertTitle,
  Box,
  Stack,
  IconButton,
  Button,
  Collapse,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';

export interface AlertBannerProps {
  /**
   * The severity level of the alert
   * @default 'info'
   */
  severity?: 'success' | 'info' | 'warning' | 'error';

  /**
   * The variant style of the alert
   * @default 'standard'
   */
  variant?: 'standard' | 'filled' | 'outlined';

  /**
   * Alert title
   */
  title?: string;

  /**
   * Alert message
   */
  message: string;

  /**
   * Whether the alert can be dismissed
   * @default true
   */
  dismissible?: boolean;

  /**
   * Optional action button configuration
   */
  action?: {
    label: string;
    onClick: () => void;
  };

  /**
   * Callback when the alert is closed
   */
  onClose?: () => void;

  /**
   * Custom icon to override the default severity icon
   */
  icon?: React.ReactNode | false;

  /**
   * Whether the banner is positioned at the top (fixed/sticky)
   * @default false
   */
  isTopBanner?: boolean;

  /**
   * Auto-dismiss after specified milliseconds (0 = no auto-dismiss)
   * @default 0
   */
  autoDismissMs?: number;
}

/**
 * AlertBanner Component
 *
 * A flexible alert banner component built with MUI components for displaying
 * important notifications, warnings, errors, and success messages.
 *
 * Features:
 * - Multiple severity levels (success, info, warning, error)
 * - Optional dismissible functionality
 * - Customizable action buttons
 * - Support for titled alerts
 * - Auto-dismiss capability
 * - Responsive design
 * - Accessibility built-in (role="alert")
 *
 * @example
 * ```tsx
 * <AlertBanner
 *   severity="success"
 *   title="Success"
 *   message="Your changes have been saved successfully."
 *   dismissible
 *   action={{ label: 'Undo', onClick: () => console.log('Undo clicked') }}
 * />
 * ```
 */
export const AlertBanner: React.FC<AlertBannerProps> = ({
  severity = 'info',
  variant = 'standard',
  title,
  message,
  dismissible = true,
  action,
  onClose,
  icon,
  isTopBanner = false,
  autoDismissMs = 0,
}) => {
  const [open, setOpen] = useState(true);

  React.useEffect(() => {
    if (autoDismissMs > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, autoDismissMs);

      return () => clearTimeout(timer);
    }
  }, [autoDismissMs]);

  const handleClose = () => {
    setOpen(false);
    onClose?.();
  };

  // Map severity to default icons
  const defaultIconMap = {
    success: <CheckCircleIcon fontSize="inherit" />,
    info: <InfoIcon fontSize="inherit" />,
    warning: <WarningIcon fontSize="inherit" />,
    error: <ErrorIcon fontSize="inherit" />,
  };

  const customIcon = icon !== undefined ? icon : defaultIconMap[severity];

  const bannerStyles = isTopBanner
    ? {
        position: 'sticky',
        top: 0,
        zIndex: 1200,
        width: '100%',
      }
    : {};

  return (
    <Collapse in={open}>
      <Box sx={bannerStyles}>
        <Alert
          severity={severity}
          variant={variant}
          icon={customIcon}
          onClose={dismissible ? handleClose : undefined}
          action={
            action ? (
              <Stack direction="row" spacing={1} alignItems="center">
                <Button
                  color="inherit"
                  size="small"
                  onClick={action.onClick}
                  sx={{ textTransform: 'uppercase', fontWeight: 600 }}
                >
                  {action.label}
                </Button>
                {dismissible && (
                  <IconButton
                    size="small"
                    color="inherit"
                    onClick={handleClose}
                    aria-label="close"
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                )}
              </Stack>
            ) : dismissible ? (
              <IconButton
                size="small"
                color="inherit"
                onClick={handleClose}
                aria-label="close"
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            ) : undefined
          }
          sx={{
            width: '100%',
            borderRadius: isTopBanner ? 0 : 1,
          }}
        >
          {title && (
            <AlertTitle sx={{ mb: title && message ? 0.5 : 0 }}>
              {title}
            </AlertTitle>
          )}
          {message}
        </Alert>
      </Box>
    </Collapse>
  );
};

export default AlertBanner;
