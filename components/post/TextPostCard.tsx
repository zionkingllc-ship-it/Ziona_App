import colors from "@/constants/colors";
import { FeedTextPost, FeedBiblePost } from "@/types/feedTypes";
import React from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { runOnJS } from "react-native-reanimated";
import { Text, YStack } from "tamagui";

type Props = {
  post: FeedTextPost | FeedBiblePost; // supports both
  onTogglePlay?: () => void;
  onLike?: () => void;
  heartStyle: any;
  triggerHeart: () => void;
  screenWidth: number;
  screenHeight: number;
};

export default function TextPostCard({
  post,
  onTogglePlay,
  onLike,
  heartStyle,
  triggerHeart,
  screenWidth,
  screenHeight,
}: Props) {
  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      if (onLike) runOnJS(onLike)();
      runOnJS(triggerHeart)();
    });

  return (
    <GestureDetector gesture={doubleTap}>
      <Animated.View
        style={{
          flex: 1,
          width: screenWidth,
          height: screenHeight,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 20,
          backgroundColor: "black",
        }}
      >
        {/*LIKE ANIMATION */}
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
            source={require("@/assets/images/likeIcon2.png")}
            style={{ width: 80, height: 80 }}
          />
        </Animated.View>

        <YStack gap="$4" alignItems="center">
          {/*  Scripture (only for bible) */}
          {"scripture" in post && post.scripture ? (
            <Text
              color={colors.white}
              fontSize={18}
              fontWeight="600"
              textAlign="center"
            >
              {post.scripture.book} {post.scripture.chapter}:
              {post.scripture.verseStart}
              {post.scripture.verseEnd
                ? `-${post.scripture.verseEnd}`
                : ""}
            </Text>
          ) : null}

          {/*Caption */}
          <Text
            color={colors.white}
            fontSize={20}
            textAlign="center"
          >
            {post.caption}
          </Text>
        </YStack>
      </Animated.View>
    </GestureDetector>
  );
}