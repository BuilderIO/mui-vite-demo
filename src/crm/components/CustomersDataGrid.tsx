import * as React from "react";
import { useNavigate } from "react-router-dom";
import { DataGrid, GridColDef, GridRowParams } from "@mui/x-data-grid";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

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
  email: string;
  phone: string;
  location: {
    city: string;
    country: string;
  };
  dob: {
    age: number;
  };
  picture: {
    thumbnail: string;
  };
  registered: {
    date: string;
  };
}

const getStatusFromAge = (age: number): "Active" | "Inactive" => {
  return age > 30 ? "Active" : "Inactive";
};

const renderStatus = (status: "Active" | "Inactive") => {
  const colors: { [index: string]: "success" | "default" } = {
    Active: "success",
    Inactive: "default",
  };

  return <Chip label={status} color={colors[status]} size="small" />;
};

const renderAvatar = (customer: Customer) => {
  const fullName = `${customer.name.first} ${customer.name.last}`;
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Avatar
        src={customer.picture.thumbnail}
        alt={fullName}
        sx={{ width: 32, height: 32 }}
      >
        {fullName.split(" ").map(n => n[0]).join("").toUpperCase()}
      </Avatar>
      <Typography variant="body2">{fullName}</Typography>
    </Box>
  );
};

const columns: GridColDef[] = [
  {
    field: "name",
    headerName: "Customer",
    flex: 1.5,
    minWidth: 200,
    renderCell: (params) => renderAvatar(params.row),
  },
  {
    field: "email",
    headerName: "Email",
    flex: 1,
    minWidth: 200,
  },
  {
    field: "phone",
    headerName: "Phone",
    flex: 1,
    minWidth: 150,
  },
  {
    field: "location",
    headerName: "Location",
    flex: 1,
    minWidth: 150,
    valueGetter: (params) => `${params.city}, ${params.country}`,
  },
  {
    field: "age",
    headerName: "Age",
    headerAlign: "right",
    align: "right",
    flex: 0.5,
    minWidth: 80,
  },
  {
    field: "status",
    headerName: "Status",
    flex: 0.5,
    minWidth: 100,
    renderCell: (params) => renderStatus(params.value),
  },
  {
    field: "registeredDate",
    headerName: "Registered",
    flex: 1,
    minWidth: 120,
    valueFormatter: (value) => new Date(value).toLocaleDateString(),
  },
];

export default function CustomersDataGrid() {
  const navigate = useNavigate();
  const [customers, setCustomers] = React.useState<Customer[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://user-api.builder-io.workers.dev/api/users?perPage=50&sortBy=name.first");
        
        if (!response.ok) {
          throw new Error(`Failed to fetch customers: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        const transformedCustomers = data.data.map((user: any) => ({
          id: user.login.uuid,
          login: user.login,
          name: user.name,
          email: user.email,
          phone: user.phone,
          location: user.location,
          age: user.dob.age,
          status: getStatusFromAge(user.dob.age),
          registeredDate: user.registered.date,
          picture: user.picture,
          dob: user.dob,
          registered: user.registered,
        }));
        
        setCustomers(transformedCustomers);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch customers");
        console.error("Error fetching customers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const handleRowClick = (params: GridRowParams) => {
    navigate(`/customers/${params.row.id}`);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 400,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 400,
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography variant="h6" color="error">
          Error loading customers
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      <DataGrid
        rows={customers}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 25 },
          },
        }}
        pageSizeOptions={[10, 25, 50]}
        onRowClick={handleRowClick}
        sx={{
          height: { xs: 400, sm: 500, md: 600 },
          cursor: "pointer",
          "& .MuiDataGrid-row:hover": {
            backgroundColor: "action.hover",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "background.paper",
            borderBottom: "1px solid",
            borderColor: "divider",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "1px solid",
            borderColor: "divider",
          },
        }}
      />
    </Box>
  );
}
