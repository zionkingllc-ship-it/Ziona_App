// components/post/CarouselPostCard.tsx

import { Post } from "@/types/post";
import React from "react";
import { Dimensions, FlatList, Image } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { runOnJS } from "react-native-reanimated";

interface Props {
  post: Post;
  onLike?: () => void;
  heartStyle: any;
  triggerHeart: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function CarouselPostCard({
  post,
  onLike,
  heartStyle,
  triggerHeart,
}: Props) {
  const likeIconActive = require("@/assets/images/likeIcon2.png");

  const handleLike = () => {
    if (onLike) onLike();
    triggerHeart();
  };

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      runOnJS(handleLike)();
    });

  return (
    <GestureDetector gesture={doubleTap}>
      <Animated.View style={{ flex: 1 }}>
        <FlatList
          data={post.media.items}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            if (!item?.url) return null;

            const source =
              typeof item.url === "string"
                ? { uri: item.url }
                : item.url;

            return (
              <Image
                source={source}
                style={{
                  width: SCREEN_WIDTH,
                  height: "100%",
                  resizeMode: "cover",
                }}
              />
            );
          }}
        />

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