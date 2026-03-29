import { Category } from "./category";

/* =========================
   MEDIA
========================= */

export type MediaType = "IMAGE" | "VIDEO";

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
   DRAFT (STANDARDIZED)
========================= */

export type TextDraft = {
  type: "TEXT";
  text: string;
  category: Category;
};

export type MediaDraft = {
  type: "MEDIA";
  mediaType: "IMAGE" | "VIDEO";
  media: { items: MediaItem[] };
  category: Category;
  caption?: string;
};

export type BibleDraft = {
  type: "BIBLE";
  bibleVerse: BibleVerse;
  category: Category;
  text?: string;
};

export type CreatePostDraft =
  | TextDraft
  | MediaDraft
  | BibleDraft;