import { YStack, Image, Text } from "tamagui";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { router } from "expo-router";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { passwordRules, isPasswordValid } from "@/utils/passwordRules";
import { Eye, EyeOff, Lock, ChevronLeft } from "@tamagui/lucide-icons";
import { TextInputWithIcon } from "@/components/ui/TextInputWithIcon";
import colors from "@/constants/colors";
import { KeyboardAvoidingWrapper } from "@/components/layout/KeyboardAvoidingWrapper";
import { SimpleButton } from "@/components/ui/centerTextButton";

export default function CreatePassword() {
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [isFocus, setIsFocus] = useState(false);

  const checks = {
    length: passwordRules.minLength(password),
    letterNumber: passwordRules.hasLetterAndNumber(password),
    special: passwordRules.hasSpecialChar(password),
  };

  const passwordIsValid = isPasswordValid(password);

  const showInvalid =
    isFocus && password.length > 0 && !passwordIsValid;

  const visualValidity: boolean | undefined = !isFocus
    ? undefined
    : showInvalid
    ? false
    : true;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingWrapper>
        <ChevronLeft
          marginLeft={10}
          size={24}
          color={colors.primary}
          onPress={() => router.back()}
        />

        <YStack
          flex={1}
          padding="$5"
          gap="$4"
          justifyContent="center"
          width="100%"
        >
          <Image
            source={require("@/assets/images/lockIcon.png")}
            width="30%"
            height={80}
            alignSelf="center"
          />

          <YStack alignItems="center" marginTop="$6" gap="$3">
            <Text fontSize="$5" fontWeight="600">
              Create password
            </Text>
          </YStack>

          <TextInputWithIcon
            value={password}
            placeholder="Enter password"
            onChangeText={setPassword}
            isValid={visualValidity}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            startIcon={<Lock size={18} />}
            endIcon={show ? <Eye /> : <EyeOff />}
            secureTextEntry={!show}
            onEndIconPress={() => setShow((prev) => !prev)}
          />

          <YStack gap="$2">
            <Rule ok={checks.length} text="8 characters (20 max)" />
            <Rule ok={checks.letterNumber} text="1 letter and 1 number" />
            <Rule ok={checks.special} text="1 special character (e.g. ! @ &)" />
          </YStack>

          <SimpleButton
            text="Next"
            textColor={colors.white}
            color={colors.primary}
            disabled={!passwordIsValid}
            onPress={() => router.push("/(auth)/username")}
          />
        </YStack>
      </KeyboardAvoidingWrapper>
    </SafeAreaView>
  );
}

function Rule({ ok, text }: { ok: boolean; text: string }) {
  return (
    <Text color={ok ? colors.SUCCESS_GREEN : colors.gray}>
      {ok ? "✓" : "○"} {text}
    </Text>
  );
}