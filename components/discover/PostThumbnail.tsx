import colors from "@/constants/colors";
import { generateVideoThumbnail } from "@/helpers/thumbnailGenerator";
import { FeedPost } from "@/types/feedTypes";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface Props {
  post: FeedPost;
  size: number;
  onPress: () => void;
}

export default function PostThumbnail({ post, size, onPress }: Props) {
  const [thumbnailUri, setThumbnailUri] = useState<string | null>(null);

  const isMedia = post.type === "media";

  const isCarousel =
    isMedia && post.media?.length > 1 && post.media[0]?.type === "image";

  useEffect(() => {
    let isMounted = true;

    async function loadThumbnail() {
      if (!isMedia || post.media[0]?.type !== "video") return;

      const videoUrl = post.media[0]?.url;
      if (!videoUrl) return;

      const generated = await generateVideoThumbnail(videoUrl);

      if (generated && isMounted) {
        setThumbnailUri(generated);
      }
    }

    loadThumbnail();

    return () => {
      isMounted = false;
    };
  }, [post]);

  const renderMedia = () => {
    /* IMAGE */
    if (isMedia && post.media[0]?.type === "image") {
      const firstItem = post.media[0];

      return (
        <Image
          source={{ uri: firstItem.url }}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
      );
    }

    /* VIDEO */
    if (isMedia && post.media[0]?.type === "video" && thumbnailUri) {
      return (
        <Image
          source={{ uri: thumbnailUri }}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
      );
    }

    /* TEXT / BIBLE */
    if (post.type === "text" || post.type === "bible") {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 8,
          }}
        >
          <Text
            numberOfLines={3}
            style={{
              color: "white",
              fontSize: 12,
              fontWeight: "600",
              textAlign: "center",
            }}
          >
            {post.type === "text"
              ? post.message
              : post.type === "bible"
                ? post.scripture.text
                : ""}
          </Text>
        </View>
      );
    }

    return null;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={{
        width: size,
        height: size,
        margin: 2,
        borderRadius: 2,
        overflow: "hidden",
        backgroundColor: colors.gray,
      }}
    >
      {renderMedia()}

      {/* VIDEO ICON */}
      {isMedia && post.media[0]?.type === "video" && (
        <Ionicons
          name="videocam"
          size={18}
          color="white"
          style={{ position: "absolute", top: 6, left: 6 }}
        />
      )}

      {/* CAROUSEL ICON */}
      {isCarousel && (
        <Ionicons
          name="images"
          size={18}
          color="white"
          style={{ position: "absolute", top: 6, left: 6 }}
        />
      )}
    </TouchableOpacity>
  );
}
