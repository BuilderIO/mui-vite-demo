import * as React from "react";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import AppTheme from "../shared-theme/AppTheme";
import ColorModeIconDropdown from "../shared-theme/ColorModeIconDropdown";

interface TeamMember {
  name: string;
  role: string;
  description: string;
}

interface CompanyValue {
  title: string;
  description: string;
  icon: string;
}

const teamMembers: TeamMember[] = [
  {
    name: "Sarah Johnson",
    role: "CEO & Founder",
    description: "Leading our vision with 15+ years of industry experience in building innovative solutions."
  },
  {
    name: "Michael Chen",
    role: "CTO",
    description: "Driving technical excellence and innovation with expertise in modern web technologies."
  },
  {
    name: "Emily Rodriguez",
    role: "Head of Design",
    description: "Creating beautiful, user-centered experiences that delight our customers."
  },
  {
    name: "David Kim",
    role: "Lead Engineer",
    description: "Building robust, scalable systems that power our platform's core functionality."
  }
];

const companyValues: CompanyValue[] = [
  {
    title: "Innovation",
    description: "We constantly push boundaries to create cutting-edge solutions that solve real problems.",
    icon: "💡"
  },
  {
    title: "Quality",
    description: "We maintain the highest standards in everything we do, from code to customer service.",
    icon: "⭐"
  },
  {
    title: "Collaboration",
    description: "We believe great things happen when diverse minds work together toward a common goal.",
    icon: "🤝"
  },
  {
    title: "Growth",
    description: "We're committed to continuous learning and helping our team and customers grow.",
    icon: "📈"
  }
];

function AboutUsContent() {
  return (
    <Box
      sx={(theme) => ({
        minHeight: "100vh",
        backgroundColor: theme.vars
          ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
          : alpha(theme.palette.background.default, 1),
      })}
    >
      {/* Header with color mode toggle */}
      <Box
        sx={{
          position: "fixed",
          top: 16,
          right: 16,
          zIndex: 1200,
        }}
      >
        <ColorModeIconDropdown />
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4, md: 8 }, px: { xs: 2, sm: 3 } }}>
        <Stack spacing={{ xs: 3, sm: 4, md: 6 }}>
          {/* Hero Section */}
          <Box sx={{ textAlign: "center", maxWidth: 800, mx: "auto", px: { xs: 1, sm: 2 } }}>
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 700,
                mb: 2,
                background: (theme) =>
                  `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
                fontSize: { xs: "1.8rem", sm: "2.5rem", md: "3.5rem" },
              }}
            >
              About Us
            </Typography>
            <Typography
              variant="h5"
              component="p"
              sx={{
                color: "text.secondary",
                lineHeight: 1.6,
                mb: 4,
                fontSize: { xs: "1rem", sm: "1.1rem", md: "1.3rem" },
                px: { xs: 1, sm: 2 },
              }}
            >
              We're a passionate team dedicated to building innovative solutions
              that make a difference in people's lives.
            </Typography>
          </Box>

          {/* Mission Statement */}
          <Card
            variant="outlined"
            sx={{
              backgroundColor: (theme) =>
                theme.vars
                  ? `rgba(${theme.vars.palette.background.paperChannel} / 1)`
                  : alpha(theme.palette.background.paper, 1),
            }}
          >
            <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
              <Typography variant="h4" component="h2" sx={{ mb: 3, textAlign: "center", fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" } }}>
                Our Mission
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: "1rem", sm: "1.1rem" },
                  lineHeight: 1.8,
                  textAlign: "center",
                  maxWidth: 700,
                  mx: "auto",
                  color: "text.primary",
                }}
              >
                To democratize technology and empower businesses of all sizes to achieve
                their goals through intuitive, powerful, and accessible software solutions.
                We believe that great technology should be simple to use, reliable, and
                available to everyone.
              </Typography>
            </CardContent>
          </Card>

          {/* Company Values */}
          <Box>
            <Typography variant="h4" component="h2" sx={{ mb: { xs: 3, md: 4 }, textAlign: "center", fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" } }}>
              Our Values
            </Typography>
            <Grid container spacing={{ xs: 2, sm: 3 }}>
              {companyValues.map((value, index) => (
                <Grid item xs={12} sm={6} lg={3} key={index}>
                  <Card
                    variant="outlined"
                    sx={{
                      height: "100%",
                      transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: (theme) => theme.shadows[8],
                      },
                    }}
                  >
                    <CardContent sx={{ textAlign: "center", p: { xs: 2, sm: 3 } }}>
                      <Typography variant="h2" component="div" sx={{ mb: 2 }}>
                        {value.icon}
                      </Typography>
                      <Typography variant="h6" component="h3" sx={{ mb: 2 }}>
                        {value.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                        {value.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Team Section */}
          <Box>
            <Typography variant="h4" component="h2" sx={{ mb: { xs: 3, md: 4 }, textAlign: "center", fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" } }}>
              Meet Our Team
            </Typography>
            <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
              {teamMembers.map((member, index) => (
                <Grid item xs={12} sm={6} lg={3} key={index}>
                  <Card
                    variant="outlined"
                    sx={{
                      height: "100%",
                      transition: "transform 0.2s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                      <Box
                        sx={{
                          width: { xs: 60, sm: 80 },
                          height: { xs: 60, sm: 80 },
                          borderRadius: "50%",
                          backgroundColor: "primary.main",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mx: "auto",
                          mb: 2,
                        }}
                      >
                        <Typography variant="h4" sx={{ color: "primary.contrastText", fontSize: { xs: "1.5rem", sm: "2rem" } }}>
                          {member.name.split(" ").map(n => n[0]).join("")}
                        </Typography>
                      </Box>
                      <Typography variant="h6" component="h3" sx={{ textAlign: "center", mb: 1 }}>
                        {member.name}
                      </Typography>
                      <Chip
                        label={member.role}
                        color="primary"
                        variant="outlined"
                        sx={{ mb: 2, mx: "auto", display: "block", width: "fit-content" }}
                      />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ textAlign: "center", lineHeight: 1.5 }}
                      >
                        {member.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Company Stats */}
          <Card variant="outlined">
            <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
              <Typography variant="h4" component="h2" sx={{ mb: { xs: 3, md: 4 }, textAlign: "center", fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" } }}>
                Our Journey
              </Typography>
              <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} sx={{ textAlign: "center" }}>
                <Grid item xs={12} sm={4}>
                  <Typography variant="h3" color="primary" sx={{ fontWeight: 700, mb: 1, fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" } }}>
                    5+
                  </Typography>
                  <Typography variant="h6" color="text.secondary" sx={{ fontSize: { xs: "0.9rem", sm: "1rem", md: "1.25rem" } }}>
                    Years of Excellence
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="h3" color="primary" sx={{ fontWeight: 700, mb: 1, fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" } }}>
                    10K+
                  </Typography>
                  <Typography variant="h6" color="text.secondary" sx={{ fontSize: { xs: "0.9rem", sm: "1rem", md: "1.25rem" } }}>
                    Happy Customers
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="h3" color="primary" sx={{ fontWeight: 700, mb: 1, fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" } }}>
                    50+
                  </Typography>
                  <Typography variant="h6" color="text.secondary" sx={{ fontSize: { xs: "0.9rem", sm: "1rem", md: "1.25rem" } }}>
                    Team Members
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Divider sx={{ my: 2 }} />

          {/* Contact Section */}
          <Box sx={{ textAlign: "center", py: 2 }}>
            <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
              Ready to Work Together?
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 600, mx: "auto" }}>
              We'd love to hear from you. Whether you have a question about our services,
              need support, or want to explore partnership opportunities, our team is here to help.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Contact us at{" "}
              <Typography component="span" color="primary" sx={{ fontWeight: 600 }}>
                hello@company.com
              </Typography>
            </Typography>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}

export default function AboutUs() {
  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <AboutUsContent />
    </AppTheme>
  );
}
