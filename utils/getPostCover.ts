// utils/getPostCover.ts

import { Post } from "@/types/post";

export function getPostCover(post: Post): string | undefined {
  if (post.type === "image" || post.type === "video") {
    return post.media.url;
  }

  if (post.type === "carousel") {
    return post.media[0]?.url;
  }

  return undefined;
}