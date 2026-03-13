import { BibleRepository } from "./bibleRepository";

export const mockBibleRepository: BibleRepository = {
  async getTranslations() {
    return [
      { id: "kjv", name: "KJV" },
      { id: "niv", name: "NIV" },
      { id: "msg", name: "MSG" },
    ];
  },

  async getBooks() {
    return [
      { id: "genesis", name: "Genesis", testament: "old" },
      { id: "exodus", name: "Exodus", testament: "old" },
      { id: "john", name: "John", testament: "new" },
      { id: "romans", name: "Romans", testament: "new" },
    ];
  },

  async getChapters(book: string) {
    const chapterMap: Record<string, number> = {
      genesis: 50,
      exodus: 40,
      john: 21,
      romans: 16,
    };

    return {
      book,
      chapters: chapterMap[book.toLowerCase()] || 20,
    };
  },

async getVerses() {
  return [
    { number: 15, text: "That whoever believes in him..." },
    { number: 16, text: "For God so loved the world..." },
    { number: 17, text: "For God did not send his Son..." },
    { number: 18, text: "Whoever believes in him is not condemned..." },
  ];
},
};
