import { useEffect, useState } from "react";
import { useInfiniteQuery, InfiniteData } from "@tanstack/react-query";

import {
  fetchDiscoverCategories,
  fetchDiscoverFeed,
} from "@/services/graphQL/discover/discover";

import { normalizePost } from "@/utils/feed/normalizePost";
import { FeedPost } from "@/types/feedTypes";

/* =========================
   TYPES
========================= */

type DiscoverResponse = { 
  posts: any[];
  nextCursor?: string;
  hasMore: boolean;
};

/* =========================
   CATEGORIES
========================= */

export function useDiscoverCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDiscoverCategories()
      .then((data) => setCategories(data ?? []))
      .finally(() => setLoading(false));
  }, []);

  return { categories, loading };
}

/* =========================
   FEED
========================= */

export function useDiscoverFeed(categoryId?: string) {
  const query = useInfiniteQuery<
    DiscoverResponse,
    Error,
    InfiniteData<DiscoverResponse>,
    [string, string | undefined],
    string | undefined
  >({
    queryKey: ["discover", categoryId],

    queryFn: async ({ pageParam }) => {
      const res = await fetchDiscoverFeed({
        cursor: pageParam,
      });

      return {
        posts: res?.posts ?? [],
        nextCursor: res?.nextCursor,
        hasMore: res?.hasMore ?? false,
      };
    },

    initialPageParam: undefined,

    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextCursor : undefined,
  });

  /* =========================
     NORMALIZE + FILTER
  ========================== */

  const posts: FeedPost[] =
    query.data?.pages
      ?.flatMap((page) => page.posts)
      .map((p) => normalizePost(p))
      .filter((p): p is FeedPost => {
        if (!p) return false;

        // CATEGORY FILTER
        if (categoryId && categoryId !== "all") {
          if (p.category?.id !== categoryId) return false;
        }

        // MEDIA SAFETY
        if (p.type === "media") {
          return Array.isArray(p.media) && p.media.length > 0;
        }

        return true;
      }) ?? [];

  return {
    ...query,
    posts,
  };
}