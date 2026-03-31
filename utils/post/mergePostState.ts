import { FeedPost } from "@/types/feedTypes";

export function mergePostState(
  post: FeedPost,
  likedOverride?: boolean,
  savedOverride?: boolean
): FeedPost {
  const baseLiked = post.viewerState?.liked ?? false;
  const baseSaved = post.viewerState?.saved ?? false;

  const liked = likedOverride ?? baseLiked;
  const saved = savedOverride ?? baseSaved;

  let likesCount = post.stats?.likesCount ?? 0;

  if (likedOverride !== undefined) {
    if (likedOverride && !baseLiked) likesCount += 1;
    if (!likedOverride && baseLiked) likesCount -= 1;
  }

  return {
    ...post,
    viewerState: {
      ...post.viewerState,
      liked,
      saved,
    },
    stats: {
      ...post.stats,
      likesCount,
    },
  };
}