import { router } from "expo-router";
import { FlatList } from "react-native";
import { YStack, Text, Button } from "tamagui";

import { useCreatePostStore } from "@/store/createPostStore";
import { useBibleChapters } from "@/hooks/useBibleChapters";

export default function ChapterScreen() {
  const { draft, updateDraft } = useCreatePostStore();

  const book = draft?.bibleVerse?.book;

  const { chapters, loading } = useBibleChapters(book || "");

  if (!book) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center">
        <Text>No book selected</Text>
      </YStack>
    );
  }

  if (loading) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center">
        <Text>Loading chapters...</Text>
      </YStack>
    );
  }

  return (
    <YStack flex={1} padding={20}>
      <Text fontSize={20} fontWeight="600" marginBottom={10}>
        Chapter
      </Text>

      <FlatList
        data={Array.from({ length: chapters }, (_, i) => i + 1)}
        numColumns={7}
        keyExtractor={(item) => item.toString()}
        renderItem={({ item }) => (
          <Button
            width={45}
            height={45}
            margin={4}
            onPress={() => {
              updateDraft({
                bibleVerse: {
                  ...draft?.bibleVerse!,
                  chapter: item,
                },
              });

              router.push("/create/bible/verse");
            }}
          >
            {item}
          </Button>
        )}
      />
    </YStack>
  );
}