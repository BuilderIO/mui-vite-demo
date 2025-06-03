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
    // Start with a simple request without parameters to test basic connectivity
    let url = `${BASE_URL}/users`;

    try {
      // If no parameters, make simple call
      if (!params) {
        console.log("Making simple API call to:", url);
        const response = await fetch(url);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Simple API call failed:", response.status, errorText);
          throw new Error(
            `API Error: ${response.status} ${response.statusText}`,
          );
        }

        const data = await response.json();
        console.log("Simple API call successful:", data);
        return data;
      }

      // Build parameters only if they exist
      const searchParams = new URLSearchParams();

      if (params.page && params.page > 0) {
        searchParams.set("page", params.page.toString());
      }

      if (params.perPage && params.perPage > 0) {
        searchParams.set("perPage", Math.min(100, params.perPage).toString());
      }

      if (params.search && params.search.trim()) {
        searchParams.set("search", params.search.trim());
      }

      if (params.sortBy) {
        // Use simple field names that match the API documentation
        const validSortFields = [
          "name.first",
          "name.last",
          "location.city",
          "location.country",
          "dob.age",
          "registered.date",
        ];
        const sortField = validSortFields.includes(params.sortBy)
          ? params.sortBy
          : "name.first";
        searchParams.set("sortBy", sortField);
      }

      if (searchParams.toString()) {
        url += `?${searchParams.toString()}`;
      }

      console.log("Making parameterized API call to:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          "Parameterized API call failed:",
          response.status,
          errorText,
        );

        // Try falling back to simple call
        console.log("Falling back to simple API call...");
        return await this.getUsers();
      }

      const data = await response.json();
      console.log("Parameterized API call successful:", data);
      return data;
    } catch (error) {
      console.error("API call error:", error);

      // If there's a network error, throw a user-friendly message
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error(
          "Unable to connect to the API. Please check your internet connection.",
        );
      }

      // If there's an HTTP error, provide details
      if (error instanceof Error) {
        throw new Error(`API Error: ${error.message}`);
      }

      throw new Error("Unknown error occurred while fetching users");
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
      // Try to get just a basic users list first to see if API is working
      const basicResponse = await this.getUsers({ page: 1, perPage: 50 });

      const users = basicResponse.data || [];

      if (users.length === 0) {
        return {
          totalUsers: 0,
          newUsersThisMonth: 0,
          averageAge: 0,
          topCountries: [],
        };
      }

      const currentMonth = new Date();
      const currentMonthStart = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        1,
      );

      // Calculate new users this month - with safe access
      const newUsersThisMonth = users.filter((user) => {
        try {
          if (!user.registered?.date) return false;
          const registeredDate = new Date(user.registered.date);
          return registeredDate >= currentMonthStart;
        } catch {
          return false;
        }
      }).length;

      // Calculate average age - with safe access
      const usersWithAge = users.filter(
        (user) => user.dob?.age && !isNaN(user.dob.age),
      );
      const totalAge = usersWithAge.reduce(
        (sum, user) => sum + (user.dob?.age || 0),
        0,
      );
      const averageAge =
        usersWithAge.length > 0
          ? Math.round(totalAge / usersWithAge.length)
          : 0;

      // Calculate top countries - with safe access
      const countryCount = users.reduce(
        (acc, user) => {
          const country = user.location?.country;
          if (country) {
            acc[country] = (acc[country] || 0) + 1;
          }
          return acc;
        },
        {} as Record<string, number>,
      );

      const topCountries = Object.entries(countryCount)
        .map(([country, count]) => ({ country, count }))
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5);

      return {
        totalUsers: basicResponse.total || users.length,
        newUsersThisMonth,
        averageAge,
        topCountries,
      };
    } catch (error) {
      console.error("Error fetching user stats:", error);

      // Return default stats instead of throwing
      return {
        totalUsers: 0,
        newUsersThisMonth: 0,
        averageAge: 0,
        topCountries: [],
      };
    }
  }
}
