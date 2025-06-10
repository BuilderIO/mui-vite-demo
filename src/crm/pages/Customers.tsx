import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import PeopleIcon from "@mui/icons-material/People";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import Chip from "@mui/material/Chip";
import CustomersTable from "../components/CustomersTable";
import CustomerEditModal from "../components/CustomerEditModal";

interface User {
  login: {
    uuid: string;
    username: string;
    password: string;
  };
  name: {
    title: string;
    first: string;
    last: string;
  };
  gender: string;
  location: {
    street: {
      number: number;
      name: string;
    };
    city: string;
    state: string;
    country: string;
    postcode: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
    timezone: {
      offset: string;
      description: string;
    };
  };
  email: string;
  dob: {
    date: string;
    age: number;
  };
  registered: {
    date: string;
    age: number;
  };
  phone: string;
  cell: string;
  picture: {
    large: string;
    medium: string;
    thumbnail: string;
  };
  nat: string;
}

export default function Customers() {
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [statsData, setStatsData] = React.useState({
    totalCustomers: 0,
    newThisMonth: 0,
    activeCustomers: 0,
  });

  // Fetch basic stats
  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(
          "https://user-api.builder-io.workers.dev/api/users?page=1&perPage=1",
        );
        const data = await response.json();

        // Since the API doesn't provide detailed stats, we'll simulate some
        setStatsData({
          totalCustomers: data.total || 0,
          newThisMonth: Math.floor((data.total || 0) * 0.12), // Simulate 12% new this month
          activeCustomers: Math.floor((data.total || 0) * 0.85), // Simulate 85% active
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };

    fetchStats();
  }, []);

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedUser(null);
  };

  const handleSaveUser = (updatedUser: User) => {
    console.log("User updated:", updatedUser);
    // You could trigger a refresh of the table here if needed
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Customer Management
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Manage your customer database with advanced search and editing
          capabilities. View customer profiles, update information, and track
          customer engagement.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={3} sx={{ mb: 4 }}>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  backgroundColor: "primary.50",
                  color: "primary.600",
                  display: "flex",
                }}
              >
                <PeopleIcon />
              </Box>
              <Box>
                <Typography variant="h4" component="div" fontWeight="bold">
                  {formatNumber(statsData.totalCustomers)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Customers
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  backgroundColor: "success.50",
                  color: "success.600",
                  display: "flex",
                }}
              >
                <PersonAddIcon />
              </Box>
              <Box>
                <Typography variant="h4" component="div" fontWeight="bold">
                  {formatNumber(statsData.newThisMonth)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  New This Month
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  backgroundColor: "warning.50",
                  color: "warning.600",
                  display: "flex",
                }}
              >
                <SearchIcon />
              </Box>
              <Box>
                <Typography variant="h4" component="div" fontWeight="bold">
                  {formatNumber(statsData.activeCustomers)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active Customers
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Stack>

      {/* Features Overview */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Chip
            icon={<SearchIcon />}
            label="Search & Filter"
            variant="outlined"
            size="small"
          />
          <Chip
            icon={<EditIcon />}
            label="Edit Customer Data"
            variant="outlined"
            size="small"
          />
          <Chip
            icon={<PeopleIcon />}
            label="Real-time Data"
            variant="outlined"
            size="small"
          />
        </Stack>
      </Box>

      {/* Main Content - Customer Table */}
      <Paper
        elevation={0}
        sx={{ p: 3, border: "1px solid", borderColor: "divider" }}
      >
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Customer Database
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Search and manage customer information. Click the edit icon to
            modify customer details.
          </Typography>
        </Box>

        <CustomersTable onEditUser={handleEditUser} />
      </Paper>

      {/* Edit Modal */}
      <CustomerEditModal
        open={modalOpen}
        user={selectedUser}
        onClose={handleCloseModal}
        onSave={handleSaveUser}
      />
    </Box>
  );
}
