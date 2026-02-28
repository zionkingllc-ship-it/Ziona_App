import colors from "@/constants/colors";
import { Post } from "@/types/post";
import React from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { runOnJS } from "react-native-reanimated";
import { Image, Text, View, XStack, YStack } from "tamagui";

interface Props {
  post: Post;
  onTogglePlay?: () => void;
  onLike?: () => void;
  heartStyle: any;
  triggerHeart: () => void;
  screenWidth: number;
  screenHeight: number;
}

export default function TextPostCard({
  post,
  onTogglePlay,
  onLike,
  heartStyle,
  triggerHeart,
  screenWidth,
  screenHeight,
}: Props) {
  const likeIconActive = require("@/assets/images/likeIcon2.png");

  // ======= ADVANCED RESPONSIVE SYSTEM =======

  const BASE_WIDTH = 375;

  const scale = screenWidth / BASE_WIDTH;

  const clamp = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max);

  const fs = (size: number, min?: number, max?: number) => {
    const scaled = size * scale;
    if (min !== undefined && max !== undefined) {
      return clamp(scaled, min, max);
    }
    return scaled;
  };

  const wp = (percent: number) => screenWidth * (percent / 100);
  const hp = (percent: number) => screenHeight * (percent / 100);

  // Optional: limit readable content width on tablets
  const contentMaxWidth = clamp(screenWidth * 0.9, 0, 650);

  // ==========================================

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

  const bgSource = resolveSource(
    require("@/assets/images/textPostBackground1.png"),
  );

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: wp(8),
          paddingVertical: hp(6),
          backgroundColor: colors.black,
        }}
      >
        {bgSource && (
          <Image
            source={bgSource}
            style={{
              position: "absolute",
              width: screenWidth,
              height: screenHeight,
              opacity: 0.12,
            }}
            resizeMode="cover"
          />
        )}

        <YStack width="100%" maxWidth={contentMaxWidth} padding={hp(4)}>
          {/* HEADER */}
          <YStack
            paddingBottom={hp(1.5)}
            marginBottom={hp(2.5)}
            borderBottomWidth={1}
            borderColor="#62292E"
          >
            <Text
              fontFamily="$script"
              fontWeight="600"
              fontSize={fs(18, 16, 22)}
              color={colors.white}
            >
              Love
            </Text>

            <XStack justifyContent="space-between" alignItems="center">
              <Text
                fontFamily="$script"
                fontWeight="600"
                fontSize={fs(16, 14, 20)}
                color={colors.white}
              >
                John 3:16
              </Text>

              <View
                borderWidth={1}
                borderColor="#836F8B"
                borderRadius={wp(2)}
                paddingHorizontal={wp(2)}
                paddingVertical={hp(0.5)}
              >
                <Text
                  fontFamily="$body"
                  fontWeight="600"
                  fontSize={fs(12, 11, 14)}
                  color="#836F8B"
                >
                  KJV
                </Text>
              </View>
            </XStack>
          </YStack>

          {/* VERSE */}
          <View
            borderLeftWidth={3}
            borderLeftColor="#62292E"
            paddingLeft={wp(4)}
            marginBottom={hp(3)}
          >
            <Text
              fontFamily="$heading"
              fontWeight="400"
              fontSize={fs(20, 18, 26)}
              fontStyle="italic"
              marginLeft={hp(2)}
              color={colors.white}
              lineHeight={fs(28, 24, 34)}
            >
              “For God so loved the world, that he gave his only begotten Son,
              that whosoever believeth in him should not perish, but have
              everlasting life”
            </Text>
          </View>

          {/* DESCRIPTION */}
          <Text
            fontFamily="$heading"
            fontWeight="400"
            fontSize={fs(17, 15, 22)}
            color={colors.white}
            lineHeight={fs(24, 20, 30)}
          >
            In quiet seasons and loud storms, God remains constant. When doors
            close, trust His direction. When answers delay, trust His timing.
            Faith is not denial of pain; it is confidence in His promises. Stay
            rooted in prayer, anchored in love, and courageous in obedience. He
            is working, even now.
          </Text>
        </YStack>

        {/* HEART ANIMATION */}
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
              width: clamp(wp(20), 80, 160),
              height: clamp(wp(20), 80, 160),
            }}
            resizeMode="contain"
          />
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
}
