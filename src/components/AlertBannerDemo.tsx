import React, { useState } from 'react';
import { Stack, Button, Box, Typography } from '@mui/material';
import { AlertBanner } from './AlertBanner';

/**
 * AlertBanner Demo Component
 *
 * Showcases various configurations and use cases of the AlertBanner component.
 */
export const AlertBannerDemo: React.FC = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showWithAction, setShowWithAction] = useState(false);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Alert Banner Examples
      </Typography>

      <Stack spacing={3}>
        {/* Success Alert */}
        <Box>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Success Alert
          </Typography>
          {showSuccess && (
            <AlertBanner
              severity="success"
              title="Success"
              message="Your changes have been saved successfully."
              dismissible
              onClose={() => setShowSuccess(false)}
            />
          )}
          <Button
            variant="outlined"
            onClick={() => setShowSuccess(true)}
            disabled={showSuccess}
          >
            Show Success Alert
          </Button>
        </Box>

        {/* Info Alert */}
        <Box>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Info Alert
          </Typography>
          {showInfo && (
            <AlertBanner
              severity="info"
              title="Information"
              message="Here's some helpful information about your account."
              dismissible
              onClose={() => setShowInfo(false)}
            />
          )}
          <Button
            variant="outlined"
            onClick={() => setShowInfo(true)}
            disabled={showInfo}
          >
            Show Info Alert
          </Button>
        </Box>

        {/* Warning Alert */}
        <Box>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Warning Alert
          </Typography>
          {showWarning && (
            <AlertBanner
              severity="warning"
              title="Warning"
              message="Your session will expire in 5 minutes. Please save your work."
              dismissible
              onClose={() => setShowWarning(false)}
            />
          )}
          <Button
            variant="outlined"
            onClick={() => setShowWarning(true)}
            disabled={showWarning}
          >
            Show Warning Alert
          </Button>
        </Box>

        {/* Error Alert */}
        <Box>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Error Alert
          </Typography>
          {showError && (
            <AlertBanner
              severity="error"
              title="Error"
              message="There was a problem processing your request. Please try again."
              dismissible
              onClose={() => setShowError(false)}
            />
          )}
          <Button
            variant="outlined"
            onClick={() => setShowError(true)}
            disabled={showError}
          >
            Show Error Alert
          </Button>
        </Box>

        {/* Alert with Action Button */}
        <Box>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Alert with Action Button
          </Typography>
          {showWithAction && (
            <AlertBanner
              severity="success"
              title="Item Deleted"
              message="The item has been successfully deleted."
              dismissible
              action={{
                label: 'Undo',
                onClick: () => {
                  console.log('Undo action clicked');
                  alert('Undo action executed');
                },
              }}
              onClose={() => setShowWithAction(false)}
            />
          )}
          <Button
            variant="outlined"
            onClick={() => setShowWithAction(true)}
            disabled={showWithAction}
          >
            Show Alert with Action
          </Button>
        </Box>

        {/* Filled Variant */}
        <Box>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Filled Variant
          </Typography>
          <AlertBanner
            severity="warning"
            variant="filled"
            title="Filled Variant"
            message="This alert uses the filled variant for a more prominent appearance."
            dismissible
          />
        </Box>

        {/* Outlined Variant */}
        <Box>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Outlined Variant
          </Typography>
          <AlertBanner
            severity="info"
            variant="outlined"
            title="Outlined Variant"
            message="This alert uses the outlined variant for a subtle appearance."
            dismissible
          />
        </Box>

        {/* Alert without title */}
        <Box>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Alert without Title
          </Typography>
          <AlertBanner
            severity="info"
            message="This is a simple alert message without a title."
            dismissible
          />
        </Box>

        {/* Non-dismissible Alert */}
        <Box>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Non-dismissible Alert
          </Typography>
          <AlertBanner
            severity="error"
            title="Critical Error"
            message="This error requires your immediate attention and cannot be dismissed."
            dismissible={false}
          />
        </Box>
      </Stack>
    </Box>
  );
};

export default AlertBannerDemo;
