import Header from "@/components/layout/header";
import TagSelectorCard from "@/components/post/TagSelectorCard";
import { SimpleButton } from "@/components/ui/centerTextButton";
import SuccessModal from "@/components/ui/modals/successModal";

import colors from "@/constants/colors";
import { useResponsive } from "@/hooks/useResponsive";
import { publishMediaPost } from "@/services/graphQL/drafts/mediaDraft";
import { useCreatePostStore } from "@/store/createPostStore";

import { useState } from "react";
import { router } from "expo-router";

import { Image, TouchableOpacity } from "react-native";
import { Text, View, XStack, YStack } from "tamagui";
import { Video, ResizeMode } from "expo-av";

export default function CreateMediaPreviewScreen() {
  const { wp, hp, fs } = useResponsive();
  const { draft } = useCreatePostStore();

  const [uploading, setUploading] = useState(false);

  // ✅ modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<"success" | "failed">("success");
  const [modalMessage, setModalMessage] = useState("");

  if (!draft || draft.type !== "media") return null;

  const mediaDraft = draft;
  const media = mediaDraft.media.items[0];

  const caption = mediaDraft.caption ?? "";

  const canUpload =
    mediaDraft.media.items.length > 0 &&
    !!mediaDraft.category?.id;

  async function handleUpload() {
    if (uploading) return;

    if (!canUpload) {
      setModalType("failed");
      setModalMessage("Add media and category");
      setModalVisible(true);
      return;
    }

    try {
      setUploading(true);
      await publishMediaPost(mediaDraft);

      setModalType("success");
      setModalMessage("Post uploaded successfully");
      setModalVisible(true);

      // navigate after short delay (optional but clean)
      setTimeout(() => {
        router.replace("/(tabs)/create");
      }, 1200);
    } catch (error: any) {
      setModalType("failed");
      setModalMessage(error?.message || "Upload failed");
      setModalVisible(true);
    } finally {
      setUploading(false);
    }
  }

  return (
    <YStack flex={1} backgroundColor={colors.white} paddingTop={hp(5)} paddingHorizontal={wp(6)}>
      <Header heading="Preview" />

      <View
        style={{
          width: "100%",
          height: hp(55),
          borderRadius: 10,
          overflow: "hidden",
          marginTop: hp(2),
        }}
      >
        {media?.type === "image" && (
          <Image
            source={{ uri: media.uri }}
            style={{ width: "100%", height: "100%" }}
          />
        )}

        {media?.type === "video" && (
          <Video
            source={{ uri: media.uri }}
            style={{ width: "100%", height: "100%" }}
            resizeMode={ResizeMode.COVER}
            useNativeControls
          />
        )}

        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            position: "absolute",
            top: 14,
            left: 14,
            backgroundColor: "#00000088",
            width: 26,
            height: 26,
            borderRadius: 13,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text color="white">✕</Text>
        </TouchableOpacity>

        <XStack position="absolute" bottom={14} left={14} right={60}>
          <YStack>
            <Text color="white">Zion</Text>
            <Text color="white">{caption}</Text>
          </YStack>
        </XStack>
      </View>

      <XStack justifyContent="center" marginTop={hp(5)}>
        <TagSelectorCard category={mediaDraft.category} onPress={() => {}} />
      </XStack>

      <YStack marginTop={hp(3)}>
        <SimpleButton
          text={uploading ? "Uploading..." : "Upload"}
          disabled={!canUpload || uploading}
          onPress={handleUpload}
        />
      </YStack>

      {/* ✅ MODAL */}
      <SuccessModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title={modalType === "success" ? "Success" : "Failed"}
        message={modalMessage}
        type={modalType}
        autoClose
      />
    </YStack>
  );
}