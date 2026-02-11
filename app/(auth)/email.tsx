import { KeyboardAvoidingWrapper } from "@/components/layout/KeyboardAvoidingWrapper";
import Header from "@/components/layout/header";
import { TextInputWithIcon } from "@/components/ui/TextInputWithIcon";
import { SimpleButton } from "@/components/ui/centerTextButton";
import colors from "@/constants/colors";
import { router } from "expo-router";
import { useState } from "react";
import { Image, Text, YStack } from "tamagui";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Email() {
  const [email, setEmail] = useState("");
  const [isFocus, setIsFocus] = useState(false);
  const [loading, setLoading] = useState(false);

  const isValidEmail = emailRegex.test(email);
  const Xspecial = require("@/assets/images/closeSquare.png");
  const showInvalid = isFocus && email.length > 0 && !isValidEmail;

  const visualValidity: boolean | undefined = !isFocus
    ? undefined
    : showInvalid
      ? false
      : true;

  const handleNext = () => {
    if (!isValidEmail || loading) return;
    //setLoading(true);

    // Allow spinner to render before navigation
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
        padding="$4"
        gap="$4"
        alignItems="center"
        marginTop="$10"
        width="100%"
      >
        <Image
          source={require("@/assets/images/mailWithBoder.png")}
          width="$7"
          height="$7"
          borderRadius="$6"
          alignSelf="center"
        />

        <YStack alignItems="center" marginTop="$6" gap="$3">
          <Text fontSize="$4" fontWeight="600">
            Your email address
          </Text>
        </YStack>
        <YStack width={"100%"}>
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
            endIcon={<Image src={Xspecial} width="$1.5" />}
            onEndIconPress={() => setEmail("")}
          />

          {showInvalid && (
            <Text
              fontSize="$3"
              color={colors.errorText}
              alignSelf="flex-start"
              marginLeft={2}
              marginTop={"$2"}
            >
              Enter a valid email address
            </Text>
          )}
        </YStack>

        <SimpleButton
          text="Next"
          textColor={colors.buttonText}
          color={colors.primaryButton}
          disabled={!isValidEmail}
          loading={loading}
          onPress={handleNext}
          style={{ width: "100%", marginTop: 20 }}
        />
      </YStack>
    </KeyboardAvoidingWrapper>
  );
}
