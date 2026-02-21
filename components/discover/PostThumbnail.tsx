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

  useEffect(() => {
    let isMounted = true;

    async function loadThumbnail() {
      if (post.type !== "video") return;

      // 1️⃣ Use backend thumbnail if available
      if (post.media.thumbnailUrl) {
        if (isMounted) setThumbnailUri(post.media.thumbnailUrl);
        return;
      }

      // 2️⃣ Otherwise generate from video
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
    // IMAGE
    if (post.type === "image") {
      return (
        <Image
          source={{ uri: post.media.url }}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
      );
    }

    // VIDEO
    if (post.type === "video" && thumbnailUri) {
      return (
        <Image
          source={{ uri: thumbnailUri }}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
      );
    }

    // CAROUSEL (first item)
    if (post.type === "carousel") {
      const firstItem = post.media.items[0];
      return (
        <Image
          source={{ uri: firstItem.url }}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
      );
    }

    // TEXT
    if (post.type === "text") {
      return (
        <ImageBackground
          source={post.media.backgroundImage}
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
        borderRadius: 8,
        overflow: "hidden",
        backgroundColor: colors.gray,
      }}
    >
      {renderMedia()}

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

      {post.type === "carousel" && (
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