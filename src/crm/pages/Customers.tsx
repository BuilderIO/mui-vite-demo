import * as React from "react";
import { useState, useCallback, useMemo, useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Copyright from "../../dashboard/internals/components/Copyright";
import CrmStatCard from "../components/CrmStatCard";
import EditCustomerModal from "../components/EditCustomerModal";

// Types for the API response
interface User {
  login: {
    uuid: string;
    username: string;
  };
  name: {
    title: string;
    first: string;
    last: string;
  };
  gender: string;
  location: {
    city: string;
    state: string;
    country: string;
  };
  email: string;
  dob: {
    age: number;
  };
  registered: {
    date: string;
  };
  phone: string;
  picture: {
    thumbnail: string;
    medium: string;
    large: string;
  };
}

interface ApiResponse {
  page: number;
  perPage: number;
  total: number;
  data: User[];
}

// Sample data for stat cards
const customerStatsData = [
  {
    title: "Total Customers",
    value: "0",
    interval: "Last 30 days",
    trend: "up" as const,
    trendValue: "+15%",
    data: [
      200, 240, 260, 280, 300, 320, 340, 360, 380, 400, 420, 440, 460, 480, 500,
      520, 540, 560, 580, 600, 620, 640, 660, 680, 700, 720, 740, 760, 780, 800,
    ],
  },
  {
    title: "New Customers",
    value: "0",
    interval: "This month",
    trend: "up" as const,
    trendValue: "+23%",
    data: [
      50, 45, 60, 55, 70, 65, 80, 75, 90, 85, 100, 95, 110, 105, 120,
      115, 130, 125, 140, 135, 150, 145, 160, 155, 170, 165, 180, 175, 190, 185,
    ],
  },
  {
    title: "Active Customers",
    value: "0",
    interval: "Last 7 days",
    trend: "up" as const,
    trendValue: "+12%",
    data: [
      300, 310, 320, 330, 340, 350, 360, 370, 380, 390, 400, 410, 420, 430, 440,
      450, 460, 470, 480, 490, 500, 510, 520, 530, 540, 550, 560, 570, 580, 590,
    ],
  },
  {
    title: "Customer Retention",
    value: "85%",
    interval: "Last 30 days",
    trend: "down" as const,
    trendValue: "-2%",
    data: [
      90, 89, 88, 87, 86, 85, 84, 85, 86, 87, 88, 89, 88, 87, 86, 85, 84, 85, 86,
      87, 88, 89, 88, 87, 86, 85, 84, 85, 86, 87,
    ],
  },
];

export default function Customers() {
  const [customers, setCustomers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name.first");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [totalRows, setTotalRows] = useState(0);
  const [statsData, setStatsData] = useState(customerStatsData);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<User | null>(null);

  // Fetch customers from API
  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      const searchParam = searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : "";
      const response = await fetch(
        `https://user-api.builder-io.workers.dev/api/users?page=${page + 1}&perPage=${pageSize}&sortBy=${sortBy}${searchParam}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: ApiResponse = await response.json();
      setCustomers(data.data);
      setTotalRows(data.total);
      
      // Update stats with real data
      setStatsData(prev => [
        { ...prev[0], value: data.total.toLocaleString() },
        prev[1], // Keep mock data for new customers
        prev[2], // Keep mock data for active customers  
        prev[3], // Keep mock data for retention
      ]);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, sortBy, searchTerm]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // Handle search with debounce
  const debouncedSearch = useMemo(
    () => {
      let timeoutId: NodeJS.Timeout;
      return (value: string) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          setSearchTerm(value);
          setPage(0); // Reset to first page on search
        }, 500);
      };
    },
    []
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(event.target.value);
  };

  const handleSortChange = (event: any) => {
    setSortBy(event.target.value);
    setPage(0); // Reset to first page on sort change
  };

  const handleEditCustomer = (customer: User) => {
    setSelectedCustomer(customer);
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedCustomer(null);
  };

  const handleSaveCustomer = async (updatedCustomer: Partial<User>) => {
    if (!selectedCustomer) return;

    try {
      const response = await fetch(
        `https://user-api.builder-io.workers.dev/api/users/${selectedCustomer.login.uuid}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedCustomer),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Refresh the customers list
      await fetchCustomers();
    } catch (error) {
      console.error("Error updating customer:", error);
      throw error;
    }
  };

  // DataGrid columns configuration
  const columns: GridColDef[] = [
    {
      field: "avatar",
      headerName: "",
      width: 60,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Avatar
          src={params.row.picture?.thumbnail}
          alt={`${params.row.name?.first} ${params.row.name?.last}`}
          sx={{ width: 32, height: 32 }}
        />
      ),
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      minWidth: 200,
      renderCell: (params: GridRenderCellParams) => (
        <Stack>
          <Typography variant="body2" fontWeight="medium">
            {`${params.row.name?.title} ${params.row.name?.first} ${params.row.name?.last}`}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            @{params.row.login?.username}
          </Typography>
        </Stack>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "location",
      headerName: "Location",
      flex: 1,
      minWidth: 180,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2">
          {`${params.row.location?.city}, ${params.row.location?.state}`}
        </Typography>
      ),
    },
    {
      field: "age",
      headerName: "Age",
      width: 80,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2">{params.row.dob?.age}</Typography>
      ),
    },
    {
      field: "phone",
      headerName: "Phone",
      width: 150,
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: () => (
        <Chip
          label="Active"
          color="success"
          variant="outlined"
          size="small"
        />
      ),
    },
    {
      field: "actions",
      headerName: "",
      width: 60,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <IconButton
          size="small"
          onClick={() => handleEditCustomer(params.row)}
          aria-label="Edit customer"
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
      ),
    },
  ];

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      {/* Header with action buttons */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3, display: { xs: "none", sm: "flex" } }}
      >
        <Typography variant="h4" component="h1">
          Customers
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddRoundedIcon />}
        >
          Add Customer
        </Button>
      </Stack>

      {/* Stats Cards row */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {statsData.map((card, index) => (
          <Grid key={index} item xs={12} sm={6} lg={3}>
            <CrmStatCard
              title={card.title}
              value={card.value}
              interval={card.interval}
              trend={card.trend}
              trendValue={card.trendValue}
              data={card.data}
            />
          </Grid>
        ))}
      </Grid>

      {/* Filters and Search */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ mb: 3 }}
        alignItems="center"
      >
        <TextField
          placeholder="Search customers..."
          variant="outlined"
          size="small"
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 300 }}
        />
        
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Sort by</InputLabel>
          <Select
            value={sortBy}
            onChange={handleSortChange}
            label="Sort by"
          >
            <MenuItem value="name.first">First Name</MenuItem>
            <MenuItem value="name.last">Last Name</MenuItem>
            <MenuItem value="location.city">City</MenuItem>
            <MenuItem value="location.country">Country</MenuItem>
            <MenuItem value="dob.age">Age</MenuItem>
            <MenuItem value="registered.date">Registration Date</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {/* Data Grid */}
      <Box sx={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={customers.map((customer, index) => ({
            id: customer.login?.uuid || `customer-${index}`,
            ...customer,
          }))}
          columns={columns}
          loading={loading}
          pagination
          paginationMode="server"
          rowCount={totalRows}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          pageSizeOptions={[10, 25, 50, 100]}
          disableRowSelectionOnClick
          sx={{
            "& .MuiDataGrid-cell": {
              borderBottom: "1px solid",
              borderBottomColor: "divider",
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "background.paper",
              borderBottom: "2px solid",
              borderBottomColor: "divider",
            },
          }}
        />
      </Box>

      <Copyright sx={{ mt: 4, mb: 4 }} />

      {/* Edit Customer Modal */}
      <EditCustomerModal
        open={editModalOpen}
        onClose={handleCloseEditModal}
        customer={selectedCustomer}
        onSave={handleSaveCustomer}
      />
    </Box>
  );
}
