import { createTextPost } from "../mutation/createTextPost";
import { TextDraft } from "@/types/createPost";

export async function publishTextPost(draft: TextDraft) {
  if (!draft.category?.id) {
    throw new Error("Category is required");
  }

  if (!draft.text?.trim()) {
    throw new Error("Text cannot be empty");
  }

  const input = {
    postType: "TEXT" as const,
    caption: buildCaption(draft.text), 
    category: String(draft.category.id),
  };

  console.log("TEXT INPUT:", input);

  return await createTextPost(input);
}
function buildCaption(text: string, max = 20) {
  if (!text) return "Bible verse";

  if (text.length <= max) return text;

  return text.slice(0, max).trimEnd() + "...";
}