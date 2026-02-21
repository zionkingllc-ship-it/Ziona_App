export type PostType = "image" | "video" | "carousel" | "text";

export type CategoryId =
  | "all"
  | "love"
  | "trust"
  | "worship"
  | "patience"
  | "prayer";

export interface BasePost {
  id: string;
  type: PostType;
  createdAt: string;

  liked: boolean;
  likesCount: number;

  // ✅ FIXED
  bookmarked: boolean;
  bookmarks: number;

  author: {
    id: string;
    name: string;
    avatarUrl?: string | number; // allow require()
  };

  caption?: string;
}

/* IMAGE */

export interface ImagePost extends BasePost {
  type: "image";
  media: {
    url: string;
  };
}

/* VIDEO */

export interface VideoPost extends BasePost {
  type: "video";
  media: {
    videoUrl: string | number;
    thumbnailUrl?: string;
  };
}

/* CAROUSEL */

export interface CarouselPost extends BasePost {
  type: "carousel";
  media: {
    items: {
      id: string;
      type: "image" | "video";
      url: string;
      thumbnailUrl?: string;
    }[];
  };
}

/* TEXT */

export interface TextPost extends BasePost {
  type: "text";
  media: {
    backgroundImage: string | number;
    thumbnailUrl: string;
  };
  text: string;
}

export type Post =
  | ImagePost
  | VideoPost
  | CarouselPost
  | TextPost;