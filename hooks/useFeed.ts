import { useInfiniteQuery } from "@tanstack/react-query";
import {
  fetchForYouFeed,
  fetchFollowingFeed,
} from "@/services/feed/feedServices";

/* =========================
   TYPES
========================= */

type FeedResponse = {
  posts: any[];
  nextCursor?: string;
  hasMore: boolean;
};

/* =========================
   FOR YOU
========================= */

export function useForYouFeed() {
  return useInfiniteQuery<
    FeedResponse,
    Error,
    FeedResponse,
    [string],
    string | undefined
  >({
    queryKey: ["forYouFeed"],

    queryFn: async ({ pageParam }) => {
      console.log("[QUERY][FOR_YOU] 🚀 Fetch start", {
        pageParam,
      });

      try {
        const res = await fetchForYouFeed({ pageParam });

        console.log("[QUERY][FOR_YOU] ✅ Fetch success", {
          posts: res.posts?.length,
          nextCursor: res.nextCursor,
          hasMore: res.hasMore,
        });

        return res;
      } catch (error) {
        console.error("[QUERY][FOR_YOU] ❌ Fetch error", error);
        throw error;
      }
    },

    initialPageParam: undefined,

    getNextPageParam: (lastPage) => {
      const next = lastPage.hasMore ? lastPage.nextCursor : undefined;

      console.log("[QUERY][FOR_YOU] 🔄 Pagination decision", {
        hasMore: lastPage.hasMore,
        nextCursor: lastPage.nextCursor,
        resolvedNext: next,
      });

      return next;
    },
  });
}

/* =========================
   FOLLOWING
========================= */

export function useFollowingFeed() {
  return useInfiniteQuery<
    FeedResponse,
    Error,
    FeedResponse,
    [string],
    string | undefined
  >({
    queryKey: ["followingFeed"],

    queryFn: async ({ pageParam }) => {
      console.log("[QUERY][FOLLOWING] 🚀 Fetch start", {
        pageParam,
      });

      try {
        const res = await fetchFollowingFeed({ pageParam });

        console.log("[QUERY][FOLLOWING] ✅ Fetch success", {
          posts: res.posts?.length,
          nextCursor: res.nextCursor,
          hasMore: res.hasMore,
        });

        return res;
      } catch (error) {
        console.error("[QUERY][FOLLOWING] ❌ Fetch error", error);
        throw error;
      }
    },

    initialPageParam: undefined,

    getNextPageParam: (lastPage) => {
      const next = lastPage.hasMore ? lastPage.nextCursor : undefined;

      console.log("[QUERY][FOLLOWING] 🔄 Pagination decision", {
        hasMore: lastPage.hasMore,
        nextCursor: lastPage.nextCursor,
        resolvedNext: next,
      });

      return next;
    },
  });
}