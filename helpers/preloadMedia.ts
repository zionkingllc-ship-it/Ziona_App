import { Image } from "react-native";
import { FeedPost } from "@/types/feedTypes";

export function preloadPostMedia(post?: FeedPost) {
  if (!post) return;

  /* ================= MEDIA ================= */
  if (post.type === "media") {
    const first = post.media?.[0];

    if (!first) return;

    if (typeof first.url === "string") {
      Image.prefetch(first.url);
    }

    if (typeof first.thumbnailUrl === "string") {
      Image.prefetch(first.thumbnailUrl);
    }
  }

  /* ================= TEXT / BIBLE ================= */
  if (post.type === "text" || post.type === "bible") {
    // nothing to preload for now (no background image in new structure)
    return;
  }
}