import Header from "@/components/layout/header";
import TagSelectorCard from "@/components/post/TagSelectorCard";
import { SimpleButton } from "@/components/ui/centerTextButton";
import CategoryModal from "@/components/ui/modals/CategoryModal";
import ErrorModal from "@/components/ui/modals/ErrorModal";

import colors from "@/constants/colors";
import { useResponsive } from "@/hooks/useResponsive";

import { useCreatePostStore } from "@/store/createPostStore";
import { MediaItem } from "@/types/createPost";
import { ResizeMode } from "expo-av";
import { Trash } from "@tamagui/lucide-icons";
import { Video } from "expo-av";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";

import { useEffect, useState } from "react";
import { FlatList, Image, TextInput, TouchableOpacity } from "react-native";
import { Text, XStack, YStack } from "tamagui";

export default function CreateMediaScreen() {
  const { wp, hp, fs } = useResponsive();

  const { draft, startDraft, setText, setMedia, setCategory } =
    useCreatePostStore();

  const [categoryVisible, setCategoryVisible] = useState(false);
  const [error, setError] = useState("");
  const [errorVisible, setErrorVisible] = useState(false);

  /* =========================
     ENSURE DRAFT EXISTS
  ========================= */

  useEffect(() => {
    if (!draft) {
      startDraft("media", "image"); // ✅ FIXED
    }
  }, []);

  /* =========================
     TYPE NARROWING
  ========================= */

  if (!draft || draft.type !== "media") {
    return null;
  }

  const mediaDraft = draft;

  const mediaItems = mediaDraft.media?.items ?? [];
  const caption = ""; // ❌ no text in media draft anymore

  /* =========================
     PERMISSION
  ========================= */

  async function ensurePermission() {
    const { status } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      setError("Permission required");
      setErrorVisible(true);
      return false;
    }

    return true;
  }

  /* =========================
     NORMALIZE MEDIA
  ========================= */

  function normalizeMedia(
    asset: ImagePicker.ImagePickerAsset
  ): MediaItem {
    return {
      id: asset.assetId ?? asset.uri,
      uri: asset.uri,
      type: asset.type === "video" ? "video" : "image",
    };
  }

  /* =========================
     PICK MEDIA
  ========================= */

  async function pickMedia() {
    const allowed = await ensurePermission();
    if (!allowed) return;

    const existing = mediaItems;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (result.canceled) return;

    const assets = result.assets;

    const video = assets.find((a) => a.type === "video");

    /* VIDEO RULES */

    if (video) {
      if (existing.length > 0) {
        setError("Cannot add video when images exist.");
        setErrorVisible(true);
        return;
      }

      if (assets.length > 1) {
        setError("Only one video allowed");
        setErrorVisible(true);
        return;
      }

      setMedia([normalizeMedia(video)]);
      return;
    }

    /* IMAGE RULES */

    const remainingSlots = 5 - existing.length;

    if (remainingSlots <= 0) {
      setError("Maximum 5 images allowed");
      setErrorVisible(true);
      return;
    }

    const images = assets
      .filter((a) => a.type !== "video")
      .slice(0, remainingSlots)
      .map(normalizeMedia);

    setMedia([...existing, ...images]);
  }

  /* =========================
     REMOVE MEDIA
  ========================= */

  function removeMedia(id: string) {
    setMedia(mediaItems.filter((m) => m.id !== id));
  }

  /* =========================
     RENDER MEDIA
  ========================= */

  function renderMedia({ item }: { item: MediaItem }) {
    return (
      <YStack>
        {item.type === "video" ? (
          <Video
            source={{ uri: item.uri }}
            style={{
              width: wp(40),
              height: wp(45),
              borderRadius: 6,
              marginRight: wp(2),
            }}
            resizeMode={ResizeMode.COVER}
          />
        ) : (
          <Image
            source={{ uri: item.uri }}
            style={{
              width: wp(40),
              height: wp(45),
              borderRadius: 6,
              marginRight: wp(2),
            }}
          />
        )}

        <TouchableOpacity
          onPress={() => removeMedia(item.id)}
          style={{
            position: "absolute",
            top: "40%",
            left: "40%",
          }}
        >
          <Trash color={colors.white} size={24} />
        </TouchableOpacity>
      </YStack>
    );
  }

  /* =========================
     LIMITS
  ========================= */

  const mediaLimitReached =
    mediaItems.length >= 5 ||
    mediaItems.some((m) => m.type === "video");

  /* =========================
     UI
  ========================= */

  return (
    <YStack
      flex={1}
      backgroundColor={colors.white}
      paddingTop={hp(5)}
      paddingHorizontal={wp(6)}
    >
      <Header heading="Add details" />

      <YStack>
        <FlatList
          data={mediaItems}
          renderItem={renderMedia}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ marginTop: hp(2) }}
        />

        <TouchableOpacity
          disabled={mediaLimitReached}
          onPress={pickMedia}
          style={{
            backgroundColor: mediaLimitReached ? "#E5E5E5" : "#F1EFF2",
            paddingVertical: hp(0.7),
            marginTop: hp(2),
            borderRadius: 6,
            alignItems: "center",
            width: wp(40),
          }}
        >
          <Text fontFamily="$body" fontWeight="400" fontSize={fs(12)}>
            Add media
          </Text>
        </TouchableOpacity>

        <Text fontFamily="$body" fontSize={fs(14)} marginVertical={hp(1)}>
          Write a caption
        </Text>

        <TextInput
          multiline
          value={""}
          onChangeText={() => {}}
          maxLength={100}
          style={{
            minHeight: hp(8),
            borderBottomWidth: 1,
            borderColor: "#E5E5E5",
            fontSize: fs(14),
            maxHeight: 80,
          }}
        />
      </YStack>

      <XStack marginTop={hp(3)}>
        <TagSelectorCard
          category={mediaDraft.category}
          onPress={() => setCategoryVisible(true)}
        />
      </XStack>

      <YStack marginTop="auto" marginBottom={hp(4)}>
        <SimpleButton
          text="Preview"
          disabled={mediaItems.length === 0 || !mediaDraft.category?.id}
          textColor={colors.white}
          color={colors.primary}
          onPress={() => router.push("/create/mediaPreview")}
        />
      </YStack>

      <CategoryModal
        visible={categoryVisible}
        onClose={() => setCategoryVisible(false)}
        onSelect={(category) => {
          setCategory(category);
          setCategoryVisible(false);
        }}
      />

      <ErrorModal
        visible={errorVisible}
        message={error}
        onClose={() => setErrorVisible(false)}
      />
    </YStack>
  );
}