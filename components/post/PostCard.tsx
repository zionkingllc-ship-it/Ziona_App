import colors from "@/constants/colors";
import { Post } from "@/types/post";
import { Play } from "@tamagui/lucide-icons";
import { VideoView, useVideoPlayer } from "expo-video";
import { useEffect, useRef, useState } from "react";
import { View as RNView } from "react-native";
import { Image, Text, View, XStack, YStack } from "tamagui";
import Video from "react-native-video";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { runOnJS } from "react-native-reanimated";

type Props = {
  post: Post;
  isActive?: boolean;
  screenHeight: number;
};

const likeIcon = require("@/assets/images/likeIcon.png");
const likeIconActive = require("@/assets/images/likeIcon2.png");
const commentIcon = require("@/assets/images/commentIcon.png");
const bookmarkIcon = require("@/assets/images/bookmarkIcon.png");
const shareIcon = require("@/assets/images/shareIcon.png");
const flagIcon = require("@/assets/images/flagIcon.png");

export function PostCard({ post, isActive, screenHeight }: Props) {
  const player =
    post.type === "video"
      ? useVideoPlayer(post.media.url, (p) => {
          p.loop = true;
          p.muted = false;
        })
      : null;

  const [progress, setProgress] = useState(0);
  const [showPlayIcon, setShowPlayIcon] = useState(false);
  const [liked, setLiked] = useState(false);

  const durationRef = useRef(0);
  const readyRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const progressWidthRef = useRef(0);
  const lastRatioRef = useRef(0);

  /* =========================
     PLAYER READY TRACKING
  ========================== */
  useEffect(() => {
    if (!player) return;

    const sub = player.addListener("statusChange", (status) => {
      if (status.status === "readyToPlay") {
        readyRef.current = true;
        durationRef.current = player.duration || 0;
      }
    });

    return () => sub.remove();
  }, [player]);

  /* =========================
     AUTO PLAY
  ========================== */
  useEffect(() => {
    if (!player || !readyRef.current) return;

    if (isActive) {
      player.play();
      setShowPlayIcon(false);
    } else {
      player.pause();
      setShowPlayIcon(true);
    }
  }, [isActive, player]);

  /* =========================
     PROGRESS LOOP
  ========================== */
  useEffect(() => {
    if (!player) return;

    const update = () => {
      if (
        readyRef.current &&
        durationRef.current > 0
      ) {
        const ratio =
          player.currentTime / durationRef.current;

        setProgress(Math.max(0, Math.min(1, ratio)));
      }

      rafRef.current = requestAnimationFrame(update);
    };

    rafRef.current = requestAnimationFrame(update);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [player]);

  /* =========================
     SAFE SEEK
  ========================== */
const handleSeek = async (ratio: number) => {
  if (!player) return;
  if (!durationRef.current) return;

  const newTime = ratio * durationRef.current;
  const wasPlaying = player.playing;

  try {
    //  Pause first
    if (wasPlaying) {
      player.pause();
    }

    //  Seek
    player.currentTime = newTime;

    // Resume next frame 
    if (wasPlaying) {
      requestAnimationFrame(() => {
        player.play();
      });
    }
  } catch (e) {
    console.log("Seek error:", e);
  }
};
  /* =========================
     CONTROLS
  ========================== */
  const handleSingleTap = () => {
    if (!player || !readyRef.current) return;

    if (player.playing) {
      player.pause();
      setShowPlayIcon(true);
    } else {
      player.play();
      setShowPlayIcon(false);
    }
  };

  const handleDoubleTap = () => {
    setLiked(true);
  };

  const handleLongPressStart = () => {
    if (!player || !readyRef.current) return;
    if (!player.playing) return;

    player.playbackRate = 2.0;
  };

  const handleLongPressEnd = () => {
    if (!player || !readyRef.current) return;

    player.playbackRate = 1.0;
  };

  /* =========================
     GESTURES
  ========================== */
  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onStart(() => runOnJS(handleDoubleTap)());

  const singleTap = Gesture.Tap()
    .numberOfTaps(1)
    .onStart(() => runOnJS(handleSingleTap)());

  const longPress = Gesture.LongPress()
    .minDuration(250)
    .onStart(() => runOnJS(handleLongPressStart)())
    .onEnd(() => runOnJS(handleLongPressEnd)());

  const videoGesture = Gesture.Exclusive(
    doubleTap,
    Gesture.Simultaneous(longPress, singleTap)
  );

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      if (!progressWidthRef.current) return;

      const ratio = Math.max(
        0,
        Math.min(1, e.x / progressWidthRef.current)
      );

      lastRatioRef.current = ratio;
      runOnJS(setProgress)(ratio);
    })
    .onEnd(() => {
      runOnJS(handleSeek)(lastRatioRef.current);
    });

  return (
    <YStack height={screenHeight} width="100%" backgroundColor="black">
      <GestureDetector gesture={videoGesture}>
        <Animated.View style={{ flex: 1 }}>
          {post.type === "video" && player && (
            <>
              <VideoView
                player={player}
                style={{ width: "100%", height: "100%" }}
                contentFit="cover"
                nativeControls={false}
              />

              {showPlayIcon && (
                <View
                  position="absolute"
                  top="50%"
                  left="50%"
                  style={{
                    transform: [{ translateX: -30 }, { translateY: -30 }],
                  }}
                  width={60}
                  height={60}
                  borderRadius={30}
                  backgroundColor="#FFF1DB"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Play size={30} color="black" fill="black" />
                </View>
              )}
            </>
          )}
        </Animated.View>
      </GestureDetector>

      <YStack position="absolute" bottom={34} width="100%">
        <XStack padding="$4" alignItems="flex-end">
          <YStack flex={1} gap="$2">
            <Text color="white">@{post.author.name}</Text>
            {post.caption && (
              <Text color="white">{post.caption}</Text>
            )}
          </YStack>

          <YStack gap="$4" alignItems="center">
            <Image
              source={liked ? likeIconActive : likeIcon}
              width={24}
              height={24}
            />
            <Image source={commentIcon} width={24} height={24} />
            <Image source={bookmarkIcon} width={24} height={24} />
            <Image source={shareIcon} width={24} height={24} />
            <Image source={flagIcon} width={24} height={24} />
          </YStack>
        </XStack>

        {post.type === "video" && (
          <GestureDetector gesture={panGesture}>
            <Animated.View
              onLayout={(e) => {
                progressWidthRef.current =
                  e.nativeEvent.layout.width;
              }}
              style={{
                height: 6,
                backgroundColor: "white",
                width: "100%",
              }}
            >
              <RNView
                style={{
                  height: "100%",
                  width: `${progress * 100}%`,
                  backgroundColor: colors.secondary,
                }}
              />
            </Animated.View>
          </GestureDetector>
        )}
      </YStack>
    </YStack>
  );
}