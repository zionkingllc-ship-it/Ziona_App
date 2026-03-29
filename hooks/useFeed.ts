import { useInfiniteQuery } from "@tanstack/react-query";
import {
  fetchForYouFeed,
  fetchFollowingFeed,
} from "@/services/feed/feedServices";

/* =========================
   RAW BACKEND SHAPE
========================= */

type FeedResponse = {
  posts: any[]; //raw backend data (NOT FeedPost)
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
    [string, string],
    string | undefined
  >({
    queryKey: ["feed", "forYou"],
    queryFn: ({ pageParam }) =>
      fetchForYouFeed({ pageParam }),

    initialPageParam: undefined,

    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextCursor : undefined,
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
    [string, string],
    string | undefined
  >({
    queryKey: ["feed", "following"],
    queryFn: ({ pageParam }) =>
      fetchFollowingFeed({ pageParam }),

    initialPageParam: undefined,

    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextCursor : undefined,
  });
}