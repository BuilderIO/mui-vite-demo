import { useState, useEffect, useCallback } from "react";

export interface User {
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

export interface UsersResponse {
  page: number;
  perPage: number;
  total: number;
  span: string;
  effectivePage: number;
  data: User[];
}

const API_BASE_URL = "https://user-api.builder-io.workers.dev/api";

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchUsers = useCallback(
    async (
      pageNum: number = page,
      pageSize: number = perPage,
      search: string = searchQuery,
    ) => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          page: pageNum.toString(),
          perPage: pageSize.toString(),
          sortBy: "name.first",
        });

        if (search.trim()) {
          params.append("search", search.trim());
        }

        const response = await fetch(`${API_BASE_URL}/users?${params}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch users: ${response.statusText}`);
        }

        const data: UsersResponse = await response.json();
        setUsers(data.data);
        setTotalUsers(data.total);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "An error occurred while fetching users",
        );
        setUsers([]);
        setTotalUsers(0);
      } finally {
        setLoading(false);
      }
    },
    [page, perPage, searchQuery],
  );

  const updateUser = async (userId: string, updates: Partial<User>) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error(`Failed to update user: ${response.statusText}`);
      }

      const result = await response.json();

      // Refresh the users list after successful update
      await fetchUsers();

      return result;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while updating the user",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPerPage(newPageSize);
    setPage(1); // Reset to first page when changing page size
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1); // Reset to first page when searching
  };

  // Initial load and reload when dependencies change
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    totalUsers,
    page,
    perPage,
    searchQuery,
    fetchUsers,
    updateUser,
    handlePageChange,
    handlePageSizeChange,
    handleSearch,
  };
}
