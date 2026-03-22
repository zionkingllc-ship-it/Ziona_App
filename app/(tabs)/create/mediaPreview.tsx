import Header from "@/components/layout/header";
import TagSelectorCard from "@/components/post/TagSelectorCard";
import { SimpleButton } from "@/components/ui/centerTextButton";

import colors from "@/constants/colors";

import { useResponsive } from "@/hooks/useResponsive";
import { publishDraftPost } from "@/services/graphQL/publishDraftPost";
import { useCreatePostStore } from "@/store/createPostStore";

import { useState } from "react";
import { router } from "expo-router";

import { Image, TouchableOpacity, Alert } from "react-native";

import { Text, View, XStack, YStack } from "tamagui";

import { Video, ResizeMode } from "expo-av";

export default function CreateMediaPreviewScreen() {
  const { wp, hp, fs } = useResponsive();

  const { draft } = useCreatePostStore();

  const [uploading, setUploading] = useState(false);

  /* =========================
     TYPE SAFETY
  ========================= */

  if (!draft || draft.type !== "media") {
    return null;
  }

  const mediaDraft = draft;

  const mediaItems = mediaDraft.media.items;
  const media = mediaItems[0];

  const caption = ""; // no caption stored in media draft

  /* =========================
     VALIDATION
  ========================= */

  const canUpload =
    mediaItems.length > 0 && !!mediaDraft.category?.id;

  /* =========================
     HANDLE UPLOAD
  ========================= */

  async function handleUpload() {
    if (uploading) return;

    if (!canUpload) {
      Alert.alert("Missing info", "Add media and category");
      return;
    }

    try {
      setUploading(true);

      await publishDraftPost(mediaDraft);

      Alert.alert("Success", "Post uploaded successfully");

      router.replace("/(tabs)/home");
    } catch (error: any) {
      Alert.alert("Upload Failed", error?.message || "Something went wrong");
    } finally {
      setUploading(false);
    }
  }

  return (
    <YStack
      flex={1}
      backgroundColor={colors.white}
      paddingTop={hp(5)}
      paddingHorizontal={wp(6)}
    >
      <Header heading="Preview" />

      <View
        style={{
          width: "100%",
          height: hp(55),
          borderRadius: 10,
          overflow: "hidden",
          marginTop: hp(2),
          backgroundColor: "#EEE",
        }}
      >
        {media?.type === "image" && (
          <Image
            source={{ uri: media.uri }}
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        )}

        {media?.type === "video" && (
          <Video
            source={{ uri: media.uri }}
            style={{
              width: "100%",
              height: "100%",
            }}
            resizeMode={ResizeMode.COVER}
            shouldPlay={false}
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

        <XStack
          position="absolute"
          bottom={14}
          left={14}
          right={60}
          gap="$2"
          alignItems="center"
        >
          <View
            style={{
              width: 34,
              height: 34,
              borderRadius: 20,
              backgroundColor: "#FF5722",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text color="white" fontWeight="700">
              M
            </Text>
          </View>

          <YStack flex={1}>
            <Text fontWeight="600" color="white">
              Zion
            </Text>
            <Text fontSize={fs(13)} color="white">
              {caption}
            </Text>
          </YStack>
        </XStack>
      </View>

      <XStack justifyContent="center" marginTop={hp(5)}>
        <TagSelectorCard category={mediaDraft.category} onPress={() => {}} />
      </XStack>

      <YStack marginTop={hp(3)}>
        <SimpleButton
          text={uploading ? "Uploading..." : "Upload"}
          textColor={colors.white}
          color={colors.primary}
          disabled={!canUpload || uploading}
          onPress={handleUpload}
        />
      </YStack>
    </YStack>
  );
}