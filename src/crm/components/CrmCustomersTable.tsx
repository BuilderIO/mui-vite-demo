import * as React from "react";
import { DataGrid, GridColDef, GridRowParams } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

// Customer interface based on User API
interface Customer {
  id: string;
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
    street: {
      number: number;
      name: string;
    };
    city: string;
    state: string;
    country: string;
    postcode: string;
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

interface CrmCustomersTableProps {
  onCustomerClick?: (customer: Customer) => void;
}

// Format date
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString("en-US", options);
};

// Get status based on registration age
const getCustomerStatus = (registrationAge: number): "Active" | "New" | "Inactive" => {
  if (registrationAge < 1) return "New";
  if (registrationAge > 3) return "Active";
  return "Inactive";
};

// Get status color
const getStatusColor = (status: string): "success" | "info" | "default" => {
  switch (status) {
    case "Active":
      return "success";
    case "New":
      return "info";
    default:
      return "default";
  }
};

export default function CrmCustomersTable({ onCustomerClick }: CrmCustomersTableProps) {
  const [customers, setCustomers] = React.useState<Customer[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 25,
  });

  // Fetch customers from User API
  const fetchCustomers = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(
        `https://user-api.builder-io.workers.dev/api/users?page=${paginationModel.page + 1}&perPage=${paginationModel.pageSize}&sortBy=name.first`
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch customers");
      }
      
      const data = await response.json();
      
      // Transform data for DataGrid
      const transformedCustomers = data.data.map((user: any) => ({
        ...user,
        id: user.login.uuid,
      }));
      
      setCustomers(transformedCustomers);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load customers");
    } finally {
      setLoading(false);
    }
  }, [paginationModel.page, paginationModel.pageSize]);

  React.useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const columns: GridColDef[] = [
    {
      field: "avatar",
      headerName: "",
      width: 60,
      sortable: false,
      renderCell: (params) => (
        <Avatar
          src={params.row.picture?.thumbnail}
          sx={{ width: 32, height: 32 }}
        >
          {params.row.name.first.charAt(0)}
        </Avatar>
      ),
    },
    {
      field: "fullName",
      headerName: "Name",
      width: 200,
      valueGetter: (value, row) => `${row.name.first} ${row.name.last}`,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2" fontWeight={500}>
            {`${params.row.name.first} ${params.row.name.last}`}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            @{params.row.login.username}
          </Typography>
        </Box>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      width: 220,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <EmailIcon sx={{ fontSize: 16, color: "text.secondary" }} />
          <Typography variant="body2">{params.value}</Typography>
        </Box>
      ),
    },
    {
      field: "phone",
      headerName: "Phone",
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <PhoneIcon sx={{ fontSize: 16, color: "text.secondary" }} />
          <Typography variant="body2">{params.value}</Typography>
        </Box>
      ),
    },
    {
      field: "location",
      headerName: "Location",
      width: 180,
      valueGetter: (value, row) => `${row.location.city}, ${row.location.country}`,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <LocationOnIcon sx={{ fontSize: 16, color: "text.secondary" }} />
          <Typography variant="body2">
            {`${params.row.location.city}, ${params.row.location.country}`}
          </Typography>
        </Box>
      ),
    },
    {
      field: "age",
      headerName: "Age",
      width: 80,
      valueGetter: (value, row) => row.dob.age,
    },
    {
      field: "status",
      headerName: "Status",
      width: 110,
      valueGetter: (value, row) => getCustomerStatus(row.registered.age),
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          color={getStatusColor(params.value)}
          variant="outlined"
        />
      ),
    },
    {
      field: "joinDate",
      headerName: "Joined",
      width: 120,
      valueGetter: (value, row) => row.registered.date,
      renderCell: (params) => formatDate(params.value),
    },
  ];

  const handleRowClick = (params: GridRowParams) => {
    if (onCustomerClick) {
      onCustomerClick(params.row as Customer);
    }
  };

  if (error) {
    return (
      <Card variant="outlined">
        <CardContent>
          <Alert severity="error" action={
            <Button color="inherit" size="small" onClick={fetchCustomers}>
              Retry
            </Button>
          }>
            {error}
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="outlined" sx={{ height: "100%" }}>
      <CardContent sx={{ pb: 0 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
          sx={{ mb: 2 }}
        >
          <Typography variant="h6" component="h3">
            Customers
          </Typography>
          <Button 
            endIcon={<ArrowForwardRoundedIcon />} 
            size="small"
            onClick={fetchCustomers}
            disabled={loading}
          >
            Refresh
          </Button>
        </Stack>
      </CardContent>
      
      <Box sx={{ height: 600, width: "100%" }}>
        {loading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <CircularProgress />
          </Box>
        )}
        
        {!loading && (
          <DataGrid
            rows={customers}
            columns={columns}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[10, 25, 50]}
            disableColumnResize
            density="comfortable"
            onRowClick={handleRowClick}
            sx={{
              "& .MuiDataGrid-row:hover": {
                cursor: "pointer",
              },
            }}
            slotProps={{
              filterPanel: {
                filterFormProps: {
                  logicOperatorInputProps: {
                    variant: "outlined",
                    size: "small",
                  },
                  columnInputProps: {
                    variant: "outlined",
                    size: "small",
                    sx: { mt: "auto" },
                  },
                  operatorInputProps: {
                    variant: "outlined",
                    size: "small",
                    sx: { mt: "auto" },
                  },
                  valueInputProps: {
                    InputComponentProps: {
                      variant: "outlined",
                      size: "small",
                    },
                  },
                },
              },
            }}
          />
        )}
      </Box>
    </Card>
  );
}
