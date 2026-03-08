import colors from "@/constants/colors";
import { useResponsive } from "@/hooks/useResponsive";
import { ReactNode } from "react";
import { Image, Pressable, TextInput, TextInputProps } from "react-native";
import { Text, XStack, YStack } from "tamagui";

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
  fontFamily?: string;
};

export function TextInputWithIcon({
  value,
  onChangeText,
  isValid,
  placeholder,
  onfocus,
  startIcon,
  endIconVisible,
  endIcon,
  headingText,
  startImage,
  endImage,
  fontFamily = "System",
  inputType = "alphanumeric",
  onEndIconPress,
  ...props
}: AppTextInputProps) {
  const { wp, hp, fs } = useResponsive();

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

  const INPUT_HEIGHT = hp(7);
  const ICON_SIZE = wp(5);

  const handleChange = (text: string) => {
    if (inputType === "numeric") {
      onChangeText(text.replace(/[^0-9]/g, ""));
    } else {
      onChangeText(text);
    }
  };

  return (
    <XStack
      alignItems="center"
      paddingHorizontal={wp(3)}
      paddingVertical={wp(1.5)}
      height={INPUT_HEIGHT}
      width="100%"
      borderColor={borderColor}
      backgroundColor={backgroundColor}
      borderWidth={1}
      borderRadius={wp(2.5)}
    >
      {startIcon && <YStack marginRight={wp(2)}>{startIcon}</YStack>}

      {startImage && (
        <Image
          source={startImage}
          style={{ width: ICON_SIZE, height: ICON_SIZE }}
          resizeMode="contain"
        />
      )}

      <YStack flex={1} justifyContent="center">
        {onfocus && (
          <Text fontSize={fs(10)} color={headerColor} marginBottom={hp(0.3)}>
            {headingText}
          </Text>
        )}

        <TextInput
          style={{
            flex: 1,
            padding: 0,
            fontSize: fs(16),
            color: colors.black,
            fontFamily,
            backgroundColor: "transparent",
          }}
          value={value}
          placeholder={placeholder}
          placeholderTextColor={colors.placeHolderText}
          keyboardType={inputType === "numeric" ? "numeric" : "default"}
          autoCorrect={false}
          autoCapitalize="none"
          underlineColorAndroid="transparent"
          textContentType="oneTimeCode"
          importantForAutofill="no"
          blurOnSubmit={false}
          autoComplete="off"
          onChangeText={handleChange}
          {...props}
        />
      </YStack>

      {((endIcon && endIconVisible) || (endImage && endIconVisible)) &&
        onEndIconPress && (
          <Pressable
            onPress={onEndIconPress}
            hitSlop={10}
            style={{ marginLeft: wp(2) }}
          >
            {endIcon && <YStack>{endIcon}</YStack>}
            {endImage && (
              <Image
                source={endImage}
                style={{ width: ICON_SIZE, height: ICON_SIZE }}
                resizeMode="contain"
              />
            )}
          </Pressable>
        )}
    </XStack>
  );
}
