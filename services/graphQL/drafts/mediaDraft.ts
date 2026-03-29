import { requestMediaUpload, uploadFileToStorage } from "../mediaUpload";
import { createMediaPost } from "../mutation/publishMediaPost";

import { MediaDraft } from "@/types/createPost";
import * as FileSystem from "expo-file-system/legacy";

import { QueryClient } from "@tanstack/react-query";

/* =========================
   MIME TYPE
========================= */

function getMimeType(uri: string, type: "IMAGE" | "VIDEO") {
  if (type === "IMAGE") return "image/jpg";
  if (type === "VIDEO") return "video/mp4";
  return "application/octet-stream";
}

/* =========================
   EXTRACT PUBLIC URL (REAL FIX)
========================= */

function extractPublicUrl(uploadUrl: string) {
  const url = new URL(uploadUrl);

  // Example:
  // /ziona-media-dev/uploads/...mp4
  let path = url.pathname;

  // remove leading slash
  if (path.startsWith("/")) path = path.slice(1);

  return `https://storage.googleapis.com/${path}`;
}

/* =========================
   MAIN FUNCTION
========================= */

export async function publishMediaPost(
  draft: MediaDraft,
  queryClient: QueryClient
) {
  console.log("━━━━━━━━ PUBLISH MEDIA START ━━━━━━━━");
  console.log("Draft received:", draft);

  if (!draft) throw new Error("Draft is missing");
  if (!draft.category?.id) throw new Error("Category is required");
  if (!draft.media?.items?.length) throw new Error("Media is required");

  /* =========================
     MEDIA UPLOAD
  ========================= */

  const uploads = draft.media.items.map(async (item, index: number) => {
    try {
      console.log(`Uploading item ${index}`, item);

      const fileName =
        item.uri?.split("/").pop() || `file-${Date.now()}-${index}`;

      const fileType = getMimeType(item.uri, item.type);

      const fileInfo = await FileSystem.getInfoAsync(item.uri);

      if (!fileInfo.exists) throw new Error("File does not exist");
      if (!fileInfo.size || fileInfo.size <= 0)
        throw new Error("Invalid file size");

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

      /* 🔥 REAL FIX */
      const publicUrl = extractPublicUrl(upload.uploadUrl);

      return publicUrl;

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

    await queryClient.invalidateQueries({
      queryKey: ["feed"],
      exact: false,
    });

    console.log("Feed invalidated");
    console.log("━━━━━━━━ PUBLISH MEDIA END ━━━━━━━━");

    return response;
  } catch (err) {
    console.error("CreateMediaPost failed with input:", input);
    console.error("Error:", err);
    throw err;
  }
}