import colors from "@/constants/colors";
import { useBookmarksStore } from "@/store/useBookmarkStore";
import { Post } from "@/types/post";
import React, { useEffect, useMemo, useState } from "react";
import { Pressable, TouchableOpacity } from "react-native";
import { Image, Text, XStack, YStack } from "tamagui";
import { CommentsSheet } from "../comments/commentsModal";

import { LinearGradient } from "expo-linear-gradient";
import BookmarkFoldersModal from "../ui/modals/BookmarkFoldersModal";
import ConfirmReportModal from "../ui/modals/ConfirmReportModal";
import CreateFolderModal from "../ui/modals/CreateFolderModal";
import ReportReasonsModal from "../ui/modals/ReportReasonsModal";
import ShareModal from "../ui/modals/ShareModal";
import SuccessModal from "../ui/modals/successModal";
import PostMedia from "./postcard/PostMedia";

type Props = {
  post: Post;
  isPlaying: boolean;
  screenHeight: number;
};

const likeIcon = require("@/assets/images/likeIcon.png");
const likeIconActive = require("@/assets/images/likeIcon2.png");
const commentIcon = require("@/assets/images/commentIcon.png");
const bookmarkIcon = require("@/assets/images/bookmarkIcon.png");
const bookmarkIconActive = require("@/assets/images/bookmarkIconActive.png"); // add filled version
const shareIcon = require("@/assets/images/shareIcon.png");
const flagIcon = require("@/assets/images/flagIcon.png");

export function PostCard({ post, isPlaying, screenHeight }: Props) {
  /* ================= STATE ================= */

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

  const { folders, toggleBookmark, getSavedFolderIds, createFolder } =
    useBookmarksStore();

  const savedFolderIds = getSavedFolderIds(post.id);
  const isBookmarked = savedFolderIds.length > 0;

  /* ================= DERIVED ================= */

  const postImage: string = useMemo(() => {
    switch (post.type) {
      case "image":
        return resolveToString(post.media.url);

      case "video":
        return resolveToString(post.media.thumbnailUrl);

      case "text":
        return resolveToString(post.media?.backgroundImage);

      case "carousel":
        return resolveToString(post.media.items[0]?.url);

      default:
        return "";
    }
  }, [post]);

  function resolveToString(source: string | number | undefined): string {
    return typeof source === "string" ? source : "";
  }
  /* ================= SYNC LOGIC ================= */

  useEffect(() => {
    if (!isPlaying) {
      setManualPaused(false);
    }
  }, [isPlaying]);

  useEffect(() => {
    setExpanded(false);
  }, [post.id]);

  const effectiveIsPlaying =
    post.type === "video" ? isPlaying && !manualPaused : isPlaying;

  /* ================= HANDLERS ================= */

  const handleTogglePlay = () => {
    if (post.type === "video") {
      setManualPaused((prev) => !prev);
    }
  };

  const handleLikeFromMedia = () => {
    setLiked(true);
  };

  return (
    <YStack height={screenHeight} width="100%" backgroundColor="black">
      {/* MEDIA */}
      <PostMedia
        post={post}
        isPlaying={effectiveIsPlaying}
        onTogglePlay={handleTogglePlay}
        onLike={handleLikeFromMedia}
      />

      {/* OVERLAY */}
      <YStack position="absolute" bottom={34} width="100%">
        <XStack padding="$4" alignItems="flex-end">
          <YStack flex={1} gap="$2">
            <XStack gap="$4" alignItems="center">
              <XStack gap="$2" alignItems="center">
                <Image
                  source={
                    post.author.avatarUrl
                      ? post.author.avatarUrl
                      : require("@/assets/images/profile.png")
                  }
                  width={30}
                  height={30}
                />
                <Text color={colors.white} fontSize={16} fontWeight="500">
                  {post.author.name}
                </Text>
              </XStack>

              <TouchableOpacity
                style={{
                  borderWidth: 1,
                  borderColor: colors.white,
                  height: 22,
                  borderRadius: 8,
                  paddingHorizontal: 6,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text color={colors.white} fontSize={13} fontWeight="500">
                  following
                </Text>
              </TouchableOpacity>
            </XStack>

            {"caption" in post && post.caption && (
              <XStack maxWidth="80%" alignItems="flex-end">
                <Text
                  color={colors.white}
                  fontSize={16}
                  numberOfLines={expanded ? undefined : 3}
                >
                  {post.caption}
                </Text>

                {post.caption.length > 90 && (
                  <Pressable onPress={() => setExpanded((p) => !p)}>
                    <LinearGradient
                      colors={["transparent", "rgba(55, 55, 55, 0.6)"]}
                      style={{
                        position: "absolute",
                        bottom: 0,
                        height: 24,
                        width: "100%",
                      }}
                    />
                    <Text
                      color={colors.white}
                      fontSize={14}
                      fontWeight="600"
                      alignSelf="flex-end"
                    >
                      {expanded ? "less" : "more"}
                    </Text>
                  </Pressable>
                )}
              </XStack>
            )}
          </YStack>

          <YStack gap="$4" alignItems="center">
            {/* LIKE */}
            <Pressable onPress={() => setLiked((p) => !p)}>
              <Image
                source={liked ? likeIconActive : likeIcon}
                width={24}
                height={24}
              />
            </Pressable>

            {/* COMMENT */}
            <Pressable onPress={() => setCommentsVisible(true)}>
              <Image source={commentIcon} width={24} height={24} />
            </Pressable>

            {/* BOOKMARK */}
            <Pressable onPress={() => setFoldersVisible(true)}>
              <Image
                source={isBookmarked ? bookmarkIconActive : bookmarkIcon}
                width={24}
                height={24}
              />
            </Pressable>

            {/* SHARE */}
            <Pressable onPress={() => setShareVisible(true)}>
              <Image source={shareIcon} width={24} height={24} />
            </Pressable>

            {/* REPORT */}
            <Pressable onPress={() => setConfirmVisible(true)}>
              <Image source={flagIcon} width={24} height={24} />
            </Pressable>
          </YStack>
        </XStack>
      </YStack>

      {/* MODALS */}
      <CommentsSheet
        visible={commentsVisible}
        onClose={() => setCommentsVisible(false)}
      />

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
      />
      <ShareModal
        visible={shareVisible}
        onClose={() => setShareVisible(false)}
        post={post}
      />
      <SuccessModal
        visible={successVisible}
        iconImage={require("@/assets/images/xCircle.png")}
        onClose={() => setSuccessVisible(false)}
        autoClose
        title="Thank you for reporting this post"
        message="Your feedback is important to us. While we review this content, you won’t see this user’s posts again."
      />

      <BookmarkFoldersModal
        visible={foldersVisible}
        folders={folders}
        savedFolderIds={savedFolderIds}
        onClose={() => setFoldersVisible(false)}
        onToggleFolder={(folderId) => toggleBookmark(post.id, folderId)}
        onCreateNew={() => {
          setFoldersVisible(false);
          setCreateVisible(true);
        }}
      />

      <CreateFolderModal
        visible={createVisible}
        coverImage={postImage}
        onClose={() => setCreateVisible(false)}
        onSave={(name) => {
          createFolder(name, postImage, post.id);
          setCreateVisible(false);
        }}
      />
    </YStack>
  );
}
