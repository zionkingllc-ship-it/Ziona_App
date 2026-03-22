import { Image } from "react-native";
import { Post } from "@/types/post";

export function preloadPostMedia(post?: Post) {
  if (!post) return;

  if (post.type === "image") {
    const firstItem = post.media.items?.[0];

    if (typeof firstItem?.url === "string") {
      Image.prefetch(firstItem.url);
    }
  }

  if (post.type === "video") {
    if (typeof post.media.videoUrl === "string") {
      Image.prefetch(post.media.videoUrl);
    }
  }

  if (post.type === "text") {
    const bg = post.media?.backgroundImage;

    if (typeof bg === "string") {
      Image.prefetch(bg);
    }
  }
}