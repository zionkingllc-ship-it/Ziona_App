import { YStack, Text, Image } from "tamagui";
import { router } from "expo-router";
import { useState } from "react";
import colors from "@/constants/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, X } from "@tamagui/lucide-icons";
import { KeyboardAvoidingWrapper } from "@/components/layout/KeyboardAvoidingWrapper";
import { TextInputWithIcon } from "@/components/ui/TextInputWithIcon";
import { SimpleButton } from "@/components/ui/centerTextButton";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Email() {
  const [email, setEmail] = useState("");
  const [isFocus, setIsFocus] = useState(false);

  const isValidEmail = emailRegex.test(email);

  const showInvalid =
    isFocus && email.length > 0 && !isValidEmail;


  const visualValidity: boolean | undefined = !isFocus
    ? undefined
    : showInvalid
    ? false
    : true;

  const handleNext = () => {
    if (!isValidEmail) return;
    router.push("/(auth)/birthday");
  };

  return (
    <SafeAreaView
      style={{ flex: 1, padding: 10, backgroundColor: colors.background }}
    >
      <KeyboardAvoidingWrapper>
        <ChevronLeft
          size={24}
          marginLeft={10}
          marginTop={5}
          color={colors.primary}
          onPress={() => router.back()}
        />

        <YStack
          flex={1}
          padding="$4"
          gap="$4"
          justifyContent="center"
          alignItems="center"
          width="100%"
          backgroundColor={colors.background}
        >
          <Image
            source={require("@/assets/images/mailWithBoder.png")}
            width="30%"
            height={80}
          />

          <YStack alignItems="center" marginTop="$6" gap="$3">
            <Text fontSize="$4" fontWeight="600">
              Your email address
            </Text>
          </YStack>

          <TextInputWithIcon
            value={email}
            placeholder="Email address"
            onChangeText={setEmail}
            keyboardType="email-address"
            isValid={visualValidity}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            endIcon={<X size={18} color={colors.gray} />}
            onEndIconPress={() => setEmail("")}
          />

          {showInvalid && (
            <Text fontSize="$3" color={colors.danger}>
              Enter a valid email address
            </Text>
          )}

          <SimpleButton
            text="Next"
            textColor={colors.white}
            color={colors.primary}
            disabled={!isValidEmail}
            onPress={handleNext}
            style={{ width: "100%", marginTop: 20 }}
          />
        </YStack>
      </KeyboardAvoidingWrapper>
    </SafeAreaView>
  );
}