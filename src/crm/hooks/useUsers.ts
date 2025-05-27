import { useState, useEffect, useCallback } from "react";

const API_BASE_URL = "https://user-api.builder-io.workers.dev/api";

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
    coordinates?: {
      latitude: number;
      longitude: number;
    };
    timezone?: {
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

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const fetchUsers = useCallback(
    async (
      searchQuery = "",
      sortBy = "name.first",
      currentPage = 1,
      currentPerPage = 10,
    ) => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          page: currentPage.toString(),
          perPage: currentPerPage.toString(),
          sortBy,
        });

        if (searchQuery) {
          params.append("search", searchQuery);
        }

        const response = await fetch(`${API_BASE_URL}/users?${params}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch users: ${response.status}`);
        }

        const data: UsersResponse = await response.json();
        setUsers(data.data);
        setTotal(data.total);
        setPage(data.page);
        setPerPage(data.perPage);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setUsers([]);
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
          const errorData = await response.json();
          throw new Error(
            errorData.error || `Failed to create user: ${response.status}`,
          );
        }

        const result = await response.json();

        // Refresh the users list after creation
        await fetchUsers();

        return result;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create user");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchUsers],
  );

  const updateUser = useCallback(
    async (userId: string, userData: Partial<CreateUserRequest>) => {
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
          const errorData = await response.json();
          throw new Error(
            errorData.error || `Failed to update user: ${response.status}`,
          );
        }

        const result = await response.json();

        // Refresh the users list after update
        await fetchUsers();

        return result;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update user");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchUsers],
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
          const errorData = await response.json();
          throw new Error(
            errorData.error || `Failed to delete user: ${response.status}`,
          );
        }

        const result = await response.json();

        // Refresh the users list after deletion
        await fetchUsers();

        return result;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete user");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchUsers],
  );

  const getUserById = useCallback(async (userId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch user: ${response.status}`);
      }

      const user: User = await response.json();
      return user;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch user");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    total,
    page,
    perPage,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    getUserById,
  };
};
