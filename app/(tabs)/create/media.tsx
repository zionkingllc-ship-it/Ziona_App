import { useCreatePostStore } from "@/store/createPostStore";
import { YStack, TextArea } from "tamagui";

export default function CreateMediaScreen() {
  const { draft, updateDraft } = useCreatePostStore();

  return (
    <YStack flex={1} padding={20} gap="$3">

      {/* media preview */}

      <TextArea
        placeholder="Write a caption..."
        value={draft?.text}
        onChangeText={(text) =>
          updateDraft({
            text,
          })
        }
      />

    </YStack>
  );
}