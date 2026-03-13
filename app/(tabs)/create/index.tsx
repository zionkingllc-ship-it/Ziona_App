import colors from "@/constants/colors";
import { useResponsive } from "@/hooks/useResponsive";
import { useCreatePostStore } from "@/store/createPostStore";
import { router } from "expo-router";
import { Image, StyleSheet, TouchableOpacity } from "react-native";
import { Text, XStack, YStack } from "tamagui";

export default function CreateScreen() {
  const { startDraft } = useCreatePostStore();
  const { wp, hp, fs } = useResponsive();

  function openText() {
    startDraft("text");
    router.push("/create/text");
  }

  function openMedia() {
    startDraft("media");
    router.push("/create/media");
  }

  function openBible() {
    startDraft("bible");
    router.push("/create/text");
  }

  return (
    <YStack
      flex={1}
      paddingHorizontal={wp(6)}
      paddingTop={hp(5)}
      backgroundColor={colors.white}
    >
      {/* TITLE */}

      <Text
        fontSize={fs(18)}
        fontWeight="600"
        alignSelf="center"
        marginVertical={hp(4)}
        fontFamily={"$body"}
      >
        Create Post
      </Text>

      {/* GRID */}

      <XStack flexWrap="wrap" gap={wp(3)}>
        {/*SHARE THOUGHTS*/}

        <TouchableOpacity
          style={[
            styles.card,
            {
              width: wp(42),
              height: hp(13),
              borderRadius: wp(3),

              shadowColor: colors.black,
              shadowOpacity: 0.06,
              shadowOffset: { width: 0, height: 8 },
              shadowRadius: 2,
              elevation: 1.5,
            },
          ]}
          onPress={openText}
        >
          <YStack alignItems="center" gap={hp(1)} paddingHorizontal={hp(5)}>
            <Image
              source={require("@/assets/images/writeIcon.png")}
              style={{
                width: wp(7),
                height: wp(7),
                resizeMode: "contain",
              }}
            />
            <Text
              fontSize={fs(14)}
              fontFamily={"$body"}
              fontWeight={"400"}
              textAlign="center"
            >
              Share your thoughts
            </Text>
          </YStack>
        </TouchableOpacity>

        {/* MEDIA */}

        <TouchableOpacity
          style={[
            styles.card,
            {
              width: wp(42),
              height: hp(13),
              borderRadius: wp(3),

              shadowColor: colors.black,
              shadowOpacity: 0.06,
              shadowOffset: { width: 0, height: 8 },
              shadowRadius: 2,
              elevation: 1.5,
            },
          ]}
          onPress={openMedia}
        >
          <YStack alignItems="center" gap={hp(1)} paddingHorizontal={hp(5)}>
            <Image
              source={require("@/assets/images/imageIcon.png")}
              style={{
                width: wp(7),
                height: wp(7),
                resizeMode: "contain",
              }}
            />
            <Text
              fontSize={fs(14)}
              fontFamily={"$body"}
              fontWeight={"400"}
              textAlign="center"
            >
              Upload a video/ Image
            </Text>
          </YStack>
        </TouchableOpacity>

        {/* BIBLE */}

        <TouchableOpacity
          style={[
            styles.card,
            {
              width: wp(42),
              height: hp(13),
              borderRadius: wp(3),

              shadowColor: colors.black,
              shadowOpacity: 0.06,
              shadowOffset: { width: 0, height: 8 },
              shadowRadius: 2,
              elevation: 1.5, 
            },
          ]}
          onPress={openText}
        >
          <YStack alignItems="center" gap={hp(1)} paddingHorizontal={hp(3)}>
            <Image
              source={require("@/assets/images/bibleIcon.png")}
              style={{
                width: wp(7),
                height: wp(7),
                resizeMode: "contain",
              }}
            />
            <Text
              fontSize={fs(14)}
              fontFamily={"$body"}
              fontWeight={"400"}
              textAlign="center"
            >
              Share a Bible verse
            </Text>
          </YStack>
        </TouchableOpacity>
      </XStack>
    </YStack>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FAF9FA",
    justifyContent: "center",
    alignItems: "center",
  },
});
