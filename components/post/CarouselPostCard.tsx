import { Post } from "@/types/post";
import React, { useRef, useState } from "react";
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { runOnJS } from "react-native-reanimated";
import { Image, View, XStack } from "tamagui";
import colors from "@/constants/colors";

interface Props {
  post: Post;
  onLike?: () => void;
  heartStyle: any;
  triggerHeart: () => void;
  screenWidth: number;
  screenHeight: number;
}

export default function CarouselPostCard({
  post,
  onLike,
  heartStyle,
  triggerHeart,
  screenWidth,
  screenHeight,
}: Props) {
  const flatListRef = useRef<FlatList>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const likeIconActive = require("@/assets/images/likeIcon2.png");

  const mediaItems = post.media?.items ?? [];

  const clamp = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max);

  const wp = (percent: number) => screenWidth * (percent / 100);

  const handleLike = () => {
    if (onLike) onLike();
    triggerHeart();
  };

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      runOnJS(handleLike)();
    });

  const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(
      e.nativeEvent.contentOffset.x / screenWidth
    );
    setActiveIndex(index);
  };

  return (
    <GestureDetector gesture={doubleTap}>
      <Animated.View
        style={{
          flex: 1,
          width: screenWidth,
          height: screenHeight,
        }}
      >
        <FlatList
          ref={flatListRef}
          data={mediaItems}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          onMomentumScrollEnd={onScrollEnd}
          renderItem={({ item }) => {
            if (!item?.url) return null;

            const source =
              typeof item.url === "string"
                ? { uri: item.url }
                : item.url;

            return (
              <Image
                source={source}
                width={screenWidth}
                height={screenHeight}
                resizeMode="cover"
              />
            );
          }}
        />

        {/* ❤️ Heart */}
        <Animated.View
          style={[
            {
              position: "absolute",
              alignSelf: "center",
              top: screenHeight * 0.4,
            },
            heartStyle,
          ]}
        >
          <Animated.Image
            source={likeIconActive}
            style={{
              width: clamp(wp(22), 90, 170),
              height: clamp(wp(22), 90, 170),
            }}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Pagination */}
        {mediaItems.length > 1 && (
          <XStack
            position="absolute"
            bottom={wp(28)}
            alignSelf="center"
            gap={wp(2)}
          >
            {mediaItems.map((_, index) => (
              <View
                key={index}
                width={wp(2)}
                height={wp(2)}
                borderRadius={wp(1)}
                backgroundColor={
                  index === activeIndex
                    ? colors.white
                    : "rgba(255,255,255,0.4)"
                }
              />
            ))}
          </XStack>
        )}
      </Animated.View>
    </GestureDetector>
  );
}