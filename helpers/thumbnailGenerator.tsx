import * as VideoThumbnails from "expo-video-thumbnails";

export async function generateVideoThumbnail(videoUrl: string) {
  try {
    const { uri } = await VideoThumbnails.getThumbnailAsync(videoUrl, {
      time: 1000, // 1 second into video
    });

    return uri;
  } catch (error) {
    console.warn("Thumbnail generation failed:", error);
    return null;
  }
}