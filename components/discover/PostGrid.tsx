import PostThumbnail from "./PostThumbnail";
import { Post } from "@/types/post";
import { FlatList, useWindowDimensions } from "react-native";

type Props = {
  posts: Post[];
  onPress: (post: Post) => void;
};

export default function PostGrid({ posts, onPress }: Props) {
  const { width } = useWindowDimensions();

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id}
      numColumns={3}
      contentContainerStyle={{ paddingHorizontal: 8 }}
      renderItem={({ item }) => (
        <PostThumbnail
          post={item}
          size={width / 3 - 9}
          onPress={() => onPress(item)}
        />
      )}
    />
  );
}