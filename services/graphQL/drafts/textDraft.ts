import { TextDraft } from "@/types/createPost";
import { createTextPost } from "../mutation/createTextPost";

export async function publishTextPost(draft: TextDraft) {
  if (!draft.category?.id) {
    throw new Error("Category is required");
  }

  if (!draft.text?.trim()) {
    throw new Error("Text cannot be empty");
  }

  const bible = draft.bibleVerse;
  const hasBible = !!bible && Array.isArray(bible.verses) && bible.verses.length > 0;

  /* =========================
     DERIVE START / END
  ========================= */

  let verseStart: number | undefined;
  let verseEnd: number | undefined;

  if (hasBible) {
    const sorted = [...bible.verses].sort((a, b) => a - b);

    verseStart = sorted[0];
    verseEnd = sorted.length > 1 ? sorted[sorted.length - 1] : undefined;
  }

  const input = {
    postType: "TEXT" as const,
    message: draft.text,
    category: String(draft.category.id),

    scriptureBook: hasBible ? bible.book : undefined,
    scriptureChapter: hasBible ? bible.chapter : undefined,
    scriptureVerseStart: verseStart,
    scriptureVerseEnd: verseEnd,
    scriptureTranslation: hasBible ? bible.translation : undefined,
  };

  console.log("TEXT INPUT:", input);

  return await createTextPost(input);
}   