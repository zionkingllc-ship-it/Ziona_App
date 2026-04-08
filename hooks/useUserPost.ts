import { graphqlRequest } from "@/services/graphQL/graphqlClient";
import { useAuthStore } from "@/store/useAuthStore";
import { FeedPost } from "@/types/feedTypes";
import { normalizePost } from "@/utils/feed/normalizePost";
import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";

/* =========================
   TYPES
========================= */

type UserPostsResponse = {
  posts: any[];
  nextCursor?: string;
  hasMore: boolean;
};

/* =========================
   QUERY
========================= */

export const GET_USER_POSTS = `
query GetUserPosts($userId: String!, $cursor: String, $limit: Int = 20) {
  userPosts(userId: $userId, cursor: $cursor, limit: $limit) {
    hasMore
    nextCursor
    posts {
      id
      type
      caption
      createdAt
      author { id username avatarUrl }
      category { id label slug bgColor bdColor textPostBg }
      image { items { id url thumbnailUrl width height } }
      video { url thumbnailUrl duration width height }
      scripture { 
        reference text translation book chapter verseStart verseEnd 
      }
    }
  }
}
`;

/* =========================
   HOOK
========================= */

export function useUserPosts(overrideUserId?: string) {
  const authUser = useAuthStore((state) => state.user);
  const isBootstrapping = useAuthStore((s) => s.isBootstrapping);

  const userId = overrideUserId ?? authUser?.id;

  const query = useInfiniteQuery<
    UserPostsResponse,
    Error,
    InfiniteData<UserPostsResponse>,
    [string, string | undefined],
    string | undefined
  >({
    queryKey: ["userPosts", userId],
    enabled: !!userId && !isBootstrapping,

    queryFn: async ({ pageParam }) => {
      if (!userId) {
        return {
          posts: [],
          nextCursor: undefined,
          hasMore: false,
        };
      }

      const data = await graphqlRequest(GET_USER_POSTS, {
        userId,
        cursor: pageParam,
        limit: 20,
      });

      const res = data?.userPosts;

      return {
        posts: res?.posts ?? [],
        nextCursor: res?.nextCursor,
        hasMore: res?.hasMore ?? false,
      };
    },

    initialPageParam: undefined,

    getNextPageParam: (lastPage) =>
      lastPage?.hasMore ? lastPage.nextCursor : undefined,
  });

  /* =========================
     NORMALIZE (MEMOIZED)
  ========================== */

  const posts: FeedPost[] = useMemo(() => {
    if (!query.data?.pages) return [];

    return query.data.pages
      .flatMap((page) => page.posts ?? [])
      .map((p) => normalizePost(p))
      .filter((p): p is FeedPost => {
        if (!p) return false;

        if (p.type === "media") {
          return Array.isArray(p.media) && p.media.length > 0;
        }

        return true;
      });
  }, [query.data?.pages]);

  return {
    ...query,
    posts,
    userId,
  };
}