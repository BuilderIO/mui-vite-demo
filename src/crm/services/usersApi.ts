// Types for User API
export interface UserLocation {
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
}

export interface UserName {
  title: string;
  first: string;
  last: string;
}

export interface UserLogin {
  uuid: string;
  username: string;
  password: string;
}

export interface UserPicture {
  large: string;
  medium: string;
  thumbnail: string;
}

export interface User {
  login: UserLogin;
  name: UserName;
  gender: string;
  location: UserLocation;
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
  picture: UserPicture;
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
  location?: Partial<UserLocation>;
}

export interface UpdateUserRequest {
  email?: string;
  name?: Partial<UserName>;
  location?: Partial<UserLocation>;
  phone?: string;
  cell?: string;
  gender?: string;
}

const BASE_URL = "https://user-api.builder-io.workers.dev/api";

export class UsersApiService {
  async getUsers(
    params: {
      page?: number;
      perPage?: number;
      search?: string;
      sortBy?: string;
      span?: string;
    } = {},
  ): Promise<UsersApiResponse> {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append("page", params.page.toString());
    if (params.perPage)
      queryParams.append("perPage", params.perPage.toString());
    if (params.search) queryParams.append("search", params.search);
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params.span) queryParams.append("span", params.span);

    const response = await fetch(`${BASE_URL}/users?${queryParams}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.statusText}`);
    }

    return response.json();
  }

  async getUserById(id: string): Promise<User> {
    const response = await fetch(`${BASE_URL}/users/${encodeURIComponent(id)}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch user: ${response.statusText}`);
    }

    return response.json();
  }

  async createUser(
    userData: CreateUserRequest,
  ): Promise<{ success: boolean; uuid: string; message: string }> {
    const response = await fetch(`${BASE_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.error || `Failed to create user: ${response.statusText}`,
      );
    }

    return response.json();
  }

  async updateUser(
    id: string,
    userData: UpdateUserRequest,
  ): Promise<{ success: boolean; message: string }> {
    const response = await fetch(
      `${BASE_URL}/users/${encodeURIComponent(id)}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.error || `Failed to update user: ${response.statusText}`,
      );
    }

    return response.json();
  }

  async deleteUser(id: string): Promise<{ success: boolean; message: string }> {
    const response = await fetch(
      `${BASE_URL}/users/${encodeURIComponent(id)}`,
      {
        method: "DELETE",
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.error || `Failed to delete user: ${response.statusText}`,
      );
    }

    return response.json();
  }
}

export const usersApi = new UsersApiService();
