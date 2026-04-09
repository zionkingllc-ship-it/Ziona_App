import * as VideoThumbnails from "expo-video-thumbnails";
import { Asset } from "expo-asset";
import { fixMediaUrl } from "@/utils/feed/normalizePost/fixMediaUrl"; // ✅ SINGLE SOURCE

export async function generateVideoThumbnail(
  videoSource: string | number
): Promise<string | null> {
  try {
    let uri: string | undefined;

    if (typeof videoSource === "number") {
      const asset = Asset.fromModule(videoSource);
      await asset.downloadAsync();
      uri = asset.localUri ?? asset.uri;
    } else if (typeof videoSource === "string") {
      uri = fixMediaUrl(videoSource);
    }

    if (!uri || typeof uri !== "string") {
      console.warn("[THUMB] ❌ Invalid URI:", uri);
      return null;
    }

    if (!uri.startsWith("http") && !uri.startsWith("file")) {
      console.warn("[THUMB] ❌ Unsupported format:", uri);
      return null;
    }

    console.log("[THUMB] 🎬 Generating for:", uri);

    const { uri: thumbnailUri } =
      await VideoThumbnails.getThumbnailAsync(uri, {
        time: 1000,
      });

    if (!thumbnailUri) {
      console.warn("[THUMB] ❌ Empty thumbnail result");
      return null;
    }

    console.log("[THUMB] ✅ Generated:", thumbnailUri);

    return thumbnailUri;
  } catch (error) {
    console.warn("[THUMB] ❌ Failed:", error);
    return null;
  }
}