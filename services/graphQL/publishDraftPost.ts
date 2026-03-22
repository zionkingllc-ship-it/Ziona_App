import { createPost } from "./createPost";
import {
  requestMediaUpload,
  uploadFileToStorage,
} from "./mediaUpload";

import * as FileSystem from "expo-file-system/legacy";
import { CreatePostDraft } from "@/types/createPost";

/* =========================
   MAIN PUBLISH FUNCTION
========================= */

export async function publishDraftPost(draft: CreatePostDraft) {
  console.log("━━━━━━━━ PUBLISH DRAFT START ━━━━━━━━");
  console.log("Draft received:", draft);

  if (!draft) {
    throw new Error("Draft is missing");
  }

  if (!draft.category?.id) {
    throw new Error("Category is required");
  }

  /* =========================
     VALIDATION
  ========================= */

  if (draft.type === "text" && !draft.text?.trim()) {
    throw new Error("Text post cannot be empty");
  }

  if (draft.type === "media" && !draft.media?.items?.length) {
    throw new Error("Media is required");
  }

  if (draft.type === "bible" && !draft.bibleVerse) {
    throw new Error("Bible verse is required");
  }

  /* =========================
     MEDIA UPLOAD
  ========================= */

  let mediaUrls: string[] = [];

  if (draft.type === "media") {
    console.log("Uploading media items:", draft.media.items);

    const uploads = draft.media.items.map(
      async (item, index: number) => {
        try {
          console.log(`Uploading item ${index}`, item);

          const fileName =
            item.uri?.split("/").pop() ||
            `file-${Date.now()}-${index}`;

          const fileType =
            item.type === "video"
              ? "video/mp4"
              : "image/jpeg";

          const fileInfo = await FileSystem.getInfoAsync(item.uri);

          if (!fileInfo.exists) {
            throw new Error("File does not exist");
          }

          const realFileSize = fileInfo.size ?? 0;

          const upload = await requestMediaUpload(
            fileName,
            fileType,
            realFileSize
          );

          await uploadFileToStorage(
            upload.uploadUrl,
            item.uri,
            fileType
          );

          const cleanUrl = upload.uploadUrl.split("?")[0];

          return cleanUrl;
        } catch (err) {
          console.error(
            `Media upload failed at index ${index}`,
            err
          );
          throw err;
        }
      }
    );

    mediaUrls = await Promise.all(uploads);

    console.log("All media uploaded. URLs:", mediaUrls);
  }

  /* =========================
     MAP TO createPost
  ========================= */

  let input: any;

  if (draft.type === "media") {
    input = {
      postType: "MEDIA",
      mediaType: draft.mediaType.toUpperCase(),
      caption: null,
      category: String(draft.category.id),
      mediaUrls,
    };
  }

  if (draft.type === "text") {
    input = {
      postType: "TEXT",
      mediaType: null,
      caption: draft.text,
      category: String(draft.category.id),
      mediaUrls: null,
    };
  }

  if (draft.type === "bible") {
    input = {
      postType: "BIBLE",
      mediaType: null,
      caption: draft.bibleVerse.text,
      category: String(draft.category.id),
      mediaUrls: null,
    };
  }

  /* =========================
     CREATE POST
  ========================= */

  try {
    console.log("FINAL INPUT TO createPost:", input);

    const response = await createPost(input);

    console.log("Post created successfully:", response);
    console.log("━━━━━━━━ PUBLISH DRAFT END ━━━━━━━━");

    return response;
  } catch (err) {
    console.error("CreatePost failed with input:", input);
    console.error("Error:", err);
    throw err;
  }
}