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
  const { wp, hp } = useResponsive();

  /* ================= SAFE DATA ================= */

  const category: Category | undefined = post.category;

  let scriptureText: string | undefined;
  let translation: string | undefined;
  let verseText: string | undefined;
  let testimonyText: string | undefined;

  /* ================= SCRIPTURE ================= */

  if (post.scripture) {
    const s = post.scripture;
    scriptureText = `${s.book} ${s.chapter}:${s.verseStart}${s.verseEnd ? `-${s.verseEnd}` : ""}`
    translation = s.translation;
    verseText = s.text;
  }

  /* ================= TEXT ================= */

  if (post.type === "text") {
    testimonyText = post.message;
  }

  /* ================= RENDER ================= */

  return (
    <YStack
      flex={1}
      justifyContent="center"
      alignItems="center"
      paddingHorizontal={wp(6)}
      paddingVertical={hp(16)}
    >
      <TextPostCardOutput
        category={category}
        scripture={scriptureText}
        translation={translation}
        verseText={verseText}
        testimonyText={testimonyText}
      />
    </YStack>
  );
}