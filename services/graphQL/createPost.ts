import { graphqlRequest } from "@/services/graphQL/graphqlClient";
import { useAuthStore } from "@/store/useAuthStore";

const CREATE_POST_MUTATION = `
mutation CreatePost(
  $postType: PostType!
  $mediaType: MediaType
  $caption: String
  $category: String
  $mediaUrls: [String!]
) {
  createPost(
    postType: $postType
    mediaType: $mediaType
    caption: $caption
    category: $category
    mediaUrls: $mediaUrls
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

export async function createPost(variables: {
  postType: "MEDIA" | "TEXT" | "BIBLE";
  mediaType?: string | null;
  caption?: string | null;
  category: string;
  mediaUrls?: string[] | null;
}) {
  console.log("━━━━━━━━ CREATE POST START ━━━━━━━━");
  console.log("Final GraphQL variables:", variables);

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