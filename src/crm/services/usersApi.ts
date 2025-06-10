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

export interface UsersApiResponse {
  page: number;
  perPage: number;
  total: number;
  span: string;
  effectivePage: number;
  data: User[];
}

export interface UsersApiParams {
  page?: number;
  perPage?: number;
  search?: string;
  sortBy?: string;
  span?: string;
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
  gender?: string;
}

export class UsersApiService {
  static async getUsers(
    params: UsersApiParams = {},
  ): Promise<UsersApiResponse> {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.append("page", params.page.toString());
    if (params.perPage)
      searchParams.append("perPage", params.perPage.toString());
    if (params.search) searchParams.append("search", params.search);
    if (params.sortBy) searchParams.append("sortBy", params.sortBy);
    if (params.span) searchParams.append("span", params.span);

    const response = await fetch(`${API_BASE_URL}/users?${searchParams}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.statusText}`);
    }

    return response.json();
  }

  static async getUser(id: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users/${id}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch user: ${response.statusText}`);
    }

    return response.json();
  }

  static async createUser(
    user: CreateUserRequest,
  ): Promise<{ success: boolean; uuid: string; message: string }> {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      throw new Error(`Failed to create user: ${response.statusText}`);
    }

    return response.json();
  }

  static async updateUser(
    id: string,
    updates: UpdateUserRequest,
  ): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error(`Failed to update user: ${response.statusText}`);
    }

    return response.json();
  }

  static async deleteUser(
    id: string,
  ): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Failed to delete user: ${response.statusText}`);
    }

    return response.json();
  }
}
