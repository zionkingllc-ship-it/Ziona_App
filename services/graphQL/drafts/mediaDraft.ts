import { requestMediaUpload, uploadFileToStorage } from "../mediaUpload";
import { createMediaPost } from "../mutation/publishMediaPost";

import { MediaDraft } from "@/types/createPost";
import * as FileSystem from "expo-file-system/legacy";

/* =========================
   MIME TYPE (MINIMAL FIX)
========================= */

function getMimeType(uri: string, type: "image" | "video") {
  if (type === "image") {
    return "image/jpg"; // 🔥 ONLY CHANGE (was jpeg)
  }

  if (type === "video") {
    return "video/mp4";
  }

  return "application/octet-stream";
}

/* =========================
   MAIN FUNCTION
========================= */

export async function publishMediaPost(draft: MediaDraft) {
  console.log("━━━━━━━━ PUBLISH MEDIA START ━━━━━━━━");
  console.log("Draft received:", draft);

  if (!draft) {
    throw new Error("Draft is missing");
  }

  if (!draft.category?.id) {
    throw new Error("Category is required");
  }

  if (!draft.media?.items?.length) {
    throw new Error("Media is required");
  }

  /* =========================
     MEDIA UPLOAD
  ========================= */

  const uploads = draft.media.items.map(async (item, index: number) => {
    try {
      console.log(`Uploading item ${index}`, item);

      const fileName =
        item.uri?.split("/").pop() ||
        `file-${Date.now()}-${index}`;

      const fileType = getMimeType(item.uri, item.type);

      const fileInfo = await FileSystem.getInfoAsync(item.uri);

      if (!fileInfo.exists) {
        throw new Error("File does not exist");
      }

      if (!fileInfo.size || fileInfo.size <= 0) {
        throw new Error("Invalid file size");
      }

      console.log("Upload payload:", {
        fileName,
        fileType,
        size: fileInfo.size,
      });

      const upload = await requestMediaUpload(
        fileName,
        fileType,
        fileInfo.size
      );

      await uploadFileToStorage(
        upload.uploadUrl,
        item.uri,
        fileType
      );

      const cleanUrl = upload.uploadUrl.split("?")[0];

      return cleanUrl;
    } catch (err) {
      console.error(`Media upload failed at index ${index}`, err);
      throw err;
    }
  });

  const mediaUrls = await Promise.all(uploads);

  console.log("All media uploaded. URLs:", mediaUrls);

  /* =========================
     FINAL PAYLOAD
  ========================= */

  const input: any = {
    postType: "MEDIA",
    mediaType: draft.mediaType.toUpperCase(),
    category: String(draft.category.id),
    mediaUrls,
  };

  if (draft.caption?.trim()) {
    input.caption = draft.caption;
  }

  console.log("FINAL INPUT TO createMediaPost:", input);

  /* =========================
     CREATE POST
  ========================= */

  try {
    const response = await createMediaPost(input);

    console.log("Media post created successfully:", response);
    console.log("━━━━━━━━ PUBLISH MEDIA END ━━━━━━━━");

    return response;
  } catch (err) {
    console.error("CreateMediaPost failed with input:", input);
    console.error("Error:", err);
    throw err;
  }
}