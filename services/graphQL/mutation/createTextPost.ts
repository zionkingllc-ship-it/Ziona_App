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
      postType
      caption
    }
  }
}
`;

export async function createTextPost(variables: any) {
  console.log("━━━━━━━━ CREATE POST START ━━━━━━━━");
  console.log("Variables:", variables);

  const token = useAuthStore.getState().tokens?.accessToken;

  const data = await graphqlRequest(
    CREATE_POST_MUTATION,
    variables,
    token
  );

  console.log("CreatePost response:", data);

  if (!data?.createPost?.success) {
    console.error("❌ Backend rejection:", data);
    throw new Error("Post creation failed");
  }

  return data.createPost;
}