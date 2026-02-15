import { Pressable, TouchableOpacity } from "react-native";
import { Image, Text, XStack, YStack } from "tamagui";
import colors from "@/constants/colors";

type Props = {
  post: any;
  liked: boolean;
  setLiked: (v: boolean) => void;
  onComment: () => void;
  onBookmark: () => void;
  onReport: () => void;
};

const likeIcon = require("@/assets/images/likeIcon.png");
const likeIconActive = require("@/assets/images/likeIcon2.png");
const commentIcon = require("@/assets/images/commentIcon.png");
const bookmarkIcon = require("@/assets/images/bookmarkIcon.png");
const shareIcon = require("@/assets/images/shareIcon.png");
const flagIcon = require("@/assets/images/flagIcon.png");

export default function PostOverlay({
  post,
  liked,
  setLiked,
  onComment,
  onBookmark,
  onReport,
}: Props) {
  return (
    <YStack position="absolute" bottom={34} width="100%">
      <XStack padding="$4" alignItems="flex-end">
        <YStack flex={1} gap="$2">
          <XStack gap={"$4"} alignItems="center">
            <XStack gap={"$2"} alignItems="center">
              <Image
                source={require("@/assets/images/profile.png")}
                width={30}
                height={30}
              />
              <Text color={colors.white} fontSize={16} fontWeight={"500"}>
                {post.author.name}
              </Text>
            </XStack>

            <TouchableOpacity
              style={{
                borderWidth: 1,
                borderColor: colors.white,
                height: 22,
                borderRadius: 8,
                paddingHorizontal: 6,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text color={colors.white} fontSize={13} fontWeight={"500"}>
                following
              </Text>
            </TouchableOpacity>
          </XStack>

          {post.caption && (
            <Text color={colors.white} fontSize={16} fontWeight={"400"}>
              {post.caption}
            </Text>
          )}
        </YStack>

        <YStack gap="$4" alignItems="center">
          <Pressable onPress={() => setLiked(!liked)}>
            <Image
              source={liked ? likeIconActive : likeIcon}
              width={24}
              height={24}
            />
          </Pressable>

          <Pressable onPress={onComment}>
            <Image source={commentIcon} width={24} height={24} />
          </Pressable>

          <Pressable onPress={onBookmark}>
            <Image source={bookmarkIcon} width={24} height={24} />
          </Pressable>

          <Pressable>
            <Image source={shareIcon} width={24} height={24} />
          </Pressable>

          <Pressable onPress={onReport}>
            <Image source={flagIcon} width={24} height={24} />
          </Pressable>
        </YStack>
      </XStack>
    </YStack>
  );
}