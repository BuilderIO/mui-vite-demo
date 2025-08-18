import * as React from "react";
import { useNavigate } from "react-router-dom";
import { DataGrid, GridColDef, GridRowsProp, GridRowParams } from "@mui/x-data-grid";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { alpha, useTheme } from "@mui/material/styles";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  status: "Active" | "Inactive";
  lastContact: string;
  value: number;
}

interface ApiUser {
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
  cell: string;
  location: {
    city: string;
    country: string;
  };
  dob: {
    age: number;
  };
  registered: {
    date: string;
  };
}

function renderCustomerAvatar(params: any) {
  const name = params.row.name;
  const initials = name
    .split(" ")
    .map((word: string) => word.charAt(0))
    .join("")
    .toUpperCase()
    .substring(0, 2);

  return (
    <Avatar
      sx={{
        width: 32,
        height: 32,
        fontSize: "0.875rem",
        bgcolor: "primary.main",
      }}
    >
      {initials}
    </Avatar>
  );
}

function renderStatus(status: "Active" | "Inactive") {
  const colors: { [index: string]: "success" | "default" } = {
    Active: "success",
    Inactive: "default",
  };

  return <Chip label={status} color={colors[status]} size="small" />;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

const columns: GridColDef[] = [
  {
    field: "avatar",
    headerName: "",
    width: 60,
    renderCell: renderCustomerAvatar,
    sortable: false,
    filterable: false,
  },
  {
    field: "name",
    headerName: "Name",
    flex: 1.5,
    minWidth: 150,
  },
  {
    field: "email",
    headerName: "Email",
    flex: 1.5,
    minWidth: 200,
  },
  {
    field: "phone",
    headerName: "Phone",
    flex: 1,
    minWidth: 120,
  },
  {
    field: "location",
    headerName: "Location",
    flex: 1,
    minWidth: 150,
    valueGetter: (value, row) => `${row.city}, ${row.country}`,
  },
  {
    field: "status",
    headerName: "Status",
    width: 100,
    renderCell: (params) => renderStatus(params.value as any),
  },
  {
    field: "lastContact",
    headerName: "Last Contact",
    flex: 1,
    minWidth: 120,
  },
  {
    field: "value",
    headerName: "Customer Value",
    width: 140,
    type: "number",
    valueFormatter: (value) => formatCurrency(value),
    headerAlign: "right",
    align: "right",
  },
];

// Sample data - this will be replaced with API data
const sampleCustomers: GridRowsProp = [
  {
    id: "1",
    name: "John Anderson",
    email: "john.anderson@company.com",
    phone: "(555) 123-4567",
    city: "New York",
    country: "USA",
    status: "Active",
    lastContact: "2024-01-15",
    value: 45000,
  },
  {
    id: "2",
    name: "Sarah Mitchell",
    email: "sarah.mitchell@enterprise.com",
    phone: "(555) 234-5678",
    city: "Los Angeles",
    country: "USA",
    status: "Active",
    lastContact: "2024-01-12",
    value: 78000,
  },
  {
    id: "3",
    name: "Michael Chen",
    email: "michael.chen@techcorp.com",
    phone: "(555) 345-6789",
    city: "San Francisco",
    country: "USA",
    status: "Inactive",
    lastContact: "2023-12-20",
    value: 32000,
  },
  {
    id: "4",
    name: "Emily Rodriguez",
    email: "emily.rodriguez@innovate.com",
    phone: "(555) 456-7890",
    city: "Chicago",
    country: "USA",
    status: "Active",
    lastContact: "2024-01-18",
    value: 89000,
  },
  {
    id: "5",
    name: "David Thompson",
    email: "david.thompson@solutions.com",
    phone: "(555) 567-8901",
    city: "Boston",
    country: "USA",
    status: "Active",
    lastContact: "2024-01-10",
    value: 56000,
  },
];

interface CustomerListProps {
  onCustomerSelect?: (customerId: string) => void;
}

export default function CustomerList({ onCustomerSelect }: CustomerListProps) {
  const navigate = useNavigate();
  const theme = useTheme();
  const [customers, setCustomers] = React.useState<GridRowsProp>(sampleCustomers);

  const handleRowClick = (params: GridRowParams) => {
    const customerId = params.id as string;
    if (onCustomerSelect) {
      onCustomerSelect(customerId);
    } else {
      navigate(`/customers/${customerId}`);
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
        Customer List
      </Typography>
      <Box
        sx={{
          height: 600,
          width: "100%",
          "& .MuiDataGrid-root": {
            border: 1,
            borderColor: "divider",
            borderRadius: 2,
          },
          "& .MuiDataGrid-row:hover": {
            backgroundColor: alpha(theme.palette.primary.main, 0.04),
            cursor: "pointer",
          },
        }}
      >
        <DataGrid
          rows={customers}
          columns={columns}
          onRowClick={handleRowClick}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          pageSizeOptions={[5, 10, 25, 50]}
          disableColumnResize
          density="standard"
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
      </Box>
    </Box>
  );
}
