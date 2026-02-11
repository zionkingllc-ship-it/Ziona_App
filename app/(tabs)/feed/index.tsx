import { FlatList, ViewToken } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRef, useState } from "react";
import { PostCard } from "@/components/post/PostCard";
import { Post } from "@/types/post";

const MOCK_POSTS: Post[] = [
  {
    id: "1",
    type: "video",
    author: { id: "user-1", name: "Ziona" },
    media: {
      type: "video",
      url: "https://www.w3schools.com/html/mov_bbb.mp4",
    },
    caption: "If you are willing to pray, there is always a God to answer",
    liked: false,
    likesCount: 432,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    type: "video",
    author: { id: "user-1", name: "Ziona" },
    media: {
      type: "video",
      url: "https://www.w3schools.com/html/mov_bbb.mp4",
    },
    caption: "Faith grows when you trust God completely.",
    liked: false,
    likesCount: 120,
    createdAt: new Date().toISOString(),
  },
];

export default function Feed() {
  const [activePostId, setActivePostId] = useState<string | null>(null);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        setActivePostId(viewableItems[0].item.id);
      }
    }
  ).current;

  return (
    <SafeAreaView style={{ flex: 1,  alignItems:"center" }}>
      <FlatList
        data={MOCK_POSTS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            isActive={item.id === activePostId}
          />
        )}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 80 }}
      />
    </SafeAreaView>
  );
} 