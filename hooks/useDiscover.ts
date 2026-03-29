import { fetchDiscoverCategories, fetchDiscoverFeed } from "@/services/graphQL/discover/discover";
import { useEffect, useState } from "react";
import { FeedPost } from "@/types/feedTypes";
import { normalizePost } from "@/utils/feed/normalizePost";

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
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDiscoverFeed()
      .then((data) => {
        const rawPosts = data ?? [];

        const normalized = rawPosts
          .map((p: any) => normalizePost(p))
          .filter((p): p is FeedPost => {
            if (p.type === "media") {
              return p.media && p.media.length > 0;
            }
            return true;
          });

        if (!categoryId || categoryId === "all") {
          setPosts(normalized);
        } else {
          setPosts(
            normalized.filter(
              (p) => p.category?.id === categoryId
            )
          );
        }
      })
      .finally(() => setLoading(false));
  }, [categoryId]);

  return { posts, loading };
}