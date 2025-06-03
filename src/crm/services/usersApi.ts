import { User, UsersApiResponse, UserStats } from "../types/User";

const BASE_URL = "https://user-api.builder-io.workers.dev/api";

export class UsersApiService {
  static async getUsers(params?: {
    page?: number;
    perPage?: number;
    search?: string;
    sortBy?: string;
    span?: string;
  }): Promise<UsersApiResponse> {
    const searchParams = new URLSearchParams();

    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.perPage) searchParams.set("perPage", params.perPage.toString());
    if (params?.search) searchParams.set("search", params.search);
    if (params?.sortBy) searchParams.set("sortBy", params.sortBy);
    if (params?.span) searchParams.set("span", params.span);

    const url = `${BASE_URL}/users${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }

  static async getUser(id: string): Promise<User> {
    try {
      const response = await fetch(`${BASE_URL}/users/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  }

  static async createUser(
    userData: Partial<User>,
  ): Promise<{ success: boolean; uuid: string; message: string }> {
    try {
      const response = await fetch(`${BASE_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  static async updateUser(
    id: string,
    userData: Partial<User>,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${BASE_URL}/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }

  static async deleteUser(
    id: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${BASE_URL}/users/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  }

  static async getUserStats(): Promise<UserStats> {
    try {
      // Get recent users data to calculate stats
      const [totalResponse, recentResponse] = await Promise.all([
        this.getUsers({ page: 1, perPage: 1 }), // Just to get total count
        this.getUsers({ page: 1, perPage: 100, sortBy: "registered.date" }), // Recent users
      ]);

      const users = recentResponse.data;
      const currentMonth = new Date();
      const currentMonthStart = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        1,
      );

      // Calculate new users this month
      const newUsersThisMonth = users.filter((user) => {
        const registeredDate = new Date(user.registered.date);
        return registeredDate >= currentMonthStart;
      }).length;

      // Calculate average age
      const totalAge = users.reduce((sum, user) => sum + user.dob.age, 0);
      const averageAge = Math.round(totalAge / users.length);

      // Calculate top countries
      const countryCount = users.reduce(
        (acc, user) => {
          const country = user.location.country;
          acc[country] = (acc[country] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );

      const topCountries = Object.entries(countryCount)
        .map(([country, count]) => ({ country, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      return {
        totalUsers: totalResponse.total,
        newUsersThisMonth,
        averageAge,
        topCountries,
      };
    } catch (error) {
      console.error("Error fetching user stats:", error);
      throw error;
    }
  }
}
