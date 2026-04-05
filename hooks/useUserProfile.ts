import { useQuery } from "@tanstack/react-query";
import { graphqlRequest } from "@/services/graphQL/graphqlClient";
import { useAuthStore } from "@/store/useAuthStore";

type UserProfile = {
  id: string;
  username: string;
  fullName?: string;
  bio?: string;
  avatarUrl?: string;
  location?: string;
  stats?: {
    followersCount: number;
    followingCount: number;
    postsCount: number;
  };
  viewerState?: {
    followingAuthor: boolean;
    isOwner: boolean;
  };
};

const GET_USER_PROFILE = `
query GetUserProfile($userId: String!) {
  userProfile(userId: $userId) {
    id
    username
    fullName
    bio
    avatarUrl
    location
    stats { followersCount followingCount postsCount }
    viewerState { followingAuthor isOwner }
  }
}
`;

export function useUserProfile(
  userId?: string,
  options?: { enabled?: boolean }
) {
  const token = useAuthStore((s) => s.tokens?.accessToken);

  return useQuery<UserProfile | null>({
    queryKey: ["userProfile", userId, token],
    enabled: !!userId && !!token && options?.enabled !== false,
    refetchOnMount: true,
    refetchOnReconnect: true,
    queryFn: async () => {
      const data = await graphqlRequest(GET_USER_PROFILE, { userId });
      return data?.userProfile ?? null;
    },
  });
}