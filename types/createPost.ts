import { Category } from "./category";

/* =========================
   MEDIA
========================= */

export type MediaType = "image" | "video";

export interface MediaItem {
  id: string;
  uri: string;
  type: MediaType;
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
}

/* =========================
   DRAFT (CLEAN)
========================= */

export type TextDraft = {
  type: "text";
  text: string;
  category: Category;
};

export type MediaDraft = {
  type: "media";
  mediaType: "image" | "video";
  media: { items: MediaItem[] };
  category: Category;
  caption?: string;
};

export type BibleDraft = {
  type: "bible";
  bibleVerse: BibleVerse;
  category: Category;
  text?: string; 
};

export type CreatePostDraft =
  | TextDraft
  | MediaDraft
  | BibleDraft;