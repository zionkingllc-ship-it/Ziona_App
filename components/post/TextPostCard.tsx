// components/post/TextPostCard.tsx

import colors from "@/constants/colors";
import { Post } from "@/types/post";
import React from "react";
import { Image } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { runOnJS } from "react-native-reanimated";

interface Props {
  post: Post;
  onTogglePlay?: () => void;
  onLike?: () => void;
  heartStyle: any;
  triggerHeart: () => void;
}

export default function TextPostCard({
  post,
  onTogglePlay,
  onLike,
  heartStyle,
  triggerHeart,
}: Props) {
  const likeIconActive = require("@/assets/images/likeIcon2.png");

  function resolveSource(source?: string | number) {
    if (!source) return undefined;

    if (typeof source === "string") {
      if (source.trim() === "") return undefined;
      return { uri: source };
    }

    return source;
  }

  const handleLike = () => {
    if (onLike) onLike();
    triggerHeart();
  };

  const singleTap = Gesture.Tap()
    .numberOfTaps(1)
    .onEnd(() => {
      if (onTogglePlay) runOnJS(onTogglePlay)();
    });

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      runOnJS(handleLike)();
    });

  const gesture = Gesture.Exclusive(doubleTap, singleTap);

  const bgSource = resolveSource(post.media?.backgroundImage);

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 24,
          backgroundColor: colors.black,
        }}
      >
        {bgSource && (
          <Image
            source={bgSource}
            style={{
              position: "absolute",
              width: "115%",
              height: "75%",
              borderRadius: 10,
            }}
          />
        )}

        <Animated.Text
          style={{
            color: "white",
            fontSize: 22,
            textAlign: "center",
            fontWeight: "600",
          }}
        >
          {post.text}
        </Animated.Text>

        <Animated.View
          style={[
            {
              position: "absolute",
              alignSelf: "center",
              top: "40%",
            },
            heartStyle,
          ]}
        >
          <Animated.Image source={likeIconActive} />
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
}