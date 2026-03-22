import { Post, ImagePost, VideoPost, TextPost } from "@/types/post";
import { fetchForYouFeed as getForYouFeed } from "@/services/feedServices";

/* =========================
   HELPERS
========================= */

function mapBase(post: any) {
  return {
    id: post.id,
    createdAt: post.createdAt,

    categories: post.categories ?? [],

    liked: false,
    likesCount: 0,
    bookmarked: false,
    bookmarks: 0,

    author: {
      id: post.author?.id,
      name: post.author?.username ?? "Unknown",
      avatarUrl: post.author?.avatarUrl,
    },

    caption: post.caption ?? "",
  };
}

/* =========================
   IMAGE
========================= */

function mapImage(post: any): ImagePost {
  return {
    ...mapBase(post),
    type: "image",

    media: {
      items:
        post.image?.items?.map((m: any) => ({
          id: m.id,
          type: "image",
          url: m.url,
          thumbnailUrl: m.thumbnailUrl,
        })) ?? [],
    },
  };
}

/* =========================
   VIDEO
========================= */

function mapVideo(post: any): VideoPost {
  return {
    ...mapBase(post),
    type: "video",

    media: {
      videoUrl: post.video?.url ?? "",
      thumbnailUrl: post.video?.thumbnailUrl,
    },
  };
}

/* =========================
   TEXT (MESSAGE + SCRIPTURE)
========================= */

function mapText(post: any): TextPost {
  const message = post.text?.message ?? "";
  const scripture = post.text?.scripture;

  const derivedCaption =
    post.caption ||
    message ||
    scripture?.text ||
    "";

  return {
    ...mapBase(post),
    type: "text",

    caption: derivedCaption,

    text: {
      message: message || undefined,

      scripture: scripture
        ? {
            book: scripture.book,
            chapter: scripture.chapter,
            verseStart: scripture.verseStart,
            verseEnd: scripture.verseEnd,
            translation: scripture.translation,
            text: scripture.text,
          }
        : undefined,
    },

    media: {},
  };
}

/* =========================
   MAIN MAPPER
========================= */

export function mapFeedPost(post: any): Post {
  switch (post.type) {
    case "IMAGE":
      return mapImage(post);

    case "VIDEO":
      return mapVideo(post);

    case "TEXT":
      return mapText(post);

    default:
      throw new Error("Unknown post type");
  }
}

/* =========================
   PUBLIC API
========================= */

export async function fetchForYouFeed(): Promise<Post[]> {
  const result = await getForYouFeed({ pageParam: 0 });
  return result.posts.map(mapFeedPost);
}