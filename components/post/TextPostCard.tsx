import colors from "@/constants/colors";
import { Post } from "@/types/post";
import React from "react";
import { Image } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { runOnJS } from "react-native-reanimated";
import { Text, View, XStack, YStack } from "tamagui";

interface Props {
  post: Post[];
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
          padding: 40,
          gap: 15,
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
        <YStack flex={1} width={"100%"} paddingTop={100} paddingHorizontal={12}>
          <YStack
            width={"100%"}
            height={"10%"}
            paddingHorizontal={10}
            borderBottomWidth={1}
            marginBottom={10}
          >
            <Text
              fontFamily={"$script"}
              fontWeight={"600"}
              fontSize={"$3"}
              color={colors.black}
            >
              Love
            </Text>
            <XStack justifyContent="space-between" alignItems="center">
              <Text fontFamily={"$script"} fontWeight={"600"} fontSize={"$3"}>
                John 3:16
              </Text>
              <View
                borderWidth={0.3}
                borderColor={"#836F8B"}
                borderRadius={4}
                paddingHorizontal={3}
                width={"$4"}
                justifyContent="center"
                alignItems={"center"}
              >
                <Text
                  fontFamily={"$body"}
                  fontWeight={"600"}
                  color={"#836F8B"}
                  fontStyle="italic"
                >
                  KJV
                </Text>
              </View>
            </XStack>
          </YStack>
          <View
            width={"100%"}
            flexDirection="column"
            borderLeftWidth={2}
            justifyContent="center"
            alignItems="center"
            paddingLeft={10}
            marginBottom={15}
          >
            <Text
              fontFamily={"$heading"}
              fontWeight={"400"}
              fontSize={"$4"}
              fontStyle="italic"
              borderLeftColor={"#62292E"}
            >
              “For God so loved the world, that he gave his only begotten Son,
              that whosoever believeth in him should not perish, but have
              everlasting life”
            </Text>
          </View>
          <Text fontFamily={"$heading"} fontWeight={"400"} fontSize={"$4"}>
            In quiet seasons and loud storms, God remains constant. When doors
            close, trust His direction. When answers delay, trust His timing.
            Faith is not denial of pain; it is confidence in His promises. Stay
            rooted in prayer, anchored in love, and courageous in obedience. He
            is working, even now.
          </Text>
        </YStack>

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
