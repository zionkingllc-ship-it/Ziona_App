export function fixMediaUrl(url?: string): string | undefined {
  console.log("[MEDIA][FIX_URL] 🧩 Incoming URL", url);

  if (!url) {
    console.warn("[MEDIA][FIX_URL] ⚠️ No URL provided");
    return undefined;
  }

  const base = "https://storage.googleapis.com/";
  const parts = url.split(base);

  if (parts.length > 2) {
    const fixed = base + parts.pop();

    console.warn("[MEDIA][FIX_URL] 🔧 Duplicate base detected, fixed URL", {
      original: url,
      fixed,
    });

    return fixed;
  }

  console.log("[MEDIA][FIX_URL] ✅ URL valid", url);

  return url;
}