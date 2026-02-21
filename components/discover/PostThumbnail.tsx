import React, { useEffect, useState } from "react";
import { View, Image, TouchableOpacity, Text, ImageBackground, StyleSheet } from "react-native";
import { Post } from "@/types/post";
import { Ionicons } from "@expo/vector-icons";
import colors from "@/constants/colors";
import { generateVideoThumbnail } from "@/helpers/thumbnailGenerator";

const TEXT_BG = require("@/assets/images/textPostBackground1.png");

interface Props {
  post: Post;
  size: number;
  onPress: () => void;
}

export default function PostThumbnail({ post, size, onPress }: Props) {
  const [videoThumbnail, setVideoThumbnail] = useState<string | null>(null);

  useEffect(() => {
    async function loadThumbnail() {
      if (post.type === "video") {
        // If backend already provides thumbnail, use it
        if (post.media.thumbnailUrl) {
          setVideoThumbnail(post.media.thumbnailUrl);
        } else if (post.media.videoUrl) {
          const generated = await generateVideoThumbnail(post.media.videoUrl);
          if (generated) {
            setVideoThumbnail(generated);
          }
        }
      }
    }

    loadThumbnail();
  }, [post]);

  const getThumbnail = () => {
    if (post.type === "image") return { uri: post.media.url };
    if (post.type === "video" && videoThumbnail) return { uri: videoThumbnail };
    if (post.type === "carousel") return { uri: post.media.items?.[0]?.url };
    return null;
  };

  const thumbnail = getThumbnail();

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
      {thumbnail && (
        <Image
          source={thumbnail}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
      )}

      {post.type === "text" && (
        <ImageBackground
          source={TEXT_BG}
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
            ellipsizeMode="tail"
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
      )}

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