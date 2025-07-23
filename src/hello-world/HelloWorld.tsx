import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import { styled } from "@mui/material/styles";
import WavingHandIcon from "@mui/icons-material/WavingHand";

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 600,
  margin: "auto",
  marginTop: theme.spacing(8),
  textAlign: "center",
  background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
  color: theme.palette.primary.contrastText,
  boxShadow: theme.shadows[8],
}));

const WelcomeIcon = styled(WavingHandIcon)(({ theme }) => ({
  fontSize: "4rem",
  marginBottom: theme.spacing(2),
  animation: "wave 1s ease-in-out infinite alternate",
  "@keyframes wave": {
    "0%": {
      transform: "rotate(0deg)",
    },
    "100%": {
      transform: "rotate(20deg)",
    },
  },
}));

export default function HelloWorld() {
  const [clicked, setClicked] = React.useState(false);

  const handleClick = () => {
    setClicked(!clicked);
  };

  return (
    <Container>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(45deg, #f3f4f6 0%, #e5e7eb 100%)",
        }}
      >
        <StyledCard>
          <CardContent sx={{ p: 4 }}>
            <WelcomeIcon />
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              sx={{ fontWeight: 600 }}
            >
              Hello World!
            </Typography>
            <Typography
              variant="h6"
              sx={{ mb: 3, opacity: 0.9 }}
            >
              Welcome to your new Material-UI page
            </Typography>
            <Typography
              variant="body1"
              sx={{ mb: 4, lineHeight: 1.6 }}
            >
              This is a simple Hello World page built with Material-UI components.
              Click the button below to see some interactivity!
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={handleClick}
              sx={{
                backgroundColor: "white",
                color: "primary.main",
                fontWeight: 600,
                px: 4,
                py: 1.5,
                "&:hover": {
                  backgroundColor: "grey.100",
                  transform: "translateY(-2px)",
                  boxShadow: 4,
                },
                transition: "all 0.3s ease",
              }}
            >
              {clicked ? "Thanks for clicking! 🎉" : "Click me!"}
            </Button>
            {clicked && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Great! You've successfully interacted with the page.
                </Typography>
              </Box>
            )}
          </CardContent>
        </StyledCard>
      </Box>
    </Container>
  );
}
