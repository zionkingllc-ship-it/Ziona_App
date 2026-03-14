import Header from "@/components/layout/header";
import TagSelectorCard from "@/components/post/TagSelectorCard";
import TextPostCardInput from "@/components/post/TextPostCardInput";
import { SimpleButton } from "@/components/ui/centerTextButton";
import BibleSelectorModal from "@/components/ui/modals/BibleSelectorModal";
import CategoryModal from "@/components/ui/modals/CategoryModal";
import colors from "@/constants/colors";
import {
  MOCK_BOOKS,
  MOCK_CHAPTERS,
  MOCK_TRANSLATIONS,
  MOCK_VERSES,
} from "@/constants/mockBible";
import { useResponsive } from "@/hooks/useResponsive";
import { useCreatePostStore } from "@/store/createPostStore";

import { useState } from "react";
import { Image, ScrollView, TouchableOpacity } from "react-native";
import { Text, XStack, YStack } from "tamagui";

export default function CreateTextScreen() {
  const { wp, hp, fs } = useResponsive();

  const { draft, updateDraft } = useCreatePostStore();

  const [categoryVisible, setCategoryVisible] = useState(false);
  const [bibleVisible, setBibleVisible] = useState(false);

  const translation = draft?.bibleVerse?.translation || "";
  const book = draft?.bibleVerse?.book || "";
  const chapter = draft?.bibleVerse?.chapter || 0;

  const verseText = draft?.bibleVerse?.text;

  const cardColor = draft?.category?.bgColor ?? "#E6E2C5";
  const selectedCategory = draft?.category;

  const tagIcon =
    selectedCategory?.icon ?? require("@/assets/images/tagIcon.png");

  const tagTitle = selectedCategory?.label ?? "Select a tag";

  const tagSubtitle = selectedCategory ? "Tap to change" : "Choose a category";

  return (
    <YStack
      style={{ flex: 1, backgroundColor: colors.white, paddingTop: hp(5) }}
    >
      <Header heading="Create Post" />
      <ScrollView style={{ flex: 1 }}>
        <YStack flex={1} paddingHorizontal={wp(6)} paddingTop={hp(2)}>
          {/* TEXT CARD */}

          <TextPostCardInput
            category={draft?.category?.label}
            scripture={
              book && chapter
                ? `${book} ${chapter}:${draft?.bibleVerse?.verses?.[0] ?? ""}`
                : undefined
            }
            translation={translation}
            verseText={verseText}
            value={draft?.text ?? ""}
            onChangeText={(text: string) =>
              updateDraft({
                text,
              })
            }
            backgroundColor={cardColor}
          />

          {/* ACTION CARDS */}

          <XStack flex={1} marginTop={hp(7)} marginBottom={hp(4)} gap={wp(3)}>
            <TagSelectorCard
              category={draft?.category}
              onPress={() => setCategoryVisible(true)}
            />

            {/* BIBLE VERSE */}
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

              <Text fontFamily={"$body"} fontSize={fs(14)} fontWeight="500">
                Bible verse
              </Text>

              <Text fontFamily={"$body"} fontSize={fs(11)} color="#8A7F87">
                Choose a verse
              </Text>
            </TouchableOpacity>
          </XStack>

          {/* NEXT BUTTON */}

          <SimpleButton
            text="Next"
            textColor={colors.buttonText}
            color={colors.primary}
            onPress={() => {}}
          />

          {/* CATEGORY MODAL */}

          <CategoryModal
            visible={categoryVisible}
            onClose={() => setCategoryVisible(false)}
            onSelect={(category) => {
              updateDraft({
                category,
              });

              setCategoryVisible(false);
            }}
          />

          {/* BIBLE SELECTOR MODAL */}

          <BibleSelectorModal
            visible={bibleVisible}
            translations={MOCK_TRANSLATIONS}
            books={MOCK_BOOKS}
            chapters={MOCK_CHAPTERS}
            verses={MOCK_VERSES}
            onClose={() => setBibleVisible(false)}
            onDone={(data) => updateDraft({ bibleVerse: data })}
          />
        </YStack>
      </ScrollView>
    </YStack>
  );
}
