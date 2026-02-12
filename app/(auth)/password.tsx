import Header from "@/components/layout/header";
import { KeyboardAvoidingWrapper } from "@/components/layout/KeyboardAvoidingWrapper";
import { SimpleButton } from "@/components/ui/centerTextButton";
import { TextInputWithIcon } from "@/components/ui/TextInputWithIcon";
import colors from "@/constants/colors";
import { isPasswordValid, passwordRules } from "@/utils/passwordRules";
import { Eye, EyeClosed } from "@tamagui/lucide-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Image, Text, YStack } from "tamagui";

export default function CreatePassword() {
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [loading, setLoading] = useState(false);
  

  const checks = {
    length: passwordRules.minLength(password),
    letterNumber: passwordRules.hasLetterAndNumber(password),
    special: passwordRules.hasSpecialChar(password),
  };

  const passwordIsValid = isPasswordValid(password);

  const showInvalid = isFocus && password.length > 0 && !passwordIsValid;

  const visualValidity: boolean | undefined = !isFocus
    ? undefined
    : showInvalid
      ? false
      : true;

  const handleSubmit = () => {
    //setLoading(true);
    router.push("/(auth)/username");
  };
  return (
    <KeyboardAvoidingWrapper>
      <Header />
      <YStack flex={1} padding="$4" gap="$4" marginTop="$10" width="100%">
        <Image
          source={require("@/assets/images/lockIcon.png")}
          width="$7"
          height="$7"
          borderRadius="$6"
          alignSelf="center"
        />

        <YStack alignItems="center" marginTop="$6" gap="$3">
          <Text fontSize="$4" fontWeight="600">
            Create password
          </Text>
        </YStack>

        <TextInputWithIcon
          value={password}
          placeholder="Enter password"
          endIconVisible={password.length > 0 && isFocus}
          onChangeText={setPassword}
          onfocus={isFocus}
          headingText="Password"
          isValid={visualValidity}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          endIcon={show ? <Eye size={24} color={colors.inputIconColor}/> : <EyeClosed size={24} color={colors.inputIconColor}/>}
          secureTextEntry={!show}
          onEndIconPress={() => setShow((prev) => !prev)}
        />

        <YStack gap="$2" marginLeft={5}>
          <Text fontSize={"$4"} fontWeight={"500"} color={colors.headerText}>Your password must have at least:</Text>
          <Rule ok={checks.length} text="8 characters (20 max)" />
          <Rule ok={checks.letterNumber} text="1 letter and 1 number" />
          <Rule ok={checks.special} text="1 special character (e.g. ! @ &)" />
        </YStack>

        <SimpleButton
          text="Next"
          loading={loading}
          textColor={colors.white}
          color={colors.primary}
          disabled={!passwordIsValid}
          onPress={handleSubmit}
        />
      </YStack>
    </KeyboardAvoidingWrapper>
  );
}

function Rule({ ok, text }: { ok: boolean; text: string }) {
  return (
    <Text fontSize={"$4"} color={ok ? colors.SUCCESS_GREEN : colors.subHeader}>
      {ok ? "✓" : "✓"} {text}
    </Text>
  );
}