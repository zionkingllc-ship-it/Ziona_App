import { Category } from "./category"

export type CreatePostType = "media" | "text" | "bible"

export interface BibleSelection {
  translation: string
  book: string
  chapter: number
  verses: number[]
  text: string
}

export interface CreatePostDraft {
  type: CreatePostType

  media?: {
    uri: string
    type: "image" | "video"
    thumbnail?: string
  }

  text?: string

  category?: Category

  bibleVerse?: BibleSelection
}