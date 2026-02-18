import React from "react";
import { View, Image, TouchableOpacity, Text, ImageBackground, StyleSheet } from "react-native";
import { Post } from "@/types/post";
import { Ionicons } from "@expo/vector-icons";
import colors from "@/constants/colors";

const TEXT_BG = require("@/assets/images/textPostBackground1.png");

interface Props {
  post: Post;
  size: number;
  onPress: () => void;
}

export default function PostThumbnail({ post, size, onPress }: Props) {
  const getThumbnail = () => {
    if (post.type === "image") return { uri: post.media.url };
    if (post.type === "video") return { uri: post.media.thumbnailUrl };
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
        <Image source={thumbnail} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
      )}

      {post.type === "text" && (
        <ImageBackground
          source={TEXT_BG}
          style={{ flex: 1, justifyContent: "center", padding: 10 }}
          resizeMode="cover"
        >
          <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.25)" }} />
          <Text
            numberOfLines={3}
            ellipsizeMode="tail"
            style={{ color: "white", fontSize: 12, fontWeight: "600", textAlign: "center" }}
          >
            {post.text}
          </Text>
        </ImageBackground>
      )}

      {post.type === "video" && (
        <Ionicons name="play" size={18} color="white" style={{ position: "absolute", top: 6, right: 6 }} />
      )}
      {post.type === "carousel" && (
        <Ionicons name="images" size={18} color="white" style={{ position: "absolute", top: 6, right: 6 }} />
      )}
    </TouchableOpacity>
  );
}