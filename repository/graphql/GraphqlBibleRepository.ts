import { BibleRepository } from "../bibleRepository";
import {
  BibleBook,
  BibleTranslation,
  BibleVerse,
} from "@/types/bible";

import {
  getBibleBooks,
  getBibleTranslations,
  getBibleVerses,
} from "@/services/bible/bibleService";

export class GraphqlBibleRepository implements BibleRepository {
  async getTranslations(): Promise<BibleTranslation[]> {
    return getBibleTranslations();
  }

  async getBooks(): Promise<BibleBook[]> {
    const books = await getBibleBooks();

    return books;
  }

  async getChapters(book: BibleBook): Promise<number[]> {
    return Array.from({ length: book.chapters }, (_, i) => i + 1);
  }

  async getVerses(
    translation: string,
    book: string,
    chapter: number
  ): Promise<BibleVerse[]> {
    return getBibleVerses(book, chapter, translation);
  }
}