import { graphqlRequest } from "@/services/graphQL/graphqlClient";
import { FeedPost } from "@/types/feedTypes";
import { normalizePost } from "@/utils/feed/normalizePost";

const GET_FOR_YOU_FEED = `
query GetForYouFeed($cursor: String, $limit: Int = 20) {
  forYouFeed(cursor: $cursor, limit: $limit) {
    hasMore
    nextCursor
    posts {
      id
      type
      caption
      createdAt

      category {
        id
        label
        slug
      }

      author {
        id
        username
        avatarUrl
      }

      image {
        items {
          id
          url
          thumbnailUrl
        }
      }

      video {
        url
        thumbnailUrl
      }

      text {
        message
        scripture {
          book
          chapter
          verseStart
          verseEnd
          translation
          text
        }
      }

      stats {
        likesCount
        commentsCount
        sharesCount
        savesCount
      }

      viewerState {
        liked
        saved
        followingAuthor
        isOwner
      }
    }
  }
}
`;

export async function fetchForYouFeed({
  pageParam,
}: {
  pageParam?: string;
}): Promise<{
  posts: FeedPost[];
  nextCursor?: string;
  hasMore: boolean;
}> {
  const data = await graphqlRequest(GET_FOR_YOU_FEED, {
    cursor: pageParam,
    limit: 20,
  });

  const feed = data.forYouFeed;

  console.log("RAW FEED RESPONSE:", JSON.stringify(data, null, 2));

  const rawPosts = feed.posts ?? [];

  console.log("RAW POSTS COUNT:", rawPosts.length);

  const posts: FeedPost[] = rawPosts
    .map((p:any) => {
      const normalized = normalizePost(p);

      if (!normalized) {
        console.log("DROPPED POST:", p);
      }

      return normalized;
    })
    .filter((p:any): p is FeedPost => p !== null);

  console.log("FINAL POSTS COUNT:", posts.length);

  return {
    posts,
    nextCursor: feed.nextCursor,
    hasMore: feed.hasMore,
  };
}

export async function fetchFollowingFeed({
  pageParam,
}: {
  pageParam?: string;
}): Promise<{
  posts: FeedPost[];
  nextCursor?: string;
  hasMore: boolean;
}> {
  return {
    posts: [],
    nextCursor: undefined,
    hasMore: false,
  };
}