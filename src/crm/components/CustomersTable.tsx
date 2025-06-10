import * as React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Avatar,
  Chip,
  Stack,
  Button,
  Alert,
} from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
  GridSortModel,
  GridActionsCellItem,
  GridRowParams,
} from "@mui/x-data-grid";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import { User } from "../types/user";

interface CustomersTableProps {
  users: User[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  perPage: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onSearch: (query: string) => void;
  onSort: (field: string) => void;
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
}

export default function CustomersTable({
  users,
  loading,
  error,
  total,
  page,
  perPage,
  onPageChange,
  onPageSizeChange,
  onSearch,
  onSort,
  onEdit,
  onDelete,
}: CustomersTableProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [deleteConfirm, setDeleteConfirm] = React.useState<string | null>(null);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);

    // Debounce search
    const timeoutId = setTimeout(() => {
      onSearch(query);
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  const handlePaginationChange = (model: GridPaginationModel) => {
    if (model.page !== page - 1) {
      onPageChange(model.page + 1);
    }
    if (model.pageSize !== perPage) {
      onPageSizeChange(model.pageSize);
    }
  };

  const handleSortChange = (model: GridSortModel) => {
    if (model.length > 0) {
      const sort = model[0];
      const sortField =
        sort.field === "fullName"
          ? "name.first"
          : sort.field === "location"
            ? "location.city"
            : sort.field === "age"
              ? "dob.age"
              : sort.field;
      onSort(sortField);
    }
  };

  const handleDeleteClick = (userId: string) => {
    if (deleteConfirm === userId) {
      onDelete(userId);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(userId);
      // Auto-cancel after 3 seconds
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const getGenderColor = (
    gender: string,
  ): "default" | "primary" | "secondary" => {
    switch (gender.toLowerCase()) {
      case "male":
        return "primary";
      case "female":
        return "secondary";
      default:
        return "default";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const columns: GridColDef[] = [
    {
      field: "avatar",
      headerName: "",
      width: 60,
      sortable: false,
      renderCell: (params) => (
        <Avatar
          src={params.row.picture.thumbnail}
          alt={`${params.row.name.first} ${params.row.name.last}`}
          sx={{ width: 32, height: 32 }}
        >
          <PersonRoundedIcon fontSize="small" />
        </Avatar>
      ),
    },
    {
      field: "fullName",
      headerName: "Name",
      flex: 1,
      minWidth: 150,
      valueGetter: (value, row) => `${row.name.first} ${row.name.last}`,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2" fontWeight={500}>
            {params.row.name.title} {params.row.name.first}{" "}
            {params.row.name.last}
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
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Typography variant="body2">{params.value}</Typography>
      ),
    },
    {
      field: "location",
      headerName: "Location",
      flex: 1,
      minWidth: 150,
      valueGetter: (value, row) =>
        `${row.location.city}, ${row.location.country}`,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2">{params.row.location.city}</Typography>
          <Typography variant="caption" color="text.secondary">
            {params.row.location.country}
          </Typography>
        </Box>
      ),
    },
    {
      field: "phone",
      headerName: "Phone",
      width: 130,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: "gender",
      headerName: "Gender",
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          color={getGenderColor(params.value)}
          variant="outlined"
          sx={{ textTransform: "capitalize" }}
        />
      ),
    },
    {
      field: "age",
      headerName: "Age",
      width: 80,
      valueGetter: (value, row) => row.dob.age,
      renderCell: (params) => (
        <Typography variant="body2">{params.value}</Typography>
      ),
    },
    {
      field: "registered",
      headerName: "Registered",
      width: 120,
      valueGetter: (value, row) => row.registered.date,
      renderCell: (params) => (
        <Typography variant="body2" color="text.secondary">
          {formatDate(params.value)}
        </Typography>
      ),
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem
          icon={<EditRoundedIcon />}
          label="Edit"
          onClick={() => onEdit(params.row)}
          color="primary"
        />,
        <GridActionsCellItem
          icon={<DeleteRoundedIcon />}
          label={
            deleteConfirm === params.row.login.uuid
              ? "Confirm Delete"
              : "Delete"
          }
          onClick={() => handleDeleteClick(params.row.login.uuid)}
          color={deleteConfirm === params.row.login.uuid ? "error" : "default"}
          sx={{
            color:
              deleteConfirm === params.row.login.uuid
                ? "error.main"
                : "text.secondary",
          }}
        />,
      ],
    },
  ];

  return (
    <Card
      variant="outlined"
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardContent sx={{ pb: 0 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
          sx={{ mb: 2 }}
        >
          <Typography variant="h6" component="h3">
            Customers ({total.toLocaleString()})
          </Typography>
          <TextField
            size="small"
            placeholder="Search customers..."
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{ width: 300 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </Stack>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
      </CardContent>

      <Box sx={{ flexGrow: 1, width: "100%" }}>
        <DataGrid
          rows={users}
          columns={columns}
          loading={loading}
          paginationMode="server"
          sortingMode="server"
          rowCount={total}
          pageSizeOptions={[5, 10, 25, 50]}
          paginationModel={{
            page: page - 1,
            pageSize: perPage,
          }}
          onPaginationModelChange={handlePaginationChange}
          onSortModelChange={handleSortChange}
          getRowId={(row) => row.login.uuid}
          disableRowSelectionOnClick
          density="comfortable"
          sx={{
            border: "none",
            "& .MuiDataGrid-cell": {
              borderBottom: "1px solid",
              borderBottomColor: "divider",
            },
            "& .MuiDataGrid-columnHeaders": {
              borderBottom: "2px solid",
              borderBottomColor: "divider",
              backgroundColor: "background.paper",
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "2px solid",
              borderTopColor: "divider",
            },
          }}
        />
      </Box>
    </Card>
  );
}
