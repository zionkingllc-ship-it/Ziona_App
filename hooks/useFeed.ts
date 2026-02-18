import { useInfiniteQuery } from "@tanstack/react-query";
import {
  fetchForYouFeed,
  fetchFollowingFeed,
} from "@/services/feedServices";

export function useForYouFeed() {
  return useInfiniteQuery({
    queryKey: ["feed", "forYou"],
    queryFn: ({ pageParam }) =>
      fetchForYouFeed({ pageParam }),
    initialPageParam: 0,
    getNextPageParam: lastPage => lastPage.nextPage,
  });
}

export function useFollowingFeed() {
  return useInfiniteQuery({
    queryKey: ["feed", "following"],
    queryFn: ({ pageParam }) =>
      fetchFollowingFeed({ pageParam }),
    initialPageParam: 0,
    getNextPageParam: lastPage => lastPage.nextPage,
  });
}

