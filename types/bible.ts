export interface BibleTranslation {
  id: string
  name: string
}

export interface BibleBook {
  id: string
  name: string
  testament: "old" | "new"
}

export interface BibleChapter {
  book: string
  chapters: number
}

export interface BibleVerse {
  number: number
  text: string
}