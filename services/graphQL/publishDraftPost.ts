import { publishBiblePost } from "./drafts/bibleDraft";
import { publishMediaPost } from "./drafts/mediaDraft";
import { publishTextPost } from "./drafts/textDraft";

import { CreatePostDraft } from "@/types/createPost";

export async function publishDraftPost(draft: CreatePostDraft) {
  if (!draft) {
    throw new Error("Draft is missing");
  }

  console.log("Draft type:", draft.type);
  console.log("FULL DRAFT:", JSON.stringify(draft, null, 2));

  if (draft.type === "text") {
    return publishTextPost(draft);
  }

  if (draft.type === "media") {
    return publishMediaPost(draft);
  }

  if (draft.type === "bible") {
    return publishBiblePost(draft);
  }

  throw new Error("Invalid draft type");
}