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
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  textSize?: any;
  textWeight?: any;
  /** Size applied to icon container */
  iconSize?: number;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function PrimaryButton({
  text,
  textColor,
  textSize = "$4",
  textWeight = "600",
  onPress,
  color,
  startIcon,
  endIcon,
  iconSize = 20,
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
      <XStack width={"100%"}  gap={"$10"}>
        {startIcon && (
          <View width={iconSize} height={iconSize} alignSelf="flex-start">
            {startIcon}
          </View>
        )}

        <Text
          color={textColor ? textColor : "black"}
          alignSelf="center"
          textAlign="center"
          fontSize={textSize}
          fontWeight={textWeight}
        >
          {text}
        </Text>

        {endIcon && (
          <View width={iconSize} height={iconSize} alignSelf="flex-end">
            {endIcon}
          </View>
        )}
      </XStack>
    </Button>
  );
}
