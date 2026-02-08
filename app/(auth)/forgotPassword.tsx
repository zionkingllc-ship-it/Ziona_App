import { YStack, Text, Image } from "tamagui";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { router } from "expo-router";
import { ChevronLeft } from "@tamagui/lucide-icons";

import colors from "@/constants/colors";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { TextInputWithIcon } from "@/components/ui/TextInputWithIcon";
import { KeyboardAvoidingWrapper } from "@/components/layout/KeyboardAvoidingWrapper";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const isValidEmail = emailRegex.test(email);

  const handleSendCode = () => {
    if (!isValidEmail) return;

    // backend later
    router.push({
      pathname: "/(auth)/verifyOtp",
      params: { email },
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingWrapper>
        <ChevronLeft
          size={24}
          marginLeft={12}
          marginTop={6}
          color={colors.primary}
          onPress={() => router.back()}
        />

        <YStack
          flex={1}
          padding="$4"
          justifyContent="center"
          alignItems="center"
          gap="$4"
        >
          <Image
            source={require("@/assets/images/keyIcon.png")}
            width={64}
            height={64}
          />

          <YStack alignItems="center" gap="$2">
            <Text fontSize="$5" fontWeight="600">
              Verify your email
            </Text>
            <Text fontSize="$3" color={colors.gray} textAlign="center">
              Enter your email address and we’ll send you a 6-digit OTP code
            </Text>
          </YStack>

          <YStack width="100%" gap="$2" marginTop="$4">
            <Text fontSize="$3" fontWeight="600">
              Email
            </Text>

            <TextInputWithIcon
              value={email}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              onChangeText={setEmail}
              isValid={email.length === 0 || isValidEmail}
            />

            {email.length > 0 && !isValidEmail && (
              <Text fontSize="$2" color={colors.danger}>
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
    </SafeAreaView>
  );
}