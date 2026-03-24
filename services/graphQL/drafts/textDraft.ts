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
    caption: draft.text, 
    category: String(draft.category.id),
  };

  console.log("TEXT INPUT:", input);

  return await createTextPost(input);
}