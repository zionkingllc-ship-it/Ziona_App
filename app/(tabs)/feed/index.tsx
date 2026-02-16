import {PostCard}from "@/components/post/PostCard";
import TwoButtonSwitch from "@/components/ui/twoButtonSwitch";
import colors from "@/constants/colors";
import { MOCK_POSTS, unreadCount } from "@/constants/examplePost";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Bell } from "@tamagui/lucide-icons";
import { useCallback, useRef, useState } from "react";
import {
  FlatList,
  ViewToken,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image, Text, XStack, YStack } from "tamagui";

export default function Feed() {
  const { height } = useWindowDimensions();
  const tabBarHeight = useBottomTabBarHeight();
  const feedHeight = height - tabBarHeight;

  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [feedType, setFeedType] = useState<"forYou" | "following">(
    "forYou"
  );

  /* ================= VIEWABILITY ================= */

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 80,
  }).current;

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        setActivePostId(viewableItems[0].item.id);
      }
    }
  ).current;

  /* ================= RENDER ITEM ================= */

const renderItem = useCallback(
  ({ item }:any) => (
    <PostCard
      post={item}
      isPlaying={item.id === activePostId}
      screenHeight={feedHeight}
    />
  ),
  [activePostId, feedHeight]
);

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
      {/* HEADER */}
      <XStack
        position="absolute"
        top={50}
        left={6}
        right={0}
        padding="$3"
        alignItems="center"
        justifyContent="space-between"
        zIndex={10}
      >
        <Image source={require("@/assets/images/logowhite.png")} />

        <TwoButtonSwitch
          value={feedType}
          onChange={setFeedType}
          width="65%"
        />

        <XStack
          width={40}
          height={40}
          borderRadius={20}
          alignItems="center"
          justifyContent="center"
          backgroundColor="rgba(255,255,255,0.12)"
          pressStyle={{ scale: 0.95, opacity: 0.8 }}
        >
          <Bell size={24} color={colors.white} />

          {unreadCount > 0 && (
            <YStack
              position="absolute"
              top={6}
              right={6}
              minWidth={8}
              height={8}
              borderRadius={999}
              backgroundColor="#FF3B30"
              alignItems="center"
              justifyContent="center"
              paddingHorizontal={unreadCount > 9 ? 4 : 0}
            >
              {unreadCount > 9 && (
                <Text
                  fontSize={10}
                  color="white"
                  fontWeight="700"
                >
                  9+
                </Text>
              )}
            </YStack>
          )}
        </XStack>
      </XStack>

      {/* FEED */}
      <FlatList
        data={MOCK_POSTS}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        pagingEnabled
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        snapToInterval={feedHeight}
        snapToAlignment="start"
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={onViewableItemsChanged}
        getItemLayout={(_, index) => ({
          length: feedHeight,
          offset: feedHeight * index,
          index,
        })}
        windowSize={3}
        initialNumToRender={2}
        maxToRenderPerBatch={2}
        removeClippedSubviews
      />
    </SafeAreaView>
  );
}