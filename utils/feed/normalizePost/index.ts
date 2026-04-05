import { FeedPost } from "@/types/feedTypes";
import { normalizeBase } from "./normalizeBase";
import { normalizeMedia } from "./normalizeMedia";
import { normalizeText } from "./normalizeText";
import { normalizeBible } from "./normalizeBible";

export function normalizePost(p: any): FeedPost | null {
  if (!p?.id || !p?.type) return null;

  const base = normalizeBase(p);

  if (p.type === "MEDIA") {
    return normalizeMedia(p, base);
  }

  if (p.type === "TEXT") {
    return normalizeText(p, base);
  }

  if (p.type === "BIBLE") {
    return normalizeBible(p, base);
  }

  return null;
}