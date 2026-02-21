import * as VideoThumbnails from "expo-video-thumbnails";
import { Asset } from "expo-asset";

export async function generateVideoThumbnail(videoSource: string | number) {
  try {
    let uri: string;

    if (typeof videoSource === "number") {
      const asset = Asset.fromModule(videoSource);
      await asset.downloadAsync();
      uri = asset.localUri ?? asset.uri;
    } else {
      uri = videoSource;
    }

    const { uri: thumbnailUri } =
      await VideoThumbnails.getThumbnailAsync(uri, {
        time: 1000,
      });

    return thumbnailUri;
  } catch (error) {
    console.warn("Thumbnail generation failed:", error);
    return null;
  }
}