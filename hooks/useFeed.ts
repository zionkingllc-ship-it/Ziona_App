import { useInfiniteQuery } from "@tanstack/react-query";
import {
  fetchForYouFeed,
  fetchFollowingFeed,
} from "@/services/feed/feedServices";
import { FeedPost } from "@/types/feedTypes";

type FeedResponse = {
  posts: FeedPost[];
  nextCursor?: string;
  hasMore: boolean;
};

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