import { useState } from "react";
import { Platform, Pressable } from "react-native";
import { YStack, Text, Button, XStack, Input, Image, View } from "tamagui";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft } from "@tamagui/lucide-icons";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import colors from "@/constants/colors";
import { DateSelector } from "@/components/ui/DateSelector";

export default function Birthday() {
  const [showPicker, setShowPicker] = useState(false);
  const [date, setDate] = useState(new Date(2000, 3, 4));

  const formattedDate = date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowPicker(false);
    }

    if (event.type === "set" && selectedDate) {
      setDate(selectedDate);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <XStack padding="$4" alignItems="center">
        <ChevronLeft
          size={24}
          marginLeft={10}
          marginTop={5}
          color={colors.primary}
          onPress={() => router.back()}
        />
      </XStack>
      <YStack justifyContent="center" alignItems="center">
        {/* Content */}
        <YStack padding="$4" alignItems="center" gap="$4" width={"100%"}>
          <Image
            source={require("@/assets/images/birthdayLogo.png")}
            width={60}
            height={60}
          />
          <YStack alignItems="center" marginTop="$6" gap="$3">
            <Text fontSize="$5" fontWeight="600">
              When is your birthday
            </Text>
          </YStack>

          <Text fontSize="$3" color="$gray10" textAlign="center">
            Used only for personalization. Not public.
          </Text>

          {/* Birthday Input */}
          <Pressable
            style={{
              width: "100%",
              padding: 10,
              borderWidth: 0.5,
              borderColor: colors.gray,
              marginTop: 3,
              borderRadius: 5,
            }}
            onPress={() => {
              setShowPicker(true);
            }}
          >
            <Text fontSize={13}>{formattedDate}</Text>
          </Pressable>

          <Button
            backgroundColor={colors.primary}
            color="white"
            width="100%"
            marginTop="$3"
            onPress={() => router.push("/(auth)/password")}
          >
            Next
          </Button>
        </YStack>

        {/* Android modal picker */}
        {showPicker && Platform.OS === "android" && (
          <View marginBottom={10} width={"100%"}>
            <DateSelector date={date} setDate={setDate} />
          </View>
        )}
      </YStack>
    </SafeAreaView>
  );
}
