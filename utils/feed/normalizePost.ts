import { FeedPost } from "@/types/feedTypes";

/* =========================
   FIX BAD URLS
========================= */

function fixMediaUrl(url?: string): string | undefined {
  if (!url) return undefined;

  const base = "https://storage.googleapis.com/";
  const parts = url.split(base);

  if (parts.length > 2) {
    return base + parts.pop();
  }

  return url;
}

/* =========================
   SAFE MEDIA BUILDER
========================= */

function buildMediaItem(m: any): {
  type: "image" | "video";
  url: string;
  thumbnailUrl?: string;
} | null {
  const url = fixMediaUrl(m?.url);
  if (!url) return null;

  const rawThumb = fixMediaUrl(m?.thumbnailUrl);

  const isValidThumb =
    rawThumb &&
    !rawThumb.endsWith(".mp4") &&
    !rawThumb.includes(".mp4?");

  let type: "image" | "video" = "image";

  if (typeof m?.type === "string" && m.type.toLowerCase() === "video") {
    type = "video";
  }

  return {
    type,
    url,
    thumbnailUrl: isValidThumb ? rawThumb : undefined,
  };
}

/* =========================
   NORMALIZER
========================= */

export function normalizePost(p: any): FeedPost | null {
  if (!p?.id || !p?.type) return null;

 const base = {
  id: p.id,
  createdAt: p.createdAt,

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
        bgColor: p.category.bgColor ?? "#e9d0d0",
        bdColor: p.category.bdColor ?? "#f59797",
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
    if (Array.isArray(p.media) && p.media.length > 0) {
      const media = p.media
        .map(buildMediaItem)
        .filter(Boolean) as {
        type: "image" | "video";
        url: string;
        thumbnailUrl?: string;
      }[];

      if (!media.length) return null;

      const hasVideo = media.some((m) => m.type === "video");

      return {
        ...base,
        type: "media",
        mediaType: hasVideo ? "video" : "image",
        media,
      };
    }

    /* IMAGE (p.image.items) */
    if (p.image?.items?.length) {
      const media = p.image.items
        .map((i: any) => buildMediaItem({ ...i, type: "image" }))
        .filter(Boolean) as {
        type: "image";
        url: string;
        thumbnailUrl?: string;
      }[];

      if (!media.length) return null;

      return {
        ...base,
        type: "media",
        mediaType: "image",
        media,
      };
    }

    /* VIDEO (p.video) */
    if (p.video?.url) {
      const url = fixMediaUrl(p.video.url);
      const rawThumbnail = fixMediaUrl(p.video.thumbnailUrl);

      if (!url) return null;

      const isValidThumbnail =
        rawThumbnail &&
        !rawThumbnail.endsWith(".mp4") &&
        !rawThumbnail.includes(".mp4?");

      return {
        ...base,
        type: "media",
        mediaType: "video",
        media: [
          {
            type: "video" as const,
            url,
            thumbnailUrl: isValidThumbnail ? rawThumbnail : undefined,
          },
        ],
      };
    }

    return null;
  }

  /* ================= TEXT ================= */

  if (p.type === "TEXT") {
    const message =
      typeof p.text === "string" && p.text.trim()
        ? p.text
        : "";

    if (!message && !p.scripture) return null;

    return {
      ...base,
      type: "text",
      message,
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
    };
  }

  /* ================= BIBLE ================= */

  if (p.type === "BIBLE") {
    if (!p.scripture) return null;

    return {
      ...base,
      type: "bible",
      scripture: {
        book: p.scripture.book,
        chapter: p.scripture.chapter,
        verseStart: p.scripture.verseStart,
        verseEnd: p.scripture.verseEnd,
        translation: p.scripture.translation,
        text: p.scripture.text,
      },
    };
  }

  return null;
}