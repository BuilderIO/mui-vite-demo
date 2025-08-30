import { useState, useEffect, useCallback } from "react";
import {
  User,
  UsersApiResponse,
  UserUpdateRequest,
  ApiResponse,
} from "../types/user";

const API_BASE_URL = "https://user-api.builder-io.workers.dev/api";

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const fetchUsers = useCallback(
    async (
      searchQuery?: string,
      sortBy?: string,
      currentPage?: number,
      currentPerPage?: number,
    ) => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          page: (currentPage || page).toString(),
          perPage: (currentPerPage || perPage).toString(),
        });

        if (searchQuery) {
          params.append("search", searchQuery);
        }

        if (sortBy) {
          params.append("sortBy", sortBy);
        }

        const response = await fetch(`${API_BASE_URL}/users?${params}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch users: ${response.statusText}`);
        }

        const data: UsersApiResponse = await response.json();
        setUsers(data.data);
        setTotal(data.total);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch users");
        setUsers([]);
      } finally {
        setLoading(false);
      }
    },
    [page, perPage],
  );

  const updateUser = useCallback(
    async (userId: string, updates: UserUpdateRequest): Promise<boolean> => {
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

        const result: ApiResponse = await response.json();

        if (result.success) {
          // Refresh the users list after successful update
          await fetchUsers();
          return true;
        } else {
          throw new Error(result.message || "Failed to update user");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update user");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchUsers],
  );

  const deleteUser = useCallback(
    async (userId: string): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error(`Failed to delete user: ${response.statusText}`);
        }

        const result: ApiResponse = await response.json();

        if (result.success) {
          // Refresh the users list after successful deletion
          await fetchUsers();
          return true;
        } else {
          throw new Error(result.message || "Failed to delete user");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete user");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchUsers],
  );

  // Load initial data
  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    total,
    page,
    perPage,
    setPage,
    setPerPage,
    fetchUsers,
    updateUser,
    deleteUser,
  };
};
