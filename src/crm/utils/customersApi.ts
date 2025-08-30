import type {
  Customer,
  CustomersResponse,
  CreateCustomerRequest,
  UpdateCustomerRequest,
} from "../types/customer";

const API_BASE_URL = "https://user-api.builder-io.workers.dev/api";

export interface FetchCustomersParams {
  page?: number;
  perPage?: number;
  search?: string;
  sortBy?: string;
  span?: string;
}

export const customersApi = {
  // Fetch paginated customers with optional search and sorting
  async fetchCustomers(
    params: FetchCustomersParams = {},
  ): Promise<CustomersResponse> {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.set("page", params.page.toString());
    if (params.perPage) searchParams.set("perPage", params.perPage.toString());
    if (params.search) searchParams.set("search", params.search);
    if (params.sortBy) searchParams.set("sortBy", params.sortBy);
    if (params.span) searchParams.set("span", params.span);

    const url = `${API_BASE_URL}/users?${searchParams.toString()}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching customers:", error);
      throw error;
    }
  },

  // Get a specific customer by ID, username, or email
  async getCustomer(id: string): Promise<Customer> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching customer:", error);
      throw error;
    }
  },

  // Create a new customer
  async createCustomer(
    customerData: CreateCustomerRequest,
  ): Promise<{ success: boolean; uuid: string; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(customerData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating customer:", error);
      throw error;
    }
  },

  // Update an existing customer
  async updateCustomer(
    id: string,
    customerData: UpdateCustomerRequest,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(customerData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating customer:", error);
      throw error;
    }
  },

  // Delete a customer
  async deleteCustomer(
    id: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error deleting customer:", error);
      throw error;
    }
  },
};
