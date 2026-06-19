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

export interface CreateUserRequest {
  email: string;
  login: {
    username: string;
    password?: string;
  };
  name: {
    first: string;
    last: string;
    title?: string;
  };
  gender?: string;
  location?: {
    street?: {
      number: number;
      name: string;
    };
    city?: string;
    state?: string;
    country?: string;
    postcode?: string;
  };
}

export interface UpdateUserRequest {
  name?: {
    first?: string;
    last?: string;
    title?: string;
  };
  email?: string;
  location?: {
    street?: {
      number?: number;
      name?: string;
    };
    city?: string;
    state?: string;
    country?: string;
    postcode?: string;
  };
  phone?: string;
  cell?: string;
}

const API_BASE_URL = "https://user-api.builder-io.workers.dev/api";

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchUsers = useCallback(
    async (page = 1, search = "", pageSize = 10) => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          page: page.toString(),
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
        setCurrentPage(data.page);
        setPerPage(data.perPage);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch users");
        setUsers([]);
        setTotalUsers(0);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const createUser = useCallback(
    async (userData: CreateUserRequest) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE_URL}/users`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });

        if (!response.ok) {
          throw new Error(`Failed to create user: ${response.statusText}`);
        }

        const result = await response.json();
        // Refresh the users list
        await fetchUsers(currentPage, searchQuery, perPage);
        return result;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create user");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentPage, searchQuery, perPage, fetchUsers],
  );

  const updateUser = useCallback(
    async (userId: string, userData: UpdateUserRequest) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });

        if (!response.ok) {
          throw new Error(`Failed to update user: ${response.statusText}`);
        }

        const result = await response.json();
        // Refresh the users list
        await fetchUsers(currentPage, searchQuery, perPage);
        return result;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update user");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentPage, searchQuery, perPage, fetchUsers],
  );

  const deleteUser = useCallback(
    async (userId: string) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error(`Failed to delete user: ${response.statusText}`);
        }

        const result = await response.json();
        // Refresh the users list
        await fetchUsers(currentPage, searchQuery, perPage);
        return result;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete user");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentPage, searchQuery, perPage, fetchUsers],
  );

  const searchUsers = useCallback(
    (query: string) => {
      setSearchQuery(query);
      setCurrentPage(1); // Reset to first page when searching
      fetchUsers(1, query, perPage);
    },
    [perPage, fetchUsers],
  );

  const changePage = useCallback(
    (page: number) => {
      setCurrentPage(page);
      fetchUsers(page, searchQuery, perPage);
    },
    [searchQuery, perPage, fetchUsers],
  );

  const changePageSize = useCallback(
    (pageSize: number) => {
      setPerPage(pageSize);
      setCurrentPage(1);
      fetchUsers(1, searchQuery, pageSize);
    },
    [searchQuery, fetchUsers],
  );

  useEffect(() => {
    fetchUsers(1, "", 10);
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    totalUsers,
    currentPage,
    perPage,
    searchQuery,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    searchUsers,
    changePage,
    changePageSize,
  };
};
