import { graphqlRequest } from "@/services/graphQL/graphqlClient";

export const GET_DISCOVER_CATEGORIES = `
  query GetDiscoverCategories {
    discoverCategories {
      id
      label
      slug
      icon
      bgColor
      bdColor
      order
    }
  }
`;

export const GET_FOR_YOU_FEED = `
  query GetForYouFeed($cursor: String, $limit: Int = 20) {
    forYouFeed(cursor: $cursor, limit: $limit) {
      posts {
        id
        type
        caption
        createdAt
        category {
          id
          label
          slug
        }
        image {
          items {
            url
            thumbnailUrl
          }
        }
        video {
          url
          thumbnailUrl
        }
        text {
          message
        }
      }
    }
  }
`;

export async function fetchDiscoverCategories(token?: string) {
  const res = await graphqlRequest(GET_DISCOVER_CATEGORIES, {}, token);
  return res?.discoverCategories ?? [];
}

export async function fetchDiscoverFeed(token?: string) {
  const res = await graphqlRequest(GET_FOR_YOU_FEED, {}, token);
  return res?.forYouFeed?.posts ?? [];
}