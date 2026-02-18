import { MOCK_POSTS } from "@/constants/examplePost";
import { Post } from "@/types/post";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const PAGE_SIZE = 5;

export async function fetchForYouFeed({
  pageParam = 0,
}: {
  pageParam?: number;
}): Promise<{ posts: Post[]; nextPage?: number }> {
  await delay(800);

  const start = pageParam * PAGE_SIZE;
  const end = start + PAGE_SIZE;

  const posts = MOCK_POSTS.slice(start, end);

  return {
    posts,
    nextPage: end < MOCK_POSTS.length ? pageParam + 1 : undefined,
  };
}

export async function fetchFollowingFeed({
  pageParam = 0,
}: {
  pageParam?: number;
}): Promise<{
  posts: Post[];
  followsCount: number;
  nextPage?: number;
}> {
  await delay(800);

  const followsCount = 0; // simulate

  if (followsCount === 0) {
    return { posts: [], followsCount };
  }

  const start = pageParam * PAGE_SIZE;
  const end = start + PAGE_SIZE;

  const posts = MOCK_POSTS.slice(start, end);

  return {
    posts,
    followsCount,
    nextPage: end < MOCK_POSTS.length ? pageParam + 1 : undefined,
  };
}
