import { buildMediaItem } from "./buildMediaItem";
import { fixMediaUrl } from "./fixMediaUrl";

export function normalizeMedia(p: any, base: any) {
  console.log("[NORMALIZE][MEDIA] 🧩 Incoming post", {
    id: p?.id,
    hasMedia: !!p?.media?.length,
    hasImages: !!p?.image?.items?.length,
    hasVideo: !!p?.video?.url,
  });

  const caption = p.caption ?? "";

  /* =========================
     CASE 1: GENERIC MEDIA ARRAY
  ========================== */
  if (Array.isArray(p.media) && p.media.length > 0) {
    console.log("[NORMALIZE][MEDIA] 📦 Processing p.media array");

    const media = p.media.map(buildMediaItem).filter(Boolean);

    console.log("[NORMALIZE][MEDIA] 📊 Built media count", media.length);

    if (!media.length) {
      console.warn("[NORMALIZE][MEDIA] ⚠️ No valid media after build");
      return null;
    }

    const hasVideo = media.some((m: any) => m.type === "video");

    const result = {
      ...base,
      type: "media",
      mediaType: hasVideo ? "video" : "image",
      caption,
      media,
    };

    console.log("[NORMALIZE][MEDIA] ✅ Result (p.media)", result);

    return result;
  }

  /* =========================
     CASE 2: IMAGE ITEMS
  ========================== */
  if (p.image?.items?.length) {
    console.log("[NORMALIZE][MEDIA] 🖼️ Processing image items");

    const media = p.image.items
      .map((i: any) => buildMediaItem({ ...i, type: "image" }))
      .filter(Boolean);

    console.log("[NORMALIZE][MEDIA] 📊 Built image media count", media.length);

    if (!media.length) {
      console.warn("[NORMALIZE][MEDIA] ⚠️ No valid image media");
      return null;
    }

    const result = {
      ...base,
      type: "media",
      mediaType: "image",
      caption,
      media,
    };

    console.log("[NORMALIZE][MEDIA] ✅ Result (image.items)", result);

    return result;
  }

  /* =========================
     CASE 3: VIDEO
  ========================== */
  if (p.video?.url) {
    console.log("[NORMALIZE][MEDIA] 🎥 Processing video");

    const url = fixMediaUrl(p.video.url);
    const rawThumbnail = fixMediaUrl(p.video.thumbnailUrl);

    if (!url) {
      console.warn("[NORMALIZE][MEDIA] ⚠️ Invalid video URL");
      return null;
    }

    const isValidThumbnail =
      rawThumbnail &&
      !rawThumbnail.endsWith(".mp4") &&
      !rawThumbnail.includes(".mp4?");

    const result = {
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

    console.log("[NORMALIZE][MEDIA] ✅ Result (video)", result);

    return result;
  }

  /* =========================
     FALLBACK
  ========================== */
  console.warn("[NORMALIZE][MEDIA] ⚠️ No media found, returning empty");

  const fallback = {
    ...base,
    type: "media",
    caption,
    mediaType: "image",
    media: [],
  };

  console.log("[NORMALIZE][MEDIA] ✅ Result (fallback)", fallback);

  return fallback;
}