import { router } from "expo-router";
import { FlatList } from "react-native";
import { YStack, Button, Text } from "tamagui";

import { useCreatePostStore } from "@/store/createPostStore";
import { useBibleTranslations } from "@/hooks/useBibleTranslations";

export default function TranslationScreen() {
  const { data, loading } = useBibleTranslations();
  const { updateDraft } = useCreatePostStore();

  if (loading) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center">
        <Text>Loading translations...</Text>
      </YStack>
    );
  }

  return (
    <YStack flex={1} padding={20} gap="$3">
      <Text fontSize={20} fontWeight="600">
        Choose Translation
      </Text>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Button
            onPress={() => {
              updateDraft({
                bibleVerse: {
                  translation: item.id,
                  book: "",
                  chapter: 0,
                  verses: [],
                  text: "",
                },
              });

              router.push("/create/bible/books");
            }}
          >
            {item.name}
          </Button>
        )}
      />
    </YStack>
  );
}