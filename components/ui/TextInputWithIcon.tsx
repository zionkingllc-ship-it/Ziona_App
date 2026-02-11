import colors from "@/constants/colors";
import { ReactNode } from "react";
import { Image, Pressable, TextInputProps } from "react-native";
import { Input, Text, XStack, YStack } from "tamagui";

type InputType = "numeric" | "alphanumeric";

type AppTextInputProps = TextInputProps & {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  startIconVisible?: boolean;
  isValid?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  startImage?: any;
  endImage?: any;
  inputType?: InputType;
  onEndIconPress?: () => void;
  endIconVisible?: boolean;
  headingText: string;
  onfocus: boolean;
};

export function TextInputWithIcon({
  value,
  onChangeText,
  isValid,
  placeholder,
  onfocus,
  startIcon,
  endIconVisible,
  startIconVisible,
  endIcon,
  headingText,
  startImage,
  endImage,
  inputType = "alphanumeric",
  onEndIconPress,
  ...props
}: AppTextInputProps) {
  const borderColor =
    isValid === false
      ? colors.errorBorderColor
      : isValid === true
        ? colors.successBorder
        : colors.borderColor;

  const backgroundColor =
    isValid === false
      ? colors.errorBackground
      : isValid === true
        ? colors.successBackground
        : colors.borderBackground;

  const headerColor =
    isValid === false
      ? colors.errorText
      : isValid === true
        ? colors.successText
        : colors.inputTitle;

  return (
    <XStack
      alignItems="center"
      justifyContent="space-between"
      padding={10}
      height={51}
      width={"100%"}
      borderColor={borderColor}
      backgroundColor={backgroundColor}
      borderWidth={1}
      borderRadius={8}
    >
      {startIcon && <YStack>{startIcon}</YStack>}

      {startImage && (
        <Image
          source={startImage}
          style={{ width: 20, height: 20 }}
          resizeMode="contain"
        />
      )}

      <YStack height={51} padding={8} width={"85%"}>
        {onfocus && (
          <Text marginLeft={3} fontSize={10} color={headerColor}>
            {headingText}
          </Text>
        )}
        <Input
          flex={1}
          value={value}
          placeholder={placeholder}
          borderWidth={0}
          padding={2}
          backgroundColor="transparent"
          fontSize="$3"
          fontWeight="400"
          color={colors.black}
          placeholderTextColor={colors.placeHolderText}
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
      </YStack>
      {((endIcon && endIconVisible) || (endImage && endIconVisible)) &&
        onEndIconPress && (
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
