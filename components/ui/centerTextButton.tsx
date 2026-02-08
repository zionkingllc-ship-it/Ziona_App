import { ReactNode } from "react";
import { Button, XStack, Text, View } from "tamagui";
import { StyleProp, ViewStyle } from "react-native";
import colors from "@/constants/colors";
import { FontProps } from "react-native-svg";
import { Font } from "@tamagui/core";

type AppButtonProps = {
  text: string;
  textColor?: string;
  color?: string;
  onPress?: () => void;
  textSize?: any;
  textWeight?: any; 
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function SimpleButton({
  text,
  textColor,
  textSize = "$4",
  textWeight = "600",
  onPress,
  color, 
  disabled = false,
  style,
}: AppButtonProps) {
  return (
    <Button
      onPress={onPress}
      disabled={disabled}
      style={style}
      backgroundColor={disabled ? colors.inactiveButton : color}
      borderWidth={1}
      borderColor="$gray5"
      pressStyle={{ opacity: 0.85 }}
    >
      <XStack width={"100%"}  gap={"$10"} justifyContent="center">
        <Text
          color={textColor ? textColor : "black"}
          alignSelf="center"
          textAlign="center"
          fontSize={textSize}
          fontWeight={textWeight}
        >
          {text}
        </Text>
      </XStack>
    </Button>
  );
}
