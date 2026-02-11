import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import OtpInputs from "react-native-otp-inputs";
import { Image, Text, YStack } from "tamagui";

import { KeyboardAvoidingWrapper } from "@/components/layout/KeyboardAvoidingWrapper";
import Header from "@/components/layout/header";
import colors from "@/constants/colors";

const OTP_LENGTH = 6;

export default function VerifyOtp() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(50);

  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const resendCode = () => {
    setTimer(50);
    setOtp("");
    // backend later
  };

  const verify = () => {
    router.replace("/(auth)/signin");
  };

  return (
    <KeyboardAvoidingWrapper>
      <Header />

      <YStack
        flex={1}
        padding="$4"
        gap="$4"
        alignItems="center"
        marginTop="$10"
        width="100%"
      >
        <Image
          source={require("@/assets/images/messageIcon.png")}
          width={64}
          height={64}
        />

        <YStack alignItems="center" gap="$2">
          <Text fontSize="$5" fontWeight="600">
            Enter your OTP
          </Text>

          <Text fontSize="$3" color={colors.gray} textAlign="center">
            Please enter the 6-digit code sent to{"\n"}
            <Text fontWeight="600">{email}</Text>{" "}
            <Text color={colors.primary} onPress={() => router.back()}>
              Edit
            </Text>
          </Text>
        </YStack>

        {/* OTP INPUT */}
        <OtpInputs
          numberOfInputs={OTP_LENGTH}
          autofillFromClipboard
          keyboardType="phone-pad"
          handleChange={setOtp}
          inputContainerStyles={{
            borderWidth: 1,
            borderColor: colors.gray,
            borderRadius: 8,
            width: 44,
            height: 48,
            justifyContent: "center",
            alignItems: "center",
          }}
          focusStyles={{
            borderColor: colors.primary,
          }}
          inputStyles={{
            fontSize: 18,
            textAlign: "center",
          }}
        />

        {/* RESEND */}
        <YStack alignItems="center" marginTop="$4">
          <Text fontSize="$3" color={colors.gray} marginBottom="$1">
            Didn’t receive a code?
          </Text>

          {timer > 0 ? (
            <Text fontSize="$3" color={colors.gray}>
              You can request a new code in 0:
              {timer.toString().padStart(2, "0")}s
            </Text>
          ) : (
            <PrimaryButton
              onPress={resendCode}
              text="Resend code"
              textColor={colors.white}
              color={colors.primary}
            />
          )}
        </YStack>

        <PrimaryButton
          text="Verify"
          color={colors.primary}
          textColor={colors.white}
          disabled={otp.length !== OTP_LENGTH}
          style={{ width: "100%", marginTop: 16 }}
          onPress={verify}
        />
      </YStack>
    </KeyboardAvoidingWrapper>
  );
}
