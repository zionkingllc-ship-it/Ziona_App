import { router } from "expo-router";
import { useState } from "react";
import { Image, Text, YStack } from "tamagui";

import Header from "@/components/layout/header";
import { KeyboardAvoidingWrapper } from "@/components/layout/KeyboardAvoidingWrapper";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { TextInputWithIcon } from "@/components/ui/TextInputWithIcon";
import colors from "@/constants/colors";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const isValidEmail = emailRegex.test(email);
  const [isFocus, setIsFocus] = useState(false);

    const showInvalid = isFocus && email.length > 0 && !isValidEmail;

  const visualValidity: boolean | undefined = !isFocus
    ? undefined
    : showInvalid
      ? false
      : true;

  const handleSendCode = () => {
    if (!isValidEmail) return;

    // backend later
    router.push({
      pathname: "/(auth)/forgotPassword/verifyOtp",
      params: { email },
    });
  };

  return (
    <KeyboardAvoidingWrapper>
      <Header />

      <YStack
        flex={1}
        padding="$4"
        gap="$3"
        alignItems="center"
        marginTop="$10"
        width="100%"
      >
        <Image
          source={require("@/assets/images/keyIcon.png")}
          width="$7"
          height="$7"
          borderRadius="$6"
          alignSelf="center"
        />

        <YStack alignItems="center" gap="$2" padding={10}>
          <Text fontSize="$4" fontWeight="600">
            Verify your email
          </Text>
          <Text fontSize="$3" color={colors.subHeader} textAlign="center">
            Enter your email address and we’ll send you a 6-digit OTP code
          </Text>
        </YStack>

        <YStack width="100%" gap="$2" >
          <TextInputWithIcon
            value={email}
            onfocus={isFocus}
            headingText="Email"
            onFocus={() => setIsFocus(true)}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={setEmail}
            isValid={visualValidity}
          />

          {email.length > 0 && !isValidEmail && (
            <Text fontSize="$3" color={colors.errorText}>
              Enter a valid email address
            </Text>
          )}
        </YStack>

        <PrimaryButton
          text="Send code"
          color={colors.primary}
          textColor={colors.white}
          disabled={!isValidEmail}
          onPress={handleSendCode}
          style={{ width: "100%", marginTop: 20 }}
        />
      </YStack>
    </KeyboardAvoidingWrapper>
  );
}
