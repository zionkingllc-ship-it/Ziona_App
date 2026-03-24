import { graphqlRequest } from "@/services/graphQL/graphqlClient";
import { useAuthStore } from "@/store/useAuthStore";

const CREATE_MEDIA_POST_MUTATION = `
mutation CreateMediaPost(
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

export async function createMediaPost(variables: {
  postType: "MEDIA";
  mediaType: string;
  caption?: string | null;
  category: string;
  mediaUrls: string[];
}) {
  console.log("━━━━━━━━ CREATE MEDIA POST START ━━━━━━━━");
  console.log("Final GraphQL variables:", variables);

  const token = useAuthStore.getState().tokens?.accessToken;

  const data = await graphqlRequest(
    CREATE_MEDIA_POST_MUTATION,
    variables,
    token
  );

  console.log("CreateMediaPost response:", data);

  if (!data?.createPost?.success) {
    console.error("❌ Backend rejection:", data);
    throw new Error("Media post creation failed");
  }

  return data.createPost;
}