import { useState, useEffect, useCallback } from "react";
import type {
  Customer,
  CustomersApiResponse,
  CreateCustomerRequest,
  UpdateCustomerRequest,
} from "../types/customer";

const API_BASE_URL = "https://user-api.builder-io.workers.dev/api";

interface UseCustomersOptions {
  page?: number;
  perPage?: number;
  search?: string;
  sortBy?: string;
}

interface UseCustomersReturn {
  customers: Customer[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  perPage: number;
  refetch: () => void;
  createCustomer: (data: CreateCustomerRequest) => Promise<void>;
  updateCustomer: (id: string, data: UpdateCustomerRequest) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;
  getCustomer: (id: string) => Promise<Customer | null>;
}

export function useCustomers(
  options: UseCustomersOptions = {},
): UseCustomersReturn {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(options.page || 1);
  const [perPage, setPerPage] = useState(options.perPage || 20);

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: page.toString(),
        perPage: perPage.toString(),
        ...(options.search && { search: options.search }),
        ...(options.sortBy && { sortBy: options.sortBy }),
      });

      const response = await fetch(`${API_BASE_URL}/users?${params}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch customers: ${response.status}`);
      }

      const data: CustomersApiResponse = await response.json();
      setCustomers(data.data);
      setTotal(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  }, [page, perPage, options.search, options.sortBy]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const createCustomer = useCallback(
    async (data: CreateCustomerRequest) => {
      try {
        const response = await fetch(`${API_BASE_URL}/users`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to create customer");
        }

        await fetchCustomers(); // Refresh the list
      } catch (err) {
        throw new Error(
          err instanceof Error ? err.message : "Failed to create customer",
        );
      }
    },
    [fetchCustomers],
  );

  const updateCustomer = useCallback(
    async (id: string, data: UpdateCustomerRequest) => {
      try {
        const response = await fetch(`${API_BASE_URL}/users/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to update customer");
        }

        await fetchCustomers(); // Refresh the list
      } catch (err) {
        throw new Error(
          err instanceof Error ? err.message : "Failed to update customer",
        );
      }
    },
    [fetchCustomers],
  );

  const deleteCustomer = useCallback(
    async (id: string) => {
      try {
        const response = await fetch(`${API_BASE_URL}/users/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to delete customer");
        }

        await fetchCustomers(); // Refresh the list
      } catch (err) {
        throw new Error(
          err instanceof Error ? err.message : "Failed to delete customer",
        );
      }
    },
    [fetchCustomers],
  );

  const getCustomer = useCallback(
    async (id: string): Promise<Customer | null> => {
      try {
        const response = await fetch(`${API_BASE_URL}/users/${id}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch customer: ${response.status}`);
        }

        return await response.json();
      } catch (err) {
        console.error("Error fetching customer:", err);
        return null;
      }
    },
    [],
  );

  return {
    customers,
    loading,
    error,
    total,
    page,
    perPage,
    refetch: fetchCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    getCustomer,
  };
}
