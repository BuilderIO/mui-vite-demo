import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import {
  DataGridPro,
  GridColDef,
  GridRowParams,
  GridCellParams,
} from "@mui/x-data-grid-pro";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Typography from "@mui/material/Typography";
import { customersApi } from "../utils/customersApi";
import type { Customer } from "../types/customer";

interface CustomersDataGridProps {
  onEditCustomer: (customer: Customer) => void;
  onViewCustomer: (customer: Customer) => void;
  onDeleteCustomer: (customer: Customer) => void;
  searchQuery?: string;
  refreshTrigger?: number;
}

function renderAvatar(params: GridCellParams<any, Customer>) {
  const customer = params.row as Customer;
  const fullName = `${customer.name.first} ${customer.name.last}`;

  return (
    <Avatar
      src={customer.picture?.thumbnail}
      alt={fullName}
      sx={{ width: 32, height: 32 }}
    >
      {fullName.charAt(0).toUpperCase()}
    </Avatar>
  );
}

function renderName(params: GridCellParams<any, Customer>) {
  const customer = params.row as Customer;
  return `${customer.name.title} ${customer.name.first} ${customer.name.last}`;
}

function renderLocation(params: GridCellParams<any, Customer>) {
  const customer = params.row as Customer;
  return `${customer.location.city}, ${customer.location.state}, ${customer.location.country}`;
}

function renderGender(params: GridCellParams<any, Customer>) {
  const customer = params.row as Customer;
  const color = customer.gender === "male" ? "primary" : "secondary";
  return (
    <Chip
      label={customer.gender.charAt(0).toUpperCase() + customer.gender.slice(1)}
      color={color}
      size="small"
      variant="outlined"
    />
  );
}

function renderAge(params: GridCellParams<any, Customer>) {
  const customer = params.row as Customer;
  return customer.dob.age;
}

export default function CustomersDataGrid({
  onEditCustomer,
  onViewCustomer,
  onDeleteCustomer,
  searchQuery = "",
  refreshTrigger = 0,
}: CustomersDataGridProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 25,
  });
  const [rowCount, setRowCount] = useState(0);

  const loadCustomers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await customersApi.fetchCustomers({
        page: paginationModel.page + 1, // API is 1-indexed
        perPage: paginationModel.pageSize,
        search: searchQuery || undefined,
        sortBy: "name.first",
      });

      setCustomers(response.data);
      setRowCount(response.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setCustomers([]);
      setRowCount(0);
    } finally {
      setLoading(false);
    }
  }, [paginationModel.page, paginationModel.pageSize, searchQuery]);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers, refreshTrigger]);

  const handleActions = (params: GridRowParams) => {
    const customer = params.row as Customer;

    return (
      <Box sx={{ display: "flex", gap: 1 }}>
        <Tooltip title="View Details">
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onViewCustomer(customer);
            }}
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Edit Customer">
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onEditCustomer(customer);
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete Customer">
          <IconButton
            size="small"
            color="error"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteCustomer(customer);
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    );
  };

  const columns: GridColDef[] = [
    {
      field: "avatar",
      headerName: "",
      width: 60,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: renderAvatar,
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      minWidth: 200,
      renderCell: renderName,
      sortable: false, // API handles sorting
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      minWidth: 200,
      sortable: false,
    },
    {
      field: "phone",
      headerName: "Phone",
      flex: 0.8,
      minWidth: 140,
      sortable: false,
    },
    {
      field: "location",
      headerName: "Location",
      flex: 1,
      minWidth: 200,
      renderCell: renderLocation,
      sortable: false,
    },
    {
      field: "gender",
      headerName: "Gender",
      width: 100,
      renderCell: renderGender,
      sortable: false,
    },
    {
      field: "age",
      headerName: "Age",
      width: 80,
      renderCell: renderAge,
      sortable: false,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 140,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: handleActions,
    },
  ];

  if (error) {
    return (
      <Box sx={{ p: 2, textAlign: "center" }}>
        <Typography color="error">Error loading customers: {error}</Typography>
      </Box>
    );
  }

  return (
    <DataGridPro
      rows={customers}
      columns={columns}
      loading={loading}
      paginationMode="server"
      rowCount={rowCount}
      paginationModel={paginationModel}
      onPaginationModelChange={setPaginationModel}
      pageSizeOptions={[10, 25, 50, 100]}
      getRowId={(row) => row.login.uuid}
      disableRowSelectionOnClick
      density="comfortable"
      sx={{
        "& .MuiDataGrid-row:hover": {
          cursor: "default",
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
  );
}
