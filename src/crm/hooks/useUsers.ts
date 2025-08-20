import * as React from "react";
import { User } from "../types/tasks";

const API_BASE_URL = "https://user-api.builder-io.workers.dev/api";

interface UseUsersResult {
  users: User[];
  loading: boolean;
  error: string | null;
  fetchUsers: (params?: {
    search?: string;
    page?: number;
    perPage?: number;
  }) => Promise<void>;
  createUser: (userData: Partial<User>) => Promise<{ success: boolean; uuid?: string; error?: string }>;
  updateUser: (id: string, userData: Partial<User>) => Promise<{ success: boolean; error?: string }>;
  deleteUser: (id: string) => Promise<{ success: boolean; error?: string }>;
}

export function useUsers(): UseUsersResult {
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchUsers = React.useCallback(async (params?: {
    search?: string;
    page?: number;
    perPage?: number;
  }) => {
    setLoading(true);
    setError(null);
    
    try {
      const searchParams = new URLSearchParams();
      if (params?.search) searchParams.append("search", params.search);
      if (params?.page) searchParams.append("page", params.page.toString());
      if (params?.perPage) searchParams.append("perPage", params.perPage.toString());

      const response = await fetch(
        `${API_BASE_URL}/users?${searchParams.toString()}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setUsers(data.data || []);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch users");
      // Fallback to mock data if API fails
      setUsers(getMockUsers());
    } finally {
      setLoading(false);
    }
  }, []);

  const createUser = React.useCallback(async (userData: Partial<User>) => {
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
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        // Refresh users list
        await fetchUsers();
        return { success: true, uuid: result.uuid };
      } else {
        return { success: false, error: result.error || "Failed to create user" };
      }
    } catch (err) {
      console.error("Error creating user:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to create user";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [fetchUsers]);

  const updateUser = React.useCallback(async (id: string, userData: Partial<User>) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        // Refresh users list
        await fetchUsers();
        return { success: true };
      } else {
        return { success: false, error: result.error || "Failed to update user" };
      }
    } catch (err) {
      console.error("Error updating user:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to update user";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [fetchUsers]);

  const deleteUser = React.useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        // Refresh users list
        await fetchUsers();
        return { success: true };
      } else {
        return { success: false, error: result.error || "Failed to delete user" };
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to delete user";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [fetchUsers]);

  // Initial fetch
  React.useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  };
}

// Mock data fallback
function getMockUsers(): User[] {
  return [
    {
      login: {
        uuid: "user-1",
        username: "alice.johnson",
      },
      name: {
        title: "Ms",
        first: "Alice",
        last: "Johnson",
      },
      email: "alice.johnson@company.com",
      picture: {
        large: "https://randomuser.me/api/portraits/women/1.jpg",
        medium: "https://randomuser.me/api/portraits/med/women/1.jpg",
        thumbnail: "https://randomuser.me/api/portraits/thumb/women/1.jpg",
      },
    },
    {
      login: {
        uuid: "user-2",
        username: "bob.smith",
      },
      name: {
        title: "Mr",
        first: "Bob",
        last: "Smith",
      },
      email: "bob.smith@company.com",
      picture: {
        large: "https://randomuser.me/api/portraits/men/2.jpg",
        medium: "https://randomuser.me/api/portraits/med/men/2.jpg",
        thumbnail: "https://randomuser.me/api/portraits/thumb/men/2.jpg",
      },
    },
    {
      login: {
        uuid: "user-3",
        username: "carol.davis",
      },
      name: {
        title: "Ms",
        first: "Carol",
        last: "Davis",
      },
      email: "carol.davis@company.com",
      picture: {
        large: "https://randomuser.me/api/portraits/women/3.jpg",
        medium: "https://randomuser.me/api/portraits/med/women/3.jpg",
        thumbnail: "https://randomuser.me/api/portraits/thumb/women/3.jpg",
      },
    },
    {
      login: {
        uuid: "user-4",
        username: "david.wilson",
      },
      name: {
        title: "Mr",
        first: "David",
        last: "Wilson",
      },
      email: "david.wilson@company.com",
      picture: {
        large: "https://randomuser.me/api/portraits/men/4.jpg",
        medium: "https://randomuser.me/api/portraits/med/men/4.jpg",
        thumbnail: "https://randomuser.me/api/portraits/thumb/men/4.jpg",
      },
    },
    {
      login: {
        uuid: "user-5",
        username: "emma.brown",
      },
      name: {
        title: "Ms",
        first: "Emma",
        last: "Brown",
      },
      email: "emma.brown@company.com",
      picture: {
        large: "https://randomuser.me/api/portraits/women/5.jpg",
        medium: "https://randomuser.me/api/portraits/med/women/5.jpg",
        thumbnail: "https://randomuser.me/api/portraits/thumb/women/5.jpg",
      },
    },
  ];
}
