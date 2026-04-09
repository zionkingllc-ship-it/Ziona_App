import { fixMediaUrl } from "./fixMediaUrl";

type MediaItem = {
  type: "image" | "video";
  url: string;
  thumbnailUrl?: string;
};

function isVideoUrl(url: string): boolean {
  const clean = url.split("?")[0].toLowerCase();

  return (
    clean.endsWith(".mp4") ||
    clean.endsWith(".mov") ||
    clean.endsWith(".m3u8") ||
    clean.includes("/video") // fallback for signed URLs
  );
}

function isValidUrl(url: string): boolean {
  return typeof url === "string" && url.startsWith("http");
}

export function buildMediaItem(m: any): MediaItem | null {
  console.log("[MEDIA][BUILD] 🧩 Incoming raw media", m);

  const url = fixMediaUrl(m?.url);

  if (!url || !isValidUrl(url)) {
    console.warn("[MEDIA][BUILD] ❌ Invalid URL", {
      original: m?.url,
      fixed: url,
    });
    return null;
  }

  const rawThumb = fixMediaUrl(m?.thumbnailUrl);

  const isValidThumb =
    rawThumb &&
    isValidUrl(rawThumb) &&
    !rawThumb.toLowerCase().includes(".mp4");

  const isVideo = isVideoUrl(url);

  const result: MediaItem = {
    type: isVideo ? "video" : "image",
    url,
    thumbnailUrl: isValidThumb ? rawThumb : undefined,
  };

  console.log("[MEDIA][BUILD] ✅ Built media item", result);

  return result;
}