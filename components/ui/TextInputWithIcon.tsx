import { XStack, Input, YStack } from "tamagui";
import { Image, Pressable, TextInputProps } from "react-native";
import { ReactNode } from "react";
import colors from "@/constants/colors";

type InputType = "numeric" | "alphanumeric";

type AppTextInputProps = TextInputProps & {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  /**
   * undefined = neutral
   * true = valid
   * false = invalid
   */
  isValid?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  startImage?: any;
  endImage?: any;
  inputType?: InputType;
  onEndIconPress?: () => void;
};

export function TextInputWithIcon({
  value,
  onChangeText,
  isValid,
  placeholder,
  startIcon,
  endIcon,
  startImage,
  endImage,
  inputType = "alphanumeric",
  onEndIconPress,
  ...props
}: AppTextInputProps) {
  const borderColor =
    isValid === false
      ? colors.danger
      : isValid === true
      ? colors.success
      : colors.gray;

  const backgroundColor =
    isValid === false
      ? colors.danger + "20"
      : isValid === true
      ? colors.success + "20"
      : colors.background;

  return (
    <XStack
      alignItems="center"
      borderWidth={1}
      borderColor={borderColor}
      backgroundColor={backgroundColor}
      borderRadius={12}
      paddingHorizontal={12}
      height={52}
      gap="$2"
    >
      {startIcon && <YStack>{startIcon}</YStack>}

      {startImage && (
        <Image
          source={startImage}
          style={{ width: 20, height: 20 }}
          resizeMode="contain"
        />
      )}

      <Input
        flex={1}
        value={value}
        placeholder={placeholder}
        borderWidth={0}
        backgroundColor="transparent"
        fontSize="$3"
        fontWeight="400"
        color={colors.text}
        placeholderTextColor={colors.balanceText}
        keyboardType={inputType === "numeric" ? "numeric" : "default"}
        onChangeText={(text) => {
          if (inputType === "numeric") {
            onChangeText(text.replace(/[^0-9]/g, ""));
          } else {
            onChangeText(text);
          }
        }}
        {...props}
      />

      {(endIcon || endImage) && onEndIconPress && (
        <Pressable onPress={onEndIconPress} hitSlop={10}>
          {endIcon && <YStack>{endIcon}</YStack>}
          {endImage && (
            <Image
              source={endImage}
              style={{ width: 20, height: 20 }}
              resizeMode="contain"
            />
          )}
        </Pressable>
      )}
    </XStack>
  );
}