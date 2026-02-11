import colors from "@/constants/colors";
import { ChevronLeft } from "@tamagui/lucide-icons";
import { router } from "expo-router";
import React from "react";
import { XStack } from "tamagui";

export default function Header() {
  return (
    <XStack width={"100%"}>
      <ChevronLeft
        size={24}
        marginLeft={15}
        marginTop={5}
        color={colors.black}
        onPress={() => router.back()}
      />
    </XStack>
  );
}
