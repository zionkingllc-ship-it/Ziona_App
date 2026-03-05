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
  const flapImage = require("@/assets/images/jonalFlap.png");

  const clamp = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max);

  const wp = (percent: number) => screenWidth * (percent / 100);
  const hp = (percent: number) => screenHeight * (percent / 100);
  const fs = (size: number) => size * (screenWidth / 375);

  const contentWidth = clamp(screenWidth * 0.9, 0, 650);

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
        <XStack
          width={contentWidth}
          position="relative"
          overflow="visible"
          minHeight={501}
        >
          {/* Flap */}
          <View
            position="absolute"
            left={-wp(2)}
            bottom={-hp(5)}
            pointerEvents="none"
          >
            <Image
              source={flapImage}
              width={wp(14)}
              height={hp(12)}
              resizeMode="contain"
            />
          </View>

          {/* Card */}
          <XStack
            flex={1}
            backgroundColor={"#D9C0A0"}
            padding={hp(1.5)}
            borderRadius={wp(1.5)}
          >
            {/* Decorative Strip */}
            <YStack
              width={wp(3)}
              height={"110%"}
              marginTop={-wp(3)}
              backgroundColor={"#573f2114"}
            />

            {/* Content */}
            <YStack flex={1} padding={hp(1)}>
              {/* Header */}
              <YStack
                paddingBottom={hp(1.5)}
                borderBottomWidth={1}
                borderColor="#62292E"
                marginBottom={hp(2)}
              >
                <Text
                  fontFamily="$script"
                  fontWeight="600"
                  fontSize={fs(15)}
                  color={colors.black}
                >
                  Love
                </Text>

                <XStack justifyContent="space-between" alignItems="center">
                  <Text
                    fontFamily="$script"
                    fontWeight="600"
                    fontSize={fs(15)}
                    color={colors.black}
                  >
                    John 3:16
                  </Text>

                  <View
                    borderWidth={1}
                    borderColor="#836F8B"
                    borderRadius={wp(2)}
                    paddingHorizontal={wp(3)}
                    paddingVertical={hp(0.6)}
                  >
                    <Text
                      fontFamily="$body"
                      fontWeight="600"
                      fontSize={fs(11)}
                      color="#836F8B"
                    >
                      KJV
                    </Text>
                  </View>
                </XStack>
              </YStack>

              {/* Verse */}
              <View
                borderLeftWidth={3}
                borderLeftColor="#62292E"
                paddingLeft={wp(4)}
                marginBottom={hp(2)}
              >
                <Text
                  fontFamily="$heading"
                  fontWeight="400"
                  fontSize={fs(17)}
                  fontStyle="italic"
                  color={colors.black}
                  lineHeight={fs(25)}
                >
                  “Jesus wept.”
                </Text>
              </View>

              {/* Description */}
              <Text
                fontFamily="$heading"
                fontWeight="400"
                fontSize={fs(17)}
                color={colors.black}
                lineHeight={fs(25)}
              >
                In quiet seasons and loud storms, God remains constant. When
                doors close, trust His direction. When answers delay, trust His
                timing.
              </Text>
            </YStack>
          </XStack>
        </XStack>

        {/* Heart */}
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
      </Animated.View>
    </GestureDetector>
  );
}
