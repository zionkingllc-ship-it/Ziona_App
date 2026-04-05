import { useAuthStore } from "@/store/useAuthStore";
import { FeedPost } from "@/types/feedTypes";
import { normalizePost } from "@/utils/feed/normalizePost";
import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";

/* =========================
   TYPES
========================= */

type UserPostsResponse = {
  posts: any[];
  nextCursor?: string;
  hasMore: boolean;
};

/* =========================
   TEMP FALLBACK (SAFE)
========================= */

async function fetchUserPostsFallback(
  userId: string,
  cursor?: string,
): Promise<UserPostsResponse> {
  try {
    // Replace with real backend later
    return {
      posts: [],
      nextCursor: undefined,
      hasMore: false,
    };
  } catch (error) {
    return {
      posts: [],
      nextCursor: undefined,
      hasMore: false,
    };
  }
}

/* =========================
   HOOK
========================= */

export function useUserPosts(overrideUserId?: string) {
  const authUser = useAuthStore((state) => state.user);

  const userId = overrideUserId ?? authUser?.id;

  const query = useInfiniteQuery<
    UserPostsResponse,
    Error,
    InfiniteData<UserPostsResponse>,
    [string, string | undefined],
    string | undefined
  >({
    queryKey: ["userPosts", userId],

    enabled: !!userId,

    queryFn: async ({ pageParam }) => {
      if (!userId) {
        return {
          posts: [],
          nextCursor: undefined,
          hasMore: false,
        };
      }

      const res = await fetchUserPostsFallback(userId, pageParam);

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
     NORMALIZE + SAFETY
  ========================== */

  const posts: FeedPost[] =
    query.data?.pages
      ?.flatMap((page) => page.posts ?? [])
      .map((p) => normalizePost(p))
      .filter((p): p is FeedPost => {
        if (!p) return false;

        if (p.type === "media") {
          return Array.isArray(p.media) && p.media.length > 0;
        }

        return true;
      }) ?? [];

  return {
    ...query,
    posts,
    userId,
  };
}
