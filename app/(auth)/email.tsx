import { KeyboardAvoidingWrapper } from "@/components/layout/KeyboardAvoidingWrapper";
import Header from "@/components/layout/header";
import { TextInputWithIcon } from "@/components/ui/TextInputWithIcon";
import { SimpleButton } from "@/components/ui/centerTextButton";
import colors from "@/constants/colors";
import { useResponsive } from "@/hooks/useResponsive";
import { router } from "expo-router";
import { useState } from "react";
import { Image, Text, YStack } from "tamagui";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Email() {
  const { wp, hp, fs } = useResponsive();

  const [email, setEmail] = useState("");
  const [isFocus, setIsFocus] = useState(false);
  const [loading, setLoading] = useState(false);

  const isValidEmail = emailRegex.test(email);
  const Xspecial = require("@/assets/images/closeSquare.png");
  const mailIcon = require("@/assets/images/mailWithBoder.png");

  const showInvalid = isFocus && email.length > 0 && !isValidEmail;

  const visualValidity: boolean | undefined = !isFocus
    ? undefined
    : showInvalid
      ? false
      : true;

  const handleNext = () => {
    if (!isValidEmail || loading) return;

    requestAnimationFrame(() => {
      setTimeout(() => {
        router.push("/(auth)/birthday");
      }, 120);
    });
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
        {/* -------- Icon -------- */}
        <Image
          source={mailIcon}
          width={wp(18)}
          height={wp(18)}
          borderRadius={wp(9)}
          alignSelf="center"
        />

        {/* -------- Title -------- */}
        <YStack alignItems="center" marginTop={hp(3)} gap={hp(1.5)}>
          <Text fontSize={fs(22)} fontWeight="600" textAlign="center">
            Your email address
          </Text>
        </YStack>

        {/* -------- Input -------- */}
        <YStack width="100%" gap={hp(1)}>
          <TextInputWithIcon
            value={email}
            onfocus={isFocus}
            placeholder="Email address"
            headingText="Email address"
            onChangeText={setEmail}
            keyboardType="email-address"
            endIconVisible={isFocus}
            isValid={visualValidity}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            endIcon={<Image source={Xspecial} width={wp(5)} height={wp(5)} />}
            onEndIconPress={() => setEmail("")}
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

        {/* -------- Button -------- */}
        <SimpleButton
          text="Next"
          textColor={colors.buttonText}
          color={colors.primaryButton}
          disabled={!isValidEmail}
          loading={loading}
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
