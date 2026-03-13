import { CategoryId } from "./post";

export type CreatePostType = "media" | "text" | "bible";

export interface BibleVerse {
  translation: string;
  book: string;
  chapter: number;
  verses: number[];
  text: string;
}

export interface MediaDraft {
  uri: string;
  type: "image" | "video";
  thumbnail?: string;
}

export interface CreatePostDraft {
  type: CreatePostType;

  media?: MediaDraft;

  text?: string;

  category?: CategoryId;

  bibleVerse?: BibleVerse;
}