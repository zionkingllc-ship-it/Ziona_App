 import { FeedPost } from "@/types/feedTypes";

export function normalizePost(post: any): FeedPost | null {
  const base = {
    id: post.id,
    createdAt: post.createdAt,
    author: {
      id: post.author?.id,
      username: post.author?.username,
      avatarUrl: post.author?.avatarUrl,
    },
    category: post.category ?? undefined,
    stats: post.stats,
    viewerState: post.viewerState,
  };

  switch (post.type) {
    case "TEXT":
      return {
        type: "text",
        ...base,
        caption: post.text?.message ?? "",
      };

    case "MEDIA":
      if (post.image?.items?.length) {
        return {
          type: "media",
          ...base,
          caption: post.caption ?? "",
          mediaType: "image",
          media: post.image.items.map((img: any) => ({
            type: "image",
            url: img.url,
            thumbnailUrl: img.thumbnailUrl,
          })),
        };
      }

      if (post.video?.url) {
        return {
          type: "media",
          ...base,
          caption: post.caption ?? "",
          mediaType: "video",
          media: [
            {
              type: "video",
              url: post.video.url,
              thumbnailUrl: post.video.thumbnailUrl,
            },
          ],
        };
      }

      return null;

    case "BIBLE":
      const scripture = post.text?.scripture;
      if (!scripture) return null;

      return {
        type: "bible",
        ...base,
        caption: post.caption || scripture.text || "",
        scripture: {
          book: scripture.book,
          chapter: scripture.chapter,
          verseStart: scripture.verseStart,
          verseEnd: scripture.verseEnd,
          translation: scripture.translation,
        },
      };

    default:
      return null;
  }
}