import { useState, useEffect, useCallback } from "react";
import { User, UsersApiResponse, UserFormData } from "../types/user";

const API_BASE_URL = "https://user-api.builder-io.workers.dev/api";

export const useCustomers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 20,
    total: 0,
  });

  const fetchUsers = useCallback(
    async (
      page: number = 1,
      perPage: number = 20,
      search: string = "",
      sortBy: string = "name.first",
    ) => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          page: page.toString(),
          perPage: perPage.toString(),
          ...(search && { search }),
          sortBy,
        });

        const response = await fetch(`${API_BASE_URL}/users?${params}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: UsersApiResponse = await response.json();

        setUsers(data.data);
        setPagination({
          page: data.page,
          perPage: data.perPage,
          total: data.total,
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "An error occurred while fetching users";
        setError(errorMessage);
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const updateUser = useCallback(
    async (userId: string, userData: Partial<UserFormData>) => {
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
            errorData.error || `HTTP error! status: ${response.status}`,
          );
        }

        // Refresh the users list after successful update
        await fetchUsers(pagination.page, pagination.perPage);

        return { success: true };
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "An error occurred while updating user";
        setError(errorMessage);
        console.error("Error updating user:", err);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [pagination.page, pagination.perPage, fetchUsers],
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
            errorData.error || `HTTP error! status: ${response.status}`,
          );
        }

        // Refresh the users list after successful deletion
        await fetchUsers(pagination.page, pagination.perPage);

        return { success: true };
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "An error occurred while deleting user";
        setError(errorMessage);
        console.error("Error deleting user:", err);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [pagination.page, pagination.perPage, fetchUsers],
  );

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    pagination,
    fetchUsers,
    updateUser,
    deleteUser,
  };
};
