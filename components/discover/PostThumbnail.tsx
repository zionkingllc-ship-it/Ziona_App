import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  ImageBackground,
  StyleSheet,
} from "react-native";
import { Post } from "@/types/post";
import { Ionicons } from "@expo/vector-icons";
import colors from "@/constants/colors";
import { generateVideoThumbnail } from "@/helpers/thumbnailGenerator";

interface Props {
  post: Post;
  size: number;
  onPress: () => void;
}

export default function PostThumbnail({
  post,
  size,
  onPress,
}: Props) {
  const [thumbnailUri, setThumbnailUri] = useState<string | null>(null);

  const isCarousel =
    post.type === "image" && post.media.items.length > 1;

  useEffect(() => {
    let isMounted = true;

    async function loadThumbnail() {
      if (post.type !== "video") return;

      if (post.media.thumbnailUrl) {
        if (isMounted) setThumbnailUri(post.media.thumbnailUrl);
        return;
      }

      const generated = await generateVideoThumbnail(
        post.media.videoUrl
      );

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
    /* IMAGE (single or carousel) */
    if (post.type === "image") {
      const firstItem = post.media.items[0];

      if (!firstItem) return null;

      const source =
        typeof firstItem.url === "string"
          ? { uri: firstItem.url }
          : firstItem.url;

      return (
        <Image
          source={source}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
      );
    }

    /* VIDEO */
    if (post.type === "video" && thumbnailUri) {
      const source =
        typeof thumbnailUri === "string"
          ? { uri: thumbnailUri }
          : thumbnailUri;

      return (
        <Image
          source={source}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
      );
    }

    /* TEXT */
    if (post.type === "text") {
      const source =
        typeof post.media.backgroundImage === "string"
          ? { uri: post.media.backgroundImage }
          : post.media.backgroundImage;

      return (
        <ImageBackground
          source={source}
          style={{ flex: 1, justifyContent: "center", padding: 10 }}
          resizeMode="cover"
        >
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              backgroundColor: "rgba(0,0,0,0.25)",
            }}
          />
          <Text
            numberOfLines={3}
            style={{
              color: "white",
              fontSize: 12,
              fontWeight: "600",
              textAlign: "center",
            }}
          >
            {post.text}
          </Text>
        </ImageBackground>
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
      {post.type === "video" && (
        <Ionicons
          name="videocam"
          size={18}
          color="white"
          style={{
            position: "absolute",
            top: 6,
            left: 6,
          }}
        />
      )}

      {/* CAROUSEL ICON */}
      {isCarousel && (
        <Ionicons
          name="images"
          size={18}
          color="white"
          style={{
            position: "absolute",
            top: 6,
            left: 6,
          }}
        />
      )}
    </TouchableOpacity>
  );
}