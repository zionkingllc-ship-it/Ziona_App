import colors from "@/constants/colors";
import { useBookmarksStore } from "@/store/useBookmarkStore";
import { Post } from "@/types/post";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useMemo, useState } from "react";
import { Pressable, TouchableOpacity } from "react-native";
import { Image, Text, XStack, YStack } from "tamagui";
import { CommentsSheet } from "../comments/commentsModal";
import BookmarkFoldersModal from "../ui/modals/BookmarkFoldersModal";
import ConfirmReportModal from "../ui/modals/ConfirmReportModal";
import CreateFolderModal from "../ui/modals/CreateFolderModal";
import ReportReasonsModal from "../ui/modals/ReportReasonsModal";
import ShareModal from "../ui/modals/ShareModal";
import SuccessModal from "../ui/modals/successModal";
import PostMedia from "./postcard/PostMedia";
import OtherReportModal from "../ui/modals/OtherReportModal";
import { useScreenDimensions } from "@/context/ScreenDimensionsContext";

type Props = {
  post: Post;
  isPlaying: boolean;
  screenHeight: number;
  screenWidth: number;
};

const likeIcon = require("@/assets/images/likeIcon.png");
const likeIconActive = require("@/assets/images/likeIcon2.png");
const commentIcon = require("@/assets/images/commentIcon.png");
const bookmarkIcon = require("@/assets/images/bookmarkIcon.png");
const bookmarkIconActive = require("@/assets/images/bookmarkIconActive.png");
const shareIcon = require("@/assets/images/shareIcon.png");
const flagIcon = require("@/assets/images/flagIcon.png");

export function PostCard({ post, isPlaying, screenHeight, screenWidth }: Props) {
  const [liked, setLiked] = useState(post.liked);
  const [manualPaused, setManualPaused] = useState(false);
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [reasonsVisible, setReasonsVisible] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [foldersVisible, setFoldersVisible] = useState(false);
  const [createVisible, setCreateVisible] = useState(false);
  const [shareVisible, setShareVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [otherVisible, setOtherVisible] = useState(false);

  const { folders, toggleBookmark, getSavedFolderIds, createFolder } = useBookmarksStore();
  const savedFolderIds = getSavedFolderIds(post.id);
  const isBookmarked = savedFolderIds.length > 0;
  
  const { wp, hp } = useScreenDimensions();

  const postImage: string = useMemo(() => {
    switch (post.type) {
      case "image":
        return resolveToString(post.media?.items?.url);
      case "video":
        return resolveToString(post.media?.thumbnailUrl);
      case "text":
        return resolveToString(post.media?.backgroundImage);
      case "carousel":
        return resolveToString(post.media?.items?.[0]?.url);
      default:
        return "";
    }
  }, [post]);

  function resolveToString(source: string | number | undefined): string {
    return typeof source === "string" ? source : "";
  }

  useEffect(() => {
    if (!isPlaying) setManualPaused(false);
  }, [isPlaying]);

  useEffect(() => {
    setExpanded(false);
  }, [post.id]);

  const effectiveIsPlaying = post.type === "video" ? isPlaying && !manualPaused : isPlaying;

  const handleTogglePlay = () => {
    if (post.type === "video") setManualPaused((prev) => !prev);
  };

  const handleLikeFromMedia = () => setLiked(true);

  // Responsive sizing using context helpers
  const avatarSize = Math.min(30, wp(8));
  const iconSize = Math.min(24, wp(6));
  const bottomPadding = hp(4);

  return (
    <YStack height={screenHeight} width="100%" backgroundColor="black">
      <PostMedia
        post={post}
        isPlaying={effectiveIsPlaying}
        onTogglePlay={handleTogglePlay}
        onLike={handleLikeFromMedia}
        screenWidth={screenWidth}
        screenHeight={screenHeight}
      />

      <YStack position="absolute" bottom={bottomPadding} width="100%">
        <XStack padding="$4" alignItems="flex-end">
          <YStack flex={1} gap="$2">
            <XStack gap="$4" alignItems="center" flexWrap="wrap">
              <XStack gap="$2" alignItems="center">
                <Image
                  source={post.author?.avatarUrl ? { uri: post.author.avatarUrl } : require("@/assets/images/profile.png")}
                  width={avatarSize}
                  height={avatarSize}
                  borderRadius={avatarSize / 2}
                />
                <Text color={colors.white} fontSize={Math.min(16, wp(4))} fontFamily="$body" fontWeight="500">
                  {post.author?.name || "Unknown"}
                </Text>
              </XStack>

              <TouchableOpacity
                style={{
                  borderWidth: 1,
                  borderColor: colors.white,
                  height: Math.max(22, hp(3)),
                  borderRadius: 8,
                  paddingHorizontal: Math.min(6, wp(2)),
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text color={colors.white} fontSize={Math.min(13, wp(3.5))} fontFamily="$body" fontWeight="500">
                  following
                </Text>
              </TouchableOpacity>
            </XStack>

            {"caption" in post && post.caption && (
              <XStack maxWidth={`${screenWidth * 0.8}px`} alignItems="flex-end">
                <Text
                  color={colors.white}
                  fontFamily="$body"
                  fontWeight="400"
                  fontSize={Math.min(16, wp(4))}
                  numberOfLines={expanded ? undefined : 3}
                >
                  {post.caption}
                </Text>
                {post.caption.length > 90 && (
                  <Pressable onPress={() => setExpanded((p) => !p)}>
                    <LinearGradient
                      colors={["transparent", "rgba(55, 55, 55, 0.6)"]}
                      style={{ position: "absolute", bottom: 0, height: 24, width: "100%" }}
                    />
                    <Text color={colors.white} fontSize={Math.min(14, wp(3.5))} fontWeight="600" fontFamily="$body">
                      {expanded ? "less" : "more"}
                    </Text>
                  </Pressable>
                )}
              </XStack>
            )}
          </YStack>

          <YStack gap="$4" alignItems="center">
            <Pressable onPress={() => setLiked((p) => !p)}>
              <Image source={liked ? likeIconActive : likeIcon} width={iconSize} height={iconSize} />
            </Pressable>
            <Pressable onPress={() => setCommentsVisible(true)}>
              <Image source={commentIcon} width={iconSize} height={iconSize} />
            </Pressable>
            <Pressable onPress={() => setFoldersVisible(true)}>
              <Image source={isBookmarked ? bookmarkIconActive : bookmarkIcon} width={iconSize} height={iconSize} />
            </Pressable>
            <Pressable onPress={() => setShareVisible(true)}>
              <Image source={shareIcon} width={iconSize} height={iconSize} />
            </Pressable>
            <Pressable onPress={() => setConfirmVisible(true)}>
              <Image source={flagIcon} width={iconSize} height={iconSize} />
            </Pressable>
          </YStack>
        </XStack>
      </YStack>

      <CommentsSheet visible={commentsVisible} onClose={() => setCommentsVisible(false)} />
      <ConfirmReportModal visible={confirmVisible} onClose={() => setConfirmVisible(false)} onConfirm={() => { setConfirmVisible(false); setReasonsVisible(true); }} />
      <ReportReasonsModal visible={reasonsVisible} onClose={() => setReasonsVisible(false)} onSelectReason={() => { setReasonsVisible(false); setSuccessVisible(true); }} onSelectOther={() => { setReasonsVisible(false); setOtherVisible(true); }} />
      <OtherReportModal visible={otherVisible} onClose={() => setOtherVisible(false)} onSubmit={() => { setOtherVisible(false); setSuccessVisible(true); }} />
      <ShareModal visible={shareVisible} onClose={() => setShareVisible(false)} post={post} />
      <SuccessModal visible={successVisible} type="success" onClose={() => setSuccessVisible(false)} autoClose title="Thank you for reporting this post" message="Your feedback is important to us." />
      <BookmarkFoldersModal visible={foldersVisible} folders={folders} savedFolderIds={savedFolderIds} onClose={() => setFoldersVisible(false)} onToggleFolder={(folderId) => toggleBookmark(post.id, folderId)} onCreateNew={() => { setFoldersVisible(false); setCreateVisible(true); }} />
      <CreateFolderModal visible={createVisible} post={post} onClose={() => setCreateVisible(false)} onSave={(name) => { createFolder(name, postImage, post.id); setCreateVisible(false); }} />
    </YStack>
  );
}