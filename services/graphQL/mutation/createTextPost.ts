import { graphqlRequest } from "@/services/graphQL/graphqlClient";
import { useAuthStore } from "@/store/useAuthStore";

const CREATE_POST_MUTATION = `
mutation CreatePost(
  $postType: PostType!
  $caption: String
  $category: String

  $scriptureBook: String
  $scriptureChapter: Int
  $scriptureVerseStart: Int
  $scriptureVerseEnd: Int
  $scriptureTranslation: String
) {
  createPost(
    postType: $postType
    caption: $caption
    category: $category

    scriptureBook: $scriptureBook
    scriptureChapter: $scriptureChapter
    scriptureVerseStart: $scriptureVerseStart
    scriptureVerseEnd: $scriptureVerseEnd
    scriptureTranslation: $scriptureTranslation
  ) {
    success
    post {
      id
      type
      text     
    }
    error {
      code
      message
    }
  }
}
`;

export async function createTextPost(variables: {
  postType: "TEXT" | "BIBLE";

  message?: string;
  caption?: string;

  category: string;

  scriptureBook?: string;
  scriptureChapter?: number;
  scriptureVerseStart?: number;
  scriptureVerseEnd?: number;
  scriptureTranslation?: string;
}) {
  console.log("━━━━━━━ CREATE POST START ━━━━━━━━");

  const payload = {
    ...variables,
    caption: variables.message ?? variables.caption,
  };

  console.log("Final payload:", payload);

  const token = useAuthStore.getState().tokens?.accessToken;

  const data = await graphqlRequest(
    CREATE_POST_MUTATION,
    payload,
    token
  );

  console.log("CreatePost response:", data);

  if (!data?.createPost?.success) {
    console.error("Backend rejection:", data);
    throw new Error("Post creation failed");
  }

  const post = data.createPost.post;

  return {
    ...data.createPost,
    post: {
      ...post,
      caption: post.text ?? "", // unify for feed
    },
  };
}