import { DISCOVER_CATEGORIES } from "@/constants/discoverCategories";
import { useCreatePostStore } from "@/store/createPostStore";
import { YStack, Button } from "tamagui";

export default function SelectTagScreen() {
  const { updateDraft } = useCreatePostStore();

  return (
    <YStack flex={1} padding={20} gap="$2">

      {DISCOVER_CATEGORIES.map((cat) => (
        <Button
          key={cat.slug}
          onPress={() =>
            updateDraft({
              category: cat.slug as any,
            })
          }
        >
          {cat.label}
        </Button>
      ))}

    </YStack>
  );
}