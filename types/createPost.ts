import { DiscoverCategory } from "./discover";

/* =========================
   POST TYPES (MATCH BACKEND)
========================= */

export type CreatePostType = "MEDIA" | "TEXT" | "BIBLE";

/* =========================
   MEDIA
========================= */

export type MediaType = "image" | "video";

export interface MediaItem {
  id: string;
  uri: string;
  type: MediaType;
  thumbnail?: string;
}

/* =========================
   BIBLE
========================= */

export interface BibleVerse {
  translation: string;
  book: string;
  chapter: number;
  verses: number[];
  text: string;
  reference?: string;
}

/* =========================
   DRAFT (STRICT + CLEAN)
========================= */

export type CreatePostDraft =
  | {
      type: "text";
      text: string;
      category: DiscoverCategory;
    }
  | {
      type: "media";
      mediaType: MediaType;
      media: { items: MediaItem[] };
      category: DiscoverCategory;
    }
  | {
      type: "bible";
      bibleVerse: BibleVerse;
      category: DiscoverCategory;
    };