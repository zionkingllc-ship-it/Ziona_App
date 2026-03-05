import { KeyboardAvoidingWrapper } from "@/components/layout/KeyboardAvoidingWrapper";
import Header from "@/components/layout/header";
import { TextInputWithIcon } from "@/components/ui/TextInputWithIcon";
import { SimpleButton } from "@/components/ui/centerTextButton";
import colors from "@/constants/colors";
import { useResponsive } from "@/hooks/useResponsive";
import { useAsyncStore } from "@/store/useAsyncStore";
import { useSignupStore } from "@/store/useSignupStore";
import { router } from "expo-router";
import { useState } from "react";
import { Image, Text, YStack } from "tamagui";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Email() {
  const { wp, hp, fs } = useResponsive();

  const storedEmail = useSignupStore((s) => s.email);
  const setEmail = useSignupStore((s) => s.setEmail);

  const start = useAsyncStore((s) => s.start);
  const stop = useAsyncStore((s) => s.stop);
  const isLoading = useAsyncStore((s) => s.isLoading("emailNext"));

  const [email, setLocalEmail] = useState(storedEmail ?? "");
  const [isFocus, setIsFocus] = useState(false);

  const isValidEmail = emailRegex.test(email);

  const Xspecial = require("@/assets/images/closeSquare.png");
  const mailIcon = require("@/assets/images/mailWithBoder.png");

  const showInvalid = isFocus && email.length > 0 && !isValidEmail;

  const visualValidity: boolean | undefined = !isFocus
    ? undefined
    : showInvalid
      ? false
      : true;

  const handleNext = async () => {
    if (!isValidEmail || isLoading) return;

    try {
      start("emailNext");

      // Save email into signup store
      setEmail(email.trim().toLowerCase());

      // Preserve slide animation smoothness
      requestAnimationFrame(() => {
        setTimeout(() => {
          router.push("/(auth)/birthday");
        }, 120);
      });
    } finally {
      stop("emailNext");
    }
  };

  return (
    <KeyboardAvoidingWrapper>
      <Header />

      <YStack
        flex={1}
        paddingHorizontal={wp(6)}
        gap={hp(2)}
        alignItems="center"
        marginTop={hp(8)}
        width="100%"
      >
        <Image
          source={mailIcon}
          width={wp(18)}
          height={wp(18)}
          borderRadius={wp(2)}
          alignSelf="center"
        />

        <YStack alignItems="center" marginTop={hp(3)} gap={hp(1.5)}>
          <Text fontSize={fs(22)} fontWeight="600" textAlign="center">
            Your email address
          </Text>
        </YStack>

        <YStack width="100%" gap={hp(1)}>
          <TextInputWithIcon
            value={email}
            onfocus={isFocus}
            placeholder="Email address"
            headingText="Email address"
            onChangeText={setLocalEmail}
            keyboardType="email-address"
            endIconVisible={isFocus}
            isValid={visualValidity}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            endIcon={<Image source={Xspecial} width={wp(5)} height={wp(5)} />}
            onEndIconPress={() => setLocalEmail("")}
          />

          {showInvalid && (
            <Text
              fontSize={fs(13)}
              color={colors.errorText}
              alignSelf="flex-start"
              marginTop={hp(0.5)}
            >
              Enter a valid email address
            </Text>
          )}
        </YStack>

        <SimpleButton
          text="Next"
          textColor={colors.buttonText}
          color={colors.primaryButton}
          disabled={!isValidEmail || isLoading}
          loading={isLoading}
          onPress={handleNext}
          style={{
            width: "100%",
            marginTop: hp(3),
            height: hp(6.5),
          }}
          textSize={fs(16)}
        />
      </YStack>
    </KeyboardAvoidingWrapper>
  );
}
