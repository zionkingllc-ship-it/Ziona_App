import { YStack, Text, Image, XStack, Input } from "tamagui";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useRef, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { ChevronLeft } from "@tamagui/lucide-icons";
import { Pressable } from "react-native";
import { PrimaryButton } from "@/components/ui/PrimaryButton";

import colors from "@/constants/colors";
import { KeyboardAvoidingWrapper } from "@/components/layout/KeyboardAvoidingWrapper";

const OTP_LENGTH = 6;

export default function VerifyOtp() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(50);
  const inputRef = useRef<any>(null);

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

  const digits = otp.padEnd(OTP_LENGTH, " ").split("");

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

          {/* OTP BOXES */}
          <Pressable onPress={() => inputRef.current?.focus()}>
            <XStack gap="$2" marginTop="$4">
              {digits.map((digit, index) => (
                <YStack
                  key={index}
                  width={44}
                  height={48}
                  borderRadius="$3"
                  borderWidth={1}
                  borderColor={
                    index === otp.length ? colors.primary : colors.gray
                  }
                  backgroundColor={
                    digit !== " " ? colors.success : "transparent"
                  }
                  justifyContent="center"
                  alignItems="center"
                >
                  <Text fontSize="$4">{digit.trim()}</Text>
                </YStack>
              ))}
            </XStack>
          </Pressable>

          {/* HIDDEN INPUT */}
          <Input
            ref={inputRef}
            value={otp}
            fontSize={14}
            onChangeText={(text) => {
              if (/^\d*$/.test(text) && text.length <= OTP_LENGTH) {
                setOtp(text);
              }
            }}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            autoFocus
            editable
            importantForAutofill="yes"
            style={{
              position: "absolute",
              width: 1,
              height: 1,
              opacity: 0,
            }}
          />

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
    </SafeAreaView>
  );
}
