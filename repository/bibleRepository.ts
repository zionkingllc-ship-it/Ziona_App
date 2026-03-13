import {
  BibleBook,
  BibleChapter,
  BibleTranslation,
  BibleVerse,
} from "@/types/bible"

export interface BibleRepository {
  getTranslations(): Promise<BibleTranslation[]>

  getBooks(): Promise<BibleBook[]>

  getChapters(book: string): Promise<BibleChapter>

  getVerses(
    translation: string,
    book: string,
    chapter: number
  ): Promise<BibleVerse[]>
}