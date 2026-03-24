import { graphqlRequest } from "@/services/graphQL/graphqlClient";
import { BibleBook, BibleTranslation, BibleVerse } from "@/types/bible";
import { BibleRepository } from "../bibleRepository";

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
    chapter: number,
  ): Promise<BibleVerse[]> {
    return getBibleVerses(book, chapter, translation);
  }

 async getScripture(params: {
  book: string;
  chapter: number;
  version: string;
}) {
  const QUERY = `
    query scripture(
      $book: String!
      $chapter: Int!
      $version: String!
    ) {
      scripture(
        book: $book
        chapter: $chapter
        version: $version
      ) {
        book
        chapter
        version
        verses {
          number
          text
        }
      }
    }
  `;

  const variables = {
    book: params.book,
    chapter: params.chapter,
    version: params.version.toLowerCase(),
  };

  const data = await graphqlRequest(QUERY, variables);

  return data?.scripture;
}
}
