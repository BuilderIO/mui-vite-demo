import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import StarIcon from "@mui/icons-material/Star";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SecurityIcon from "@mui/icons-material/Security";
import SupportIcon from "@mui/icons-material/Support";
import AppTheme from "../shared-theme/AppTheme";
import { Link, useNavigate } from "react-router-dom";

const tiers = [
  {
    title: "Starter",
    price: "0",
    period: "forever",
    description: [
      "Up to 3 projects",
      "5GB storage",
      "Community support",
      "Basic analytics",
      "Standard templates",
    ],
    buttonText: "Get Started Free",
    buttonVariant: "outlined",
    buttonColor: "primary",
    icon: <StarIcon />,
    popular: false,
  },
  {
    title: "Professional",
    subheader: "Most Popular",
    price: "29",
    period: "per month",
    description: [
      "Unlimited projects", 
      "100GB storage",
      "Priority support",
      "Advanced analytics",
      "Premium templates",
      "Team collaboration",
      "API access",
      "Custom integrations",
    ],
    buttonText: "Start Free Trial",
    buttonVariant: "contained",
    buttonColor: "primary",
    icon: <TrendingUpIcon />,
    popular: true,
  },
  {
    title: "Enterprise",
    price: "99",
    period: "per month",
    description: [
      "Everything in Professional",
      "Unlimited storage",
      "24/7 phone support",
      "Advanced security",
      "Custom branding",
      "SLA guarantee",
      "Dedicated account manager",
      "On-premise deployment",
    ],
    buttonText: "Contact Sales",
    buttonVariant: "outlined",
    buttonColor: "primary",
    icon: <SecurityIcon />,
    popular: false,
  },
];

const features = [
  {
    title: "Advanced Analytics",
    description: "Get detailed insights into your project performance with real-time analytics and reporting.",
    icon: <TrendingUpIcon />,
  },
  {
    title: "Enterprise Security",
    description: "Bank-level security with end-to-end encryption and compliance certifications.",
    icon: <SecurityIcon />,
  },
  {
    title: "24/7 Support",
    description: "Round-the-clock support from our team of experts to help you succeed.",
    icon: <SupportIcon />,
  },
];

export default function PricingPage(props: { disableCustomTheme?: boolean }) {
  const navigate = useNavigate();

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="back"
            onClick={() => navigate(-1)}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Pricing Plans
          </Typography>
          <Button component={Link} to="/" color="inherit">
            Home
          </Button>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={(theme) => ({
          width: "100%",
          backgroundRepeat: "no-repeat",
          backgroundImage:
            "radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 90%), transparent)",
          ...theme.applyStyles("dark", {
            backgroundImage:
              "radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 16%), transparent)",
          }),
        })}
      >
        <Container
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            pt: { xs: 8, sm: 12 },
            pb: { xs: 6, sm: 8 },
          }}
        >
          <Typography
            component="h1"
            variant="h2"
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: "center",
              fontSize: "clamp(2.5rem, 8vw, 3rem)",
              textAlign: "center",
              mb: 2,
            }}
          >
            Choose Your&nbsp;
            <Typography
              component="span"
              variant="h2"
              sx={(theme) => ({
                fontSize: "inherit",
                color: "primary.main",
                ...theme.applyStyles("dark", {
                  color: "primary.light",
                }),
              })}
            >
              Perfect Plan
            </Typography>
          </Typography>
          <Typography
            variant="h5"
            sx={{
              textAlign: "center",
              color: "text.secondary",
              width: { sm: "100%", md: "70%" },
              mb: 4,
            }}
          >
            Scale your business with our flexible pricing plans designed for teams of all sizes
          </Typography>
        </Container>
      </Box>

      {/* Pricing Section */}
      <Container
        sx={{
          pt: { xs: 4, sm: 8 },
          pb: { xs: 8, sm: 12 },
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: { xs: 3, sm: 6 },
        }}
      >
        <Grid
          container
          spacing={3}
          sx={{ alignItems: "stretch", justifyContent: "center", width: "100%" }}
        >
          {tiers.map((tier) => (
            <Grid
              size={{ xs: 12, sm: 6, md: 4 }}
              key={tier.title}
            >
              <Card
                sx={[
                  {
                    p: 3,
                    display: "flex",
                    flexDirection: "column",
                    gap: 3,
                    height: "100%",
                    position: "relative",
                  },
                  tier.popular &&
                    ((theme) => ({
                      border: `2px solid ${theme.palette.primary.main}`,
                      transform: "scale(1.05)",
                      background:
                        "radial-gradient(circle at 50% 0%, hsl(220, 20%, 35%), hsl(220, 30%, 6%))",
                      boxShadow: `0 12px 24px hsla(220, 20%, 42%, 0.3)`,
                      ...theme.applyStyles("dark", {
                        background:
                          "radial-gradient(circle at 50% 0%, hsl(220, 20%, 20%), hsl(220, 30%, 16%))",
                        boxShadow: `0 12px 24px hsla(0, 0%, 0%, 0.8)`,
                      }),
                    })),
                ]}
              >
                {tier.popular && (
                  <Chip
                    icon={<AutoAwesomeIcon />}
                    label={tier.subheader}
                    color="primary"
                    sx={{
                      position: "absolute",
                      top: -12,
                      left: "50%",
                      transform: "translateX(-50%)",
                      zIndex: 1,
                    }}
                  />
                )}
                
                <CardContent sx={{ flexGrow: 1, p: 0 }}>
                  <Box
                    sx={{
                      mb: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Box sx={{ color: tier.popular ? "grey.100" : "primary.main" }}>
                      {tier.icon}
                    </Box>
                    <Typography
                      component="h3"
                      variant="h5"
                      sx={{ color: tier.popular ? "grey.100" : "text.primary" }}
                    >
                      {tier.title}
                    </Typography>
                  </Box>
                  
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "baseline",
                      mb: 2,
                    }}
                  >
                    <Typography
                      component="span"
                      variant="h3"
                      sx={{ color: tier.popular ? "grey.50" : "text.primary" }}
                    >
                      ${tier.price}
                    </Typography>
                    <Typography
                      component="span"
                      variant="h6"
                      sx={{ color: tier.popular ? "grey.200" : "text.secondary", ml: 1 }}
                    >
                      {tier.period}
                    </Typography>
                  </Box>
                  
                  <Divider sx={{ my: 2, opacity: 0.8, borderColor: "divider" }} />
                  
                  {tier.description.map((line) => (
                    <Box
                      key={line}
                      sx={{
                        py: 1,
                        display: "flex",
                        gap: 1.5,
                        alignItems: "center",
                      }}
                    >
                      <CheckCircleRoundedIcon
                        sx={{
                          width: 20,
                          color: tier.popular ? "primary.light" : "primary.main",
                        }}
                      />
                      <Typography
                        variant="body2"
                        component="span"
                        sx={{
                          color: tier.popular ? "grey.50" : "text.primary",
                        }}
                      >
                        {line}
                      </Typography>
                    </Box>
                  ))}
                </CardContent>
                
                <CardActions sx={{ p: 0, mt: "auto" }}>
                  <Button
                    fullWidth
                    variant={tier.buttonVariant as "outlined" | "contained"}
                    color={tier.buttonColor as "primary"}
                    size="large"
                    sx={{
                      py: 1.5,
                      ...(tier.popular && {
                        background: (theme) => `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                        "&:hover": {
                          background: (theme) => `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                        },
                      }),
                    }}
                  >
                    {tier.buttonText}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Features Section */}
      <Box sx={{ bgcolor: "background.paper", py: { xs: 6, sm: 8 } }}>
        <Container>
          <Typography
            component="h2"
            variant="h4"
            sx={{
              textAlign: "center",
              mb: 2,
              color: "text.primary",
            }}
          >
            Why Choose Our Platform?
          </Typography>
          <Typography
            variant="body1"
            sx={{
              textAlign: "center",
              color: "text.secondary",
              mb: 6,
              maxWidth: "600px",
              mx: "auto",
            }}
          >
            Our platform provides everything you need to build, deploy, and scale your applications with confidence.
          </Typography>
          
          <Grid container spacing={4} sx={{ alignItems: "stretch" }}>
            {features.map((feature) => (
              <Grid size={{ xs: 12, md: 4 }} key={feature.title}>
                <Box
                  sx={{
                    textAlign: "center",
                    p: 3,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Box
                    sx={{
                      color: "primary.main",
                      mb: 2,
                      "& svg": { fontSize: 48 },
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* FAQ Section */}
      <Container sx={{ py: { xs: 6, sm: 8 } }}>
        <Typography
          component="h2"
          variant="h4"
          sx={{
            textAlign: "center",
            mb: 6,
            color: "text.primary",
          }}
        >
          Frequently Asked Questions
        </Typography>
        
        <Box sx={{ maxWidth: "800px", mx: "auto" }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Can I change my plan anytime?
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and you'll be prorated for any differences.
            </Typography>
          </Box>
          
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Is there a free trial available?
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Yes! We offer a 14-day free trial for our Professional plan. No credit card required to get started.
            </Typography>
          </Box>
          
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              What payment methods do you accept?
            </Typography>
            <Typography variant="body2" color="text.secondary">
              We accept all major credit cards, PayPal, and bank transfers for annual plans. All payments are processed securely.
            </Typography>
          </Box>
        </Box>
      </Container>

      {/* Footer CTA */}
      <Box
        sx={{
          bgcolor: "primary.main",
          color: "primary.contrastText",
          py: { xs: 6, sm: 8 },
        }}
      >
        <Container>
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h4" component="h2" gutterBottom>
              Ready to Get Started?
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              Join thousands of teams already using our platform
            </Typography>
            <Button
              variant="contained"
              size="large"
              sx={{
                bgcolor: "background.paper",
                color: "primary.main",
                "&:hover": {
                  bgcolor: "grey.100",
                },
                px: 4,
                py: 2,
              }}
            >
              Start Your Free Trial
            </Button>
          </Box>
        </Container>
      </Box>
    </AppTheme>
  );
}
