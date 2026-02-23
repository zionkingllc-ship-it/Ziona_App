import colors from "@/constants/colors";
import { Stack } from "expo-router";
import { useState } from "react";
import { Button, Text, TextArea, YStack } from "tamagui";

export default function EditBioScreen() {
  const [bio, setBio] = useState("");

  return (
    <>
      <Stack.Screen options={{ headerTitle: "Bio" }} />

      <YStack flex={1} backgroundColor={colors.white} padding="$4" gap="$4">
        <Text>You can update your bio at any time.</Text>

        <TextArea value={bio} onChangeText={setBio} height={120} />

        <Button theme="purple" marginTop="auto">
          Save
        </Button>
      </YStack>
    </>
  );
}
