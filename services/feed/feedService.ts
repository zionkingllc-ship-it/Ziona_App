import { Post } from "@/types/post";
import { MOCK_POSTS } from "@/constants/examplePost";
// import { graphqlRequest } from "@/services/graphQL/graphqlClient";

const USE_BACKEND = false;

const GET_FOR_YOU_FEED = `
query GetForYouFeed($page: Int) {
  forYouFeed(page: $page) {
    posts {
      id
      createdAt
      postType
      caption
      categories

      author {
        id
        username
        avatarUrl
      }

      media {
        items {
          id
          url
          thumbnailUrl
          type
        }
        videoUrl
        thumbnailUrl
      }

      scripture {
        book
        chapter
        verseStart
        verseEnd
        translation
        text
      }

      message

      report {
        reported
        reason
      }
    }
  }
}
`;

function mapBackendPost(p: any): Post {
  const base = {
    id: p.id,
    createdAt: p.createdAt,

    categories: p.categories ?? [],

    liked: false,
    likesCount: 0,
    bookmarked: false,
    bookmarks: 0,

    author: {
      id: p.author?.id,
      name: p.author?.username ?? "Unknown",
      avatarUrl: p.author?.avatarUrl,
    },

    caption: p.caption ?? "",

    // ✅ FIX
    report: p.report ?? {
      reported: false,
    },
  };

  if (p.postType === "IMAGE") {
    return {
      ...base,
      type: "image",
      media: {
        items: (p.media?.items ?? []).map((m: any) => ({
          id: m.id,
          type: m.type === "VIDEO" ? "video" : "image",
          url: m.url,
          thumbnailUrl: m.thumbnailUrl,
        })),
      },
    };
  }

  if (p.postType === "VIDEO") {
    return {
      ...base,
      type: "video",
      media: {
        videoUrl: p.media?.videoUrl,
        thumbnailUrl: p.media?.thumbnailUrl,
      },
    };
  }

  return {
    ...base,
    type: "text",
    text: {
      message: p.message ?? "",
      scripture: p.scripture
        ? {
            book: p.scripture.book,
            chapter: p.scripture.chapter,
            verseStart: p.scripture.verseStart,
            verseEnd: p.scripture.verseEnd,
            translation: p.scripture.translation,
            text: p.scripture.text,
          }
        : undefined,
    },
    caption: p.caption || p.message || p.scripture?.text || "",
  };
}

function normalizePost(post: any): Post {
  if (post.type === "text") {
    return {
      ...post,
      text: {
        message:
          typeof post.text === "string"
            ? post.text
            : post.text?.message ?? "",
        scripture: post.text?.scripture ?? undefined,
      },
      caption:
        post.caption ||
        (typeof post.text === "string"
          ? post.text
          : post.text?.message) ||
        post.text?.scripture?.text ||
        "",
    };
  }

  return post;
}

const PAGE_SIZE = 5;

async function fallbackFeed({
  pageParam = 0,
}: {
  pageParam?: number;
}): Promise<{ posts: Post[]; nextPage?: number }> {
  await new Promise((r) => setTimeout(r, 500));

  const start = pageParam * PAGE_SIZE;
  const end = start + PAGE_SIZE;

  const posts = MOCK_POSTS.slice(start, end).map(normalizePost);

  return {
    posts,
    nextPage: end < MOCK_POSTS.length ? pageParam + 1 : undefined,
  };
}

export async function fetchForYouFeed({
  pageParam = 0,
}: {
  pageParam?: number;
}) {
  if (!USE_BACKEND) {
    return fallbackFeed({ pageParam });
  }

  // const data = await graphqlRequest(GET_FOR_YOU_FEED, {
  //   page: pageParam,
  // });

  // const posts = data.forYouFeed.posts.map(mapBackendPost);

  // return {
  //   posts,
  //   nextPage: posts.length > 0 ? pageParam + 1 : undefined,
  // };

  throw new Error("Backend not enabled");
}

export async function fetchFollowingFeed({
  pageParam = 0,
}: {
  pageParam?: number;
}) {
  if (!USE_BACKEND) {
    return {
      posts: [],
      nextPage: undefined,
    };
  }

  throw new Error("Backend not enabled");
}