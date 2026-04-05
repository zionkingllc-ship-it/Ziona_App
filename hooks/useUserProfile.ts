import { useQuery } from "@tanstack/react-query";
import { graphqlRequest } from "@/services/graphQL/graphqlClient";
import { useAuthStore } from "@/store/useAuthStore";
import { UserProfile } from "@/types/userProfile";

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

function normalizeUserProfile(raw: any): UserProfile | null {
  if (!raw) return null;

  return {
    ...raw,
    stats: raw.stats
      ? {
          followersCount: Number(raw.stats.followersCount || 0),
          followingCount: Number(raw.stats.followingCount || 0),
          postsCount: Number(raw.stats.postsCount || 0),
        }
      : undefined,
  };
}

export function useUserProfile(
  userId?: string,
  options?: { enabled?: boolean }
) {
  const token = useAuthStore((s) => s.tokens?.accessToken);

  return useQuery<UserProfile | null>({
    queryKey: ["userProfile", userId],
    enabled: !!userId && !!token && options?.enabled !== false,

    refetchOnMount: true,
    refetchOnReconnect: true,

    queryFn: async () => {
      const data = await graphqlRequest(GET_USER_PROFILE, { userId });
      return normalizeUserProfile(data?.userProfile);
    },
  });
}