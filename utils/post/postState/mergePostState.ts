import { FeedPost } from "@/types/feedTypes";

type MergeOverrides = {
  likedPosts?: Record<string, boolean>;
  savedPosts?: Record<string, boolean>;
  followedUsers?: Record<string, boolean>;
};

export function mergePostState(
  post: FeedPost,
  overrides?: MergeOverrides
): FeedPost {
  const likedMap = overrides?.likedPosts ?? {};
  const savedMap = overrides?.savedPosts ?? {};
  const followMap = overrides?.followedUsers ?? {};

  const baseLiked = post.viewerState.liked;
  const baseSaved = post.viewerState.saved;
  const baseFollowing = post.viewerState.followingAuthor;
  const baseOwner = post.viewerState.isOwner;

  //  check existence properly
  const hasLikedOverride = post.id in likedMap;
  const hasSavedOverride = post.id in savedMap;

  const liked = hasLikedOverride
    ? likedMap[post.id]
    : baseLiked;

  const saved = hasSavedOverride
    ? savedMap[post.id]
    : baseSaved;

  const isFollowing =
    post.author?.id && post.author.id in followMap
      ? followMap[post.author.id]
      : baseFollowing;

  const baseLikesCount = post.stats.likesCount;
  const baseComments = post.stats.commentsCount;
  const baseShares = post.stats.sharesCount;
  const baseSaves = post.stats.savesCount;

  let likesCount = baseLikesCount;

  if (hasLikedOverride) {
    if (liked && !baseLiked) likesCount += 1;
    if (!liked && baseLiked) likesCount -= 1;
  }

  return {
    ...post,

    viewerState: {
      liked,
      saved,
      followingAuthor: isFollowing,
      isOwner: baseOwner,
    },

    stats: {
      likesCount,
      commentsCount: baseComments,
      sharesCount: baseShares,
      savesCount: baseSaves,
    },
  };
}