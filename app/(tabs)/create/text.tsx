import Header from "@/components/layout/header";
import TextPostCardInput from "@/components/post/TextPostCardInput";
import { SimpleButton } from "@/components/ui/centerTextButton";
import BibleBookModal from "@/components/ui/modals/BibleBookModal";
import BibleChapterModal from "@/components/ui/modals/BibleChapterModal";
import BibleTranslationModal from "@/components/ui/modals/BibleTranslationModal";
import BibleVerseModal from "@/components/ui/modals/BibleVerseModal";
import colors from "@/constants/colors";
import { useBibleChapters } from "@/hooks/useBibleChapters";
import { useBibleVerses } from "@/hooks/useBibleVerses";
import { useResponsive } from "@/hooks/useResponsive";
import { useCreatePostStore } from "@/store/createPostStore";
import { useState } from "react";
import { Image, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, XStack, YStack } from "tamagui";

export default function CreateTextScreen() {
  const { wp, hp, fs } = useResponsive();

  const { draft, updateDraft } = useCreatePostStore();

  const [translationVisible, setTranslationVisible] = useState(false);
  const [bookVisible, setBookVisible] = useState(false);
  const [chapterVisible, setChapterVisible] = useState(false);
  const [verseVisible, setVerseVisible] = useState(false);

  const translation = draft?.bibleVerse?.translation || "";
  const book = draft?.bibleVerse?.book || "";
  const chapter = draft?.bibleVerse?.chapter || 0;

  const { chapters } = useBibleChapters(book);
  const { verses } = useBibleVerses(translation, book, chapter);

  const verseText = draft?.bibleVerse?.text;

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.white, paddingTop: hp(2) }}
    >
      <Header heading="Create Post" />
      <ScrollView style={{ flex: 1 }}>
        <YStack flex={1} paddingHorizontal={wp(6)} paddingVertical={hp(2)}>
          {/* TEXT CARD */}

          <TextPostCardInput
            category={draft?.category}
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
            backgroundColor="#E6E2C5"
          />

          {/*ACTION CARDS*/}

          <XStack flex={1} marginTop={hp(7)} marginBottom={hp(4)} gap={wp(3)}>
            {/* TAG */}

            <TouchableOpacity
              style={{
                flex: 0.4,
                backgroundColor: "#F4F3F4",
                borderRadius: wp(2),
                paddingVertical: hp(2),
                alignItems: "center",
              }}
            >
              <Image
                source={require("@/assets/images/tagIcon.png")}
                style={{
                  width: wp(6),
                  height: wp(6),
                  marginBottom: hp(1),
                }}
              />

              <Text fontSize={fs(14)} fontWeight="500">
                Select a tag
              </Text>

              <Text fontSize={fs(11)} color="#8A7F87">
                Choose a category
              </Text>
            </TouchableOpacity>

            {/* BIBLE VERSE */}

            <TouchableOpacity
              style={{
                flex: 0.4,
                backgroundColor: "#F4F3F4",
                borderRadius: wp(2),
                paddingVertical: hp(2),
                alignItems: "center",
              }}
              onPress={() => setTranslationVisible(true)}
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
                Choose a category
              </Text>
            </TouchableOpacity>
          </XStack>

          {/* NEXT BUTTON */}
          <SimpleButton
            text="Next"
            textColor={colors.white}
            color={colors.primary}
            onPress={() => {}}
            // disabled={verseText?.length? > 3 || draft}
            //loading
          />

          {/* MODALS */}

          <BibleTranslationModal
            visible={translationVisible}
            onClose={() => setTranslationVisible(false)}
            onSelect={(t) => {
              updateDraft({
                bibleVerse: {
                  translation: t,
                  book: "",
                  chapter: 0,
                  verses: [],
                  text: "",
                },
              });

              setTranslationVisible(false);
              setBookVisible(true);
            }}
          />

          <BibleBookModal
            visible={bookVisible}
            onClose={() => setBookVisible(false)}
            onSelect={(b) => {
              updateDraft({
                bibleVerse: {
                  ...draft?.bibleVerse!,
                  book: b,
                },
              });

              setBookVisible(false);
              setChapterVisible(true);
            }}
          />

          <BibleChapterModal
            visible={chapterVisible}
            chapters={chapters}
            onClose={() => setChapterVisible(false)}
            onSelect={(c) => {
              updateDraft({
                bibleVerse: {
                  ...draft?.bibleVerse!,
                  chapter: c,
                },
              });

              setChapterVisible(false);
              setVerseVisible(true);
            }}
          />

          <BibleVerseModal
            visible={verseVisible}
            verses={verses}
            onClose={() => setVerseVisible(false)}
            onDone={(numbers, text) => {
              updateDraft({
                bibleVerse: {
                  ...draft?.bibleVerse!,
                  verses: numbers,
                  text,
                },
              });

              setVerseVisible(false);
            }}
          />
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}
