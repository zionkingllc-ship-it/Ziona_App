export function fixMediaUrl(url?: string): string | undefined {
  console.log("[MEDIA][FIX_URL] 🧩 Incoming URL", url);

  if (!url || typeof url !== "string") {
    console.warn("[MEDIA][FIX_URL] ❌ Invalid input");
    return undefined;
  }

  let clean = url.trim();

  /* =========================
     FIX DOUBLE BASE
  ========================== */
  const base = "https://storage.googleapis.com/";

  const parts = clean.split(base);

  if (parts.length > 2) {
    clean = base + parts.pop();
    console.warn("[MEDIA][FIX_URL] 🔧 Fixed duplicate base", clean);
  }

  /* =========================
     FIX MISSING PROTOCOL
  ========================== */
  if (clean.startsWith("//")) {
    clean = "https:" + clean;
    console.warn("[MEDIA][FIX_URL] 🔧 Added protocol", clean);
  }

  if (!clean.startsWith("http")) {
    clean = "https://" + clean;
    console.warn("[MEDIA][FIX_URL] 🔧 Forced https", clean);
  }

  /* =========================
     FINAL VALIDATION
  ========================== */
  try {
    new URL(clean);
  } catch {
    console.error("[MEDIA][FIX_URL] ❌ Invalid URL after fix", clean);
    return undefined;
  }

  console.log("[MEDIA][FIX_URL] ✅ Final URL", clean);

  return clean;
}