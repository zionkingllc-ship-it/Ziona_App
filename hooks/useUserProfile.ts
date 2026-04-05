import { useQuery } from "@tanstack/react-query";
import { graphqlRequest } from "@/services/graphQL/graphqlClient";

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
  return useQuery({
    queryKey: ["userProfile", userId],
    enabled: !!userId && options?.enabled !== false,
    queryFn: async () => {
      const data = await graphqlRequest(GET_USER_PROFILE, { userId });
      return data?.userProfile;
    },
  });
}