export type FeedPost =
  | FeedTextPost
  | FeedMediaPost
  | FeedBiblePost;

/* =========================
   SHARED
========================= */

type BaseFeedPost = {
  id: string;
  createdAt: string;

  author: {
    id: string;
    username: string;
    avatarUrl?: string;
  };

  category?: {
    id: string;
    label: string;
    slug: string;
  };

  stats: {
    likesCount: number;
    commentsCount: number;
    sharesCount: number;
    savesCount: number;
  };

  viewerState: {
    liked: boolean;
    saved: boolean;
    followingAuthor: boolean;
    isOwner: boolean;
  };
};

/* =========================
   TEXT
========================= */

export type FeedTextPost = BaseFeedPost & {
  type: "text";
  caption: string;
};

/* =========================
   MEDIA
========================= */

export type FeedMediaPost = BaseFeedPost & {
  type: "media";
  caption?: string;

  mediaType: "image" | "video";

  media:
    | {
        type: "image";
        url: string;
        thumbnailUrl?: string;
      }[]
    | {
        type: "video";
        url: string;
        thumbnailUrl?: string;
      }[];
};

/* =========================
   BIBLE
========================= */

export type FeedBiblePost = BaseFeedPost & {
  type: "bible";
  caption: string;

  scripture: {
    book: string;
    chapter: number;
    verseStart: number;
    verseEnd?: number;
    translation: string;
  };
};