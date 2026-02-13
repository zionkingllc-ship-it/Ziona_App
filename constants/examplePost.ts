import { Post } from "@/types";


export const MOCK_POSTS: Post[] = [
  {
    id: "1",
    type: "video",
    author: {
      id: "user-1",
      name: "Ziona",
      avatarUrl: require("@/assets/images/profile.png"),
    },
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

    author: {
      id: "user-1",
      name: "Ziona",
      avatarUrl: require("@/assets/images/profile.png"),
    },
    media: {
      type: "video",
      url: "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/vertical-videos/2.mp4",
    },
    caption: "Faith grows when you trust God completely.",
    liked: false,
    likesCount: 120,
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    type: "video",

    author: {
      id: "user-1",
      name: "Ziona",
      avatarUrl: require("@/assets/images/profile.png"),
    },
    media: {
      type: "video",
      url: require("@/assets/videos/sample.mp4"),
    },
    caption: "Faith grows when you trust God completely.",
    liked: false,
    likesCount: 120,
    createdAt: new Date().toISOString(),
  },
];
export const unreadCount = 3; // later from API
