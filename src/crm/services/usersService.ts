import type { TeamMember } from "../types/taskTypes";

const BASE_URL = "https://user-api.builder-io.workers.dev/api";

interface ApiUser {
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
  picture?: {
    large: string;
    medium: string;
    thumbnail: string;
  };
}

interface UsersApiResponse {
  page: number;
  perPage: number;
  total: number;
  span: string;
  effectivePage: number;
  data: ApiUser[];
}

class UsersService {
  private async fetchFromApi(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${BASE_URL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Users API error:", error);
      throw error;
    }
  }

  private transformApiUserToTeamMember(apiUser: ApiUser): TeamMember {
    return {
      id: apiUser.login.uuid,
      name: {
        first: apiUser.name.first,
        last: apiUser.name.last,
      },
      email: apiUser.email,
      picture: apiUser.picture ? {
        thumbnail: apiUser.picture.thumbnail,
      } : undefined,
    };
  }

  async getTeamMembers(params: {
    page?: number;
    perPage?: number;
    search?: string;
    sortBy?: string;
  } = {}): Promise<{
    members: TeamMember[];
    total: number;
    page: number;
    perPage: number;
  }> {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.append("page", params.page.toString());
    if (params.perPage) searchParams.append("perPage", params.perPage.toString());
    if (params.search) searchParams.append("search", params.search);
    if (params.sortBy) searchParams.append("sortBy", params.sortBy);

    const queryString = searchParams.toString();
    const endpoint = `/users${queryString ? `?${queryString}` : ""}`;

    const response: UsersApiResponse = await this.fetchFromApi(endpoint);

    return {
      members: response.data.map(this.transformApiUserToTeamMember),
      total: response.total,
      page: response.page,
      perPage: response.perPage,
    };
  }

  async getTeamMember(id: string): Promise<TeamMember> {
    const apiUser: ApiUser = await this.fetchFromApi(`/users/${id}`);
    return this.transformApiUserToTeamMember(apiUser);
  }

  async searchTeamMembers(query: string): Promise<TeamMember[]> {
    const response = await this.getTeamMembers({ search: query, perPage: 50 });
    return response.members;
  }

  async getAllTeamMembers(): Promise<TeamMember[]> {
    // Get first batch to see total
    const firstBatch = await this.getTeamMembers({ perPage: 50 });
    
    if (firstBatch.total <= 50) {
      return firstBatch.members;
    }

    // If there are more, fetch all pages
    const allMembers = [...firstBatch.members];
    const totalPages = Math.ceil(firstBatch.total / 50);

    const promises = [];
    for (let page = 2; page <= totalPages; page++) {
      promises.push(this.getTeamMembers({ page, perPage: 50 }));
    }

    const results = await Promise.all(promises);
    results.forEach(result => {
      allMembers.push(...result.members);
    });

    return allMembers;
  }

  async createTeamMember(memberData: {
    email: string;
    firstName: string;
    lastName: string;
    username?: string;
  }): Promise<TeamMember> {
    const payload = {
      email: memberData.email,
      login: {
        username: memberData.username || memberData.email.split('@')[0],
        password: "defaultPassword123", // In a real app, this would be handled differently
      },
      name: {
        first: memberData.firstName,
        last: memberData.lastName,
        title: "Mr", // Default value
      },
    };

    const response = await this.fetchFromApi("/users", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (response.success && response.uuid) {
      // Fetch the created user
      return await this.getTeamMember(response.uuid);
    }

    throw new Error("Failed to create team member");
  }

  async updateTeamMember(id: string, updates: {
    firstName?: string;
    lastName?: string;
    email?: string;
  }): Promise<TeamMember> {
    const payload: any = {};

    if (updates.firstName || updates.lastName) {
      payload.name = {};
      if (updates.firstName) payload.name.first = updates.firstName;
      if (updates.lastName) payload.name.last = updates.lastName;
    }

    if (updates.email) {
      payload.email = updates.email;
    }

    const response = await this.fetchFromApi(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });

    if (response.success) {
      // Fetch the updated user
      return await this.getTeamMember(id);
    }

    throw new Error("Failed to update team member");
  }

  async deleteTeamMember(id: string): Promise<void> {
    const response = await this.fetchFromApi(`/users/${id}`, {
      method: "DELETE",
    });

    if (!response.success) {
      throw new Error("Failed to delete team member");
    }
  }
}

export const usersService = new UsersService();
export default usersService;
