import { useCreatePostStore } from "@/store/createPostStore";
import { YStack, Text } from "tamagui";

export default function PreviewScreen() {
  const { draft } = useCreatePostStore();

  if (!draft) return null;

  return (
    <YStack flex={1} padding={20} gap="$3">

      {draft.text && <Text>{draft.text}</Text>}

      {draft.bibleVerse && (
        <Text>
          {draft.bibleVerse.book} {draft.bibleVerse.chapter}
        </Text>
      )}

    </YStack>
  );
}