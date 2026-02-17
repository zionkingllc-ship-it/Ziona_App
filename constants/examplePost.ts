import { Post } from "@/types/post";

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
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      thumbnailUrl: "https://picsum.photos/800/1200?random=10",
    },
    caption: `If you are willing to pray, there is always a God to answer If you are willing to pray, there is always a God to answerIf you are willing to pray, there is always a God to answerIf you are willing to pray, there is always a God to answer`,
    liked: false,
    likesCount: 432,
    createdAt: new Date().toISOString(),
  },

  {
    id: "2",
    type: "text",
    author: {
      id: "user-2",
      name: "Elijah",
      avatarUrl: require("@/assets/images/profile.png"),
    },
    text: "Sometimes God calms the storm. Sometimes He lets the storm rage and calms His child.",
    media: {
      backgroundImage: require("@/assets/images/textPostBackground1.png"),
    },
    caption: `Daily reflection Sometimes God calms the storm. Sometimes God calms the storm. Sometimes He lets the storm rage and calms His childSometimes He lets the storm rage and calms His childSometimes God calms the storm. Sometimes He lets the storm rage and calms His child`,
    liked: false,
    likesCount: 87,
    createdAt: new Date().toISOString(),
  },

  {
    id: "3",
    type: "carousel",
    author: {
      id: "user-3",
      name: "Miriam",
      avatarUrl: require("@/assets/images/profile.png"),
    },
    media: {
      items: [
        {
          id: "c1",
          type: "image",
          url: "https://picsum.photos/800/1200?random=1",
        },
        {
          id: "c2",
          type: "image",
          url: "https://picsum.photos/800/1200?random=2",
        },
        {
          id: "c3",
          type: "image",
          url: "https://picsum.photos/800/1200?random=3",
        },
      ],
    },
    caption: "Swipe to see more moments ✨",
    liked: false,
    likesCount: 214,
    createdAt: new Date().toISOString(),
  },

  {
    id: "4",
    type: "video",
    author: {
      id: "user-4",
      name: "Daniel",
      avatarUrl: require("@/assets/images/profile.png"),
    },
    media: {
      videoUrl:
        "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/vertical-videos/2.mp4",
      thumbnailUrl: require("@/assets/images/profile.png"),
    },
    caption: "Faith grows when you trust God completely.",
    liked: false,
    likesCount: 120,
    createdAt: new Date().toISOString(),
  },

  {
    id: "5",
    type: "video",
    author: {
      id: "user-4",
      name: "Daniel",
      avatarUrl: require("@/assets/images/profile.png"),
    },
    media: {
      videoUrl: require("@/assets/videos/sample.mp4"),
      thumbnailUrl: require("@/assets/images/profile.png"),
    },
    caption: "Faith grows when you trust God completely.",
    liked: false,
    likesCount: 120,
    createdAt: new Date().toISOString(),
  },
];

export const unreadCount = 3;
