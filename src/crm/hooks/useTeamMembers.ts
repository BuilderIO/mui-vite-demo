import * as React from "react";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface ApiUser {
  login: {
    uuid: string;
    username: string;
  };
  name: {
    first: string;
    last: string;
  };
  email: string;
  picture?: {
    thumbnail: string;
  };
}

interface UseTeamMembersResult {
  teamMembers: TeamMember[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useTeamMembers(): UseTeamMembersResult {
  const [teamMembers, setTeamMembers] = React.useState<TeamMember[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchTeamMembers = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("https://user-api.builder-io.workers.dev/api/users?perPage=50");
      
      if (!response.ok) {
        throw new Error(`Failed to fetch team members: ${response.status}`);
      }

      const data = await response.json();
      
      const formattedMembers: TeamMember[] = data.data.map((user: ApiUser) => ({
        id: user.login.uuid,
        name: `${user.name.first} ${user.name.last}`,
        email: user.email,
        avatar: user.picture?.thumbnail || `${user.name.first.charAt(0)}${user.name.last.charAt(0)}`,
      }));

      setTeamMembers(formattedMembers);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch team members";
      setError(errorMessage);
      console.error("Error fetching team members:", err);
      
      // Fallback to sample data if API fails
      setTeamMembers([
        {
          id: "user1",
          name: "John Smith",
          email: "john.smith@company.com",
          avatar: "JS"
        },
        {
          id: "user2",
          name: "Sarah Johnson",
          email: "sarah.johnson@company.com",
          avatar: "SJ"
        },
        {
          id: "user3",
          name: "Mike Davis",
          email: "mike.davis@company.com",
          avatar: "MD"
        },
        {
          id: "user4",
          name: "Emily Chen",
          email: "emily.chen@company.com",
          avatar: "EC"
        },
        {
          id: "user5",
          name: "Alex Rodriguez",
          email: "alex.rodriguez@company.com",
          avatar: "AR"
        }
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchTeamMembers();
  }, [fetchTeamMembers]);

  return {
    teamMembers,
    loading,
    error,
    refetch: fetchTeamMembers,
  };
}
