import { KeyboardAvoidingWrapper } from "@/components/layout/KeyboardAvoidingWrapper";
import Header from "@/components/layout/header";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import SuccessModal from "@/components/ui/modals/successModal";
import colors from "@/constants/colors";
import { authApi } from "@/services/api/authApi";
import { useAuthStore } from "@/store/useAuthStore";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Keyboard, Pressable, TextInput } from "react-native";
import { Image, Text, XStack, YStack } from "tamagui";

const OTP_LENGTH = 6;

/* ---------------- DEBUG HELPERS ---------------- */

const log = (...args: any[]) => {
  console.log("OTP FLOW:", ...args);
};

const line = () => {
  console.log("--------------------------------------------------");
};

export default function VerifyOtp() {
  const { email, flow } = useLocalSearchParams<{
    email: string;
    flow: "signup" | "signin" | "reset-password";
  }>();

  const setAuth = useAuthStore((s) => s.setAuth);

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [timer, setTimer] = useState(50);
  const [errorVisible, setErrorVisible] = useState(false);

  const hasSubmitted = useRef(false);
  const inputsRef = useRef<TextInput[]>([]);

  /* ---------------- SCREEN MOUNT ---------------- */

  useEffect(() => {
    line();
    log("OTP screen mounted");
    log("Flow:", flow);
    log("Email:", email);
    line();
  }, []);

  /* ---------------- TIMER ---------------- */

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          log("Resend available");
          clearInterval(interval);
          return 0;
        }

        const next = prev - 1;
        log("Timer:", next);
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  /* ---------------- AUTOFOCUS ---------------- */

  useEffect(() => {
    const t = setTimeout(() => {
      inputsRef.current[0]?.focus();
    }, 300);

    return () => clearTimeout(t);
  }, []);

  /* ---------------- SUBMIT OTP ---------------- */

  const submitOtp = async (code: string) => {
    if (hasSubmitted.current) return;

    hasSubmitted.current = true;
    Keyboard.dismiss();

    line();
    log("Submitting OTP");
    log("Code:", code);
    log("Email:", email);
    log("Flow:", flow);
    line();

    try {
      /* ---------------- SIGNUP / SIGNIN VERIFY ---------------- */

      if (flow === "signup" || flow === "signin") {
        const response = await authApi.verifyOtp({
          email,
          code,
        });

        log("OTP verification success");
        log("Backend response:", response);

        if (response.user && response.tokens) {
          log("Saving auth tokens");
          setAuth(response.user, response.tokens);
        }

        log("Routing to feed");
        router.replace("/(tabs)/feed");
        return;
      }

      /* ---------------- PASSWORD RESET ---------------- */

      if (flow === "reset-password") {
        log("OTP verified for password reset");

        router.replace({
          pathname: "/(auth)/forgotPassword/newPassword",
          params: {
            email,
            otp: code,
          },
        });

        return;
      }
    } catch (error: any) {
      console.error(
        "OTP verification failed:",
        error?.response?.data || error
      );

      hasSubmitted.current = false;
      setErrorVisible(true);
    }
  };

  /* ---------------- HANDLE INPUT ---------------- */

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    log("Digit entered", { index, value });

    const nextOtp = [...otp];
    nextOtp[index] = value;
    setOtp(nextOtp);

    if (value && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }

    if (!hasSubmitted.current && nextOtp.every((digit) => digit !== "")) {
      log("OTP complete — triggering submit");
      submitOtp(nextOtp.join(""));
    }
  };

  /* ---------------- BACKSPACE ---------------- */

  const handleBackspace = (index: number) => {
    if (otp[index] === "" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  /* ---------------- RESEND OTP ---------------- */

  const resendCode = async () => {
    if (!email) return;

    line();
    log("Resend OTP requested");
    log("Email:", email);

    setTimer(50);
    setOtp(Array(OTP_LENGTH).fill(""));

    try {
      const response = await authApi.resendOtp(email);

      log("Resend success:", response);

      hasSubmitted.current = false;
      inputsRef.current[0]?.focus();
    } catch (error: any) {
      console.error(
        "Resend OTP failed:",
        error?.response?.data || error
      );
      setErrorVisible(true);
    }

    line();
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
          <Text fontFamily="$body" fontSize="$4" fontWeight="600">
            Enter your OTP
          </Text>

          <Text
            fontFamily="$body"
            fontSize="$3"
            color={colors.subHeader}
            textAlign="center"
          >
            Please enter the 6-digit code sent to{"\n"}
            <Text fontFamily="$body" fontWeight="600" color={colors.black}>
              {email}
            </Text>{" "}
            <Text
              fontFamily="$body"
              color={colors.primary}
              onPress={() => router.back()}
            >
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
                  fontFamily: "$body",
                  fontSize: 18,
                  color: colors.black,
                }}
              />
            </Pressable>
          ))}
        </XStack>

        {/* RESEND */}

        <YStack alignItems="center" marginTop="$6">
          <Text fontSize={16} fontFamily="$body" color={colors.subHeader}>
            Didn’t receive a code?
          </Text>

          {timer > 0 ? (
            <Text
              fontSize={16}
              fontFamily="$body"
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

      {/* ERROR MODAL */}

      <SuccessModal
        visible={errorVisible}
        type="failed"
        autoClose
        duration={3000}
        onClose={() => setErrorVisible(false)}
        title="Incorrect code entered"
        message="Please check the code and try again"
      />
    </KeyboardAvoidingWrapper>
  );
}