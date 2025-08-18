import * as React from "react";
import { useNavigate } from "react-router-dom";
import { DataGrid, GridColDef, GridRowParams } from "@mui/x-data-grid";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

interface UserData {
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
    state: string;
    country: string;
  };
  dob: {
    date: string;
    age: number;
  };
  registered: {
    date: string;
    age: number;
  };
  picture: {
    large: string;
    medium: string;
    thumbnail: string;
  };
  nat: string;
}

interface ApiResponse {
  page: number;
  perPage: number;
  total: number;
  data: UserData[];
}

function renderAvatar(params: { value: { name: string; picture: string } }) {
  if (!params.value) return "";
  
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Avatar
        src={params.value.picture}
        alt={params.value.name}
        sx={{ width: 32, height: 32 }}
      >
        {params.value.name.charAt(0)}
      </Avatar>
      <Typography variant="body2">{params.value.name}</Typography>
    </Box>
  );
}

function renderStatus(status: "Active" | "Inactive") {
  const colors: { [key: string]: "success" | "default" } = {
    Active: "success",
    Inactive: "default",
  };

  return <Chip label={status} color={colors[status]} size="small" />;
}

const columns: GridColDef[] = [
  {
    field: "customer",
    headerName: "Customer",
    flex: 1.5,
    minWidth: 200,
    renderCell: renderAvatar,
    sortable: false,
  },
  {
    field: "email",
    headerName: "Email",
    flex: 1.2,
    minWidth: 180,
  },
  {
    field: "phone",
    headerName: "Phone",
    flex: 1,
    minWidth: 130,
  },
  {
    field: "location",
    headerName: "Location",
    flex: 1,
    minWidth: 150,
  },
  {
    field: "status",
    headerName: "Status",
    flex: 0.7,
    minWidth: 100,
    renderCell: (params) => renderStatus(params.value as any),
  },
  {
    field: "registeredDate",
    headerName: "Customer Since",
    flex: 1,
    minWidth: 120,
    type: "date",
  },
];

export default function CustomersList() {
  const navigate = useNavigate();
  const [customers, setCustomers] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [totalRows, setTotalRows] = React.useState(0);
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 20,
  });

  const fetchCustomers = React.useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://user-api.builder-io.workers.dev/api/users?page=${paginationModel.page + 1}&perPage=${paginationModel.pageSize}&sortBy=name.first`
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch customers");
      }
      
      const data: ApiResponse = await response.json();
      
      const formattedCustomers = data.data.map((user: UserData) => ({
        id: user.login.uuid,
        customer: {
          name: `${user.name.first} ${user.name.last}`,
          picture: user.picture.thumbnail,
        },
        email: user.email,
        phone: user.phone,
        location: `${user.location.city}, ${user.location.state}`,
        status: Math.random() > 0.3 ? "Active" : "Inactive", // Random status for demo
        registeredDate: new Date(user.registered.date),
        fullData: user, // Store full user data for detail view
      }));
      
      setCustomers(formattedCustomers);
      setTotalRows(data.total);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [paginationModel]);

  React.useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleRowClick = (params: GridRowParams) => {
    navigate(`/customers/${params.row.id}`);
  };

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Error loading customers: {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ height: 600, width: "100%" }}>
      <DataGrid
        rows={customers}
        columns={columns}
        loading={loading}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        rowCount={totalRows}
        paginationMode="server"
        pageSizeOptions={[10, 20, 50]}
        onRowClick={handleRowClick}
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
        }
        density="comfortable"
        disableColumnResize
        sx={{
          "& .MuiDataGrid-row": {
            cursor: "pointer",
            "&:hover": {
              backgroundColor: "action.hover",
            },
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
          loadingOverlay: {
            variant: "skeleton",
            noRowsVariant: "skeleton",
          },
        }}
      />
    </Box>
  );
}
