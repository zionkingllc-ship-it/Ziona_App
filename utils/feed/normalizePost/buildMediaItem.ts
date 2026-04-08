import { fixMediaUrl } from "./fixMediaUrl";

export function buildMediaItem(
  m: any
):
  | {
      type: "image" | "video";
      url: string;
      thumbnailUrl?: string;
    }
  | null {
  console.log("[MEDIA][BUILD] 🧩 Incoming raw media", m);

  const url = fixMediaUrl(m?.url);

  if (!url) {
    console.warn("[MEDIA][BUILD] ⚠️ Invalid URL after fixMediaUrl", {
      original: m?.url,
    });
    return null;
  }

  const rawThumb = fixMediaUrl(m?.thumbnailUrl);

  const isValidThumb =
    rawThumb &&
    !rawThumb.endsWith(".mp4") &&
    !rawThumb.includes(".mp4?");

  const isVideo =
    url.includes(".mp4") ||
    url.includes(".mov") ||
    url.includes(".m3u8");

  const type: "image" | "video" = isVideo ? "video" : "image";

  const result: {
    type: "image" | "video";
    url: string;
    thumbnailUrl?: string;
  } = {
    type,
    url,
    thumbnailUrl: isValidThumb ? rawThumb : undefined,
  };

  console.log("[MEDIA][BUILD] ✅ Built media item", result);

  return result;
}