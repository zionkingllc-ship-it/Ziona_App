import { KeyboardAvoidingWrapper } from "@/components/layout/KeyboardAvoidingWrapper";
import Header from "@/components/layout/header";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import colors from "@/constants/colors";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Keyboard, Pressable, TextInput } from "react-native";
import { Image, Text, XStack, YStack } from "tamagui";

const OTP_LENGTH = 6;

export default function VerifyOtp() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [timer, setTimer] = useState(50);

  const hasSubmitted = useRef(false);

  /* ---------------- Submit OTP ---------------- */
  const submitOtp = (code: string) => {
    hasSubmitted.current = true;
    Keyboard.dismiss();

    // backend call here
    console.log("Submitting OTP:", code);

    // example navigation
     router.replace("/(auth)/forgotPassword/newPassword");
  };
  const inputsRef = useRef<TextInput[]>([]);

  /* ---------------- TIMER ---------------- */
  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  /* ---------------- AUTOFOCUS ---------------- */
  useEffect(() => {
    const t = setTimeout(() => {
      inputsRef.current[0]?.focus();
    }, 300);
    return () => clearTimeout(t);
  }, []);

  /* ---------------- HANDLERS ---------------- */
const handleChange = (value: string, index: number) => {
  if (!/^\d?$/.test(value)) return;

  const nextOtp = [...otp];
  nextOtp[index] = value;
  setOtp(nextOtp);

  if (value && index < OTP_LENGTH - 1) {
    inputsRef.current[index + 1]?.focus();
  }

  //AUTO SUBMIT WHEN COMPLETE
  if (
    !hasSubmitted.current &&
    nextOtp.every((digit) => digit !== "")
  ) {
    submitOtp(nextOtp.join(""));
  }
};

  const handleBackspace = (index: number) => {
    if (otp[index] === "" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

const resendCode = () => {
  setTimer(50);
  setOtp(Array(OTP_LENGTH).fill(""));
  hasSubmitted.current = false;
  inputsRef.current[0]?.focus();
};
 

  /* ---------------- RENDER ---------------- */
  return (
    <KeyboardAvoidingWrapper>
      <Header />

      <YStack flex={1} padding="$4" gap="$4" marginTop="$10">
        <Image
          source={require("@/assets/images/messageIcon.png")}
          width="$7"
          height="$7"
          borderRadius="$6"
          alignSelf="center"
        />

        <YStack alignItems="center" gap="$2.5">
          <Text fontSize="$4" fontWeight="600">
            Enter your OTP
          </Text>

          <Text fontSize="$3" color={colors.subHeader} textAlign="center">
            Please enter the 6-digit code sent to{"\n"}
            <Text fontWeight="600" color={colors.black}>
              {email}
            </Text>{" "}
            <Text color={colors.primary} onPress={() => router.back()}>
              Edit
            </Text>
          </Text>
        </YStack>

        {/* OTP INPUTS */}
        <XStack justifyContent="space-between" marginTop="$4">
          {otp.map((digit, index) => (
            <Pressable
              key={index}
              onPress={() => inputsRef.current[index]?.focus()}
            >
              <TextInput
                ref={(ref) => {
                  if (ref) inputsRef.current[index] = ref;
                }}
                value={digit}
                onChangeText={(v) => handleChange(v, index)}
                onKeyPress={({ nativeEvent }) => {
                  if (nativeEvent.key === "Backspace") {
                    handleBackspace(index);
                  }
                }}
                keyboardType="number-pad"
                maxLength={1}
                style={{
                  width: 44,
                  height: 48,
                  borderRadius: 8,
                  borderWidth: digit ? 1.5 : 1,
                  borderColor: digit ? colors.primary : colors.borderColor,
                  backgroundColor: colors.borderBackground,
                  textAlign: "center",
                  fontSize: 18,
                  color: colors.black,
                }}
              />
            </Pressable>
          ))}
        </XStack>

        {/* RESEND */}
        <YStack alignItems="center" marginTop="$6">
          <Text fontSize={16} color={colors.subHeader}>
            Didn’t receive a code?
          </Text>

          {timer > 0 ? (
            <Text
              fontSize={16}
              color={colors.headerText}
              textDecorationLine="underline"
            >
              You can request a new code in 0:
              {timer.toString().padStart(2, "0")}s
            </Text>
          ) : (
            <PrimaryButton
              onPress={resendCode}
              style={{ marginTop: 10 }}
              text="Resend code"
              textColor={colors.white}
              color={colors.primary}
            />
          )}
        </YStack>
      </YStack>
    </KeyboardAvoidingWrapper>
  );
}
