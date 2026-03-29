import { FeedPost } from "@/types/feedTypes";

/* =========================
   FIX BAD URLS
========================= */

function fixMediaUrl(url?: string) {
  if (!url) return url;

  const doublePrefix =
    "https://storage.googleapis.com/ziona-media-dev/https://storage.googleapis.com/";

  if (url.includes(doublePrefix)) {
    return url.replace(
      "https://storage.googleapis.com/ziona-media-dev/",
      ""
    );
  }

  return url;
}

export function normalizePost(p: any): FeedPost | null {
  if (!p?.id || !p?.type) return null;

  const base = {
    id: p.id,
    createdAt: p.createdAt,
    caption: p.caption ?? undefined,

    author: p.author
      ? {
          id: p.author.id,
          username: p.author.username,
          avatarUrl: p.author.avatarUrl ?? undefined,
        }
      : undefined,

    category: p.category
      ? {
          id: p.category.id,
          label: p.category.label,
          slug: p.category.slug,
          bgColor: p.category.bgColor,
          bdColor: p.category.bdColor,
        }
      : undefined,

    stats: p.stats
      ? {
          likesCount: p.stats.likesCount ?? 0,
          commentsCount: p.stats.commentsCount ?? 0,
          sharesCount: p.stats.sharesCount ?? 0,
          savesCount: p.stats.savesCount ?? 0,
        }
      : undefined,

    viewerState: p.viewerState
      ? {
          liked: p.viewerState.liked ?? false,
          saved: p.viewerState.saved ?? false,
          followingAuthor: p.viewerState.followingAuthor ?? false,
          isOwner: p.viewerState.isOwner ?? false,
        }
      : undefined,
  };

  /* ================= MEDIA ================= */
  if (p.type === "MEDIA") {
    // IMAGE
    if (p.image?.items?.length) {
      const media = p.image.items
        .map((i: any) => {
          const url = fixMediaUrl(i.url);

          if (!url) return null;

          return {
            type: "image" as const,
            url,
          };
        })
        .filter(Boolean) as { type: "image"; url: string }[];

      if (media.length === 0) return null;

      return {
        ...base,
        type: "media",
        mediaType: "image",
        media,
      };
    }

    // VIDEO
    if (p.video?.url) {
      const url = fixMediaUrl(p.video.url);

      if (!url) return null;

      return {
        ...base,
        type: "media",
        mediaType: "video",
        media: [
          {
            type: "video" as const,
            url,
          },
        ],
      };
    }

    return null;
  }

  /* ================= TEXT ================= */
  if (p.type === "TEXT") {
    const message = p.text ?? p.caption;

    if (!message) return null;

    return {
      ...base,
      type: "text",
      message,
    };
  }

  /* ================= BIBLE ================= */
  if (p.type === "BIBLE") {
    return {
      ...base,
      type: "bible",
    };
  }

  return null;
}