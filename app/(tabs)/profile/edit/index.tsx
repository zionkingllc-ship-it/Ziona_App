import Header from "@/components/layout/header";
import colors from "@/constants/colors";
import { ChevronRight } from "@tamagui/lucide-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar, ListItem, Text, YStack } from "tamagui";

export default function EditProfileScreen() {
  const [imageModal, setImageModal] = useState(false);
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.white, paddingTop: 20 }}
    >
      <Header
        heading="Edit profile"
        headerFontFamily={"$body"}
        headingSize={16}
        headingWeight={"500"}
      />

      <YStack flex={1} gap="$4" padding={20}>
        {/* Avatar */}
        <YStack alignItems="center" gap="$2">
          <Avatar circular size="$8">
            <Avatar.Image src={require("@/assets/images/emptyDP.png")} />
            <Avatar.Fallback backgroundClip={colors.black} />
          </Avatar>

          <Text
            fontFamily={"$body"}
            fontWeight={"400"}
            color={colors.primary}
            onPress={() => setImageModal(true)}
          >
            Change photo
          </Text>
        </YStack>

        {/* Info Section */}
        <YStack>
          <Pressable
            onPress={() => router.push("/profile/edit/name")}
            style={{ flexDirection: "row" }}
          >
            <Text>"Zion Koy"</Text>
            <ChevronRight />
          </Pressable>

          <ListItem subTitle="Zion Koy"  />
          <ListItem
            title="Username"
            subTitle="ZionChild123"
            onPress={() => router.push("/profile/edit/username")}
            iconAfter={ChevronRight}
          />
        </YStack>

        <YStack>
          <Text
            fontFamily={"$body"}
            fontWeight={"400"}
            fontSize="$3"
            color="$gray10"
            marginBottom="$2"
          >
            More info
          </Text>

          <ListItem
            title="Bio"
            subTitle="Add a short description about you"
            onPress={() => router.push("/profile/edit/bio")}
            iconAfter={ChevronRight}
          />
        </YStack>
      </YStack>
    </SafeAreaView>
  );
}
