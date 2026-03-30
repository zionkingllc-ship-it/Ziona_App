// FULL CLEANED POSTCARD (FIXED MODALS + ACTIONS)

import colors from "@/constants/colors";
import { useResponsiveSize } from "@/hooks/useResponsiveSize";
import { useBookmarksStore } from "@/store/useBookmarkStore";
import { FeedPost } from "@/types/feedTypes";
import { MoreHorizontal } from "@tamagui/lucide-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { Pressable, TouchableOpacity } from "react-native";
import { Image, Text, XStack, YStack } from "tamagui";

import PostMedia from "./postcard/PostMedia";

/* MODALS */
import BookmarkFoldersModal from "../ui/modals/BookmarkFoldersModal";
import ConfirmReportModal from "../ui/modals/ConfirmReportModal";
import CreateFolderModal from "../ui/modals/CreateFolderModal";
import ReportReasonsModal from "../ui/modals/ReportReasonsModal";
import ShareModal from "../ui/modals/ShareModal";
import SuccessModal from "../ui/modals/successModal";
import { CommentsSheet } from "../comments/commentsModal";

/* ICONS */
const likeIcon = require("@/assets/images/likeIcon.png");
const likeIconActive = require("@/assets/images/likeIcon2.png");
const commentIcon = require("@/assets/images/commentIcon.png");
const bookmarkIcon = require("@/assets/images/bookmarkIcon.png");
const bookmarkIconActive = require("@/assets/images/bookmarkIconActive.png");
const shareIcon = require("@/assets/images/shareIcon.png");

type Props = {
  post: FeedPost;
  isPlaying: boolean;
  screenHeight: number;
  onTogglePlay?: () => void;
  screenWidth: number;
  tabBarHeight: number;
};

export function PostCard({
  post,
  isPlaying,
  screenHeight,
  onTogglePlay,
  screenWidth,
  tabBarHeight,
}: Props) {
  const [liked, setLiked] = useState(post.viewerState?.liked ?? false);
  const [expanded, setExpanded] = useState(false);

  const [commentsVisible, setCommentsVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [reasonsVisible, setReasonsVisible] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [foldersVisible, setFoldersVisible] = useState(false);
  const [createVisible, setCreateVisible] = useState(false);
  const [shareVisible, setShareVisible] = useState(false);

  const { folders, toggleBookmark, getSavedFolderIds, createFolder } =
    useBookmarksStore();

  const savedFolderIds = getSavedFolderIds(post.id);
  const isBookmarked = savedFolderIds.length > 0;

  const { getIconSize, getAvatarSize, getFontSize } = useResponsiveSize();

  useEffect(() => {
    setExpanded(false);
  }, [post.id]);

  return (
    <YStack height={screenHeight} width="100%" backgroundColor="black">
      <PostMedia
        post={post}
        isPlaying={isPlaying}
        onTogglePlay={onTogglePlay}
        screenWidth={screenWidth}
        screenHeight={screenHeight}
        tabBarHeight={tabBarHeight}
        onLike={() => setLiked(true)}
      />

      {/* ACTIONS */}
      <YStack position="absolute" bottom={10} width="100%">
        <XStack padding="$4" alignItems="flex-end">
          <YStack flex={1} gap="$2">
            <Text color="white">{post.caption}</Text>
          </YStack>

          <YStack gap="$4">
            <Pressable onPress={() => setLiked((p) => !p)}>
              <Image
                source={liked ? likeIconActive : likeIcon}
                width={24}
                height={24}
              />
            </Pressable>

            <Pressable onPress={() => setCommentsVisible(true)}>
              <Image source={commentIcon} width={24} height={24} />
            </Pressable>

            <Pressable onPress={() => setFoldersVisible(true)}>
              <Image
                source={isBookmarked ? bookmarkIconActive : bookmarkIcon}
                width={24}
                height={24}
              />
            </Pressable>

            <Pressable onPress={() => setShareVisible(true)}>
              <Image source={shareIcon} width={24} height={24} />
            </Pressable>

            <Pressable onPress={() => setConfirmVisible(true)}>
              <MoreHorizontal size={28} color={colors.white} />
            </Pressable>
          </YStack>
        </XStack>
      </YStack>

      {/* MODALS */}
      <CommentsSheet visible={commentsVisible} onClose={() => setCommentsVisible(false)} />

      <ConfirmReportModal
        visible={confirmVisible}
        onClose={() => setConfirmVisible(false)}
        onConfirm={() => {
          setConfirmVisible(false);
          setReasonsVisible(true);
        }}
      />

      <ReportReasonsModal
        visible={reasonsVisible}
        onClose={() => setReasonsVisible(false)}
        onSelectReason={() => {
          setReasonsVisible(false);
          setSuccessVisible(true);
        }}
        onSelectOther={() => {}}
      />

      <ShareModal visible={shareVisible} onClose={() => setShareVisible(false)} post={post} />

      <SuccessModal visible={successVisible} onClose={() => setSuccessVisible(false)} />

      <BookmarkFoldersModal
        visible={foldersVisible}
        folders={folders}
        savedFolderIds={savedFolderIds}
        onClose={() => setFoldersVisible(false)}
        onToggleFolder={(id) => toggleBookmark(post.id, id)}
        onCreateNew={() => {
          setFoldersVisible(false);
          setCreateVisible(true);
        }}
      />

      <CreateFolderModal
        visible={createVisible}
        post={post}
        onClose={() => setCreateVisible(false)}
        onSave={(name) => {
          createFolder(name, "", post.id);
          setCreateVisible(false);
        }}
      />
    </YStack>
  );
}