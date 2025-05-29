import * as React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { alpha, styled } from "@mui/material/styles";

const SearchWrapper = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.black, 0.04),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.black, 0.06),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    width: "300px",
  },
  ...theme.applyStyles("dark", {
    backgroundColor: alpha(theme.palette.common.white, 0.06),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.1),
    },
  }),
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
  },
}));

interface CrmCustomersToolbarProps {
  onSearch: (query: string) => void;
  onSort: (field: string) => void;
  currentSort: string;
  totalUsers: number;
}

const sortOptions = [
  { value: "name.first", label: "First Name" },
  { value: "name.last", label: "Last Name" },
  { value: "location.city", label: "City" },
  { value: "location.country", label: "Country" },
  { value: "dob.age", label: "Age" },
  { value: "registered.date", label: "Registration Date" },
];

export default function CrmCustomersToolbar({
  onSearch,
  onSort,
  currentSort,
  totalUsers,
}: CrmCustomersToolbarProps) {
  const [searchValue, setSearchValue] = React.useState("");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchValue(value);

    // Debounce the search
    const timeoutId = setTimeout(() => {
      onSearch(value);
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearch(searchValue);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchValue, onSearch]);

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      justifyContent="space-between"
      alignItems={{ xs: "stretch", sm: "center" }}
      spacing={2}
      sx={{ mb: 2 }}
    >
      <Box>
        <Typography variant="h6" component="h3">
          Customer Management
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {totalUsers} total customers
        </Typography>
      </Box>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        alignItems="center"
      >
        <SearchWrapper>
          <SearchIconWrapper>
            <SearchRoundedIcon fontSize="small" />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search customers..."
            inputProps={{ "aria-label": "search customers" }}
            value={searchValue}
            onChange={handleSearchChange}
          />
        </SearchWrapper>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel id="sort-select-label">Sort by</InputLabel>
          <Select
            labelId="sort-select-label"
            value={currentSort}
            label="Sort by"
            onChange={(event) => onSort(event.target.value)}
          >
            {sortOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
    </Stack>
  );
}
