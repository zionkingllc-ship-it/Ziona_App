import Header from "@/components/layout/header";
import TagSelectorCard from "@/components/post/TagSelectorCard";
import TextPostCardInput from "@/components/post/TextPostCardInput";
import { SimpleButton } from "@/components/ui/centerTextButton";
import BibleSelectorModal from "@/components/ui/modals/BibleSelectorModal";
import CategoryModal from "@/components/ui/modals/CategoryModal";
import SuccessModal from "@/components/ui/modals/successModal";
import colors from "@/constants/colors";

import { useResponsive } from "@/hooks/useResponsive";

import { publishDraftPost } from "@/services/graphQL/publishDraftPost";

import { useCreatePostStore } from "@/store/createPostStore";

import { router } from "expo-router";

import { useEffect, useRef, useState } from "react";

import { Alert, Image, ScrollView, TouchableOpacity } from "react-native";

import { Text, XStack, YStack } from "tamagui";

/* =========================
   HELPER
========================= */

function buildReference(book: string, chapter: number, verses: number[]) {
  const sorted = [...verses].sort((a, b) => a - b);

  if (!sorted.length) return "";

  if (sorted.length === 1) {
    return `${book} ${chapter}:${sorted[0]}`;
  }

  return `${book} ${chapter}:${sorted[0]}-${sorted[sorted.length - 1]}`;
}

export default function CreateTextScreen() {
  const { wp, hp, fs } = useResponsive();

  const {
    draft,
    startDraft,
    setText,
    setCategory,
    setBibleVerse,
  } = useCreatePostStore();

  const [categoryVisible, setCategoryVisible] = useState(false);
  const [bibleVisible, setBibleVisible] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [limitModal, setLimitModal] = useState(false);
  const [limitMessage, setLimitMessage] = useState("");
  const uploadLock = useRef(false);

  /* =========================
     ENSURE DRAFT EXISTS
  ========================= */

  useEffect(() => {
    if (!draft) {
      startDraft("text"); // ✅ CRITICAL FIX
    }
  }, []);

  /* =========================
     TYPE SAFETY
  ========================= */

  if (!draft || (draft.type !== "text" && draft.type !== "bible")) {
    return null;
  }

  const isBible = draft.type === "bible";

  /* =========================
     DERIVED DATA
  ========================= */

  const translation =
    isBible && draft.bibleVerse ? draft.bibleVerse.translation : "";

  const book =
    isBible && draft.bibleVerse ? draft.bibleVerse.book : "";

  const chapter =
    isBible && draft.bibleVerse ? draft.bibleVerse.chapter : 0;

  const verses =
    isBible && draft.bibleVerse ? draft.bibleVerse.verses : [];

  const verseText = isBible ? draft.bibleVerse?.text : undefined;

  const reference =
    book && chapter && verses.length
      ? buildReference(book, chapter, verses)
      : "";

  const cardColor = draft.category?.bgColor ?? "#E6E2C5";

  const textValue = draft.type === "text" ? draft.text : "";
  const hasText = textValue.trim().length > 0;

  /* =========================
     VALIDATION
  ========================= */

  const canUpload =
    !!draft.category?.id &&
    ((draft.type === "text" && hasText) ||
      (draft.type === "bible" && !!draft.bibleVerse));

  /* =========================
     POST HANDLER
  ========================= */

  async function handleUpload() {
    if (!canUpload) return;
    if (uploadLock.current) return;

    uploadLock.current = true;

    try {
      setUploading(true);

      await publishDraftPost(draft);

      router.replace("/(tabs)/home");
    } catch (error: any) {
      Alert.alert("Upload failed", error?.message || "Something went wrong");
    } finally {
      setUploading(false);
      uploadLock.current = false;
    }
  }

  return (
    <YStack
      style={{ flex: 1, backgroundColor: colors.white, paddingTop: hp(5) }}
    >
      <XStack marginLeft={wp(4)}>
        <Header heading="Create Post" />
      </XStack>

      <ScrollView style={{ flex: 1 }}>
        <YStack flex={1} paddingHorizontal={wp(6)} paddingTop={hp(2)}>
          <TextPostCardInput
            category={draft.category?.label}
            scripture={reference || undefined}
            translation={translation}
            verseText={verseText}
            value={textValue}
            onChangeText={setText}
            backgroundColor={cardColor}
          />

          <XStack flex={1} marginTop={hp(7)} marginBottom={hp(4)} gap={wp(3)}>
            <TagSelectorCard
              category={draft.category}
              onPress={() => setCategoryVisible(true)}
            />

            <TouchableOpacity
              style={{
                flex: 0.4,
                backgroundColor: "#F4F3F4",
                borderRadius: wp(2),
                paddingVertical: hp(2),
                alignItems: "center",
              }}
              onPress={() => setBibleVisible(true)}
            >
              <Image
                source={require("@/assets/images/bibleIcon2.png")}
                style={{
                  width: wp(6),
                  height: wp(6),
                  marginBottom: hp(1),
                }}
              />

              <Text fontSize={fs(14)} fontWeight="500">
                Bible verse
              </Text>

              <Text fontSize={fs(11)} color="#8A7F87">
                {reference ? "Change verse" : "Choose a verse"}
              </Text>
            </TouchableOpacity>
          </XStack>

          <SimpleButton
            text={uploading ? "Uploading..." : "Post"}
            textColor={colors.buttonText}
            color={colors.primary}
            disabled={uploading || !canUpload}
            onPress={handleUpload}
          />

          <CategoryModal
            visible={categoryVisible}
            onClose={() => setCategoryVisible(false)}
            onSelect={(category) => {
              setCategory(category);
              setCategoryVisible(false);
            }}
          />

          <BibleSelectorModal
            visible={bibleVisible}
            onClose={() => setBibleVisible(false)}
            onDone={(data) => {
              setBibleVerse(data);
              setBibleVisible(false);
            }}
          />

          <SuccessModal
            visible={limitModal}
            onClose={() => setLimitModal(false)}
            title="Limit exceeded"
            message={limitMessage}
            type="warning"
            autoClose
          />
        </YStack>
      </ScrollView>
    </YStack>
  );
}