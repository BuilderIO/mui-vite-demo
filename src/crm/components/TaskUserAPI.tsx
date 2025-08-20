import * as React from "react";

// User interface matching the Builder.io User API
export interface User {
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
  picture: {
    large: string;
    medium: string;
    thumbnail: string;
  };
}

// API endpoints
const API_BASE_URL = "https://user-api.builder-io.workers.dev/api";

// Custom hook for fetching users from the Builder.io User API
export const useUsers = () => {
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchUsers = React.useCallback(async (params?: {
    page?: number;
    perPage?: number;
    search?: string;
    sortBy?: string;
  }) => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.perPage) queryParams.append("perPage", params.perPage.toString());
      if (params?.search) queryParams.append("search", params.search);
      if (params?.sortBy) queryParams.append("sortBy", params.sortBy);

      const response = await fetch(`${API_BASE_URL}/users?${queryParams}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.status}`);
      }

      const data = await response.json();
      setUsers(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch users");
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchUsers({ perPage: 50, sortBy: "name.first" });
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    refetch: fetchUsers,
  };
};

// Utility function to get user's full name
export const getUserFullName = (user: User): string => {
  return `${user.name.first} ${user.name.last}`;
};

// Utility function to get user's initials for avatar
export const getUserInitials = (user: User): string => {
  return `${user.name.first.charAt(0)}${user.name.last.charAt(0)}`.toUpperCase();
};

// Utility function to format user for selection display
export const formatUserForDisplay = (user: User) => ({
  id: user.login.uuid,
  name: getUserFullName(user),
  initials: getUserInitials(user),
  email: user.email,
  avatar: user.picture.thumbnail,
  username: user.login.username,
});

// API functions for CRUD operations
export const userAPI = {
  // Get all users with optional filtering
  getUsers: async (params?: {
    page?: number;
    perPage?: number;
    search?: string;
    sortBy?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.perPage) queryParams.append("perPage", params.perPage.toString());
    if (params?.search) queryParams.append("search", params.search);
    if (params?.sortBy) queryParams.append("sortBy", params.sortBy);

    const response = await fetch(`${API_BASE_URL}/users?${queryParams}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  },

  // Get a specific user by ID
  getUser: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  },

  // Create a new user
  createUser: async (userData: Partial<User>) => {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  },

  // Update an existing user
  updateUser: async (id: string, userData: Partial<User>) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  },

  // Delete a user
  deleteUser: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  },
};
