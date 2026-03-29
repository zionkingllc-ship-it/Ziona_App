import { FeedTextPost, FeedBiblePost } from "@/types/feedTypes";
import React from "react";
import { YStack } from "tamagui";

import TextPostCardOutput from "./TextPostCardOutput";
import { Category } from "@/types/category";
import { useResponsive } from "@/hooks/useResponsive";

type Props = {
  post: FeedTextPost | FeedBiblePost;
};

export default function TextPostCard({ post }: Props) {
  const isBible = post.type === "bible";
  const { wp, hp, fs } = useResponsive();
  console.log("caption",  post.caption) 
   console.log("message",  post.message) 
    console.log("caption",  post.caption) 
     console.log("caption",  post.caption) 
      console.log("caption",  post.caption) 

  return (
    <YStack
      flex={1}
      justifyContent="center"
      alignItems="center"
      paddingHorizontal={wp(6)}
      paddingVertical={hp(16)}
    >
      <TextPostCardOutput
        category={post.category as Category}
        scripture={
          isBible
            ? `${post.scripture.book} ${post.scripture.chapter}:${post.scripture.verseStart}${
                post.scripture.verseEnd
                  ? `-${post.scripture.verseEnd}`
                  : ""
              }`
            : undefined
        }
        translation={isBible ? post.scripture.translation : undefined}
        verseText={isBible ? post.scripture.text : undefined}
        testimonyText={post.type === "text" ? post.message : undefined} 
      />
    </YStack>
  );
}