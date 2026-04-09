import { buildMediaItem } from "./buildMediaItem";
import { fixMediaUrl } from "./fixMediaUrl";

type MediaItem = {
  type: "image" | "video";
  url: string;
  thumbnailUrl?: string;
};

export function normalizeMedia(p: any, base: any) {
  const caption = p.caption ?? "";

  /* =========================
     GENERIC MEDIA ARRAY
  ========================== */
  if (Array.isArray(p.media) && p.media.length > 0) {
    const built = p.media
      .map(buildMediaItem)
      .filter((m): m is MediaItem => !!m && !!m.url);

    if (!built.length) return null;

    const video = built.find((m) => m.type === "video");

    if (video) {
      // 🔥 STRICT VIDEO RETURN
      return {
        ...base,
        type: "media",
        mediaType: "video",
        caption,
        media: [video], // guaranteed single valid video
      };
    }

    const images = built.filter((m) => m.type === "image");

    if (!images.length) return null;

    return {
      ...base,
      type: "media",
      mediaType: "image",
      caption,
      media: images,
    };
  }

  /* =========================
     IMAGE ITEMS
  ========================== */
  if (p.image?.items?.length) {
    const media = p.image.items
      .map((i: any) => buildMediaItem({ ...i, type: "image" }))
      .filter((m): m is MediaItem => !!m && !!m.url);

    if (!media.length) return null;

    return {
      ...base,
      type: "media",
      mediaType: "image",
      caption,
      media,
    };
  }

  /* =========================
     VIDEO
  ========================== */
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
      caption,
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