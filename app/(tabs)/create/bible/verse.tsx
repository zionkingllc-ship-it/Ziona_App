import { router } from "expo-router";
import { FlatList, Pressable } from "react-native";
import { YStack, Text, Button } from "tamagui";

import { useCreatePostStore } from "@/store/createPostStore";
import { useBibleVerses } from "@/hooks/useBibleVerses";

export default function VerseScreen() {
  const { draft, updateDraft } = useCreatePostStore();

  const translation = draft?.bibleVerse?.translation;
  const book = draft?.bibleVerse?.book;
  const chapter = draft?.bibleVerse?.chapter;

  const { verses, loading } = useBibleVerses(
    translation || "",
    book || "",
    chapter || 0
  );

  const selected = draft?.bibleVerse?.verses || [];

  if (loading) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center">
        <Text>Loading verses...</Text>
      </YStack>
    );
  }

  function toggleVerse(number: number, text: string) {
    let newSelection: number[];

    if (selected.includes(number)) {
      newSelection = selected.filter((v) => v !== number);
    } else {
      newSelection = [...selected, number];
    }

    const selectedTexts = verses
      .filter((v) => newSelection.includes(v.number))
      .map((v) => v.text)
      .join(" ");

    updateDraft({
      bibleVerse: {
        ...draft?.bibleVerse!,
        verses: newSelection,
        text: selectedTexts,
      },
    });
  }

  return (
    <YStack flex={1} padding={20}>
      <Text fontSize={20} fontWeight="600" marginBottom={10}>
        Select Verses
      </Text>

      <FlatList
        data={verses}
        keyExtractor={(item) => item.number.toString()}
        renderItem={({ item }) => {
          const active = selected.includes(item.number);

          return (
            <Pressable
              onPress={() => toggleVerse(item.number, item.text)}
              style={{
                padding: 12,
                marginBottom: 8,
                borderRadius: 8,
                backgroundColor: active ? "#181419" : "#f0f0f0",
              }}
            >
              <Text color={active ? "white" : "black"}>
                {item.number}. {item.text}
              </Text>
            </Pressable>
          );
        }}
      />

      <Button
        marginTop={10}
        onPress={() => {
          router.push("/create/text");
        }}
      >
        Add Verse
      </Button>
    </YStack>
  );
}