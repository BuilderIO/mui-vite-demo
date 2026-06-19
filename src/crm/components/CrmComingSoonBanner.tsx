import * as React from "react";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

export default function CrmComingSoonBanner() {
  const [open, setOpen] = React.useState(true);

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Collapse in={open}>
        <Alert
          severity="info"
          variant="outlined"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpen(false);
              }}
            >
              <CloseRoundedIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{
            mb: 2,
            borderRadius: 2,
            backgroundColor: "background.paper",
            borderColor: "info.main",
            "& .MuiAlert-icon": {
              color: "info.main",
            },
          }}
        >
          <AlertTitle sx={{ fontWeight: "bold" }}>
            New CRM Features Coming Soon!
          </AlertTitle>
          We are working on exciting new features for your CRM dashboard
          including advanced analytics and automated workflows. Stay tuned!
        </Alert>
      </Collapse>
    </Box>
  );
}
