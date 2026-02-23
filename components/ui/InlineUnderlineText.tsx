// components/ui/InlineUnderlineText.tsx
import { Text, XStack, YStack } from "tamagui";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  color: string;
  thickness?: number;
  offset?: number;
  weight?: any;
  fontFamily?: any;
};

export function InlineUnderlineText({
  children,
  color,
  thickness = 2,
  offset = 2,
  weight = "500",
  fontFamily = "$body",
}: Props) {
  return (
    <YStack alignSelf="flex-start">
      <Text
        color={color}
        fontWeight={weight}
        fontFamily={fontFamily}
      >
        {children}
      </Text>

      <YStack
        height={thickness}
        backgroundColor={color}
        borderRadius={thickness}
        marginTop={offset}
      />
    </YStack>
  );
}     